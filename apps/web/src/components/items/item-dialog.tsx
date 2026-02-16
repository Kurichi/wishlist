import type { WishlistItem } from '@wishlist/core';
import type { ItemFormData } from './item-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ItemForm } from './item-form';

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: WishlistItem;
  onSubmit: (data: ItemFormData) => void;
  isSubmitting?: boolean;
}

export function ItemDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
  isSubmitting,
}: ItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{item ? 'アイテムを編集' : '新しいアイテム'}</DialogTitle>
        </DialogHeader>
        <ItemForm
          defaultValues={item}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
