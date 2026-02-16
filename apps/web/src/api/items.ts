import type { WishlistItem } from '@wishlist/core';
import { apiClient } from './client';

export interface ItemsResponse {
  items: WishlistItem[];
}

export interface ItemResponse {
  item: WishlistItem;
}

export interface ItemFilters {
  timeframe?: string;
  category?: string;
  status?: string;
  priority?: string;
  sort?: string;
  order?: string;
}

export async function getItems(params?: ItemFilters): Promise<ItemsResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) searchParams.set(key, value);
    }
  }
  const query = searchParams.toString();
  return apiClient<ItemsResponse>(`/api/items${query ? `?${query}` : ''}`);
}

export async function getItem(id: string): Promise<ItemResponse> {
  return apiClient<ItemResponse>(`/api/items/${id}`);
}

export async function createItem(data: object): Promise<ItemResponse> {
  return apiClient<ItemResponse>('/api/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateItem(id: string, data: object): Promise<ItemResponse> {
  return apiClient<ItemResponse>(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteItem(id: string): Promise<void> {
  await apiClient(`/api/items/${id}`, {
    method: 'DELETE',
  });
}
