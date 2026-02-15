import type { WishlistItem } from '@wishlist/core';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ItemStatusBadge } from './item-status-badge';
import { ItemPriorityBadge } from './item-priority-badge';
import { TIMEFRAME_LABELS, CATEGORY_LABELS } from '@/lib/constants';

interface ItemCardProps {
  item: WishlistItem;
  onEdit: (item: WishlistItem) => void;
  onDelete: (item: WishlistItem) => void;
}

function formatCurrency(amount: number | null): string {
  if (amount == null) return '-';
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{item.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Pencil className="mr-2 h-4 w-4" />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {TIMEFRAME_LABELS[item.timeframe]}
          </span>
          <span className="text-muted-foreground">
            {CATEGORY_LABELS[item.category]}
          </span>
          <span className="font-medium">{formatCurrency(item.budget)}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <ItemPriorityBadge priority={item.priority} />
          <ItemStatusBadge status={item.status} />
        </div>
        {item.memo && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.memo}</p>
        )}
      </CardContent>
    </Card>
  );
}
