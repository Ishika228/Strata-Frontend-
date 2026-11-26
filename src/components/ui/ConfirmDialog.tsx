import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  requiredWord?: string; // e.g. "LOCK", "DELETE", "VOID"
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  requiredWord,
  isDestructive = true,
}) => {
  const [typedValue, setTypedValue] = useState('');

  if (!isOpen) return null;

  const isConfirmedAllowed = requiredWord ? typedValue === requiredWord : true;

  const handleConfirm = () => {
    if (isConfirmedAllowed) {
      onConfirm();
      setTypedValue('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>

          {requiredWord && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                To confirm, type <span className="font-mono font-bold text-rose-600">{requiredWord}</span> below:
              </label>
              <input
                type="text"
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                placeholder={requiredWord}
                className="w-full rounded border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm font-mono dark:bg-slate-800 dark:text-white focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isConfirmedAllowed}
            onClick={handleConfirm}
            className={cn(
              'px-4 py-1.5 text-sm font-semibold rounded-md text-white transition disabled:opacity-40 disabled:cursor-not-allowed',
              isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-sky-600 hover:bg-sky-700'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
