export type Role = 'tenant_admin' | 'fm_mgr' | 'fm_coord' | 'technician' | 'contractor' | 'fm_client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: string[];
  tenantId: string;
  avatarUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  brandColor: string; // token --brand
  hasFMLicense: boolean;
  currencySymbol: string;
  dateFormat: string;
  timeZone: string;
}

export interface Supplier {
  id: string;
  name: string;
  taxId: string;
  trades: string[];
  email: string;
  phone: string;
  address: string;
  complianceStatus: 'compliant' | 'warning' | 'non_compliant';
  expiringNext?: string;
  openWOsCount: number;
}

export interface ComplianceRecord {
  id: string;
  supplierId: string;
  supplierName: string;
  type: 'Public Liability' | 'Workers Comp' | 'Trade Licence' | 'Induction';
  number: string;
  issuer: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired' | 'pending_verification';
  coverAmountCents?: number;
  documentUrl?: string;
}

export interface Approval {
  id: string;
  entityType: 'invoice' | 'work_order_variation' | 'budget';
  entityId: string;
  title: string;
  requesterName: string;
  amountCents: number;
  budgetRemainingCents: number;
  status: 'pending' | 'approved' | 'rejected' | 'held';
  submittedDate: string;
  comments?: string;
}

export interface AuditEvent {
  id: string;
  time: string;
  actor: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  changes: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}

export interface SyncQueueItem {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  retries: number;
}
