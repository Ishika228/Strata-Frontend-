import React from 'react';
import { cn } from '../../lib/utils';

export type StatusFamily = 'draft' | 'active' | 'warning' | 'done' | 'error' | 'info';

interface StatusBadgeProps {
  status: string;
  family?: StatusFamily;
  className?: string;
  dot?: boolean;
}

const familyStyles: Record<StatusFamily, { bg: string; text: string; dot: string; border: string }> = {
  draft: {
    bg: 'bg-[#F4F8FC]',
    text: 'text-[#71849A]',
    dot: 'bg-[#71849A]',
    border: 'border-[#E2E8F0]',
  },
  active: {
    bg: 'bg-[#DDF5F4]',
    text: 'text-[#008F87]',
    dot: 'bg-[#00B5A4]',
    border: 'border-[#68E0D6]/60',
  },
  warning: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    border: 'border-orange-200',
  },
  done: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-600',
    border: 'border-emerald-200',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-600',
    border: 'border-red-200',
  },
  info: {
    bg: 'bg-[#EAF3F8]',
    text: 'text-[#1493B8]',
    dot: 'bg-[#1493B8]',
    border: 'border-[#B8E9F2]',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  family,
  className,
  dot = true,
}) => {
  let resolvedFamily: StatusFamily = family || 'draft';
  const lower = status.toLowerCase();

  if (!family) {
    if (lower.includes('healthy') || lower.includes('done') || lower.includes('complete') || lower.includes('approved') || lower.includes('verified') || lower.includes('valid') || lower.includes('matched') || lower.includes('carried')) {
      resolvedFamily = 'done';
    } else if (lower.includes('active') || lower.includes('open') || lower.includes('in_progress') || lower.includes('dispatched')) {
      resolvedFamily = 'active';
    } else if (lower.includes('warn') || lower.includes('attention') || lower.includes('at_risk') || lower.includes('pending') || lower.includes('hold') || lower.includes('preview')) {
      resolvedFamily = 'warning';
    } else if (lower.includes('critical') || lower.includes('error') || lower.includes('breached') || lower.includes('reject') || lower.includes('overdue') || lower.includes('fail') || lower.includes('expired')) {
      resolvedFamily = 'error';
    } else if (lower.includes('info') || lower.includes('notice')) {
      resolvedFamily = 'info';
    }
  }

  const styles = familyStyles[resolvedFamily];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-soft-sm tracking-tight transition-colors',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', styles.dot)} aria-hidden="true" />}
      <span className="capitalize">{status.replace(/_/g, ' ')}</span>
    </span>
  );
};
