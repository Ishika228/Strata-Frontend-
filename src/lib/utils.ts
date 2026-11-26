import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format cents to currency display string.
 * Supports parenthesis for negative amounts (ledger standard, e.g. ($1,250.00)).
 */
export function formatCurrency(
  cents: number,
  currency = 'AUD',
  showParensForNegative = true
): string {
  const isNegative = cents < 0;
  const absDollars = Math.abs(cents) / 100;
  const formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absDollars);

  if (isNegative && showParensForNegative) {
    return `(${formatted})`;
  } else if (isNegative) {
    return `-${formatted}`;
  }
  return formatted;
}

/**
 * Parse display money string to integer cents
 */
export function parseToCents(amountStr: string): number {
  if (!amountStr) return 0;
  const cleaned = amountStr.replace(/[^0-9.-]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : Math.round(val * 100);
}

/**
 * Format ISO date string nicely
 */
export function formatDate(isoStr: string, options?: Intl.DateTimeFormatOptions): string {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-AU', options || { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return isoStr;
  }
}

/**
 * Format ISO date-time string
 */
export function formatDateTime(isoStr: string): string {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return `${d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return isoStr;
  }
}
