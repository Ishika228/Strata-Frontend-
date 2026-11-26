import React, { useState } from 'react';
import { parseToCents, cn } from '../../lib/utils';
import { useTenant } from '../../context/TenantContext';

interface MoneyInputProps {
  valueCents: number;
  onChangeCents: (cents: number) => void;
  currency?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  valueCents,
  onChangeCents,
  currency,
  disabled = false,
  placeholder = '0.00',
  className,
  id,
}) => {
  const { tenant } = useTenant();
  const symbol = tenant.currencySymbol || '$';

  const [rawText, setRawText] = useState((valueCents / 100).toFixed(2));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRawText(val);
    const parsed = parseToCents(val);
    onChangeCents(parsed);
  };

  const handleBlur = () => {
    setRawText((valueCents / 100).toFixed(2));
  };

  return (
    <div className={cn('relative rounded-md shadow-sm', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-slate-500 sm:text-sm font-semibold">{symbol}</span>
      </div>
      <input
        type="text"
        id={id}
        disabled={disabled}
        value={rawText}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(
          'block w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-3 text-right font-mono text-slate-900 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800'
        )}
      />
    </div>
  );
};
