import React from 'react';
import { AlertCircle, AlertTriangle, FileX, RefreshCw, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export const EmptyState: React.FC<{
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, description, action, icon, className }) => (
  <div className={cn('flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800', className)}>
    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
      {icon || <FileX className="w-6 h-6" />}
    </div>
    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  traceId?: string;
  onRetry?: () => void;
  className?: string;
}> = ({ title = 'An error occurred', message, traceId, onRetry, className }) => (
  <div className={cn('rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-4 text-rose-800 dark:text-rose-200', className)}>
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">{message}</p>
        {traceId && (
          <div className="mt-2 text-xs font-mono text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <span>Trace: {traceId}</span>
            <button
              onClick={() => navigator.clipboard.writeText(traceId)}
              className="underline hover:text-rose-800"
            >
              Copy
            </button>
          </div>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-rose-600 text-white hover:bg-rose-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  </div>
);

export const ConflictBanner: React.FC<{
  onReload: () => void;
  message?: string;
}> = ({ onReload, message = 'This item changed on the server. Reload to view latest state.' }) => (
  <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-md p-3 flex items-center justify-between text-amber-900 dark:text-amber-200 text-sm">
    <div className="flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 text-amber-500" />
      <span>{message}</span>
    </div>
    <button
      onClick={onReload}
      className="px-2.5 py-1 text-xs font-semibold bg-amber-600 text-white rounded hover:bg-amber-700"
    >
      Reload
    </button>
  </div>
);

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded bg-slate-200 dark:bg-slate-800', className)} />
);
