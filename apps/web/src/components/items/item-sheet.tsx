import type { WishlistItem } from '@wishlist/core';
import type { ItemFormData } from './item-form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ItemForm } from './item-form';

interface ItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: WishlistItem;
  onSubmit: (data: ItemFormData) => void;
  isSubmitting?: boolean;
}

export function ItemSheet({
  open,
  onOpenChange,
  item,
  onSubmit,
  isSubmitting,
}: ItemSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>{item ? 'アイテムを編集' : '新しいアイテム'}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full pr-4 pb-8">
          <ItemForm
            defaultValues={item}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
