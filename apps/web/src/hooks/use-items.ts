import { useQuery } from '@tanstack/react-query';
import { getItems, getItem } from '@/api/items';
import type { ItemFilters } from '@/api/items';

export function useItems(filters?: ItemFilters) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => getItems(filters),
  });
}

export function useItem(id: string | undefined) {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => getItem(id!),
    enabled: !!id,
  });
}
