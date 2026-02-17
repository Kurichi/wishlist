import { app } from "./api.js";
import { renderAuthorizePage } from "./authorize.js";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, mcp-session-id, mcp-protocol-version",
  "Access-Control-Expose-Headers": "mcp-session-id",
  "Access-Control-Max-Age": "86400",
};

const ALLOWED_REDIRECT_HOSTS = [
  "claude.ai",
  "claude.com",
  "localhost",
  "127.0.0.1",
];

function isAllowedRedirectUri(uri: string): boolean {
  try {
    const url = new URL(uri);
    const host = url.hostname;
    if (!ALLOWED_REDIRECT_HOSTS.includes(host)) return false;
    // Enforce http(s) for all hosts (blocks javascript:, ftp:, etc.)
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    // Non-localhost must use HTTPS
    if (host !== "localhost" && host !== "127.0.0.1" && url.protocol !== "https:")
      return false;
    return true;
  } catch {
    return false;
  }
}

export const defaultHandler = {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS preflight for /mcp
    if (
      (pathname === "/mcp" || pathname === "/mcp/") &&
      request.method === "OPTIONS"
    ) {
      return new Response(null, { headers: corsHeaders });
    }

    // GET /authorize — render authorization page
    if (pathname === "/authorize" && request.method === "GET") {
      let oauthReqInfo: OAuthRequestInfo;
      try {
        oauthReqInfo = await env.OAUTH_PROVIDER.parseAuthRequest(request);
      } catch (e) {
        return new Response(
          `Invalid authorization request: ${e instanceof Error ? e.message : String(e)}`,
          { status: 400 },
        );
      }
      const clientInfo = await env.OAUTH_PROVIDER.lookupClient(
        oauthReqInfo.clientId,
      );
      if (!clientInfo) {
        return new Response("Unknown client", { status: 400 });
      }
      return renderAuthorizePage(clientInfo, oauthReqInfo);
    }

    // POST /authorize — handle approval/denial
    // Security: /authorize is protected by Cloudflare Access (owner-only policy).
    // See deployment notes for Access rule configuration.
    if (pathname === "/authorize" && request.method === "POST") {
      const formData = await request.formData();
      const action = formData.get("action") as string;
      const oauthReqInfoRaw = formData.get("oauthReqInfo") as string;

      if (!oauthReqInfoRaw) {
        return new Response("Missing OAuth request info", { status: 400 });
      }

      let oauthReqInfo: OAuthRequestInfo;
      try {
        oauthReqInfo = JSON.parse(
          decodeURIComponent(atob(oauthReqInfoRaw)),
        ) as OAuthRequestInfo;
      } catch {
        return new Response("Invalid OAuth request info", { status: 400 });
      }

      // Validate redirect_uri for both approve and deny to prevent open redirect
      if (!isAllowedRedirectUri(oauthReqInfo.redirectUri)) {
        return new Response("Redirect URI not allowed", { status: 400 });
      }

      // Prevent implicit flow bypass via hidden field tampering
      if (oauthReqInfo.responseType !== "code") {
        return new Response("Invalid response type", { status: 400 });
      }

      // Verify the client exists (prevent invented clientIds from tampered input)
      const clientInfo = await env.OAUTH_PROVIDER.lookupClient(
        oauthReqInfo.clientId,
      );
      if (!clientInfo) {
        return new Response("Unknown client", { status: 400 });
      }

      // Verify redirect_uri matches client's registered URIs (prevents redirect to arbitrary paths on allowed hosts)
      if (!clientInfo.redirectUris?.includes(oauthReqInfo.redirectUri)) {
        return new Response("Redirect URI not registered for client", { status: 400 });
      }

      if (action !== "approve") {
        const redirectUrl = new URL(oauthReqInfo.redirectUri);
        redirectUrl.searchParams.set("error", "access_denied");
        if (oauthReqInfo.state) {
          redirectUrl.searchParams.set("state", oauthReqInfo.state);
        }
        return Response.redirect(redirectUrl.toString(), 302);
      }

      const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
        request: oauthReqInfo,
        userId: "owner",
        metadata: { label: "oauth-grant" },
        scope: oauthReqInfo.scope?.length ? oauthReqInfo.scope : ["wishlist"],
        props: { userId: "owner" },
      });

      return Response.redirect(redirectTo, 302);
    }

    // Delegate everything else to Hono
    return app.fetch(request, env, ctx);
  },
};
