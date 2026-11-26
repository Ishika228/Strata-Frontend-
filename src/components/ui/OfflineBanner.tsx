import React, { useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SyncQueueItem } from '../../types/common';

interface OfflineBannerProps {
  pendingQueue?: SyncQueueItem[];
  onRetrySync?: () => void;
  className?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  pendingQueue = [],
  onRetrySync,
  className,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      if (onRetrySync) onRetrySync();
    }, 800);
  };

  if (isOnline && pendingQueue.length === 0) return null;

  return (
    <div
      className={cn(
        'w-full px-4 py-2 text-xs font-medium flex items-center justify-between border-b shadow-sm transition-all',
        !isOnline
          ? 'bg-amber-500 text-white border-amber-600'
          : 'bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 animate-bounce" />
            <span>You are currently offline. Changes are saved locally to PWA cache.</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 text-sky-600" />
            <span>{pendingQueue.length} offline events pending sync to server.</span>
          </>
        )}
      </div>

      <button
        onClick={handleSync}
        disabled={syncing}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/10 hover:bg-black/20 text-xs font-semibold backdrop-blur-sm transition"
      >
        <RefreshCw className={cn('w-3 h-3', syncing && 'animate-spin')} />
        <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
      </button>
    </div>
  );
};
