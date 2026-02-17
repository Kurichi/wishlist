import type { WishlistItem } from '@wishlist/core';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ItemDetail } from './item-detail';

interface ItemDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: WishlistItem | undefined;
  onEdit: (item: WishlistItem) => void;
}

export function ItemDetailDialog({
  open,
  onOpenChange,
  item,
  onEdit,
}: ItemDetailDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <DialogTitle className="text-lg">{item.name}</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(item);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              編集
            </Button>
          </div>
        </DialogHeader>
        <ItemDetail item={item} />
      </DialogContent>
    </Dialog>
  );
}
