import { OAuthProvider } from "@cloudflare/workers-oauth-provider";
import { McpHandler } from "./mcp-handler.js";
import { defaultHandler } from "./default-handler.js";

export default new OAuthProvider({
  apiRoute: ["/mcp", "/mcp/"],
  apiHandler: McpHandler,
  defaultHandler,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/token",
  clientRegistrationEndpoint: "/register",
  scopesSupported: ["wishlist"],
  accessTokenTTL: 3600,
  refreshTokenTTL: 2592000,
  allowImplicitFlow: false,
  disallowPublicClientRegistration: false,

  async resolveExternalToken({ token, env }) {
    const expected = (
      (env as Record<string, unknown>).API_TOKEN as string | undefined
    )?.trim();
    if (!expected || !token || token.length !== expected.length) return null;
    let diff = 0;
    for (let i = 0; i < token.length; i++)
      diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff !== 0) return null;
    return { props: { userId: "owner" } };
  },
});

export { McpHandler };
