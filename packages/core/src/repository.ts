import { eq, asc, desc, and, sql } from 'drizzle-orm';
import type { Database } from './db/index.js';
import { wishlistItems } from './db/schema.js';
import type { WishlistItem, Timeframe, Category, Status, Priority } from './types.js';
import { generateId } from './id.js';
import { NotFoundError } from './errors.js';
import type { z } from 'zod';
import type { createItemSchema, updateItemSchema } from './schema.js';

type CreateItemInput = z.infer<typeof createItemSchema>;
type UpdateItemInput = z.infer<typeof updateItemSchema>;

export interface ListFilters {
  timeframe?: Timeframe;
  category?: Category;
  status?: Status;
  priority?: Priority;
  sort?: 'name' | 'createdAt' | 'updatedAt' | 'budget' | 'priority';
  order?: 'asc' | 'desc';
}

interface SummaryResult {
  totalItems: number;
  totalBudget: number;
  byTimeframe: Record<string, { count: number; budget: number }>;
  byCategory: Record<string, { count: number; budget: number }>;
  byStatus: Record<string, { count: number; budget: number }>;
  byPriority: Record<string, { count: number; budget: number }>;
}

const sortColumnMap = {
  name: wishlistItems.name,
  createdAt: wishlistItems.createdAt,
  updatedAt: wishlistItems.updatedAt,
  budget: wishlistItems.budget,
  priority: wishlistItems.priority,
} as const;

export class WishlistRepository {
  constructor(private db: Database) {}

  async list(filters?: ListFilters): Promise<WishlistItem[]> {
    const conditions = [];

    if (filters?.timeframe) {
      conditions.push(eq(wishlistItems.timeframe, filters.timeframe));
    }
    if (filters?.category) {
      conditions.push(eq(wishlistItems.category, filters.category));
    }
    if (filters?.status) {
      conditions.push(eq(wishlistItems.status, filters.status));
    }
    if (filters?.priority) {
      conditions.push(eq(wishlistItems.priority, filters.priority));
    }

    const sortKey = filters?.sort ?? 'createdAt';
    const sortCol = sortColumnMap[sortKey as keyof typeof sortColumnMap] ?? sortColumnMap.createdAt;
    const orderFn = filters?.order === 'asc' ? asc : desc;

    const query = this.db
      .select()
      .from(wishlistItems)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderFn(sortCol));

    return query.all();
  }

  async getById(id: string): Promise<WishlistItem | null> {
    const results = await this.db
      .select()
      .from(wishlistItems)
      .where(eq(wishlistItems.id, id))
      .limit(1);

    return results[0] ?? null;
  }

  async create(data: CreateItemInput): Promise<WishlistItem> {
    const now = new Date().toISOString();
    const item: WishlistItem = {
      id: generateId(),
      name: data.name,
      timeframe: data.timeframe,
      category: data.category,
      budget: data.budget ?? null,
      priority: data.priority,
      status: data.status ?? 'unstarted',
      memo: data.memo ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.insert(wishlistItems).values(item);
    return item;
  }

  async update(id: string, data: UpdateItemInput): Promise<WishlistItem> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError(`Item with id '${id}' not found`);
    }

    const now = new Date().toISOString();
    await this.db
      .update(wishlistItems)
      .set({ ...data, updatedAt: now })
      .where(eq(wishlistItems.id, id));

    const updated = await this.getById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError(`Item with id '${id}' not found`);
    }

    await this.db.delete(wishlistItems).where(eq(wishlistItems.id, id));
  }

  async summarize(): Promise<SummaryResult> {
    const items = await this.db.select().from(wishlistItems).all();

    const result: SummaryResult = {
      totalItems: items.length,
      totalBudget: 0,
      byTimeframe: {},
      byCategory: {},
      byStatus: {},
      byPriority: {},
    };

    for (const item of items) {
      const budget = item.budget ?? 0;
      result.totalBudget += budget;

      // byTimeframe
      if (!result.byTimeframe[item.timeframe]) {
        result.byTimeframe[item.timeframe] = { count: 0, budget: 0 };
      }
      result.byTimeframe[item.timeframe].count++;
      result.byTimeframe[item.timeframe].budget += budget;

      // byCategory
      if (!result.byCategory[item.category]) {
        result.byCategory[item.category] = { count: 0, budget: 0 };
      }
      result.byCategory[item.category].count++;
      result.byCategory[item.category].budget += budget;

      // byStatus
      if (!result.byStatus[item.status]) {
        result.byStatus[item.status] = { count: 0, budget: 0 };
      }
      result.byStatus[item.status].count++;
      result.byStatus[item.status].budget += budget;

      // byPriority
      if (!result.byPriority[item.priority]) {
        result.byPriority[item.priority] = { count: 0, budget: 0 };
      }
      result.byPriority[item.priority].count++;
      result.byPriority[item.priority].budget += budget;
    }

    return result;
  }
}
