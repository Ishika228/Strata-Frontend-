import React, { useState } from 'react';
import {
  CreditCard,
  Building,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Upload,
  RefreshCw,
  Plus,
  ArrowRight,
  Lock,
  X,
  Search,
} from 'lucide-react';
import {
  mockBankTransactions,
  mockBankReconciliation,
  mockSchemes,
  mockLots,
} from '../../lib/strataMockData';
import { BankTransaction, BankReconciliation as BankRecType } from '../../types/strata';
import { MoneyText } from '../../components/ui/MoneyText';

export const BankingReconciliation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reconciliation' | 'receipts'>('reconciliation');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('scheme-01');
  const [transactions, setTransactions] = useState<BankTransaction[]>(mockBankTransactions);
  const [reconciliation, setReconciliation] = useState<BankRecType>(mockBankReconciliation);
  const [showQuickReceiptModal, setShowQuickReceiptModal] = useState(false);

  // Quick Receipt Form State
  const [receiptLotNumber, setReceiptLotNumber] = useState(1);
  const [receiptAmount, setReceiptAmount] = useState('2475.00');
  const [receiptPaymentMethod, setReceiptPaymentMethod] = useState<'bpay' | 'eft' | 'credit_card'>('bpay');
  const [receiptRef, setReceiptRef] = useState('EFT-99120');

  const selectedScheme = mockSchemes.find((s) => s.id === selectedSchemeId) || mockSchemes[0];
  const bankAccount = selectedScheme.bankAccounts[0];

  // Auto-Match Engine (WF-07)
  const handleRunAutoMatch = () => {
    const updated = transactions.map((t) => {
      if (t.status === 'unmatched' || t.status === 'suggested') {
        return {
          ...t,
          status: 'matched' as const,
          matchedEntity: {
            type: 'charge' as const,
            reference: 'Matched via CRN + exact amount rule',
          },
        };
      }
      return t;
    });
    setTransactions(updated);
    setReconciliation({
      ...reconciliation,
      discrepancyCents: 0,
      status: 'balanced',
    });
  };

  const handlePostReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const cents = Math.round(parseFloat(receiptAmount) * 100);
    const newTxn: BankTransaction = {
      id: `bt-${Date.now()}`,
      bankAccountId: bankAccount.id,
      date: new Date().toISOString().split('T')[0],
      description: `DIRECT DEPOSIT LOT ${receiptLotNumber} ${receiptRef}`,
      amountCents: cents,
      reference: receiptRef,
      status: 'matched',
      matchedEntity: {
        type: 'receipt',
        reference: `Allocated to Lot #${receiptLotNumber} oldest invoice`,
      },
    };

    setTransactions([newTxn, ...transactions]);
    setShowQuickReceiptModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
        <div>
          <h1 className="text-lg font-black text-[#102747] tracking-tight">
            Trust Banking & Automated Reconciliation (F-ST-04, F-ST-05, F-IN-01)
          </h1>
          <p className="text-xs text-[#71849A] font-medium">
            Electronic banking integration (Macquarie & NAB), automated statement matching, quick receipt entry, and month-end lock.
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
            onClick={() => setShowQuickReceiptModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Receipt</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EEF5] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'reconciliation'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Monthly Bank Reconciliation & Statement Lock</span>
        </button>

        <button
          onClick={() => setActiveTab('receipts')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'receipts'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Receipting & Payment Allocations</span>
        </button>
      </div>

      {/* Tab 1: Bank Reconciliation */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-4">
          {/* Reconciliation Balance Lock Bar */}
          <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#102747]">{bankAccount.bankName}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {bankAccount.accountName} (BSB: {bankAccount.bsb} • ACC: {bankAccount.accountNumberMasked})
                  </p>
                </div>
              </div>

              {/* 4 Balances Invariant */}
              <div className="flex items-center gap-4 bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Statement Closing</span>
                  <strong className="font-mono text-slate-900 font-extrabold text-sm">
                    <MoneyText cents={reconciliation.statementClosingBalanceCents} />
                  </strong>
                </div>
                <div className="text-slate-300 font-bold">−</div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ledger Cash</span>
                  <strong className="font-mono text-slate-900 font-extrabold text-sm">
                    <MoneyText cents={reconciliation.ledgerCashBalanceCents} />
                  </strong>
                </div>
                <div className="text-slate-300 font-bold">=</div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Difference</span>
                  <strong
                    className={`font-mono font-extrabold text-sm ${
                      reconciliation.discrepancyCents === 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    <MoneyText cents={reconciliation.discrepancyCents} />
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAutoMatch}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#08294A] hover:bg-[#102747] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Run Auto-Match</span>
                </button>
                <button
                  disabled={reconciliation.discrepancyCents !== 0}
                  onClick={() => alert('Period successfully locked! Postings to closed period are now restricted (BR-ST-12).')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Period</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statement Lines Table */}
          <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#F0F5FA] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#102747]">Bank Statement Feed (Macquarie BSB 182-222)</h3>
                <p className="text-[11px] text-[#71849A]">
                  Matching algorithm order: Provider Txn ID &rarr; CRN + Exact Amount &rarr; Amount + Date Window.
                </p>
              </div>
              <button
                onClick={() => alert('Upload bank statement file (CBA/Macquarie/NAB format)...')}
                className="flex items-center gap-1 px-3 py-1 bg-[#F4F8FC] border border-[#D5E5F2] hover:bg-slate-100 text-slate-700 rounded-md text-xs font-bold"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Statement File</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#71849A] font-bold border-b border-[#E5EEF5]">
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-3">Bank Transaction Description</th>
                    <th className="py-2.5 px-3 font-mono">Reference</th>
                    <th className="py-2.5 px-3 text-left">Amount</th>
                    <th className="py-2.5 px-3 text-left">Match Status</th>
                    <th className="py-2.5 px-4">Matched Entity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F5FA]">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F8FAFD] transition">
                      <td className="py-3 px-4 font-mono text-[#102747] font-bold">{t.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{t.description}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{t.reference}</td>
                      <td
                        className={`py-3 px-3 text-left font-mono font-bold ${
                          t.amountCents > 0 ? 'text-emerald-700' : 'text-slate-800'
                        }`}
                      >
                        <MoneyText cents={t.amountCents} />
                      </td>
                      <td className="py-3 px-3 text-left">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            t.status === 'matched'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'suggested'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#102747] font-bold">
                        {t.matchedEntity ? (
                          <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t.matchedEntity.reference}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unmatched</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Receipts & Allocations */}
      {activeTab === 'receipts' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
          <div className="border-b border-[#F0F5FA] pb-2">
            <h3 className="text-sm font-black text-[#102747]">Payment Receipts & Allocation Rules</h3>
            <p className="text-[11px] text-[#71849A]">
              Under BR-ST-08, receipts automatically clear oldest overdue charges, interest penalties, and sundry fees. Any excess balance is credited to Account 2100 (Levies in Advance).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5]">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Priority 1</span>
              <div className="font-bold text-xs text-slate-800 mt-1">Oldest Overdue Principal</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Applies first to unpaid Admin & Capital levies</p>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5]">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Priority 2</span>
              <div className="font-bold text-xs text-slate-800 mt-1">Accrued Interest Penalties</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Clears 10% statutory late interest</p>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EEF5]">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Priority 3</span>
              <div className="font-bold text-xs text-slate-800 mt-1">Advance Credit Balance</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Credited towards subsequent quarterly runs</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Transaction Entry Modal */}
      {showQuickReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#08294A] text-white">
              <h3 className="font-bold text-sm">Quick Transaction Entry (Receipt Entry)</h3>
              <button
                onClick={() => setShowQuickReceiptModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostReceipt} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Lot & Owner</label>
                <select
                  value={receiptLotNumber}
                  onChange={(e) => setReceiptLotNumber(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                >
                  {mockLots.map((l) => (
                    <option key={l.id} value={l.lotNumber}>
                      Lot {l.lotNumber} ({l.unitLabel}) • {l.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                <select
                  value={receiptPaymentMethod}
                  onChange={(e) => setReceiptPaymentMethod(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                >
                  <option value="bpay">BPAY Electronic Deposit</option>
                  <option value="eft">EFT Direct Credit</option>
                  <option value="credit_card">Pay-Now Online Gateway</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Transaction Reference / CRN</label>
                <input
                  type="text"
                  required
                  value={receiptRef}
                  onChange={(e) => setReceiptRef(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount Received ($ AUD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={receiptAmount}
                  onChange={(e) => setReceiptAmount(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#00B5A4]"
                />
              </div>

              <div className="flex items-center justify-start gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuickReceiptModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-md font-bold shadow-xs"
                >
                  Post Receipt & Allocate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
