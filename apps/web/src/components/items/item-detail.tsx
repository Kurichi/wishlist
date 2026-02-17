import type { WishlistItem } from '@wishlist/core';
import { Separator } from '@/components/ui/separator';
import { Markdown } from '@/components/ui/markdown';
import { ItemPriorityBadge } from './item-priority-badge';
import { ItemStatusBadge } from './item-status-badge';
import { ItemDesireTypeBadge } from './item-desire-type-badge';
import { TIMEFRAME_LABELS, CATEGORY_LABELS } from '@/lib/constants';

interface ItemDetailProps {
  item: WishlistItem;
}

function formatCurrency(amount: number | null): string {
  if (amount == null) return '-';
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ItemDetail({ item }: ItemDetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ItemDesireTypeBadge desireType={item.desireType} />
        <ItemPriorityBadge priority={item.priority} />
        <ItemStatusBadge status={item.status} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">期間</span>
          <p className="font-medium">{TIMEFRAME_LABELS[item.timeframe]}</p>
        </div>
        <div>
          <span className="text-muted-foreground">カテゴリ</span>
          <p className="font-medium">{CATEGORY_LABELS[item.category]}</p>
        </div>
        <div>
          <span className="text-muted-foreground">予算</span>
          <p className="font-medium">{formatCurrency(item.budget)}</p>
        </div>
      </div>

      {item.memo && (
        <>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-2">メモ</p>
            <Markdown>{item.memo}</Markdown>
          </div>
        </>
      )}

      <Separator />
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>作成: {formatDate(item.createdAt)}</span>
        <span>更新: {formatDate(item.updatedAt)}</span>
      </div>
    </div>
  );
}
