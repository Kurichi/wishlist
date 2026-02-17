import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const wishlistItems = sqliteTable('wishlist_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  timeframe: text('timeframe', { enum: ['short-term', 'medium-term', 'long-term'] }).notNull(),
  category: text('category', { enum: ['gadgets', 'experiences', 'skills', 'lifestyle', 'other'] }).notNull(),
  budget: integer('budget'),
  priority: text('priority', { enum: ['high', 'medium', 'low'] }).notNull(),
  status: text('status', { enum: ['unstarted', 'considering', 'purchased'] }).notNull().default('unstarted'),
  desireType: text('desire_type', { enum: ['specific-product', 'general-image', 'problem-to-solve'] }).notNull().default('general-image'),
  memo: text('memo'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
