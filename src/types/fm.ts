export type WOPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type WOStatus = 'open' | 'triage' | 'dispatched' | 'in_progress' | 'on_hold' | 'completed' | 'verified' | 'closed' | 'cancelled';
export type SLAState = 'normal' | 'at_risk' | 'breached';

export interface Property {
  id: string;
  code: string;
  name: string;
  address: string;
  region: string;
  client: string;
  totalAssets: number;
  activeWOs: number;
}

export interface LocationNode {
  id: string;
  propertyId: string;
  name: string;
  code: string;
  parentId?: string;
  type: 'building' | 'floor' | 'room' | 'common_area';
  children?: LocationNode[];
}

export interface Asset {
  id: string;
  propertyId: string;
  propertyName: string;
  locationId: string;
  locationName: string;
  code: string;
  name: string;
  type: 'HVAC' | 'Lift' | 'Fire Safety' | 'Electrical' | 'Plumbing' | 'Security';
  make?: string;
  model?: string;
  serial?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  installDate: string;
  warrantyExpiry: string;
  replacementCostCents: number;
  photoUrl?: string;
  status: 'operational' | 'degraded' | 'failed' | 'decommissioned';
}

export interface WorkOrder {
  id: string;
  number: string;
  propertyId: string;
  propertyName: string;
  assetId?: string;
  assetName?: string;
  priority: WOPriority;
  category: string;
  status: WOStatus;
  assigneeType: 'technician' | 'contractor';
  assigneeId: string;
  assigneeName: string;
  slaDue: string;
  slaState: SLAState;
  slaPercentUsed: number;
  nteAmountCents: number;
  actualCostCents?: number;
  createdDate: string;
  description: string;
  checklist?: { id: string; label: string; checked: boolean }[];
  timeEntriesMinutes?: number;
  photoEvidenceUrls?: string[];
}

export interface ServiceRequest {
  id: string;
  number: string;
  propertyId: string;
  propertyName: string;
  lotId?: string;
  source: 'resident_portal' | 'phone' | 'email' | 'iot_sensor';
  category: string;
  description: string;
  requesterName: string;
  requesterPhone: string;
  status: 'new' | 'triaged' | 'converted' | 'duplicate' | 'rejected';
  createdDate: string;
  photos?: string[];
}

export interface MaintenancePlan {
  id: string;
  propertyId: string;
  propertyName: string;
  name: string;
  targetAssetType: string;
  rrule: string; // e.g. FREQ=MONTHLY;BYMONTHDAY=1
  leadDays: number;
  durationHours: number;
  trade: string;
  assigneeName: string;
  priority: WOPriority;
  statutory: boolean;
  next5Dates: string[];
  status: 'active' | 'paused';
}

export interface AssetLifecyclePlanLine {
  id: string;
  year: number;
  propertyId: string;
  propertyName: string;
  assetId: string;
  assetName: string;
  action: 'replace' | 'overhaul' | 'upgrade';
  costCents: number;
  priority: 'mandatory' | 'recommended' | 'optional';
}

export interface Technician {
  id: string;
  name: string;
  trade: string;
  phone?: string;
  status: 'available' | 'busy' | 'off_duty';
  activeWOId?: string;
}

export interface SLAPolicy {
  id: string;
  name: string;
  priority: WOPriority;
  responseMinutes: number;
  resolutionMinutes: number;
  businessHoursOnly: boolean;
}
