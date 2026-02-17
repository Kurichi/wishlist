import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createDb,
  WishlistRepository,
  createItemSchema,
  updateItemSchema,
} from "@wishlist/core";

export function createMcpServer(env: { DB: D1Database }) {
  const server = new McpServer({
    name: "wishlist",
    version: "1.0.0",
  });

  function getRepo() {
    const db = createDb(env.DB);
    return new WishlistRepository(db);
  }

  server.tool(
    "list_wishlist_items",
    "List and filter wishlist items. Returns all items matching the given filters.",
    {
      timeframe: z
        .enum(["short-term", "medium-term", "long-term"])
        .optional(),
      category: z
        .enum(["gadgets", "experiences", "skills", "lifestyle", "other"])
        .optional(),
      status: z
        .enum(["unstarted", "considering", "purchased"])
        .optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
      desireType: z
        .enum(["specific-product", "general-image", "problem-to-solve"])
        .optional(),
      sort: z
        .enum(["name", "createdAt", "updatedAt", "budget", "priority"])
        .optional(),
      order: z.enum(["asc", "desc"]).optional(),
    },
    async ({ timeframe, category, status, priority, desireType, sort, order }) => {
      const repo = getRepo();
      const items = await repo.list({
        timeframe,
        category,
        status,
        priority,
        desireType,
        sort,
        order,
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }],
      };
    },
  );

  server.tool(
    "get_wishlist_item",
    "Get a single wishlist item by its ID.",
    {
      id: z.string().describe("The unique ID of the wishlist item"),
    },
    async ({ id }) => {
      const repo = getRepo();
      const item = await repo.getById(id);
      if (!item) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: `Item with id '${id}' not found` }),
            },
          ],
          isError: true,
        };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify(item, null, 2) }],
      };
    },
  );

  server.tool(
    "add_wishlist_item",
    "Add a new item to the wishlist.",
    {
      name: z.string().min(1).max(200).describe("Name of the item"),
      timeframe: z
        .enum(["short-term", "medium-term", "long-term"])
        .describe("Timeframe for the item"),
      category: z
        .enum(["gadgets", "experiences", "skills", "lifestyle", "other"])
        .describe("Category of the item"),
      priority: z
        .enum(["high", "medium", "low"])
        .describe("Priority level"),
      budget: z.number().int().nonnegative().nullable().optional().describe("Optional budget amount"),
      desireType: z
        .enum(["specific-product", "general-image", "problem-to-solve"])
        .optional()
        .describe("ほしさの方向: specific-product(具体的な商品), general-image(イメージ), problem-to-solve(課題)"),
      memo: z.string().max(10000).nullable().optional().describe("Optional memo (supports Markdown)"),
      status: z
        .enum(["unstarted", "considering", "purchased"])
        .optional()
        .describe("Status (defaults to unstarted)"),
    },
    async ({ name, timeframe, category, priority, budget, desireType, memo, status }) => {
      try {
        const repo = getRepo();
        const parsed = createItemSchema.parse({
          name,
          timeframe,
          category,
          priority,
          budget: budget ?? null,
          desireType: desireType ?? undefined,
          memo: memo ?? null,
          status: status ?? undefined,
        });
        const item = await repo.create(parsed);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(item, null, 2) }],
        };
      } catch (e) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: String(e) }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.tool(
    "update_wishlist_item",
    "Update an existing wishlist item. Only provided fields will be updated.",
    {
      id: z.string().describe("The unique ID of the wishlist item to update"),
      name: z.string().min(1).max(200).optional().describe("Updated name"),
      timeframe: z
        .enum(["short-term", "medium-term", "long-term"])
        .optional()
        .describe("Updated timeframe"),
      category: z
        .enum(["gadgets", "experiences", "skills", "lifestyle", "other"])
        .optional()
        .describe("Updated category"),
      priority: z
        .enum(["high", "medium", "low"])
        .optional()
        .describe("Updated priority"),
      budget: z.number().int().nonnegative().nullable().optional().describe("Updated budget (null to clear)"),
      desireType: z
        .enum(["specific-product", "general-image", "problem-to-solve"])
        .optional()
        .describe("Updated desire type"),
      memo: z.string().max(10000).nullable().optional().describe("Updated memo (supports Markdown, null to clear)"),
      status: z
        .enum(["unstarted", "considering", "purchased"])
        .optional()
        .describe("Updated status"),
    },
    async ({ id, name, timeframe, category, priority, budget, desireType, memo, status }) => {
      try {
        const repo = getRepo();
        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;
        if (timeframe !== undefined) updateData.timeframe = timeframe;
        if (category !== undefined) updateData.category = category;
        if (priority !== undefined) updateData.priority = priority;
        if (budget !== undefined) updateData.budget = budget;
        if (desireType !== undefined) updateData.desireType = desireType;
        if (memo !== undefined) updateData.memo = memo;
        if (status !== undefined) updateData.status = status;

        const parsed = updateItemSchema.parse(updateData);
        const item = await repo.update(id, parsed);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(item, null, 2) }],
        };
      } catch (e) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: String(e) }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.tool(
    "delete_wishlist_item",
    "Delete a wishlist item by its ID.",
    {
      id: z.string().describe("The unique ID of the wishlist item to delete"),
    },
    async ({ id }) => {
      try {
        const repo = getRepo();
        await repo.delete(id);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ success: true, message: `Item '${id}' deleted` }),
            },
          ],
        };
      } catch (e) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: String(e) }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.tool(
    "summarize_wishlist",
    "Get summary statistics of the wishlist including total items, budget, and breakdowns by timeframe, category, status, and priority.",
    {},
    async () => {
      const repo = getRepo();
      const summary = await repo.summarize();
      return {
        content: [{ type: "text" as const, text: JSON.stringify(summary, null, 2) }],
      };
    },
  );

  return server;
}
