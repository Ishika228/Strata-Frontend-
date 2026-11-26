# Project Model for Plane (derived from docs/00–15)

Source of truth: the 121 files in `docs/`. This model is what the Plane backlog ([backlog.json](backlog.json)) was built from. Classification labels follow the evidence register: **CONFIRMED** (Urbanise publicly states it), **OBSERVED** (seen in public screenshot/sample output), **INFERRED**, **PROPOSED** (our independent POC design), **UNKNOWN**, **CONFLICTED**.

> What the research confirms (a capability exists publicly) is never presented as how Urbanise builds it. Every implementation choice in Plane is PROPOSED.

## 1. Products & platform
| Product | Scope in docs | Evidence |
|---|---|---|
| Vertex Strata | Scheme register, budgets & funds, levies, payments, bank reconciliation, trust ledger, arrears & debt recovery, supplier invoices & approvals, procurement, meetings & voting, comms, owner portal, community wall, insurance & compliance, reports | CONFIRMED capabilities (EV-020..060); OBSERVED report/screens (EV-025, 028, 038..040) |
| Vertex FM | Regions/properties/locations, asset register, 10-yr lifecycle, PPM + 52-week planner, service requests, work orders, SLA, workforce/mobile, suppliers & compliance gate, client approvals, inspections, Ops Centre, analytics, CRM | CONFIRMED (EV-070..099) |
| Shared platform | Tenancy, identity/SSO, RBAC, documents, notifications, audit, search, tasks, imports, API/webhooks, approvals, outbox, AI gateway | CONFIRMED where evidenced (EV-001..014), otherwise PROPOSED |

Note: "Contracts" (FM contract management) appears in the planning prompt but is **not defined in the docs** — no epic was created for it.

## 2. Domains → Plane modules
| Plane module | Domains (docs folder) | Classification |
|---|---|---|
| M01 Foundation & Platform | Monorepo, compose, API core, outbox, scheduler, audit writer (05, 13, 15) | PROPOSED |
| M02 Identity, Tenancy & Access | Tenants, users, Keycloak/OIDC, SSO, RBAC, tenant isolation (04) | SSO CONFIRMED (EV-006); design PROPOSED |
| M03 Strata | 03-strata, strata WFs 03–14, 27 | CONFIRMED/OBSERVED capabilities; rules PROPOSED ⚖ |
| M04 FM | 03-fm, WFs 15–22 | CONFIRMED capabilities; SLA/lifecycle methods PROPOSED |
| M05 Workflow, Documents & Notifications | Documents, notifications, approvals, tasks, search (04 COMMON_SERVICES) | CONFIRMED capabilities; PROPOSED design |
| M06 AI & Intelligence | 09-ai | Urbanise AI CONFLICTED (C-01) / UNKNOWN (EV-118); POC AI PROPOSED |
| M07 Integrations | 10-integrations (all mocks) | Capability CONFIRMED; protocols UNKNOWN |
| M08 Reporting & Analytics | 11-reporting | Aged debtors OBSERVED; KPIs PROPOSED |
| M09 Frontend & UX | 08-ux, portal/field PWAs | Staff UI UNKNOWN; portal screens partly OBSERVED |
| M10 Security & Compliance | 05 SECURITY_ARCHITECTURE, 12 SECURITY_TESTS | PROPOSED (ISO 27001/AWS claims CONFIRMED only as claims) |
| M11 Testing, Validation & Demo | 12-testing, 15 UAT/DEMO/ACCEPTANCE | PROPOSED |
| M12 DevOps & Deployment | 13-devops | PROPOSED |

## 3. Classification of key items (summary)
| Item | Class | Handling in Plane |
|---|---|---|
| Budget-driven automatic levies, multi-level arrears, LevyCollect handoff | CONFIRMED | Built (thin) Day 2–4 |
| Aged Debtors layout; fund tiles; levy ledger with penalties; committee invoice approval | OBSERVED | Built, used as acceptance criteria |
| Levy apportionment/rounding, penalties, discounts, allocation order, arrears thresholds, voting rules | UNKNOWN → PROPOSED defaults ⚖ | Implemented as configurable defaults **plus** `Decision Required` items (D-01..D-06) |
| Bank/payment/collections/resident-app protocols | UNKNOWN | Mocks only; decisions D-07..D-09 |
| SLA definitions, lifecycle benchmarks, compliance types | UNKNOWN → PROPOSED | Defaults + D-10..D-12 |
| Native Urbanise AI status; owner-portal identity; FM app split; voting ownership | CONFLICTED (C-01, C-04, C-05, C-11) | D-13 (PO sign-off), POC design choice recorded |
| Internal architecture (DB, services, queues, AI model) | UNKNOWN | Never in Plane as fact; POC design items say PROPOSED |
| Product access / staff UI screenshots | Missing (G-02, G-03) | D-14 external blocker |

## 4. Scale reality check
- Documented build plan: 14 slices ≈ **26 team-weeks** for one team (15-build/BUILD_ORDER).
- Available: 4 developers × 4 build days ≈ **104 productive hours** (6.5 h/dev/day) + Day 5 validation.
- Therefore the 5-day plan builds a **thin, demo-path vertical slice** ("Demo Lite") covering every layer, and everything else is explicitly **POST-DAY-5 / FUTURE** in Plane. Nothing is marked Done.

## 5. Demo Lite (Day 5) — subset of 15-build/DEMO_SCRIPT
Steps kept: 1 (login, strata dashboard), 2 (scheme, lots, funds — without ⌘K search & insurance), 3 (budget → levy preview → approve), 4 (levy run with pay link), 5 (owner pays via mock), 6 (bank import, auto-match), 7 (arrears levels, referral to mock), 8–10 thin (invoice coded manually → committee approval on phone → batch to mock bank), 11 (Aged Debtors PDF), 14 (AI assistant with citations + confirmed task proposal), 15–18 (mock resident request → triage → compliance gate → technician PWA completion with photo → status back), 19 (variation approval), 20 (52-week planner + 10-yr CAPEX), 23 (audit + tenant isolation).
Steps deferred: 2a wall, 7a procurement, 12 AGM/voting, 13 campaign, 14a AI drafts, 20a inspections, 20b CRM, 21 full analytics (Ops Centre + basic cost chart kept), Appendix A import wizard.
