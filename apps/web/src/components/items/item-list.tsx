import type { WishlistItem } from '@wishlist/core';
import { ItemTable } from './item-table';
import { ItemCard } from './item-card';
import { Skeleton } from '@/components/ui/skeleton';

interface ItemListProps {
  items: WishlistItem[];
  isLoading: boolean;
  onEdit: (item: WishlistItem) => void;
  onDelete: (item: WishlistItem) => void;
  onView: (item: WishlistItem) => void;
}

export function ItemList({ items, isLoading, onEdit, onDelete, onView }: ItemListProps) {
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:block space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        {/* Mobile skeleton */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop: Table view */}
      <div className="hidden md:block">
        <ItemTable items={items} onEdit={onEdit} onDelete={onDelete} onView={onView} />
      </div>

      {/* Mobile: Card view */}
      <div className="md:hidden space-y-3">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            アイテムがありません
          </p>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))
        )}
      </div>
    </>
  );
}
