import React from 'react';
import { formatDateTime, cn } from '../../lib/utils';
import { Circle, User, Bot, Clock } from 'lucide-react';

export interface TimelineItem {
  id: string;
  time: string;
  actor: string;
  actorRole?: string;
  action: string;
  details?: string;
  isSystemOrAI?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  return (
    <div className={cn('relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800', className)}>
      {items.map((item) => (
        <div key={item.id} className="relative group">
          <div
            className={cn(
              'absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center',
              item.isSystemOrAI
                ? 'border-purple-500 text-purple-600'
                : 'border-sky-500 text-sky-600'
            )}
          >
            {item.isSystemOrAI ? (
              <Bot className="w-2.5 h-2.5" />
            ) : (
              <Circle className="w-2 h-2 fill-current" />
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{item.actor}</span>
                {item.actorRole && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {item.actorRole}
                  </span>
                )}
              </div>
              <span className="text-slate-400 font-mono text-[11px]">{formatDateTime(item.time)}</span>
            </div>

            <div className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200">
              {item.action}
            </div>

            {item.details && (
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                {item.details}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
