import { Badge } from '@/components/ui/badge';
import { PRIORITY_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ItemPriorityBadgeProps {
  priority: string;
}

const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
  low: 'bg-muted text-muted-foreground hover:bg-muted',
};

export function ItemPriorityBadge({ priority }: ItemPriorityBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(priorityStyles[priority])}>
      {PRIORITY_LABELS[priority] ?? priority}
    </Badge>
  );
}
