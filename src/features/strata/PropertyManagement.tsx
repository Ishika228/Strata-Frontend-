import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Layers,
  ShieldCheck,
  Plus,
  Search,
  Download,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  X,
  FileText,
  Calendar,
  Mail,
  Phone,
  Clock,
  Shield,
  Check,
  User,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import {
  mockSchemes,
  mockLots,
  mockInsurancePolicies,
  mockComplianceItems,
} from '../../lib/strataMockData';
import { Scheme, Lot, InsurancePolicy, ComplianceItem } from '../../types/strata';
import { MoneyText } from '../../components/ui/MoneyText';
import { ColumnsSlidersIcon } from '../../components/ui/ColumnsSlidersIcon';
import { cn } from '../../lib/utils';
import { generateCertificateImage } from '../../lib/generateCertificateImage';

// Column definitions per tab for column visibility picker
const PROPERTY_COLUMNS: Record<string, Array<{ key: string; label: string }>> = {
  schemes: [
    { key: 'code', label: 'Scheme Code' },
    { key: 'name', label: 'Scheme Name & Address' },
    { key: 'jurisdiction', label: 'Jurisdiction' },
    { key: 'lots', label: 'Lots / UEV' },
    { key: 'adminFund', label: 'Admin Fund' },
    { key: 'capitalWorks', label: 'Capital Works' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' },
  ],
  roll: [
    { key: 'lot', label: 'Lot' },
    { key: 'unit', label: 'Unit / Floor' },
    { key: 'owner', label: 'Owner Name' },
    { key: 'occupancy', label: 'Occupancy Type' },
    { key: 'entitlement', label: 'Entitlement (UEV)' },
    { key: 'crn', label: 'CRN (Luhn)' },
    { key: 'balance', label: 'Levy Balance' },
    { key: 'debtor', label: 'Debtor Level' },
    { key: 'action', label: 'Action' },
  ],
  compliance: [
    { key: 'policyNo', label: 'Policy / Certificate #' },
    { key: 'policyType', label: 'Policy Type' },
    { key: 'insurer', label: 'Insurer / Underwriter' },
    { key: 'sumInsured', label: 'Sum Insured' },
    { key: 'premium', label: 'Annual Premium' },
    { key: 'expiry', label: 'Expiry Date' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' },
  ],
};

interface PropertyManagementProps {
  initialTab?: 'schemes' | 'roll' | 'compliance';
}

export const PropertyManagement: React.FC<PropertyManagementProps> = ({
  initialTab = 'schemes',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Active tab state synced with route/props
  const [activeTab, setActiveTab] = useState<'schemes' | 'roll' | 'compliance'>(initialTab);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    Object.keys(PROPERTY_COLUMNS).forEach((tab) => {
      init[tab] = PROPERTY_COLUMNS[tab].map((c) => c.key);
    });
    return init;
  });

  const isColVisible = (colKey: string) => {
    const current = visibleColumns[activeTab];
    if (!current) return true;
    return current.includes(colKey);
  };

  const toggleColumn = (colKey: string) => {
    const current = visibleColumns[activeTab] || (PROPERTY_COLUMNS[activeTab] || []).map((c) => c.key);
    if (current.includes(colKey) && current.length <= 1) return;
    const next = current.includes(colKey)
      ? current.filter((k) => k !== colKey)
      : [...current, colKey];
    setVisibleColumns((prev) => ({ ...prev, [activeTab]: next }));
  };

  const resetColumns = () => {
    const allKeys = (PROPERTY_COLUMNS[activeTab] || []).map((c) => c.key);
    setVisibleColumns((prev) => ({ ...prev, [activeTab]: allKeys }));
  };

  // Data states
  const [schemes, setSchemes] = useState<Scheme[]>(mockSchemes);
  const [lots, setLots] = useState<Lot[]>(mockLots);
  const [policies, setPolicies] = useState<InsurancePolicy[]>(mockInsurancePolicies);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(mockComplianceItems);

  // Selected item modal states
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(null);
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceItem | null>(null);

  // Creation modal states
  const [showCreateSchemeModal, setShowCreateSchemeModal] = useState(false);
  const [showAddLotModal, setShowAddLotModal] = useState(false);
  const [showAddComplianceModal, setShowAddComplianceModal] = useState(false);
  const [addComplianceType, setAddComplianceType] = useState<'policy' | 'statutory'>('policy');

  // Floating toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync activeTab when initialTab or location changes
  useEffect(() => {
    if (location.pathname.includes('/property/compliance') || location.pathname.includes('/fm/compliance')) {
      setActiveTab('compliance');
    } else if (location.pathname.includes('/property/roll') || location.pathname.includes('/fm/assets') || location.pathname.includes('/fm/lifecycle')) {
      setActiveTab('roll');
    } else if (location.pathname.includes('/property/schemes') || location.pathname.includes('/fm/properties')) {
      setActiveTab('schemes');
    } else {
      setActiveTab(initialTab);
    }
    setFilter('all');
    setSearchQuery('');
  }, [initialTab, location.pathname]);

  const switchTab = (tab: 'schemes' | 'roll' | 'compliance') => {
    setActiveTab(tab);
    setFilter('all');
    setSearchQuery('');
    if (tab === 'schemes') navigate('/app/property/schemes');
    else if (tab === 'roll') navigate('/app/property/roll');
    else if (tab === 'compliance') navigate('/app/property/compliance');
  };

  // Form states for Create Scheme
  const [newScheme, setNewScheme] = useState({
    name: 'Harbour Residences',
    code: 'SP-62041',
    registrationNo: 'SP 62041',
    jurisdiction: 'NSW' as Scheme['jurisdiction'],
    address: '42 Harbour Street, Sydney NSW 2000',
    totalLots: 24,
    totalEntitlement: 10000,
    adminBalance: 45000,
    capitalBalance: 125000,
  });

  // Form states for Add Lot
  const [newLot, setNewLot] = useState({
    lotNumber: 49,
    unitLabel: 'Unit 405',
    floorLabel: 'Level 4',
    ownerName: 'Olivia & Ryan Taylor',
    ownerEmail: 'olivia.taylor@example.com',
    ownerPhone: '0412 889 000',
    entitlement: 210,
    occupancyType: 'owner_occupier' as Lot['occupancyType'],
    occupierName: '',
  });

  // Form states for Add Policy/Compliance
  const [newPolicyData, setNewPolicyData] = useState({
    insurer: 'CHU Underwriting Agencies',
    policyNumber: 'CHU-NEW-2026',
    policyType: 'Building & Common Property' as InsurancePolicy['policyType'],
    sumInsured: 48000000,
    premium: 38500,
    expiryDate: '2027-11-30',
  });

  const [newComplianceData, setNewComplianceData] = useState({
    title: 'Annual Fire Safety Statement Certification',
    category: 'Fire Safety' as ComplianceItem['category'],
    dueDate: '2027-06-30',
    lastInspectionDate: '2026-06-15',
    certificateRef: 'CERT-2026-NEW.pdf',
  });

  // Filter schemes
  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'active') return s.status === 'active';
    if (filter === 'nsw') return s.jurisdiction === 'NSW';
    if (filter === 'qld') return s.jurisdiction === 'QLD';
    if (filter === 'vic') return s.jurisdiction === 'VIC';
    return true;
  });

  // Filter lots
  const filteredLots = lots.filter((lot) => {
    const matchesSearch =
      lot.lotNumber.toString().includes(searchQuery) ||
      lot.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lot.occupierName && lot.occupierName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lot.unitLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.crn.includes(searchQuery);
    if (!matchesSearch) return false;
    if (filter === 'arrears') return lot.currentBalanceCents > 0;
    if (filter === 'owner_occ') return lot.occupancyType === 'owner_occupier';
    if (filter === 'tenanted') return lot.occupancyType !== 'owner_occupier';
    return true;
  });

  // Filter policies
  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      p.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.insurer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.policyType.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'compliance') return false; // statutory registers only
    if (filter === 'active') return p.status === 'current';
    if (filter === 'review') return p.status === 'expiring_soon';
    return true;
  });

  // Filter compliance items
  const filteredCompliance = complianceItems.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.certificateRef && c.certificateRef.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filter === 'insurance') return false; // insurance policies only
    if (filter === 'active') return c.status === 'compliant';
    if (filter === 'review') return c.status === 'due_soon' || c.status === 'overdue';
    return true;
  });

  // Export CSV handler
  const handleExportCSV = () => {
    let csvContent = '';
    let filename = 'export.csv';

    if (activeTab === 'schemes') {
      filename = 'schemes_register.csv';
      csvContent = 'Code,Name,RegistrationNo,Jurisdiction,TotalLots,TotalEntitlement,Status\n';
      filteredSchemes.forEach((s) => {
        csvContent += `"${s.code}","${s.name}","${s.registrationNo}","${s.jurisdiction}",${s.totalLots},${s.totalEntitlement},"${s.status}"\n`;
      });
    } else if (activeTab === 'roll') {
      filename = 'strata_roll_lots.csv';
      csvContent = 'Lot,Unit,Floor,OwnerName,OwnerEmail,OccupancyType,EntitlementUEV,CRN,BalanceDue,ArrearsLevel\n';
      filteredLots.forEach((l) => {
        csvContent += `${l.lotNumber},"${l.unitLabel}","${l.floorLabel}","${l.ownerName}","${l.ownerEmail}","${l.occupancyType}",${l.entitlement},"${l.crn}",$${(l.currentBalanceCents / 100).toFixed(2)},L${l.arrearsLevel}\n`;
      });
    } else if (activeTab === 'compliance') {
      filename = 'insurance_and_compliance.csv';
      csvContent = 'Type,PolicyOrCertNo,TitleOrType,InsurerOrCategory,SumInsuredOrLastInspection,PremiumOrDueDate,Status\n';
      filteredPolicies.forEach((p) => {
        csvContent += `"Insurance","${p.policyNumber}","${p.policyType}","${p.insurer}",$${(p.buildingSumInsuredCents / 100).toFixed(2)},"${p.expiryDate}","${p.status}"\n`;
      });
      filteredCompliance.forEach((c) => {
        csvContent += `"Statutory","${c.certificateRef || 'N/A'}","${c.title}","${c.category}","${c.lastInspectionDate}","${c.dueDate}","${c.status}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename} successfully`);
  };

  // Certificate of Currency Download — renders professional PNG via Canvas
  const handleDownloadCertificate = (policy: InsurancePolicy) => {
    generateCertificateImage(policy);
    showToast(`Certificate of Currency for ${policy.policyNumber} downloaded as image`);
  };

  // Create Scheme submit
  const handleCreateSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schemeName = newScheme.name.trim() || 'Harbour Residences (SP 62041)';

    const created: Scheme = {
      id: `scheme-${Date.now()}`,
      code: newScheme.code || `SP-${Math.floor(10000 + Math.random() * 90000)}`,
      registrationNo: newScheme.registrationNo || `SP ${Math.floor(10000 + Math.random() * 90000)}`,
      name: schemeName,
      address: newScheme.address || '42 Harbour Street, Sydney NSW 2000',
      jurisdiction: newScheme.jurisdiction,
      totalLots: Number(newScheme.totalLots) || 24,
      totalEntitlement: Number(newScheme.totalEntitlement) || 10000,
      fyStartMonth: 7,
      levyFrequency: 'quarterly',
      firstDueDate: '2026-07-01',
      leadDays: 30,
      gstRegistered: true,
      status: 'active',
      committeeCount: 3,
      bankAccounts: [
        {
          id: `bank-${Date.now()}`,
          schemeId: `scheme-${Date.now()}`,
          bankName: 'Macquarie Bank Strata Trust',
          accountName: `${schemeName} Trust`,
          bsb: '182-222',
          accountNumberMasked: '••••9821',
          glAccountId: 'gl-1010',
          balanceCents: (newScheme.adminBalance + newScheme.capitalBalance) * 100,
          lastReconciledDate: '2026-11-20',
        },
      ],
      funds: [
        {
          id: `fund-${Date.now()}-admin`,
          schemeId: `scheme-${Date.now()}`,
          type: 'admin',
          name: 'Administrative Fund',
          balanceCents: newScheme.adminBalance * 100,
          targetBudgetCents: 15000000,
        },
        {
          id: `fund-${Date.now()}-cap`,
          schemeId: `scheme-${Date.now()}`,
          type: 'capital_works',
          name: 'Capital Works Fund',
          balanceCents: newScheme.capitalBalance * 100,
          targetBudgetCents: 32000000,
        },
      ],
    };

    setSchemes([created, ...schemes]);
    setShowCreateSchemeModal(false);
    showToast(`Scheme "${created.name}" created successfully`);
  };

  // Add Lot submit
  const handleAddLotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const owner = newLot.ownerName.trim() || 'Olivia & Ryan Taylor';

    const createdLot: Lot = {
      id: `lot-${Date.now()}`,
      schemeId: 'scheme-01',
      lotNumber: Number(newLot.lotNumber) || lots.length + 1,
      unitLabel: newLot.unitLabel || `Unit ${newLot.lotNumber}`,
      floorLabel: newLot.floorLabel || 'Level 4',
      entitlement: Number(newLot.entitlement) || 200,
      lotType: 'residential',
      crn: `52891${String(newLot.lotNumber).padStart(3, '0')}7`,
      ownerName: owner,
      ownerEmail: newLot.ownerEmail || `${owner.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      ownerPhone: newLot.ownerPhone || '0412 889 000',
      occupancyType: newLot.occupancyType,
      occupierName: newLot.occupancyType === 'investor' ? newLot.occupierName || 'Tenant' : undefined,
      currentBalanceCents: 0,
      arrearsLevel: 0,
    };

    setLots([createdLot, ...lots]);
    setShowAddLotModal(false);
    showToast(`Lot ${createdLot.lotNumber} added to Strata Roll`);
  };

  // Add Policy or Compliance submit
  const handleAddComplianceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addComplianceType === 'policy') {
      const createdPolicy: InsurancePolicy = {
        id: `pol-${Date.now()}`,
        schemeId: 'scheme-01',
        insurer: newPolicyData.insurer || 'CHU Underwriting Agencies',
        policyNumber: newPolicyData.policyNumber || 'CHU-NEW-2026',
        policyType: newPolicyData.policyType,
        buildingSumInsuredCents: Number(newPolicyData.sumInsured) * 100 || 4800000000,
        premiumCents: Number(newPolicyData.premium) * 100 || 3850000,
        startDate: '2026-11-25',
        expiryDate: newPolicyData.expiryDate || '2027-11-30',
        status: 'current',
      };
      setPolicies([createdPolicy, ...policies]);
      showToast(`Insurance policy ${createdPolicy.policyNumber} added`);
    } else {
      const createdComp: ComplianceItem = {
        id: `comp-${Date.now()}`,
        schemeId: 'scheme-01',
        title: newComplianceData.title.trim() || 'Annual Fire Safety Statement (AFSS) Certification',
        category: newComplianceData.category,
        dueDate: newComplianceData.dueDate || '2027-06-30',
        lastInspectionDate: newComplianceData.lastInspectionDate || '2026-06-15',
        certificateRef: newComplianceData.certificateRef || 'CERT-2026-NEW.pdf',
        status: 'compliant',
      };
      setComplianceItems([createdComp, ...complianceItems]);
      showToast(`Statutory compliance register "${createdComp.title}" added`);
    }
    setShowAddComplianceModal(false);
  };

  // Calculate totals for KPI banners
  const totalBuildingSumInsured = policies.reduce((acc, p) => acc + p.buildingSumInsuredCents, 0);
  const totalAnnualPremiums = policies.reduce((acc, p) => acc + p.premiumCents, 0);
  const totalEntitlements = lots.reduce((acc, l) => acc + l.entitlement, 0);
  const totalArrearsCents = lots.filter((l) => l.currentBalanceCents > 0).reduce((acc, l) => acc + l.currentBalanceCents, 0);
  const ownerOccupiedCount = lots.filter((l) => l.occupancyType === 'owner_occupier').length;

  return (
    <div className="space-y-4">
      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#102747] text-white rounded-xl shadow-2xl border border-teal-500/40 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-[#00B5A4] shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/60 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Register Card */}
      <div className="bg-white rounded-xl border border-[#E5EEF5] p-5 shadow-[0_1px_3px_rgba(8,41,74,0.03)]">
        {/* Top Header: Title, Description, and Primary CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F0F5FA]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#102747] font-sans">
                {activeTab === 'schemes' && 'Schemes Directory'}
                {activeTab === 'roll' && 'Statutory Strata Roll & Lots Register'}
                {activeTab === 'compliance' && 'Insurance & Statutory Compliance Registers'}
              </h2>
            </div>
            <p className="text-xs text-[#71849A] font-medium mt-0.5 font-sans">
              {activeTab === 'schemes' &&
                'Statutory strata schemes with CTS/SP jurisdiction, unit entitlement, and trust bank balances.'}
              {activeTab === 'roll' &&
                'Statutory register of lot owners, unit entitlements (UEV), CRNs, and tenant occupier records.'}
              {activeTab === 'compliance' &&
                'Mandatory building replacement insurance, public liability $20M+, and AFSS fire safety statements.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab === 'schemes') setShowCreateSchemeModal(true);
                else if (activeTab === 'roll') setShowAddLotModal(true);
                else if (activeTab === 'compliance') setShowAddComplianceModal(true);
              }}
              className="bg-[#00B5A4] hover:bg-[#008F87] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === 'schemes' && 'Create Scheme'}
                {activeTab === 'roll' && 'Add Lot to Roll'}
                {activeTab === 'compliance' && 'New Policy / Register'}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric KPI Tiles for Strata Roll & Lots */}
        {activeTab === 'roll' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-[#F0F5FA]">
            <div className="p-3 bg-[#F8FAFD] rounded-xl border border-[#E5EEF5] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#102747] font-semibold uppercase tracking-wider font-sans block">Total Lots</span>
                <span className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-0.5 block">{lots.length} Lots</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#E5EEF5] flex items-center justify-between">
                <span className="text-[11px] text-[#102747] font-medium font-sans truncate">100% Registered</span>
                <svg className="w-16 h-4 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad-roll-1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                      <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z" fill="url(#sparkGrad-roll-1)" />
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5" fill="none" stroke="#00B5A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="p-3 bg-[#F8FAFD] rounded-xl border border-[#E5EEF5] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#102747] font-semibold uppercase tracking-wider font-sans block">Unit Entitlement</span>
                <span className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-0.5 block">{totalEntitlements.toLocaleString()} UEV</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#E5EEF5] flex items-center justify-between">
                <span className="text-[11px] text-[#102747] font-medium font-sans truncate">Apportionment Base</span>
                <svg className="w-16 h-4 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad-roll-2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                      <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z" fill="url(#sparkGrad-roll-2)" />
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5" fill="none" stroke="#00B5A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="p-3 bg-[#F8FAFD] rounded-xl border border-[#E5EEF5] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#102747] font-semibold uppercase tracking-wider font-sans block">Owner Occupancy</span>
                <span className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-0.5 block">
                  {Math.round((ownerOccupiedCount / (lots.length || 1)) * 100)}%
                </span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#E5EEF5] flex items-center justify-between">
                <span className="text-[11px] text-[#102747] font-medium font-sans truncate">{ownerOccupiedCount} Owner-Occupied</span>
                <svg className="w-16 h-4 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad-roll-3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                      <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z" fill="url(#sparkGrad-roll-3)" />
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5" fill="none" stroke="#00B5A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="p-3 bg-[#F8FAFD] rounded-xl border border-[#E5EEF5] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#102747] font-semibold uppercase tracking-wider font-sans block">Arrears Outstanding</span>
                <span className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-0.5 block">
                  <MoneyText cents={totalArrearsCents} />
                </span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#E5EEF5] flex items-center justify-between">
                <span className="text-[11px] text-[#102747] font-medium font-sans truncate">{lots.filter((l) => l.currentBalanceCents > 0).length} Lots in Arrears</span>
                <svg className="w-16 h-4 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad-roll-4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E65B51" stopOpacity="0.38" />
                      <stop offset="65%" stopColor="#E65B51" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#E65B51" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z" fill="url(#sparkGrad-roll-4)" />
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5" fill="none" stroke="#E65B51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Metric KPI Tiles for Insurance & Compliance */}
        {activeTab === 'compliance' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-[#F0F5FA]">
            <div className="p-3 bg-[#F8FAFD] rounded-xl border border-[#E5EEF5] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#102747] font-semibold uppercase tracking-wider font-sans block">Building Replacement Cover</span>
                <span className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-0.5 block">
                  <MoneyText cents={totalBuildingSumInsured} />
                </span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#E5EEF5] flex items-center justify-between">
                <span className="text-[11px] text-[#102747] font-medium font-sans truncate">Statutory Valuation Current</span>
                <svg className="w-16 h-4 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad-comp-1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                      <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z" fill="url(#sparkGrad-comp-1)" />
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5" fill="none" stroke="#00B5A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="p-3 bg-[#F8FAFD] rounded-xl border border-[#E5EEF5] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#102747] font-semibold uppercase tracking-wider font-sans block">Public Liability Cover</span>
                <span className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-0.5 block">$50,000,000</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#E5EEF5] flex items-center justify-between">
                <span className="text-[11px] text-[#102747] font-medium font-sans truncate">Exceeds $20M Statutory Min</span>
                <svg className="w-16 h-4 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad-comp-2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                      <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z" fill="url(#sparkGrad-comp-2)" />
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5" fill="none" stroke="#00B5A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="p-3 bg-[#F8FAFD] rounded-xl border border-[#E5EEF5] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#102747] font-semibold uppercase tracking-wider font-sans block">Annual Insurance Premiums</span>
                <span className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-0.5 block">
                  <MoneyText cents={totalAnnualPremiums} />
                </span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#E5EEF5] flex items-center justify-between">
                <span className="text-[11px] text-[#102747] font-medium font-sans truncate">Funded by Admin Levies</span>
                <svg className="w-16 h-4 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad-comp-3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.38" />
                      <stop offset="65%" stopColor="#00B5A4" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00B5A4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z" fill="url(#sparkGrad-comp-3)" />
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5" fill="none" stroke="#00B5A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="p-3 bg-[#F8FAFD] rounded-xl border border-[#E5EEF5] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#102747] font-semibold uppercase tracking-wider font-sans block">Statutory Compliance Status</span>
                <span className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-0.5 block">
                  {complianceItems.filter((c) => c.status === 'due_soon').length} Renewals Due
                </span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#E5EEF5] flex items-center justify-between">
                <span className="text-[11px] text-[#102747] font-medium font-sans truncate">AFSS Due in 20 Days</span>
                <svg className="w-16 h-4 overflow-visible shrink-0" viewBox="0 0 80 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad-comp-4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D97706" stopOpacity="0.38" />
                      <stop offset="65%" stopColor="#D97706" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5 L 80 20 L 0 20 Z" fill="url(#sparkGrad-comp-4)" />
                  <path d="M 0 16 C 18 17, 22 4, 38 7 C 54 10, 62 15, 80 5" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Filter Pills and Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 pb-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
            {activeTab === 'schemes' && (
              <>
                {[
                  { id: 'all', label: `All Schemes (${schemes.length})` },
                  { id: 'active', label: 'Active only' },
                  { id: 'nsw', label: 'NSW (SP)' },
                  { id: 'qld', label: 'QLD (CTS)' },
                  { id: 'vic', label: 'VIC (OC)' },
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
              </>
            )}

            {activeTab === 'roll' && (
              <>
                {[
                  { id: 'all', label: `All Lots (${lots.length})` },
                  { id: 'arrears', label: `In Arrears (${lots.filter((l) => l.currentBalanceCents > 0).length})` },
                  { id: 'owner_occ', label: `Owner Occupied (${ownerOccupiedCount})` },
                  { id: 'tenanted', label: `Tenanted (${lots.length - ownerOccupiedCount})` },
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
              </>
            )}

            {activeTab === 'compliance' && (
              <>
                {[
                  { id: 'all', label: `All Registers (${policies.length + complianceItems.length})` },
                  { id: 'insurance', label: `Insurance Policies (${policies.length})` },
                  { id: 'compliance', label: `Statutory Compliance (${complianceItems.length})` },
                  { id: 'active', label: 'Current & Certified' },
                  { id: 'review', label: 'Renewal Due (<60d)' },
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
              </>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'schemes'
                  ? 'Search scheme code, name, address...'
                  : activeTab === 'roll'
                    ? 'Search lot, owner, unit, CRN...'
                    : 'Search policy, insurer, certificate...'
              }
              className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] focus:ring-1 focus:ring-[#00B5A4] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#102747] placeholder:text-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-100 transition"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Records Count & Action Buttons */}
        <div className="flex items-center justify-between text-xs text-[#71849A] pt-1 pb-3 border-t border-[#F0F5FA]">
          <span className="font-medium">
            Showing{' '}
            <strong className="text-[#102747]">
              {activeTab === 'schemes' && filteredSchemes.length}
              {activeTab === 'roll' && filteredLots.length}
              {activeTab === 'compliance' && filteredPolicies.length + filteredCompliance.length}
            </strong>{' '}
            matching records
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D5E5F2] bg-white hover:bg-[#F4F8FC] text-[#102747] font-bold text-xs transition cursor-pointer shadow-xs select-none"
              title="Export visible records to CSV"
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
                      {(PROPERTY_COLUMNS[activeTab] || []).map((col) => {
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

        {/* 1. Schemes Directory Table */}
        {activeTab === 'schemes' && (
          <div className="overflow-x-auto border border-[#E5EEF5] rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                  </th>
                  {isColVisible('code') && (
                    <th className="p-3">
                      <div className="flex items-center gap-1">
                        <span>SCHEME CODE</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  )}
                  {isColVisible('name') && <th className="p-3">SCHEME NAME</th>}
                  {isColVisible('jurisdiction') && <th className="p-3">JURISDICTION</th>}
                  {isColVisible('lots') && <th className="p-3 text-left">LOTS</th>}
                  {isColVisible('adminFund') && <th className="p-3">ADMIN FUND</th>}
                  {isColVisible('capitalWorks') && <th className="p-3">CAPITAL WORKS</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                  {isColVisible('action') && <th className="p-3 text-left">ACTION</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredSchemes.map((scheme) => (
                  <tr
                    key={scheme.id}
                    onClick={() => setSelectedScheme(scheme)}
                    className="hover:bg-[#F8FAFC] transition cursor-pointer group"
                  >
                    <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                    </td>
                    {isColVisible('code') && (
                      <td className="p-3 font-mono font-bold text-[#102747]">
                        {scheme.code}
                      </td>
                    )}
                    {isColVisible('name') && (
                      <td className="p-3">
                        <div className="font-bold text-[#102747] group-hover:text-[#00B5A4] transition">
                          {scheme.name}
                        </div>
                        <div className="text-[11px] text-[#71849A] truncate max-w-xs">
                          {scheme.address}
                        </div>
                      </td>
                    )}
                    {isColVisible('jurisdiction') && (
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold font-mono text-[11px]">
                          {scheme.jurisdiction}
                        </span>
                      </td>
                    )}
                    {isColVisible('lots') && (
                      <td className="p-3 text-left font-mono">
                        <span className="font-bold text-[#102747]">{scheme.totalLots}</span>
                        <span className="text-[#71849A]"> / {scheme.totalEntitlement.toLocaleString()}</span>
                      </td>
                    )}
                    {isColVisible('adminFund') && (
                      <td className="p-3 font-mono font-bold text-emerald-700">
                        ${(scheme.funds[0]?.balanceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    )}
                    {isColVisible('capitalWorks') && (
                      <td className="p-3 font-mono font-bold text-sky-700">
                        ${(scheme.funds[1]?.balanceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    )}
                    {isColVisible('status') && (
                      <td className="p-3 text-left">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                    )}
                    {isColVisible('action') && (
                      <td className="p-3 text-left">
                        <button className="text-[#00B5A4] hover:text-[#008F87] font-bold text-[11px] transition">
                          Manage →
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Strata Roll & Lots Table */}
        {activeTab === 'roll' && (
          <div className="overflow-x-auto border border-[#E5EEF5] rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                  </th>
                  {isColVisible('lot') && <th className="p-3 whitespace-nowrap">LOT</th>}
                  {isColVisible('unit') && <th className="p-3">UNIT</th>}
                  {isColVisible('owner') && <th className="p-3">OWNER NAME</th>}
                  {isColVisible('occupancy') && <th className="p-3">OCCUPANCY TYPE</th>}
                  {isColVisible('entitlement') && <th className="p-3 text-left">ENTITLEMENT</th>}
                  {isColVisible('crn') && <th className="p-3">CRN</th>}
                  {isColVisible('balance') && <th className="p-3">LEVY BALANCE</th>}
                  {isColVisible('debtor') && <th className="p-3 text-left">DEBTOR LEVEL</th>}
                  {isColVisible('action') && <th className="p-3 text-left">ACTION</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredLots.map((lot) => (
                  <tr
                    key={lot.id}
                    onClick={() => setSelectedLot(lot)}
                    className="hover:bg-[#F8FAFC] transition cursor-pointer group"
                  >
                    <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                    </td>
                    {isColVisible('lot') && (
                      <td className="p-3 font-mono font-bold text-[#102747] whitespace-nowrap">
                        {lot.lotNumber}
                      </td>
                    )}
                    {isColVisible('unit') && (
                      <td className="p-3 font-medium text-[#334B68]">
                        <div className="whitespace-nowrap">{lot.unitLabel}</div>
                        <div className="whitespace-nowrap">({lot.floorLabel})</div>
                      </td>
                    )}
                    {isColVisible('owner') && (
                      <td className="p-3">
                        <div className="font-bold text-[#102747] group-hover:text-[#00B5A4] transition">
                          {lot.ownerName}
                        </div>
                      </td>
                    )}
                    {isColVisible('occupancy') && (
                      <td className="p-3 text-[#334B68]">
                        {lot.occupancyType === 'owner_occupier' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <User className="w-3 h-3 text-emerald-600" />
                            Owner Occupied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                            {lot.occupierName ? `Tenant: ${lot.occupierName}` : 'Tenanted'}
                          </span>
                        )}
                      </td>
                    )}
                    {isColVisible('entitlement') && (
                      <td className="p-3 text-left font-mono font-bold text-[#102747]">
                        {lot.entitlement} UEV
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {((lot.entitlement / (totalEntitlements || 1)) * 100).toFixed(2)}%
                        </span>
                      </td>
                    )}
                    {isColVisible('crn') && (
                      <td className="p-3 font-mono text-[#102747] font-bold text-[11px]">
                        {lot.crn}
                      </td>
                    )}
                    {isColVisible('balance') && (
                      <td className="p-3 font-mono font-bold">
                        {lot.currentBalanceCents > 0 ? (
                          <span className="text-rose-600">
                            ${(lot.currentBalanceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-emerald-600">$0.00</span>
                        )}
                      </td>
                    )}
                    {isColVisible('debtor') && (
                      <td className="p-3 text-left whitespace-nowrap">
                        {lot.arrearsLevel === 0 ? (
                          <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            L0 Nil
                          </span>
                        ) : lot.arrearsLevel === 1 ? (
                          <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200 whitespace-nowrap">
                            L1 Reminder
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 whitespace-nowrap">
                            L{lot.arrearsLevel} Action
                          </span>
                        )}
                      </td>
                    )}
                    {isColVisible('action') && (
                      <td className="p-3 text-left whitespace-nowrap">
                        <button className="text-[#00B5A4] hover:text-[#008F87] font-bold text-[11px] transition text-left whitespace-nowrap block">
                          View Record →
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Insurance & Statutory Compliance Tables */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Section A: Strata Insurance Policies */}
            {filteredPolicies.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00B5A4]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#102747]">
                      Strata Insurance Policies ({filteredPolicies.length})
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto border border-[#E5EEF5] rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                        <th className="p-3 w-8 text-left">
                          <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                        </th>
                        {isColVisible('policyNo') && <th className="p-3">POLICY #</th>}
                        {isColVisible('policyType') && <th className="p-3">POLICY TYPE</th>}
                        {isColVisible('insurer') && <th className="p-3">INSURER</th>}
                        {isColVisible('sumInsured') && <th className="p-3">SUM INSURED</th>}
                        {isColVisible('premium') && <th className="p-3">ANNUAL PREMIUM</th>}
                        {isColVisible('expiry') && <th className="p-3">EXPIRY DATE</th>}
                        {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                        {isColVisible('action') && <th className="p-3 text-left">ACTION</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F5FA]">
                      {filteredPolicies.map((pol) => (
                        <tr
                          key={pol.id}
                          onClick={() => setSelectedPolicy(pol)}
                          className="hover:bg-[#F8FAFC] transition cursor-pointer group"
                        >
                          <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                          </td>
                          {isColVisible('policyNo') && (
                            <td className="p-3 font-mono font-bold text-[#102747]">
                              {pol.policyNumber}
                            </td>
                          )}
                          {isColVisible('policyType') && (
                            <td className="p-3 font-bold text-[#102747] group-hover:text-[#00B5A4] transition">
                              {pol.policyType}
                            </td>
                          )}
                          {isColVisible('insurer') && (
                            <td className="p-3 font-medium text-[#334B68]">
                              {pol.insurer}
                            </td>
                          )}
                          {isColVisible('sumInsured') && (
                            <td className="p-3 font-mono font-bold text-sky-800">
                              ${(pol.buildingSumInsuredCents / 100).toLocaleString()}
                            </td>
                          )}
                          {isColVisible('premium') && (
                            <td className="p-3 font-mono text-[#334B68]">
                              ${(pol.premiumCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                          )}
                          {isColVisible('expiry') && (
                            <td className="p-3 font-mono text-[#71849A]">
                              {pol.expiryDate}
                            </td>
                          )}
                          {isColVisible('status') && (
                            <td className="p-3 text-left">
                              {pol.status === 'current' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Current
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  Due Soon
                                </span>
                              )}
                            </td>
                          )}
                          {isColVisible('action') && (
                            <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleDownloadCertificate(pol)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-[#E6F8F6] hover:bg-[#d0f3ef] text-[#008F87] rounded-lg transition cursor-pointer flex items-center gap-1.5 ml-auto"
                              >
                                <Download className="w-3 h-3" />
                                <span>Certificate</span>
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section B: Statutory Compliance Registers */}
            {filteredCompliance.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#00B5A4]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#102747]">
                      Statutory Compliance Registers ({filteredCompliance.length})
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto border border-[#E5EEF5] rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                        <th className="p-3 w-8 text-left">
                          <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                        </th>
                        <th className="p-3">COMPLIANCE TITLE</th>
                        <th className="p-3">STATUTORY CATEGORY</th>
                        <th className="p-3">LAST INSPECTED</th>
                        <th className="p-3">NEXT DUE DATE</th>
                        <th className="p-3">CERTIFICATE REFERENCE</th>
                        <th className="p-3 text-left">STATUS</th>
                        <th className="p-3 text-left">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F5FA]">
                      {filteredCompliance.map((comp) => (
                        <tr
                          key={comp.id}
                          onClick={() => setSelectedCompliance(comp)}
                          className="hover:bg-[#F8FAFC] transition cursor-pointer group"
                        >
                          <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="rounded text-[#00B5A4] focus:ring-[#00B5A4]" />
                          </td>
                          <td className="p-3 font-bold text-[#102747] group-hover:text-[#00B5A4] transition">
                            {comp.title}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {comp.category}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[#71849A]">
                            {comp.lastInspectionDate}
                          </td>
                          <td className="p-3 font-mono font-bold">
                            <span className={comp.status === 'due_soon' ? 'text-amber-700' : 'text-[#102747]'}>
                              {comp.dueDate}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[#102747] font-bold text-[11px]">
                            {comp.certificateRef || 'N/A'}
                          </td>
                          <td className="p-3 text-left">
                            {comp.status === 'compliant' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Compliant
                              </span>
                            ) : comp.status === 'due_soon' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                Due Soon
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Overdue
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-left">
                            <button className="text-[#00B5A4] hover:text-[#008F87] font-bold text-[11px] transition">
                              Inspect →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#D5E5F2] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F5FA] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] text-[#00B5A4] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#102747] font-sans">
                    {selectedScheme.name}
                  </h3>
                  <span className="text-xs font-mono text-[#00B5A4] font-semibold">
                    {selectedScheme.code} ({selectedScheme.jurisdiction} Jurisdiction)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Administrative Fund</div>
                <div className="text-base font-black text-emerald-700 font-mono mt-1">
                  ${(selectedScheme.funds[0]?.balanceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Target Budget: ${(selectedScheme.funds[0]?.targetBudgetCents / 100).toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Capital Works Fund</div>
                <div className="text-base font-black text-sky-700 font-mono mt-1">
                  ${(selectedScheme.funds[1]?.balanceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Target Budget: ${(selectedScheme.funds[1]?.targetBudgetCents / 100).toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Total Lots & Entitlement</div>
                <div className="text-sm font-bold text-[#102747] mt-1">
                  {selectedScheme.totalLots} Lots • {selectedScheme.totalEntitlement.toLocaleString()} UEV
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Trust Bank Account</div>
                <div className="text-sm font-bold text-[#102747] mt-1 truncate">
                  {selectedScheme.bankAccounts[0]?.bankName || 'Macquarie Bank'}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  BSB {selectedScheme.bankAccounts[0]?.bsb || '182-222'} • {selectedScheme.bankAccounts[0]?.accountNumberMasked || '••••9821'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#F0F5FA]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedScheme(null);
                    switchTab('roll');
                  }}
                  className="px-3 py-1.5 bg-[#F4F8FC] hover:bg-[#EAF3F8] text-[#102747] rounded-lg text-xs font-bold border border-[#E5EEF5] transition cursor-pointer"
                >
                  View Strata Roll
                </button>
                <button
                  onClick={() => {
                    setSelectedScheme(null);
                    switchTab('compliance');
                  }}
                  className="px-3 py-1.5 bg-[#F4F8FC] hover:bg-[#EAF3F8] text-[#102747] rounded-lg text-xs font-bold border border-[#E5EEF5] transition cursor-pointer"
                >
                  View Insurance
                </button>
              </div>

              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 bg-[#00B5A4] text-white rounded-xl text-xs font-bold hover:bg-[#008F87] transition cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lot Detail Modal */}
      {selectedLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#D5E5F2] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F5FA] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] text-[#00B5A4] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#102747] font-sans">
                    Lot {selectedLot.lotNumber} — {selectedLot.unitLabel}
                  </h3>
                  <span className="text-xs text-[#71849A]">
                    {selectedLot.floorLabel} • Scheme SP 52891
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLot(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Owner Details</div>
                <div className="text-sm font-bold text-[#102747] mt-0.5">{selectedLot.ownerName}</div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{selectedLot.ownerEmail}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{selectedLot.ownerPhone}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Occupancy & Type</div>
                <div className="text-sm font-bold text-[#102747] mt-0.5">
                  {selectedLot.occupancyType === 'owner_occupier' ? 'Owner Occupier' : 'Investment Tenancy'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Resident: <strong>{selectedLot.occupierName || selectedLot.ownerName}</strong>
                </div>
                <div className="text-[10px] text-teal-600 font-semibold mt-1">
                  Tenant Register Up to Date
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Entitlement (UEV)</div>
                <div className="text-base font-black text-[#102747] font-mono mt-0.5">
                  {selectedLot.entitlement} UEV
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {((selectedLot.entitlement / (totalEntitlements || 1)) * 100).toFixed(2)}% of Building Total
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Levy Account Balance</div>
                <div className="text-base font-black font-mono mt-0.5">
                  {selectedLot.currentBalanceCents > 0 ? (
                    <span className="text-rose-600">
                      ${(selectedLot.currentBalanceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })} Due
                    </span>
                  ) : (
                    <span className="text-emerald-600">$0.00 (Paid in Full)</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  CRN: <strong className="font-mono text-slate-700">{selectedLot.crn}</strong> (BPAY 58210)
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F0F5FA]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast(`Statutory levy notice issued to ${selectedLot.ownerName}`);
                    setSelectedLot(null);
                  }}
                  className="px-3 py-1.5 bg-[#F4F8FC] hover:bg-[#EAF3F8] text-[#102747] rounded-lg text-xs font-bold border border-[#E5EEF5] transition cursor-pointer"
                >
                  Issue Levy Notice
                </button>
                {selectedLot.currentBalanceCents > 0 && (
                  <button
                    onClick={() => {
                      showToast(`Arrears reminder notice dispatched to ${selectedLot.ownerEmail}`);
                      setSelectedLot(null);
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition cursor-pointer"
                  >
                    Send Arrears Reminder
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedLot(null)}
                className="px-4 py-2 bg-[#00B5A4] text-white rounded-xl text-xs font-bold hover:bg-[#008F87] transition cursor-pointer"
              >
                Close Lot Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Policy Detail Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#D5E5F2] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F5FA] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] text-[#00B5A4] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#102747] font-sans">
                    {selectedPolicy.policyType}
                  </h3>
                  <span className="text-xs font-mono text-teal-600 font-semibold">
                    Policy #{selectedPolicy.policyNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPolicy(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Insurer / Underwriter</div>
                <div className="text-sm font-bold text-[#102747] mt-0.5">{selectedPolicy.insurer}</div>
                <div className="text-[10px] text-teal-700 font-medium mt-1">
                  Accredited Strata Underwriter
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Sum Insured</div>
                <div className="text-base font-black text-sky-800 font-mono mt-0.5">
                  ${(selectedPolicy.buildingSumInsuredCents / 100).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Full Replacement & Reinstatement
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Annual Premium</div>
                <div className="text-base font-black text-[#102747] font-mono mt-0.5">
                  ${(selectedPolicy.premiumCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Excludes stamp duty & GST rebate
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Period of Cover</div>
                <div className="text-xs font-bold text-[#102747] font-mono mt-0.5">
                  {selectedPolicy.startDate} → {selectedPolicy.expiryDate}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                  Policy Status: {selectedPolicy.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F0F5FA]">
              <button
                onClick={() => handleDownloadCertificate(selectedPolicy)}
                className="px-3.5 py-2 bg-[#E6F8F6] hover:bg-[#d0f3ef] text-[#008F87] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Certificate of Currency</span>
              </button>

              <button
                onClick={() => {
                  showToast(`Renewal workflow initiated for policy ${selectedPolicy.policyNumber}`);
                  setSelectedPolicy(null);
                }}
                className="px-4 py-2 bg-[#00B5A4] text-white rounded-xl text-xs font-bold hover:bg-[#008F87] transition cursor-pointer"
              >
                Renew Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Compliance Item Modal */}
      {selectedCompliance && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#D5E5F2] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F5FA] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] text-[#00B5A4] flex items-center justify-center font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#102747] font-sans">
                    {selectedCompliance.title}
                  </h3>
                  <span className="text-xs font-mono text-teal-600 font-semibold">
                    Category: {selectedCompliance.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompliance(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Statutory Authority / Standard</div>
                <div className="text-sm font-bold text-[#102747] mt-0.5">
                  NSW Strata Schemes Management Act 2015 s.260
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Mandatory Legal Compliance Register
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Certificate Reference</div>
                <div className="text-sm font-bold font-mono text-sky-800 mt-0.5">
                  {selectedCompliance.certificateRef || 'AFSS-2025-52891.pdf'}
                </div>
                <div className="text-[10px] text-teal-600 font-semibold mt-1">
                  Signed by Accredited Fire Practitioner (FPAS)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Last Inspection Date</div>
                <div className="text-sm font-bold font-mono text-[#102747] mt-0.5">
                  {selectedCompliance.lastInspectionDate}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Annual Inspection Passed
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EEF5]">
                <div className="text-slate-500 font-medium">Statutory Renewal Due</div>
                <div className="text-sm font-bold font-mono text-amber-700 mt-0.5">
                  {selectedCompliance.dueDate}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold mt-1">
                  Must be lodged with local council & Fire and Rescue NSW
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F0F5FA]">
              <button
                onClick={() => {
                  showToast(`Statutory certificate ${selectedCompliance.certificateRef || 'record'} downloaded`);
                  setSelectedCompliance(null);
                }}
                className="px-3.5 py-2 bg-[#E6F8F6] hover:bg-[#d0f3ef] text-[#008F87] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Lodged Statement</span>
              </button>

              <button
                onClick={() => {
                  showToast(`Annual inspection scheduled for ${selectedCompliance.title}`);
                  setSelectedCompliance(null);
                }}
                className="px-4 py-2 bg-[#00B5A4] text-white rounded-xl text-xs font-bold hover:bg-[#008F87] transition cursor-pointer"
              >
                Log Inspection / Renew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Scheme */}
      {showCreateSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <form
            onSubmit={handleCreateSchemeSubmit}
            className="bg-white rounded-2xl border border-[#D5E5F2] shadow-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#F0F5FA] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00B5A4]" />
                <h3 className="text-base font-bold text-[#102747]">Create New Strata Scheme</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateSchemeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Palms Residences"
                  value={newScheme.name}
                  onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Scheme Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SP-88120"
                    value={newScheme.code}
                    onChange={(e) => setNewScheme({ ...newScheme, code: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jurisdiction</label>
                  <select
                    value={newScheme.jurisdiction}
                    onChange={(e) => setNewScheme({ ...newScheme, jurisdiction: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  >
                    <option value="NSW">NSW (Strata Plan)</option>
                    <option value="QLD">QLD (CTS)</option>
                    <option value="VIC">VIC (Owners Corp)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 50 Ocean Boulevard, Manly NSW 2095"
                  value={newScheme.address}
                  onChange={(e) => setNewScheme({ ...newScheme, address: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Total Lots</label>
                  <input
                    type="number"
                    min="1"
                    value={newScheme.totalLots}
                    onChange={(e) => setNewScheme({ ...newScheme, totalLots: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Total Entitlement (UEV)</label>
                  <input
                    type="number"
                    min="1"
                    value={newScheme.totalEntitlement}
                    onChange={(e) => setNewScheme({ ...newScheme, totalEntitlement: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Admin Fund Balance ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newScheme.adminBalance}
                    onChange={(e) => setNewScheme({ ...newScheme, adminBalance: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Capital Works Balance ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newScheme.capitalBalance}
                    onChange={(e) => setNewScheme({ ...newScheme, capitalBalance: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-start gap-2 pt-3 border-t border-[#F0F5FA]">
              <button
                type="button"
                onClick={() => setShowCreateSchemeModal(false)}
                className="px-4 py-2 border border-[#D5E5F2] text-[#334B68] rounded-xl text-xs font-bold hover:bg-[#F4F8FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00B5A4] hover:bg-[#008F87] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Create Scheme
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Lot to Roll */}
      {showAddLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <form
            onSubmit={handleAddLotSubmit}
            className="bg-white rounded-2xl border border-[#D5E5F2] shadow-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#F0F5FA] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00B5A4]" />
                <h3 className="text-base font-bold text-[#102747]">Add Lot to Strata Roll</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLotModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Lot Number *</label>
                  <input
                    type="number"
                    required
                    value={newLot.lotNumber}
                    onChange={(e) => setNewLot({ ...newLot, lotNumber: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit Label *</label>
                  <input
                    type="text"
                    required
                    value={newLot.unitLabel}
                    onChange={(e) => setNewLot({ ...newLot, unitLabel: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Floor Label</label>
                  <input
                    type="text"
                    value={newLot.floorLabel}
                    onChange={(e) => setNewLot({ ...newLot, floorLabel: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Owner Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard & Catherine Vance"
                  value={newLot.ownerName}
                  onChange={(e) => setNewLot({ ...newLot, ownerName: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Owner Email</label>
                  <input
                    type="email"
                    placeholder="owner@example.com"
                    value={newLot.ownerEmail}
                    onChange={(e) => setNewLot({ ...newLot, ownerEmail: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Owner Phone</label>
                  <input
                    type="text"
                    value={newLot.ownerPhone}
                    onChange={(e) => setNewLot({ ...newLot, ownerPhone: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Entitlement (UEV)</label>
                  <input
                    type="number"
                    min="1"
                    value={newLot.entitlement}
                    onChange={(e) => setNewLot({ ...newLot, entitlement: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Occupancy</label>
                  <select
                    value={newLot.occupancyType}
                    onChange={(e) => setNewLot({ ...newLot, occupancyType: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  >
                    <option value="owner_occupier">Owner Occupied</option>
                    <option value="investor">Tenanted / Investor</option>
                  </select>
                </div>
              </div>

              {newLot.occupancyType === 'investor' && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tenant Occupier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Liam Turner"
                    value={newLot.occupierName}
                    onChange={(e) => setNewLot({ ...newLot, occupierName: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-start gap-2 pt-3 border-t border-[#F0F5FA]">
              <button
                type="button"
                onClick={() => setShowAddLotModal(false)}
                className="px-4 py-2 border border-[#D5E5F2] text-[#334B68] rounded-xl text-xs font-bold hover:bg-[#F4F8FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00B5A4] hover:bg-[#008F87] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Add Lot to Roll
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: New Policy / Compliance Item */}
      {showAddComplianceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <form
            onSubmit={handleAddComplianceSubmit}
            className="bg-white rounded-2xl border border-[#D5E5F2] shadow-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#F0F5FA] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00B5A4]" />
                <h3 className="text-base font-bold text-[#102747]">New Insurance Policy / Register</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddComplianceModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-type Switcher */}
            <div className="flex items-center gap-2 bg-[#F4F8FC] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAddComplianceType('policy')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${addComplianceType === 'policy'
                  ? 'bg-[#00B5A4] text-white shadow-xs'
                  : 'text-[#334B68] hover:text-[#102747]'
                  }`}
              >
                Strata Insurance Policy
              </button>
              <button
                type="button"
                onClick={() => setAddComplianceType('statutory')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${addComplianceType === 'statutory'
                  ? 'bg-[#00B5A4] text-white shadow-xs'
                  : 'text-[#334B68] hover:text-[#102747]'
                  }`}
              >
                Statutory Compliance Item
              </button>
            </div>

            {addComplianceType === 'policy' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Insurer / Underwriter *</label>
                  <input
                    type="text"
                    required
                    value={newPolicyData.insurer}
                    onChange={(e) => setNewPolicyData({ ...newPolicyData, insurer: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Policy Number *</label>
                    <input
                      type="text"
                      required
                      value={newPolicyData.policyNumber}
                      onChange={(e) => setNewPolicyData({ ...newPolicyData, policyNumber: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Policy Type</label>
                    <select
                      value={newPolicyData.policyType}
                      onChange={(e) => setNewPolicyData({ ...newPolicyData, policyType: e.target.value as any })}
                      className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                    >
                      <option value="Building & Common Property">Building & Common Property</option>
                      <option value="Public Liability">Public Liability ($20M+)</option>
                      <option value="Office Bearers Liability">Office Bearers Liability</option>
                      <option value="Voluntary Workers">Voluntary Workers</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Sum Insured ($)</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={newPolicyData.sumInsured}
                      onChange={(e) => setNewPolicyData({ ...newPolicyData, sumInsured: Number(e.target.value) })}
                      className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Annual Premium ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newPolicyData.premium}
                      onChange={(e) => setNewPolicyData({ ...newPolicyData, premium: Number(e.target.value) })}
                      className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Policy Expiry / Renewal Date</label>
                  <input
                    type="date"
                    required
                    value={newPolicyData.expiryDate}
                    onChange={(e) => setNewPolicyData({ ...newPolicyData, expiryDate: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Compliance Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Fire Safety Statement (AFSS)"
                    value={newComplianceData.title}
                    onChange={(e) => setNewComplianceData({ ...newComplianceData, title: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Statutory Category</label>
                  <select
                    value={newComplianceData.category}
                    onChange={(e) => setNewComplianceData({ ...newComplianceData, category: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none"
                  >
                    <option value="Fire Safety">Fire Safety</option>
                    <option value="Lift Safety">Lift Safety</option>
                    <option value="Pool Fencing">Pool Fencing & Barrier CPR</option>
                    <option value="Asbestos Register">Asbestos Register & Management Plan</option>
                    <option value="Anchor Points / Roof Safety">Anchor Points & Roof Safety</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Last Inspected Date</label>
                    <input
                      type="date"
                      value={newComplianceData.lastInspectionDate}
                      onChange={(e) => setNewComplianceData({ ...newComplianceData, lastInspectionDate: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Statutory Due Date *</label>
                    <input
                      type="date"
                      required
                      value={newComplianceData.dueDate}
                      onChange={(e) => setNewComplianceData({ ...newComplianceData, dueDate: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Certificate / Document Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. AFSS-2026-FINAL.pdf"
                    value={newComplianceData.certificateRef}
                    onChange={(e) => setNewComplianceData({ ...newComplianceData, certificateRef: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-lg px-3 py-2 text-xs text-[#102747] outline-none font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-start gap-2 pt-3 border-t border-[#F0F5FA]">
              <button
                type="button"
                onClick={() => setShowAddComplianceModal(false)}
                className="px-4 py-2 border border-[#D5E5F2] text-[#334B68] rounded-xl text-xs font-bold hover:bg-[#F4F8FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00B5A4] hover:bg-[#008F87] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};