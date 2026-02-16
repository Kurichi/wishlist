import { WorkerEntrypoint } from 'cloudflare:workers';
import { ProxyToSelf } from 'workers-mcp';
import { app } from './api.js';
import {
  createDb,
  WishlistRepository,
  createItemSchema,
  updateItemSchema,
} from '@wishlist/core';
import type {
  Timeframe,
  Category,
  Status,
  Priority,
} from '@wishlist/core';

interface Env {
  DB: D1Database;
  SHARED_SECRET: string;
}

export default class WishlistWorker extends WorkerEntrypoint<Env> {
  /**
   * List and filter wishlist items. Returns all items matching the given filters.
   *
   * @param timeframe {string} Filter by timeframe: "short-term", "medium-term", or "long-term"
   * @param category {string} Filter by category: "gadgets", "experiences", "skills", "lifestyle", or "other"
   * @param status {string} Filter by status: "unstarted", "considering", or "purchased"
   * @param priority {string} Filter by priority: "high", "medium", or "low"
   * @param sort {string} Sort field: "name", "createdAt", "updatedAt", "budget", or "priority"
   * @param order {string} Sort order: "asc" or "desc"
   * @return {string} JSON string of matching wishlist items
   */
  async list_wishlist_items(
    timeframe?: string,
    category?: string,
    status?: string,
    priority?: string,
    sort?: string,
    order?: string,
  ): Promise<string> {
    const db = createDb(this.env.DB);
    const repo = new WishlistRepository(db);

    const items = await repo.list({
      timeframe: timeframe as Timeframe | undefined,
      category: category as Category | undefined,
      status: status as Status | undefined,
      priority: priority as Priority | undefined,
      sort: sort as 'name' | 'createdAt' | 'updatedAt' | 'budget' | 'priority' | undefined,
      order: order as 'asc' | 'desc' | undefined,
    });

    return JSON.stringify(items, null, 2);
  }

  /**
   * Get a single wishlist item by its ID.
   *
   * @param id {string} The unique ID of the wishlist item
   * @return {string} JSON string of the wishlist item, or an error message if not found
   */
  async get_wishlist_item(id: string): Promise<string> {
    const db = createDb(this.env.DB);
    const repo = new WishlistRepository(db);

    const item = await repo.getById(id);
    if (!item) {
      return JSON.stringify({ error: `Item with id '${id}' not found` });
    }

    return JSON.stringify(item, null, 2);
  }

  /**
   * Add a new item to the wishlist.
   *
   * @param name {string} Name of the item (1-200 characters)
   * @param timeframe {string} Timeframe: "short-term", "medium-term", or "long-term"
   * @param category {string} Category: "gadgets", "experiences", "skills", "lifestyle", or "other"
   * @param priority {string} Priority: "high", "medium", or "low"
   * @param budget {number} Optional budget amount
   * @param memo {string} Optional memo (max 2000 characters)
   * @param status {string} Optional status: "unstarted", "considering", or "purchased" (defaults to "unstarted")
   * @return {string} JSON string of the created wishlist item
   */
  async add_wishlist_item(
    name: string,
    timeframe: string,
    category: string,
    priority: string,
    budget?: number,
    memo?: string,
    status?: string,
  ): Promise<string> {
    const db = createDb(this.env.DB);
    const repo = new WishlistRepository(db);

    const parsed = createItemSchema.parse({
      name,
      timeframe,
      category,
      priority,
      budget: budget ?? null,
      memo: memo ?? null,
      status: status ?? undefined,
    });

    const item = await repo.create(parsed);
    return JSON.stringify(item, null, 2);
  }

  /**
   * Update an existing wishlist item. Only provided fields will be updated.
   *
   * @param id {string} The unique ID of the wishlist item to update
   * @param name {string} Updated name (1-200 characters)
   * @param timeframe {string} Updated timeframe: "short-term", "medium-term", or "long-term"
   * @param category {string} Updated category: "gadgets", "experiences", "skills", "lifestyle", or "other"
   * @param priority {string} Updated priority: "high", "medium", or "low"
   * @param budget {number} Updated budget amount
   * @param memo {string} Updated memo (max 2000 characters)
   * @param status {string} Updated status: "unstarted", "considering", or "purchased"
   * @return {string} JSON string of the updated wishlist item
   */
  async update_wishlist_item(
    id: string,
    name?: string,
    timeframe?: string,
    category?: string,
    priority?: string,
    budget?: number,
    memo?: string,
    status?: string,
  ): Promise<string> {
    const db = createDb(this.env.DB);
    const repo = new WishlistRepository(db);

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (timeframe !== undefined) updateData.timeframe = timeframe;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (budget !== undefined) updateData.budget = budget;
    if (memo !== undefined) updateData.memo = memo;
    if (status !== undefined) updateData.status = status;

    const parsed = updateItemSchema.parse(updateData);
    const item = await repo.update(id, parsed);
    return JSON.stringify(item, null, 2);
  }

  /**
   * Delete a wishlist item by its ID.
   *
   * @param id {string} The unique ID of the wishlist item to delete
   * @return {string} Confirmation message
   */
  async delete_wishlist_item(id: string): Promise<string> {
    const db = createDb(this.env.DB);
    const repo = new WishlistRepository(db);

    await repo.delete(id);
    return JSON.stringify({ success: true, message: `Item '${id}' deleted` });
  }

  /**
   * Get summary statistics of the wishlist including total items, budget, and breakdowns by timeframe, category, status, and priority.
   *
   * @return {string} JSON string of wishlist summary statistics
   */
  async summarize_wishlist(): Promise<string> {
    const db = createDb(this.env.DB);
    const repo = new WishlistRepository(db);

    const summary = await repo.summarize();
    return JSON.stringify(summary, null, 2);
  }

  /** @ignore */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // MCP: /rpc は ProxyToSelf で処理 (SHARED_SECRET で認証)
    if (url.pathname === '/rpc') {
      return new ProxyToSelf(this).fetch(request);
    }

    // API + Health: Hono で処理
    return app.fetch(request, this.env, this.ctx);
  }
}
