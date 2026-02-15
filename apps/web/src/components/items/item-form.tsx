import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createItemSchema } from '@wishlist/core';
import type { WishlistItem } from '@wishlist/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TIMEFRAME_OPTIONS,
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from '@/lib/constants';

export interface ItemFormData {
  name: string;
  timeframe: 'short-term' | 'medium-term' | 'long-term';
  category: 'gadgets' | 'experiences' | 'skills' | 'lifestyle' | 'other';
  budget?: number | null;
  priority: 'high' | 'medium' | 'low';
  status?: 'unstarted' | 'considering' | 'purchased';
  memo?: string | null;
}

interface ItemFormProps {
  defaultValues?: WishlistItem;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ItemForm({ defaultValues, onSubmit, onCancel, isSubmitting }: ItemFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemFormData>({
    // Zod v3.24 causes "excessively deep" with zodResolver generic inference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: (zodResolver as any)(createItemSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          timeframe: defaultValues.timeframe,
          category: defaultValues.category,
          budget: defaultValues.budget,
          priority: defaultValues.priority,
          status: defaultValues.status,
          memo: defaultValues.memo,
        }
      : {
          timeframe: 'medium-term',
          category: 'other',
          priority: 'medium',
          status: 'unstarted',
        },
  });

  const timeframe = watch('timeframe');
  const category = watch('category');
  const priority = watch('priority');
  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">名前 *</Label>
        <Input id="name" {...register('name')} placeholder="欲しいもの" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>期間</Label>
          <Select
            value={timeframe}
            onValueChange={(v) => setValue('timeframe', v as ItemFormData['timeframe'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAME_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>カテゴリ</Label>
          <Select
            value={category}
            onValueChange={(v) => setValue('category', v as ItemFormData['category'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">予算 (円)</Label>
        <Input
          id="budget"
          type="number"
          min={0}
          {...register('budget', {
            setValueAs: (v: string) => {
              if (v === '' || v === undefined || v === null) return null;
              const n = Number(v);
              return Number.isNaN(n) ? null : n;
            },
          })}
          placeholder="0"
        />
        {errors.budget && (
          <p className="text-sm text-destructive">{errors.budget.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>優先度</Label>
          <Select
            value={priority}
            onValueChange={(v) => setValue('priority', v as ItemFormData['priority'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>ステータス</Label>
          <Select
            value={status}
            onValueChange={(v) => setValue('status', v as ItemFormData['status'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="memo">メモ</Label>
        <Textarea
          id="memo"
          {...register('memo')}
          placeholder="メモ（任意）"
          rows={3}
        />
        {errors.memo && (
          <p className="text-sm text-destructive">{errors.memo.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : defaultValues ? '更新' : '作成'}
        </Button>
      </div>
    </form>
  );
}
