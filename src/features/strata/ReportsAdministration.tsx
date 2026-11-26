import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Settings,
  Plus,
  Search,
  Download,
  CheckCircle2,
  FileText,
  Shield,
  Building2,
  Landmark,
  ShieldCheck,
  AlertCircle,
  Clock,
  ExternalLink,
  X,
} from 'lucide-react';
import { ColumnsSlidersIcon } from '../../components/ui/ColumnsSlidersIcon';

interface ReportsAdministrationProps {
  initialTab?: 'statements' | 'users' | 'system';
  initialSubTab?: 'rules' | 'jurisdictions' | 'banking' | 'gst';
}

// ----------------------------------------------------
// Authentic Strata Datasets from docs/03-strata
// ----------------------------------------------------

interface StatutoryRuleItem {
  id: string;
  name: string;
  jurisdiction: string;
  value: string;
  reference: string;
  enforcement: string;
  status: 'Active' | 'Under Review' | 'Enforced';
}

const STATUTORY_RULES_DATA: StatutoryRuleItem[] = [
  {
    id: 'RULE-01',
    name: 'Overdue Levy Penalty Interest',
    jurisdiction: 'NSW Schemes',
    value: '10.00% p.a. simple interest',
    reference: 'NSW SSMA 2015 s85',
    enforcement: 'Automated Daily Accrual',
    status: 'Active',
  },
  {
    id: 'RULE-02',
    name: 'Statutory AGM Notice Lead Period',
    jurisdiction: 'All Australian Schemes',
    value: '21 Clear Days Minimum',
    reference: 'NSW SSMA 2015 Sch 1 / BCCM',
    enforcement: 'Notice Validation on Distribution',
    status: 'Active',
  },
  {
    id: 'RULE-03',
    name: 'Arrears Escalation Protocol',
    jurisdiction: 'National Standard',
    value: 'L0 Reminder → L1 → L2 → L3 Legal',
    reference: 'Strata Debt Recovery Guideline',
    enforcement: 'Automated Nightly Scheduler',
    status: 'Active',
  },
  {
    id: 'RULE-04',
    name: 'Statutory Quorum Requirement',
    jurisdiction: 'NSW & ACT Schemes',
    value: '25% of Lot Entitlements or Owners Present',
    reference: 'NSW SSMA 2015 s73',
    enforcement: 'Real-Time Meeting Roll Call Verification',
    status: 'Active',
  },
  {
    id: 'RULE-05',
    name: 'Capital Works Fund 10-Year Plan',
    jurisdiction: 'NSW, VIC (Tier 1-2), QLD',
    value: 'Mandatory 10-Year Sinking Forecast',
    reference: 'NSW SSMA 2015 s77 / VIC OCA',
    enforcement: 'Annual AGM Review Requirement',
    status: 'Active',
  },
  {
    id: 'RULE-06',
    name: 'Building Insurance Replacement Valuation',
    jurisdiction: 'All Jurisdictions',
    value: 'Independent Valuation ≤ 5 Years',
    reference: 'NSW SSMA 2015 s161',
    enforcement: '90-Day Pre-Expiry Notification',
    status: 'Active',
  },
  {
    id: 'RULE-07',
    name: 'Special Levy Expenditure Threshold',
    jurisdiction: 'All Jurisdictions',
    value: 'Special Resolution',
    reference: 'NSW SSMA 2015 s81 / BCCM Act',
    enforcement: 'Ballot Tally Verification Gate',
    status: 'Active',
  },
];

interface JurisdictionItem {
  id: string;
  name: string;
  legislation: string;
  docFormat: string;
  tribunal: string;
  sinkingFundRule: string;
  status: 'Active' | 'Operational';
}

const JURISDICTIONS_DATA: JurisdictionItem[] = [
  {
    id: 'NSW',
    name: 'New South Wales',
    legislation: 'Strata Schemes Management Act 2015 & Dev Act 2015',
    docFormat: 'SP [Number]',
    tribunal: 'NCAT',
    sinkingFundRule: 'Mandatory 10-Year Capital Works Fund Plan',
    status: 'Active',
  },
  {
    id: 'QLD',
    name: 'Queensland',
    legislation: 'Body Corporate & Community Management Act 1997',
    docFormat: 'CTS [Number]',
    tribunal: 'BCCM Commissioner / QCAT',
    sinkingFundRule: 'Mandatory Sinking Fund 10-Year Forecast',
    status: 'Active',
  },
  {
    id: 'VIC',
    name: 'Victoria',
    legislation: 'Owners Corporations Act 2006 (Amended 2021)',
    docFormat: 'OC [Number]',
    tribunal: 'VCAT',
    sinkingFundRule: 'Tier 1 & Tier 2 Mandatory Maintenance Plan',
    status: 'Active',
  },
  {
    id: 'WA',
    name: 'Western Australia',
    legislation: 'Strata Titles Act 1985 (STA 1985 / 2018 Reforms)',
    docFormat: 'SP [Number]',
    tribunal: 'SAT',
    sinkingFundRule: 'Mandatory Reserve Fund for Schemes 10+ Lots',
    status: 'Active',
  },
  {
    id: 'ACT',
    name: 'Australian Capital Territory',
    legislation: 'Unit Titles (Management) Act 2011 (UTMA 2011)',
    docFormat: 'UP [Number]',
    tribunal: 'ACAT',
    sinkingFundRule: 'Mandatory Sinking Fund & General Fund',
    status: 'Active',
  },
  {
    id: 'SA',
    name: 'South Australia',
    legislation: 'Strata Titles Act 1988 & Community Titles Act 1996',
    docFormat: 'CT / SP [Number]',
    tribunal: 'SACAT',
    sinkingFundRule: 'Sinking Fund Mandatory for >10 Lots',
    status: 'Active',
  },
];

interface BankingFeedItem {
  id: string;
  institution: string;
  protocol: string;
  matchingAlgorithm: string;
  dailySchedule: string;
  autoMatchRate: string;
  status: 'Connected & Live' | 'Active' | 'Syncing';
}

const BANKING_FEEDS_DATA: BankingFeedItem[] = [
  {
    id: 'FEED-MCQ',
    institution: 'Macquarie Bank',
    protocol: 'Host-to-Host BAI2 / MT940 & Virtual Account API',
    matchingAlgorithm: '16-Digit DEFT CRN + Exact Lot Reference Auto-Allocation',
    dailySchedule: '04:30 AEST Daily',
    autoMatchRate: '99.4% Auto-Match',
    status: 'Connected & Live',
  },
  {
    id: 'FEED-NAB',
    institution: 'National Australia Bank',
    protocol: 'Direct SFTP MT940 Daily & ABA Batch Payouts',
    matchingAlgorithm: 'ABA Reference + Supplier BSB/Account Validation',
    dailySchedule: '05:00 AEST Daily',
    autoMatchRate: '98.2% Auto-Match',
    status: 'Connected & Live',
  },
  {
    id: 'FEED-CBA',
    institution: 'Commonwealth Bank',
    protocol: 'CommBiz API / MT940 Balance & Txn Ingestion',
    matchingAlgorithm: 'BSB + Account + Lot Reference Double-Entry Match',
    dailySchedule: '05:15 AEST Daily',
    autoMatchRate: '97.8% Auto-Match',
    status: 'Connected & Live',
  },
  {
    id: 'FEED-WBC',
    institution: 'Westpac Banking Corp',
    protocol: 'Daily Secure FTP Bank Feed & NPP Instant Webhooks',
    matchingAlgorithm: 'PayID & Fast Payment CRN Auto-Match',
    dailySchedule: '05:00 AEST Daily',
    autoMatchRate: '98.0% Auto-Match',
    status: 'Connected & Live',
  },
  {
    id: 'FEED-ANZ',
    institution: 'ANZ Transactive Core Banking',
    protocol: 'SWIFT MT940 Transmission Protocol',
    matchingAlgorithm: 'Transaction Narration & Lot Tokenization Match',
    dailySchedule: '06:00 AEST Daily',
    autoMatchRate: '96.5% Auto-Match',
    status: 'Connected & Live',
  },
  {
    id: 'FEED-BOQ',
    institution: 'Bank of Queensland',
    protocol: 'Direct BAI2 Electronic Statement Feed',
    matchingAlgorithm: 'Cheque & Direct Deposit Allocation Rules',
    dailySchedule: '06:30 AEST Daily',
    autoMatchRate: '95.1% Auto-Match',
    status: 'Connected & Live',
  },
];

interface GstComplianceItem {
  id: string;
  category: string;
  requirement: string;
  parameter: string;
  authority: string;
  dueDate: string;
  status: 'Compliant' | 'Enforced & Locked' | 'Ready for Filing' | 'In Progress';
}

const GST_COMPLIANCE_DATA: GstComplianceItem[] = [
  {
    id: 'GST-001',
    category: 'Goods & Services Tax',
    requirement: 'Mandatory ATO Registration for turnover > $150k p.a.',
    parameter: '10.00% AU Rate',
    authority: 'ATO',
    dueDate: 'Quarterly BAS',
    status: 'Compliant',
  },
  {
    id: 'GST-002',
    category: 'Business Activity Statement',
    requirement: 'Automated G1 / 1A / 1B Tax Statement Preparation',
    parameter: 'Quarterly Electronic ATO SBR Lodgement Export Format',
    authority: 'Australian Taxation Office',
    dueDate: 'Q2 Due: 28 Feb 2027',
    status: 'Ready for Filing',
  },
  {
    id: 'TRST-003',
    category: 'Trust Account Period Lock',
    requirement: 'Strict Monthly Period Close',
    parameter: '$0.00 Unreconciled Bank Variance Requirement',
    authority: 'NSW Fair Trading / PSRA Act',
    dueDate: 'Period Closed: Oct 2026',
    status: 'Enforced & Locked',
  },
  {
    id: 'AUD-004',
    category: '7-Year Statutory Audit Retention',
    requirement: 'Complete Tamper-Proof Cryptographic Ledgers & Minutes',
    parameter: '7 Years Statutory Record Keeping Obligation',
    authority: 'NSW SSMA 2015 s180 / Corp Act',
    dueDate: 'Annual External Audit 2026',
    status: 'Compliant',
  },
  {
    id: 'INSP-005',
    category: 'Annual Fire Safety Statement',
    requirement: 'Statutory Essential Fire Services Certification',
    parameter: '100% Asset Inspection Pass Requirement',
    authority: 'Local Council & Fire Authority',
    dueDate: 'Due: 15 Dec 2026',
    status: 'In Progress',
  },
  {
    id: 'WHS-006',
    category: 'Common Property Safety & Asbestos Register',
    requirement: 'Statutory Asbestos Management Plan & WHS Compliance',
    parameter: 'Mandatory for schemes built pre-2004',
    authority: 'SafeWork NSW / WorkSafe',
    dueDate: 'Re-audit: 10 Jan 2027',
    status: 'Compliant',
  },
];

// Reports data
const REPORTS_DATA = [
  {
    code: 'RPT-ST-01',
    name: 'Aged Debtors Summary Report',
    type: 'debtors',
    scheme: 'All Schemes',
    freq: 'Monthly / On Demand',
    date: '24 Nov 2026',
    format: 'PDF, CSV, Excel',
    status: 'Ready',
  },
  {
    code: 'RPT-ST-02',
    name: 'Trust Fund Balance Sheet',
    type: 'balance',
    scheme: 'Horizon Towers Complex',
    freq: 'Quarterly',
    date: '24 Nov 2026',
    format: 'PDF, CSV',
    status: 'Ready',
  },
  {
    code: 'RPT-ST-03',
    name: 'Income & Expenditure Statement',
    type: 'income',
    scheme: 'Horizon Towers Complex',
    freq: 'Monthly',
    date: '20 Nov 2026',
    format: 'PDF, CSV',
    status: 'Ready',
  },
  {
    code: 'RPT-ST-04',
    name: 'Statutory Strata Roll & Entitlements Ledger',
    type: 'roll',
    scheme: 'Pacific Sands',
    freq: 'Annual / AGM',
    date: '15 Nov 2026',
    format: 'PDF',
    status: 'Ready',
  },
  {
    code: 'RPT-ST-05',
    name: 'Bank Reconciliation Audit Trial Balance',
    type: 'audit',
    scheme: 'Parkview Estate',
    freq: 'Monthly Statutory Close',
    date: '10 Nov 2026',
    format: 'PDF, CSV',
    status: 'Ready',
  },
];

// Users data
const USERS_DATA = [
  {
    name: 'Ishika Bhatia',
    category: 'staff',
    role: 'System Administrator',
    email: 'ishika.bhatia@vertexstrata.com.au',
    perms: 'Full Superadmin',
    last: 'Active Now',
    status: 'Active',
  },
  {
    name: 'Sarah Jenkins',
    category: 'managers',
    role: 'Strata Portfolio Manager',
    email: 's.jenkins@vertexstrata.com.au',
    perms: 'Horizon Towers, Pacific Sands',
    last: 'Today, 09:15 AM',
    status: 'Active',
  },
  {
    name: 'Tom Bradley',
    category: 'staff',
    role: 'Trust Accountant',
    email: 't.bradley@vertexstrata.com.au',
    perms: 'Trust Accounting & Banking Feeds',
    last: 'Yesterday',
    status: 'Active',
  },
  {
    name: 'Elena Rostova',
    category: 'committee',
    role: 'Executive Committee',
    email: 'elena.rostova@horizon.com.au',
    perms: 'Scheme SP 52891 Approvals',
    last: '2 days ago',
    status: 'Active',
  },
  {
    name: 'Marcus Vance',
    category: 'committee',
    role: 'Strata Committee Chairperson',
    email: 'm.vance@pacificsands.com.au',
    perms: 'CTS 41920 AGM & Approvals',
    last: '3 days ago',
    status: 'Active',
  },
];

export const ReportsAdministration: React.FC<ReportsAdministrationProps> = ({
  initialTab = 'statements',
  initialSubTab = 'rules',
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'statements' | 'users' | 'system'>(initialTab);
  const [systemSubTab, setSystemSubTab] = useState<'rules' | 'jurisdictions' | 'banking' | 'gst'>(
    initialSubTab
  );
  const [genericFilter, setGenericFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Live state lists so all "+ Add / Generate / Connect" actions persist in UI
  const [reports, setReports] = useState(REPORTS_DATA);
  const [users, setUsers] = useState(USERS_DATA);
  const [rules, setRules] = useState(STATUTORY_RULES_DATA);
  const [jurisdictions, setJurisdictions] = useState(JURISDICTIONS_DATA);
  const [bankingFeeds, setBankingFeeds] = useState(BANKING_FEEDS_DATA);
  const [gstCompliance, setGstCompliance] = useState(GST_COMPLIANCE_DATA);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Sync state if initialTab or route changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Sync with search params for tab & user filtering
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (activeTab === 'statements') {
      const tabParam = params.get('tab');
      if (tabParam && ['all', 'debtors', 'balance', 'income', 'roll', 'audit'].includes(tabParam)) {
        setGenericFilter(tabParam);
      } else {
        setGenericFilter('all');
      }
    } else if (activeTab === 'users') {
      const filterParam = params.get('filter');
      if (filterParam && ['all', 'staff', 'managers', 'committee'].includes(filterParam)) {
        setGenericFilter(filterParam);
      } else {
        setGenericFilter('all');
      }
    }
  }, [location.search, activeTab]);

  // Sync sub-tab based on URL path or initialSubTab prop
  useEffect(() => {
    if (initialSubTab) {
      setSystemSubTab(initialSubTab);
    } else if (location.pathname.includes('/jurisdictions')) {
      setSystemSubTab('jurisdictions');
    } else if (location.pathname.includes('/banking')) {
      setSystemSubTab('banking');
    } else if (location.pathname.includes('/gst')) {
      setSystemSubTab('gst');
    } else if (location.pathname.includes('/rules')) {
      setSystemSubTab('rules');
    }
  }, [initialSubTab, location.pathname]);

  // Handler when clicking a system submodule pill
  const handleSystemSubTabClick = (tab: 'rules' | 'jurisdictions' | 'banking' | 'gst') => {
    setSystemSubTab(tab);
    navigate(`/app/settings/${tab}`);
  };

  const handleOpenCreateModal = () => {
    if (activeTab === 'statements') {
      setFormData({
        name: '',
        type: 'debtors',
        scheme: 'All Schemes',
        freq: 'Monthly / On Demand',
        format: 'PDF, CSV',
      });
    } else if (activeTab === 'users') {
      setFormData({
        name: '',
        email: '',
        role: 'Strata Portfolio Manager',
        category: 'staff',
        perms: 'Portfolio & Levy Management',
      });
    } else if (systemSubTab === 'rules') {
      setFormData({
        name: '',
        jurisdiction: 'NSW',
        value: '',
        reference: '',
        enforcement: 'Automated',
      });
    } else if (systemSubTab === 'jurisdictions') {
      setFormData({
        id: '',
        name: '',
        legislation: '',
        docFormat: '',
        tribunal: '',
        sinkingFundRule: '',
      });
    } else if (systemSubTab === 'banking') {
      setFormData({
        id: '',
        institution: '',
        protocol: 'Direct BAI2 / API Feed',
        matchingAlgorithm: 'BSB + Lot Reference Auto-Match',
        dailySchedule: '05:30 AEST Daily',
      });
    } else {
      setFormData({
        id: '',
        category: '',
        requirement: '',
        parameter: '',
        authority: 'ATO / State Authority',
        dueDate: 'Quarterly',
        status: 'Compliant',
      });
    }
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'statements') {
      const nextNum = String(reports.length + 1).padStart(2, '0');
      setReports((prev) => [
        {
          code: `RPT-ST-${nextNum}`,
          name: formData.name.trim() || 'Custom Financial Statement',
          type: formData.type || 'debtors',
          scheme: formData.scheme.trim() || 'All Schemes (Portfolio)',
          freq: formData.freq || 'On Demand',
          date: '25 Nov 2026',
          format: formData.format || 'PDF, CSV',
          status: 'Ready',
        },
        ...prev,
      ]);
    } else if (activeTab === 'users') {
      setUsers((prev) => [
        {
          name: formData.name.trim() || 'New User',
          category: formData.category || 'staff',
          role: formData.role.trim() || 'Portfolio Manager',
          email: formData.email.trim() || 'user@vertexstrata.com.au',
          perms: formData.perms.trim() || 'Standard Access',
          last: 'Active Now',
          status: 'Active',
        },
        ...prev,
      ]);
    } else if (systemSubTab === 'rules') {
      const nextNum = String(rules.length + 1).padStart(2, '0');
      setRules((prev) => [
        {
          id: `BR-ST-${nextNum}`,
          name: formData.name.trim() || 'New Statutory Rule',
          jurisdiction: formData.jurisdiction || 'NSW',
          value: formData.value.trim() || '10.00% Statutory',
          reference: formData.reference.trim() || 'SSMA 2015',
          enforcement: formData.enforcement.trim() || 'Automated',
          status: 'Active',
        },
        ...prev,
      ]);
    } else if (systemSubTab === 'jurisdictions') {
      setJurisdictions((prev) => [
        {
          id: (formData.id.trim() || 'TAS').toUpperCase(),
          name: formData.name.trim() || 'Tasmania',
          legislation: formData.legislation.trim() || 'Strata Titles Act 1998',
          docFormat: formData.docFormat.trim() || 'Strata Plan (SP)',
          tribunal: formData.tribunal.trim() || 'TASCAT',
          sinkingFundRule: formData.sinkingFundRule.trim() || 'Statutory Sinking Fund Plan',
          status: 'Active',
        },
        ...prev,
      ]);
    } else if (systemSubTab === 'banking') {
      setBankingFeeds((prev) => [
        {
          id: (formData.id.trim() || `FEED-${prev.length + 1}`).toUpperCase(),
          institution: formData.institution.trim() || 'Bendigo Bank Business',
          protocol: formData.protocol.trim() || 'Direct BAI2 / API Feed',
          matchingAlgorithm: formData.matchingAlgorithm.trim() || 'Lot Reference Auto-Match',
          dailySchedule: formData.dailySchedule.trim() || '05:30 AEST Daily',
          autoMatchRate: '98.0% Auto-Match',
          status: 'Connected & Live',
        },
        ...prev,
      ]);
    } else {
      setGstCompliance((prev) => [
        {
          id: (formData.id.trim() || `POL-00${prev.length + 1}`).toUpperCase(),
          category: formData.category.trim() || 'Statutory Compliance Policy',
          requirement: formData.requirement.trim() || 'Mandatory Statutory Requirement',
          parameter: formData.parameter.trim() || '100% Compliance Threshold',
          authority: formData.authority.trim() || 'ATO / State Authority',
          dueDate: formData.dueDate.trim() || 'Quarterly',
          status: (formData.status as GstComplianceItem['status']) || 'Compliant',
        },
        ...prev,
      ]);
    }
    setIsCreateModalOpen(false);
  };

  // Filtered Statutory Rules
  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.jurisdiction.toLowerCase().includes(q) ||
        r.reference.toLowerCase().includes(q) ||
        r.value.toLowerCase().includes(q)
      );
    });
  }, [rules, searchQuery]);

  // Filtered Jurisdictions
  const filteredJurisdictions = useMemo(() => {
    return jurisdictions.filter((j) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        j.id.toLowerCase().includes(q) ||
        j.name.toLowerCase().includes(q) ||
        j.legislation.toLowerCase().includes(q) ||
        j.tribunal.toLowerCase().includes(q) ||
        j.docFormat.toLowerCase().includes(q)
      );
    });
  }, [jurisdictions, searchQuery]);

  // Filtered Banking Feeds
  const filteredBankingFeeds = useMemo(() => {
    return bankingFeeds.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.institution.toLowerCase().includes(q) ||
        b.protocol.toLowerCase().includes(q) ||
        b.matchingAlgorithm.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
      );
    });
  }, [bankingFeeds, searchQuery]);

  // Filtered GST & Compliance
  const filteredGstCompliance = useMemo(() => {
    return gstCompliance.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        g.id.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.requirement.toLowerCase().includes(q) ||
        g.authority.toLowerCase().includes(q) ||
        g.status.toLowerCase().includes(q)
      );
    });
  }, [gstCompliance, searchQuery]);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter((rpt) => {
      const matchesFilter = genericFilter === 'all' || rpt.type === genericFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rpt.code.toLowerCase().includes(q) ||
        rpt.name.toLowerCase().includes(q) ||
        rpt.scheme.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [reports, genericFilter, searchQuery]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesFilter =
        genericFilter === 'all' ||
        (genericFilter === 'staff'
          ? u.category === 'staff' || u.category === 'managers'
          : u.category === genericFilter);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [users, genericFilter, searchQuery]);

  // Calculate current records count
  const currentCount = useMemo(() => {
    if (activeTab === 'statements') return filteredReports.length;
    if (activeTab === 'users') return filteredUsers.length;
    if (activeTab === 'system') {
      if (systemSubTab === 'rules') return filteredRules.length;
      if (systemSubTab === 'jurisdictions') return filteredJurisdictions.length;
      if (systemSubTab === 'banking') return filteredBankingFeeds.length;
      if (systemSubTab === 'gst') return filteredGstCompliance.length;
    }
    return 0;
  }, [
    activeTab,
    systemSubTab,
    filteredReports,
    filteredUsers,
    filteredRules,
    filteredJurisdictions,
    filteredBankingFeeds,
    filteredGstCompliance,
  ]);

  return (
    <div className="space-y-4">
      {/* Main Register Card matching the screenshot style */}
      <div className="bg-white rounded-xl border border-[#E5EEF5] p-5 shadow-[0_1px_3px_rgba(8,41,74,0.03)]">
        {/* Top Header: Title, Description, and Primary CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F0F5FA]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#102747] font-sans">
              {activeTab === 'statements' && 'Reports & Financial Statements'}
              {activeTab === 'users' && 'Users & Roles Administration'}
              {activeTab === 'system' && (
                <>
                  {systemSubTab === 'rules' && 'Statutory Rules & Interest Calculations'}
                  {systemSubTab === 'jurisdictions' && 'State & Territory Jurisdictions'}
                  {systemSubTab === 'banking' && 'Electronic Banking Feeds & Direct Entry'}
                  {systemSubTab === 'gst' && 'GST, BAS & Statutory Compliance Settings'}
                </>
              )}
            </h2>
            <p className="text-xs text-[#71849A] font-medium mt-0.5 font-sans">
              {activeTab === 'statements' &&
                'Statutory aged debtors report (RPT-ST-01), Trust Fund Balance Sheet, Income & Expenditure, and Levy Roll statements.'}
              {activeTab === 'users' &&
                'Manage staff administrators, strata portfolio managers, committee member logins, and RBAC permissions.'}
              {activeTab === 'system' && (
                <>
                  {systemSubTab === 'rules' &&
                    'Statutory parameters governing 10.00% simple interest accruals, 21-day AGM notice periods, quorum, and arrears escalation.'}
                  {systemSubTab === 'jurisdictions' &&
                    'Australian state and territory regulatory frameworks: NSW (SSMA 2015), QLD (BCCM 1997), VIC (OCA 2006), and WA.'}
                  {systemSubTab === 'banking' &&
                    'Automated Macquarie DEFT, NAB Connect, CommBiz, and Westpac BAI2 / MT940 daily transaction feeds and reconciliations.'}
                  {systemSubTab === 'gst' &&
                    'ATO 10% GST fund treatment, quarterly BAS SBR lodgement, trust account period locks, and 7-year audit retention.'}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreateModal}
              className="bg-[#00B5A4] hover:bg-[#008F87] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === 'statements' && 'Generate Report'}
                {activeTab === 'users' && 'Add System User'}
                {activeTab === 'system' && (
                  <>
                    {systemSubTab === 'rules' && 'Add Statutory Rule'}
                    {systemSubTab === 'jurisdictions' && 'Configure Jurisdiction'}
                    {systemSubTab === 'banking' && 'Connect Banking Feed'}
                    {systemSubTab === 'gst' && 'Add Compliance Policy'}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Pills and Search Bar Row (Matches User Images) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 pb-3">
          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
            {activeTab === 'statements' && (
              <>
                {[
                  { id: 'all', label: 'All Reports' },
                  { id: 'debtors', label: 'Aged Debtors' },
                  { id: 'balance', label: 'Balance Sheets' },
                  { id: 'income', label: 'Income & Expenditure' },
                  { id: 'roll', label: 'Strata Roll' },
                  { id: 'audit', label: 'Audit Records' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setGenericFilter(f.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                      genericFilter === f.id
                        ? 'bg-[#E6F8F6] text-[#008F87] border border-[#00B5A4]/40 font-bold'
                        : 'text-[#71849A] hover:bg-[#F4F8FC] hover:text-[#102747]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </>
            )}

            {activeTab === 'users' && (
              <>
                {[
                  { id: 'all', label: 'All Users' },
                  { id: 'staff', label: 'Staff & Managers' },
                  { id: 'committee', label: 'Committee Members' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setGenericFilter(f.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                      genericFilter === f.id
                        ? 'bg-[#E6F8F6] text-[#008F87] border border-[#00B5A4]/40 font-bold'
                        : 'text-[#71849A] hover:bg-[#F4F8FC] hover:text-[#102747]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </>
            )}

            {/* System / Settings Tab Pills: EXACTLY matching media_1795512678161_5e0060f7.png */}
            {activeTab === 'system' && (
              <>
                {[
                  { id: 'rules', label: 'Statutory Rules' },
                  { id: 'jurisdictions', label: 'Jurisdictions' },
                  { id: 'banking', label: 'Banking Feeds' },
                  { id: 'gst', label: 'GST & Compliance' },
                ].map((f) => {
                  const isSelected = systemSubTab === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() =>
                        handleSystemSubTabClick(
                          f.id as 'rules' | 'jurisdictions' | 'banking' | 'gst'
                        )
                      }
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-[#E6F8F6] text-[#008F87] border border-[#00B5A4]/50 font-bold shadow-2xs'
                          : 'text-[#5A6E85] hover:bg-[#F4F8FC] hover:text-[#102747] border border-transparent'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Search Input with Dynamic Placeholder */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'statements'
                  ? 'Search reports by code, name...'
                  : activeTab === 'users'
                  ? 'Search users by name, role...'
                  : systemSubTab === 'rules'
                  ? 'Search rules by reference, name...'
                  : systemSubTab === 'jurisdictions'
                  ? 'Search jurisdictions by state...'
                  : systemSubTab === 'banking'
                  ? 'Search feeds by bank, protocol...'
                  : 'Search compliance by rule, ATO...'
              }
              className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#102747] placeholder:text-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Records Count & Action Buttons */}
        <div className="flex items-center justify-between text-xs text-[#71849A] pt-1 pb-3 border-t border-[#F0F5FA]">
          <span className="font-medium">
            Showing <strong className="text-[#102747]">{currentCount}</strong> records
          </span>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D5E5F2] bg-white hover:bg-[#F4F8FC] text-[#102747] font-bold text-xs transition cursor-pointer shadow-xs select-none">
              <Download className="w-4 h-4 text-[#00B5A4]" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D5E5F2] bg-white hover:bg-[#F4F8FC] text-[#102747] font-bold text-xs transition cursor-pointer shadow-xs select-none">
              <ColumnsSlidersIcon className="w-4 h-4 text-[#00B5A4]" />
              <span>Columns</span>
            </button>
          </div>
        </div>

        {/* Dynamic Data Tables */}
        <div className="overflow-x-auto border border-[#E5EEF5] rounded-xl">
          {/* TAB 1: STATEMENTS */}
          {activeTab === 'statements' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                  </th>
                  <th className="p-3">REPORT CODE</th>
                  <th className="p-3">REPORT NAME</th>
                  <th className="p-3">SCHEME</th>
                  <th className="p-3">FREQUENCY</th>
                  <th className="p-3">LAST GENERATED</th>
                  <th className="p-3 text-left">FORMATS</th>
                  <th className="p-3 text-left">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredReports.map((rpt) => (
                  <tr key={rpt.code} className="hover:bg-[#F8FAFC] transition cursor-pointer group">
                    <td className="p-3 text-left">
                      <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                    </td>
                    <td className="p-3 font-mono font-bold text-[#102747]">{rpt.code}</td>
                    <td className="p-3 font-bold text-[#102747] group-hover:text-[#00B5A4] transition">
                      {rpt.name}
                    </td>
                    <td className="p-3 font-medium text-[#102747] font-bold">{rpt.scheme}</td>
                    <td className="p-3 font-mono text-[#102747] font-bold">{rpt.freq}</td>
                    <td className="p-3 font-mono text-[#102747] font-bold">{rpt.date}</td>
                    <td className="p-3 text-left">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                        {rpt.format}
                      </span>
                    </td>
                    <td className="p-3 text-left">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rpt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 2: USERS & ROLES */}
          {activeTab === 'users' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                  </th>
                  <th className="p-3">USER NAME</th>
                  <th className="p-3">ASSIGNED ROLE</th>
                  <th className="p-3">EMAIL ADDRESS</th>
                  <th className="p-3">PERMISSIONS</th>
                  <th className="p-3">LAST ACTIVE</th>
                  <th className="p-3 text-left">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredUsers.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition cursor-pointer group">
                    <td className="p-3 text-left">
                      <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                    </td>
                    <td className="p-3 font-bold text-[#102747]">{s.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {s.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[#102747] font-bold">{s.email}</td>
                    <td className="p-3 font-medium text-[#102747] font-bold">{s.perms}</td>
                    <td className="p-3 font-mono text-emerald-700 font-bold">{s.last}</td>
                    <td className="p-3 text-left">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 3: SYSTEM SETTINGS WITH 4 CLICKABLE SUBMODULES */}
          {activeTab === 'system' && (
            <>
              {/* SUBMODULE 1: STATUTORY RULES */}
              {systemSubTab === 'rules' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                      <th className="p-3 w-8 text-left">
                        <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                      </th>
                      <th className="p-3">RULE ID</th>
                      <th className="p-3">STATUTORY RULE</th>
                      <th className="p-3">JURISDICTION</th>
                      <th className="p-3">CONFIGURATION</th>
                      <th className="p-3">STATUTORY REFERENCE</th>
                      <th className="p-3">ENFORCEMENT</th>
                      <th className="p-3 text-left">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5FA]">
                    {filteredRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-[#F8FAFC] transition cursor-pointer group">
                        <td className="p-3 text-left">
                          <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                        </td>
                        <td className="p-3 font-mono font-bold text-[#102747]">{rule.id}</td>
                        <td className="p-3 font-bold text-[#102747] group-hover:text-[#00B5A4] transition">
                          {rule.name}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {rule.jurisdiction}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-[#00B5A4]">{rule.value}</td>
                        <td className="p-3 font-medium text-[#102747] font-bold">{rule.reference}</td>
                        <td className="p-3 text-[#102747] font-bold font-sans">{rule.enforcement}</td>
                        <td className="p-3 text-left">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {rule.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* SUBMODULE 2: JURISDICTIONS (Matches User Image 2) */}
              {systemSubTab === 'jurisdictions' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                      <th className="p-3 w-8 text-left">
                        <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                      </th>
                      <th className="p-3">CODE</th>
                      <th className="p-3">STATE</th>
                      <th className="p-3">GOVERNING LEGISLATION</th>
                      <th className="p-3">SCHEME NOMENCLATURE</th>
                      <th className="p-3">STATUTORY TRIBUNAL</th>
                      <th className="p-3">CAPITAL MANDATE</th>
                      <th className="p-3 text-left">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5FA]">
                    {filteredJurisdictions.map((j) => (
                      <tr key={j.id} className="hover:bg-[#F8FAFC] transition cursor-pointer group">
                        <td className="p-3 text-left">
                          <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                        </td>
                        <td className="p-3 font-mono font-bold text-[#00B5A4]">{j.id}</td>
                        <td className="p-3 font-bold text-[#102747] group-hover:text-[#00B5A4] transition">
                          {j.name}
                        </td>
                        <td className="p-3 font-medium text-[#102747] font-bold">{j.legislation}</td>
                        <td className="p-3 font-mono text-[#102747] font-semibold">{j.docFormat}</td>
                        <td className="p-3 text-[#102747] font-bold font-medium">{j.tribunal}</td>
                        <td className="p-3 text-[#102747] font-bold">{j.sinkingFundRule}</td>
                        <td className="p-3 text-left">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {j.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* SUBMODULE 3: BANKING FEEDS (Matches User Images 1 & 2) */}
              {systemSubTab === 'banking' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                      <th className="p-3 w-8 text-left">
                        <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                      </th>
                      <th className="p-3">FEED ID</th>
                      <th className="p-3">BANKING INSTITUTION</th>
                      <th className="p-3">PROTOCOL</th>
                      <th className="p-3">RECONCILIATION MATCHING ENGINE</th>
                      <th className="p-3">DAILY SYNC</th>
                      <th className="p-3">AUTO-MATCH RATE</th>
                      <th className="p-3 text-left">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5FA]">
                    {filteredBankingFeeds.map((b) => (
                      <tr key={b.id} className="hover:bg-[#F8FAFC] transition cursor-pointer group">
                        <td className="p-3 text-left">
                          <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                        </td>
                        <td className="p-3 font-mono font-bold text-[#102747]">{b.id}</td>
                        <td className="p-3 font-bold text-[#102747] group-hover:text-[#00B5A4] transition">
                          {b.institution}
                        </td>
                        <td className="p-3 font-mono text-[#102747] font-bold text-[11px]">{b.protocol}</td>
                        <td className="p-3 text-[#102747] font-bold font-medium">{b.matchingAlgorithm}</td>
                        <td className="p-3 font-mono text-[#102747] font-bold">{b.dailySchedule}</td>
                        <td className="p-3 font-mono font-bold text-[#00B5A4]">{b.autoMatchRate}</td>
                        <td className="p-3 text-left">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* SUBMODULE 4: GST & COMPLIANCE */}
              {systemSubTab === 'gst' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                      <th className="px-3.5 py-3 w-10 text-left">
                        <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                      </th>
                      <th className="px-3.5 py-3 whitespace-nowrap">CODE</th>
                      <th className="px-3.5 py-3 whitespace-nowrap">COMPLIANCE CATEGORY</th>
                      <th className="px-3.5 py-3 whitespace-nowrap">REGULATORY REQUIREMENT</th>
                      <th className="px-3.5 py-3 whitespace-nowrap">THRESHOLD</th>
                      <th className="px-3.5 py-3 whitespace-nowrap">GOVERNING BODY</th>
                      <th className="px-3.5 py-3 whitespace-nowrap">FILING DUE</th>
                      <th className="px-3.5 py-3 text-left whitespace-nowrap">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5FA]">
                    {filteredGstCompliance.map((g) => (
                      <tr key={g.id} className="hover:bg-[#F8FAFC] transition cursor-pointer group align-middle">
                        <td className="px-3.5 py-3.5 text-left">
                          <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                        </td>
                        <td className="px-3.5 py-3.5 font-mono font-bold text-[#102747] whitespace-nowrap">
                          {g.id}
                        </td>
                        <td className="px-3.5 py-3.5 font-bold text-[#102747] group-hover:text-[#00B5A4] transition min-w-[200px]">
                          {g.category}
                        </td>
                        <td className="px-3.5 py-3.5 text-[#102747] font-bold font-medium min-w-[230px] leading-relaxed">
                          {g.requirement}
                        </td>
                        <td className="px-3.5 py-3.5 font-mono text-[#00B5A4] font-bold min-w-[230px] leading-relaxed">
                          {g.parameter}
                        </td>
                        <td className="px-3.5 py-3.5 text-[#102747] font-bold font-semibold whitespace-nowrap">
                          {g.authority}
                        </td>
                        <td className="px-3.5 py-3.5 font-mono text-[#102747] font-bold whitespace-nowrap">
                          {g.dueDate}
                        </td>
                        <td className="px-3.5 py-3.5 text-left whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${
                              g.status === 'Compliant'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : g.status === 'Enforced & Locked'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : g.status === 'Ready for Filing'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {g.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>

      {/* Interactive Create / Configure Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-start bg-[#061D33]/60 backdrop-blur-xs p-4"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E5EEF5] shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F5FA] bg-[#F8FAFC]">
              <h3 className="text-sm font-bold text-[#102747]">
                {activeTab === 'statements' && 'Generate New Report'}
                {activeTab === 'users' && 'Add System User'}
                {activeTab === 'system' && systemSubTab === 'rules' && 'Add Statutory Rule'}
                {activeTab === 'system' && systemSubTab === 'jurisdictions' && 'Configure Jurisdiction'}
                {activeTab === 'system' && systemSubTab === 'banking' && 'Connect Banking Feed'}
                {activeTab === 'system' && systemSubTab === 'gst' && 'Add Compliance Policy'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#71849A] hover:text-[#102747] p-1 rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5 text-xs">
              {activeTab === 'statements' && (
                <>
                  <div>
                    <label className="block font-bold text-[#102747] mb-1">Report Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q2 Aged Debtors Arrears Summary"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Report Category</label>
                      <select
                        value={formData.type || 'debtors'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4] bg-white"
                      >
                        <option value="debtors">Aged Debtors</option>
                        <option value="balance">Fund Balance Sheet</option>
                        <option value="income">Income & Expenditure</option>
                        <option value="roll">Strata Roll Ledger</option>
                        <option value="audit">Audit Records</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Export Format</label>
                      <select
                        value={formData.format || 'PDF, CSV'}
                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4] bg-white"
                      >
                        <option value="PDF, CSV">PDF, CSV</option>
                        <option value="PDF, CSV, Excel">PDF, CSV, Excel</option>
                        <option value="PDF">PDF Only</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-[#102747] mb-1">Scheme & Scope</label>
                    <input
                      type="text"
                      placeholder="All Schemes (Portfolio)"
                      value={formData.scheme || ''}
                      onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                    />
                  </div>
                </>
              )}

              {activeTab === 'users' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Liam Carter"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="l.carter@vertexstrata.com.au"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">User Group</label>
                      <select
                        value={formData.category || 'staff'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4] bg-white"
                      >
                        <option value="staff">Staff & Managers</option>
                        <option value="committee">Committee Member</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Assigned Role</label>
                      <input
                        type="text"
                        placeholder="Strata Portfolio Manager"
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-[#102747] mb-1">Scope / Permissions</label>
                    <input
                      type="text"
                      placeholder="Portfolio & Levy Management"
                      value={formData.perms || ''}
                      onChange={(e) => setFormData({ ...formData, perms: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                    />
                  </div>
                </>
              )}

              {activeTab === 'system' && systemSubTab === 'rules' && (
                <>
                  <div>
                    <label className="block font-bold text-[#102747] mb-1">Statutory Rule Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Capital Works 10-Year Plan Review"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Jurisdiction</label>
                      <select
                        value={formData.jurisdiction || 'NSW'}
                        onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4] bg-white"
                      >
                        <option value="NSW">NSW</option>
                        <option value="QLD">QLD</option>
                        <option value="VIC">VIC</option>
                        <option value="WA">WA</option>
                        <option value="All States">All States</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Value / Configuration</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 Years Mandatory"
                        value={formData.value || ''}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Statutory Reference</label>
                      <input
                        type="text"
                        placeholder="SSMA 2015 s80"
                        value={formData.reference || ''}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Enforcement</label>
                      <input
                        type="text"
                        placeholder="Automated"
                        value={formData.enforcement || ''}
                        onChange={(e) => setFormData({ ...formData, enforcement: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'system' && systemSubTab === 'jurisdictions' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Code</label>
                      <input
                        type="text"
                        required
                        placeholder="TAS"
                        value={formData.id || ''}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-bold text-[#102747] mb-1">State / Territory</label>
                      <input
                        type="text"
                        required
                        placeholder="Tasmania"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Governing Legislation</label>
                      <input
                        type="text"
                        required
                        placeholder="Strata Titles Act 1998"
                        value={formData.legislation || ''}
                        onChange={(e) => setFormData({ ...formData, legislation: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Scheme Nomenclature</label>
                      <input
                        type="text"
                        placeholder="Strata Plan (SP)"
                        value={formData.docFormat || ''}
                        onChange={(e) => setFormData({ ...formData, docFormat: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Statutory Tribunal</label>
                      <input
                        type="text"
                        placeholder="TASCAT"
                        value={formData.tribunal || ''}
                        onChange={(e) => setFormData({ ...formData, tribunal: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Capital Mandate</label>
                      <input
                        type="text"
                        placeholder="Mandatory Sinking Fund"
                        value={formData.sinkingFundRule || ''}
                        onChange={(e) => setFormData({ ...formData, sinkingFundRule: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'system' && systemSubTab === 'banking' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Feed ID</label>
                      <input
                        type="text"
                        required
                        placeholder="FEED-BBL"
                        value={formData.id || ''}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-bold text-[#102747] mb-1">Banking Institution</label>
                      <input
                        type="text"
                        required
                        placeholder="Bendigo Bank Business"
                        value={formData.institution || ''}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-[#102747] mb-1">Protocol & Integration</label>
                    <input
                      type="text"
                      placeholder="Direct BAI2 / API Feed"
                      value={formData.protocol || ''}
                      onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Matching Engine</label>
                      <input
                        type="text"
                        placeholder="BSB + Lot Reference Auto-Match"
                        value={formData.matchingAlgorithm || ''}
                        onChange={(e) => setFormData({ ...formData, matchingAlgorithm: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Daily Sync</label>
                      <input
                        type="text"
                        placeholder="05:30 AEST Daily"
                        value={formData.dailySchedule || ''}
                        onChange={(e) => setFormData({ ...formData, dailySchedule: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'system' && systemSubTab === 'gst' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Policy Code</label>
                      <input
                        type="text"
                        required
                        placeholder="POL-007"
                        value={formData.id || ''}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-bold text-[#102747] mb-1">Compliance Category</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TPAR Contractor Reporting"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-[#102747] mb-1">Regulatory Requirement</label>
                    <input
                      type="text"
                      required
                      placeholder="Annual Taxable Payments Annual Report lodgement"
                      value={formData.requirement || ''}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Configuration / Threshold</label>
                      <input
                        type="text"
                        placeholder="All ABN Contractor Payments"
                        value={formData.parameter || ''}
                        onChange={(e) => setFormData({ ...formData, parameter: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Governing Body</label>
                      <input
                        type="text"
                        placeholder="ATO"
                        value={formData.authority || ''}
                        onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Audit / Filing Due</label>
                      <input
                        type="text"
                        placeholder="28 Aug 2027"
                        value={formData.dueDate || ''}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#102747] mb-1">Status</label>
                      <select
                        value={formData.status || 'Compliant'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5E5F2] focus:outline-none focus:border-[#00B5A4] bg-white"
                      >
                        <option value="Compliant">Compliant</option>
                        <option value="Ready for Filing">Ready for Filing</option>
                        <option value="Enforced & Locked">Enforced & Locked</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-start gap-2 pt-3 border-t border-[#F0F5FA]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#D5E5F2] text-[#71849A] hover:text-[#102747] font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00B5A4] hover:bg-[#008F87] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Save & Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
