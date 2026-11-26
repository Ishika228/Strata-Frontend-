import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface StepUpMFADialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  operationName: string;
}

export const StepUpMFADialog: React.FC<StepUpMFADialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  operationName,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a 6-digit authenticator code.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-lg bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Step-Up Authentication</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Authorisation required for sensitive operation:{' '}
            <strong className="text-slate-900 dark:text-slate-100">{operationName}</strong>. Enter code from your authenticator app.
          </p>

          <div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/[^0-9]/g, ''));
                setError('');
              }}
              placeholder="123456"
              className="w-full text-center tracking-widest text-2xl font-mono py-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              autoFocus
            />
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-4 py-1.5 text-xs font-semibold bg-sky-600 text-white rounded hover:bg-sky-700 transition"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
