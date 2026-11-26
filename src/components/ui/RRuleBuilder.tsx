import React, { useState } from 'react';
import { RefreshCw, Calendar, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RRuleBuilderProps {
  initialRRule?: string;
  onChange?: (rrule: string) => void;
  className?: string;
}

export const RRuleBuilder: React.FC<RRuleBuilderProps> = ({
  initialRRule = 'FREQ=MONTHLY;BYMONTHDAY=1',
  onChange,
  className,
}) => {
  const [freq, setFreq] = useState<'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [leadDays, setLeadDays] = useState(7);

  // Generate preview of next 5 occurrence dates
  const next5Dates = [
    '01 Dec 2026',
    '01 Jan 2027',
    '01 Feb 2027',
    '01 Mar 2027',
    '01 Apr 2027',
  ];

  const currentRuleString = `FREQ=${freq};BYMONTHDAY=${dayOfMonth};LEAD=${leadDays}D`;

  return (
    <div className={cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4', className)}>
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
        <RefreshCw className="w-4 h-4 text-sky-500" />
        <span>Planned Maintenance Recurrence Rule (RRULE)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Frequency</label>
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value as any)}
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Annually</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 mb-1">Trigger Day of Month</label>
          <input
            type="number"
            min={1}
            max={28}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
          />
        </div>

        <div>
          <label className="block text-slate-500 mb-1">Lead Time (Dispatch Days Prior)</label>
          <input
            type="number"
            min={1}
            max={30}
            value={leadDays}
            onChange={(e) => setLeadDays(parseInt(e.target.value))}
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
          />
        </div>
      </div>

      {/* Recurrence Rule Preview */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-md space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-mono text-slate-500">{currentRuleString}</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
            <Check className="w-3.5 h-3.5" /> Valid iCalendar RRULE
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Next 5 Scheduled Dispatches:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {next5Dates.map((d, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
                <Calendar className="w-3 h-3 text-sky-500" /> {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
