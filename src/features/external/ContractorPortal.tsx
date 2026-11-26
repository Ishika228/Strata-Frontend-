import React, { useState } from 'react';
import { Truck, ShieldCheck, CheckCircle2, Clock, UploadCloud, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { mockWorkOrders, mockSuppliers, mockComplianceRecords } from '../../lib/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MoneyText } from '../../components/ui/MoneyText';

export const ContractorPortal: React.FC = () => {
  const currentContractor = mockSuppliers[0]; // KONE Elevators Pty Ltd
  const [activeTab, setActiveTab] = useState<'jobs' | 'compliance' | 'invoices'>('jobs');
  const [contractorWOs, setContractorWOs] = useState(
    mockWorkOrders.filter((w) => w.assigneeId === currentContractor.id || w.assigneeName.includes('KONE'))
  );

  const handleAcceptJob = (id: string) => {
    setContractorWOs((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'in_progress' } : w))
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#08294A] flex items-center justify-center text-[#00B5A4] font-bold shadow-sm">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                {currentContractor.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ✔ Certified Contractor
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              ABN: {currentContractor.taxId} • Trade: {currentContractor.trades.join(', ')}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'jobs'
                ? 'bg-white dark:bg-slate-700 text-[#08294A] dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Assigned Work Orders ({contractorWOs.length})
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'compliance'
                ? 'bg-white dark:bg-slate-700 text-[#08294A] dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Compliance Documents
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'invoices'
                ? 'bg-white dark:bg-slate-700 text-[#08294A] dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Invoices & Quotes
          </button>
        </div>
      </header>

      {/* Tab 1: Assigned Work Orders */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-soft">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans">Active Allocated Jobs</span>
              <div className="text-2xl font-black tracking-tight text-[#102747] dark:text-slate-100 font-sans mt-1">
                {contractorWOs.length} WOs
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-soft">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans">Contractor SLA Compliance</span>
              <div className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-1">98.5%</div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-soft">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans">Total Billed YTD</span>
              <div className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-1">$42,500.00</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-soft">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Assigned Work Orders
            </h2>

            <div className="space-y-3">
              {contractorWOs.map((wo) => (
                <div
                  key={wo.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#00B5A4] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {wo.number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                          wo.priority === 'P1'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : wo.priority === 'P2'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {wo.priority}
                      </span>
                      <StatusBadge status={wo.status} />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                      {wo.propertyName} — {wo.assetName || wo.category}
                    </h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{wo.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                      <span>NTE Budget: <strong>${wo.nteAmountCents / 100}</strong></span>
                      <span>•</span>
                      <span>Target SLA: {new Date(wo.slaDue).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {wo.status === 'open' || wo.status === 'dispatched' ? (
                      <button
                        onClick={() => handleAcceptJob(wo.id)}
                        className="px-3.5 py-1.5 bg-[#00B5A4] hover:bg-[#008F87] text-white rounded-lg font-bold shadow-sm transition"
                      >
                        Accept Job
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Opening completion report for ${wo.number}`)}
                        className="px-3.5 py-1.5 bg-[#08294A] hover:bg-[#0D4775] text-white rounded-lg font-bold shadow-sm transition"
                      >
                        Submit Completion & Invoice
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Compliance Documents */}
      {activeTab === 'compliance' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Statutory Licences & Insurance Certificates
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Maintain unexpired certificates to remain eligible for automatic dispatch
              </p>
            </div>
            <button
              onClick={() => alert('Certificate upload dialog')}
              className="px-4 py-2 bg-[#00B5A4] hover:bg-[#008F87] text-white rounded-lg text-xs font-bold shadow-soft transition flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockComplianceRecords.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">{comp.type}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">Policy: {comp.number}</div>
                  <div className="text-[11px] text-slate-500">Issuer: {comp.issuer}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold pt-1">
                    Expires: {comp.expiryDate}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    comp.status === 'valid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {comp.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-soft text-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Submitted Invoices & Statements
          </h2>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">INV-2026-904</span>
              <p className="text-[11px] text-slate-500">Lift A Passenger Controller Diagnostic (WO-8801)</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">$4,250.00</span>
              <span className="block text-[10px] text-emerald-600 font-bold">Approved & Scheduled</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
