import { Badge } from '@/components/ui/badge';
import { DESIRE_TYPE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ItemDesireTypeBadgeProps {
  desireType: string;
}

const desireTypeStyles: Record<string, string> = {
  'specific-product': 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300',
  'general-image': 'bg-violet-100 text-violet-800 hover:bg-violet-100 dark:bg-violet-900 dark:text-violet-300',
  'problem-to-solve': 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300',
};

export function ItemDesireTypeBadge({ desireType }: ItemDesireTypeBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(desireTypeStyles[desireType])}>
      {DESIRE_TYPE_LABELS[desireType] ?? desireType}
    </Badge>
  );
}
