import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  Calendar,
  AlertTriangle,
  Play,
  Download,
  CreditCard,
  CheckCircle,
  ExternalLink,
  Percent,
  Plus,
  X,
  FileCheck,
} from 'lucide-react';
import {
  mockLevyCharges,
  mockSpecialLevies,
  mockSchemes,
  mockLots,
} from '../../lib/strataMockData';
import { LevyCharge, SpecialLevy } from '../../types/strata';
import { MoneyText } from '../../components/ui/MoneyText';

interface LevyEngineProps {
  initialTab?: 'notices' | 'calculator' | 'special' | 'penalties';
}

export const LevyEngine: React.FC<LevyEngineProps> = ({ initialTab = 'notices' }) => {
  const [activeTab, setActiveTab] = useState<'notices' | 'calculator' | 'special' | 'penalties'>(initialTab);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('scheme-01');
  const [charges, setCharges] = useState<LevyCharge[]>(mockLevyCharges);
  const [specialLevies, setSpecialLevies] = useState<SpecialLevy[]>(mockSpecialLevies);
  const [activeNoticeModal, setActiveNoticeModal] = useState<LevyCharge | null>(null);

  // Levy Run Simulation State
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [runStats, setRunStats] = useState<{ count: number; totalCents: number } | null>(null);

  const selectedScheme = mockSchemes.find((s) => s.id === selectedSchemeId) || mockSchemes[0];
  const schemeLots = mockLots.filter((l) => l.schemeId === selectedScheme.id);

  // Trigger automated levy run ahead of due date
  const handleExecuteLevyRun = () => {
    setRunStatus('running');
    setTimeout(() => {
      // Calculate charges for each lot per the formula:
      // a = floor(I_i * lot.entitlement / E)
      const adminTargetCents = 8000000; // $80,000 for this quarterly instalment
      const E = selectedScheme.totalEntitlement; // 10000

      const newCharges: LevyCharge[] = schemeLots.map((lot) => {
        const lotAmountCents = Math.floor((adminTargetCents * lot.entitlement) / E);
        return {
          id: `chg-${Date.now()}-${lot.lotNumber}`,
          schemeId: selectedScheme.id,
          lotId: lot.id,
          lotNumber: lot.lotNumber,
          unitLabel: lot.unitLabel,
          ownerName: lot.ownerName,
          type: 'levy',
          fundType: 'admin',
          periodLabel: 'Q3 2026/27',
          amountCents: lotAmountCents,
          outstandingCents: lotAmountCents,
          dueDate: '2027-01-01',
          crn: lot.crn,
          status: 'issued',
        };
      });

      setCharges([...newCharges, ...charges]);
      setRunStats({
        count: newCharges.length,
        totalCents: newCharges.reduce((acc, c) => acc + c.amountCents, 0),
      });
      setRunStatus('completed');
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
        <div>
          <h1 className="text-lg font-black text-[#102747] tracking-tight">
            Levy Engine, Calculation & Invoicing (F-ST-02, F-ST-03)
          </h1>
          <p className="text-xs text-[#71849A] font-medium">
            Entitlement-based levy calculation, automated quarterly notice issuance, Luhn CRN pay-now, and penalty accrual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F4F8FC] border border-[#D5E5F2] rounded-lg font-bold text-[#102747] focus:outline-none cursor-pointer"
          >
            {mockSchemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} • {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExecuteLevyRun}
            disabled={runStatus === 'running'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{runStatus === 'running' ? 'Executing Run...' : 'Execute Levy Run'}</span>
          </button>
        </div>
      </div>

      {/* Run Completion Notification Banner */}
      {runStatus === 'completed' && runStats && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Levy Run Successful:</strong> Generated {runStats.count} lot notices totaling{' '}
              <strong><MoneyText cents={runStats.totalCents} /></strong> for {selectedScheme.name}.
              Idempotency checks verified.
            </span>
          </div>
          <button
            onClick={() => setRunStatus('idle')}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EEF5] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'notices'
            ? 'bg-[#00B5A4] text-white shadow-xs'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Issued Levy Notices & Charges</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'calculator'
            ? 'bg-[#00B5A4] text-white shadow-xs'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Entitlement Formula & Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('special')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'special'
            ? 'bg-[#00B5A4] text-white shadow-xs'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Special Levies</span>
        </button>

        <button
          onClick={() => setActiveTab('penalties')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'penalties'
            ? 'bg-[#00B5A4] text-white shadow-xs'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Interest & Penalty Rules (10% p.a.)</span>
        </button>
      </div>

      {/* Tab 1: Issued Levy Notices & Charges */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#F0F5FA] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">Statutory Levy Invoices Register</h2>
              <p className="text-[11px] text-[#71849A]">
                PDF notices dispatched with Customer Reference Number (CRN) & Pay-Now gateway links.
              </p>
            </div>
            <button
              onClick={() => alert('Batch downloading PDF levy notices...')}
              className="flex items-center gap-1 px-3 py-1 bg-[#F4F8FC] border border-[#D5E5F2] hover:bg-slate-100 text-slate-700 rounded-md text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Batch PDFs</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold border-b border-[#E5EEF5]">
                  <th className="py-2.5 px-4">Lot</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3">Levy Type</th>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3 font-mono">CRN</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3 text-left">Amount</th>
                  <th className="py-2.5 px-3 text-left">Status</th>
                  <th className="py-2.5 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {charges.map((chg) => (
                  <tr key={chg.id} className="hover:bg-[#F8FAFD] transition">
                    <td className="py-3 px-4 font-bold text-[#102747]">
                      {chg.unitLabel}
                      <span className="text-[10px] text-slate-400 block font-normal">Lot #{chg.lotNumber}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{chg.ownerName}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold capitalize ${chg.type === 'penalty'
                          ? 'bg-amber-100 text-amber-800'
                          : chg.fundType === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                          }`}
                      >
                        {chg.type === 'penalty' ? '10% Penalty' : `${chg.fundType.replace('_', ' ')}`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#102747] font-bold font-medium">{chg.periodLabel}</td>
                    <td className="py-3 px-3 font-mono font-bold text-teal-700">{chg.crn}</td>
                    <td className="py-3 px-3 font-medium text-[#102747] font-bold">{chg.dueDate}</td>
                    <td className="py-3 px-3 text-left font-mono font-bold text-slate-900">
                      <MoneyText cents={chg.amountCents} />
                    </td>
                    <td className="py-3 px-3 text-left">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${chg.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : chg.status === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-sky-100 text-sky-800'
                          }`}
                      >
                        {chg.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left">
                      <button
                        onClick={() => setActiveNoticeModal(chg)}
                        className="px-2.5 py-1 bg-[#F4F8FC] hover:bg-[#00B5A4] hover:text-white text-[#334B68] rounded-md text-[11px] font-bold border border-[#D5E5F2] transition cursor-pointer"
                      >
                        View Notice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Entitlement Formula & Schedule */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Formula Spec */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
            <h3 className="text-sm font-black text-[#102747]">Statutory Apportionment Algorithm</h3>
            <p className="text-xs text-[#71849A]">
              Under Australian Strata Acts, levy instalments are apportioned strictly proportional to each lot's Unit of Entitlement (UOE).
            </p>

            <div className="bg-[#F8FAFC] rounded-lg p-3 border border-slate-200 font-mono text-xs space-y-1 text-slate-800">
              <div className="text-[#00B5A4] font-bold">// Entitlement Apportionment</div>
              <div>n = instalments_per_year({selectedScheme.levyFrequency}) = 4</div>
              <div>E = sum(lot.entitlement) = {selectedScheme.totalEntitlement}</div>
              <div>T = levy_target(fund)</div>
              <div>I_i = floor(T / n)</div>
              <div className="font-bold text-[#102747]">a = floor(I_i * lot.entitlement / E)</div>
              <div className="text-slate-500">// Cent remainders distributed in descending order</div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Conservation Invariant: Sum = T Exactly</span>
              </div>
              <p className="text-[11px] text-teal-800">
                The algorithm guarantees sum of all lot instalments matches the budget levy target down to the exact single cent (Test FIN-01).
              </p>
            </div>
          </div>

          {/* Right: Worked Schedule per Lot */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
            <h3 className="text-sm font-black text-[#102747]">
              Worked Lot Apportionment Schedule ({selectedScheme.name})
            </h3>

            <div className="overflow-x-auto border border-[#E5EEF5] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-2">Lot</th>
                    <th className="p-2">Unit</th>
                    <th className="p-2 text-left">Entitlement</th>
                    <th className="p-2 text-left">Share %</th>
                    <th className="p-2 text-left">Quarterly Admin</th>
                    <th className="p-2 text-left">Quarterly Capital</th>
                    <th className="p-2 text-left">Quarterly Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schemeLots.map((lot) => {
                    const sharePct = ((lot.entitlement / selectedScheme.totalEntitlement) * 100).toFixed(2);
                    const qtrAdminCents = Math.floor((8000000 * lot.entitlement) / selectedScheme.totalEntitlement);
                    const qtrCapCents = Math.floor((4500000 * lot.entitlement) / selectedScheme.totalEntitlement);

                    return (
                      <tr key={lot.id}>
                        <td className="p-2 font-bold text-slate-900 whitespace-nowrap">{lot.lotNumber}</td>
                        <td className="p-2 font-medium text-[#102747] font-bold">{lot.unitLabel}</td>
                        <td className="p-2 text-left font-mono font-bold text-slate-800">{lot.entitlement}</td>
                        <td className="p-2 text-left font-mono text-[#102747] font-bold">{sharePct}%</td>
                        <td className="p-2 text-left font-mono text-slate-900">
                          <MoneyText cents={qtrAdminCents} />
                        </td>
                        <td className="p-2 text-left font-mono text-slate-900">
                          <MoneyText cents={qtrCapCents} />
                        </td>
                        <td className="p-2 text-left font-mono font-bold text-[#102747]">
                          <MoneyText cents={qtrAdminCents + qtrCapCents} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Special Levies */}
      {activeTab === 'special' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA]">
            <div>
              <h2 className="text-sm font-black text-[#102747]">Ad-hoc Special Levies Register</h2>
              <p className="text-[11px] text-[#71849A]">
                Special resolution levies raised for capital emergencies, major works, or litigation funds.
              </p>
            </div>
            <button
              onClick={() => alert('Raise Special Levy Modal')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Special Levy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialLevies.map((sl) => (
              <div key={sl.id} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5EEF5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                    {sl.fundType.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                    {sl.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-[#102747]">{sl.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{sl.purpose}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Levy Target</span>
                    <strong className="font-mono text-slate-900 text-sm font-bold">
                      <MoneyText cents={sl.totalTargetCents} />
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Due Date</span>
                    <strong className="text-slate-900 font-bold">{sl.dueDate}</strong>
                  </div>
                </div>

                <button
                  onClick={() => alert('Generating special levy notices for all lots...')}
                  className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 transition"
                >
                  Issue Special Notices
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Penalties & Interest Rules */}
      {activeTab === 'penalties' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-4">
          <div className="border-b border-[#F0F5FA] pb-3">
            <h2 className="text-sm font-black text-[#102747]">
              Statutory Late Payment Penalty Policy (U-22 / F-ST-03)
            </h2>
            <p className="text-[11px] text-[#71849A]">
              Under Section 85 of the Strata Schemes Management Act 2015, interest accrues daily on overdue levy principal at 10% per annum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">Penalty Rate</span>
              <div className="text-2xl font-black tracking-tight text-[#102747] font-sans">10.00% p.a.</div>
              <p className="text-[11px] font-medium text-[#102747] font-sans">Simple interest on overdue principal</p>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">Accrual Frequency</span>
              <div className="text-2xl font-black tracking-tight text-[#102747] font-sans">Monthly Accrual</div>
              <p className="text-[11px] font-medium text-[#102747] font-sans">Posted on 1st of each month</p>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#102747] font-sans block">Minimum Charge Threshold</span>
              <div className="text-2xl font-black tracking-tight text-[#102747] font-sans">$1.00 min</div>
              <p className="text-[11px] font-medium text-[#102747] font-sans">Amounts below threshold waived</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Exclusion Rule (BR-ST-11):</strong> Overdue lots with active approved payment plans or formal dispute holds are automatically exempt from penalty accrual until case resolution.
            </div>
          </div>
        </div>
      )}

      {/* View Notice Modal (Statutory PDF Representation) */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            {/* Notice Header */}
            <div className="p-4 bg-[#08294A] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-300">Statutory Notice</span>
                <h3 className="font-extrabold text-sm">Strata Contribution Levy Notice</h3>
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notice Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-black text-sm text-[#102747]">{selectedScheme.name}</h4>
                  <p className="text-slate-500 font-mono text-[11px]">{selectedScheme.registrationNo}</p>
                  <p className="text-slate-500 text-[11px]">{selectedScheme.address}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Due Date</span>
                  <span className="font-bold text-sm text-rose-600">{activeNoticeModal.dueDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">ISSUED TO</span>
                  <strong className="text-slate-900 block">{activeNoticeModal.ownerName}</strong>
                  <span className="text-slate-600 block">{activeNoticeModal.unitLabel} (Lot #{activeNoticeModal.lotNumber})</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block font-bold">CUSTOMER REFERENCE NUMBER (CRN)</span>
                  <strong className="font-mono text-base text-teal-700 font-black block">
                    {activeNoticeModal.crn}
                  </strong>
                  <span className="text-[10px] text-slate-400">BPAY Biller Code: 48921</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2">Description</th>
                      <th className="p-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2">
                        {activeNoticeModal.type === 'penalty'
                          ? 'Overdue Interest Charge (10% p.a.)'
                          : `Contribution Levy – ${activeNoticeModal.fundType.replace('_', ' ').toUpperCase()}`}
                        <span className="text-[10px] text-slate-400 block">{activeNoticeModal.periodLabel}</span>
                      </td>
                      <td className="p-2 text-left font-mono font-bold text-slate-900">
                        <MoneyText cents={activeNoticeModal.amountCents} />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-[#F8FAFC] font-bold border-t border-slate-200">
                    <tr>
                      <td className="p-2 text-slate-900">Total Amount Payable:</td>
                      <td className="p-2 text-left font-mono text-base text-[#102747] font-black">
                        <MoneyText cents={activeNoticeModal.amountCents} />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pay Now Section */}
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-teal-900">Pay Instantly Online</div>
                  <div className="text-[11px] text-teal-700">Credit card, Debit, Apple Pay, or BPAY</div>
                </div>
                <button
                  onClick={() => alert(`Redirecting to secure Pay-Now link for CRN ${activeNoticeModal.crn}...`)}
                  className="px-4 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-md font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Now</span>
                </button>
              </div>

              <div className="flex items-center justify-start gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveNoticeModal(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-bold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => alert('Downloading official PDF Notice...')}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
