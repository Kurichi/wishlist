import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { wishlistItems } from './db/schema.js';

export type WishlistItem = InferSelectModel<typeof wishlistItems>;
export type NewWishlistItem = InferInsertModel<typeof wishlistItems>;

export type Timeframe = WishlistItem['timeframe'];
export type Category = WishlistItem['category'];
export type Priority = WishlistItem['priority'];
export type Status = WishlistItem['status'];
export type DesireType = WishlistItem['desireType'];
