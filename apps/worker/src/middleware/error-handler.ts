import type { ErrorHandler } from 'hono';
import { AppError } from '@wishlist/core';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode as any);
  }

  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
};
