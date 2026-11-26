import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Download,
  Lock,
  Check,
  X,
  CheckCircle2,
  ArrowRightLeft,
  Edit3,
  Printer,
  Send,
  Percent,
  Gavel,
  Mail,
  FileText,
  CreditCard,
  XCircle,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { ColumnsSlidersIcon } from '../../components/ui/ColumnsSlidersIcon';
import { cn } from '../../lib/utils';
import {
  mockBudgetLines,
  mockLevyCharges,
  mockBankTransactions,
  mockBankReconciliation,
  mockArrearsCases,
  mockSupplierInvoices,
  mockJournalEntries,
} from '../../lib/strataMockData';

// Column definitions per tab for column visibility picker
const TAB_COLUMNS: Record<string, Array<{ key: string; label: string }>> = {
  budgets: [
    { key: 'code', label: 'Account Code' },
    { key: 'name', label: 'Expense Category' },
    { key: 'fund', label: 'Fund Type' },
    { key: 'budget', label: 'Budget Allocation' },
    { key: 'actual', label: 'Actual Spent' },
    { key: 'variance', label: 'Budget Remaining' },
    { key: 'status', label: 'Status' },
  ],
  levies: [
    { key: 'chargeId', label: 'Charge ID' },
    { key: 'lotOwner', label: 'Lot & Owner' },
    { key: 'fund', label: 'Fund' },
    { key: 'crn', label: 'CRN (Luhn)' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'amount', label: 'Amount Due' },
    { key: 'status', label: 'Status' },
  ],
  'bank-rec': [
    { key: 'recId', label: 'Reconciliation ID' },
    { key: 'account', label: 'Account Name' },
    { key: 'period', label: 'Period' },
    { key: 'statement', label: 'Statement Bal' },
    { key: 'ledger', label: 'Ledger Bal' },
    { key: 'difference', label: 'Difference' },
    { key: 'status', label: 'Status' },
  ],
  arrears: [
    { key: 'caseId', label: 'Case ID' },
    { key: 'lotOwner', label: 'Lot & Owner' },
    { key: 'level', label: 'Escalation Level' },
    { key: 'overdue', label: 'Days Overdue' },
    { key: 'total', label: 'Total Overdue' },
    { key: 'oldest', label: 'Oldest Due Date' },
    { key: 'status', label: 'LevyCollect Status' },
  ],
  invoices: [
    { key: 'invoiceNo', label: 'Invoice No' },
    { key: 'supplier', label: 'Supplier / Creditor' },
    { key: 'category', label: 'Category (GL)' },
    { key: 'remaining', label: 'Budget Remaining' },
    { key: 'total', label: 'Total (Inc GST)' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'status', label: 'Approval Status' },
  ],
  gl: [
    { key: 'journalId', label: 'Journal ID' },
    { key: 'date', label: 'Date' },
    { key: 'memo', label: 'Memo' },
    { key: 'reference', label: 'Reference' },
    { key: 'amount', label: 'Total Amount' },
    { key: 'status', label: 'Status' },
  ],
  receipts: [
    { key: 'ref', label: 'Receipt Ref' },
    { key: 'payer', label: 'Payer / Lot' },
    { key: 'method', label: 'Payment Method' },
    { key: 'crn', label: 'CRN Reference' },
    { key: 'date', label: 'Date Processed' },
    { key: 'amount', label: 'Amount Received' },
    { key: 'status', label: 'Status' },
  ],
};

interface FinancialManagementProps {
  initialTab?:
  | 'budgets'
  | 'levies'
  | 'receipts'
  | 'bank-rec'
  | 'arrears'
  | 'invoices'
  | 'gl';
}

export const FinancialManagement: React.FC<FinancialManagementProps> = ({
  initialTab = 'budgets',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for instant interactive actions
  type ModalType =
    | 'new_budget'
    | 'run_levy'
    | 'record_receipt'
    | 'import_statement'
    | 'refer_levycollect'
    | 'create_invoice'
    | 'post_journal'
    | null;

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Local stateful records for instant reactive execution and additions
  const [budgetsList, setBudgetsList] = useState(mockBudgetLines);
  const [leviesList, setLeviesList] = useState(mockLevyCharges);
  const [bankRecList, setBankRecList] = useState([
    {
      id: 'REC-OCT-26',
      account: 'Macquarie Trust Account (182-222)',
      period: 'October 2026',
      statementClosingBalanceCents: 56050000,
      ledgerCashBalanceCents: 56050000,
      discrepancyCents: 0,
      status: 'Locked',
      filterCategory: 'active',
    },
    {
      id: 'REC-NOV-26',
      account: 'NAB Strata Operating Account (084-004)',
      period: 'November 2026 (Live)',
      statementClosingBalanceCents: 42360000,
      ledgerCashBalanceCents: 42360000,
      discrepancyCents: 0,
      status: 'Balanced (Pending Lock)',
      filterCategory: 'pending',
    },
    {
      id: 'REC-SEP-26',
      account: 'Macquarie Capital Works TD (182-223)',
      period: 'September 2026',
      statementClosingBalanceCents: 125000000,
      ledgerCashBalanceCents: 124995000,
      discrepancyCents: 5000,
      status: 'Discrepancy ($50.00)',
      filterCategory: 'flagged',
    },
  ]);
  const [arrearsList, setArrearsList] = useState(mockArrearsCases);
  const [invoicesList, setInvoicesList] = useState(mockSupplierInvoices);
  const [glList, setGlList] = useState(mockJournalEntries);
  const [receiptsList, setReceiptsList] = useState([
    { ref: 'REC-9941', payer: 'David & Lisa Wong (Lot 101)', method: 'BPAY / DEFT', crn: '528911019', date: '24 Nov 2026', amount: 145000, status: 'Allocated', filterCategory: 'active' },
    { ref: 'REC-9942', payer: 'Elena Rostova (Lot 102)', method: 'Direct Debit', crn: '528911027', date: '23 Nov 2026', amount: 165000, status: 'Allocated', filterCategory: 'active' },
    { ref: 'REC-9943', payer: 'Marcus Vance (Lot 204)', method: 'Credit Card', crn: '528912041', date: '22 Nov 2026', amount: 50000, status: 'Part Payment', filterCategory: 'pending' },
    { ref: 'REC-9944', payer: 'Apex Commercial (Lot 4)', method: 'EFT Transfer', crn: '528910048', date: '21 Nov 2026', amount: 785000, status: 'Suspense Clearing', filterCategory: 'flagged' },
  ]);
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
    showToast(`Successfully processed "${actionName}" for ${selectedRowIds.length} selected record(s).`);
  };

  useEffect(() => {
    setActiveTab(initialTab);
    setFilter('all');
    setSearchQuery('');
    setShowColumnPicker(false);
    setSelectedRowIds([]);
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
    if (current.includes(colKey) && current.length <= 1) {
      return; // Keep at least one column visible
    }
    const next = current.includes(colKey)
      ? current.filter((k) => k !== colKey)
      : [...current, colKey];
    setVisibleColumns((prev) => ({ ...prev, [activeTab]: next }));
  };

  const resetColumns = () => {
    const allKeys = (TAB_COLUMNS[activeTab] || []).map((c) => c.key);
    setVisibleColumns((prev) => ({ ...prev, [activeTab]: allKeys }));
  };

  // 1. Budgets Filtered
  const filteredBudgets = useMemo(() => {
    return budgetsList.filter((b) => {
      const spentRatio = b.actualAmountCents / b.budgetAmountCents;
      if (filter === 'active' && spentRatio > 0.55) return false;
      if (filter === 'pending' && b.fundType !== 'capital_works') return false;
      if (filter === 'flagged' && spentRatio <= 0.6) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const codeWithGl = `gl-${b.glAccountCode}`.toLowerCase();
        const budgetFormatted = `$${(b.budgetAmountCents / 100).toLocaleString()}`.toLowerCase();
        const actualFormatted = `$${(b.actualAmountCents / 100).toLocaleString()}`.toLowerCase();
        const remainingFormatted = `$${((b.budgetAmountCents - b.actualAmountCents) / 100).toLocaleString()}`.toLowerCase();
        return (
          b.glAccountCode.toLowerCase().includes(q) ||
          codeWithGl.includes(q) ||
          b.glAccountName.toLowerCase().includes(q) ||
          b.fundType.toLowerCase().includes(q) ||
          b.fundType.replace('_', ' ').toLowerCase().includes(q) ||
          budgetFormatted.includes(q) ||
          actualFormatted.includes(q) ||
          remainingFormatted.includes(q) ||
          'active fy26'.includes(q)
        );
      }
      return true;
    });
  }, [budgetsList, filter, searchQuery]);

  // 2. Levies Filtered
  const filteredLevies = useMemo(() => {
    return leviesList.filter((charge) => {
      if (filter === 'active' && charge.status !== 'paid' && charge.status !== 'issued') return false;
      if (filter === 'pending' && charge.status !== 'issued') return false;
      if (filter === 'flagged' && charge.status !== 'overdue') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const lotStr = `lot ${charge.lotNumber}`.toLowerCase();
        const amountStr = `$${(charge.amountCents / 100).toFixed(2)}`;
        const amountFormatted = `$${(charge.amountCents / 100).toLocaleString()}`.toLowerCase();
        return (
          charge.id.toLowerCase().includes(q) ||
          charge.ownerName.toLowerCase().includes(q) ||
          String(charge.lotNumber).includes(q) ||
          lotStr.includes(q) ||
          (charge.unitLabel && charge.unitLabel.toLowerCase().includes(q)) ||
          charge.crn.toLowerCase().includes(q) ||
          charge.fundType.toLowerCase().includes(q) ||
          charge.fundType.replace('_', ' ').toLowerCase().includes(q) ||
          charge.status.toLowerCase().includes(q) ||
          charge.status.replace('_', ' ').toLowerCase().includes(q) ||
          charge.dueDate.toLowerCase().includes(q) ||
          amountStr.includes(q) ||
          amountFormatted.includes(q)
        );
      }
      return true;
    });
  }, [leviesList, filter, searchQuery]);

  // 3. Bank Rec records & Filtered
  const filteredBankRec = useMemo(() => {
    return bankRecList.filter((rec) => {
      if (filter === 'active' && rec.filterCategory !== 'active') return false;
      if (filter === 'pending' && rec.filterCategory !== 'pending') return false;
      if (filter === 'flagged' && rec.filterCategory !== 'flagged') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          rec.id.toLowerCase().includes(q) ||
          rec.account.toLowerCase().includes(q) ||
          rec.period.toLowerCase().includes(q) ||
          rec.status.toLowerCase().includes(q) ||
          `$${(rec.statementClosingBalanceCents / 100).toLocaleString()}`.toLowerCase().includes(q) ||
          `$${(rec.ledgerCashBalanceCents / 100).toLocaleString()}`.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bankRecList, filter, searchQuery]);

  // 4. Arrears Filtered
  const filteredArrears = useMemo(() => {
    return arrearsList.filter((c) => {
      if (filter === 'active' && c.level > 1) return false;
      if (filter === 'pending' && c.level !== 2) return false;
      if (filter === 'flagged' && c.level < 3) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const lotStr = `lot ${c.lotNumber}`.toLowerCase();
        const levelStr = `l${c.level}`.toLowerCase();
        const daysStr = `${c.daysOverdue} days`.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.ownerName.toLowerCase().includes(q) ||
          String(c.lotNumber).includes(q) ||
          lotStr.includes(q) ||
          c.unitLabel.toLowerCase().includes(q) ||
          levelStr.includes(q) ||
          daysStr.includes(q) ||
          c.oldestDueDate.toLowerCase().includes(q) ||
          (c.lastActionType && c.lastActionType.toLowerCase().includes(q)) ||
          `$${(c.totalOverdueCents / 100).toLocaleString()}`.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [arrearsList, filter, searchQuery]);

  // 5. Invoices Filtered
  const filteredInvoices = useMemo(() => {
    return invoicesList.filter((inv) => {
      if (filter === 'active' && inv.status !== 'approved' && inv.status !== 'paid') return false;
      if (filter === 'pending' && inv.status !== 'pending_approval') return false;
      if (filter === 'flagged' && inv.approvalTier !== 'committee') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.supplierName.toLowerCase().includes(q) ||
          inv.glAccountName.toLowerCase().includes(q) ||
          inv.glAccountCode.toLowerCase().includes(q) ||
          inv.status.toLowerCase().includes(q) ||
          inv.status.replace('_', ' ').toLowerCase().includes(q) ||
          inv.dueDate.toLowerCase().includes(q) ||
          inv.approvalTier.toLowerCase().includes(q) ||
          `$${(inv.totalAmountCents / 100).toLocaleString()}`.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [invoicesList, filter, searchQuery]);

  // 6. GL Filtered
  const filteredGL = useMemo(() => {
    return glList.filter((j) => {
      if (filter === 'active' && j.sourceType !== 'receipt') return false;
      if (filter === 'pending' && j.sourceType !== 'levy') return false;
      if (filter === 'flagged' && j.sourceType !== 'invoice') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          j.id.toLowerCase().includes(q) ||
          j.memo.toLowerCase().includes(q) ||
          j.reference.toLowerCase().includes(q) ||
          j.date.toLowerCase().includes(q) ||
          j.sourceType.toLowerCase().includes(q) ||
          `$${(j.totalAmountCents / 100).toLocaleString()}`.toLowerCase().includes(q) ||
          'balanced'.includes(q)
        );
      }
      return true;
    });
  }, [glList, filter, searchQuery]);

  // 7. Receipts Filtered
  const filteredReceipts = useMemo(() => {
    return receiptsList.filter((r) => {
      if (filter === 'active' && r.filterCategory !== 'active') return false;
      if (filter === 'pending' && r.filterCategory !== 'pending') return false;
      if (filter === 'flagged' && r.filterCategory !== 'flagged') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          r.ref.toLowerCase().includes(q) ||
          r.payer.toLowerCase().includes(q) ||
          r.method.toLowerCase().includes(q) ||
          r.crn.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.date.toLowerCase().includes(q) ||
          `$${(r.amount / 100).toFixed(2)}`.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [receiptsList, filter, searchQuery]);

  // Current Records Count
  const currentCount = useMemo(() => {
    if (activeTab === 'budgets') return filteredBudgets.length;
    if (activeTab === 'levies') return filteredLevies.length;
    if (activeTab === 'bank-rec') return filteredBankRec.length;
    if (activeTab === 'arrears') return filteredArrears.length;
    if (activeTab === 'invoices') return filteredInvoices.length;
    if (activeTab === 'gl') return filteredGL.length;
    if (activeTab === 'receipts') return filteredReceipts.length;
    return 0;
  }, [activeTab, filteredBudgets, filteredLevies, filteredBankRec, filteredArrears, filteredInvoices, filteredGL, filteredReceipts]);

  // Current Filtered IDs for selection
  const currentFilteredIds = useMemo(() => {
    if (activeTab === 'budgets') return filteredBudgets.map((b) => b.id);
    if (activeTab === 'levies') return filteredLevies.map((c) => c.id);
    if (activeTab === 'bank-rec') return filteredBankRec.map((rec) => rec.id);
    if (activeTab === 'arrears') return filteredArrears.map((c) => c.id);
    if (activeTab === 'invoices') return filteredInvoices.map((inv) => inv.id);
    if (activeTab === 'gl') return filteredGL.map((j) => j.id);
    if (activeTab === 'receipts') return filteredReceipts.map((r) => r.ref);
    return [];
  }, [activeTab, filteredBudgets, filteredLevies, filteredBankRec, filteredArrears, filteredInvoices, filteredGL, filteredReceipts]);

  const isAllSelected = currentFilteredIds.length > 0 && currentFilteredIds.every((id) => selectedRowIds.includes(id));
  const isSomeSelected = currentFilteredIds.some((id) => selectedRowIds.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds((prev) => prev.filter((id) => !currentFilteredIds.includes(id)));
    } else {
      setSelectedRowIds((prev) => Array.from(new Set([...prev, ...currentFilteredIds])));
    }
  };

  const toggleSelectRow = (id: string, e?: React.MouseEvent | React.ChangeEvent) => {
    e?.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const cols = (TAB_COLUMNS[activeTab] || []).filter((c) => isColVisible(c.key));
    let rows: Record<string, any>[] = [];

    if (activeTab === 'budgets') {
      rows = filteredBudgets.map((b) => ({
        code: `GL-${b.glAccountCode}`,
        name: b.glAccountName,
        fund: b.fundType.replace('_', ' '),
        budget: (b.budgetAmountCents / 100).toFixed(2),
        actual: (b.actualAmountCents / 100).toFixed(2),
        variance: ((b.budgetAmountCents - b.actualAmountCents) / 100).toFixed(2),
        status: 'Active FY26',
      }));
    } else if (activeTab === 'levies') {
      rows = filteredLevies.map((charge) => ({
        chargeId: charge.id,
        lotOwner: `Lot ${charge.lotNumber} - ${charge.ownerName}`,
        fund: charge.fundType.replace('_', ' '),
        crn: charge.crn,
        dueDate: charge.dueDate,
        amount: (charge.amountCents / 100).toFixed(2),
        status: charge.status.replace('_', ' '),
      }));
    } else if (activeTab === 'bank-rec') {
      rows = filteredBankRec.map((rec) => ({
        recId: rec.id,
        account: rec.account,
        period: rec.period,
        statement: (rec.statementClosingBalanceCents / 100).toFixed(2),
        ledger: (rec.ledgerCashBalanceCents / 100).toFixed(2),
        difference: (rec.discrepancyCents / 100).toFixed(2),
        status: rec.status,
      }));
    } else if (activeTab === 'arrears') {
      rows = filteredArrears.map((c) => ({
        caseId: c.id,
        lotOwner: `Lot ${c.lotNumber} - ${c.ownerName}`,
        level: `L${c.level} Notice`,
        overdue: `${c.daysOverdue} days`,
        total: (c.totalOverdueCents / 100).toFixed(2),
        oldest: c.oldestDueDate,
        status: 'Eligible for Referral',
      }));
    } else if (activeTab === 'invoices') {
      rows = filteredInvoices.map((inv) => ({
        invoiceNo: inv.invoiceNumber,
        supplier: inv.supplierName,
        category: inv.glAccountName,
        remaining: (inv.budgetRemainingCents / 100).toFixed(2),
        total: (inv.totalAmountCents / 100).toFixed(2),
        dueDate: inv.dueDate,
        status: inv.status.replace('_', ' '),
      }));
    } else if (activeTab === 'gl') {
      rows = filteredGL.map((j) => ({
        journalId: j.id,
        date: j.date,
        memo: j.memo,
        reference: j.reference,
        amount: (j.totalAmountCents / 100).toFixed(2),
        status: 'Balanced',
      }));
    } else if (activeTab === 'receipts') {
      rows = filteredReceipts.map((r) => ({
        ref: r.ref,
        payer: r.payer,
        method: r.method,
        crn: r.crn,
        date: r.date,
        amount: (r.amount / 100).toFixed(2),
        status: r.status,
      }));
    }

    const header = cols.map((c) => `"${c.label}"`).join(',');
    const body = rows.map((r) => cols.map((c) => `"${r[c.key] ?? ''}"`).join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(`${header}\n${body}`);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${activeTab}-export.csv`);
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
              {activeTab === 'budgets' && 'Budgets & Funds Register'}
              {activeTab === 'levies' && 'Levy Schedules & Assessment Runs'}
              {activeTab === 'receipts' && 'Receipts & Payments Register'}
              {activeTab === 'bank-rec' && 'Trust Bank Reconciliation (Macquarie & NAB)'}
              {activeTab === 'arrears' && 'Arrears & Legal Debt Recovery (L0–L3)'}
              {activeTab === 'invoices' && 'Accounts Payable & Supplier Invoices'}
              {activeTab === 'gl' && 'Trust General Ledger & Double-Entry Journals'}
            </h2>
            <p className="text-xs text-[#71849A] font-medium mt-0.5 font-sans">
              {activeTab === 'budgets' &&
                'Statutory Admin & Capital Works budgets with live budget remaining display (BR-ST-15).'}
              {activeTab === 'levies' &&
                'Entitlement-based quarterly levy calculations, Luhn check-digit CRN issuance, and pay-now notices.'}
              {activeTab === 'receipts' &&
                'DEFT/BPAY payment allocations, owner credit ledgers, and suspense clearing.'}
              {activeTab === 'bank-rec' &&
                'Multi-bank electronic feed matching with statement balance lock ($0.00 difference required).'}
              {activeTab === 'arrears' &&
                'Multi-level escalation policies (L0-L3), 10% statutory interest, and LevyCollect referral.'}
              {activeTab === 'invoices' &&
                'Committee-approved disbursements with statutory budget remaining and payment batching.'}
              {activeTab === 'gl' &&
                'Chart of accounts (1000–5900), balanced double-entry journals (ΣDR = ΣCR), and audit trails.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'budgets') setActiveModal('new_budget');
                else if (activeTab === 'levies') setActiveModal('run_levy');
                else if (activeTab === 'receipts') setActiveModal('record_receipt');
                else if (activeTab === 'bank-rec') setActiveModal('import_statement');
                else if (activeTab === 'arrears') setActiveModal('refer_levycollect');
                else if (activeTab === 'invoices') setActiveModal('create_invoice');
                else if (activeTab === 'gl') setActiveModal('post_journal');
              }}
              className="bg-[#00B5A4] hover:bg-[#008F87] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === 'budgets' && 'New Budget FY26'}
                {activeTab === 'levies' && 'Run Levy Calculation'}
                {activeTab === 'receipts' && 'Record Receipt'}
                {activeTab === 'bank-rec' && 'Import Statement'}
                {activeTab === 'arrears' && 'Refer to LevyCollect'}
                {activeTab === 'invoices' && 'Create Invoice'}
                {activeTab === 'gl' && 'Post General Journal'}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Pills and Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 pb-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'active', label: 'Active / Current' },
              { id: 'pending', label: 'Pending Action' },
              { id: 'flagged', label: 'Flagged / Attention' },
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
              placeholder="Search by code, account, CRN..."
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
            Showing <strong className="text-[#102747]">{currentCount}</strong> records
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#D5E5F2] bg-white hover:bg-[#F4F8FC] text-[#102747] font-bold text-xs transition cursor-pointer shadow-xs select-none"
              title="Export visible columns to CSV"
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
              {activeTab === 'budgets' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Reallocate Funds')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#00B5A4]" />
                    <span>Reallocate Funds</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Adjust Budget Allocation')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#334B68]" />
                    <span>Adjust Budget</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Lock Line FY26')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lock Line FY26</span>
                  </button>
                </>
              )}

              {activeTab === 'levies' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Issue Levy Notices')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#00B5A4]" />
                    <span>Issue Notice</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Apply 10% Interest')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Percent className="w-3.5 h-3.5 text-amber-600" />
                    <span>Apply 10% Interest</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Print Slips')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#334B68]" />
                    <span>Print Slips</span>
                  </button>
                </>
              )}

              {activeTab === 'bank-rec' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Mark Matched & Lock')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00B5A4]" />
                    <span>Mark Matched ($0.00 Diff)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Lock Period')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lock Period</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Flag Discrepancy')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Flag Discrepancy</span>
                  </button>
                </>
              )}

              {activeTab === 'arrears' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Issue Demand Notice')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#00B5A4]" />
                    <span>Issue Demand (L1–L3)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Refer to LevyCollect Legal')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Gavel className="w-3.5 h-3.5 text-rose-600" />
                    <span>Refer to LevyCollect</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Payment Plan Agreement')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#334B68]" />
                    <span>Payment Plan</span>
                  </button>
                </>
              )}

              {activeTab === 'invoices' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Approve Selected')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00B5A4] hover:bg-[#008F87] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Selected</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Generate ABA Payment Batch')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#334B68]" />
                    <span>Batch Pay (ABA)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Dispute Invoice')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Dispute</span>
                  </button>
                </>
              )}

              {activeTab === 'gl' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Post to General Ledger')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00B5A4] hover:bg-[#008F87] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Post to Ledger</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Reverse Journal Entry')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Reverse Entry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Export Audit Trail')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#334B68]" />
                    <span>Audit Trail</span>
                  </button>
                </>
              )}

              {activeTab === 'receipts' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Allocate to Lot Ledger')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#00B5A4]/40 hover:bg-[#F0FAF8] text-[#008F87] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00B5A4]" />
                    <span>Allocate to Lot</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Email Receipt Slip')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#334B68]" />
                    <span>Email Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAction('Transfer to Suspense')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D5E5F2] hover:bg-[#F4F8FC] text-[#102747] text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                    <span>Transfer Suspense</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto border border-[#E5EEF5] rounded-xl">
          {activeTab === 'budgets' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('code') && <th className="p-3">ACCOUNT CODE</th>}
                  {isColVisible('name') && <th className="p-3">EXPENSE CATEGORY</th>}
                  {isColVisible('fund') && <th className="p-3">FUND TYPE</th>}
                  {isColVisible('budget') && <th className="p-3">BUDGET ALLOCATION</th>}
                  {isColVisible('actual') && <th className="p-3">ACTUAL SPENT</th>}
                  {isColVisible('variance') && <th className="p-3">BUDGET REMAINING</th>}
                  {isColVisible('status') && <th className="p-3 text-left whitespace-nowrap">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredBudgets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-slate-400">
                      No budget records match the selected filter &quot;{filter === 'all' ? searchQuery : filter}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredBudgets.map((b) => {
                    const isSelected = selectedRowIds.includes(b.id);
                    return (
                      <tr
                        key={b.id}
                        onClick={() => toggleSelectRow(b.id)}
                        className={cn(
                          'transition cursor-pointer group',
                          isSelected ? 'bg-[#EBFBF8] hover:bg-[#E0F8F4]' : 'hover:bg-[#F8FAFC]'
                        )}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(b.id)}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('code') && (
                          <td className="p-3 font-mono font-bold text-[#102747]">
                            GL-{b.glAccountCode}
                          </td>
                        )}
                        {isColVisible('name') && (
                          <td className="p-3 font-bold text-[#102747]">{b.glAccountName}</td>
                        )}
                        {isColVisible('fund') && (
                          <td className="p-3 capitalize">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {b.fundType.replace('_', ' ')}
                            </span>
                          </td>
                        )}
                        {isColVisible('budget') && (
                          <td className="p-3 font-mono font-bold text-[#102747]">
                            ${(b.budgetAmountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('actual') && (
                          <td className="p-3 font-mono text-[#71849A]">
                            ${(b.actualAmountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('variance') && (
                          <td className="p-3 font-mono font-bold text-emerald-700">
                            ${((b.budgetAmountCents - b.actualAmountCents) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8FAF2] text-[#008F87] border border-[#B6F0D8] whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00B5A4] shrink-0" />
                              Active FY26
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

          {activeTab === 'levies' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('chargeId') && <th className="p-3">CHARGE ID</th>}
                  {isColVisible('lotOwner') && <th className="p-3 whitespace-nowrap">LOT</th>}
                  {isColVisible('fund') && <th className="p-3">FUND</th>}
                  {isColVisible('crn') && <th className="p-3">CRN</th>}
                  {isColVisible('dueDate') && <th className="p-3">DUE DATE</th>}
                  {isColVisible('amount') && <th className="p-3">AMOUNT DUE</th>}
                  {isColVisible('status') && <th className="p-3 text-left whitespace-nowrap">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredLevies.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-slate-400">
                      No levy charge records match the selected filter &quot;{filter === 'all' ? searchQuery : filter}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredLevies.map((charge) => {
                    const isSelected = selectedRowIds.includes(charge.id);
                    return (
                      <tr
                        key={charge.id}
                        onClick={() => toggleSelectRow(charge.id)}
                        className={cn(
                          'transition cursor-pointer group',
                          isSelected ? 'bg-[#EBFBF8] hover:bg-[#E0F8F4]' : 'hover:bg-[#F8FAFC]'
                        )}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(charge.id)}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('chargeId') && (
                          <td className="p-3 font-mono font-bold text-[#102747]">{charge.id}</td>
                        )}
                        {isColVisible('lotOwner') && (
                          <td className="p-3 font-bold text-[#102747]">Lot {charge.lotNumber} - {charge.ownerName}</td>
                        )}
                        {isColVisible('fund') && (
                          <td className="p-3 capitalize font-medium text-[#102747] font-bold">{charge.fundType.replace('_', ' ')}</td>
                        )}
                        {isColVisible('crn') && (
                          <td className="p-3 font-mono text-[11px] text-[#00B5A4]">{charge.crn}</td>
                        )}
                        {isColVisible('dueDate') && (
                          <td className="p-3 font-mono text-[#102747] font-bold">{charge.dueDate}</td>
                        )}
                        {isColVisible('amount') && (
                          <td className="p-3 font-mono font-bold text-[#102747]">
                            ${(charge.amountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 whitespace-nowrap capitalize">
                              {charge.status.replace('_', ' ')}
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

          {activeTab === 'bank-rec' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('recId') && <th className="p-3">RECONCILIATION ID</th>}
                  {isColVisible('account') && <th className="p-3">ACCOUNT NAME</th>}
                  {isColVisible('period') && <th className="p-3">PERIOD</th>}
                  {isColVisible('statement') && <th className="p-3">STATEMENT BAL</th>}
                  {isColVisible('ledger') && <th className="p-3">LEDGER BAL</th>}
                  {isColVisible('difference') && <th className="p-3">DIFFERENCE</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredBankRec.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-left text-slate-400">
                      No reconciliation records match the selected filter &quot;{filter === 'all' ? searchQuery : filter}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredBankRec.map((rec) => {
                    const isSelected = selectedRowIds.includes(rec.id);
                    return (
                      <tr
                        key={rec.id}
                        onClick={() => toggleSelectRow(rec.id)}
                        className={cn(
                          'transition cursor-pointer group',
                          isSelected ? 'bg-[#EBFBF8] hover:bg-[#E0F8F4]' : 'hover:bg-[#F8FAFC]'
                        )}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(rec.id)}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('recId') && (
                          <td className="p-3 font-mono font-bold text-[#102747]">{rec.id}</td>
                        )}
                        {isColVisible('account') && (
                          <td className="p-3 font-bold text-[#102747]">{rec.account}</td>
                        )}
                        {isColVisible('period') && (
                          <td className="p-3 font-mono text-[#102747] font-bold">{rec.period}</td>
                        )}
                        {isColVisible('statement') && (
                          <td className="p-3 font-mono font-bold text-slate-800">
                            ${(rec.statementClosingBalanceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('ledger') && (
                          <td className="p-3 font-mono font-bold text-slate-800">
                            ${(rec.ledgerCashBalanceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('difference') && (
                          <td className="p-3 font-mono font-black text-emerald-600">
                            ${(rec.discrepancyCents / 100).toFixed(2)} (Matched)
                            <div>${(rec.discrepancyCents / 100).toFixed(2)}</div>
                            <div className="whitespace-nowrap">(Matched)</div>
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left">
                            <span className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                              rec.discrepancyCents === 0
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            )}>
                              {rec.discrepancyCents === 0 && <Lock className="w-3 h-3 text-emerald-600" />}
                              {rec.status}
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

          {activeTab === 'arrears' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('caseId') && <th className="p-3">CASE ID</th>}
                  {isColVisible('lotOwner') && <th className="p-3 whitespace-nowrap">LOT</th>}
                  {isColVisible('level') && <th className="p-3">ESCALATION LEVEL</th>}
                  {isColVisible('overdue') && <th className="p-3">DAYS OVERDUE</th>}
                  {isColVisible('total') && <th className="p-3">TOTAL OVERDUE</th>}
                  {isColVisible('oldest') && <th className="p-3">OLDEST DUE DATE</th>}
                  {isColVisible('status') && <th className="p-3 text-left whitespace-nowrap">LEVYCOLLECT STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredArrears.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-slate-400">
                      No arrears cases match the selected filter &quot;{filter === 'all' ? searchQuery : filter}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredArrears.map((c) => {
                    const isSelected = selectedRowIds.includes(c.id);
                    return (
                      <tr
                        key={c.id}
                        onClick={() => toggleSelectRow(c.id)}
                        className={cn(
                          'transition cursor-pointer group',
                          isSelected ? 'bg-[#EBFBF8] hover:bg-[#E0F8F4]' : 'hover:bg-[#F8FAFC]'
                        )}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(c.id)}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('caseId') && (
                          <td className="p-3 font-mono font-bold text-[#102747]">{c.id}</td>
                        )}
                        {isColVisible('lotOwner') && (
                          <td className="p-3 font-bold text-[#102747]">Lot {c.lotNumber} - {c.ownerName}</td>
                        )}
                        {isColVisible('level') && (
                          <td className="p-3">
                            <span
                              className={cn(
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap',
                                c.level >= 3
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : c.level >= 1
                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              )}
                            >
                              L{c.level} Notice
                            </span>
                          </td>
                        )}
                        {isColVisible('overdue') && (
                          <td className="p-3 font-mono font-bold text-rose-600">{c.daysOverdue} days</td>
                        )}
                        {isColVisible('total') && (
                          <td className="p-3 font-mono font-black text-rose-700">
                            ${(c.totalOverdueCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('oldest') && (
                          <td className="p-3 font-mono text-[#102747] font-bold">{c.oldestDueDate}</td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
                              {c.level >= 3 ? 'Referred to Legal' : 'Eligible for Referral'}
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

          {activeTab === 'invoices' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('invoiceNo') && <th className="p-3">INVOICE NO</th>}
                  {isColVisible('supplier') && <th className="p-3">SUPPLIER</th>}
                  {isColVisible('category') && <th className="p-3">CATEGORY</th>}
                  {isColVisible('remaining') && <th className="p-3">BUDGET REMAINING</th>}
                  {isColVisible('total') && <th className="p-3">TOTAL</th>}
                  {isColVisible('dueDate') && <th className="p-3">DUE DATE</th>}
                  {isColVisible('status') && <th className="p-3 text-left whitespace-nowrap">APPROVAL STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-slate-400">
                      No invoices match the selected filter &quot;{filter === 'all' ? searchQuery : filter}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isSelected = selectedRowIds.includes(inv.id);
                    return (
                      <tr
                        key={inv.id}
                        onClick={() => toggleSelectRow(inv.id)}
                        className={cn(
                          'transition cursor-pointer group',
                          isSelected ? 'bg-[#EBFBF8] hover:bg-[#E0F8F4]' : 'hover:bg-[#F8FAFC]'
                        )}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(inv.id)}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('invoiceNo') && (
                          <td className="p-3 font-mono font-bold text-[#102747]">{inv.invoiceNumber}</td>
                        )}
                        {isColVisible('supplier') && (
                          <td className="p-3 font-bold text-[#102747]">{inv.supplierName}</td>
                        )}
                        {isColVisible('category') && (
                          <td className="p-3 font-medium text-[#102747] font-bold">{inv.glAccountName}</td>
                        )}
                        {isColVisible('remaining') && (
                          <td className="p-3 font-mono font-bold text-emerald-700">
                            ${(inv.budgetRemainingCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('total') && (
                          <td className="p-3 font-mono font-black text-[#102747]">
                            ${(inv.totalAmountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('dueDate') && (
                          <td className="p-3 font-mono text-[#102747] font-bold">{inv.dueDate}</td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left whitespace-nowrap">
                            <span className="inline-flex items-center justify-start px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap capitalize">
                              {inv.status.replace('_', ' ')}
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

          {activeTab === 'gl' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('journalId') && <th className="p-3">JOURNAL ID</th>}
                  {isColVisible('date') && <th className="p-3">DATE</th>}
                  {isColVisible('memo') && <th className="p-3">MEMO</th>}
                  {isColVisible('reference') && <th className="p-3">REFERENCE</th>}
                  {isColVisible('amount') && <th className="p-3 text-left">TOTAL AMOUNT</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredGL.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-left text-slate-400">
                      No general journal entries match the selected filter &quot;{filter === 'all' ? searchQuery : filter}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredGL.map((j) => {
                    const isSelected = selectedRowIds.includes(j.id);
                    return (
                      <tr
                        key={j.id}
                        onClick={() => toggleSelectRow(j.id)}
                        className={cn(
                          'transition cursor-pointer group',
                          isSelected ? 'bg-[#EBFBF8] hover:bg-[#E0F8F4]' : 'hover:bg-[#F8FAFC]'
                        )}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(j.id)}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('journalId') && (
                          <td className="p-3 font-mono font-bold text-[#102747]">{j.id}</td>
                        )}
                        {isColVisible('date') && (
                          <td className="p-3 font-mono text-[#102747] font-bold">{j.date}</td>
                        )}
                        {isColVisible('memo') && (
                          <td className="p-3 font-bold text-[#102747]">{j.memo}</td>
                        )}
                        {isColVisible('reference') && (
                          <td className="p-3 font-mono text-[#102747] font-bold">{j.reference}</td>
                        )}
                        {isColVisible('amount') && (
                          <td className="p-3 font-mono font-bold text-left text-emerald-700">
                            ${(j.totalAmountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Balanced
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

          {activeTab === 'receipts' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#71849A] font-bold uppercase tracking-wider border-b border-[#E5EEF5]">
                  <th className="p-3 w-8 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                    />
                  </th>
                  {isColVisible('ref') && <th className="p-3">RECEIPT REF</th>}
                  {isColVisible('payer') && <th className="p-3">PAYER</th>}
                  {isColVisible('method') && <th className="p-3">PAYMENT METHOD</th>}
                  {isColVisible('crn') && <th className="p-3">CRN REFERENCE</th>}
                  {isColVisible('date') && <th className="p-3">DATE PROCESSED</th>}
                  {isColVisible('amount') && <th className="p-3">AMOUNT RECEIVED</th>}
                  {isColVisible('status') && <th className="p-3 text-left">STATUS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5FA]">
                {filteredReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-left text-slate-400">
                      No receipts match the selected filter &quot;{filter === 'all' ? searchQuery : filter}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredReceipts.map((r) => {
                    const isSelected = selectedRowIds.includes(r.ref);
                    return (
                      <tr
                        key={r.ref}
                        onClick={() => toggleSelectRow(r.ref)}
                        className={cn(
                          'transition cursor-pointer group',
                          isSelected ? 'bg-[#EBFBF8] hover:bg-[#E0F8F4]' : 'hover:bg-[#F8FAFC]'
                        )}
                      >
                        <td className="p-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(r.ref)}
                            className="rounded text-[#00B5A4] focus:ring-[#00B5A4] accent-[#00B5A4] cursor-pointer"
                          />
                        </td>
                        {isColVisible('ref') && (
                          <td className="p-3 font-mono font-bold text-[#102747]">{r.ref}</td>
                        )}
                        {isColVisible('payer') && (
                          <td className="p-3 font-bold text-[#102747]">
                            {r.payer.includes('(') ? (
                              <>
                                <div className="whitespace-nowrap">{r.payer.slice(0, r.payer.indexOf('(')).trim()}</div>
                                <div className="whitespace-nowrap">{r.payer.slice(r.payer.indexOf('('))}</div>
                              </>
                            ) : (
                              r.payer
                            )}
                          </td>
                        )}
                        {isColVisible('method') && (
                          <td className="p-3 font-medium text-[#102747] font-bold">{r.method}</td>
                        )}
                        {isColVisible('crn') && (
                          <td className="p-3 font-mono text-[11px] text-[#00B5A4]">{r.crn}</td>
                        )}
                        {isColVisible('date') && (
                          <td className="p-3 font-mono text-[#102747] font-bold">{r.date}</td>
                        )}
                        {isColVisible('amount') && (
                          <td className="p-3 font-mono font-black text-emerald-700">
                            ${(r.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        )}
                        {isColVisible('status') && (
                          <td className="p-3 text-left">
                            <span className={cn(
                              'px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                              r.status === 'Allocated' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            )}>
                              {r.status}
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

      {/* Interactive Modal Dialog for Fast Action Execution */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-start p-4 bg-[#061D33]/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setActiveModal(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,41,74,0.25)] border border-[#D5E5F2] overflow-hidden z-10 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F5FA] bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] text-[#008F87] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5 text-[#00B5A4]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102747]">
                    {activeModal === 'import_statement' && 'Import Trust Bank Statement Feed'}
                    {activeModal === 'refer_levycollect' && 'Refer Delinquent Lot to LevyCollect'}
                    {activeModal === 'create_invoice' && 'Create Supplier Accounts Payable Invoice'}
                    {activeModal === 'post_journal' && 'Post General Journal (Double-Entry)'}
                    {activeModal === 'record_receipt' && 'Record Owner Levy Receipt'}
                    {activeModal === 'new_budget' && 'Create New Budget Line Item FY26'}
                    {activeModal === 'run_levy' && 'Run Quarterly Levy Assessment Calculation'}
                  </h3>
                  <p className="text-[11px] text-[#71849A]">
                    {activeModal === 'import_statement' && 'Automated Macquarie DEFT bank electronic feed reconciliation'}
                    {activeModal === 'refer_levycollect' && 'Escalate to legal debt recovery with 10% statutory interest'}
                    {activeModal === 'create_invoice' && 'Disbursement against approved fund with BR-ST-15 budget lock'}
                    {activeModal === 'post_journal' && 'Trust General Ledger balanced entry (Σ Debits = Σ Credits)'}
                    {activeModal === 'record_receipt' && 'Allocate BPAY / DEFT transaction with Luhn CRN matching'}
                    {activeModal === 'new_budget' && 'Establish FY26 administrative or capital works expenditure item'}
                    {activeModal === 'run_levy' && 'Unit entitlement apportionment & Luhn CRN pay-now generation'}
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
              {activeModal === 'import_statement' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newRec = {
                      id: `REC-NOV-${Math.floor(100 + Math.random() * 900)}`,
                      account: 'Macquarie Trust Account (182-222)',
                      period: 'November 2026 (Live Feed)',
                      statementClosingBalanceCents: 58420000,
                      ledgerCashBalanceCents: 58420000,
                      discrepancyCents: 0,
                      status: 'Balanced & Locked ($0.00 difference)',
                      filterCategory: 'active',
                    };
                    setBankRecList((prev) => [newRec, ...prev]);
                    showToast('✔ Statement imported: 24 transactions auto-reconciled with $0.00 discrepancy.');
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      Bank Feed Account
                    </label>
                    <select
                      defaultValue="macquarie"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                    >
                      <option value="macquarie">Macquarie Trust Account (182-222) - API Live Feed</option>
                      <option value="nab">NAB Strata Operating Account (084-004)</option>
                      <option value="anz">Macquarie Capital Works TD (182-223)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Statement Period
                      </label>
                      <input
                        type="text"
                        defaultValue="November 2026 (Live Feed)"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Statement Balance
                      </label>
                      <input
                        type="text"
                        defaultValue="$584,200.00"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-[#E6F8F6] rounded-xl border border-[#00B5A4]/30 text-xs text-[#008F87] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00B5A4] shrink-0" />
                    <span>Auto-reconciliation rule active: Transactions auto-matched to trust ledger.</span>
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
                      Import & Reconcile Now
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'refer_levycollect' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setArrearsList((prev) =>
                      prev.map((c) =>
                        c.lotNumber === 204
                          ? { ...c, lastActionType: 'Referred to LevyCollect (Demand Issued)', level: 3 }
                          : c
                      )
                    );
                    showToast('✔ Case referred to LevyCollect Legal Recovery: Demand notice issued with 10% statutory interest.');
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      Target Overdue Lot & Owner
                    </label>
                    <select
                      defaultValue="lot204"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                    >
                      <option value="lot204">Lot 204 - Marcus Vance (Overdue $2,840.00 / 68 Days)</option>
                      <option value="lot308">Lot 308 - Apex Commercial (Overdue $5,120.00 / 94 Days)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Escalation Action
                      </label>
                      <select
                        defaultValue="demand"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="demand">L2 - Final Demand Notice</option>
                        <option value="ncat">L3 - Section 85 NCAT Application</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        10% Statutory Interest
                      </label>
                      <input
                        type="text"
                        defaultValue="+$184.20 calculated"
                        readOnly
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] rounded-xl px-3 py-2 text-xs text-rose-600 font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Statutory 21-day notice period enforced under SSMA 2015 prior to filing.</span>
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
                      Dispatch Referral to LevyCollect
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'create_invoice' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newInv = {
                      id: `inv-${Date.now().toString().slice(-4)}`,
                      supplierId: 'sup-apex',
                      schemeId: 'scheme-1',
                      schemeCode: 'SP52891',
                      schemeName: 'Horizon Towers Complex',
                      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
                      invoiceDate: '2026-11-25',
                      supplierName: 'Apex Elevator Services NSW',
                      glAccountName: 'Repairs & Maintenance',
                      glAccountCode: '5200',
                      fundType: 'admin' as const,
                      totalAmountCents: 345000,
                      amountExGstCents: 313636,
                      gstCents: 31364,
                      budgetRemainingCents: 4005000,
                      dueDate: '2026-12-14',
                      status: 'pending_approval' as const,
                      approvalTier: 'committee' as const,
                      lineItems: [],
                    };
                    setInvoicesList((prev) => [newInv, ...prev]);
                    showToast(`✔ Invoice ${newInv.invoiceNumber} created and routed for committee approval.`);
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Supplier / Contractor
                      </label>
                      <select
                        defaultValue="apex"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="apex">Apex Elevator Services NSW</option>
                        <option value="bright">BrightClean Facility Care</option>
                        <option value="rapid">Rapid Plumbing Solutions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        GL Expense Category
                      </label>
                      <select
                        defaultValue="5200"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="5200">GL-5200 Repairs & Maintenance</option>
                        <option value="5300">GL-5300 Cleaning & Caretaking</option>
                        <option value="6100">GL-6100 Lift Overhaul (Capital)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Invoice Total Amount ($)
                      </label>
                      <input
                        type="text"
                        defaultValue="$3,450.00"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Payment Due Date
                      </label>
                      <input
                        type="text"
                        defaultValue="14 Dec 2026"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      Job Scope / Description
                    </label>
                    <input
                      type="text"
                      defaultValue="Quarterly preventive lift maintenance and emergency intercom phone line test"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                    />
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
                      Create & Submit Invoice
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'post_journal' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newJ = {
                      id: `JRN-2026-${Math.floor(100 + Math.random() * 900)}`,
                      schemeId: 'scheme-1',
                      period: '2026-11',
                      date: '2026-11-25',
                      memo: 'Emergency stormwater pump repair and drain clearing',
                      reference: 'REF-DRN-09',
                      sourceType: 'manual' as const,
                      totalAmountCents: 185000,
                      lines: [],
                    };
                    setGlList((prev) => [newJ, ...prev]);
                    showToast(`✔ Balanced General Journal ${newJ.id} posted (ΣDR $1,850 = ΣCR $1,850).`);
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Debit Account (DR)
                      </label>
                      <select
                        defaultValue="5200"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="5200">GL-5200 Repairs & Maintenance</option>
                        <option value="5400">GL-5400 Electricity & Gas</option>
                        <option value="6100">GL-6100 Capital Overhaul</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Credit Account (CR)
                      </label>
                      <select
                        defaultValue="1000"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="1000">1000 Macquarie Trust Account</option>
                        <option value="2000">2000 Accounts Payable Control</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Amount ($)
                      </label>
                      <input
                        type="text"
                        defaultValue="$1,850.00"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Reference Code
                      </label>
                      <input
                        type="text"
                        defaultValue="REF-DRN-09"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Statutory double-entry verified: ΣDR $1,850.00 = ΣCR $1,850.00.</span>
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
                      Post General Journal
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'record_receipt' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newR = {
                      ref: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
                      payer: 'David & Lisa Wong (Lot 101)',
                      method: 'BPAY / DEFT',
                      crn: '528911019',
                      date: '25 Nov 2026',
                      amount: 145000,
                      status: 'Allocated',
                      filterCategory: 'active',
                    };
                    setReceiptsList((prev) => [newR, ...prev]);
                    showToast(`✔ Receipt ${newR.ref} recorded: $1,450.00 allocated against Q2 Admin Levy.`);
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Payer / Lot Owner
                      </label>
                      <input
                        type="text"
                        defaultValue="David & Lisa Wong (Lot 101)"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        CRN (Luhn Verified)
                      </label>
                      <input
                        type="text"
                        defaultValue="528911019"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Payment Method
                      </label>
                      <select
                        defaultValue="bpay"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="bpay">BPAY / DEFT Direct</option>
                        <option value="dd">Direct Debit</option>
                        <option value="cc">Credit Card Online</option>
                        <option value="eft">EFT Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Amount Paid ($)
                      </label>
                      <input
                        type="text"
                        defaultValue="$1,450.00"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono font-bold"
                      />
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
                      Record & Allocate Receipt
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'new_budget' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newB = {
                      id: `b-${Date.now().toString().slice(-4)}`,
                      schemeId: 'scheme-1',
                      fy: 'FY2026',
                      glAccountCode: '6400',
                      glAccountName: 'Fire Safety & ESM Sinking Fund',
                      fundType: 'capital_works' as const,
                      budgetAmountCents: 3500000,
                      actualAmountCents: 0,
                    };
                    setBudgetsList((prev) => [newB, ...prev]);
                    showToast('✔ Budget line GL-6400 created: $35,000.00 allocated (BR-ST-15 compliant).');
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        GL Code
                      </label>
                      <input
                        type="text"
                        defaultValue="GL-6400"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Fund Type
                      </label>
                      <select
                        defaultValue="capital"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="capital">Capital Works Fund</option>
                        <option value="admin">Administrative Fund</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      Expense Category Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Fire Safety & ESM Sinking Fund"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      FY26 Budget Allocation ($)
                    </label>
                    <input
                      type="text"
                      defaultValue="$35,000.00"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono font-bold"
                    />
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
                      Add Budget Line FY26
                    </button>
                  </div>
                </form>
              )}

              {activeModal === 'run_levy' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newL = {
                      id: `CHG-${Math.floor(1000 + Math.random() * 9000)}`,
                      schemeId: 'scheme-1',
                      lotId: 'lot-1',
                      lotNumber: 1,
                      unitLabel: 'Lot 1 (Penthouse A)',
                      ownerName: 'Alexander Hayes',
                      fundType: 'admin' as const,
                      type: 'levy' as const,
                      periodLabel: 'Q3 FY26',
                      amountCents: 185000,
                      outstandingCents: 185000,
                      dueDate: '2027-01-01',
                      crn: '528910014',
                      status: 'issued' as const,
                    };
                    setLeviesList((prev) => [newL, ...prev]);
                    showToast('✔ Levy calculation completed: 48 lot notices generated with Luhn check-digit CRNs.');
                    setActiveModal(null);
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Quarter Assessment
                      </label>
                      <select
                        defaultValue="q3"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      >
                        <option value="q3">Q3 FY26 (Jan - Mar 2027)</option>
                        <option value="q4">Q4 FY26 (Apr - Jun 2027)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#102747] mb-1">
                        Due Date
                      </label>
                      <input
                        type="text"
                        defaultValue="01 Jan 2027"
                        className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#102747] mb-1">
                      Scheme Target Amount ($)
                    </label>
                    <input
                      type="text"
                      defaultValue="$115,000.00"
                      className="w-full bg-[#F4F8FC] border border-[#D5E5F2] focus:bg-white focus:border-[#00B5A4] rounded-xl px-3 py-2 text-xs text-[#102747] focus:outline-none font-mono font-bold"
                    />
                  </div>
                  <div className="p-3 bg-[#E6F8F6] rounded-xl border border-[#00B5A4]/30 text-xs text-[#008F87] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00B5A4] shrink-0" />
                    <span>Luhn check-digit CRN generation active for all 48 unit entitlement owners.</span>
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
                      Execute Levy Run & Issue Notices
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
