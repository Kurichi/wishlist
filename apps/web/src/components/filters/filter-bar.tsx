import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from '@/lib/constants';
import type { ItemFilters } from '@/api/items';

interface FilterBarProps {
  filters: ItemFilters;
  onFilterChange: (key: string, value: string | undefined) => void;
  onClear: () => void;
}

export function FilterBar({ filters, onFilterChange, onClear }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilters = !!(
    filters.timeframe || filters.category || filters.status || filters.priority
  );

  const filterSelects = (
    <div className="flex flex-wrap gap-2">
      <FilterSelect
        placeholder="期間"
        options={TIMEFRAME_OPTIONS}
        value={filters.timeframe}
        onChange={(v) => onFilterChange('timeframe', v)}
      />
      <FilterSelect
        placeholder="カテゴリ"
        options={CATEGORY_OPTIONS}
        value={filters.category}
        onChange={(v) => onFilterChange('category', v)}
      />
      <FilterSelect
        placeholder="ステータス"
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(v) => onFilterChange('status', v)}
      />
      <FilterSelect
        placeholder="優先度"
        options={PRIORITY_OPTIONS}
        value={filters.priority}
        onChange={(v) => onFilterChange('priority', v)}
      />
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1 h-4 w-4" />
          クリア
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-start"
        >
          <Filter className="mr-2 h-4 w-4" />
          フィルター
          {hasActiveFilters && (
            <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              ON
            </span>
          )}
        </Button>
        {expanded && <div className="mt-2">{filterSelects}</div>}
      </div>

      {/* Desktop always visible */}
      <div className="hidden md:block">{filterSelects}</div>
    </>
  );
}

interface FilterSelectProps {
  placeholder: string;
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

function FilterSelect({ placeholder, options, value, onChange }: FilterSelectProps) {
  return (
    <Select
      value={value ?? 'all'}
      onValueChange={(v) => onChange(v === 'all' ? undefined : v)}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">全て</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
