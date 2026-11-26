# Vertex FM — Facilities Management Enterprise Frontend

A modern, high-performance, keyboard-accessible Enterprise Frontend built on **React 18 + Vite + TypeScript + Tailwind CSS** following the strict specifications for Facilities Management (FM).

---

## 🏛️ System Architecture & Applications

| Application | Canonical Route | Target Audience | Features / Capabilities |
|---|---|---|---|
| **Staff Console** | `/app` | FM Managers, FM Coordinators, Facility Administrators | Live Operations Centre, Work Order management, Helpdesk Triage, Dispatch Board, Asset Register & 10-Yr CAPEX Lifecycle, PPM & 52-Week Planner, Contractor Compliance, FM Analytics, and AI Copilot drawer (`⌘J`). |
| **Field Tech App (PWA)** | `/field` | Field Technicians, Trade Contractors | Mobile PWA with offline caching banner, GPS location stamping, canvas image compression (≤ 2MB), safety checklists, and time tracking. |
| **FM Customer Portal** | `/fm-portal` | Corporate FM Clients & Facility Custodians | SLA performance scorecards, live maintenance request tracking, variation approvals, and property spend dashboards. |

---

## 📂 Directory Structure

```
FM_Frontend/
├── index.html                      # HTML5 entry with Inter & JetBrains Mono typography
├── package.json                    # Scripts and dependencies (React 18, Vite, Lucide, Recharts, Zod)
├── tailwind.config.js              # Custom Tailwind configuration with --brand tokens
├── tsconfig.json                   # Strict TypeScript compiler options with @/* paths
│
└── src/
    ├── index.css                   # Tailwind tokens, --brand variables, dark theme variables
    ├── main.tsx                    # React application bootstrap
    ├── App.tsx                     # Global multi-app router & provider hierarchy
    │
    ├── context/                    # React Contexts
    │   ├── TenantContext.tsx       # Tenant switcher, brand color token `--brand`, active property context
    │   ├── AuthContext.tsx         # User authentication & FM RBAC roles (`fm_mgr`, `fm_coord`, `technician`, etc.)
    │   └── AIAssistantContext.tsx  # Global FM AI Copilot drawer (`⌘J`), streaming chat, citation chips
    │
    ├── types/                      # Type definitions matching backend models & specs
    │   ├── fm.ts                   # Property, Asset, WorkOrder, ServiceRequest, MaintenancePlan, Technician, SLAPolicy
    │   ├── common.ts               # Supplier, ComplianceRecord, Approval, AuditEvent, NotificationItem, SyncQueueItem
    │   └── ai.ts                   # AICitation, AIActionProposal, AIMessage, AISettings
    │
    ├── lib/                        # Business logic & utilities
    │   ├── utils.ts                # cn, formatCurrency, formatDate
    │   ├── validation.ts           # Zod schemas (Property, ServiceRequest, WorkOrder, Asset, MaintenancePlan)
    │   └── mockData.ts             # Rich realistic Facilities Management dataset
    │
    ├── components/
    │   ├── ui/                     # Reusable Component Library
    │   │   ├── StatusBadge.tsx     # Color-coded state badges (draft, active, warning, done, error)
    │   │   ├── MoneyText.tsx       # Formatted currency text
    │   │   ├── DataTable.tsx       # Sortable, filterable, column chooser, CSV export, bulk actions
    │   │   ├── FilterBar.tsx       # Filter chips, saved views tabs, search input (`/` focus)
    │   │   ├── KPITile.tsx         # Metric KPI cards with trends and accessible table fallback
    │   │   ├── ChartCard.tsx       # Recharts container with interactive accessible table toggle
    │   │   ├── SLAClock.tsx        # Live countdown timer with at-risk amber (80%) and breached red
    │   │   ├── Timeline.tsx        # Immutable audit trail & history stream
    │   │   ├── DocumentUploader.tsx# Client SHA-256 hash calculation, progress bar & antivirus scan status
    │   │   ├── PhotoCapture.tsx    # Mobile camera capture with canvas compression (≤ 2MB) & GPS stamping
    │   │   ├── OfflineBanner.tsx   # PWA offline detection banner & pending sync event queue
    │   │   ├── CitationChip.tsx    # AI citation chips with source document preview drawer
    │   │   ├── ActionProposalCard.tsx # AI proposal cards with Confirm & Discard execution
    │   │   ├── ConfirmDialog.tsx   # Confirmation modal
    │   │   ├── StepUpMFADialog.tsx # Sensitive operations modal for 6-digit authenticator verification
    │   │   └── RRuleBuilder.tsx    # iCalendar RFC 5545 recurrence rule builder with next 5 dates preview
    │   │
    │   └── layout/                 # Layout Shells
    │       ├── AppShell.tsx        # Responsive staff shell (collapses < 1024px) with TopBar & Sidebar
    │       ├── Sidebar.tsx         # FM Navigation tree (Operations, Properties & Assets, Analytics, Settings)
    │       ├── TopBar.tsx          # Property context carry-over chip, ⌘K search, ⌘J AI, role switcher
    │       ├── GlobalSearchModal.tsx # Command palette modal (`⌘K` / `Ctrl+K`)
    │       ├── AssistantDrawer.tsx # AI Copilot right drawer (`⌘J` / `Ctrl+J`)
    │       ├── NotificationCentre.tsx # Alert dropdown popover
    │       └── FieldLayout.tsx     # Technician Field shell with top offline banner and action tabs
    │
    └── features/                   # Screen Inventory Implementation
        ├── fm/                     # Facilities Management Screens
        │   ├── FMDashboard.tsx     # Executive FM Dashboard: Hero, KPIs, Asset Health, Maintenance Velocity
        │   ├── OpsCentre.tsx       # SCR-201: Live operations centre with 60s auto refresh cadence
        │   ├── WorkOrdersList.tsx  # SCR-210: Corrective & planned work orders register with live SLAClock
        │   ├── WorkOrderDetail.tsx # SCR-211: WO detail with live SLAClock, checklist, costs & evidence
        │   ├── DispatchBoard.tsx   # SCR-212: Resource timeline & technician assignment
        │   ├── TriageQueue.tsx     # SCR-209 & UF-10: Helpdesk request triage & priority conversion
        │   ├── AssetRegister.tsx   # SCR-204/205: Asset 360° register with QR code label printing
        │   ├── LifecyclePlanner.tsx# SCR-206 & UF-13: 10-year CAPEX forecast matrix with escalation rate
        │   ├── PPMPlans.tsx        # SCR-207/208 & UF-11: Recurrence builder & 52-week workload heatmap
        │   ├── PropertiesList.tsx  # SCR-202/203: Properties list & hierarchical location tree
        │   ├── FMAnalytics.tsx     # SCR-216: Maintenance spend trends & contractor SLA scorecards
        │   ├── CRMContacts.tsx     # SCR-217: FM directory & contact management
        │   ├── SuppliersList.tsx   # SCR-113: Verified trade contractor register & compliance badges
        │   └── FMApprovals.tsx     # SCR-215: NTE variation & quote approvals
        │
        ├── field/                  # Field Technician App (PWA)
        │   ├── FieldJobList.tsx    # SCR-251: Today's scheduled work orders with offline status badge
        │   ├── FieldJobExecution.tsx # SCR-252: Big-button job flow, checklist, time & photo capture
        │   └── FieldAssetCapture.tsx # SCR-253: Camera-first asset audit with GPS stamp
        │
        ├── external/               # Corporate Client Portal
        │   └── FMCustomerPortal.tsx# SCR-261: Branded corporate client portal
        │
        └── settings/               # System Governance
            ├── AISettings.tsx      # SCR-304: AI token costs, draft acceptance %, and budget limits
            ├── UsersAndRoles.tsx   # SCR-003: Staff user management & role scoping
            ├── AuditLogViewer.tsx  # SCR-004: Immutable audit trail with diff viewer
            └── ImportWizard.tsx    # SCR-008: Data import stepper with dry-run validation
```

---

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Run TypeScript type check and production build
npm run build

# Preview production build locally
npm run preview
```

The application runs at `http://localhost:3000` (or the port allocated by Vite).

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open Global Command Palette Search across properties, assets, work orders, and contractors |
| `⌘J` / `Ctrl+J` | Open Vertex FM AI Copilot Drawer with live streaming, citation chips, and proposals |
| `/` | Focus search filter bar in any DataTable |
