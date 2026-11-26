export type SchemeJurisdiction = 'NSW' | 'QLD' | 'VIC' | 'WA' | 'SA' | 'ACT' | 'TAS' | 'NT';
export type LevyFrequency = 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
export type FundType = 'admin' | 'capital_works' | 'other';
export type ArrearsLevel = 0 | 1 | 2 | 3;

export interface Scheme {
  id: string;
  code: string; // e.g. SP-52891, CTS-41920
  registrationNo: string;
  name: string;
  address: string;
  jurisdiction: SchemeJurisdiction;
  totalLots: number;
  totalEntitlement: number;
  fyStartMonth: number; // 1-12
  levyFrequency: LevyFrequency;
  firstDueDate: string;
  leadDays: number;
  gstRegistered: boolean;
  status: 'active' | 'suspended';
  bankAccounts: SchemeBankAccount[];
  funds: SchemeFund[];
  committeeCount: number;
}

export interface SchemeFund {
  id: string;
  schemeId: string;
  type: FundType;
  name: string;
  balanceCents: number;
  targetBudgetCents: number;
}

export interface SchemeBankAccount {
  id: string;
  schemeId: string;
  bankName: string;
  accountName: string;
  bsb: string;
  accountNumberMasked: string;
  glAccountId: string;
  balanceCents: number;
  lastReconciledDate: string;
}

export interface Lot {
  id: string;
  schemeId: string;
  lotNumber: number;
  unitLabel: string;
  floorLabel: string;
  entitlement: number;
  lotType: 'residential' | 'commercial' | 'parking' | 'storage';
  crn: string; // Customer Reference Number with Luhn check
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  occupancyType: 'owner_occupier' | 'investor' | 'company';
  occupierName?: string;
  currentBalanceCents: number; // positive = owes, negative = credit
  arrearsLevel: ArrearsLevel;
  paymentPlanActive?: boolean;
  disputeHold?: boolean;
}

export interface CommitteeMember {
  id: string;
  schemeId: string;
  lotNumber: number;
  name: string;
  role: 'Chairperson' | 'Secretary' | 'Treasurer' | 'Committee Member';
  email: string;
  phone: string;
  appointedDate: string;
}

// Accounting & Budgets
export interface GLAccount {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  fundType?: FundType;
  balanceCents: number;
}

export interface BudgetLine {
  id: string;
  schemeId: string;
  fy: string;
  fundType: FundType;
  glAccountCode: string;
  glAccountName: string;
  budgetAmountCents: number;
  actualAmountCents: number;
}

export interface JournalEntry {
  id: string;
  schemeId: string;
  date: string;
  period: string; // YYYY-MM
  sourceType: 'levy' | 'receipt' | 'invoice' | 'penalty' | 'manual';
  reference: string;
  memo: string;
  totalAmountCents: number;
  lines: LedgerLine[];
}

export interface LedgerLine {
  id: string;
  glAccountCode: string;
  glAccountName: string;
  fundType: FundType;
  debitCents: number;
  creditCents: number;
  lotNumber?: number;
  supplierName?: string;
}

// Levies
export interface LevyScheduleItem {
  id: string;
  schemeId: string;
  lotId: string;
  lotNumber: number;
  fundType: FundType;
  instalmentNumber: number;
  dueDate: string;
  amountCents: number;
  status: 'unissued' | 'issued' | 'paid' | 'overdue';
}

export interface LevyCharge {
  id: string;
  schemeId: string;
  lotId: string;
  lotNumber: number;
  unitLabel: string;
  ownerName: string;
  type: 'levy' | 'special' | 'penalty' | 'sundry' | 'fee';
  fundType: FundType;
  periodLabel: string;
  amountCents: number;
  outstandingCents: number;
  dueDate: string;
  crn: string;
  status: 'pending' | 'issued' | 'partially_paid' | 'paid' | 'overdue';
}

export interface SpecialLevy {
  id: string;
  schemeId: string;
  title: string;
  fundType: FundType;
  totalTargetCents: number;
  purpose: string;
  dueDate: string;
  approvedDate: string;
  status: 'draft' | 'approved' | 'invoiced' | 'closed';
}

// Banking & Reconciliations
export interface BankTransaction {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  amountCents: number; // positive = credit (deposit), negative = debit (payment)
  reference: string;
  crnMatched?: string;
  status: 'unmatched' | 'suggested' | 'matched' | 'excluded';
  matchedEntity?: {
    type: 'receipt' | 'payment_batch' | 'charge';
    reference: string;
  };
}

export interface BankReconciliation {
  id: string;
  schemeId: string;
  bankAccountId: string;
  period: string; // YYYY-MM
  statementClosingBalanceCents: number;
  ledgerCashBalanceCents: number;
  unpresentedPaymentsCents: number;
  outstandingDepositsCents: number;
  discrepancyCents: number;
  status: 'draft' | 'balanced' | 'locked';
}

// Arrears
export interface ArrearsCase {
  id: string;
  schemeId: string;
  schemeCode: string;
  lotId: string;
  lotNumber: number;
  unitLabel: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  level: ArrearsLevel;
  totalOverdueCents: number;
  oldestDueDate: string;
  daysOverdue: number;
  ageing1To30Cents: number;
  ageing31To60Cents: number;
  ageing61To90Cents: number;
  ageing91PlusCents: number;
  paymentPlanActive: boolean;
  disputeHold: boolean;
  lastActionDate?: string;
  lastActionType?: string;
}

export interface DebtReferral {
  id: string;
  caseId: string;
  schemeId: string;
  lotNumber: number;
  ownerName: string;
  overdueAmountCents: number;
  referralDate: string;
  provider: 'LevyCollect' | 'Dun & Bradstreet' | 'ACS Legal';
  status: 'pending' | 'sent' | 'acknowledged' | 'in_progress' | 'settled' | 'closed';
  externalRef: string;
}

// Procurement & Invoices
export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  invoiceDate: string;
  dueDate: string;
  amountExGstCents: number;
  gstCents: number;
  totalAmountCents: number;
  fundType: FundType;
  glAccountCode: string;
  glAccountName: string;
  budgetRemainingCents: number; // BR-ST-15: critical requirement for committee approval
  workOrderRef?: string;
  quoteRef?: string;
  status: 'received' | 'coded' | 'pending_approval' | 'approved' | 'scheduled' | 'paid' | 'rejected';
  approvalTier: 'auto' | 'manager' | 'committee';
  approverNotes?: string;
}

export interface StrataWorkOrder {
  id: string;
  orderNumber: string;
  schemeId: string;
  supplierId: string;
  supplierName: string;
  title: string;
  scope: string;
  location: string;
  approvedAmountCents: number;
  status: 'draft' | 'issued' | 'accepted' | 'completed' | 'invoiced' | 'closed' | 'cancelled';
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  schemeId: string;
  title: string;
  scope: string;
  location: string;
  estimatedAmountCents: number;
  invitedSuppliers: string[];
  dueDate: string;
  quotesReceived: QuoteItem[];
  status: 'open' | 'quotes_received' | 'awarded' | 'cancelled';
}

export interface QuoteItem {
  id: string;
  supplierName: string;
  amountExGstCents: number;
  gstCents: number;
  totalAmountCents: number;
  validUntil: string;
  compliant: boolean;
  notes: string;
  status: 'submitted' | 'accepted' | 'declined';
}

export interface PaymentBatch {
  id: string;
  batchNumber: string;
  schemeId: string;
  bankAccountId: string;
  totalAmountCents: number;
  invoiceCount: number;
  createdDate: string;
  processedDate?: string;
  status: 'draft' | 'ready' | 'submitted' | 'processed' | 'failed';
}

// Meetings & Voting
export interface StrataMeeting {
  id: string;
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  type: 'agm' | 'egm' | 'committee';
  title: string;
  scheduledAt: string;
  mode: 'online' | 'onsite' | 'hybrid';
  location: string;
  videoLink?: string;
  noticeSentAt?: string;
  recordDate: string;
  quorumPercentage: number; // default 25%
  lotsRepresented: number;
  totalLots: number;
  status: 'draft' | 'notice_issued' | 'open' | 'closed' | 'minutes_published';
  motionsCount: number;
}

export interface StrataMotion {
  id: string;
  meetingId: string;
  motionNumber: number;
  title: string;
  text: string;
  resolutionType: 'ordinary' | 'special' | 'unanimous' | 'committee';
  weighting: 'per_lot' | 'entitlement';
  secretBallot: boolean;
  status: 'draft' | 'open' | 'closed';
  result: 'pending' | 'carried' | 'lost';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  entitlementFor?: number;
  entitlementAgainst?: number;
}

export interface StrataProxy {
  id: string;
  meetingId: string;
  lotNumber: number;
  grantorName: string;
  proxyHolderName: string;
  authorizedDate: string;
  verified: boolean;
}

// Comms & Wall
export interface CommsCampaign {
  id: string;
  title: string;
  schemeId?: string;
  targetAudience: string;
  channel: 'email' | 'sms' | 'in_app';
  recipientCount: number;
  scheduledAt: string;
  status: 'draft' | 'scheduled' | 'sent';
  deliveredCount?: number;
  openRatePct?: number;
}

export interface WallPost {
  id: string;
  schemeId: string;
  wallType: 'community' | 'committee';
  authorName: string;
  authorRole: 'Strata Manager' | 'Committee' | 'Owner' | 'Resident';
  title: string;
  content: string;
  createdAt: string;
  isPinned: boolean;
  likesCount: number;
  commentsCount: number;
}

// Insurance & Compliance
export interface InsurancePolicy {
  id: string;
  schemeId: string;
  insurer: string;
  policyNumber: string;
  policyType: 'Building & Common Property' | 'Public Liability' | 'Office Bearers Liability' | 'Fidelity Guarantee' | 'Voluntary Workers';
  buildingSumInsuredCents: number;
  premiumCents: number;
  startDate: string;
  expiryDate: string;
  status: 'current' | 'expiring_soon' | 'expired';
}

export interface ComplianceItem {
  id: string;
  schemeId: string;
  title: string;
  category: 'Fire Safety' | 'Lift Safety' | 'Pool Fencing' | 'Asbestos Register' | 'Anchor Points / Roof Safety' | 'Pest & Termite';
  dueDate: string;
  lastInspectionDate: string;
  certificateRef?: string;
  status: 'compliant' | 'due_soon' | 'overdue';
}
