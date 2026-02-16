import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SORT_OPTIONS } from '@/lib/constants';

interface SortSelectProps {
  sort: string;
  order: string;
  onSortChange: (field: string, order?: string) => void;
}

export function SortSelect({ sort, order, onSortChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={sort} onValueChange={(v) => onSortChange(v, order)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSortChange(sort, order === 'asc' ? 'desc' : 'asc')}
        title={order === 'asc' ? '昇順' : '降順'}
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
