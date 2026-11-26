import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SLAState } from '../../types/fm';

interface SLAClockProps {
  dueIsoString: string;
  slaPercentUsed: number;
  slaState: SLAState;
  className?: string;
}

export const SLAClock: React.FC<SLAClockProps> = ({
  dueIsoString,
  slaPercentUsed,
  slaState,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(dueIsoString).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('BREACHED');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m left`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [dueIsoString]);

  const isBreached = slaState === 'breached' || slaPercentUsed >= 100;
  const isAtRisk = slaState === 'at_risk' || slaPercentUsed >= 80;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border transition-colors',
        isBreached
          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/80 dark:text-red-200 dark:border-red-800 animate-pulse'
          : isAtRisk
          ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-800'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
        className
      )}
    >
      {isBreached ? (
        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
      ) : isAtRisk ? (
        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-emerald-600" />
      )}
      <span>{timeLeft}</span>
      <span className="text-[10px] opacity-75">({slaPercentUsed}%)</span>
    </div>
  );
};
