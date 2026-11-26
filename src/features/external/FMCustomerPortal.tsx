import React, { useState } from 'react';
import { KPITile } from '../../components/ui/KPITile';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MoneyText } from '../../components/ui/MoneyText';
import { mockWorkOrders, mockServiceRequests, mockApprovals } from '../../lib/mockData';
import { Building2, Plus, Clock, CheckCircle2, AlertTriangle, FileText, ChevronRight, X } from 'lucide-react';

const CreateServiceRequestModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newSR: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#102747]">Create Service Request</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">Submit a new maintenance or service request for review.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit({
                id: `SR-${Date.now()}`,
                title: 'General Maintenance Request',
                priority: 'medium',
                status: 'pending',
                createdDate: 'Today',
              });
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-[#00B5A4] hover:bg-[#008F87] rounded-xl shadow-xs"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export const FMCustomerPortal: React.FC = () => {
  const [requests, setRequests] = useState(mockServiceRequests);
  const [workOrders] = useState(mockWorkOrders);
  const [approvals, setApprovals] = useState(mockApprovals);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'approvals' | 'reports'>('requests');

  const handleAddRequest = (newSR: any) => {
    setRequests([newSR, ...requests]);
  };

  const handleApproveVariation = (id: string) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: 'approved' } : a)));
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#08294A] flex items-center justify-center text-[#00B5A4] font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
              Corporate Facilities Portal (SCR-261)
            </h1>
            <p className="text-xs text-slate-500">Client Custodian Service Desk: The Pacific Heights Complex</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00B5A4] hover:bg-[#008F87] text-white rounded-lg text-xs font-bold shadow-soft transition"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Service Request</span>
          </button>
        </div>
      </header>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPITile
          title="SLA Compliance Rate"
          value="98.2%"
          trend={{ percentage: 1.2, direction: 'up', label: 'this month' }}
        />
        <KPITile
          title="Open Work Orders"
          value={`${workOrders.filter((w) => w.status !== 'completed' && w.status !== 'closed').length} Active`}
          subtitle="All within SLA thresholds"
        />
        <KPITile
          title="Monthly Spend (Nov 2026)"
          value="$6,140.00"
          subtitle="Under budget allowance ($8,500)"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'requests'
              ? 'bg-[#08294A] text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          My Requests & Jobs ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'approvals'
              ? 'bg-[#08294A] text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          <span>Pending Approvals</span>
          {approvals.filter((a) => a.status === 'pending').length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {approvals.filter((a) => a.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'reports'
              ? 'bg-[#08294A] text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          SLA Performance & Spend
        </button>
      </div>

      {/* Tab 1: Requests & Work Orders */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Recent Service Requests Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-soft">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Submitted Service Requests
            </h2>

            <div className="space-y-3">
              {requests.map((sr) => (
                <div
                  key={sr.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 hover:border-[#00B5A4] transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{sr.number}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">• {sr.category}</span>
                    </div>
                    <StatusBadge status={sr.status} />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{sr.description}</p>
                  
                  {/* Status Progress Stepper */}
                  <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="font-bold text-[#008F87]">1. Submitted ✔</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className={sr.status !== 'new' ? 'font-bold text-[#008F87]' : 'text-slate-400'}>
                      2. Triaged {sr.status !== 'new' && '✔'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className={sr.status === 'converted' ? 'font-bold text-[#008F87]' : 'text-slate-400'}>
                      3. Dispatched {sr.status === 'converted' && '✔'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Work Orders */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-soft">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live Maintenance Work Orders
            </h2>
            <DataTable
              data={workOrders}
              keyExtractor={(w) => w.id}
              columns={[
                { key: 'number', header: 'WO Number' },
                { key: 'category', header: 'Category' },
                { key: 'description', header: 'Scope' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (w) => <StatusBadge status={w.status} />,
                },
                { key: 'assigneeName', header: 'Assigned Supplier' },
                {
                  key: 'slaDue',
                  header: 'Due Target',
                  render: (w) => new Date(w.slaDue).toLocaleDateString(),
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Variation Approvals */}
      {activeTab === 'approvals' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-soft">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Work Order Variation & Quote Approvals
          </h2>

          <div className="space-y-3">
            {approvals.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{app.title}</div>
                  <div className="text-slate-500">Ref: {app.entityId} • Requested by: {app.requesterName}</div>
                  <div className="flex items-center gap-4 text-[11px] pt-1">
                    <span>Requested: <MoneyText cents={app.amountCents} className="font-bold text-slate-900 dark:text-slate-100" /></span>
                    <span>Remaining Budget: <MoneyText cents={app.budgetRemainingCents} className="text-emerald-600 font-bold" /></span>
                  </div>
                </div>

                {app.status === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApproveVariation(app.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition"
                    >
                      Approve Variation
                    </button>
                    <button
                      onClick={() => alert('Variation rejected')}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-rose-600 rounded-lg font-semibold hover:bg-rose-50"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    APPROVED
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-soft text-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            SLA Compliance & Spend Scorecard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-[#102747] dark:text-slate-300">Emergency P1 Response Adherence</span>
              <div className="text-2xl font-black text-[#102747]">100%</div>
              <p className="text-[11px] text-[#102747]">All emergency calls responded to within 60 minutes.</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-[#102747] dark:text-slate-300">First-Time Fix Rate</span>
              <div className="text-2xl font-black text-[#102747]">92.4%</div>
              <p className="text-[11px] text-[#102747]">Repairs completed without repeat failure within 14 days.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <CreateServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleAddRequest}
      />
    </div>
  );
};
