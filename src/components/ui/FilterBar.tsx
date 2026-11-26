import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

interface FilterBarProps {
  chips: FilterChip[];
  onToggleChip: (id: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  savedViews?: { id: string; name: string }[];
  activeViewId?: string;
  onSelectView?: (viewId: string) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  chips,
  onToggleChip,
  searchPlaceholder = 'Filter records (press / to focus)...',
  searchValue = '',
  onSearchChange,
  savedViews = [
    { id: 'all', name: 'All' },
    { id: 'active', name: 'Active only' },
    { id: 'attention', name: 'Needs attention' },
  ],
  activeViewId = 'all',
  onSelectView,
  className,
}) => {
  const [internalSearch, setInternalSearch] = useState(searchValue);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearch(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <div className={cn('flex flex-col md:flex-row md:items-center justify-between gap-3 py-2', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Saved Views Tabs */}
        {savedViews && savedViews.length > 0 && (
          <div className="flex items-center rounded-lg bg-[#EAF3F8] p-0.5 mr-2 border border-[#E2E8F0]">
            {savedViews.map((view) => (
              <button
                key={view.id}
                onClick={() => onSelectView && onSelectView(view.id)}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
                  activeViewId === view.id
                    ? 'bg-white text-[#102747] shadow-soft-sm'
                    : 'text-[#71849A] hover:text-[#102747]'
                )}
              >
                {view.name}
              </button>
            ))}
          </div>
        )}

        {/* Filter Chips */}
        {chips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => onToggleChip(chip.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
              chip.active
                ? 'bg-[#DDF5F4] border-[#00B5A4] text-[#008F87] font-semibold'
                : 'bg-white border-[#E2E8F0] text-[#334B68] hover:border-[#00B5A4]/50'
            )}
          >
            <span>{chip.label}</span>
            {chip.active && <X className="w-3 h-3 text-[#008F87]" />}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative min-w-[240px]">
        <Search className="w-4 h-4 text-[#71849A] absolute left-2.5 top-2.5" />
        <input
          type="text"
          value={internalSearch}
          onChange={handleSearch}
          placeholder={searchPlaceholder}
          className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-[#E2E8F0] bg-white focus:outline-none focus:ring-1 focus:ring-[#00B5A4] focus:border-[#00B5A4] text-[#102747] placeholder-[#71849A]"
        />
      </div>
    </div>
  );
};
