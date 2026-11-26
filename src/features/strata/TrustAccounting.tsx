import React, { useState } from 'react';
import {
  DollarSign,
  BookOpen,
  PieChart,
  FileSpreadsheet,
  Plus,
  CheckCircle,
  Calendar,
  Lock,
  ArrowRight,
  Download,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  mockGLAccounts,
  mockJournalEntries,
  mockBudgetLines,
  mockSchemes,
} from '../../lib/strataMockData';
import { GLAccount, JournalEntry, BudgetLine } from '../../types/strata';
import { MoneyText } from '../../components/ui/MoneyText';

export const TrustAccounting: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'budgets' | 'reports'>('ledger');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('scheme-01');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [showNewJournalModal, setShowNewJournalModal] = useState(false);

  // New Journal state
  const [memo, setMemo] = useState('');
  const [sourceType, setSourceType] = useState<'manual' | 'invoice' | 'levy'>('manual');
  const [debitAccount, setDebitAccount] = useState('5200');
  const [creditAccount, setCreditAccount] = useState('1000');
  const [amountDollars, setAmountDollars] = useState('1250.00');

  const selectedScheme = mockSchemes.find((s) => s.id === selectedSchemeId) || mockSchemes[0];

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const cents = Math.round(parseFloat(amountDollars) * 100);
    const newEntry: JournalEntry = {
      id: `je-${Date.now()}`,
      schemeId: selectedSchemeId,
      date: new Date().toISOString().split('T')[0],
      period: '2026-11',
      sourceType,
      reference: `JRN-${Math.floor(1000 + Math.random() * 9000)}`,
      memo,
      totalAmountCents: cents,
      lines: [
        {
          id: `jl-${Date.now()}-1`,
          glAccountCode: debitAccount,
          glAccountName: mockGLAccounts.find((a) => a.code === debitAccount)?.name || 'Account',
          fundType: 'admin',
          debitCents: cents,
          creditCents: 0,
        },
        {
          id: `jl-${Date.now()}-2`,
          glAccountCode: creditAccount,
          glAccountName: mockGLAccounts.find((a) => a.code === creditAccount)?.name || 'Account',
          fundType: 'admin',
          debitCents: 0,
          creditCents: cents,
        },
      ],
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setShowNewJournalModal(false);
    setMemo('');
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Scheme Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
        <div>
          <h1 className="text-lg font-black text-[#102747] tracking-tight">
            Trust Accounting & General Ledger (F-ST-05, F-ST-07)
          </h1>
          <p className="text-xs text-[#71849A] font-medium">
            Dedicated double-entry books per scheme, fund segregation (Admin & Capital Works), statutory periods, and financial statements.
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
            onClick={() => setShowNewJournalModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Journal Entry</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EEF5] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeSubTab === 'ledger'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Double-Entry Journals & General Ledger</span>
        </button>

        <button
          onClick={() => setActiveSubTab('budgets')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeSubTab === 'budgets'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Annual Budgets & Fund Forecasts</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reports')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeSubTab === 'reports'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Statutory Financial Reports</span>
        </button>
      </div>

      {/* Sub-Tab 1: Double-Entry Journals & General Ledger */}
      {activeSubTab === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Chart of Accounts (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA]">
              <h2 className="text-xs font-black text-[#102747] uppercase tracking-wider">
                Chart of Accounts ({selectedScheme.code})
              </h2>
              <span className="text-[10px] text-slate-400">Statutory Template</span>
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {mockGLAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-2.5 rounded-lg hover:bg-[#F8FAFD] border border-transparent hover:border-[#E5EEF5] flex items-center justify-between text-xs transition"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#00B5A4]">{acc.code}</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {acc.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      {acc.type} {acc.fundType ? `• ${acc.fundType}` : ''}
                    </span>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-900">
                    <MoneyText cents={acc.balanceCents} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Posted Journals (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-[#E5EEF5] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#F0F5FA] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-[#102747]">Posted Double-Entry Journals</h2>
                <p className="text-[11px] text-[#71849A]">
                  Every transaction enforces Dr = Cr balance invariant tagged by statutory fund.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Period {new Date().toISOString().slice(0, 7)} Open</span>
              </div>
            </div>

            <div className="divide-y divide-[#F0F5FA]">
              {journalEntries.map((je) => (
                <div key={je.id} className="p-4 hover:bg-[#F8FAFD] transition space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-slate-100 text-slate-700">
                        {je.reference}
                      </span>
                      <span className="text-xs font-bold text-[#102747]">{je.memo}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        <MoneyText cents={je.totalAmountCents} />
                      </span>
                      <span className="text-[10px] text-slate-400 block">{je.date}</span>
                    </div>
                  </div>

                  {/* Journal lines breakdown */}
                  <div className="bg-[#F8FAFC] rounded-lg border border-[#E5EEF5] p-2 text-xs overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="text-slate-400 font-semibold border-b border-slate-200">
                          <th className="pb-1">Account</th>
                          <th className="pb-1">Fund</th>
                          <th className="pb-1 text-left">Debit</th>
                          <th className="pb-1 text-left">Credit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {je.lines.map((line) => (
                          <tr key={line.id}>
                            <td className="py-1 text-[#102747] font-bold">
                              <span className="font-mono font-bold text-slate-500 mr-1.5">
                                {line.glAccountCode}
                              </span>
                              {line.glAccountName}
                              {line.lotNumber && (
                                <span className="text-[10px] text-teal-600 font-semibold ml-1">
                                  (Lot {line.lotNumber})
                                </span>
                              )}
                              {line.supplierName && (
                                <span className="text-[10px] text-sky-600 font-semibold ml-1">
                                  ({line.supplierName})
                                </span>
                              )}
                            </td>
                            <td className="py-1 capitalize text-slate-500">{line.fundType}</td>
                            <td className="py-1 text-left font-mono text-slate-900 font-semibold">
                              {line.debitCents > 0 ? <MoneyText cents={line.debitCents} /> : '—'}
                            </td>
                            <td className="py-1 text-left font-mono text-slate-900 font-semibold">
                              {line.creditCents > 0 ? <MoneyText cents={line.creditCents} /> : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Annual Budgets & Fund Forecasts */}
      {activeSubTab === 'budgets' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#F0F5FA] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">
                Annual Budget & Actual Expenditure (FY 2026/27)
              </h2>
              <p className="text-[11px] text-[#71849A]">
                Approved budget lines directly drive the levy engine calculation target per fund (BR-ST-03).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-teal-100 text-[#00B5A4]">
                Status: Approved by AGM
              </span>
              <button
                onClick={() => alert('Exporting budget report to XLSX/PDF...')}
                className="flex items-center gap-1 px-3 py-1 bg-[#F4F8FC] border border-[#D5E5F2] hover:bg-slate-100 text-slate-700 rounded-md text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Budget</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold border-b border-[#E5EEF5]">
                  <th className="py-2.5 px-4">Account</th>
                  <th className="py-2.5 px-3">Statutory Fund</th>
                  <th className="py-2.5 px-3 text-left">Approved Annual Budget</th>
                  <th className="py-2.5 px-3 text-left">Actual YTD Spend</th>
                  <th className="py-2.5 px-3 text-left">Remaining Variance</th>
                  <th className="py-2.5 px-4 text-left">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {mockBudgetLines.map((line) => {
                  const remainingCents = line.budgetAmountCents - line.actualAmountCents;
                  const pct = Math.round((line.actualAmountCents / line.budgetAmountCents) * 100);

                  return (
                    <tr key={line.id} className="hover:bg-[#F8FAFD] transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#00B5A4] mr-2">
                          {line.glAccountCode}
                        </span>
                        <strong className="text-slate-900">{line.glAccountName}</strong>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold capitalize ${
                            line.fundType === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {line.fundType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-left font-mono font-bold text-slate-900">
                        <MoneyText cents={line.budgetAmountCents} />
                      </td>
                      <td className="py-3 px-3 text-left font-mono font-semibold text-[#102747] font-bold">
                        <MoneyText cents={line.actualAmountCents} />
                      </td>
                      <td className="py-3 px-3 text-left font-mono font-bold text-emerald-700">
                        <MoneyText cents={remainingCents} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct > 85 ? 'bg-amber-500' : 'bg-[#00B5A4]'
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-700">
                            {pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Statutory Financial Reports */}
      {activeSubTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Trial Balance Tile */}
          <div className="bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA]">
              <h3 className="font-black text-sm text-[#102747]">Trial Balance</h3>
              <FileSpreadsheet className="w-4 h-4 text-[#00B5A4]" />
            </div>
            <p className="text-xs text-[#71849A]">
              Complete summary of all debits and credits across the chart of accounts. Enforces equality of debits and credits.
            </p>
            <div className="pt-2">
              <button
                onClick={() => alert('Generating Trial Balance Report...')}
                className="w-full py-2 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition flex items-center justify-start gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Run Trial Balance</span>
              </button>
            </div>
          </div>

          {/* Income & Expenditure Statement */}
          <div className="bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA]">
              <h3 className="font-black text-sm text-[#102747]">Income & Expenditure</h3>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-[#71849A]">
              Statement showing levy income, interest/penalties, and expenses segregated between Admin and Capital Works funds.
            </p>
            <div className="pt-2">
              <button
                onClick={() => alert('Generating Income & Expenditure Statement...')}
                className="w-full py-2 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition flex items-center justify-start gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate Statement</span>
              </button>
            </div>
          </div>

          {/* Balance Sheet / Statement of Position */}
          <div className="bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA]">
              <h3 className="font-black text-sm text-[#102747]">Balance Sheet</h3>
              <PieChart className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-[#71849A]">
              Trust assets (operating bank, term deposits, levies receivable) matched against liabilities and Owners Equity funds.
            </p>
            <div className="pt-2">
              <button
                onClick={() => alert('Generating Balance Sheet...')}
                className="w-full py-2 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition flex items-center justify-start gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate Balance Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Journal Entry Modal */}
      {showNewJournalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#08294A] text-white">
              <h3 className="font-bold text-sm">Post Double-Entry Journal Entry</h3>
              <button onClick={() => setShowNewJournalModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostJournal} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Journal Memo / Reference Description</label>
                <input
                  type="text"
                  required
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="e.g. Bank interest adjustment for Nov 2026"
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Transaction Source</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                >
                  <option value="manual">Manual Adjustment</option>
                  <option value="invoice">Supplier Invoice</option>
                  <option value="levy">Levy Adjustment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Debit Account (DR)</label>
                  <select
                    value={debitAccount}
                    onChange={(e) => setDebitAccount(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                  >
                    {mockGLAccounts.map((a) => (
                      <option key={a.id} value={a.code}>
                        {a.code} - {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Credit Account (CR)</label>
                  <select
                    value={creditAccount}
                    onChange={(e) => setCreditAccount(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                  >
                    {mockGLAccounts.map((a) => (
                      <option key={a.id} value={a.code}>
                        {a.code} - {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Total Amount ($ AUD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amountDollars}
                  onChange={(e) => setAmountDollars(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-md text-[11px] flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Double-entry balanced: Debit ${amountDollars} = Credit ${amountDollars}</span>
              </div>

              <div className="flex items-center justify-start gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewJournalModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-md font-bold shadow-xs"
                >
                  Post Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
