# Demo Script (≈ 45 min)

Environment: demo, seed `demo`. Every step lists the evidence it reflects (public capability) — the implementation is independent.

| # | Persona | Action | Shows | Evidence |
|---|---|---|---|---|
| 1 | Maya (strata_manager) | SSO login; Strata dashboard | KPI tiles, arrears by bucket, paid-in-full % | EV-006, EV-031, EV-059 |
| 2 | Maya | ⌘K search "Harbour" → open Harbour View → lots, roll, funds, insurance tab (renewal task for policy expiring in 55 days) | Search, scheme structure, two funds, portal live, insurance register | EV-029, EV-032, EV-038, EV-054 |
| 2a | Owner2 (phone) | Community wall: read & post a notice | Community wall | EV-036 |
| 3 | Sam (accountant) | Garden Terrace budget → levy preview → approve | Budget-driven levies, exact apportionment | EV-020 |
| 4 | Sam | Run levy for next quarter (Harbour View) | Notices with pay link & CRN; emails in Mailpit | EV-021, EV-050 |
| 5 | Owner4 (phone) | Open notice link → pay (mock) → portal ledger | Live ledger update | EV-034, EV-039 |
| 6 | Sam | Import bank statement → auto-match → resolve → lock | Automated reconciliation | EV-042, EV-051 |
| 7 | Maya | Arrears console → lot 11 L3 → refer to collections (mock) | Multi-level arrears, debt referral | EV-024, EV-026 |
| 7a | Maya | Roof repair quote request: compare 2 quotes → accept → strata WO issued | Procurement & quote comparison | EV-053 |
| 8 | Sam | Upload roof invoice → AI extraction → code → route to committee | Invoice processing | EV-044, EV-111 |
| 9 | Owner1 (committee, phone) | Approve invoice with budget remaining | Committee mobile approval | EV-040 |
| 10 | Sam | Payment batch → submit (MFA) | Payables from platform | EV-052 |
| 11 | Maya | Aged Debtors PDF; schedule monthly email | Report & scheduling | EV-027, EV-028 |
| 12 | Maya | AGM: motions, owners vote, close, minutes published | Meetings & voting | EV-045, EV-046 |
| 13 | Maya | Comms campaign to Block A owners, test send, send | Comms module | EV-047 |
| 14 | Maya | Assistant: "Which Harbour View lots are at level 2 and what do they owe?" then "What do the by-laws say about pets?" → create follow-up task (confirm) | AI with citations & human confirmation | EV-110, EV-113, EV-114 |
| 14a | Maya | Paste an owner's email "What do I owe?" → AI draft reply → edit → send manually | Human-in-loop drafting | EV-113 |
| 15 | Resident (mock resident app) | Submit leaking tap request with photo | Resident app integration | EV-086 |
| 16 | Carl (coordinator) | Ops Centre → triage P2 (warranty flag) → try assign Roofline (blocked) → assign Tom | Ops Centre, SLA, compliance gate | EV-071, EV-078, EV-091 |
| 17 | Tom (phone, offline) | Accept, check-in, photos, complete; go online, sync | Workforce app, evidence | EV-081, EV-085 |
| 18 | Resident app mock | Shows completed with photo & timestamp | Real-time status back | EV-086 |
| 19 | Carl | WO with variation > NTE → client approves in portal | Client approvals | EV-090 |
| 20 | Fiona (fm_manager) | 52-week planner; PPM; 10-year CAPEX plan → PDF | Planning & lifecycle | EV-073, EV-075 |
| 20a | Tara (technician) | Statutory fire inspection WO: checklist with one failed item → follow-up WO auto-created | Compliance schedules & inspections | EV-076 |
| 20b | Carl | Open requester contact → history tab | CRM history | EV-080 |
| 21 | Fiona | FM analytics: cost by property, supplier performance, asset failures | Analytics | EV-079 |
| 22 | Fiona | Assistant: "Which WOs will breach SLA today?" | FM AI tools | EV-079 |
| 23 | Admin | Audit trail of WO & invoice; switch to tenant T2 user → cannot see T1 | Audit, isolation | EV-013 |

Appendix A (optional, admin): data import wizard (UF-16) with a lots template containing 2 bad rows. Evidence EV-009.

Reset: `pnpm seed --reset demo` (≈ 2 min).
