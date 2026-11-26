import { z } from 'zod';

export const propertySchema = z.object({
  code: z.string().min(2, 'Site code is required'),
  name: z.string().min(2, 'Property name is required'),
  address: z.string().min(5, 'Full street address is required'),
  region: z.string().min(2, 'Region is required'),
  client: z.string().min(2, 'Client organisation is required'),
});

export const serviceRequestSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  location: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Please provide at least 10 characters describing the issue'),
  requesterName: z.string().min(2, 'Requester name is required'),
  requesterPhone: z.string().min(8, 'Phone number is required'),
  accessConsent: z.boolean().default(true),
  photos: z.array(z.string()).max(5, 'Maximum 5 photos allowed').optional(),
});

export const workOrderSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  assetId: z.string().optional(),
  priority: z.enum(['P1', 'P2', 'P3', 'P4']),
  category: z.string().min(1, 'Category is required'),
  assigneeType: z.enum(['technician', 'contractor']),
  assigneeId: z.string().min(1, 'Assignee is required'),
  nteAmountCents: z.number().min(0, 'NTE must be >= 0'),
  description: z.string().min(5, 'Description is required'),
});

export const assetSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  locationId: z.string().min(1, 'Location is required'),
  type: z.enum(['HVAC', 'Lift', 'Fire Safety', 'Electrical', 'Plumbing', 'Security']),
  code: z.string().min(2, 'Asset code is required and must be unique'),
  name: z.string().min(2, 'Asset name is required'),
  make: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor', 'critical']),
  criticality: z.enum(['low', 'medium', 'high', 'critical']),
  installDate: z.string().min(1, 'Install date is required'),
  warrantyExpiry: z.string().min(1, 'Warranty expiry date is required'),
  replacementCostCents: z.number().min(0, 'Replacement cost must be >= 0'),
});

export const maintenancePlanSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  name: z.string().min(3, 'Plan name is required'),
  targetAssetType: z.string().min(1, 'Target asset type is required'),
  rrule: z.string().min(5, 'Recurrence rule (RRULE) is required'),
  leadDays: z.number().int().min(1).default(7),
  durationHours: z.number().min(0.5),
  trade: z.string().min(2, 'Trade is required'),
  assigneeName: z.string().min(2, 'Assignee is required'),
  priority: z.enum(['P1', 'P2', 'P3', 'P4']),
  statutory: z.boolean().default(false),
});

export const approvalDecisionSchema = z.object({
  approvalId: z.string().min(1, 'Approval ID is required'),
  decision: z.enum(['approved', 'rejected']),
  comment: z.string().optional(),
});
