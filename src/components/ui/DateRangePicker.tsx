import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onRangeChange?: (start: string, end: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate = '2026-07-01',
  endDate = '2026-11-23',
  onRangeChange,
  className,
}) => {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  const presets = [
    { label: 'FY27 to Date', start: '2026-07-01', end: '2026-11-23' },
    { label: 'Last 30 Days', start: '2026-10-24', end: '2026-11-23' },
    { label: 'FY26 Full Year', start: '2025-07-01', end: '2026-06-30' },
  ];

  const applyPreset = (s: string, e: string) => {
    setStart(s);
    setEnd(e);
    if (onRangeChange) onRangeChange(s, e);
  };

  return (
    <div className={cn('inline-flex items-center gap-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 shadow-sm', className)}>
      <Calendar className="w-4 h-4 text-slate-400 ml-1" />
      <input
        type="date"
        value={start}
        onChange={(e) => {
          setStart(e.target.value);
          if (onRangeChange) onRangeChange(e.target.value, end);
        }}
        className="border-0 bg-transparent text-slate-700 dark:text-slate-300 focus:ring-0 p-0 text-xs"
      />
      <span className="text-slate-400">→</span>
      <input
        type="date"
        value={end}
        onChange={(e) => {
          setEnd(e.target.value);
          if (onRangeChange) onRangeChange(start, e.target.value);
        }}
        className="border-0 bg-transparent text-slate-700 dark:text-slate-300 focus:ring-0 p-0 text-xs"
      />

      <div className="border-l border-slate-200 dark:border-slate-700 pl-2 flex gap-1">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p.start, p.end)}
            className="px-2 py-0.5 rounded text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
