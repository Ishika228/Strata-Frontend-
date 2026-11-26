# Component Library (POC)

Built on Radix UI primitives + Tailwind tokens; documented in Storybook (`packages/ui`). All components keyboard-accessible, WCAG 2.2 AA contrast, light/dark themes, tenant brand colour token `--brand`.

| Component | Use | Notes |
|---|---|---|
| AppShell, Sidebar, TopBar, Breadcrumbs | Layout | Responsive; sidebar collapses < 1024 px |
| DataTable | All lists (see TABLES.md) | Server-side sort/filter/cursor; column chooser; row actions; bulk select |
| FilterBar | Lists | Chips, saved views |
| EntityHeader | Detail pages | Title, status badge, key facts, primary actions |
| StatusBadge | States | Colour by state family (draft gray, active blue, warning amber, done green, error red) |
| MoneyText / MoneyInput | Money | Cents ↔ display; tenant currency; negative in parentheses for ledgers |
| DateRangePicker, RRuleBuilder | Dates, PPM | Timezone-aware |
| KPI Tile, ChartCard (Recharts) | Dashboards | Accessible tables behind charts |
| LedgerTable | Lot/GL ledgers | Running balance, DR/CR, fund tag, penalty highlight |
| MatchPane | Bank rec | Two-pane with suggestion score |
| ApprovalCard | Approvals | Amount, budget remaining bar, approve/reject with comment |
| SLAClock | WOs | Countdown, at-risk amber at 80%, breached red |
| Timeline | Audit/notes/events | Infinite scroll |
| DocumentUploader | Uploads | Hash calc client-side, progress, scan status |
| PhotoCapture | Field app | Camera, compress ≤ 2 MB, GPS stamp |
| OfflineBanner / SyncQueue | PWA | Pending event count, retry |
| CitationChip / SourcePanel | AI | Opens doc at page or record |
| ActionProposalCard | AI | Shows exact action + args; Confirm/Discard |
| EmptyState, ErrorState, Skeleton | UX states | See UX_STATES |
| ConfirmDialog with typed confirmation | Destructive/financial | e.g. type "LOCK" to lock rec |
| StepUpMFADialog | Sensitive ops | Bank details, batch submit, period close |
