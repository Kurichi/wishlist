import type { WishlistItem } from '@wishlist/core';

interface BudgetSummaryProps {
  items: WishlistItem[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}

export function BudgetSummary({ items }: BudgetSummaryProps) {
  const totalBudget = items.reduce((sum, item) => sum + (item.budget ?? 0), 0);
  const itemCount = items.length;

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>{itemCount} 件</span>
      <span>合計: {formatCurrency(totalBudget)}</span>
    </div>
  );
}
