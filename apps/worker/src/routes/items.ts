import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createDb,
  WishlistRepository,
  createItemSchema,
  updateItemSchema,
  NotFoundError,
} from '@wishlist/core';
import type { Timeframe, Category, Status, Priority } from '@wishlist/core';

type Env = { Bindings: { DB: D1Database } };

const items = new Hono<Env>();

items.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const repo = new WishlistRepository(db);

  const filters = {
    timeframe: c.req.query('timeframe') as Timeframe | undefined,
    category: c.req.query('category') as Category | undefined,
    status: c.req.query('status') as Status | undefined,
    priority: c.req.query('priority') as Priority | undefined,
    sort: c.req.query('sort') as 'name' | 'createdAt' | 'updatedAt' | 'budget' | 'priority' | undefined,
    order: c.req.query('order') as 'asc' | 'desc' | undefined,
  };

  const result = await repo.list(filters);
  return c.json({ items: result });
});

items.get('/summary', async (c) => {
  const db = createDb(c.env.DB);
  const repo = new WishlistRepository(db);

  const summary = await repo.summarize();
  return c.json({ summary });
});

items.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const repo = new WishlistRepository(db);
  const id = c.req.param('id');

  const item = await repo.getById(id);
  if (!item) {
    throw new NotFoundError(`Item with id '${id}' not found`);
  }

  return c.json({ item });
});

items.post('/', zValidator('json', createItemSchema as any), async (c) => {
  const db = createDb(c.env.DB);
  const repo = new WishlistRepository(db);
  const data = c.req.valid('json' as const);

  const item = await repo.create(data as any);
  return c.json({ item }, 201);
});

items.put('/:id', zValidator('json', updateItemSchema as any), async (c) => {
  const db = createDb(c.env.DB);
  const repo = new WishlistRepository(db);
  const id = c.req.param('id');
  const data = c.req.valid('json' as const);

  const item = await repo.update(id, data as any);
  return c.json({ item });
});

items.delete('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const repo = new WishlistRepository(db);
  const id = c.req.param('id');

  await repo.delete(id);
  return c.json({ success: true });
});

export { items };
