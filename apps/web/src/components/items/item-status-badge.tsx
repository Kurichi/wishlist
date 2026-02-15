import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ItemStatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  unstarted: 'bg-muted text-muted-foreground hover:bg-muted',
  considering: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
  purchased: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300',
};

export function ItemStatusBadge({ status }: ItemStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(statusStyles[status])}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
