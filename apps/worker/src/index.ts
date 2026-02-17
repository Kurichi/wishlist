import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { app } from "./api.js";
import { createMcpServer } from "./mcp.js";

interface Env {
  DB: D1Database;
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, mcp-session-id, mcp-protocol-version",
  "Access-Control-Expose-Headers": "mcp-session-id",
  "Access-Control-Max-Age": "86400",
};

function withCors(response: Response): Response {
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
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
