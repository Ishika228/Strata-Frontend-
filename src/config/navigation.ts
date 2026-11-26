import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Layers,
  ShieldCheck,
  CreditCard,
  BookOpen,
  Receipt,
  DollarSign,
  Landmark,
  AlertTriangle,
  FileCheck,
  FileText,
  Briefcase,
  Wrench,
  Users,
  Calendar,
  MessageSquare,
  Send,
  Home,
  Bell,
  BarChart3,
  Settings,
  Shield,
} from 'lucide-react';

export interface SubModuleItem {
  name: string;
  to: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export interface PrimaryModule {
  id: string;
  name: string;
  sidebarLabel?: string;
  defaultTo: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  subModules?: SubModuleItem[];
}

export const PRIMARY_MODULES: PrimaryModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    sidebarLabel: 'Dashboard',
    defaultTo: '/app/fm/dashboard',
    icon: LayoutDashboard,
    description: 'Executive strata portfolio overview, trust fund balances, collection rate, and urgent action items.',
  },
  {
    id: 'property-management',
    name: 'Property Management',
    sidebarLabel: 'Properties',
    defaultTo: '/app/property/schemes',
    icon: Building2,
    description: 'Manage schemes, statutory strata roll, lot entitlements, and building insurance compliance.',
    subModules: [
      { name: 'Schemes', to: '/app/property/schemes', icon: Building2 },
      { name: 'Strata Roll & Lots', to: '/app/property/roll', icon: Layers },
      { name: 'Insurance & Compliance', to: '/app/property/compliance', icon: ShieldCheck },
    ],
  },
  {
    id: 'financial-management',
    name: 'Financial Management',
    sidebarLabel: 'Financials',
    defaultTo: '/app/finance/budgets',
    icon: CreditCard,
    description: 'Statutory trust accounting, budgets, levy runs, banking reconciliation, arrears, and accounts payable.',
    subModules: [
      { name: 'Budgets & Funds', to: '/app/finance/budgets', icon: BookOpen },
      { name: 'Levy Schedules & Runs', to: '/app/finance/levies', icon: Receipt },
      { name: 'Receipts & Payments', to: '/app/finance/receipts', icon: DollarSign },
      { name: 'Bank Reconciliation', to: '/app/finance/bank-rec', icon: Landmark },
      { name: 'Arrears & Recovery', to: '/app/finance/arrears', icon: AlertTriangle },
      { name: 'Invoices & AP', to: '/app/finance/invoices', icon: FileCheck },
      { name: 'Trust General Ledger', to: '/app/finance/gl', icon: FileText },
    ],
  },
  {
    id: 'operations-management',
    name: 'Operations & Management',
    sidebarLabel: 'Operations',
    defaultTo: '/app/operations/works',
    icon: Briefcase,
    description: 'Procurement quotes, work orders, approved contractor network, and formal meetings with digital voting.',
    subModules: [
      { name: 'Works & Procurement', to: '/app/operations/works', icon: Wrench },
      { name: 'Suppliers & Trades', to: '/app/operations/suppliers', icon: Users },
      { name: 'Meetings & Voting', to: '/app/operations/meetings', icon: Calendar },
    ],
  },
  {
    id: 'communication-engagement',
    name: 'Communication & Engagement',
    sidebarLabel: 'Communications',
    defaultTo: '/app/communication/comms',
    icon: MessageSquare,
    description: 'Audience broadcasts, interactive resident & owner portal, and automated compliance notifications.',
    subModules: [
      { name: 'Communications', to: '/app/communication/comms', icon: Send },
      { name: 'Owner Portal PWA', to: '/app/communication/portal', icon: Home },
    ],
  },
  {
    id: 'reports-statements',
    name: 'Reports & Statements',
    sidebarLabel: 'Reports',
    defaultTo: '/app/reports/statements',
    icon: BarChart3,
    description: 'Statutory aged debtors reports, fund balance sheets, income & expenditure, and roll registers.',
    subModules: [
      { name: 'All Statements', to: '/app/reports/statements', icon: BarChart3 },
      { name: 'Aged Debtors (RPT-ST-01)', to: '/app/reports/statements?tab=debtors', icon: FileText },
      { name: 'Fund Balance Sheet', to: '/app/reports/statements?tab=balance', icon: Landmark },
      { name: 'Income & Expenditure', to: '/app/reports/statements?tab=income', icon: DollarSign },
      { name: 'Strata Roll Ledger', to: '/app/reports/statements?tab=roll', icon: Layers },
    ],
  },
];

// Separate Option 1: Users & Roles
export const USERS_MODULE: PrimaryModule = {
  id: 'users-module',
  name: 'Users & Roles',
  sidebarLabel: 'Users & Roles',
  defaultTo: '/app/users',
  icon: Users,
  description: 'Manage staff administrators, strata portfolio managers, committee member logins, and RBAC roles.',
  subModules: [
    { name: 'All Users', to: '/app/users', icon: Users },
    { name: 'Staff & Managers', to: '/app/users?filter=staff', icon: Shield },
    { name: 'Committee Members', to: '/app/users?filter=committee', icon: Users },
  ],
};

// Separate Option 2: Settings (with fully interactive sub-module tabs)
export const SETTINGS_MODULE: PrimaryModule = {
  id: 'settings-module',
  name: 'Settings',
  sidebarLabel: 'Settings',
  defaultTo: '/app/settings/rules',
  icon: Settings,
  description: 'Configure statutory interest rules (10% p.a.), state jurisdictions, and electronic banking feeds.',
  subModules: [
    { name: 'Statutory Rules', to: '/app/settings/rules', icon: Settings },
    { name: 'Jurisdictions', to: '/app/settings/jurisdictions', icon: Building2 },
    { name: 'Banking Feeds', to: '/app/settings/banking', icon: Landmark },
    { name: 'GST & Compliance', to: '/app/settings/gst', icon: ShieldCheck },
  ],
};

/**
 * Helper to identify which primary module is active for any given pathname
 */
export function getActivePrimaryModule(pathname: string): PrimaryModule | undefined {
  // Check users module
  if (pathname.includes('/users')) {
    return USERS_MODULE;
  }

  // Check settings module
  if (pathname.includes('/settings')) {
    return SETTINGS_MODULE;
  }

  // Check exact or sub-module match in PRIMARY_MODULES
  for (const mod of PRIMARY_MODULES) {
    if (mod.subModules) {
      const match = mod.subModules.some(
        (sub) => pathname === sub.to || pathname.startsWith(`${sub.to}/`)
      );
      if (match) return mod;
    }
    // Check default / root match
    if (pathname === mod.defaultTo || pathname.startsWith(`${mod.defaultTo}/`)) {
      return mod;
    }
  }

  // Pathname prefix fallbacks
  if (pathname.includes('/property') || pathname.includes('/properties') || pathname.includes('/assets')) {
    return PRIMARY_MODULES.find((m) => m.id === 'property-management');
  }
  if (
    pathname.includes('/finance') ||
    pathname.includes('/work-orders') ||
    pathname.includes('/requests') ||
    pathname.includes('/planner') ||
    pathname.includes('/inspections') ||
    pathname.includes('/ops-centre')
  ) {
    return PRIMARY_MODULES.find((m) => m.id === 'financial-management');
  }
  if (
    pathname.includes('/operations') ||
    pathname.includes('/suppliers') ||
    pathname.includes('/contacts') ||
    pathname.includes('/dispatch') ||
    pathname.includes('/approvals')
  ) {
    return PRIMARY_MODULES.find((m) => m.id === 'operations-management');
  }
  if (
    pathname.includes('/communication') ||
    pathname.includes('/field') ||
    pathname.includes('/owner-portal') ||
    pathname.includes('/fm-portal')
  ) {
    return PRIMARY_MODULES.find((m) => m.id === 'communication-engagement');
  }
  if (pathname.includes('/reports') || pathname.includes('/sla')) {
    return PRIMARY_MODULES.find((m) => m.id === 'reports-statements');
  }

  return PRIMARY_MODULES[0];
}
