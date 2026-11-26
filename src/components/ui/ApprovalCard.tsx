import React, { useState } from 'react';
import { MoneyText } from './MoneyText';
import { Check, X, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ApprovalCardProps {
  id: string;
  title: string;
  requester: string;
  amountCents: number;
  budgetRemainingCents: number;
  pdfUrl?: string;
  onApprove: (id: string, comment?: string) => void;
  onReject: (id: string, comment?: string) => void;
  className?: string;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  id,
  title,
  requester,
  amountCents,
  budgetRemainingCents,
  pdfUrl,
  onApprove,
  onReject,
  className,
}) => {
  const [comment, setComment] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const budgetPctAfter = Math.max(0, Math.min(100, Math.round(((budgetRemainingCents - amountCents) / budgetRemainingCents) * 100)));
  const isBudgetExceeded = amountCents > budgetRemainingCents;

  return (
    <div className={cn('bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
          <span className="text-xs text-slate-500">Requested by {requester}</span>
        </div>
        <div className="text-right">
          <span className="text-base font-bold font-mono">
            <MoneyText cents={amountCents} />
          </span>
        </div>
      </div>

      {/* Budget Remaining Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-md space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Budget Remaining</span>
          <span className="font-mono font-medium"><MoneyText cents={budgetRemainingCents} /></span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all', isBudgetExceeded ? 'bg-rose-500' : 'bg-emerald-500')}
            style={{ width: `${isBudgetExceeded ? 100 : budgetPctAfter}%` }}
          />
        </div>
        {isBudgetExceeded && (
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium pt-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Exceeds fund account budget threshold!</span>
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional approval note or reason..."
          className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-sky-600 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" /> View PDF
          </a>
        ) : <span />}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onReject(id, comment)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition"
          >
            <X className="w-3.5 h-3.5" /> Reject
          </button>
          <button
            onClick={() => onApprove(id, comment)}
            className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition"
          >
            <Check className="w-3.5 h-3.5" /> Approve
          </button>
        </div>
      </div>
    </div>
  );
};
