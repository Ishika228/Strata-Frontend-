import React from 'react';
import { formatCurrency, cn } from '../../lib/utils';
import { useTenant } from '../../context/TenantContext';

interface MoneyTextProps {
  cents: number;
  currency?: string;
  showParensForNegative?: boolean;
  className?: string;
  colored?: boolean;
}

export const MoneyText: React.FC<MoneyTextProps> = ({
  cents,
  currency,
  showParensForNegative = true,
  className,
  colored = false,
}) => {
  const { tenant } = useTenant();
  const effectiveCurrency = currency || 'AUD';

  const isNegative = cents < 0;
  const isPositive = cents > 0;

  const colorClass = colored
    ? isNegative
      ? 'text-rose-600 dark:text-rose-400 font-semibold'
      : isPositive
      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
      : 'text-slate-600 dark:text-slate-400'
    : '';

  return (
    <span
      className={cn('font-mono tabular-nums text-right', colorClass, className)}
      title={`${cents} cents`}
    >
      {formatCurrency(cents, effectiveCurrency, showParensForNegative)}
    </span>
  );
};
