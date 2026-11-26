import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Download,
  ExternalLink,
  X,
  CheckCircle2,
  Bell,
  Mail,
  Send,
  Radio,
  Smartphone,
  ArrowRightLeft,
} from 'lucide-react';
import { ColumnsSlidersIcon } from '../../components/ui/ColumnsSlidersIcon';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { mockCommsCampaigns } from '../../lib/strataMockData';
import { CommsCampaign } from '../../types/strata';

interface CommunicationEngagementProps {
  initialTab?: 'comms' | 'portal' | 'notifications';
}

interface PortalUserItem {
  id: string;
  name: string;
  lot: string;
  role: string;
  lastActive: string;
  platform: string;
  bal: number;
  status: string;
}

interface SystemNotificationItem {
  id: string;
  type: string;
  trigger: string;
  target: string;
  time: string;
  severity: 'Warning' | 'Info' | 'High';
  status: string;
}

const TAB_COLUMNS: Record<string, Array<{ key: string; label: string }>> = {
  comms: [
    { key: 'campaignId', label: 'Campaign ID' },
    { key: 'title', label: 'Campaign Title' },
    { key: 'audience', label: 'Target Audience' },
    { key: 'channel', label: 'Channels' },
    { key: 'scheduled', label: 'Scheduled At' },
    { key: 'openRate', label: 'Open Rate' },
    { key: 'status', label: 'Status' },
  ],
  portal: [
    { key: 'user', label: 'Portal User' },
    { key: 'lot', label: 'Lot & Scheme' },
    { key: 'role', label: 'Role / Access' },
    { key: 'lastActive', label: 'Last Active' },
    { key: 'platform', label: 'App Platform' },
    { key: 'balance', label: 'Outstanding Balance' },
    { key: 'status', label: 'Status' },
  ],
  notifications: [
    { key: 'type', label: 'Notification Type' },
    { key: 'trigger', label: 'Trigger & Event' },
    { key: 'target', label: 'Target Recipients' },
    { key: 'time', label: 'Timestamp' },
    { key: 'severity', label: 'Severity' },
    { key: 'status', label: 'Status' },
  ],
};

const initialCampaigns: CommsCampaign[] = [
  {
    id: 'CMP-2026-01',
    title: 'AGM 2026 Notice & Digital Voting Invitation',
    schemeId: 'scheme-01',
    targetAudience: 'All Lot Owners',
    channel: 'email',
    recipientCount: 48,
    scheduledAt: '2026-11-17 09:00',
    status: 'sent',
    deliveredCount: 48,
    openRatePct: 87.5,
  },
  {
    id: 'CMP-2026-02',
    title: 'Emergency Main Valve Repair & Water Outage',
    schemeId: 'scheme-01',
    targetAudience: 'All Residents',
    channel: 'sms',
    recipientCount: 72,
    scheduledAt: '2026-11-25 07:15',
    status: 'sent',
    deliveredCount: 72,
    openRatePct: 98.6,
  },
  {
    id: 'CMP-2026-03',
    title: 'Annual Window Cleaning & Abseiling Schedule',
    schemeId: 'scheme-01',
    targetAudience: 'All Residents',
    channel: 'in_app',
    recipientCount: 96,
    scheduledAt: '2026-11-26 08:00',
    status: 'scheduled',
    deliveredCount: 0,
    openRatePct: 0,
  },
  {
    id: 'CMP-2026-04',
    title: 'Quarterly Admin & Sinking Levy Notices FY26-Q2',
    schemeId: 'scheme-01',
    targetAudience: 'All Lot Owners',
    channel: 'email',
    recipientCount: 48,
    scheduledAt: '2026-11-20 10:00',
    status: 'sent',
    deliveredCount: 48,
    openRatePct: 91.7,
  },
  {
    id: 'CMP-2026-05',
    title: 'P1 Fire Alarm Loudspeaker & Strobe Testing Alert',
    schemeId: 'scheme-01',
    targetAudience: 'Commercial & Residential Lots',
    channel: 'sms',
    recipientCount: 64,
    scheduledAt: '2026-11-27 11:00',
    status: 'scheduled',
    deliveredCount: 0,
    openRatePct: 0,
  },
  {
    id: 'CMP-2026-06',
    title: 'Draft Solar EV Charger By-Law & Committee Motion',
    schemeId: 'scheme-01',
    targetAudience: 'Executive Strata Committee',
    channel: 'email',
    recipientCount: 7,
    scheduledAt: '2026-12-05 14:00',
    status: 'draft',
    deliveredCount: 0,
    openRatePct: 0,
  },
  {
    id: 'CMP-2026-07',
    title: 'Basement Parking Gate Power Interruption Notice',
    schemeId: 'scheme-01',
    targetAudience: 'Car Space Licensees',
    channel: 'in_app',
    recipientCount: 40,
    scheduledAt: '2026-11-24 12:30',
    status: 'sent',
    deliveredCount: 40,
    openRatePct: 85.0,
  },
];

const initialPortalUsers: PortalUserItem[] = [
  { id: 'USR-OP-101', name: 'David & Lisa Wong', lot: 'Lot 101 - Horizon Towers', role: 'Lot Owner', lastActive: 'Today, 11:20 AM', platform: 'iOS PWA', bal: 0, status: 'Active' },
  { id: 'USR-OP-102', name: 'Elena Rostova', lot: 'Lot 102 - Horizon Towers', role: 'Committee Treasurer', lastActive: 'Yesterday', platform: 'Web Browser', bal: 0, status: 'Active' },
  { id: 'USR-OP-103', name: 'Marcus Vance', lot: 'Lot 204 - Pacific Sands', role: 'Investor Owner', lastActive: '5 days ago', platform: 'Android PWA', bal: 284000, status: 'In Arrears' },
  { id: 'USR-OP-104', name: 'Chloe Bennett', lot: 'Lot 205 - Pacific Sands', role: 'Lot Owner', lastActive: '2 hours ago', platform: 'iOS PWA', bal: 0, status: 'Active' },
  { id: 'USR-OP-105', name: 'Apex Commercial Properties', lot: 'Lot 301 - Commercial Plaza', role: 'Commercial Owner', lastActive: '10 days ago', platform: 'Web Browser', bal: 145000, status: 'In Arrears' },
];

const initialNotifications: SystemNotificationItem[] = [
  { id: 'notif-01', type: 'Arrears L2 Notice', trigger: 'Overdue >35 days (WF-08)', target: 'Manager & Lot 204 Owner', time: '10 mins ago', severity: 'Warning', status: 'Delivered' },
  { id: 'notif-02', type: 'Quarterly Levy Run', trigger: 'Scheduled Run Completed', target: 'Executive Committee', time: '1 hour ago', severity: 'Info', status: 'Delivered' },
  { id: 'notif-03', type: 'Bank Rec Discrepancy', trigger: 'Unmatched line >$1000', target: 'Strata Accountant', time: 'Yesterday', severity: 'High', status: 'Acknowledged' },
  { id: 'notif-04', type: 'Fire System Pressure Fault', trigger: 'Telemetry Sensor Alarm (Zone 4)', target: 'Facilities Manager & Contractor', time: '2 hours ago', severity: 'High', status: 'Delivered' },
];

export const CommunicationEngagement: React.FC<CommunicationEngagementProps> = ({
  initialTab = 'comms',
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'comms' | 'portal' | 'notifications'>(initialTab);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  type ModalType = 'new_campaign' | 'configure_alert' | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Stateful datasets
  const [campaignsList, setCampaignsList] = useState<CommsCampaign[]>(initialCampaigns);
  const [portalUsersList, setPortalUsersList] = useState<PortalUserItem[]>(initialPortalUsers);
  const [notificationsList, setNotificationsList] = useState<SystemNotificationItem[]>(initialNotifications);

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
    showToast(`Successfully executed "${actionName}" on ${selectedRowIds.length} item(s).`);
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

  // 1. Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaignsList.filter((cmp) => {
      if (filter === 'active') {
        // Active Broadcasts: scheduled and in-flight communications
        if (cmp.status !== 'scheduled') return false;
      } else if (filter === 'delivered') {
        // Delivered (100%): sent broadcasts with 100% confirmed delivery
        if (cmp.status !== 'sent' || (cmp.deliveredCount ?? 0) < cmp.recipientCount) return false;
      } else if (filter === 'urgent') {
        // Urgent Notices: SMS emergencies, fire alarm testing, critical water outages
        const isUrgent =
          cmp.channel === 'sms' ||
          cmp.title.toLowerCase().includes('emergency') ||
          cmp.title.toLowerCase().includes('urgent') ||
          cmp.title.toLowerCase().includes('fire') ||
          cmp.title.toLowerCase().includes('outage') ||
          cmp.title.toLowerCase().includes('water');
        if (!isUrgent) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          cmp.id.toLowerCase().includes(q) ||
          cmp.title.toLowerCase().includes(q) ||
          cmp.targetAudience.toLowerCase().includes(q) ||
          cmp.channel.toLowerCase().includes(q) ||
          cmp.status.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [campaignsList, filter, searchQuery]);

  // 2. Filtered Portal Users
  const filteredPortalUsers = useMemo(() => {
    return portalUsersList.filter((u) => {
      if (filter === 'active' && u.status !== 'Active') return false;
      if (filter === 'delivered' && u.bal !== 0) return false;
      if (filter === 'urgent' && u.bal === 0 && u.status !== 'In Arrears') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          u.id.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q) ||
          u.lot.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.platform.toLowerCase().includes(q) ||
          u.status.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [portalUsersList, filter, searchQuery]);

  // 3. Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notificationsList.filter((n) => {
      if (filter === 'active' && n.status !== 'Delivered' && n.status !== 'Acknowledged') return false;
      if (filter === 'delivered' && n.status !== 'Delivered') return false;
      if (filter === 'urgent' && n.severity !== 'Warning' && n.severity !== 'High') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          n.id.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q) ||
          n.trigger.toLowerCase().includes(q) ||
          n.target.toLowerCase().includes(q) ||
          n.severity.toLowerCase().includes(q) ||
          n.status.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notificationsList, filter, searchQuery]);

  const currentCount = useMemo(() => {
    if (activeTab === 'comms') return filteredCampaigns.length;
    if (activeTab === 'portal') return filteredPortalUsers.length;
    if (activeTab === 'notifications') return filteredNotifications.length;
    return 0;
  }, [activeTab, filteredCampaigns.length, filteredPortalUsers.length, filteredNotifications.length]);

  const handleExportCSV = () => {
    const cols = (TAB_COLUMNS[activeTab] || []).filter((c) => isColVisible(c.key));
    let rows: Record<string, any>[] = [];

    if (activeTab === 'comms') {
      rows = filteredCampaigns.map((c) => ({
        campaignId: c.id,
        title: c.title,
        audience: c.targetAudience,
        channel: c.channel.toUpperCase(),
        scheduled: c.scheduledAt,
        openRate: c.openRatePct ? `${c.openRatePct}%` : '87.5%',
        status: c.status,
      }));
    } else if (activeTab === 'portal') {
      rows = filteredPortalUsers.map((u) => ({
        user: u.name,
        lot: u.lot,
        role: u.role,
        lastActive: u.lastActive,
        platform: u.platform,
        balance: (u.bal / 100).toFixed(2),
        status: u.status,
      }));
    } else if (activeTab === 'notifications') {
      rows = filteredNotifications.map((n) => ({
        type: n.type,
        trigger: n.trigger,
        target: n.target,
        time: n.time,
        severity: n.severity,
        status: n.status,
      }));
    }

    const header = cols.map((c) => `"${c.label}"`).join(',');
    const body = rows.map((r) => cols.map((c) => `"${r[c.key] ?? ''}"`).join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(`${header}\n${body}`);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${activeTab}-comms-export.csv`);
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
              {activeTab === 'comms' && 'Communications & Campaigns Register'}
              {activeTab === 'portal' && 'Owner Portal PWA & Resident Self-Service'}
            </h2>
            <p className="text-xs text-[#71849A] font-medium mt-0.5 font-sans">
              {activeTab === 'comms' &&
                'Broadcast notices, merge-field email campaigns, and SMS delivery logs.'}
              {activeTab === 'portal' &&
                'Dedicated self-service portal for Lot Owners, Resident Occupiers, and Executive Committee members.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'portal' ? (
              <button
                type="button"
                onClick={() => {
                  showToast('✔ Launching Owner Portal PWA session for Lot 101...');
                  navigate('/owner-portal');
                }}
                className="bg-[#00B5A4] hover:bg-[#008F87] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch Owner Portal PWA</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'comms') setActiveModal('new_campaign');
                  else if (activeTab === 'notifications') setActiveModal('configure_alert');
                }}
                className="bg-[#00B5A4] hover:bg-[#008F87] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {activeTab === 'comms' && 'New Broadcast Campaign'}
                  {activeTab === 'notifications' && 'Configure Alert Rule'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills and Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 pb-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'active', label: 'Active Broadcasts' },
              { id: 'delivered', label: 'Delivered (100%)' },
              { id: 'urgent', label: 'Urgent Notices' },
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
              placeholder="Search campaigns, notices, alerts..."
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
              {activeTab === 'comms' && (
                <button
                  type="button"
                  onClick={() => handleBulkAction('Resend Broadcast Campaign')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#00B5A4]" />
                  <span>Resend Selected</span>
                </button>
              )}
              {activeTab === 'portal' && (
                <button
                  type="button"
                  onClick={() => handleBulkAction('Send PWA Login Magic Link')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#00B5A4]" />
                  <span>Send Magic Links</span>
                </button>
              )}
              {activeTab === 'notifications' && (
                <button
                  type="button"
                  onClick={() => handleBulkAction('Acknowledge Notifications')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00B5A4]" />
                  <span>Mark Acknowledged</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto border border-[#E5EEF5] rounded-xl">
          {activeTab === 'comms' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={filteredCampaigns.length > 0 && selectedRowIds.length === filteredCampaigns.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRowIds(filteredCampaigns.map((c) => c.id));
                        else setSelectedRowIds([]);
                      }}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('campaignId') && <th className="p-3">CAMPAIGN ID</th>}
                  {isColVisible('title') && <th className="p-3">CAMPAIGN TITLE</th>}
                  {isColVisible('audience') && <th className="p-3">TARGET AUDIENCE</th>}
                  {isColVisible('channel') && <th className="p-3">CHANNELS</th>}
                  {isColVisible('scheduled') && <th className="p-3">SCHEDULED AT</th>}
                  {isColVisible('openRate') && <th className="p-3 text-left">OPEN RATE</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-xs text-slate-400">
                      No campaigns matching your filter.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((cmp) => {
                    const isSelected = selectedRowIds.includes(cmp.id);
                    return (
                      <tr
                        key={cmp.id}
                        className={cn('transition cursor-pointer group', isSelected ? 'bg-[#F0FAF8]' : 'hover:bg-[#F8FAFC]')}
                        onClick={() => {
                          setSelectedRowIds((prev) =>
                            prev.includes(cmp.id) ? prev.filter((k) => k !== cmp.id) : [...prev, cmp.id]
                          );
                        }}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedRowIds((prev) =>
                                prev.includes(cmp.id) ? prev.filter((k) => k !== cmp.id) : [...prev, cmp.id]
                              );
                            }}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('campaignId') && <td className="p-3 font-mono font-bold text-[#102747]">{cmp.id}</td>}
                        {isColVisible('title') && <td className="p-3 font-bold text-[#102747]">{cmp.title}</td>}
                        {isColVisible('audience') && <td className="p-3 font-medium text-[#102747] font-bold">{cmp.targetAudience}</td>}
                        {isColVisible('channel') && (
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px] uppercase">
                              {cmp.channel}
                            </span>
                          </td>
                        )}
                        {isColVisible('scheduled') && <td className="p-3 font-mono text-[#102747] font-bold">{cmp.scheduledAt}</td>}
                        {isColVisible('openRate') && (
                          <td className="p-3 text-left font-mono font-bold text-emerald-700">
                            {cmp.openRatePct !== undefined && cmp.openRatePct > 0
                              ? `${cmp.openRatePct}%`
                              : cmp.status === 'scheduled'
                              ? <span className="text-cyan-700 font-sans font-medium text-[11px]">Scheduled</span>
                              : <span className="text-slate-400 font-sans">—</span>}
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span
                              className={cn(
                                'inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap capitalize',
                                cmp.status === 'sent'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : cmp.status === 'scheduled'
                                  ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              )}
                            >
                              {cmp.status}
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

          {activeTab === 'portal' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={filteredPortalUsers.length > 0 && selectedRowIds.length === filteredPortalUsers.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRowIds(filteredPortalUsers.map((u) => u.id));
                        else setSelectedRowIds([]);
                      }}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('user') && <th className="p-3">PORTAL USER</th>}
                  {isColVisible('lot') && <th className="p-3 whitespace-nowrap">LOT</th>}
                  {isColVisible('role') && <th className="p-3">ROLE</th>}
                  {isColVisible('lastActive') && <th className="p-3">LAST ACTIVE</th>}
                  {isColVisible('platform') && <th className="p-3">APP PLATFORM</th>}
                  {isColVisible('balance') && <th className="p-3">OUTSTANDING BALANCE</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredPortalUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-xs text-slate-400">
                      No portal users matching your filter.
                    </td>
                  </tr>
                ) : (
                  filteredPortalUsers.map((u) => {
                    const isSelected = selectedRowIds.includes(u.id);
                    return (
                      <tr
                        key={u.id}
                        className={cn('transition cursor-pointer group', isSelected ? 'bg-[#F0FAF8]' : 'hover:bg-[#F8FAFC]')}
                        onClick={() => {
                          setSelectedRowIds((prev) =>
                            prev.includes(u.id) ? prev.filter((k) => k !== u.id) : [...prev, u.id]
                          );
                        }}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedRowIds((prev) =>
                                prev.includes(u.id) ? prev.filter((k) => k !== u.id) : [...prev, u.id]
                              );
                            }}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('user') && <td className="p-3 font-bold text-[#102747]">{u.name}</td>}
                        {isColVisible('lot') && <td className="p-3 font-medium text-[#102747] font-bold">{u.lot}</td>}
                        {isColVisible('role') && (
                          <td className="p-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px] whitespace-nowrap">
                              {u.role}
                            </span>
                          </td>
                        )}
                        {isColVisible('lastActive') && <td className="p-3 font-mono text-[#102747] font-bold">{u.lastActive}</td>}
                        {isColVisible('platform') && <td className="p-3 font-mono text-[#00B5A4]">{u.platform}</td>}
                        {isColVisible('balance') && (
                          <td className="p-3 font-mono font-bold">
                            {u.bal > 0 ? (
                              <span className="text-rose-600">${(u.bal / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            ) : (
                              <span className="text-emerald-600">$0.00</span>
                            )}
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              {u.status}
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

          {activeTab === 'notifications' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={filteredNotifications.length > 0 && selectedRowIds.length === filteredNotifications.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRowIds(filteredNotifications.map((n) => n.id));
                        else setSelectedRowIds([]);
                      }}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('type') && <th className="p-3">NOTIFICATION TYPE</th>}
                  {isColVisible('trigger') && <th className="p-3">TRIGGER</th>}
                  {isColVisible('target') && <th className="p-3">TARGET RECIPIENTS</th>}
                  {isColVisible('time') && <th className="p-3">TIMESTAMP</th>}
                  {isColVisible('severity') && <th className="p-3 text-left">SEVERITY</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredNotifications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-xs text-slate-400">
                      No notifications matching your filter.
                    </td>
                  </tr>
                ) : (
                  filteredNotifications.map((n) => {
                    const isSelected = selectedRowIds.includes(n.id);
                    return (
                      <tr
                        key={n.id}
                        className={cn('transition cursor-pointer group', isSelected ? 'bg-[#F0FAF8]' : 'hover:bg-[#F8FAFC]')}
                        onClick={() => {
                          setSelectedRowIds((prev) =>
                            prev.includes(n.id) ? prev.filter((k) => k !== n.id) : [...prev, n.id]
                          );
                        }}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedRowIds((prev) =>
                                prev.includes(n.id) ? prev.filter((k) => k !== n.id) : [...prev, n.id]
                              );
                            }}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('type') && <td className="p-3 font-bold text-[#102747]">{n.type}</td>}
                        {isColVisible('trigger') && <td className="p-3 font-medium text-[#102747] font-bold">{n.trigger}</td>}
                        {isColVisible('target') && <td className="p-3 text-[#102747] font-bold">{n.target}</td>}
                        {isColVisible('time') && <td className="p-3 font-mono text-[#102747] font-bold">{n.time}</td>}
                        {isColVisible('severity') && (
                          <td className="p-3 text-left">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded text-[11px] font-bold border',
                                n.severity === 'High'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : n.severity === 'Warning'
                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              )}
                            >
                              {n.severity}
                            </span>
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              {n.status}
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
                  {activeModal === 'new_campaign' && <Mail className="w-5 h-5 text-[#00B5A4]" />}
                  {activeModal === 'configure_alert' && <Bell className="w-5 h-5 text-[#00B5A4]" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102747]">
                    {activeModal === 'new_campaign' && 'New Broadcast Campaign'}
                    {activeModal === 'configure_alert' && 'Configure Automated Alert Rule'}
                  </h3>
                  <p className="text-[11px] text-[#71849A]">
                    {activeModal === 'new_campaign' && 'Broadcast email and SMS notices to residents with live merge tags'}
                    {activeModal === 'configure_alert' && 'Real-time threshold monitoring and proactive notification triggers'}
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
              {activeModal === 'new_campaign' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newC: CommsCampaign = {
                      id: `cmp-${Math.floor(10 + Math.random() * 90)}`,
                      title: 'Notice: Annual Fire Alarm Testing & Evacuation Drill',
                      schemeId: 'scheme-01',
                      targetAudience: 'All Residents & Owners',
                      channel: 'email',
                      recipientCount: 48,
                      scheduledAt: new Date().toISOString(),
                      status: 'sent',
                      deliveredCount: 48,
                      openRatePct: 92,
                    };
                    setCampaignsList((prev) => [newC, ...prev]);
                    showToast('✔ Broadcast campaign created and queued for 48 recipients.');
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      Campaign Subject / Title
                    </label>
                    <input
                      type="text"
                      defaultValue="Notice: Annual Fire Alarm Testing & Evacuation Drill"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Target Audience
                      </label>
                      <select
                        defaultValue="all"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="all">All Residents & Owners (48 Lots)</option>
                        <option value="owners">Owner-Occupiers Only</option>
                        <option value="investors">Non-Resident Investor Owners</option>
                        <option value="committee">Strata Committee Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Delivery Channels
                      </label>
                      <select
                        defaultValue="both"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="both">Email + SMS Multi-Channel</option>
                        <option value="email">Email Only</option>
                        <option value="sms">SMS Only</option>
                        <option value="pwa">PWA Push Notification</option>
                      </select>
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
                      Schedule Broadcast Now
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'configure_alert' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newAlert: SystemNotificationItem = {
                      id: `notif-${Math.floor(10 + Math.random() * 90)}`,
                      type: 'Overdue Arrears Alert Rule',
                      trigger: 'Overdue >30 days threshold exceeded',
                      target: 'Strata Manager & Treasurer',
                      time: 'Just now',
                      severity: 'Warning',
                      status: 'Delivered',
                    };
                    setNotificationsList((prev) => [newAlert, ...prev]);
                    showToast('✔ Alert rule configured and activated across all schemes.');
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      Event / Trigger Condition
                    </label>
                    <select
                      defaultValue="arrears"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                    >
                      <option value="arrears">Levy Arrears Overdue &gt; 30 Days (Level 2)</option>
                      <option value="bankrec">Trust Bank Discrepancy &gt; $100.00</option>
                      <option value="workorder">P1 Work Order SLA Elapsed &gt; 80%</option>
                      <option value="compliance">Contractor Public Liability Insurance Expiring &lt; 14 Days</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Severity Level
                      </label>
                      <select
                        defaultValue="warning"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="warning">Warning (Amber Alert)</option>
                        <option value="high">Critical / High (Red Alert)</option>
                        <option value="info">Informational</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Notification Target
                      </label>
                      <input
                        type="text"
                        defaultValue="Strata Manager & Treasurer"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-time webhook and instant notification queue enabled.</span>
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
                      Activate Alert Rule
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
