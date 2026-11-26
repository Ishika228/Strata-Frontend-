import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  Check,
  Wrench,
  Building2,
  Calendar,
  ArrowRightLeft,
  Edit3,
} from 'lucide-react';
import { ColumnsSlidersIcon } from '../../components/ui/ColumnsSlidersIcon';
import { cn } from '../../lib/utils';
import {
  mockStrataWorkOrders,
  mockStrataMeetings,
  mockStrataSuppliers,
} from '../../lib/strataMockData';
import { StrataWorkOrder, StrataMeeting } from '../../types/strata';
import { Supplier } from '../../types/common';

interface OperationsManagementProps {
  initialTab?: 'works' | 'suppliers' | 'meetings';
}

const TAB_COLUMNS: Record<string, Array<{ key: string; label: string }>> = {
  works: [
    { key: 'orderNumber', label: 'WO Number' },
    { key: 'title', label: 'Job Title & Scope' },
    { key: 'property', label: 'Property' },
    { key: 'contractor', label: 'Contractor / Assignee' },
    { key: 'amount', label: 'Approved Amount' },
    { key: 'status', label: 'Status' },
    { key: 'sla', label: 'SLA Countdown' },
  ],
  suppliers: [
    { key: 'code', label: 'Supplier Code' },
    { key: 'name', label: 'Company Name' },
    { key: 'trades', label: 'Trades & Specialty' },
    { key: 'taxId', label: 'ABN / Tax ID' },
    { key: 'tier', label: 'Compliance Tier' },
    { key: 'rating', label: 'Rating' },
    { key: 'status', label: 'Status' },
  ],
  meetings: [
    { key: 'ref', label: 'Meeting Ref' },
    { key: 'scheme', label: 'Meeting Type & Scheme' },
    { key: 'date', label: 'Scheduled Date' },
    { key: 'notice', label: 'Notice Issued (21d Rule)' },
    { key: 'quorum', label: 'Quorum' },
    { key: 'motions', label: 'Motions' },
    { key: 'status', label: 'Status' },
  ],
};

export const OperationsManagement: React.FC<OperationsManagementProps> = ({
  initialTab = 'works',
}) => {
  const [activeTab, setActiveTab] = useState<'works' | 'suppliers' | 'meetings'>(initialTab);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  type ModalType = 'create_work_order' | 'onboard_supplier' | 'schedule_meeting' | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Stateful datasets for instant reactive additions
  const [workOrdersList, setWorkOrdersList] = useState<StrataWorkOrder[]>(mockStrataWorkOrders);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(mockStrataSuppliers);
  const [meetingsList, setMeetingsList] = useState<StrataMeeting[]>(mockStrataMeetings);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    Object.keys(TAB_COLUMNS).forEach((tab) => {
      init[tab] = TAB_COLUMNS[tab].map((c) => c.key);
    });
    return init;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleBulkAction = (actionName: string) => {
    showToast(`Successfully processed "${actionName}" for ${selectedRowIds.length} selected record(s).`);
    setSelectedRowIds([]);
  };

  useEffect(() => {
    setActiveTab(initialTab);
    setFilter('all');
    setSearchQuery('');
    setSelectedRowIds([]);
    setShowColumnPicker(false);
  }, [initialTab]);

  useEffect(() => {
    setSelectedRowIds([]);
  }, [activeTab, filter, searchQuery]);

  const isColVisible = (colKey: string) => {
    const current = visibleColumns[activeTab];
    if (!current) return true;
    return current.includes(colKey);
  };

  const toggleColumn = (colKey: string) => {
    const current = visibleColumns[activeTab] || (TAB_COLUMNS[activeTab] || []).map((c) => c.key);
    if (current.includes(colKey) && current.length <= 1) return;
    const next = current.includes(colKey)
      ? current.filter((k) => k !== colKey)
      : [...current, colKey];
    setVisibleColumns((prev) => ({ ...prev, [activeTab]: next }));
  };

  const resetColumns = () => {
    const allKeys = (TAB_COLUMNS[activeTab] || []).map((c) => c.key);
    setVisibleColumns((prev) => ({ ...prev, [activeTab]: allKeys }));
  };

  // 1. Filtered Work Orders
  const filteredWorkOrders = useMemo(() => {
    return workOrdersList.filter((wo) => {
      if (filter === 'active' && wo.status !== 'issued' && wo.status !== 'accepted') {
        return false;
      }
      if (filter === 'attention' && wo.status !== 'draft') {
        return false;
      }
      if (filter === 'urgent') {
        const isUrgent =
          wo.approvedAmountCents > 150000 ||
          wo.title.toLowerCase().includes('emergency') ||
          wo.title.toLowerCase().includes('leak') ||
          wo.title.toLowerCase().includes('sensor');
        if (!isUrgent) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const amtStr = `$${(wo.approvedAmountCents / 100).toLocaleString()}`.toLowerCase();
        return (
          wo.orderNumber.toLowerCase().includes(q) ||
          wo.title.toLowerCase().includes(q) ||
          (wo.supplierName && wo.supplierName.toLowerCase().includes(q)) ||
          wo.status.toLowerCase().includes(q) ||
          wo.status.replace('_', ' ').toLowerCase().includes(q) ||
          amtStr.includes(q) ||
          'horizon towers complex'.includes(q)
        );
      }
      return true;
    });
  }, [workOrdersList, filter, searchQuery]);

  // 2. Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliersList.filter((sup) => {
      if (filter === 'active' && sup.complianceStatus !== 'compliant') return false;
      if (filter === 'attention' && sup.complianceStatus === 'compliant') return false;
      if (filter === 'urgent' && !sup.trades.includes('Fire Safety') && !sup.trades.includes('Electrical')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const tradesStr = sup.trades.join(' ').toLowerCase();
        return (
          sup.id.toLowerCase().includes(q) ||
          sup.name.toLowerCase().includes(q) ||
          sup.taxId.toLowerCase().includes(q) ||
          tradesStr.includes(q) ||
          sup.complianceStatus.toLowerCase().includes(q) ||
          'tier 1 approved'.includes(q)
        );
      }
      return true;
    });
  }, [suppliersList, filter, searchQuery]);

  // 3. Filtered Meetings
  const filteredMeetings = useMemo(() => {
    return meetingsList.filter((m) => {
      if (filter === 'active' && m.status !== 'notice_issued' && m.status !== 'open') return false;
      if (filter === 'attention') {
        const isQuorumPending = m.lotsRepresented < m.totalLots * (m.quorumPercentage / 100);
        if (!isQuorumPending) return false;
      }
      if (filter === 'urgent' && m.type !== 'agm' && m.type !== 'egm') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          m.id.toLowerCase().includes(q) ||
          m.type.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.scheduledAt.toLowerCase().includes(q) ||
          m.status.toLowerCase().includes(q) ||
          'horizon towers complex'.includes(q)
        );
      }
      return true;
    });
  }, [meetingsList, filter, searchQuery]);

  const currentCount = useMemo(() => {
    if (activeTab === 'works') return filteredWorkOrders.length;
    if (activeTab === 'suppliers') return filteredSuppliers.length;
    if (activeTab === 'meetings') return filteredMeetings.length;
    return 0;
  }, [activeTab, filteredWorkOrders.length, filteredSuppliers.length, filteredMeetings.length]);

  const handleExportCSV = () => {
    const cols = (TAB_COLUMNS[activeTab] || []).filter((c) => isColVisible(c.key));
    let rows: Record<string, any>[] = [];

    if (activeTab === 'works') {
      rows = filteredWorkOrders.map((wo) => ({
        orderNumber: wo.orderNumber,
        title: wo.title,
        property: 'Horizon Towers Complex',
        contractor: wo.supplierName || 'Pending',
        amount: (wo.approvedAmountCents / 100).toFixed(2),
        status: wo.status.replace('_', ' '),
        sla: '5h 21m left',
      }));
    } else if (activeTab === 'suppliers') {
      rows = filteredSuppliers.map((s) => ({
        code: s.id,
        name: s.name,
        trades: s.trades.join('; '),
        taxId: s.taxId,
        tier: 'Tier 1 Approved',
        rating: '4.9',
        status: 'Compliant',
      }));
    } else if (activeTab === 'meetings') {
      rows = filteredMeetings.map((m) => ({
        ref: m.id,
        scheme: `${m.type.toUpperCase()} - Horizon Towers Complex`,
        date: m.scheduledAt,
        notice: '✔ Notice Sent 24d prior',
        quorum: m.lotsRepresented >= m.totalLots * (m.quorumPercentage / 100) ? '✔ Met' : 'Pending',
        motions: `${m.motionsCount} Motions`,
        status: m.status.replace('_', ' '),
      }));
    }

    const header = cols.map((c) => `"${c.label}"`).join(',');
    const body = rows.map((r) => cols.map((c) => `"${r[c.key] ?? ''}"`).join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(`${header}\n${body}`);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${activeTab}-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Main Register Card matching the screenshot style */}
      <div className="bg-white rounded-xl border border-[#E5EEF5] p-5 shadow-[0_1px_3px_rgba(8,41,74,0.03)]">
        {/* Top Header: Title, Description, and Primary CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F0F5FA]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#102747] font-sans">
              {activeTab === 'works' && 'Works & Procurement Register'}
              {activeTab === 'suppliers' && 'Suppliers & Approved Trades Network'}
              {activeTab === 'meetings' && 'Meetings & Digital Voting Register (AGM / EGM)'}
            </h2>
            <p className="text-xs text-[#71849A] font-medium mt-0.5 font-sans">
              {activeTab === 'works' &&
                'Strata quote requests, quote comparison matrices (BR-ST-17 ≥2 quotes), and issued work orders.'}
              {activeTab === 'suppliers' &&
                'Approved strata contractors, public liability insurance tracking, WHS licenses, and trade ratings.'}
              {activeTab === 'meetings' &&
                'Statutory meeting scheduling (21 days notice check), pre-poll digital voting, proxies, and minutes.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'works') setActiveModal('create_work_order');
                else if (activeTab === 'suppliers') setActiveModal('onboard_supplier');
                else if (activeTab === 'meetings') setActiveModal('schedule_meeting');
              }}
              className="bg-[#00B5A4] hover:bg-[#008F87] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === 'works' && 'Create Work Order / RFQ'}
                {activeTab === 'suppliers' && 'Onboard New Trade'}
                {activeTab === 'meetings' && 'Schedule Meeting / AGM'}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Pills and Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 pb-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'active', label: 'Active only' },
              { id: 'attention', label: 'Needs attention' },
              { id: 'urgent', label: 'P1 Urgent' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${filter === f.id
                    ? 'bg-[#E6F8F6] text-[#008F87] border border-[#00B5A4]/40 font-bold'
                    : 'text-[#71849A] hover:bg-[#F4F8FC] hover:text-[#102747]'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, contractor, meeting..."
              className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#102747] placeholder:text-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Records Count & Action Buttons */}
        <div className="flex items-center justify-between text-xs text-[#71849A] pt-1 pb-3 border-t border-[#F0F5FA]">
          <span className="font-medium">
            Showing <strong className="text-[#102747]">{currentCount}</strong> records
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D5E5F2] bg-white hover:bg-[#F4F8FC] text-[#102747] font-bold text-xs transition cursor-pointer shadow-xs select-none"
            >
              <Download className="w-4 h-4 text-[#00B5A4]" />
              <span>Export CSV</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColumnPicker((prev) => !prev)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-xs select-none',
                  showColumnPicker
                    ? 'bg-[#E6F8F6] border-[#00B5A4] text-[#008F87]'
                    : 'bg-white border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747]'
                )}
              >
                <ColumnsSlidersIcon className={cn('w-4 h-4', showColumnPicker ? 'text-[#008F87]' : 'text-[#00B5A4]')} />
                <span>Columns</span>
              </button>

              {showColumnPicker && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowColumnPicker(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 z-40 w-60 p-3 bg-white border border-[#D5E5F2] rounded-xl shadow-[0_10px_25px_rgba(8,41,74,0.12)] space-y-2 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#F0F5FA]">
                      <span className="text-[11px] font-bold text-[#102747] uppercase tracking-wider">
                        Visible Columns
                      </span>
                      <button
                        type="button"
                        onClick={resetColumns}
                        className="text-[11px] text-[#00B5A4] hover:text-[#008F87] font-semibold cursor-pointer hover:underline"
                      >
                        Reset All
                      </button>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-0.5">
                      {(TAB_COLUMNS[activeTab] || []).map((col) => {
                        const checked = isColVisible(col.key);
                        return (
                          <label
                            key={col.key}
                            className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-[#F4F8FC] rounded-lg cursor-pointer transition select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleColumn(col.key)}
                              className="rounded text-[#00B5A4] focus:ring-[#00B5A4] w-3.5 h-3.5 accent-[#00B5A4] cursor-pointer"
                            />
                            <span
                              className={cn(
                                'text-xs',
                                checked
                                  ? 'font-medium text-[#102747]'
                                  : 'text-slate-400 line-through decoration-slate-300'
                              )}
                            >
                              {col.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contextual Action Bar when records are selected */}
        {selectedRowIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-3 bg-[#E6F8F6] border border-[#00B5A4]/40 rounded-xl transition-all shadow-xs animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00B5A4] text-white font-bold text-xs shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{selectedRowIds.length} {selectedRowIds.length === 1 ? 'record' : 'records'} selected</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedRowIds([])}
                className="text-xs text-[#008F87] hover:text-[#102747] font-semibold underline underline-offset-2 cursor-pointer transition"
              >
                Clear selection
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-[#334B68] uppercase tracking-wider hidden sm:inline mr-1">
                Actions:
              </span>
              {activeTab === 'works' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Batch Dispatch to Trade')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#00B5A4]" />
                    <span>Dispatch RFQ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Approve Work Orders')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Approve Selected</span>
                  </button>
                </>
              )}
              {activeTab === 'suppliers' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Verify Compliance & COI')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00B5A4]" />
                    <span>Verify COI</span>
                  </button>
                </>
              )}
              {activeTab === 'meetings' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Send 21d Statutory Notice')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#00B5A4]" />
                    <span>Dispatch Notices</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto border border-[#E5EEF5] rounded-xl">
          {activeTab === 'works' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={filteredWorkOrders.length > 0 && selectedRowIds.length === filteredWorkOrders.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRowIds(filteredWorkOrders.map((w) => w.id));
                        else setSelectedRowIds([]);
                      }}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('orderNumber') && <th className="p-3">WO NUMBER</th>}
                  {isColVisible('title') && <th className="p-3">JOB TITLE</th>}
                  {isColVisible('property') && <th className="p-3">PROPERTY</th>}
                  {isColVisible('contractor') && <th className="p-3">CONTRACTOR</th>}
                  {isColVisible('amount') && <th className="p-3">APPROVED AMOUNT</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                  {isColVisible('sla') && <th className="p-3 text-left">SLA COUNTDOWN</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredWorkOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-xs text-slate-400">
                      No work orders matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredWorkOrders.map((wo) => {
                    const isSelected = selectedRowIds.includes(wo.id);
                    return (
                      <tr
                        key={wo.id}
                        className={cn('transition cursor-pointer group', isSelected ? 'bg-[#F0FAF8]' : 'hover:bg-[#F8FAFC]')}
                        onClick={() => {
                          setSelectedRowIds((prev) =>
                            prev.includes(wo.id) ? prev.filter((k) => k !== wo.id) : [...prev, wo.id]
                          );
                        }}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedRowIds((prev) =>
                                prev.includes(wo.id) ? prev.filter((k) => k !== wo.id) : [...prev, wo.id]
                              );
                            }}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('orderNumber') && <td className="p-3 font-mono font-bold text-[#102747]">{wo.orderNumber}</td>}
                        {isColVisible('title') && <td className="p-3 font-bold text-[#102747]">{wo.title}</td>}
                        {isColVisible('property') && <td className="p-3 font-medium text-[#102747] font-bold">Horizon Towers Complex</td>}
                        {isColVisible('contractor') && <td className="p-3 font-medium text-slate-800">{wo.supplierName || 'Pending Selection'}</td>}
                        {isColVisible('amount') && (
                          <td className="p-3 font-mono font-black text-[#102747]">
                            ${(wo.approvedAmountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 whitespace-nowrap">
                              {wo.status.replace('_', ' ')}
                            </span>
                          </td>
                        )}
                        {isColVisible('sla') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200 whitespace-nowrap">
                              5h 21m left
                            </span>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'suppliers' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={filteredSuppliers.length > 0 && selectedRowIds.length === filteredSuppliers.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRowIds(filteredSuppliers.map((s) => s.id));
                        else setSelectedRowIds([]);
                      }}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('code') && <th className="p-3">SUPPLIER CODE</th>}
                  {isColVisible('name') && <th className="p-3">COMPANY NAME</th>}
                  {isColVisible('trades') && <th className="p-3">TRADES</th>}
                  {isColVisible('taxId') && <th className="p-3">TAX ID</th>}
                  {isColVisible('tier') && <th className="p-3">COMPLIANCE TIER</th>}
                  {isColVisible('rating') && <th className="p-3 text-left">RATING</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-xs text-slate-400">
                      No suppliers matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((sup) => {
                    const isSelected = selectedRowIds.includes(sup.id);
                    return (
                      <tr
                        key={sup.id}
                        className={cn('transition cursor-pointer group', isSelected ? 'bg-[#F0FAF8]' : 'hover:bg-[#F8FAFC]')}
                        onClick={() => {
                          setSelectedRowIds((prev) =>
                            prev.includes(sup.id) ? prev.filter((k) => k !== sup.id) : [...prev, sup.id]
                          );
                        }}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedRowIds((prev) =>
                                prev.includes(sup.id) ? prev.filter((k) => k !== sup.id) : [...prev, sup.id]
                              );
                            }}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('code') && <td className="p-3 font-mono font-bold text-[#102747]">{sup.id}</td>}
                        {isColVisible('name') && <td className="p-3 font-bold text-[#102747]">{sup.name}</td>}
                        {isColVisible('trades') && (
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {sup.trades.map((t, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                        )}
                        {isColVisible('taxId') && <td className="p-3 font-mono text-[#102747] font-bold">{sup.taxId}</td>}
                        {isColVisible('tier') && (
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Tier 1 Approved
                            </span>
                          </td>
                        )}
                        {isColVisible('rating') && (
                          <td className="p-3 text-left font-bold text-emerald-700 font-mono">
                            ★ 4.9
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              Compliant
                            </span>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'meetings' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={filteredMeetings.length > 0 && selectedRowIds.length === filteredMeetings.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRowIds(filteredMeetings.map((m) => m.id));
                        else setSelectedRowIds([]);
                      }}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('ref') && <th className="p-3">MEETING REF</th>}
                  {isColVisible('scheme') && <th className="p-3">MEETING TYPE</th>}
                  {isColVisible('date') && <th className="p-3">SCHEDULED DATE</th>}
                  {isColVisible('notice') && <th className="p-3">NOTICE ISSUED</th>}
                  {isColVisible('quorum') && <th className="p-3 text-left">QUORUM</th>}
                  {isColVisible('motions') && <th className="p-3 text-left">MOTIONS</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredMeetings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-xs text-slate-400">
                      No meetings matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredMeetings.map((m) => {
                    const isSelected = selectedRowIds.includes(m.id);
                    return (
                      <tr
                        key={m.id}
                        className={cn('transition cursor-pointer group', isSelected ? 'bg-[#F0FAF8]' : 'hover:bg-[#F8FAFC]')}
                        onClick={() => {
                          setSelectedRowIds((prev) =>
                            prev.includes(m.id) ? prev.filter((k) => k !== m.id) : [...prev, m.id]
                          );
                        }}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedRowIds((prev) =>
                                prev.includes(m.id) ? prev.filter((k) => k !== m.id) : [...prev, m.id]
                              );
                            }}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('ref') && <td className="p-3 font-mono font-bold text-[#102747]">{m.id}</td>}
                        {isColVisible('scheme') && (
                          <td className="p-3">
                            <div className="font-bold text-[#102747] uppercase">{m.type}</div>
                            <div className="text-[11px] text-[#71849A]">Horizon Towers Complex</div>
                          </td>
                        )}
                        {isColVisible('date') && <td className="p-3 font-mono font-bold text-slate-800">{m.scheduledAt}</td>}
                        {isColVisible('notice') && (
                          <td className="p-3 text-emerald-700 font-semibold text-[11px]">
                            ✔ Notice Sent 24d prior
                          </td>
                        )}
                        {isColVisible('quorum') && (
                          <td className="p-3 text-left font-mono font-bold text-[#102747] font-bold">
                            {m.lotsRepresented >= m.totalLots * (m.quorumPercentage / 100) ? '✔ Met' : 'Pending'}
                          </td>
                        )}
                        {isColVisible('motions') && (
                          <td className="p-3 text-left font-mono font-bold text-[#00B5A4]">
                            {m.motionsCount} Motions
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              {m.status.replace('_', ' ')}
                            </span>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Interactive Action Modals for Fast Execution */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start p-4 bg-[#061D33]/70 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,41,74,0.25)] border border-[#D5E5F2] overflow-hidden z-10 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F5FA] bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] text-[#008F87] flex items-center justify-center font-bold">
                  {activeModal === 'create_work_order' && <Wrench className="w-5 h-5 text-[#00B5A4]" />}
                  {activeModal === 'onboard_supplier' && <Building2 className="w-5 h-5 text-[#00B5A4]" />}
                  {activeModal === 'schedule_meeting' && <Calendar className="w-5 h-5 text-[#00B5A4]" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102747]">
                    {activeModal === 'create_work_order' && 'Create Work Order / RFQ Dispatch'}
                    {activeModal === 'onboard_supplier' && 'Onboard New Approved Contractor'}
                    {activeModal === 'schedule_meeting' && 'Schedule General Meeting (AGM / EGM)'}
                  </h3>
                  <p className="text-[11px] text-[#71849A]">
                    {activeModal === 'create_work_order' && 'Issue RFQ or work order with automated contractor SLA tracking'}
                    {activeModal === 'onboard_supplier' && 'Register tradesperson with public liability insurance verification'}
                    {activeModal === 'schedule_meeting' && 'Statutory 21-day notice, digital pre-poll voting & agenda'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body & Forms */}
            <div className="p-6 space-y-4">
              {activeModal === 'create_work_order' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newWO: StrataWorkOrder = {
                      id: `swo-${Date.now().toString().slice(-4)}`,
                      orderNumber: `SWO-${Math.floor(8800 + Math.random() * 1000)}`,
                      schemeId: 'scheme-01',
                      supplierId: 'sup-01',
                      supplierName: 'Apex Fire & Safety Services',
                      title: 'Emergency Lift Sensor & Hydraulic Overhaul',
                      scope: 'Inspect sensor failure, replace hydraulic seals, and calibrate car level sensors',
                      location: 'Tower B Passenger Lift',
                      approvedAmountCents: 285000,
                      status: 'issued' as const,
                      createdAt: new Date().toISOString(),
                    };
                    setWorkOrdersList((prev) => [newWO, ...prev]);
                    showToast(`✔ Work Order ${newWO.orderNumber} created & dispatched with P1 Urgent SLA.`);
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      Job Title & Scope
                    </label>
                    <input
                      type="text"
                      defaultValue="Emergency Lift Sensor & Hydraulic Overhaul"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Contractor / Trade
                      </label>
                      <select
                        defaultValue="apex"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="apex">Apex Fire & Safety Services</option>
                        <option value="kone">KONE Elevators NSW</option>
                        <option value="rapid">Rapid Drainage & Plumbing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Approved Budget ($)
                      </label>
                      <input
                        type="text"
                        defaultValue="$2,850.00"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Priority Tier
                      </label>
                      <select
                        defaultValue="p1"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="p1">P1 Urgent (6-hour SLA)</option>
                        <option value="p2">P2 Routine (48-hour SLA)</option>
                        <option value="p3">P3 Scheduled PPM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Scheme Location
                      </label>
                      <input
                        type="text"
                        defaultValue="Horizon Towers - Tower B"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#71849A] hover:bg-[#F4F8FC] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#00B5A4] hover:bg-[#008F87] text-white shadow-xs transition cursor-pointer active:scale-95"
                    >
                      Issue Work Order Now
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'onboard_supplier' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newSup: Supplier = {
                      id: `sup-${Math.floor(10 + Math.random() * 90)}`,
                      name: 'Sydney Coastal Fire & Safety Co',
                      taxId: '45 819 204 112',
                      trades: ['Fire Protection', 'Emergency Lighting'],
                      email: 'service@sydneyfire.com.au',
                      phone: '+61 2 9482 1100',
                      address: '22 George St, Sydney NSW 2000',
                      complianceStatus: 'compliant',
                      expiringNext: '2027-11-28',
                      openWOsCount: 2,
                    };
                    setSuppliersList((prev) => [newSup, ...prev]);
                    showToast('✔ Trade Sydney Coastal Fire & Safety Co onboarded with Tier 1 compliance verified.');
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Sydney Coastal Fire & Safety Co"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        ABN / Tax ID
                      </label>
                      <input
                        type="text"
                        defaultValue="45 819 204 112"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Trade Specialty
                      </label>
                      <input
                        type="text"
                        defaultValue="Fire Protection, ESM"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-[#E6F8F6] rounded-xl border border-[#00B5A4]/30 text-xs text-[#008F87] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00B5A4] shrink-0" />
                    <span>Public Liability ($20M) & WHS certificates verified automatically via SafeWork.</span>
                  </div>
                  <div className="flex items-center justify-start gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#71849A] hover:bg-[#F4F8FC] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#00B5A4] hover:bg-[#008F87] text-white shadow-xs transition cursor-pointer active:scale-95"
                    >
                      Onboard Contractor Now
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'schedule_meeting' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newMtg: StrataMeeting = {
                      id: `mtg-${Math.floor(10 + Math.random() * 90)}`,
                      schemeId: 'scheme-01',
                      schemeCode: 'SP-52891',
                      schemeName: 'Horizon Towers Complex',
                      type: 'agm',
                      title: '2026 Annual General Meeting',
                      scheduledAt: '2026-12-18T18:30:00+11:00',
                      mode: 'hybrid',
                      location: 'Level 1 Residents Lounge & Digital Poll',
                      noticeSentAt: new Date().toISOString(),
                      recordDate: new Date().toISOString(),
                      quorumPercentage: 25,
                      totalLots: 48,
                      lotsRepresented: 24,
                      status: 'notice_issued' as const,
                      motionsCount: 8,
                    };
                    setMeetingsList((prev) => [newMtg, ...prev]);
                    showToast('✔ AGM scheduled: Digital notice with 21-day rule & agenda dispatched to all 48 owners.');
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Meeting Type
                      </label>
                      <select
                        defaultValue="agm"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="agm">Annual General Meeting (AGM)</option>
                        <option value="egm">Extraordinary General Meeting (EGM)</option>
                        <option value="sc">Strata Committee Meeting</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Scheduled Date & Time
                      </label>
                      <input
                        type="text"
                        defaultValue="18 Dec 2026, 6:30 PM"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Statutory Notice
                      </label>
                      <input
                        type="text"
                        defaultValue="23 Days (21-Day Rule OK)"
                        readOnly
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] rounded-xl px-3 py-2 text-xs text-emerald-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Motions Count
                      </label>
                      <input
                        type="text"
                        defaultValue="8 Motions on Agenda"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Digital voting portal & proxy pre-poll link will be emailed to all lot owners.</span>
                  </div>
                  <div className="flex items-center justify-start gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#71849A] hover:bg-[#F4F8FC] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#00B5A4] hover:bg-[#008F87] text-white shadow-xs transition cursor-pointer active:scale-95"
                    >
                      Schedule & Issue Notice
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast feedback popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#102747] text-white rounded-xl shadow-[0_10px_25px_rgba(8,41,74,0.3)] animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#00B5A4] shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
