import { useSearchParams } from 'react-router';
import { useCallback, useMemo } from 'react';
import type { ItemFilters } from '@/api/items';

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ItemFilters = useMemo(
    () => ({
      timeframe: searchParams.get('timeframe') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      priority: searchParams.get('priority') || undefined,
      sort: searchParams.get('sort') || undefined,
      order: searchParams.get('order') || undefined,
    }),
    [searchParams],
  );

  const setFilter = useCallback(
    (key: string, value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const sort = filters.sort || 'createdAt';
  const order = filters.order || 'desc';

  const setSort = useCallback(
    (field: string, dir?: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('sort', field);
        if (dir) {
          next.set('order', dir);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  return { filters, setFilter, clearFilters, sort, order, setSort };
}
