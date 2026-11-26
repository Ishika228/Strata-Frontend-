# Information Architecture

Evidence: module tiles (EV-041), FM capability tiles (EV-008/W08), Community app sections (EV-034..037, OBSERVED). Staff IA of Urbanise is UNKNOWN → POC design.

## Applications
| App | URL | Users | Product |
|---|---|---|---|
| Staff console | `/app` | tenant staff | Strata and/or FM by license |
| Owner portal (PWA) | `/portal` | owners, committee, occupiers | Strata |
| Field app (PWA) | `/field` | technicians, contractors | FM (+ strata WOs for contractors) |
| FM customer portal | `/fm-portal` | fm_client | FM |
| Public pay link | `/pay/{token}` | owners | Strata |

## Staff console tree
```
Home
Strata
 ├ Dashboard
 ├ Schemes ─ Scheme ▸ Overview | Lots | Contacts/Roll | Funds & Budget | Levies | Ledger | Arrears | Invoices | Works | Meetings | Insurance & Compliance | Documents | Tasks | Timeline
 ├ Levies (runs)
 ├ Receipts
 ├ Banking & Reconciliation
 ├ Arrears
 ├ Invoices (AP) & Payment batches
 ├ Works (Quotes & WOs)
 ├ Meetings
 ├ Comms
 ├ Reports
 └ Ledger (GL, journals, periods)
FM
 ├ Ops Centre
 ├ Requests (triage)
 ├ Work orders
 ├ Dispatch
 ├ Planner (52-week)
 ├ PPM plans
 ├ Assets ─ Asset ▸ Details | Work history | Plans | Documents
 ├ Lifecycle planning
 ├ Properties & locations
 ├ Analytics
 └ Contacts (CRM)
Common
 ├ Suppliers & compliance
 └ Approvals
Tasks · Documents · Search (⌘K) · Assistant (⌘J) · Notifications
Settings: Users & roles · SSO · Branding · Thresholds · Arrears policies · SLA & calendars · Templates · Imports · Integrations & webhooks · AI · Audit log
```
Menu items render only when the tenant licenses the product **and** the user has a permission in that area.

## Owner portal tabs (mirrors observed app sections)
Home · Ledger/Pay · Requests · Documents · Community · Meetings · More (contacts, committee wall, approvals, profile).

## Field app
Today · Upcoming · Job ▸ (details, checklist, photos, time, complete) · Capture asset · Compliance (contractors) · Sync status.
