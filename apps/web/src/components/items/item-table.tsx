import type { WishlistItem } from '@wishlist/core';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface ItemTableProps {
  items: WishlistItem[];
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

export function ItemTable({ items, onEdit, onDelete }: ItemTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名前</TableHead>
          <TableHead className="w-[80px]">期間</TableHead>
          <TableHead className="w-[100px]">カテゴリ</TableHead>
          <TableHead className="w-[100px] text-right">予算</TableHead>
          <TableHead className="w-[70px]">優先度</TableHead>
          <TableHead className="w-[80px]">ステータス</TableHead>
          <TableHead className="w-[50px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
              アイテムがありません
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{TIMEFRAME_LABELS[item.timeframe]}</TableCell>
              <TableCell>{CATEGORY_LABELS[item.category]}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.budget)}</TableCell>
              <TableCell>
                <ItemPriorityBadge priority={item.priority} />
              </TableCell>
              <TableCell>
                <ItemStatusBadge status={item.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
