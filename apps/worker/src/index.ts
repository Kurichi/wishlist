import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { app } from "./api.js";
import { createMcpServer } from "./mcp.js";

interface Env {
  DB: D1Database;
  API_TOKEN: string;
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, mcp-session-id, mcp-protocol-version",
  "Access-Control-Expose-Headers": "mcp-session-id",
  "Access-Control-Max-Age": "86400",
};

function withCors(response: Response): Response {
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

function parseBearerToken(header: string | null): string | null {
  if (!header) return null;
  const parts = header.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") return null;
  return parts[1];
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp" || url.pathname === "/mcp/") {
      // CORS preflight は認証前に通す
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
      }

      // API_TOKEN 未設定は fail-closed
      const expected = env.API_TOKEN?.trim();
      if (!expected) {
        return withCors(new Response("Server misconfigured", { status: 500 }));
      }

      // Bearer Token 検証
      const presented = parseBearerToken(request.headers.get("Authorization"));
      if (!presented || !timingSafeEqual(presented, expected)) {
        return withCors(
          new Response("Unauthorized", {
            status: 401,
            headers: { "WWW-Authenticate": 'Bearer realm="wishlist-mcp"' },
          }),
        );
      }

      if (request.method !== "POST") {
        return withCors(
          new Response("Method Not Allowed", { status: 405 }),
        );
      }

      const transport = new WebStandardStreamableHTTPServerTransport();
      const server = createMcpServer(env);
      await server.connect(transport);
      return withCors(await transport.handleRequest(request));
    }

    return app.fetch(request, env, ctx);
  },
};
