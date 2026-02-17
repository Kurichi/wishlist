import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1).max(200),
  timeframe: z.enum(['short-term', 'medium-term', 'long-term']),
  category: z.enum(['gadgets', 'experiences', 'skills', 'lifestyle', 'other']),
  budget: z.number().int().nonnegative().nullable().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['unstarted', 'considering', 'purchased']).optional(),
  desireType: z.enum(['specific-product', 'general-image', 'problem-to-solve']).optional(),
  memo: z.string().max(10000).nullable().optional(),
});

export const updateItemSchema = createItemSchema.partial();
