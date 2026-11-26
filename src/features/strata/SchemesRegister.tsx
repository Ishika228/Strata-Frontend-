import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Filter,
  Users,
  Layers,
  DollarSign,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  X,
  CreditCard,
  Shield,
} from 'lucide-react';
import { mockSchemes, mockLots, mockCommitteeMembers } from '../../lib/strataMockData';
import { Scheme, Lot, CommitteeMember } from '../../types/strata';
import { MoneyText } from '../../components/ui/MoneyText';

interface SchemesRegisterProps {
  initialTab?: 'roll' | 'committee' | 'funds' | 'details';
}

export const SchemesRegister: React.FC<SchemesRegisterProps> = ({ initialTab = 'roll' }) => {
  const [schemes, setSchemes] = useState<Scheme[]>(mockSchemes);
  const [selectedScheme, setSelectedScheme] = useState<Scheme>(mockSchemes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'roll' | 'committee' | 'funds' | 'details'>(initialTab);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Scheme Form State
  const [newSchemeName, setNewSchemeName] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newJurisdiction, setNewJurisdiction] = useState<'NSW' | 'QLD' | 'VIC'>('NSW');
  const [newTotalLots, setNewTotalLots] = useState(24);

  // Filter schemes
  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJur = jurisdictionFilter === 'all' || s.jurisdiction === jurisdictionFilter;
    return matchesSearch && matchesJur;
  });

  // Lots for selected scheme
  const schemeLots = mockLots.filter((l) => l.schemeId === selectedScheme.id);
  const schemeCommittee = mockCommitteeMembers.filter((c) => c.schemeId === selectedScheme.id);

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Scheme = {
      id: `scheme-${Date.now()}`,
      code: newRegNo.replace(/\s+/g, '-'),
      registrationNo: newRegNo,
      name: newSchemeName,
      address: newAddress,
      jurisdiction: newJurisdiction,
      totalLots: Number(newTotalLots),
      totalEntitlement: Number(newTotalLots) * 100,
      fyStartMonth: 7,
      levyFrequency: 'quarterly',
      firstDueDate: '2026-07-01',
      leadDays: 30,
      gstRegistered: true,
      status: 'active',
      committeeCount: 3,
      funds: [
        {
          id: `fund-${Date.now()}-adm`,
          schemeId: `scheme-${Date.now()}`,
          type: 'admin',
          name: 'Administrative Fund',
          balanceCents: 5000000,
          targetBudgetCents: 15000000,
        },
        {
          id: `fund-${Date.now()}-cap`,
          schemeId: `scheme-${Date.now()}`,
          type: 'capital_works',
          name: 'Capital Works Fund',
          balanceCents: 12000000,
          targetBudgetCents: 8000000,
        },
      ],
      bankAccounts: [
        {
          id: `bank-${Date.now()}`,
          schemeId: `scheme-${Date.now()}`,
          bankName: 'Macquarie Bank Ltd',
          accountName: `The Owners - ${newRegNo} Trust A/C`,
          bsb: '182-222',
          accountNumberMasked: '••••1092',
          glAccountId: 'gl-1000',
          balanceCents: 17000000,
          lastReconciledDate: '2026-10-31',
        },
      ],
    };

    setSchemes([created, ...schemes]);
    setSelectedScheme(created);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Schemes Directory Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
        <div>
          <h1 className="text-lg font-black text-[#102747] tracking-tight">
            Strata Schemes & Statutory Roll
          </h1>
          <p className="text-xs text-[#71849A] font-medium">
            Manage scheme plans, unit entitlements, lot owners, resident contacts, and committee positions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#71849A] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme, CTS title..."
              className="pl-8 pr-3 py-1.5 text-xs bg-[#F4F8FC] border border-[#D5E5F2] rounded-lg focus:outline-none focus:border-[#00B5A4] w-48 sm:w-56"
            />
          </div>

          <select
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#F4F8FC] border border-[#D5E5F2] rounded-lg font-semibold text-[#334B68] focus:outline-none cursor-pointer"
          >
            <option value="all">All States</option>
            <option value="NSW">NSW</option>
            <option value="QLD">QLD</option>
            <option value="VIC">VIC</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Scheme</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Schemes List on Left, Active Scheme Detail & Strata Roll on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Scheme Cards List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-[11px] font-bold text-[#71849A] uppercase tracking-wider px-1">
            Registered Schemes ({filteredSchemes.length})
          </div>

          {filteredSchemes.map((scheme) => {
            const isSelected = selectedScheme.id === scheme.id;
            const adminFund = scheme.funds.find((f) => f.type === 'admin');
            const capFund = scheme.funds.find((f) => f.type === 'capital_works');

            return (
              <div
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme)}
                className={`p-3.5 rounded-xl border transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-white border-[#00B5A4] shadow-md ring-1 ring-[#00B5A4]'
                    : 'bg-white hover:bg-[#F8FAFD] border-[#E5EEF5] shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-[#00B5A4] text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-[#102747]">{scheme.name}</h3>
                      <span className="text-[10px] font-mono font-bold text-[#00B5A4]">
                        {scheme.registrationNo}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700">
                    {scheme.jurisdiction}
                  </span>
                </div>

                <div className="text-[11px] text-[#71849A] truncate mt-1.5">{scheme.address}</div>

                <div className="mt-3 pt-2 border-t border-[#F0F5FA] grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Lots</span>
                    <strong className="text-slate-800 font-bold">{scheme.totalLots} Lots</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Trust Cash</span>
                    <strong className="font-mono text-emerald-700 font-bold">
                      <MoneyText cents={(adminFund?.balanceCents || 0) + (capFund?.balanceCents || 0)} />
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Scheme Deep-Dive & Strata Roll (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E5EEF5] shadow-2xs overflow-hidden">
          {/* Scheme Header Banner */}
          <div className="p-4 bg-gradient-to-r from-[#08294A] to-[#102747] text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#00B5A4] text-white">
                    {selectedScheme.jurisdiction}
                  </span>
                  <span className="text-xs font-mono text-teal-300 font-bold">
                    {selectedScheme.registrationNo}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight mt-1">
                  {selectedScheme.name}
                </h2>
                <p className="text-xs text-white/70 mt-0.5">{selectedScheme.address}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/60 block">Levy Cycle</span>
                  <span className="text-xs font-bold capitalize text-white">
                    {selectedScheme.levyFrequency}
                  </span>
                </div>
                <div className="text-right bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/60 block">Unit Entitlement</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {selectedScheme.totalEntitlement.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scheme Sub-Tabs */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs font-bold">
              <button
                onClick={() => setActiveTab('roll')}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${
                  activeTab === 'roll' ? 'bg-[#00B5A4] text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                Strata Roll ({schemeLots.length} Lots)
              </button>
              <button
                onClick={() => setActiveTab('committee')}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${
                  activeTab === 'committee' ? 'bg-[#00B5A4] text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                Committee ({schemeCommittee.length})
              </button>
              <button
                onClick={() => setActiveTab('funds')}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${
                  activeTab === 'funds' ? 'bg-[#00B5A4] text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                Trust Accounts & Funds
              </button>
            </div>
          </div>

          {/* Tab 1: Strata Roll */}
          {activeTab === 'roll' && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Official statutory Strata Roll containing lot entitlement, owners, and current levy ledger status.
                </span>
                <button
                  onClick={() => alert('Exporting Strata Roll to statutory PDF report...')}
                  className="flex items-center gap-1 text-[#00B5A4] hover:text-[#009e8f] font-bold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Roll PDF</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-[#E5EEF5] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[#71849A] font-bold border-b border-[#E5EEF5]">
                      <th className="py-2.5 px-3">Lot</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3 text-left">Entitlement</th>
                      <th className="py-2.5 px-3">Owner Contact</th>
                      <th className="py-2.5 px-3">Occupancy</th>
                      <th className="py-2.5 px-3">CRN</th>
                      <th className="py-2.5 px-3 text-left">Balance Due</th>
                      <th className="py-2.5 px-3 text-left">Arrears</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5FA]">
                    {schemeLots.map((lot) => (
                      <tr key={lot.id} className="hover:bg-[#F8FAFD] transition">
                        <td className="py-2.5 px-3 font-extrabold text-[#102747] whitespace-nowrap">
                          {lot.lotNumber}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-800">{lot.unitLabel}</span>
                          <span className="text-[10px] text-slate-400 block">{lot.floorLabel}</span>
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono font-bold text-[#102747] font-bold">
                          {lot.entitlement}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{lot.ownerName}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 capitalize">
                            {lot.occupancyType.replace('_', ' ')}
                          </span>
                          {lot.occupierName && (
                            <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                              {lot.occupierName}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#102747] font-bold">
                          {lot.crn}
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono font-bold">
                          {lot.currentBalanceCents > 0 ? (
                            <span className="text-rose-600">
                              <MoneyText cents={lot.currentBalanceCents} />
                            </span>
                          ) : lot.currentBalanceCents < 0 ? (
                            <span className="text-emerald-600">
                              <MoneyText cents={lot.currentBalanceCents} /> Credit
                            </span>
                          ) : (
                            <span className="text-slate-400">$0.00</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-left">
                          {lot.arrearsLevel > 0 ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                              L{lot.arrearsLevel}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                              Paid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Committee Members */}
          {activeTab === 'committee' && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Current executive committee members appointed under statutory AGM elections.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schemeCommittee.map((cm) => (
                  <div key={cm.id} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-teal-100 text-[#00B5A4]">
                        {cm.role}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        Lot #{cm.lotNumber}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[#102747]">{cm.name}</div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cm.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cm.phone}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                      Appointed: {new Date(cm.appointedDate).toLocaleDateString('en-AU')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Trust Accounts & Funds */}
          {activeTab === 'funds' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Statutory Trust Bank Accounts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedScheme.bankAccounts.map((bank) => (
                    <div key={bank.id} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-extrabold text-[#102747]">{bank.bankName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                          Reconciled
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mb-2">
                        BSB: {bank.bsb} • ACC: {bank.accountNumberMasked}
                      </div>
                      <div className="flex items-baseline justify-between pt-2 border-t border-slate-200">
                        <span className="text-xs text-slate-500">Available Trust Balance:</span>
                        <span className="font-mono font-extrabold text-sm text-teal-700">
                          <MoneyText cents={bank.balanceCents} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Owners Corporation Funds Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedScheme.funds.map((fund) => (
                    <div key={fund.id} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-[#102747]">{fund.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                          {fund.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500">Current Balance:</span>
                        <span className="font-mono font-bold text-slate-900">
                          <MoneyText cents={fund.balanceCents} />
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500">Annual Target Budget:</span>
                        <span className="font-mono font-bold text-[#102747]">
                          <MoneyText cents={fund.targetBudgetCents} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Scheme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#08294A] text-white">
              <h3 className="font-bold text-sm">Register New Strata Scheme</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateScheme} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Scheme / Plan Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSchemeName}
                  onChange={(e) => setNewSchemeName(e.target.value)}
                  placeholder="e.g. Bellevue Promenade Strata"
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Registration Title / No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newRegNo}
                    onChange={(e) => setNewRegNo(e.target.value)}
                    placeholder="e.g. SP 88201 or CTS 34912"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Jurisdiction / State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newJurisdiction}
                    onChange={(e) => setNewJurisdiction(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                  >
                    <option value="NSW">NSW (Strata Schemes Management Act 2015)</option>
                    <option value="QLD">QLD (BCCM Act 1997)</option>
                    <option value="VIC">VIC (Owners Corporations Act 2006)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. 12 Bellevue Rd, Bellevue Hill NSW 2023"
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Number of Lots</label>
                <input
                  type="number"
                  min="2"
                  value={newTotalLots}
                  onChange={(e) => setNewTotalLots(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div className="flex items-center justify-start gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-md font-bold shadow-xs"
                >
                  Register Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
