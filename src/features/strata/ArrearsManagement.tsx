import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Send,
  FileText,
  Clock,
  CheckCircle,
  Download,
  ExternalLink,
  PauseCircle,
  Play,
  Filter,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import {
  mockArrearsCases,
  mockDebtReferrals,
  mockSchemes,
} from '../../lib/strataMockData';
import { ArrearsCase, DebtReferral, ArrearsLevel } from '../../types/strata';
import { MoneyText } from '../../components/ui/MoneyText';

interface ArrearsManagementProps {
  initialTab?: 'cases' | 'aged_report' | 'referrals' | 'policy';
}

export const ArrearsManagement: React.FC<ArrearsManagementProps> = ({ initialTab = 'cases' }) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'aged_report' | 'referrals' | 'policy'>(initialTab);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('scheme-01');
  const [cases, setCases] = useState<ArrearsCase[]>(mockArrearsCases);
  const [referrals, setReferrals] = useState<DebtReferral[]>(mockDebtReferrals);
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const selectedScheme = mockSchemes.find((s) => s.id === selectedSchemeId) || mockSchemes[0];

  // Filtering
  const filteredCases = cases.filter((c) => {
    const matchesScheme = selectedSchemeId === 'all' || c.schemeId === selectedSchemeId;
    const matchesLevel = levelFilter === 'all' || c.level.toString() === levelFilter;
    return matchesScheme && matchesLevel;
  });

  // Calculate totals
  const totalArrearsCents = filteredCases.reduce((acc, c) => acc + c.totalOverdueCents, 0);
  const total1To30 = filteredCases.reduce((acc, c) => acc + c.ageing1To30Cents, 0);
  const total31To60 = filteredCases.reduce((acc, c) => acc + c.ageing31To60Cents, 0);
  const total61To90 = filteredCases.reduce((acc, c) => acc + c.ageing61To90Cents, 0);
  const total91Plus = filteredCases.reduce((acc, c) => acc + c.ageing91PlusCents, 0);

  // Nightly Escalation Run simulation (WF-08)
  const handleExecuteEscalation = () => {
    alert('Nightly Arrears Job executed! Processed all active schemes. Notices generated for eligible lots, automated tasks created for Level 2 cases.');
  };

  const handleReferCase = (arrearsCase: ArrearsCase) => {
    const newRef: DebtReferral = {
      id: `ref-${Date.now()}`,
      caseId: arrearsCase.id,
      schemeId: arrearsCase.schemeId,
      lotNumber: arrearsCase.lotNumber,
      ownerName: arrearsCase.ownerName,
      overdueAmountCents: arrearsCase.totalOverdueCents,
      referralDate: new Date().toISOString().split('T')[0],
      provider: 'LevyCollect',
      status: 'pending',
      externalRef: `LC-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setReferrals([newRef, ...referrals]);
    alert(`Case for Lot #${arrearsCase.lotNumber} referred to LevyCollect (Ref: ${newRef.externalRef})! Statutory ledger statement payload generated.`);
  };

  const handleTogglePaymentPlan = (caseId: string) => {
    setCases(
      cases.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            paymentPlanActive: !c.paymentPlanActive,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
        <div>
          <h1 className="text-lg font-black text-[#102747] tracking-tight">
            Arrears Management & Debt Recovery (F-ST-06)
          </h1>
          <p className="text-xs text-[#71849A] font-medium">
            Multi-level escalation policies (L0–L3), automated notices, aged debtors reporting, and external debt collection referral (LevyCollect).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F4F8FC] border border-[#D5E5F2] rounded-lg font-bold text-[#102747] focus:outline-none cursor-pointer"
          >
            <option value="all">All Schemes</option>
            {mockSchemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} • {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExecuteEscalation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Escalation Job</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#E5EEF5] shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">Total Overdue Arrears</span>
          <div className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-1">
            <MoneyText cents={totalArrearsCents} />
          </div>
          <span className="text-[11px] text-[#102747] font-medium font-sans">{filteredCases.length} lots in arrears</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EEF5] shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">1 – 30 Days Overdue</span>
          <div className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-1">
            <MoneyText cents={total1To30} />
          </div>
          <span className="text-[11px] text-[#102747] font-medium font-sans">Level 1 Reminders</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EEF5] shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">31 – 60 Days Overdue</span>
          <div className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-1">
            <MoneyText cents={total31To60} />
          </div>
          <span className="text-[11px] text-[#102747] font-medium font-sans">Level 2 Final Notices</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EEF5] shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">61 – 90 Days Overdue</span>
          <div className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-1">
            <MoneyText cents={total61To90} />
          </div>
          <span className="text-[11px] text-[#102747] font-medium font-sans">Referral Eligible</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EEF5] shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">91+ Days Critical</span>
          <div className="text-2xl font-black tracking-tight text-[#102747] font-sans mt-1">
            <MoneyText cents={total91Plus} />
          </div>
          <span className="text-[11px] text-[#102747] font-medium font-sans">Legal Recovery</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EEF5] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('cases')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'cases'
            ? 'bg-[#00B5A4] text-white shadow-xs'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Arrears Watchlist & Action Cases</span>
        </button>

        <button
          onClick={() => setActiveTab('aged_report')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'aged_report'
            ? 'bg-[#00B5A4] text-white shadow-xs'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Statutory Aged Debtors Report (RPT-ST-01)</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'referrals'
            ? 'bg-[#00B5A4] text-white shadow-xs'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>External Debt Collection (LevyCollect)</span>
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'policy'
            ? 'bg-[#00B5A4] text-white shadow-xs'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Escalation Policy & Rules</span>
        </button>
      </div>

      {/* Tab 1: Arrears Watchlist & Cases */}
      {activeTab === 'cases' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#F0F5FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-[#102747]">Active Overdue Cases</h2>
              <p className="text-[11px] text-[#71849A]">
                Cases advance automatically through thresholds during the nightly escalation run (WF-08).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-[#F4F8FC] border border-[#D5E5F2] rounded-md font-semibold text-slate-700"
              >
                <option value="all">All Levels</option>
                <option value="1">Level 1 (Reminder)</option>
                <option value="2">Level 2 (Final Notice)</option>
                <option value="3">Level 3 (Referral Eligible)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold border-b border-[#E5EEF5]">
                  <th className="py-2.5 px-4">Lot</th>
                  <th className="py-2.5 px-3">Owner Contact</th>
                  <th className="py-2.5 px-3">Current Level</th>
                  <th className="py-2.5 px-3">Oldest Due Date</th>
                  <th className="py-2.5 px-3">Days Overdue</th>
                  <th className="py-2.5 px-3 text-left">Balance Due</th>
                  <th className="py-2.5 px-3">Payment Plan</th>
                  <th className="py-2.5 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8FAFD] transition">
                    <td className="py-3 px-4 font-bold text-[#102747]">
                      {c.unitLabel}
                      <span className="text-[10px] text-slate-400 block font-normal">Lot #{c.lotNumber} • {c.schemeCode}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{c.ownerName}</div>
                      <div className="text-[10px] text-slate-400">{c.ownerPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${c.level === 3
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : c.level === 2
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                      >
                        Level {c.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#102747] font-bold">{c.oldestDueDate}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{c.daysOverdue} days</td>
                    <td className="py-3 px-3 text-left font-mono font-bold text-rose-600">
                      <MoneyText cents={c.totalOverdueCents} />
                    </td>
                    <td className="py-3 px-3">
                      {c.paymentPlanActive ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                          Active Plan
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-left space-x-1.5">
                      <button
                        onClick={() => handleTogglePaymentPlan(c.id)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded text-[11px] font-bold border border-slate-300 transition"
                      >
                        {c.paymentPlanActive ? 'Cancel Plan' : 'Plan'}
                      </button>

                      {c.level === 3 && (
                        <button
                          onClick={() => handleReferCase(c)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold transition shadow-2xs"
                        >
                          Refer to Legal
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Statutory Aged Debtors Report (RPT-ST-01) */}
      {activeTab === 'aged_report' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#F0F5FA] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">
                Aged Debtors Ledger Report (RPT-ST-01)
              </h2>
              <p className="text-[11px] text-[#71849A]">
                Standard Australian statutory format per EV-028. Buckets calculated from charge due dates.
              </p>
            </div>
            <button
              onClick={() => alert('Exporting Aged Debtors report to Excel...')}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#F4F8FC] border border-[#D5E5F2] hover:bg-slate-100 text-slate-700 rounded-md text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold border-b border-[#E5EEF5]">
                  <th className="py-2.5 px-4">Lot</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Owner Name</th>
                  <th className="py-2.5 px-3 text-left">1 – 30 Days</th>
                  <th className="py-2.5 px-3 text-left">31 – 60 Days</th>
                  <th className="py-2.5 px-3 text-left">61 – 90 Days</th>
                  <th className="py-2.5 px-3 text-left">91+ Days</th>
                  <th className="py-2.5 px-4 text-left">Total Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8FAFD] transition font-mono">
                    <td className="py-2.5 px-4 font-sans font-bold text-slate-900 whitespace-nowrap">{c.lotNumber}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-[#102747] font-bold">{c.unitLabel}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">{c.ownerName}</td>
                    <td className="py-2.5 px-3 text-left text-[#102747] font-bold">
                      {c.ageing1To30Cents > 0 ? <MoneyText cents={c.ageing1To30Cents} /> : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-left text-[#102747] font-bold">
                      {c.ageing31To60Cents > 0 ? <MoneyText cents={c.ageing31To60Cents} /> : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-left text-[#102747] font-bold">
                      {c.ageing61To90Cents > 0 ? <MoneyText cents={c.ageing61To90Cents} /> : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-left text-rose-600 font-bold">
                      {c.ageing91PlusCents > 0 ? <MoneyText cents={c.ageing91PlusCents} /> : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-left font-black text-slate-900">
                      <MoneyText cents={c.totalOverdueCents} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#F8FAFC] font-mono font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={3} className="py-3 px-4 font-sans font-black text-slate-900">
                    Grand Total
                  </td>
                  <td className="py-3 px-3 text-left text-slate-900">
                    <MoneyText cents={total1To30} />
                  </td>
                  <td className="py-3 px-3 text-left text-slate-900">
                    <MoneyText cents={total31To60} />
                  </td>
                  <td className="py-3 px-3 text-left text-slate-900">
                    <MoneyText cents={total61To90} />
                  </td>
                  <td className="py-3 px-3 text-left text-rose-600 font-black">
                    <MoneyText cents={total91Plus} />
                  </td>
                  <td className="py-3 px-4 text-left text-rose-700 font-black text-sm">
                    <MoneyText cents={totalArrearsCents} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Debt Referrals */}
      {activeTab === 'referrals' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
          <div className="border-b border-[#F0F5FA] pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">External Debt Collection Referrals</h2>
              <p className="text-[11px] text-[#71849A]">
                API integration with LevyCollect and legal partners. Payments continue to flow directly to scheme trust bank.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
              LevyCollect Live Adapter
            </span>
          </div>

          <div className="space-y-2">
            {referrals.map((ref) => (
              <div key={ref.id} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#102747]">
                      <span>{ref.ownerName}</span>
                      <span className="block whitespace-nowrap">(Lot #{ref.lotNumber})</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                      {ref.externalRef}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Provider: <strong>{ref.provider}</strong> • Referred: {ref.referralDate}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Referred Amount</span>
                    <strong className="font-mono text-rose-600 text-sm">
                      <MoneyText cents={ref.overdueAmountCents} />
                    </strong>
                  </div>

                  <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase bg-amber-100 text-amber-800">
                    {ref.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Escalation Policy Model */}
      {activeTab === 'policy' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
          <div className="border-b border-[#F0F5FA] pb-2">
            <h2 className="text-sm font-black text-[#102747]">Configured Statutory Arrears Policy</h2>
            <p className="text-[11px] text-[#71849A]">
              Standard 4-level policy thresholds enforced during daily escalation.
            </p>
          </div>

          <div className="overflow-x-auto border border-[#E5EEF5] rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Level</th>
                  <th className="p-2.5">Stage Name</th>
                  <th className="p-2.5">Days Overdue</th>
                  <th className="p-2.5">Min Balance</th>
                  <th className="p-2.5">Automated Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-bold">Level 0</td>
                  <td className="p-2.5">Nil / Up-to-date</td>
                  <td className="p-2.5">—</td>
                  <td className="p-2.5">—</td>
                  <td className="p-2.5 text-slate-400">None</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-[#102747]">Level 1</td>
                  <td className="p-2.5 font-semibold">Reminder Notice</td>
                  <td className="p-2.5">14 days</td>
                  <td className="p-2.5 font-mono">$10.00</td>
                  <td className="p-2.5">Automated friendly reminder notice via email/SMS</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-700">Level 2</td>
                  <td className="p-2.5 font-semibold">Final Notice & Manager Call</td>
                  <td className="p-2.5">35 days</td>
                  <td className="p-2.5 font-mono">$10.00</td>
                  <td className="p-2.5">Dispatches s85 formal notice + creates task for Strata Manager follow-up</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-rose-700">Level 3</td>
                  <td className="p-2.5 font-semibold">Legal Referral Eligible</td>
                  <td className="p-2.5">60 days</td>
                  <td className="p-2.5 font-mono">$500.00</td>
                  <td className="p-2.5">Case flagged for manager approval to refer to LevyCollect legal recovery</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
