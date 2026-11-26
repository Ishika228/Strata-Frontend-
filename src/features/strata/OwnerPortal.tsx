import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  CreditCard,
  FileText,
  MessageSquare,
  Wrench,
  Users,
  Shield,
  Download,
  CheckCircle,
  Clock,
  ArrowRight,
  Vote,
  Sparkles,
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  X,
} from 'lucide-react';
import {
  mockSchemes,
  mockLots,
  mockLevyCharges,
  mockSupplierInvoices,
  mockWallPosts,
  mockStrataMeetings,
} from '../../lib/strataMockData';
import { MoneyText } from '../../components/ui/MoneyText';
import { useNavigate } from 'react-router-dom';

interface OwnerPortalProps {
  initialRole?: 'owner' | 'committee';
}

export const OwnerPortal: React.FC<OwnerPortalProps> = ({ initialRole = 'owner' }) => {
  const navigate = useNavigate();
  const [isCommitteeView, setIsCommitteeView] = useState(initialRole === 'committee');
  const [activePortalTab, setActivePortalTab] = useState<'home' | 'ledger' | 'docs' | 'wall' | 'requests' | 'approvals'>('home');
  const [showPayModal, setShowPayModal] = useState(false);

  // Default to Lot 2 (Elena Rostova - investor) or Lot 1 (Marcus Vance - owner occupier)
  const currentLot = mockLots[1]; // Elena Rostova, Unit 102
  const currentScheme = mockSchemes[0]; // Horizon Towers

  // Scheme financial summaries (EV-038)
  const adminFund = currentScheme.funds.find((f) => f.type === 'admin');
  const capFund = currentScheme.funds.find((f) => f.type === 'capital_works');
  const bankAccount = currentScheme.bankAccounts[0];

  // Invoices for committee approval
  const pendingInvoices = mockSupplierInvoices.filter((i) => i.status === 'pending_approval');

  // Lot charges / ledger lines
  const lotCharges = mockLevyCharges.filter((c) => c.lotNumber === currentLot.lotNumber);

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#334B68] font-sans">
      {/* Top Bar for Portal */}
      <header className="bg-[#08294A] text-white sticky top-0 z-40 px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00B5A4] flex items-center justify-center font-bold text-white shadow">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide">VERTEX OWNER PORTAL</div>
              <div className="text-[10px] text-teal-300 font-medium">
                {currentScheme.name} • {currentScheme.registrationNo}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Committee Mode Switch */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-[11px] font-semibold text-white/80">Role:</span>
              <button
                onClick={() => setIsCommitteeView(!isCommitteeView)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                  isCommitteeView
                    ? 'bg-[#00B5A4] text-white shadow-xs'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {isCommitteeView ? 'Committee Executive' : 'Lot Owner (Unit 102)'}
              </button>
            </div>

            <button
              onClick={() => navigate('/app/strata/dashboard')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold transition"
            >
              Back to Staff Console
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Navigation Tabs for Portal */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-[#E5EEF5]">
          <button
            onClick={() => setActivePortalTab('home')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activePortalTab === 'home'
                ? 'bg-[#00B5A4] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActivePortalTab('ledger')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activePortalTab === 'ledger'
                ? 'bg-[#00B5A4] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            My Levy Statement & Pay
          </button>
          <button
            onClick={() => setActivePortalTab('docs')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activePortalTab === 'docs'
                ? 'bg-[#00B5A4] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Scheme Documents & By-Laws
          </button>
          <button
            onClick={() => setActivePortalTab('wall')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activePortalTab === 'wall'
                ? 'bg-[#00B5A4] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Community Notice Wall
          </button>
          <button
            onClick={() => setActivePortalTab('requests')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activePortalTab === 'requests'
                ? 'bg-[#00B5A4] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Maintenance Requests
          </button>
          {isCommitteeView && (
            <button
              onClick={() => setActivePortalTab('approvals')}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activePortalTab === 'approvals'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              Committee Invoice Approvals ({pendingInvoices.length})
            </button>
          )}
        </div>

        {/* Tab 1: Portal Home */}
        {activePortalTab === 'home' && (
          <div className="space-y-5">
            {/* Owner Outstanding Balance Alert Banner */}
            <div className="bg-white p-5 rounded-xl border border-[#E5EEF5] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {currentLot.unitLabel} • Lot #{currentLot.lotNumber} ({currentLot.ownerName})
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-rose-600 font-mono tracking-tight">
                    <MoneyText cents={currentLot.currentBalanceCents} />
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-amber-100 text-amber-800">
                    Overdue: Arrears Level 2
                  </span>
                </div>
                <p className="text-xs text-[#71849A] mt-1 font-medium">
                  Next regular contribution levy scheduled for 01 Jan 2027. CRN: <strong>{currentLot.crn}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPayModal(true)}
                  className="px-5 py-2.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Now Online</span>
                </button>
              </div>
            </div>

            {/* Scheme Summary Tiles (EV-038) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-[#71849A]">
                  Scheme Financial Overview ({currentScheme.name})
                </h2>
                <span className="text-[11px] text-teal-700 font-bold">
                  {isCommitteeView ? 'Full Committee Transparency' : 'General Scheme Summary'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">Administrative Fund Cash</span>
                  <strong className="text-2xl font-black tracking-tight text-[#102747] font-sans block mt-1">
                    <MoneyText cents={adminFund?.balanceCents || 0} />
                  </strong>
                  <span className="text-[11px] font-medium text-[#102747] font-sans">Day-to-day operations & utilities</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">Capital Works Fund (Sinking)</span>
                  <strong className="text-2xl font-black tracking-tight text-[#102747] font-sans block mt-1">
                    <MoneyText cents={capFund?.balanceCents || 0} />
                  </strong>
                  <span className="text-[11px] font-medium text-[#102747] font-sans">Major repairs & reserve fund</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">Trust Bank Account</span>
                  <strong className="text-2xl font-black tracking-tight text-[#102747] font-sans block mt-1">
                    <MoneyText cents={bankAccount?.balanceCents || 0} />
                  </strong>
                  <span className="text-[11px] font-medium text-[#102747] font-sans">{bankAccount.bankName}</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">Total Scheme Arrears</span>
                  <strong className="text-2xl font-black tracking-tight text-[#102747] font-sans block mt-1">
                    $12,550.00
                  </strong>
                  <span className="text-[11px] font-medium text-[#102747] font-sans">96.8% timely collection rate</span>
                </div>
              </div>
            </div>

            {/* Upcoming Meeting / Vote Banner */}
            <div className="bg-gradient-to-r from-[#08294A] to-[#102747] text-white p-4 rounded-xl shadow-md flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#00B5A4] text-white">
                  Upcoming General Meeting
                </span>
                <h3 className="font-extrabold text-sm mt-1">2026 Annual General Meeting (AGM)</h3>
                <p className="text-xs text-white/70">Scheduled for 08 Dec 2026 • 5 Motions open for electronic voting</p>
              </div>

              <button
                onClick={() => navigate('/app/strata/meetings')}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Vote className="w-3.5 h-3.5 text-[#00B5A4]" />
                <span>Cast Electronic Vote</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Levy Statement & Ledger */}
        {activePortalTab === 'ledger' && (
          <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F5FA] pb-3">
              <div>
                <h2 className="text-sm font-black text-[#102747]">Lot 2 Account Ledger Statement</h2>
                <p className="text-[11px] text-[#71849A]">
                  Chronological history of contribution levies, statutory penalties, and receipt allocations.
                </p>
              </div>

              <button
                onClick={() => alert('Downloading official ledger statement PDF...')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F8FC] border border-[#D5E5F2] hover:bg-slate-100 text-slate-700 rounded-md text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Statement PDF</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-[#E5EEF5] rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#71849A] font-bold border-b border-[#E5EEF5]">
                    <th className="py-2.5 px-4">Due Date</th>
                    <th className="py-2.5 px-3">Transaction Description</th>
                    <th className="py-2.5 px-3 font-mono">Reference</th>
                    <th className="py-2.5 px-3 text-left">Debit</th>
                    <th className="py-2.5 px-3 text-left">Credit</th>
                    <th className="py-2.5 px-4 text-left">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F5FA] font-mono">
                  {lotCharges.map((chg) => (
                    <tr key={chg.id} className="hover:bg-[#F8FAFD] transition">
                      <td className="py-2.5 px-4 text-[#102747] font-bold">{chg.dueDate}</td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">
                        {chg.type === 'penalty' ? 'Late Payment Interest (10% p.a.)' : `Contribution Levy – ${chg.fundType.toUpperCase()}`}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">{chg.crn}</td>
                      <td className="py-2.5 px-3 text-left text-rose-600 font-bold">
                        <MoneyText cents={chg.amountCents} />
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-400">—</td>
                      <td className="py-2.5 px-4 text-left font-black text-slate-900">
                        <MoneyText cents={chg.outstandingCents} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Scheme Documents & By-Laws */}
        {activePortalTab === 'docs' && (
          <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
            <h2 className="text-sm font-black text-[#102747]">Scheme Document Repository</h2>
            <p className="text-[11px] text-[#71849A]">
              Registered by-laws, past AGM/EGM minutes, financial statements, and insurance policies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <div>
                    <strong className="text-slate-900">Registered By-Laws (Horizon Towers)</strong>
                    <span className="text-[10px] text-slate-400 block">PDF • 1.2 MB</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Opening By-Laws document...')}
                  className="text-xs font-bold text-[#00B5A4] hover:underline"
                >
                  Download
                </button>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <div>
                    <strong className="text-slate-900">2025 AGM Confirmed Minutes</strong>
                    <span className="text-[10px] text-slate-400 block">PDF • 840 KB</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Opening Minutes document...')}
                  className="text-xs font-bold text-[#00B5A4] hover:underline"
                >
                  Download
                </button>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <div>
                    <strong className="text-slate-900">Certificate of Currency (Insurance)</strong>
                    <span className="text-[10px] text-slate-400 block">PDF • 320 KB</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Opening Insurance certificate...')}
                  className="text-xs font-bold text-[#00B5A4] hover:underline"
                >
                  Download
                </button>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <div>
                    <strong className="text-slate-900">Annual Fire Safety Statement (AFSS)</strong>
                    <span className="text-[10px] text-slate-400 block">PDF • 450 KB</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Opening AFSS certificate...')}
                  className="text-xs font-bold text-[#00B5A4] hover:underline"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Community Notice Wall */}
        {activePortalTab === 'wall' && (
          <div className="space-y-3">
            {mockWallPosts
              .filter((p) => p.wallType === 'community')
              .map((post) => (
                <div key={post.id} className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-slate-900">{post.authorName}</strong>
                      <span className="text-[10px] text-slate-400 block">{post.authorRole}</span>
                    </div>
                    {post.isPinned && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                        Pinned Notice
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-[#102747]">{post.title}</h3>
                  <p className="text-xs text-slate-700">{post.content}</p>
                </div>
              ))}
          </div>
        )}

        {/* Tab 5: Maintenance / Service Requests */}
        {activePortalTab === 'requests' && (
          <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#F0F5FA] pb-2">
              <div>
                <h2 className="text-sm font-black text-[#102747]">Common Property Maintenance Requests</h2>
                <p className="text-[11px] text-[#71849A]">
                  Submit issues regarding common areas (lifts, gates, lighting, intercom, pool).
                </p>
              </div>
              <button
                onClick={() => alert('Raise New Maintenance Request modal')}
                className="px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold"
              >
                Report Issue
              </button>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">REQ-8902: Basement B2 Security Door Latch</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">Assigned</span>
              </div>
              <p className="text-slate-500 text-[11px]">Reported on 20 Nov 2026 • Locksmith dispatched under Strata Work Order SWO-8802</p>
            </div>
          </div>
        )}

        {/* Tab 6: Committee Invoice Approvals (BR-ST-15) */}
        {activePortalTab === 'approvals' && isCommitteeView && (
          <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-4">
            <div className="border-b border-[#F0F5FA] pb-2">
              <h2 className="text-sm font-black text-[#102747]">Committee Invoices Awaiting Your Sign-Off</h2>
              <p className="text-[11px] text-[#71849A]">
                Under statutory rules, committee members can review supplier invoices along with verified remaining budget.
              </p>
            </div>

            <div className="space-y-3">
              {pendingInvoices.map((inv) => (
                <div key={inv.id} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5EEF5] space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#102747]">{inv.supplierName}</h3>
                      <span className="font-mono text-slate-400 text-[11px]">{inv.invoiceNumber} • Category: {inv.glAccountName}</span>
                    </div>
                    <div className="text-right">
                      <strong className="font-mono font-black text-base text-slate-900">
                        <MoneyText cents={inv.totalAmountCents} />
                      </strong>
                      <span className="text-[10px] text-slate-400 block">Due: {inv.dueDate}</span>
                    </div>
                  </div>

                  {/* BR-ST-15: Budget Remaining */}
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <span className="text-emerald-900 font-bold">Approved Budget Remaining:</span>
                    <strong className="font-mono text-emerald-800 font-black text-sm">
                      <MoneyText cents={inv.budgetRemainingCents} />
                    </strong>
                  </div>

                  <div className="flex items-center justify-start gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => alert('Invoice rejected and referred back to manager with note.')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-rose-600 rounded-lg font-bold border border-rose-200"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => alert(`Invoice ${inv.invoiceNumber} approved with your electronic signature!`)}
                      className="px-4 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg font-bold shadow-xs"
                    >
                      Approve Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Pay Now Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-[#08294A] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-teal-300 font-bold uppercase">Online Payment Gateway</span>
                <h3 className="font-extrabold text-sm">Pay Strata Contribution</h3>
              </div>
              <button onClick={() => setShowPayModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">TOTAL OUTSTANDING</span>
                  <strong className="font-mono text-xl font-black text-rose-600">
                    <MoneyText cents={currentLot.currentBalanceCents} />
                  </strong>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-500">
                  CRN: {currentLot.crn}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cardholder Name</label>
                <input
                  type="text"
                  defaultValue={currentLot.ownerName}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Credit / Debit Card Number</label>
                <input
                  type="text"
                  placeholder="4532 •••• •••• 8892"
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="•••"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4] font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-start gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPayModal(false);
                    alert(`Payment of $3,450.00 processed successfully! Receipt dispatched to ${currentLot.ownerEmail}.`);
                  }}
                  className="px-4 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-md font-bold shadow-xs"
                >
                  Submit Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
