import { WorkerEntrypoint } from "cloudflare:workers";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMcpServer } from "./mcp.js";

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

export class McpHandler extends WorkerEntrypoint<Env> {
  override async fetch(request: Request): Promise<Response> {
    // CORS preflight (OPTIONS may arrive here depending on OAuthProvider routing)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return withCors(
        new Response("Method Not Allowed", {
          status: 405,
          headers: { Allow: "POST" },
        }),
      );
    }

    const transport = new WebStandardStreamableHTTPServerTransport();
    const server = createMcpServer(this.env);
    await server.connect(transport);
    return withCors(await transport.handleRequest(request));
  }
}
