import React from 'react';
import { Timeline } from '../../components/ui/Timeline';
import { mockAuditEvents } from '../../lib/mockData';
import { Download } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Security & Compliance Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable audit trail of all transactions, dispatch decisions, and reconciliation locks
          </p>
        </div>

        <button
          onClick={() => alert('Audit log exported to CSV')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold hover:bg-slate-50"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <Timeline
          items={mockAuditEvents.map((a) => ({
            id: a.id,
            time: a.time,
            actor: a.actor,
            actorRole: a.actorRole,
            action: a.action,
            details: a.changes,
            isSystemOrAI: a.actorRole === 'system',
          }))}
        />
      </div>
    </div>
  );
};
