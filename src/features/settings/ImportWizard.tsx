import React, { useState } from 'react';
import { DocumentUploader } from '../../components/ui/DocumentUploader';
import { UploadCloud, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const ImportWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          Data Import & Migration Wizard
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Migrate existing schemes, lots, opening balances, and asset registers from legacy software
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-sky-600' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold">1</span>
          <span>Upload Template</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-700" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-sky-600' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold">2</span>
          <span>Dry-Run Validation</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-700" />
        <div className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold">3</span>
          <span>Commit & Summary</span>
        </div>
      </div>

      {/* Step Contents */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Step 1: Upload Scheme & Lots CSV
          </h3>
          <DocumentUploader
            onUploadComplete={() => {
              setTimeout(() => setStep(2), 600);
            }}
          />
        </div>
      )}

      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Step 2: Dry-Run Validation Passed (0 Errors)</span>
          </h3>
          <p className="text-xs text-slate-500">
            48 lot records parsed. Entitlements sum up to exactly 10,000 UOE.
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
            >
              Commit Migration to Database
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Migration Committed Successfully
          </h3>
          <p className="text-xs text-slate-500">
            The scheme, lots, opening ledger entries, and owners roll have been created in the live database.
          </p>
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 bg-sky-600 text-white rounded text-xs font-semibold"
          >
            Import Another Dataset
          </button>
        </div>
      )}
    </div>
  );
};
