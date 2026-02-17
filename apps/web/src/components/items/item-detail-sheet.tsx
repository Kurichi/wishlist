import type { WishlistItem } from '@wishlist/core';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ItemDetail } from './item-detail';

interface ItemDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: WishlistItem | undefined;
  onEdit: (item: WishlistItem) => void;
}

export function ItemDetailSheet({
  open,
  onOpenChange,
  item,
  onEdit,
}: ItemDetailSheetProps) {
  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <div className="flex items-start justify-between gap-2">
            <SheetTitle className="text-lg">{item.name}</SheetTitle>
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
        </SheetHeader>
        <ScrollArea className="h-full pr-4 pb-8">
          <ItemDetail item={item} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
