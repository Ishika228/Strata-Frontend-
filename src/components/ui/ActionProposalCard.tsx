import React from 'react';
import { AIActionProposal } from '../../types/ai';
import { Sparkles, Check, X, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActionProposalCardProps {
  proposal: AIActionProposal;
  onConfirm: (id: string) => void;
  onDiscard: (id: string) => void;
  className?: string;
}

export const ActionProposalCard: React.FC<ActionProposalCardProps> = ({
  proposal,
  onConfirm,
  onDiscard,
  className,
}) => {
  const isPending = proposal.status === 'proposed';

  return (
    <div
      className={cn(
        'rounded-lg border p-3.5 space-y-3 transition-all',
        proposal.status === 'confirmed'
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
          : proposal.status === 'discarded'
          ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
          : 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-purple-900 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>PROPOSED SYSTEM ACTION</span>
        </div>
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-semibold uppercase',
            proposal.status === 'confirmed' && 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
            proposal.status === 'discarded' && 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
            isPending && 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          )}
        >
          {proposal.status}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{proposal.title}</h4>
      </div>

      {/* Arguments preview */}
      <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded border border-purple-100 dark:border-purple-900/50 text-[11px] font-mono space-y-1">
        {Object.entries(proposal.arguments).map(([key, val]) => (
          <div key={key} className="flex justify-between">
            <span className="text-slate-400">{key}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{String(val)}</span>
          </div>
        ))}
      </div>

      {isPending && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => onDiscard(proposal.id)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded transition"
          >
            <X className="w-3.5 h-3.5" /> Discard
          </button>
          <button
            onClick={() => onConfirm(proposal.id)}
            className="flex items-center gap-1 px-3.5 py-1 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded shadow-sm transition"
          >
            <Check className="w-3.5 h-3.5" /> Confirm & Execute
          </button>
        </div>
      )}
    </div>
  );
};
