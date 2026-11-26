import React, { useState } from 'react';
import {
  FileCheck,
  Receipt,
  FileText,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Upload,
  Send,
  Download,
  Plus,
  Eye,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import {
  mockSupplierInvoices,
  mockStrataWorkOrders,
  mockQuoteRequests,
  mockPaymentBatches,
  mockSchemes,
} from '../../lib/strataMockData';
import { SupplierInvoice, StrataWorkOrder, QuoteRequest, PaymentBatch } from '../../types/strata';
import { MoneyText } from '../../components/ui/MoneyText';

interface ProcurementPayablesProps {
  initialTab?: 'invoices' | 'batches' | 'work_orders' | 'quotes';
}

export const ProcurementPayables: React.FC<ProcurementPayablesProps> = ({ initialTab = 'invoices' }) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'batches' | 'work_orders' | 'quotes'>(initialTab);
  const [invoices, setInvoices] = useState<SupplierInvoice[]>(mockSupplierInvoices);
  const [workOrders, setWorkOrders] = useState<StrataWorkOrder[]>(mockStrataWorkOrders);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(mockQuoteRequests);
  const [paymentBatches, setPaymentBatches] = useState<PaymentBatch[]>(mockPaymentBatches);
  const [activeInvoiceModal, setActiveInvoiceModal] = useState<SupplierInvoice | null>(null);

  // Approve invoice
  const handleApproveInvoice = (invoiceId: string) => {
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'approved',
            approverNotes: 'Approved by Committee Member (electronic signature recorded)',
          };
        }
        return inv;
      })
    );
    if (activeInvoiceModal && activeInvoiceModal.id === invoiceId) {
      setActiveInvoiceModal(null);
    }
    alert('Invoice approved! Scheduled for next electronic payment batch.');
  };

  const handleProcessBatch = (batchId: string) => {
    setPaymentBatches(
      paymentBatches.map((b) => {
        if (b.id === batchId) {
          return {
            ...b,
            status: 'processed',
            processedDate: new Date().toISOString().split('T')[0],
          };
        }
        return b;
      })
    );
    alert('Payment batch submitted to Macquarie Bank electronic banking! Remittance advices dispatched to suppliers.');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5EEF5] shadow-2xs">
        <div>
          <h1 className="text-lg font-black text-[#102747] tracking-tight">
            Procurement, Supplier Invoices & Payables (F-ST-08, F-ST-09)
          </h1>
          <p className="text-xs text-[#71849A] font-medium">
            Supplier invoice workflow, 3-tier approvals showing budget remaining, quote comparisons, and electronic bank payment batches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Opening invoice upload & AI extraction wizard...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Invoice</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EEF5] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'invoices'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Supplier Invoices ({invoices.filter((i) => i.status === 'pending_approval').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('batches')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'batches'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Electronic Payment Batches</span>
        </button>

        <button
          onClick={() => setActiveTab('work_orders')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'work_orders'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Strata Work Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeTab === 'quotes'
              ? 'bg-[#00B5A4] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Quote Requests (≥2 Quotes Rule)</span>
        </button>
      </div>

      {/* Tab 1: Supplier Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#F0F5FA] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">Supplier Invoices Awaiting Approval</h2>
              <p className="text-[11px] text-[#71849A]">
                Rule BR-ST-14 routing: staff threshold auto-approval vs strata manager vs committee approval displaying statutory budget remaining (BR-ST-15).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold border-b border-[#E5EEF5]">
                  <th className="py-2.5 px-4">Invoice</th>
                  <th className="py-2.5 px-3">Scheme</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3 text-left">Amount</th>
                  <th className="py-2.5 px-3 text-left">Budget Remaining</th>
                  <th className="py-2.5 px-3 text-left">Approval Tier</th>
                  <th className="py-2.5 px-3 text-left">Status</th>
                  <th className="py-2.5 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8FAFD] transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#102747]">{inv.supplierName}</div>
                      <span className="font-mono text-[10px] text-slate-400 block">{inv.invoiceNumber}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{inv.schemeCode}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-600 mr-1">{inv.glAccountCode}</span>
                      <span className="text-slate-800 font-medium">{inv.glAccountName}</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#102747] font-bold">{inv.dueDate}</td>
                    <td className="py-3 px-3 text-left font-mono font-bold text-slate-900">
                      <MoneyText cents={inv.totalAmountCents} />
                    </td>
                    <td className="py-3 px-3 text-left font-mono font-bold text-emerald-700 bg-emerald-50/50">
                      <MoneyText cents={inv.budgetRemainingCents} />
                    </td>
                    <td className="py-3 px-3 text-left">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold capitalize ${
                          inv.approvalTier === 'committee'
                            ? 'bg-purple-100 text-purple-800'
                            : inv.approvalTier === 'manager'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {inv.approvalTier}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-left">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          inv.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left space-x-1.5">
                      <button
                        onClick={() => setActiveInvoiceModal(inv)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded text-[11px] font-bold border border-slate-300 transition"
                      >
                        Review
                      </button>

                      {inv.status === 'pending_approval' && (
                        <button
                          onClick={() => handleApproveInvoice(inv.id)}
                          className="px-2.5 py-1 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded text-[11px] font-bold transition shadow-2xs"
                        >
                          Approve
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

      {/* Tab 2: Payment Batches */}
      {activeTab === 'batches' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
          <div className="border-b border-[#F0F5FA] pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">Electronic Bank Payment Batches (ABA)</h2>
              <p className="text-[11px] text-[#71849A]">
                Consolidates multiple approved invoices per scheme bank account into an Australian ABA payment file.
              </p>
            </div>
            <button
              onClick={() => alert('New batch created from all approved invoices.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Payment Batch</span>
            </button>
          </div>

          <div className="space-y-3">
            {paymentBatches.map((b) => (
              <div key={b.id} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5EEF5] flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#102747]">{b.batchNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        b.status === 'processed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    Created: {b.createdDate} • Invoices: <strong>{b.invoiceCount}</strong> • Bank: Macquarie Trust A/C
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Batch Amount</span>
                    <strong className="font-mono text-base text-slate-900 font-black">
                      <MoneyText cents={b.totalAmountCents} />
                    </strong>
                  </div>

                  {b.status === 'ready' ? (
                    <button
                      onClick={() => handleProcessBatch(b.id)}
                      className="px-3.5 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg font-bold text-xs transition shadow-2xs"
                    >
                      Submit to Bank (ABA)
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Remitted</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Strata Work Orders */}
      {activeTab === 'work_orders' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-3">
          <div className="border-b border-[#F0F5FA] pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">Strata Purchase & Work Orders</h2>
              <p className="text-[11px] text-[#71849A]">
                Lightweight strata work orders acting as verified purchase order authorizations for supplier billings.
              </p>
            </div>
            <button
              onClick={() => alert('Create Strata Work Order modal')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Work Order</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E5EEF5] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#00B5A4]">{wo.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 uppercase">
                    {wo.status}
                  </span>
                </div>

                <div className="font-extrabold text-sm text-[#102747]">{wo.title}</div>
                <p className="text-slate-500 text-[11px] line-clamp-2">{wo.scope}</p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Supplier</span>
                    <strong className="text-slate-800">{wo.supplierName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Approved Amount</span>
                    <strong className="font-mono text-slate-900 font-bold">
                      <MoneyText cents={wo.approvedAmountCents} />
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Quote Requests */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-xl border border-[#E5EEF5] shadow-2xs p-4 space-y-4">
          <div className="border-b border-[#F0F5FA] pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102747]">Quote Requests & Comparisons (BR-ST-17)</h2>
              <p className="text-[11px] text-[#71849A]">
                Rule BR-ST-17 enforces minimum 2 compliant contractor quotes for expenditure exceeding the statutory threshold.
              </p>
            </div>
            <button
              onClick={() => alert('New Quote Request Modal')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Request Quotes</span>
            </button>
          </div>

          {quoteRequests.map((qr) => (
            <div key={qr.id} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5EEF5] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#102747]">{qr.title}</h3>
                  <p className="text-xs text-slate-500">{qr.scope}</p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase bg-purple-100 text-purple-800">
                  {qr.status.replace('_', ' ')}
                </span>
              </div>

              {/* Quotes comparison table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Tendering Supplier</th>
                      <th className="p-2.5">Compliance Status</th>
                      <th className="p-2.5">Validity</th>
                      <th className="p-2.5">Notes</th>
                      <th className="p-2.5 text-left">Total</th>
                      <th className="p-2.5 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {qr.quotesReceived.map((q) => (
                      <tr key={q.id}>
                        <td className="p-2.5 font-bold text-slate-900">{q.supplierName}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Verified Insured
                          </span>
                        </td>
                        <td className="p-2.5 text-[#102747] font-bold">{q.validUntil}</td>
                        <td className="p-2.5 text-slate-500 text-[11px]">{q.notes}</td>
                        <td className="p-2.5 text-left font-mono font-bold text-slate-900 text-sm">
                          <MoneyText cents={q.totalAmountCents} />
                        </td>
                        <td className="p-2.5 text-left">
                          <button
                            onClick={() => alert(`Awarded contract to ${q.supplierName}! Work order generated.`)}
                            className="px-2.5 py-1 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded text-[11px] font-bold"
                          >
                            Accept Tender
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Review Modal (With Budget Remaining Display) */}
      {activeInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 bg-[#08294A] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-teal-300 font-bold uppercase">Committee Approval Review</span>
                <h3 className="font-extrabold text-sm">{activeInvoiceModal.supplierName}</h3>
              </div>
              <button
                onClick={() => setActiveInvoiceModal(null)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Invoice Number</span>
                  <strong className="font-mono text-slate-900">{activeInvoiceModal.invoiceNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Due Date</span>
                  <strong className="text-slate-900">{activeInvoiceModal.dueDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">General Ledger Account</span>
                  <strong className="text-slate-900">{activeInvoiceModal.glAccountCode} - {activeInvoiceModal.glAccountName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Fund Type</span>
                  <strong className="capitalize text-slate-900">{activeInvoiceModal.fundType.replace('_', ' ')}</strong>
                </div>
              </div>

              {/* CRITICAL STATUTORY REQUIREMENT (BR-ST-15): Budget Remaining */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-900">
                    Statutory Budget Verification (BR-ST-15)
                  </div>
                  <div className="text-[10px] text-emerald-700">
                    Sufficient funds available in approved FY budget.
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 block">Remaining in Account</span>
                  <strong className="font-mono font-black text-emerald-800 text-sm">
                    <MoneyText cents={activeInvoiceModal.budgetRemainingCents} />
                  </strong>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between text-sm">
                <span className="font-bold text-slate-700">Invoice Total (GST Inc):</span>
                <span className="font-mono font-black text-lg text-slate-900">
                  <MoneyText cents={activeInvoiceModal.totalAmountCents} />
                </span>
              </div>

              <div className="flex items-center justify-start gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveInvoiceModal(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveInvoice(activeInvoiceModal.id)}
                  className="px-4 py-1.5 bg-[#00B5A4] hover:bg-[#009e8f] text-white rounded-md font-bold shadow-xs"
                >
                  Approve Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
