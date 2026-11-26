# Plane Backlog — Vertex Strata + Vertex FM

Generated from [backlog.json](backlog.json) by `tools/render_backlog.py`. Do not edit by hand; edit the JSON and re-render.

States are honest: Day 1 items `Todo`, later items `Backlog`, nothing `Done`. `D-xx` = Decision Required (label `BLOCKED / UNKNOWN`). `FX-xx` = POST-DAY-5.

## Cycles

| Cycle | Dates | Goal |
|---|---|---|
| Day 1 — Foundation | 2026-11-24 → 2026-11-24 | Runnable monorepo; tenant-aware, authenticated, RBAC-guarded API; baseline schema with RLS; web shell login. |
| Day 2 — Core Domains | 2026-11-25 → 2026-11-25 | Strata register & ledger, FM assets & suppliers, documents, isolation tests, UI kit, mocks. |
| Day 3 — Product Experience | 2026-11-26 → 2026-11-26 | Levies, payments & bank rec; work orders, SLA, PPM; notifications & approvals; AI gateway; Strata & FM screens. |
| Day 4 — Integration & Hardening | 2026-11-27 → 2026-11-27 | Arrears, invoices, aged debtors, client approvals, Ops Centre, lifecycle, RAG, portal, security hardening, E2E, demo env. |
| Day 5 — Validation & Demo | 2026-11-30 → 2026-11-30 | Validation, regression, gap closure, Release Readiness / Demo Gate. |

## Capacity (hours planned vs 6.5 h/dev/day)

| Lane | D1 | D2 | D3 | D4 | D5 | Total D1–D4 |
|---|---|---|---|---|---|---|
| DEV1 — Platform / Backend / Security + AI backend | **7** ⚠ | 6.5 | 6.5 | 6.5 | 4.5 | 26.5 |
| DEV2 — Strata domain + baseline schema | **7** ⚠ | 6.5 | **7** ⚠ | 6.5 | 6 | 27 |
| DEV3 — FM domain + shared suppliers/compliance + async infrastructure | 6.5 | 6.5 | 6.5 | 6 | 4.5 | 25.5 |
| DEV4 — Repo/CI, Frontend, PWAs, Mocks, E2E, Demo environment | **7** ⚠ | 6.5 | **7** ⚠ | 6.5 | 3 | 27 |

## Critical path (longest dependency chain by estimated hours)

VX-001 (DEV4, D1, 4h) → VX-002 (DEV2, D1, 4h) → VX-006 (DEV3, D1, 4h) → VX-021 (DEV2, D2, 3.5h) → VX-022 (DEV2, D2, 3h) → VX-024 (DEV2, D3, 3.5h) → VX-065 (DEV4, D4, 2.5h) → VX-067 (DEV4, D4, 1.5h) → VX-090 (DEV4, D5, 2h) → VX-095 (DEV2, D5, 4h) → VX-099 (DEV1, D5, 1h)

Total: **33 h**.

## Epics

| Epic | Module | Evidence | Summary |
|---|---|---|---|
| EP-01 EPIC: Platform Foundation | 01 · Foundation & Platform | PROPOSED | Runnable monorepo, API core, outbox, scheduler, audit. Docs: 05-architecture/SYSTEM_ARCHITECTURE, ADR-001..016, 15-build/IMPLEMENTATION_GUIDE. |
| EP-02 EPIC: Identity, Tenancy & RBAC | 02 · Identity, Tenancy & Access | PROPOSED | F-SH-01..03. SSO capability CONFIRMED (EV-006); tenancy INFERRED (EV-015). |
| EP-03 EPIC: Strata — Scheme Register & Provisioning | 03 · Strata | CONFIRMED | F-ST-01. EV-029, EV-032, EV-056. WF-03. |
| EP-04 EPIC: Strata — Trust Ledger, Budgets & Levies | 03 · Strata | CONFIRMED | F-ST-02, F-ST-03, F-ST-07. EV-020, 021, 038, 043, 044. WF-04, WF-05. |
| EP-05 EPIC: Strata — Payments & Bank Reconciliation | 03 · Strata | CONFIRMED | F-ST-04, F-ST-05. EV-042, 050, 051. WF-06, WF-07. |
| EP-06 EPIC: Strata — Arrears & Debt Recovery | 03 · Strata | CONFIRMED | F-ST-06. EV-024..026, EV-039. WF-08. |
| EP-07 EPIC: Strata — Supplier Invoices, Procurement & Approvals | 03 · Strata | OBSERVED | F-ST-08, F-ST-09. EV-040 (observed), 042, 044, 052, 053. WF-09, WF-10. |
| EP-08 EPIC: Strata — Meetings, Voting, Comms, Wall & Insurance | 03 · Strata | CONFIRMED | F-ST-10, 11, 13, 14. EV-045..047, 036, 054, 055. WF-11, 12, 27. Largely POST-DAY-5. |
| EP-09 EPIC: Strata — Owner Portal (PWA) | 03 · Strata | OBSERVED | F-ST-12. EV-032..040. WF-13. SCR-151..158. |
| EP-10 EPIC: FM — Properties, Assets & Lifecycle | 04 · FM | CONFIRMED | F-FM-01..03. EV-072, 073, 088, 091, 093. WF-15, WF-22. |
| EP-11 EPIC: FM — Planned Maintenance & 52-week Planner | 04 · FM | CONFIRMED | F-FM-04, F-FM-11. EV-075, 076, 092. WF-16. |
| EP-12 EPIC: FM — Service Requests, Work Orders & SLA | 04 · FM | CONFIRMED | F-FM-05..07, F-FM-10, F-FM-12. EV-071, 083..085, 090, 098. WF-17..19, WF-21. |
| EP-13 EPIC: FM — Workforce & Technician Mobile | 04 · FM | CONFIRMED | F-FM-08. EV-074, 081, 082. WF-18. |
| EP-14 EPIC: Suppliers & Contractor Compliance (shared) | 04 · FM | CONFIRMED | F-FM-09. EV-053, 077, 078. WF-20. BR-FM-07, BR-SUP-01. |
| EP-15 EPIC: Shared Workflow — Documents, Notifications, Approvals, Tasks, Search | 05 · Workflow, Documents & Notifications | CONFIRMED | F-SH-04..08. EV-012..014, 022, 037, 040, 090, 092. |
| EP-16 EPIC: AI Assistant & RAG | 06 · AI & Intelligence | PROPOSED | F-AI-01..06. Urbanise AI status CONFLICTED (C-01); POC design PROPOSED (09-ai). |
| EP-17 EPIC: Integrations & Mock Providers | 07 · Integrations | CONFIRMED | F-IN-01..07. Capabilities CONFIRMED; protocols UNKNOWN; all mocks (10-integrations/MOCK_INTEGRATIONS). |
| EP-18 EPIC: Reporting & Dashboards | 08 · Reporting & Analytics | OBSERVED | F-ST-15, F-FM-12, F-FM-13. RPT-ST-01 OBSERVED (EV-028). |
| EP-19 EPIC: Frontend Shell & Staff UX | 09 · Frontend & UX | PROPOSED | 08-ux. Staff UI of Urbanise UNKNOWN; all layouts PROPOSED. |
| EP-20 EPIC: Security Hardening & Verification | 10 · Security & Compliance | PROPOSED | SECURITY_ARCHITECTURE controls, SEC/RBAC-N/TEN/DOC/AISEC tests. |
| EP-21 EPIC: Testing & Quality | 11 · Testing, Validation & Demo | PROPOSED | 12-testing strategy; tests embedded in every engineering item's AC; cross-module E2E here. |
| EP-22 EPIC: DevOps & Environments | 12 · DevOps & Deployment | PROPOSED | 13-devops: CI, compose, demo environment, migrations, observability. |
| EP-23 EPIC: Day 5 Validation, Demo & Release Gate | 11 · Testing, Validation & Demo | PROPOSED | Validation runs, gap closure, Release Readiness / Demo Gate. 15-build/ACCEPTANCE_CHECKLIST, DEMO_SCRIPT. |
| EP-24 EPIC: Decisions Required & Unknowns | — | UNKNOWN | Items that cannot be implemented confidently from evidence. 00-discovery UNKNOWN_INFORMATION, CONFLICTING_INFORMATION, RESEARCH_GAPS. |

## Schedule by day and developer

### Day 1 — Foundation (2026-11-24)

| Lane | Item | Priority | Est | Depends on |
|---|---|---|---|---|
| DEV1 | VX-003 Implement API core: tenant context, Problem errors, cursor pagination, idempotency, request logging | P0 | 2.5h | VX-001 |
| DEV1 | VX-004 Implement authentication: Keycloak realm, JWT guard, server-side role resolution, /me | P0 | 2.5h | VX-001 |
| DEV1 | VX-005 Implement RBAC permission catalog, @Permission guard and route-coverage test | P0 | 2h | VX-004 |
| DEV2 | VX-002 Apply reference schema baseline with RLS, ledger triggers and grants | P0 | 4h | VX-001 |
| DEV2 | VX-020 Build Strata money & calculation library with property tests (apportionment, CRN, ageing, allocation, penalty) | P0 | 3h | VX-001 |
| DEV3 | VX-006 Implement audit writer (hash chain), transactional outbox, BullMQ relay and Clock-based scheduler | P0 | 4h | VX-002 |
| DEV3 | VX-040 Build FM calculation library: business-time SLA, RRULE occurrences, lifecycle formula, WO state table | P0 | 2.5h | VX-001 |
| DEV4 | VX-001 Bootstrap monorepo, docker-compose stack and CI baseline | P0 | 4h | — |
| DEV4 | VX-060 Implement web app shell with OIDC login, role-aware navigation and generated API client | P0 | 3h | VX-001, VX-004 |
| PO/SME | D-01 Decision Required: Levy apportionment & rounding rules per jurisdiction | P1 | 0h | — |
| PO/SME | D-02 Decision Required: Penalty/interest and early-payment discount rules | P1 | 0h | — |
| PO/SME | D-13 Decision Required: PO sign-off on unresolved conflicts (AI status C-01, owner portal C-04, FM apps C-05, voting C-11) | P1 | 0h | — |
| PO/SME | D-15 Decision Required: Approve LLM & embedding providers, data processing terms, and provide API keys for dev/demo | P0 | 0h | — |

### Day 2 — Core Domains (2026-11-25)

| Lane | Item | Priority | Est | Depends on |
|---|---|---|---|---|
| DEV1 | VX-007 Implement RBAC scope predicates and tenant-isolation / RBAC negative test suites | P0 | 3h | VX-005, VX-002 |
| DEV1 | VX-008 Implement document service: presigned upload, AV scan, type validation, visibility/ACL, signed download | P1 | 3.5h | VX-003, VX-005 |
| DEV2 | VX-021 Implement Strata scheme register and provisioning (schemes, buildings, lots, contacts, ownerships) | P0 | 3.5h | VX-003, VX-005, VX-006 |
| DEV2 | VX-022 Implement trust ledger posting service, period close and trial balance | P0 | 3h | VX-002, VX-021 |
| DEV3 | VX-041 Implement FM properties, location tree, asset types and asset register with demo seed | P0 | 3.5h | VX-003, VX-005, VX-006 |
| DEV3 | VX-042 Implement shared suppliers, compliance records, status computation and assignment gate | P0 | 3h | VX-003, VX-005, VX-008 |
| DEV4 | VX-061 Build UI kit: DataTable, FilterBar, forms, money components, status badges, UX states | P0 | 3h | VX-060 |
| DEV4 | VX-062 Build mock providers: payments, bank, collections, resident app, SMS, LLM; wire Mailpit | P0 | 3.5h | VX-001 |
| PO/SME | D-03 Decision Required: Payment allocation order | P1 | 0h | — |
| PO/SME | D-06 Decision Required: Trust accounting statutory requirements (AU states/NZ) | P1 | 0h | — |
| PO/SME | D-10 Decision Required: FM SLA priority matrix and business calendars | P1 | 0h | — |
| PO/SME | D-12 Decision Required: Required supplier compliance document types and minimum cover | P2 | 0h | — |
| PO/SME | D-16 Decision Required: Demo hosting target (VM/cloud account) and DNS | P1 | 0h | — |

### Day 3 — Product Experience (2026-11-26)

| Lane | Item | Priority | Est | Depends on |
|---|---|---|---|---|
| DEV1 | VX-009 Implement notification dispatcher (email, in-app SSE, SMS mock) with templates, contact preferences and minimal task API | P1 | 2.5h | VX-006, VX-062 |
| DEV1 | VX-010 Implement shared approvals engine (requests, routing by amount/scope, decisions, expiry) | P0 | 1h | VX-005, VX-006 |
| DEV1 | VX-066 Implement AI gateway with Strata & FM read tools, action proposals and audit | P1 | 3h | VX-005, VX-021, VX-041, D-15 |
| DEV2 | VX-023 Implement budgets, levy schedule generation and automatic levy runs with notices and pay links | P0 | 3.5h | VX-020, VX-022, VX-062, VX-009 |
| DEV2 | VX-024 Implement payments (pay-now webhook, manual receipt, allocation) and bank statement import with auto-match and reconciliation lock | P0 | 3.5h | VX-020, VX-022, VX-062 |
| DEV3 | VX-043 Implement service requests, triage and FM work order lifecycle with assignment, evidence and SLA engine | P0 | 4.5h | VX-040, VX-041, VX-042, VX-009, VX-062 |
| DEV3 | VX-044 Implement PPM maintenance plans, occurrence generation and 52-week planner API | P1 | 2h | VX-040, VX-041, VX-043 |
| DEV4 | VX-063 Build Strata staff screens for the demo path (dashboard, schemes, lot ledger, budget/levies, receipts, bank rec, arrears, invoices) | P0 | 3.5h | VX-061, VX-021, VX-022 |
| DEV4 | VX-064 Build FM staff screens and technician PWA for the demo path (Ops Centre, triage, WO detail, planner, job execution offline) | P0 | 3.5h | VX-061, VX-041, VX-043 |
| PO/SME | D-04 Decision Required: Arrears level thresholds, actions and fees | P1 | 0h | — |

### Day 4 — Integration & Hardening (2026-11-27)

| Lane | Item | Priority | Est | Depends on |
|---|---|---|---|---|
| DEV1 | VX-012 Apply security hardening: headers/CSP, rate limits, CI SAST & dependency scans, audit verifier and invariants job | P0 | 3.5h | VX-003, VX-006, VX-022 |
| DEV1 | VX-068 Implement document RAG: chunking, embeddings, scope-filtered hybrid retrieval and citation validator | P1 | 3h | VX-008, VX-066, D-15 |
| DEV2 | VX-025 Implement arrears engine: levels L1–L3, notices, penalties, hold, debt referral to mock collections | P0 | 2.5h | VX-020, VX-023, VX-024, VX-009, VX-062 |
| DEV2 | VX-026 Implement supplier invoices with approval routing (staff/committee) and payment batches to mock bank | P1 | 2.5h | VX-010, VX-022, VX-042, VX-062 |
| DEV2 | VX-070 Implement Aged Debtors report (JSON/PDF) and Strata dashboard KPIs | P0 | 1.5h | VX-022, VX-025 |
| DEV3 | VX-045 Implement client variation approvals (NTE) and FM customer portal request tracking | P1 | 2h | VX-010, VX-043 |
| DEV3 | VX-046 Implement Ops Centre aggregates and basic FM analytics (cost by property, SLA %, supplier performance) | P1 | 2h | VX-043, VX-044 |
| DEV3 | VX-047 Implement 10-year asset lifecycle plan generation and CAPEX export | P1 | 2h | VX-040, VX-041 |
| DEV4 | VX-065 Build owner portal PWA (home tiles, ledger & pay, requests, documents, committee approvals) | P0 | 2.5h | VX-061, VX-024, VX-026, VX-008 |
| DEV4 | VX-067 Build cross-module Playwright E2E suite for the Demo Lite path and seed reset | P0 | 1.5h | VX-063, VX-064, VX-065 |
| DEV4 | VX-069 Build AI assistant panel UI (streaming, citations, action proposal confirm) | P1 | 1.5h | VX-060, VX-066 |
| DEV4 | VX-071 Deploy demo environment (compose on single VM) with seed reset and smoke check | P0 | 1h | VX-001, VX-012 |

### Day 5 — Validation & Demo (2026-11-30)

| Lane | Item | Priority | Est | Depends on |
|---|---|---|---|---|
| DEV1 | VX-091 Day 5: Security validation run (auth, RBAC negatives, tenant isolation, document access, AI authz/injection) | P0 | 2h | VX-007, VX-012, VX-068 |
| DEV1 | VX-094 Day 5: AI evaluation subset run and AI demo rehearsal | P1 | 1.5h | VX-066, VX-068, VX-069 |
| DEV1 | VX-099 Release Readiness / Demo Gate | P0 | 1h | VX-090, VX-091, VX-092, VX-093, VX-094, VX-095, VX-096 |
| DEV2 | VX-092 Day 5: Strata financial integrity validation (FIN tests, invariants, report totals) | P0 | 2h | VX-025, VX-026, VX-070 |
| DEV2 | VX-095 Day 5: Regression and gap-closure buffer (P0/P1 bug fixing) | P0 | 4h | VX-090 |
| DEV3 | VX-093 Day 5: FM workflow validation (SLA clock, compliance gate, offline sync, resident-app round trip) | P0 | 2h | VX-043, VX-045, VX-064 |
| DEV3 | VX-096 Day 5: Traceability and documentation verification (update matrix with Plane IDs and test results) | P1 | 1.5h | VX-090 |
| DEV3 | VX-098 Day 5: Reduced performance smoke (k6 PERF-01/03/04 at small scale) | P2 | 1h | VX-071 |
| DEV4 | VX-090 Day 5: Full system smoke and Demo Lite critical-workflow run | P0 | 2h | VX-067, VX-071 |
| DEV4 | VX-097 Day 5: Known-gap review and post-Day-5 backlog grooming | P1 | 1h | VX-090 |

### Unscheduled (POST-DAY-5 / decisions without a day)

| Item | Priority | Est | Lane |
|---|---|---|---|
| VX-011 Implement global search index and /search endpoint (scope-filtered) | P2 | 2h | DEV1 |
| D-05 Decision Required: Meeting notice, quorum, proxy and voting threshold rules | P2 | 0h | PO/SME |
| D-07 Decision Required: Bank statement formats and receipt matching keys (Macquarie/NAB) | P2 | 0h | PO/SME |
| D-08 Decision Required: Payment provider and payment rails for pay-now | P2 | 0h | PO/SME |
| D-09 Decision Required: Partner integration protocols (LevyCollect, StrataVote, Conpago/MyVillage) | P2 | 0h | PO/SME |
| D-11 Decision Required: Asset lifecycle method and benchmark data | P2 | 0h | PO/SME |
| D-14 Decision Required: Obtain authorized product access / staff UI screenshots | P2 | 0h | PO/SME |
| FX-01 Meetings, motions, e-voting, proxies and minutes | P3 | 16h | DEV2 |
| FX-02 Comms campaigns with dynamic audiences and test send | P3 | 8h | DEV2 |
| FX-03 Community & committee wall with moderation | P3 | 6h | DEV4 |
| FX-04 Strata insurance & compliance register with renewal tasks | P3 | 6h | DEV2 |
| FX-05 Quote requests, quote comparison and strata work orders (+ escalate to FM) | P3 | 10h | DEV2 |
| FX-06 Data import wizard and templates (schemes, lots, owners, assets, opening balances) | P3 | 12h | DEV1 |
| FX-07 FM inspections & compliance schedules with follow-up WOs | P3 | 6h | DEV3 |
| FX-08 CRM contact history and dispatch board | P3 | 10h | DEV3 |
| FX-09 Scheduled report distribution and full Strata report set (TB, I&E, BS, levy register, statements) | P3 | 14h | DEV2 |
| FX-10 Full FM analytics and client self-serve reports | P3 | 10h | DEV3 |
| FX-11 AI email reply drafts (human-in-the-loop) | P3 | 6h | DEV1 |
| FX-12 AI invoice field extraction with confidence review | P3 | 8h | DEV1 |
| FX-13 Public API clients and webhook subscription management (incl. redelivery, auto-disable) | P3 | 8h | DEV1 |
| FX-14 Complete OpenAPI for all ~190 catalogued operations and oasdiff gate | P2 | 8h | DEV1 |
| FX-15 Full performance suite, ZAP DAST, backup/restore rehearsal | P3 | 12h | DEV3 |
| FX-16 Observability stack: OTel → Grafana dashboards, alerts and runbooks | P3 | 10h | DEV4 |
| FX-17 Cloud reference deployment (ECS/Helm), release pipeline with signing and SBOM | P3 | 14h | DEV4 |
| FX-18 Full AI evaluation datasets and CI gates; owner-facing AI (BL-13) | P3 | 12h | DEV1 |
| FX-19 Accessibility audit, responsive polish, global search UI, saved views | P3 | 10h | DEV4 |
| FX-20 Payment plans self-service, special levies UI, collections full lifecycle | P3 | 10h | DEV2 |
| FX-22 Tasks, notes and timeline UI with configurable automation rules | P3 | 8h | DEV1 |
| FX-21 Future backlog umbrella (BL-01..BL-20: native apps, real banks, E-Services, term deposits, M365 channels…) | P3 | 0h | — |

## Work item details

### VX-001 — Bootstrap monorepo, docker-compose stack and CI baseline

- **Epic:** EP-22 EPIC: DevOps & Environments · **Module:** 12 · DevOps & Deployment
- **Lane:** DEV4 · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 4 h · **State:** Todo
- **Evidence:** PROPOSED · **Labels:** DEVOPS, TECHNICAL
- **Depends on:** —

Create the pnpm monorepo per REPOSITORY_STRUCTURE (apps/api, apps/web, apps/mocks, packages/{ui,contracts,domain-kit}, seed, e2e). docker-compose with Postgres 16 + pgvector/pg_trgm/ltree/citext, Redis 7, MinIO, Keycloak (realm import), Mailpit, ClamAV. GitHub Actions ci.yml: install, lint, typecheck, unit, gitleaks. `.env.example` with dummy values only. This is the first item on the critical path: every other item depends on it. **Deliver in two pushes:** push 1 within the first 90 minutes of Day 1 (workspace skeleton, empty NestJS and Vite apps, compose services up) unblocks DEV1/DEV2/DEV3; push 2 (CI workflow, lint and test wiring) lands by end of day.

**Acceptance criteria**

- [ ] Given a clean checkout, when `docker compose up -d && pnpm install && pnpm dev` runs, then api, web, Postgres, Redis, MinIO, Keycloak and Mailpit are healthy within 3 minutes.
- [ ] Given a PR, when CI runs, then lint, typecheck, unit tests and gitleaks execute and block merge on failure.
- [ ] No real secret exists in the repo (gitleaks clean).

**Source documentation:** `docs/15-build/REPOSITORY_STRUCTURE.md`; `docs/13-devops/ENVIRONMENTS.md`; `docs/13-devops/CI_CD.md`; `docs/13-devops/CONFIGURATION.md`; `docs/13-devops/SECRETS.md`; `docs/05-architecture/SYSTEM_ARCHITECTURE.md (Tech stack)`

**Traceability:** REQ: NFR-14, NFR-15 · TESTS: CI green

**Risks:** Toolchain friction on Windows dev machines — provide devcontainer or WSL note.

### VX-002 — Apply reference schema baseline with RLS, ledger triggers and grants

- **Epic:** EP-01 EPIC: Platform Foundation · **Module:** 01 · Foundation & Platform
- **Lane:** DEV2 · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 4 h · **State:** Todo
- **Evidence:** PROPOSED · **Labels:** PLATFORM, TECHNICAL, SECURITY
- **Depends on:** VX-001

Turn docs/06-database/SCHEMA.sql into migration 0001 (node-pg-migrate): all schemas (platform, common, strata, fm, ai), RLS loop (ENABLE + FORCE + tenant_isolation policy on every tenant_id table), balanced-journal constraint trigger and period-lock trigger from MIGRATIONS.md, REVOKE UPDATE/DELETE on audit and ledger tables for app_user, separate migrator and app_user roles (no BYPASSRLS). Domain owners may add follow-up migrations; this one is the shared baseline. Urbanise's schema is UNKNOWN (U-01) — this is an independent design.

**Acceptance criteria**

- [ ] Given a connection as app_user without `app.tenant_id` set, when any tenant table is queried, then 0 rows are returned (TEN-05).
- [ ] Given tenant A context, when inserting a row with tenant B's id, then RLS WITH CHECK rejects it (TEN-12).
- [ ] Given an unbalanced journal entry, when the transaction commits, then it fails with UNBALANCED_ENTRY (FIN-03).
- [ ] Given a closed period, when a journal is inserted for that month, then it fails with PERIOD_CLOSED (FIN-09).
- [ ] app_user cannot UPDATE/DELETE audit_events, journal_entries or ledger_lines (SEC-12).

**Source documentation:** `docs/06-database/SCHEMA.sql`; `docs/06-database/DOMAIN_MODEL.md`; `docs/06-database/DATA_GOVERNANCE.md`; `docs/13-devops/MIGRATIONS.md`; `docs/04-shared-platform/TENANCY.md`; `docs/05-architecture/ARCHITECTURE_DECISIONS.md (ADR-002, ADR-003, ADR-004)`

**Traceability:** REQ: FR-SH-02, NFR-06, NFR-09, NFR-10 · BR: BR-ST-12 · TESTS: TEN-05, TEN-12, FIN-03, FIN-09, SEC-12

**Risks:** RLS misconfiguration silently leaks data — covered by TEN tests in VX-007.

### VX-003 — Implement API core: tenant context, Problem errors, cursor pagination, idempotency, request logging

- **Epic:** EP-01 EPIC: Platform Foundation · **Module:** 01 · Foundation & Platform
- **Lane:** DEV1 · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 2.5 h · **State:** Todo
- **Evidence:** PROPOSED · **Labels:** PLATFORM, TECHNICAL
- **Depends on:** VX-001

NestJS on Fastify core module: TenantContext (from token `tid`) and a transaction helper that runs `SET LOCAL app.tenant_id`; ScopedRepository base; RFC 9457 Problem filter with error codes; HMAC-signed keyset cursor pagination; Idempotency-Key interceptor backed by platform.idempotency_keys; optimistic locking (If-Match); Pino JSON logging with redaction and request/trace IDs; /healthz and /readyz.

**Acceptance criteria**

- [ ] Given the same Idempotency-Key and body twice, then one write occurs and the replay returns the original response with `Idempotent-Replayed: true`.
- [ ] Given the same key with a different body, then 409 IDEMPOTENCY_KEY_REUSED.
- [ ] Given a tampered cursor, then 400 INVALID_CURSOR.
- [ ] Every error response is application/problem+json with code and traceId and no stack trace.
- [ ] Logs never contain Authorization headers, passwords, tokens or bank numbers (SEC-14).

**Source documentation:** `docs/05-architecture/SYSTEM_ARCHITECTURE.md (Request lifecycle)`; `docs/07-api/ERROR_MODEL.md`; `docs/07-api/PAGINATION.md`; `docs/07-api/FILTERING.md`; `docs/07-api/IDEMPOTENCY.md`; `docs/13-devops/LOGGING.md`; `docs/15-build/IMPLEMENTATION_GUIDE.md`

**Traceability:** REQ: NFR-11, NFR-14 · TESTS: API-ERR-01, API-PAGE-01, API-PAGE-02, API-IDEM-01, API-IDEM-02, API-IDEM-03, API-LOCK-01, SEC-14

### VX-004 — Implement authentication: Keycloak realm, JWT guard, server-side role resolution, /me

- **Epic:** EP-02 EPIC: Identity, Tenancy & RBAC · **Module:** 02 · Identity, Tenancy & Access
- **Lane:** DEV1 · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 2.5 h · **State:** Todo
- **Evidence:** PROPOSED · **Labels:** PLATFORM, SECURITY, FEATURE
- **Depends on:** VX-001

Integrates with VX-002 (memberships/role_assignments tables) at merge on Day 1 afternoon; development starts in parallel. Keycloak realm export (vertex-web PKCE client, vertex-api bearer-only, TOTP required for staff), seeded synthetic test users from SEED_DATA. API AuthGuard validates JWT via JWKS (iss, aud, exp), resolves membership for `tid`, loads role assignments server-side (60 s cache — ADR-016). GET /me and POST /me/tenant-switch. SSO with Entra ID exists in Urbanise (EV-006, CONFIRMED capability); the protocol is UNKNOWN, so the POC uses OIDC brokering with a second Keycloak realm acting as the corporate IdP for the demo.

**Acceptance criteria**

- [ ] Given no token, then 401 Problem.
- [ ] Given a token whose `tid` is not an active membership of the user, then 401.
- [ ] Given a JWT with alg:none or a wrong key, then 401 (SEC-06).
- [ ] Given a revoked role assignment, then access is denied within 60 s (RBAC-N14).
- [ ] Given the demo SSO realm, when a staff user logs in through it, then a session is created in the correct tenant (FT-SH-03).

**Source documentation:** `docs/04-shared-platform/IDENTITY_AND_AUTH.md`; `docs/07-api/AUTHENTICATION.md`; `docs/15-build/SEED_DATA.md (Users)`; `docs/00-discovery/EVIDENCE_REGISTER.md (EV-006)`

**Traceability:** REQ: FR-SH-03, FR-SH-04, FR-IN-07 · US: US-02 · WF: WF-02 · SCR: SCR-001 · TESTS: API-AUTH-01, API-AUTH-02, API-AUTH-03, SEC-05, SEC-06, FT-SH-02, FT-SH-03, INT-T-16, RBAC-N14 · DEMO: Demo 1

**Risks:** Keycloak config drift between environments — realm is exported to git.

**Unknowns / decisions:** Real Entra ID tenant not available for POC (mock IdP realm used).

### VX-005 — Implement RBAC permission catalog, @Permission guard and route-coverage test

- **Epic:** EP-02 EPIC: Identity, Tenancy & RBAC · **Module:** 02 · Identity, Tenancy & Access
- **Lane:** DEV1 · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 2 h · **State:** Todo
- **Evidence:** PROPOSED · **Labels:** PLATFORM, SECURITY
- **Depends on:** VX-004

Static permission catalog (`module.resource.action`) and 13 system roles from the RBAC matrix; PermissionGuard reading @Permission metadata; `can(user, permission, resource)` with scope types (tenant, scheme, lot, region, property, supplier, client); CI test enumerating all routes that fails if a route has neither @Permission nor @Public. Domain teams use the catalog from Day 2.

**Acceptance criteria**

- [ ] Given any registered route without @Permission or @Public, then the route-coverage test fails (API-PERM-01).
- [ ] Given strata_manager, when calling a platform.tenant.manage route, then 403 (RBAC-N08).
- [ ] Given an auditor, when calling any write endpoint, then 403 (RBAC-N09).

**Source documentation:** `docs/04-shared-platform/RBAC.md`; `docs/07-api/AUTHORIZATION.md`; `docs/01-product/PERSONAS.md`

**Traceability:** REQ: FR-SH-05 · US: US-03 · TESTS: API-PERM-01, RBAC-N08, RBAC-N09, FT-SH-04

### VX-006 — Implement audit writer (hash chain), transactional outbox, BullMQ relay and Clock-based scheduler

- **Epic:** EP-01 EPIC: Platform Foundation · **Module:** 01 · Foundation & Platform
- **Lane:** DEV3 · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 4 h · **State:** Todo
- **Evidence:** PROPOSED · **Labels:** PLATFORM, TECHNICAL
- **Depends on:** VX-002

AuditService writing append-only events with per-tenant sha256 hash chain inside the business transaction; outbox insert helper; relay worker publishing unpublished outbox rows to BullMQ queues; idempotent consumer base using platform.processed_events; repeatable-job scheduler with injectable Clock (needed for levy, arrears, PPM, SLA jobs and for deterministic tests). Audit trail is a CONFIRMED capability (EV-013); this implementation is PROPOSED.

**Acceptance criteria**

- [ ] Given a state change, then an audit event and an outbox event are written in the same transaction (rollback removes both).
- [ ] Given the relay crashes after publish but before marking, when it restarts, then consumers process the event exactly once (FAILREC-04).
- [ ] Given the Clock is advanced in a test, then scheduled jobs fire deterministically.
- [ ] The audit hash chain verifies for a seeded tenant.

**Source documentation:** `docs/04-shared-platform/COMMON_SERVICES.md (Audit; Scheduler & outbox)`; `docs/05-architecture/EVENTS.md`; `docs/05-architecture/ARCHITECTURE_DECISIONS.md (ADR-005)`; `docs/12-testing/FAILURE_RECOVERY_TESTS.md`

**Traceability:** REQ: FR-SH-09, NFR-09 · US: US-45 · TESTS: FT-SH-07, FAILREC-01, FAILREC-04, FAILREC-12 · DEMO: Demo 23

### VX-020 — Build Strata money & calculation library with property tests (apportionment, CRN, ageing, allocation, penalty)

- **Epic:** EP-04 EPIC: Strata — Trust Ledger, Budgets & Levies · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 3 h · **State:** Todo
- **Evidence:** PROPOSED · **Labels:** STRATA, FEATURE, TEST
- **Depends on:** VX-001

Pure functions in packages/domain-kit and strata/domain: apportionLevy (cents, entitlement-weighted, remainder rules), CRN with Luhn check digit, ageCharges (1–30/31–60/61–90/91+ from due date — OBSERVED EV-028), allocatePayment (oldest due first, penalty last), penalty (simple interest, configurable). The capability that levies are budget-driven is CONFIRMED (EV-020), but the formulas are UNKNOWN (U-20, U-22). These are PROPOSED, configurable defaults pending D-01..D-03.

**Acceptance criteria**

- [ ] For random budgets (1 c – $10M), 1–2,000 lots and random entitlements, the sum of schedule items per fund equals the levy target exactly (FIN-01).
- [ ] Worked example from LEVY_ENGINE ($10,000; 10/20/30/40; quarterly) yields 25,000/50,000/75,000/100,000 c (FT-ST-03).
- [ ] Allocation never exceeds outstanding; any remainder becomes credit (FIN-02).
- [ ] Bucket totals equal total overdue (FIN-06).

**Source documentation:** `docs/03-strata/LEVY_ENGINE.md`; `docs/03-strata/ARREARS_AND_DEBT_RECOVERY.md (Ageing)`; `docs/02-requirements/BUSINESS_RULES.md (BR-ST-03, 05, 06, 07, 09)`; `docs/12-testing/FINANCIAL_INTEGRITY_TESTS.md`

**Traceability:** REQ: FR-ST-05, FR-ST-08, NFR-10 · BR: BR-ST-03, BR-ST-05, BR-ST-06, BR-ST-07, BR-ST-09 · TESTS: FIN-01, FIN-02, FIN-06, FIN-07, FT-ST-03, FT-ST-04 · DEMO: Demo 3

**Risks:** Jurisdiction rules differ (⚖) — defaults must stay configurable.

**Unknowns / decisions:** D-01 apportionment/rounding; D-02 penalty/discount; D-03 allocation order

### VX-040 — Build FM calculation library: business-time SLA, RRULE occurrences, lifecycle formula, WO state table

- **Epic:** EP-12 EPIC: FM — Service Requests, Work Orders & SLA · **Module:** 04 · FM
- **Lane:** DEV3 · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 2.5 h · **State:** Todo
- **Evidence:** PROPOSED · **Labels:** FM, FEATURE, TEST
- **Depends on:** VX-001

Pure, unit-tested functions: addBusinessMinutes(start, minutes, calendar) with holidays and DST (Australia/Sydney); occurrence generator from iCal RRULE in tenant timezone (≤ daily); lifecycle remaining-life with condition factors and cost escalation; declarative WorkOrder transition table with guards (SM-17). SLAs are a CONFIRMED capability (EV-098) but their definitions are UNKNOWN (U-26); the lifecycle method is UNKNOWN (U-27). Both are PROPOSED defaults.

**Acceptance criteria**

- [ ] Given P3 created Friday 16:30 with a Mon–Fri 08–17 calendar, then the response due time is Monday 16:30.
- [ ] DST transition tests pass for Australia/Sydney.
- [ ] Given monthly RRULE and lead 7 days, then occurrences and generation dates are correct for 52 weeks.
- [ ] An illegal WO transition throws INVALID_STATE_TRANSITION.

**Source documentation:** `docs/03-fm/WORK_MANAGEMENT.md`; `docs/03-fm/ASSET_LIFECYCLE.md`; `docs/05-architecture/STATE_MACHINES.md (SM-17, SM-19)`; `docs/02-requirements/BUSINESS_RULES.md (BR-FM-01..05, BR-FM-12)`; `docs/15-build/IMPLEMENTATION_GUIDE.md (Business time, RRULE)`

**Traceability:** REQ: FR-FM-03, FR-FM-04, FR-FM-09 · BR: BR-FM-01, BR-FM-02, BR-FM-03, BR-FM-04, BR-FM-12 · TESTS: FT-FM-09, FT-FM-10, FT-FM-03

**Unknowns / decisions:** D-10 SLA matrix; D-11 lifecycle method

### VX-060 — Implement web app shell with OIDC login, role-aware navigation and generated API client

- **Epic:** EP-19 EPIC: Frontend Shell & Staff UX · **Module:** 09 · Frontend & UX
- **Lane:** DEV4 · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 3 h · **State:** Todo
- **Evidence:** PROPOSED · **Labels:** FRONTEND, FEATURE
- **Depends on:** VX-001, VX-004

React + Vite + TanStack Router/Query + Tailwind + Radix. OIDC PKCE login against Keycloak; AppShell (sidebar, top bar, tenant switcher, notifications bell placeholder); menus driven by /me permissions and licensed products; route areas /app, /portal, /field, /fm-portal, /pay; API client and zod types generated from packages/contracts (OPENAPI.yaml). Staff UI of Urbanise is UNKNOWN — layouts are PROPOSED.

**Acceptance criteria**

- [ ] Given a staff user, when logging in, then the role-appropriate menu renders, and Strata/FM sections hide when the tenant does not license them.
- [ ] Given an expired session, then the user is redirected to login and returned to the original deep link.
- [ ] The API client compiles from OPENAPI.yaml with no hand-written request types.

**Source documentation:** `docs/08-ux/INFORMATION_ARCHITECTURE.md`; `docs/08-ux/NAVIGATION.md`; `docs/08-ux/COMPONENTS.md (AppShell)`; `docs/07-api/OPENAPI.yaml`

**Traceability:** REQ: FR-SH-01 · SCR: SCR-001, SCR-002 · TESTS: E2E-SH-01 · DEMO: Demo 1

### VX-007 — Implement RBAC scope predicates and tenant-isolation / RBAC negative test suites

- **Epic:** EP-02 EPIC: Identity, Tenancy & RBAC · **Module:** 10 · Security & Compliance
- **Lane:** DEV1 · **Cycle:** Day 2 — Core Domains · **Priority:** P0 · **Estimate:** 3 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** SECURITY, TEST
- **Depends on:** VX-005, VX-002

scopeFilter(user, permission) SQL fragments for list endpoints (scheme, lot via ownership, property, region, supplier, client). Out-of-scope by-id returns 404. Generated test that hits every GET-by-id route with another tenant's id. Two seeded tenants (T1, T2 with look-alike names) exercise isolation.

**Acceptance criteria**

- [ ] Given tenant B ids, when tenant A calls any GET-by-id route, then 404 (TEN-01, generated over all routes).
- [ ] List endpoints never include other-tenant rows (TEN-02).
- [ ] An owner requesting another lot's ledger in the same scheme gets 404 (RBAC-N01).
- [ ] A technician requesting another technician's WO gets 404 (RBAC-N04).

**Source documentation:** `docs/04-shared-platform/RBAC.md (Model, Negative tests)`; `docs/04-shared-platform/TENANCY.md`; `docs/12-testing/SECURITY_TESTS.md (TEN, RBAC-N)`; `docs/15-build/SEED_DATA.md (Tenants)`

**Traceability:** REQ: FR-SH-02, FR-SH-05, NFR-06 · TESTS: TEN-01, TEN-02, TEN-05, TEN-06, TEN-09, RBAC-N01, RBAC-N02, RBAC-N04, RBAC-N07 · DEMO: Demo 23

**Risks:** Scope logic per resource is easy to miss — suite runs per route.

### VX-008 — Implement document service: presigned upload, AV scan, type validation, visibility/ACL, signed download

- **Epic:** EP-15 EPIC: Shared Workflow — Documents, Notifications, Approvals, Tasks, Search · **Module:** 05 · Workflow, Documents & Notifications
- **Lane:** DEV1 · **Cycle:** Day 2 — Core Domains · **Priority:** P1 · **Estimate:** 3.5 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** PLATFORM, SECURITY, FEATURE
- **Depends on:** VX-003, VX-005

POST /documents (presigned PUT to quarantine bucket) → ClamAV scan worker → magic-byte allow-list, 25 MB cap, sha256 check → move to clean bucket; entity links; visibility levels (staff, committee, owners, lot_owner, contractor, client) per BR-SH-03; 5-minute signed download only after authorization; emits document.scanned for RAG indexing. Document management is a CONFIRMED capability (EV-014, EV-037).

**Acceptance criteria**

- [ ] An EICAR upload is marked infected and is never downloadable (SEC-10).
- [ ] A mime-spoofed or polyglot file is rejected (SEC-11).
- [ ] An owner downloads an owners-visibility by-law (200) but gets 404 for committee-only minutes (DOC-01/02).
- [ ] A download while scan is pending returns 409 (DOC-05).

**Source documentation:** `docs/04-shared-platform/COMMON_SERVICES.md (Documents)`; `docs/05-architecture/SECURITY_ARCHITECTURE.md (Uploads)`; `docs/07-api/API_CATALOG.md (Platform documents)`; `docs/09-ai/DOCUMENT_RAG.md (visibility)`

**Traceability:** REQ: FR-SH-06 · BR: BR-SH-03 · SCR: SCR-005, SCR-154 · TESTS: FT-SH-05, DOC-01, DOC-02, DOC-03, DOC-04, DOC-05, DOC-06, SEC-10, SEC-11, TEN-04 · DEMO: Demo 11, Demo 14, Demo 17

### VX-021 — Implement Strata scheme register and provisioning (schemes, buildings, lots, contacts, ownerships)

- **Epic:** EP-03 EPIC: Strata — Scheme Register & Provisioning · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** Day 2 — Core Domains · **Priority:** P0 · **Estimate:** 3.5 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, FEATURE
- **Depends on:** VX-003, VX-005, VX-006

APIs for schemes, buildings, lots (entitlement, CRN), contacts, ownerships (effective dates, transfer), occupancies. Scheme creation provisions: Admin + Capital Works funds (BR-ST-01, OBSERVED EV-038), chart of accounts template, trust bank account, and portal site record (CONFIRMED EV-032 auto-provisioned portal). Includes Harbour View and Garden Terrace demo seed for T1 and the look-alike scheme for T2.

**Acceptance criteria**

- [ ] Given a new scheme, then exactly one admin and one capital works fund, the chart of accounts, a trust account and a portal site exist.
- [ ] A duplicate registration number per jurisdiction returns 409; a duplicate lot number per scheme returns 409.
- [ ] Given an ownership transfer, then the previous ownership ends the day before and the strata roll reflects the new owner.
- [ ] The seed loads T1 (Harbour View 12 lots, Garden Terrace 6 lots) and T2.

**Source documentation:** `docs/03-strata/STRATA_CAPABILITY_MATRIX.md`; `docs/01-product/WORKFLOW_CATALOG.md (WF-03)`; `docs/03-strata/TRUST_ACCOUNTING.md (Chart of accounts)`; `docs/07-api/API_CATALOG.md (Strata register)`; `docs/07-api/OPENAPI.yaml (/strata/schemes, /lots, /ownerships)`; `docs/15-build/SEED_DATA.md (Strata)`

**Traceability:** REQ: FR-ST-01, FR-ST-02, FR-ST-03 · US: US-05, US-06 · WF: WF-03 · BR: BR-ST-01, BR-ST-20 · SCR: SCR-102, SCR-103, SCR-104, SCR-105 · TESTS: FT-ST-01, FT-ST-02 · DEMO: Demo 2

### VX-022 — Implement trust ledger posting service, period close and trial balance

- **Epic:** EP-04 EPIC: Strata — Trust Ledger, Budgets & Levies · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** Day 2 — Core Domains · **Priority:** P0 · **Estimate:** 3 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, FEATURE
- **Depends on:** VX-002, VX-021

LedgerService.post(entry) with standard postings (levy, penalty, sundry, receipt, supplier invoice, payment, bank fee), reversals referencing the original, lot and supplier sub-ledgers, monthly periods with close guard, trial balance query, and GET /strata/lots/{id}/ledger with running balance. Trust accounting is CONFIRMED as a capability (EV-043), but statutory rules are UNKNOWN (G-05, D-06). This design is PROPOSED.

**Acceptance criteria**

- [ ] After any random sequence of postings, the trial balance sums to zero (FIN-04).
- [ ] A reversal restores balances exactly (FIN-08).
- [ ] The lot ledger shows levy, penalty and receipt lines with a correct running balance (matches OBSERVED EV-039 structure).

**Source documentation:** `docs/03-strata/TRUST_ACCOUNTING.md`; `docs/05-architecture/STATE_MACHINES.md (SM-28)`; `docs/02-requirements/BUSINESS_RULES.md (BR-ST-12)`; `docs/07-api/OPENAPI.yaml (/strata/lots/{id}/ledger)`

**Traceability:** REQ: FR-ST-15 · BR: BR-ST-12 · SCR: SCR-104, SCR-120 · TESTS: FT-ST-16, FIN-03, FIN-04, FIN-05, FIN-08, FIN-09 · DEMO: Demo 5, Demo 6

**Risks:** Statutory trust rules unvalidated (⚖).

**Unknowns / decisions:** D-06 trust accounting rules

### VX-041 — Implement FM properties, location tree, asset types and asset register with demo seed

- **Epic:** EP-10 EPIC: FM — Properties, Assets & Lifecycle · **Module:** 04 · FM
- **Lane:** DEV3 · **Cycle:** Day 2 — Core Domains · **Priority:** P0 · **Estimate:** 3.5 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** FM, FEATURE
- **Depends on:** VX-003, VX-005, VX-006

APIs for regions, clients, properties (flags such as child_safe and aged_care), ltree locations, asset types (illustrative default lives and costs), and assets (warranty, condition, criticality, replacement cost, GPS, photos via documents). under_warranty flag (EV-091) and asset history endpoint. FM seed: Acme Care, 3 properties, ~60 locations, 220 assets, 2 technicians, SLA policies.

**Acceptance criteria**

- [ ] A location whose parent belongs to another property is rejected (LOCATION_PROPERTY_MISMATCH).
- [ ] An asset with future warranty expiry reports underWarranty=true.
- [ ] Asset list filters by property, type, warranty and condition with cursor pagination.
- [ ] The seed loads FM demo data for T1.

**Source documentation:** `docs/03-fm/FM_CAPABILITY_MATRIX.md`; `docs/03-fm/ASSET_LIFECYCLE.md (Asset)`; `docs/01-product/WORKFLOW_CATALOG.md (WF-15)`; `docs/07-api/OPENAPI.yaml (/fm/assets)`; `docs/15-build/SEED_DATA.md (FM)`

**Traceability:** REQ: FR-FM-01, FR-FM-02 · US: US-27 · WF: WF-15 · BR: BR-FM-06 · SCR: SCR-202, SCR-203, SCR-204, SCR-205, SCR-253 · TESTS: FT-FM-01, FT-FM-02 · DEMO: Demo 16

### VX-042 — Implement shared suppliers, compliance records, status computation and assignment gate

- **Epic:** EP-14 EPIC: Suppliers & Contractor Compliance (shared) · **Module:** 04 · FM
- **Lane:** DEV3 · **Cycle:** Day 2 — Core Domains · **Priority:** P0 · **Estimate:** 3 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** FM, STRATA, FEATURE, SECURITY
- **Depends on:** VX-003, VX-005, VX-008

Supplier register (bank details encrypted, last4 only, change requires step-up/dual control — thin in POC), compliance types (seeded: public liability, workers comp, trade licence, WWC/safeguarding), compliance records with verify/reject, status computation per BR-SUP-01 (compliant, expiring ≤ 30 days, non_compliant), and an `isAssignable(supplier, property, date)` gate used by WO assignment (BR-FM-07, EV-078 safeguarding before site attendance). Compliance types are UNKNOWN (U-28) → PROPOSED seed.

**Acceptance criteria**

- [ ] A supplier with expired insurance cannot be assigned (422 SUPPLIER_NON_COMPLIANT) (FT-FM-13).
- [ ] At a child_safe property, a contractor without a verified WWC record is blocked, while the same contractor is allowed elsewhere (FT-FM-14).
- [ ] Bank account numbers are ciphertext in the DB and appear only as last4 in the API (SEC-21).

**Source documentation:** `docs/03-fm/SUPPLIERS_AND_COMPLIANCE.md`; `docs/01-product/WORKFLOW_CATALOG.md (WF-20)`; `docs/02-requirements/BUSINESS_RULES.md (BR-FM-07, BR-SUP-01, BR-SUP-02)`; `docs/05-architecture/SECURITY_ARCHITECTURE.md (bank details)`

**Traceability:** REQ: FR-FM-12 · US: US-32, US-35 · WF: WF-20 · BR: BR-FM-07, BR-SUP-01 · SCR: SCR-113, SCR-214 · TESTS: FT-FM-13, FT-FM-14, SEC-08, SEC-21 · DEMO: Demo 16

**Unknowns / decisions:** D-12 compliance document types

### VX-061 — Build UI kit: DataTable, FilterBar, forms, money components, status badges, UX states

- **Epic:** EP-19 EPIC: Frontend Shell & Staff UX · **Module:** 09 · Frontend & UX
- **Lane:** DEV4 · **Cycle:** Day 2 — Core Domains · **Priority:** P0 · **Estimate:** 3 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** FRONTEND, TECHNICAL
- **Depends on:** VX-060

packages/ui: DataTable (server cursor, sort whitelist, filter chips, row actions), EntityHeader, StatusBadge, MoneyText/MoneyInput (cents), LedgerTable, SLAClock, ApprovalCard, DocumentUploader, PhotoCapture, Skeleton/Empty/Error/Permission states, ConfirmDialog with typed confirmation, form wrapper (react-hook-form + zod mapping server `errors[].path`).

**Acceptance criteria**

- [ ] DataTable pages through 120 rows via cursor with no duplicates.
- [ ] Server 422 errors map onto the right fields.
- [ ] axe reports 0 serious issues on the Storybook stories.

**Source documentation:** `docs/08-ux/COMPONENTS.md`; `docs/08-ux/TABLES.md`; `docs/08-ux/FORMS.md`; `docs/08-ux/UX_STATES.md`

**Traceability:** REQ: NFR-12 · TESTS: UI-A11Y

### VX-062 — Build mock providers: payments, bank, collections, resident app, SMS, LLM; wire Mailpit

- **Epic:** EP-17 EPIC: Integrations & Mock Providers · **Module:** 07 · Integrations
- **Lane:** DEV4 · **Cycle:** Day 2 — Core Domains · **Priority:** P0 · **Estimate:** 3.5 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** INTEGRATION, FEATURE
- **Depends on:** VX-001

apps/mocks (Fastify, port 4010): mock-payments (checkout session + hosted Pay/Decline page + HMAC webhooks), mock-bank (CSV/camt.053 statement generator from Vertex pay-ins with noise; payables endpoint), mock-collections (auto-progress referral status), mock-resident-app (UI to submit a request via client credentials; webhook receiver timeline), mock-sms, mock-llm (scripted responses for CI). The integrations are CONFIRMED capabilities (Macquarie/NAB EV-023/049..052, LevyCollect EV-026, Conpago/MyVillage EV-086/087), but their protocols are UNKNOWN, so everything here is a mock (ADR-012).

**Acceptance criteria**

- [ ] mock-payments emits signed webhooks that verify with the shared secret; a bad signature is rejected by Vertex (INT-T-07).
- [ ] mock-bank produces a statement with 20 matchable, 3 suggested and 2 unknown lines from seed data.
- [ ] mock-resident-app can submit a request and display Vertex status webhooks.

**Source documentation:** `docs/10-integrations/MOCK_INTEGRATIONS.md`; `docs/10-integrations/INTEGRATION_CATALOG.md`; `docs/10-integrations/DATA_MAPPING.md`; `docs/10-integrations/AUTHENTICATION.md`

**Traceability:** REQ: FR-IN-01, FR-IN-02, FR-IN-03, FR-IN-05, FR-IN-06 · TESTS: INT-T-01, INT-T-05, INT-T-06, INT-T-07, INT-T-11, INT-T-15 · DEMO: Demo 5, Demo 6, Demo 7, Demo 15, Demo 18

**Risks:** Mocks hide real-world complexity (risk R-09).

**Unknowns / decisions:** D-07 bank formats; D-08 payment rails; D-09 partner protocols

### VX-009 — Implement notification dispatcher (email, in-app SSE, SMS mock) with templates, contact preferences and minimal task API

- **Epic:** EP-15 EPIC: Shared Workflow — Documents, Notifications, Approvals, Tasks, Search · **Module:** 05 · Workflow, Documents & Notifications
- **Lane:** DEV1 · **Cycle:** Day 3 — Product Experience · **Priority:** P1 · **Estimate:** 2.5 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** PLATFORM, FEATURE
- **Depends on:** VX-006, VX-062

Notification templates (Handlebars-safe subset), dispatcher worker that resolves ContactPreference channel order with fallback, providers (SMTP→Mailpit, mock-sms, in-app via SSE), retries (3×), statutory notices bypass opt-out (BR-SH-04), and an in-app notification list API. Owner preferred-method communication is CONFIRMED (EV-022), as are assignee notifications (EV-092). Includes a minimal tasks API (platform.tasks: create, assign, complete) used by automation rules such as the arrears L2 call task (EV-012). Notes, timeline and the tasks UI are in FX-22.

**Acceptance criteria**

- [ ] A contact preferring SMS gets SMS, and email is the fallback when SMS fails (NOT-02).
- [ ] A statutory notice is sent even when the contact opted out of marketing (NOT-03).
- [ ] In-app unread count updates within 2 s (NOT-10).

**Source documentation:** `docs/04-shared-platform/COMMON_SERVICES.md (Notifications)`; `docs/02-requirements/BUSINESS_RULES.md (BR-SH-04)`; `docs/12-testing/NOTIFICATION_AND_WEBHOOK_TESTS.md`; `docs/10-integrations/RETRY_STRATEGY.md`

**Traceability:** REQ: FR-SH-07, FR-SH-08, FR-IN-06, FR-SH-11 · BR: BR-SH-04 · SCR: SCR-006 · TESTS: NOT-01, NOT-02, NOT-03, NOT-05, NOT-06, NOT-10, FT-SH-09 · DEMO: Demo 4, Demo 16

**Unknowns / decisions:** Channels beyond email are UNKNOWN for Urbanise (U-32).

### VX-010 — Implement shared approvals engine (requests, routing by amount/scope, decisions, expiry)

- **Epic:** EP-15 EPIC: Shared Workflow — Documents, Notifications, Approvals, Tasks, Search · **Module:** 05 · Workflow, Documents & Notifications
- **Lane:** DEV1 · **Cycle:** Day 3 — Product Experience · **Priority:** P0 · **Estimate:** 1 h · **State:** Backlog
- **Evidence:** OBSERVED · **Labels:** PLATFORM, FEATURE
- **Depends on:** VX-005, VX-006

common.approval_requests with subject types (supplier_invoice, quote, variation, budget), approver scope (role + scope + limit), POST /approvals/{id}/decision, GET /approvals?mine, approval-limit enforcement (403 APPROVAL_LIMIT_EXCEEDED), 7-day expiry job, and approval.requested/decided events. Committee invoice approval is OBSERVED (EV-040); client variation approvals are CONFIRMED (EV-090).

**Acceptance criteria**

- [ ] Approving an already-decided request returns 409 (API-STATE-02).
- [ ] An accountant approving above their limit gets 403 APPROVAL_LIMIT_EXCEEDED (RBAC-N06).
- [ ] A committee member sees only their scheme's approvals (RBAC-N16).

**Source documentation:** `docs/05-architecture/STATE_MACHINES.md (SM-10)`; `docs/03-strata/PROCUREMENT_AND_INVOICES.md (Approval routing)`; `docs/03-fm/WORK_MANAGEMENT.md (Client approvals)`; `docs/07-api/OPENAPI.yaml (/approvals/{id}/decision)`

**Traceability:** REQ: FR-ST-16, FR-ST-24, FR-FM-13 · BR: BR-ST-14, BR-FM-10 · TESTS: API-STATE-02, RBAC-N06, RBAC-N16 · DEMO: Demo 9, Demo 19

### VX-066 — Implement AI gateway with Strata & FM read tools, action proposals and audit

- **Epic:** EP-16 EPIC: AI Assistant & RAG · **Module:** 06 · AI & Intelligence
- **Lane:** DEV1 · **Cycle:** Day 3 — Product Experience · **Priority:** P1 · **Estimate:** 3 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** AI, SECURITY, FEATURE
- **Depends on:** VX-005, VX-021, VX-041, D-15

SSE endpoint POST /ai/conversations/{id}/messages; budget/rate check; intent classification (fast model); Claude tool-use loop (max 6 iterations) over the tool registry. Tools only appear if the user holds the permission, and handlers call domain services as the user (BR-AI-01). Demo-path tools: strata_get_scheme_summary, strata_list_arrears, strata_get_lot_ledger, fm_list_work_orders, fm_sla_at_risk, fm_get_asset, propose_task. Includes action proposals with confirm and 15-minute expiry, persisted messages/tool calls/citations, and audit with actor ai on_behalf_of user. Urbanise's AI model and status are UNKNOWN/CONFLICTED (EV-118, C-01). This design is independent and PROPOSED.

**Acceptance criteria**

- [ ] Asked for level-2 lots in Harbour View, the assistant lists lots 3 and 7 with exact balances and citations (AIT-01).
- [ ] A manager scoped to scheme A asking about scheme B gets no B data (AIT-03); same-name scheme in T2 never appears (AIT-04).
- [ ] A task is created only after Confirm, and the audit shows actor=ai on_behalf_of=user (AIT-09, AIT-24).
- [ ] During an LLM outage the assistant shows unavailable and the rest of the app works (AIT-20).

**Source documentation:** `docs/09-ai/AI_ARCHITECTURE.md`; `docs/09-ai/AI_TOOL_CATALOG.md`; `docs/09-ai/AI_GUARDRAILS.md`; `docs/09-ai/AI_SECURITY.md`; `docs/13-devops/CONFIGURATION.md (AI_*)`

**Traceability:** REQ: FR-AI-01, FR-AI-02, FR-AI-03, FR-AI-07 · BR: BR-AI-01, BR-AI-02, BR-AI-04 · US: US-39, US-40 · WF: WF-23 · SCR: SCR-301 · TESTS: AIT-01, AIT-03, AIT-04, AIT-09, AIT-10, AIT-11, AIT-12, AIT-19, AIT-20, AIT-21, AIT-24 · DEMO: Demo 14, Demo 22

**Risks:** LLM cost/availability (R-08); Prompt injection (R-06)

**Unknowns / decisions:** D-15 LLM provider approval and API key

### VX-023 — Implement budgets, levy schedule generation and automatic levy runs with notices and pay links

- **Epic:** EP-04 EPIC: Strata — Trust Ledger, Budgets & Levies · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** Day 3 — Product Experience · **Priority:** P0 · **Estimate:** 3.5 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, FEATURE
- **Depends on:** VX-020, VX-022, VX-062, VX-009

Budget lines by fund/account with states draft → proposed → approved (SM-01); levy preview endpoint; generation of the schedule from the approved budget; daily levy-run job at due − lead_days plus a manual run (Idempotency-Key); charges posted to the ledger; a notice per lot with CRN and a pay link from mock-payments; notice PDF rendered by the worker (Playwright) and stored as a document; notification to owners. Budget-driven automatic issuance is CONFIRMED (EV-020/021), pay-now links are CONFIRMED (EV-050), and the formula is PROPOSED (VX-020). Also POST /strata/charges for sundry charges to lots or non-owner debtors (OBSERVED 'Sundry' debtor type, EV-030), needed for the Aged Debtors Sundry group.

**Acceptance criteria**

- [ ] Only an approved budget can generate a schedule (BR-ST-02).
- [ ] When the Clock reaches due − 30 days, each lot gets exactly one notice (PDF + email + pay link), and a re-run creates nothing (FT-ST-05).
- [ ] Levy charges post DR 1200 / CR 4000 per fund, and the trial balance stays at zero.
- [ ] A 1,000-lot run completes in under 30 s (PERF-03, may be validated on Day 5).

**Source documentation:** `docs/03-strata/LEVY_ENGINE.md`; `docs/01-product/WORKFLOW_CATALOG.md (WF-04, WF-05)`; `docs/05-architecture/STATE_MACHINES.md (SM-01, SM-02, SM-03)`; `docs/07-api/OPENAPI.yaml (/strata/budgets/*, /levy-runs)`

**Traceability:** REQ: FR-ST-04, FR-ST-05, FR-ST-06, FR-ST-07 · US: US-07, US-08 · WF: WF-04, WF-05 · BR: BR-ST-02, BR-ST-03, BR-ST-04 · SCR: SCR-106, SCR-107 · TESTS: FT-ST-03, FT-ST-05, PERF-03, FT-ST-06 · DEMO: Demo 3, Demo 4

**Unknowns / decisions:** D-01; D-02 (discount)

### VX-024 — Implement payments (pay-now webhook, manual receipt, allocation) and bank statement import with auto-match and reconciliation lock

- **Epic:** EP-05 EPIC: Strata — Payments & Bank Reconciliation · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** Day 3 — Product Experience · **Priority:** P0 · **Estimate:** 3.5 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, INTEGRATION, FEATURE
- **Depends on:** VX-020, VX-022, VX-062

Payment webhook (HMAC, idempotent on provider ref) → payment, allocation, receipt notification, credit for overpayment; manual quick receipt; statement import (CSV + camt.053) into bank_transactions with gap/duplicate checks; auto-match rules (provider ref → CRN + amount → amount + date window = suggested); manual match/exclude; reconciliation summary and lock. Automated reconciliation and auto-matching to owner/lot are CONFIRMED (EV-042, EV-051); the matching algorithm is UNKNOWN (U-25) → PROPOSED.

**Acceptance criteria**

- [ ] A duplicate webhook creates a single payment (INT-T-06, FAILREC-05).
- [ ] A $50 overpayment becomes credit and auto-applies to the next levy (FT-ST-08).
- [ ] Seeded statement: ≥ 18 of 20 lines auto-matched, 1 suggested, 1 unmatched (FT-ST-10).
- [ ] A reconciliation locks only when the difference is 0, and posting to that period is then rejected (FT-ST-11).
- [ ] A pay-link token for lot A cannot pay lot B's charges (SEC-18).

**Source documentation:** `docs/01-product/WORKFLOW_CATALOG.md (WF-06, WF-07)`; `docs/03-strata/TRUST_ACCOUNTING.md (Bank reconciliation)`; `docs/10-integrations/DATA_MAPPING.md`; `docs/10-integrations/ERROR_HANDLING.md`; `docs/07-api/OPENAPI.yaml (/strata/payments, /bank-*)`

**Traceability:** REQ: FR-ST-08, FR-ST-09, FR-ST-10, FR-IN-01, FR-IN-02 · US: US-09, US-10, US-11 · WF: WF-06, WF-07 · BR: BR-ST-05, BR-ST-06 · SCR: SCR-108, SCR-109, SCR-152 · TESTS: FT-ST-07, FT-ST-08, FT-ST-10, FT-ST-11, INT-T-01, INT-T-02, INT-T-03, INT-T-05, INT-T-06, INT-T-08, FAILREC-05, SEC-07, SEC-18 · DEMO: Demo 5, Demo 6

**Risks:** Bank matching accuracy (R-11).

**Unknowns / decisions:** D-03; D-07; D-08

### VX-043 — Implement service requests, triage and FM work order lifecycle with assignment, evidence and SLA engine

- **Epic:** EP-12 EPIC: FM — Service Requests, Work Orders & SLA · **Module:** 04 · FM
- **Lane:** DEV3 · **Cycle:** Day 3 — Product Experience · **Priority:** P0 · **Estimate:** 4.5 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** FM, FEATURE
- **Depends on:** VX-040, VX-041, VX-042, VX-009, VX-062

Service requests (portal, staff, API from mock resident app with idempotent externalId) → triage (priority, category, asset, convert) → WorkOrder (SM-17 guards: assignment gate, check-in, checklist, evidence rule, NTE → awaiting_approval) → assignment (technician/supplier) → transitions endpoint with clientEventId → evidence photos via documents → time entries. SLA engine: due times from policy + calendar, 5-minute at-risk/breach job, pause on hold. Outbound status webhooks to the resident app (fm.workorder.*). Triage, assignment, photo evidence and real-time status back are CONFIRMED (EV-085, EV-086).

**Acceptance criteria**

- [ ] A resident-app request with the same externalId twice returns the existing request (INT-T-12).
- [ ] Triage P2 sets SLA due times per calendar, and the warranty flag shows when the asset is under warranty (FT-FM-07).
- [ ] new → completed directly returns 409 (API-STATE-01); completion without a photo in an evidence-required category returns 422 EVIDENCE_REQUIRED.
- [ ] Clock at 80% / 100% produces at_risk / breached events and notifications (FT-FM-09); on_hold time extends due times (FT-FM-10).
- [ ] On completion, mock-resident-app receives a signed webhook with status, completed_at and signed photo URL (INT-T-14).

**Source documentation:** `docs/03-fm/WORK_MANAGEMENT.md`; `docs/01-product/WORKFLOW_CATALOG.md (WF-17, WF-18, WF-19, WF-26)`; `docs/05-architecture/STATE_MACHINES.md (SM-16, SM-17, SM-18)`; `docs/07-api/OPENAPI.yaml (/fm/service-requests, /fm/work-orders/*, /integrations/resident-apps)`; `docs/07-api/WEBHOOKS.md`; `docs/10-integrations/DATA_MAPPING.md (WO status → resident app)`

**Traceability:** REQ: FR-FM-06, FR-FM-07, FR-FM-08, FR-FM-09, FR-IN-05 · US: US-30, US-31, US-32, US-34, US-44 · WF: WF-17, WF-18, WF-19, WF-26 · BR: BR-FM-01, BR-FM-02, BR-FM-03, BR-FM-07, BR-FM-08, BR-FM-09 · SCR: SCR-209, SCR-210, SCR-211, SCR-261 · TESTS: FT-FM-06, FT-FM-07, FT-FM-08, FT-FM-09, FT-FM-10, API-STATE-01, INT-T-11, INT-T-12, INT-T-13, INT-T-14, WH-02 · DEMO: Demo 15, Demo 16, Demo 17, Demo 18

**Risks:** Largest FM item; split assignment/SLA if behind at Day 3 midday.

**Unknowns / decisions:** D-10 SLA matrix

### VX-044 — Implement PPM maintenance plans, occurrence generation and 52-week planner API

- **Epic:** EP-11 EPIC: FM — Planned Maintenance & 52-week Planner · **Module:** 04 · FM
- **Lane:** DEV3 · **Cycle:** Day 3 — Product Experience · **Priority:** P1 · **Estimate:** 2 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** FM, FEATURE
- **Depends on:** VX-040, VX-041, VX-043

Maintenance plans (RRULE, lead days, duration, checklist, default assignee, statutory flag); nightly job that materialises 52 weeks of occurrences and creates planned WOs at due − lead (skip_if_open); assignee notification (EV-092); GET /fm/planner (weekly buckets, workload minutes by trade). Planned work against assets/locations and the 52-week planner are CONFIRMED (EV-075).

**Acceptance criteria**

- [ ] A monthly plan with lead 7 creates exactly one WO at due − 7, even when the job runs twice (FT-FM-04).
- [ ] The planner returns 52 weekly columns with hour totals (FT-FM-05).
- [ ] The assigned technician receives a notification (NOT-05).

**Source documentation:** `docs/03-fm/WORK_MANAGEMENT.md (Planned maintenance)`; `docs/01-product/WORKFLOW_CATALOG.md (WF-16)`; `docs/02-requirements/BUSINESS_RULES.md (BR-FM-04, BR-FM-05)`; `docs/07-api/OPENAPI.yaml (/fm/planner)`

**Traceability:** REQ: FR-FM-04, FR-FM-05 · US: US-29 · WF: WF-16 · BR: BR-FM-04, BR-FM-05 · SCR: SCR-207, SCR-208 · TESTS: FT-FM-04, FT-FM-05, NOT-05, E2E-FM-02 · DEMO: Demo 20

### VX-063 — Build Strata staff screens for the demo path (dashboard, schemes, lot ledger, budget/levies, receipts, bank rec, arrears, invoices)

- **Epic:** EP-19 EPIC: Frontend Shell & Staff UX · **Module:** 09 · Frontend & UX
- **Lane:** DEV4 · **Cycle:** Day 3 — Product Experience · **Priority:** P0 · **Estimate:** 3.5 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** FRONTEND, STRATA, FEATURE
- **Depends on:** VX-061, VX-021, VX-022

SCR-101 (KPI tiles; charts wired once VX-070 lands), SCR-102/103/104 (scheme detail tabs: overview, lots, funds, ledger), SCR-106 budget grid + levy preview modal, SCR-107 levy runs, SCR-108 quick receipt, SCR-109 two-pane matcher + lock, SCR-110 arrears console, SCR-111/112 invoice inbox + approval. Screens are built against the API contract and can use mock data until VX-023/024/025/026 merge (Day 3–4). Staff UI is UNKNOWN for Urbanise (G-02), so these layouts are PROPOSED.

**Acceptance criteria**

- [ ] UF-02 (budget → levy preview → approve) completes in the UI.
- [ ] UF-05 bank rec: upload → auto-match summary → resolve → lock, with a typed confirmation.
- [ ] Every screen shows loading, empty, error and permission states.

**Source documentation:** `docs/08-ux/SCREEN_INVENTORY.md (SCR-101..112)`; `docs/08-ux/USER_FLOWS.md (UF-01..07)`; `docs/08-ux/TABLES.md`; `docs/08-ux/DASHBOARDS.md`

**Traceability:** REQ: FR-ST-01, FR-ST-04, FR-ST-06, FR-ST-09, FR-ST-10, FR-ST-12, FR-ST-16, FR-ST-29 · SCR: SCR-101, SCR-102, SCR-103, SCR-104, SCR-106, SCR-107, SCR-108, SCR-109, SCR-110, SCR-111, SCR-112 · TESTS: E2E-ST-01, E2E-ST-02, E2E-ST-03, E2E-ST-04, E2E-ST-05 · DEMO: Demo 1, Demo 2, Demo 3, Demo 4, Demo 6, Demo 7, Demo 8, Demo 10

**Risks:** UI depends on several backend items. Contract-first mocking mitigates.

### VX-064 — Build FM staff screens and technician PWA for the demo path (Ops Centre, triage, WO detail, planner, job execution offline)

- **Epic:** EP-19 EPIC: Frontend Shell & Staff UX · **Module:** 09 · Frontend & UX
- **Lane:** DEV4 · **Cycle:** Day 3 — Product Experience · **Priority:** P0 · **Estimate:** 3.5 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** FRONTEND, FM, FEATURE
- **Depends on:** VX-061, VX-041, VX-043

SCR-201 Ops Centre widgets (live after VX-046), SCR-209 triage split view, SCR-210/211 WO list/detail with SLAClock, assignment dialog showing compliance gate errors, SCR-208 planner heatmap, SCR-204/205 asset register/detail. Field PWA SCR-251/252: job list, accept, check-in (GPS), checklist, photo capture (≤ 2 MB), complete; Workbox + IndexedDB offline queue syncing via /fm/me/sync with clientEventId. The Workforce app is CONFIRMED (EV-081). The PWA in place of native apps is PROPOSED (ADR-008, C-05).

**Acceptance criteria**

- [ ] A technician completes a job offline, and after reconnecting the events sync exactly once (E2E-FM-05).
- [ ] Assigning a non-compliant contractor shows the SUPPLIER_NON_COMPLIANT reason (E2E-FM-06).
- [ ] The field PWA has no horizontal scroll at 375 px (UI-RESP).

**Source documentation:** `docs/08-ux/SCREEN_INVENTORY.md (SCR-201..212, SCR-251..253)`; `docs/08-ux/USER_FLOWS.md (UF-10, UF-11)`; `docs/03-fm/OPS_CENTRE_AND_PORTAL.md`; `docs/15-build/IMPLEMENTATION_GUIDE.md (Offline PWA)`

**Traceability:** REQ: FR-FM-05, FR-FM-07, FR-FM-08, FR-FM-10, FR-FM-15 · SCR: SCR-201, SCR-204, SCR-205, SCR-208, SCR-209, SCR-210, SCR-211, SCR-251, SCR-252 · TESTS: E2E-FM-01, E2E-FM-05, E2E-FM-06, UI-RESP, FT-FM-11 · DEMO: Demo 16, Demo 17, Demo 20

**Risks:** Offline sync complexity (R-12). Fall back to an online-only demo if needed.

**Unknowns / decisions:** C-05 FM app split

### VX-011 — Implement global search index and /search endpoint (scope-filtered)

- **Epic:** EP-15 EPIC: Shared Workflow — Documents, Notifications, Approvals, Tasks, Search · **Module:** 05 · Workflow, Documents & Notifications
- **Lane:** DEV1 · **Cycle:** none · **Priority:** P2 · **Estimate:** 2 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** PLATFORM, FEATURE, POST-DAY-5
- **Depends on:** VX-006, VX-007

Outbox consumer that upserts platform.search_index with scope_keys, plus GET /search with the permission scope filter applied before ranking. Moved to POST-DAY-5 for capacity reasons; take it on Day 4/5 only if DEV1 has slack. The ⌘K search in demo step 2 is optional.

**Acceptance criteria**

- [ ] A search for another tenant's unique scheme name returns 0 hits (TEN-03).
- [ ] Results contain only in-scope entities.

**Source documentation:** `docs/04-shared-platform/COMMON_SERVICES.md (Search)`; `docs/07-api/OPENAPI.yaml (/search)`

**Traceability:** REQ: FR-SH-10 · US: US-46 · SCR: SCR-007 · TESTS: FT-SH-08, TEN-03 · DEMO: Demo 2 (optional)

### VX-068 — Implement document RAG: chunking, embeddings, scope-filtered hybrid retrieval and citation validator

- **Epic:** EP-16 EPIC: AI Assistant & RAG · **Module:** 06 · AI & Intelligence
- **Lane:** DEV1 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P1 · **Estimate:** 3 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** AI, SECURITY, FEATURE
- **Depends on:** VX-008, VX-066, D-15

Indexer on document.scanned for RAG kinds (by-laws, minutes, insurance): extract text with pages (OCR fallback optional), heading-aware 800-token chunks, 1024-d embeddings, ai.document_chunks with scope_keys and visibility. Retrieval filters tenant, scope and visibility in SQL before vector + BM25 ranking with RRF top-8. Includes the search_documents tool, citation validator (cited ids ⊆ retrieved), untrusted-content delimiters, and chunk removal when a document is deleted. Source-backed answers are CONFIRMED for the partner AI (EV-114). The RAG design is PROPOSED.

**Acceptance criteria**

- [ ] "Are pets allowed?" returns an answer citing by-laws p.7 (AIT-05).
- [ ] Committee-only minutes are never retrieved for users without visibility (AIT-06); same text in T2 is never retrieved (TEN-07).
- [ ] Injected instructions inside minutes are not followed (AIT-08).
- [ ] A deleted document's chunks are gone within 10 min (DOC-07).

**Source documentation:** `docs/09-ai/RAG_ARCHITECTURE.md`; `docs/09-ai/DOCUMENT_RAG.md`; `docs/09-ai/AI_GUARDRAILS.md`; `docs/09-ai/AI_SECURITY.md`; `docs/06-database/SCHEMA.sql (ai.document_chunks)`

**Traceability:** REQ: FR-AI-04 · BR: BR-AI-03 · US: US-41 · TESTS: AIT-05, AIT-06, AIT-07, AIT-08, AIT-22, AIT-25, DOC-07, DOC-08, TEN-07 · DEMO: Demo 14

**Risks:** Prompt injection (R-06); embedding provider availability.

**Unknowns / decisions:** D-15

### VX-012 — Apply security hardening: headers/CSP, rate limits, CI SAST & dependency scans, audit verifier and invariants job

- **Epic:** EP-20 EPIC: Security Hardening & Verification · **Module:** 10 · Security & Compliance
- **Lane:** DEV1 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P0 · **Estimate:** 3.5 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** SECURITY, DEVOPS, TEST
- **Depends on:** VX-003, VX-006, VX-022

Security headers and CSP on web and API; Redis token-bucket rate limits (per user, IP, pay link); body size limits; Semgrep, OSV and Trivy in CI; nightly audit hash-chain verifier; invariants job INV-01..05 with a metric; final route-permission audit; secrets review (only in env / secret manager).

**Acceptance criteria**

- [ ] CSP, HSTS, X-Content-Type-Options and frame-ancestors are present (SEC-15).
- [ ] 200 requests in 10 s trigger 429 with Retry-After (API-RL-01).
- [ ] SQLi and XSS payloads are neutralised (SEC-01/02); mass-assignment fields are rejected (SEC-04).
- [ ] INV-01..05 pass on the seeded data.

**Source documentation:** `docs/05-architecture/SECURITY_ARCHITECTURE.md`; `docs/13-devops/DEVSECOPS.md`; `docs/06-database/DATA_GOVERNANCE.md (INV-01..05)`; `docs/12-testing/SECURITY_TESTS.md`

**Traceability:** REQ: NFR-06, NFR-07, NFR-09, NFR-10 · TESTS: SEC-01, SEC-02, SEC-04, SEC-13, SEC-15, SEC-17, API-RL-01, INV-01, INV-02, INV-03, INV-04, INV-05 · DEMO: Demo 23

### VX-025 — Implement arrears engine: levels L1–L3, notices, penalties, hold, debt referral to mock collections

- **Epic:** EP-06 EPIC: Strata — Arrears & Debt Recovery · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P0 · **Estimate:** 2.5 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, FEATURE
- **Depends on:** VX-020, VX-023, VX-024, VX-009, VX-062

Arrears policy per scheme (defaults 14/35/60 days), nightly job computing buckets and levels, level-change notices and tasks, monthly penalty charges, hold/release (dispute or plan), manager-approved referral to mock collections with status webhooks. Multi-level automated arrears and the LevyCollect handoff are CONFIRMED (EV-024, EV-026); the Debtor Level field is OBSERVED (EV-025); thresholds are UNKNOWN (U-21) → configurable PROPOSED defaults pending D-04.

**Acceptance criteria**

- [ ] At 14, 35 and 60 days overdue a lot reaches L1, L2 and L3, each with a notice (FT-ST-12).
- [ ] The monthly penalty equals principal × rate × days / 365, rounded half-up (FT-ST-13).
- [ ] A lot on hold receives no escalation or penalty (FT-ST-15).
- [ ] Referring an L3 case sends it to mock collections, and status webhooks update the referral (FT-ST-14).

**Source documentation:** `docs/03-strata/ARREARS_AND_DEBT_RECOVERY.md`; `docs/01-product/WORKFLOW_CATALOG.md (WF-08)`; `docs/05-architecture/STATE_MACHINES.md (SM-07, SM-08)`; `docs/02-requirements/BUSINESS_RULES.md (BR-ST-07..11)`

**Traceability:** REQ: FR-ST-11, FR-ST-12, FR-ST-13, FR-ST-14, FR-IN-03 · US: US-12, US-13 · WF: WF-08 · BR: BR-ST-08, BR-ST-09, BR-ST-11 · SCR: SCR-110 · TESTS: FT-ST-12, FT-ST-13, FT-ST-14, FT-ST-15, INT-T-09, FIN-07 · DEMO: Demo 7

**Risks:** Wrong thresholds per jurisdiction (⚖).

**Unknowns / decisions:** D-02; D-04

### VX-026 — Implement supplier invoices with approval routing (staff/committee) and payment batches to mock bank

- **Epic:** EP-07 EPIC: Strata — Supplier Invoices, Procurement & Approvals · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P1 · **Estimate:** 2.5 h · **State:** Backlog
- **Evidence:** OBSERVED · **Labels:** STRATA, FEATURE
- **Depends on:** VX-010, VX-022, VX-042, VX-062

Invoice capture (upload PDF + manual coding: supplier, scheme, invoice no., dates, amount, GST, fund, account), duplicate check, budget-remaining calculation, approval routing (> $1,000 manager, > $5,000 committee), and ledger posting on approval. Payment batch of approved invoices from compliant suppliers only goes to the mock bank payables endpoint, with per-item status. AI extraction is POST-DAY-5. Committee approval with budget remaining is OBSERVED (EV-040); payables from the platform are CONFIRMED (EV-052).

**Acceptance criteria**

- [ ] A $3,000 invoice routes to the manager, and a $6,000 invoice to the committee (FT-ST-17/18).
- [ ] A duplicate supplier + invoice number returns 409 (FT-ST-19).
- [ ] A batch rejects non-approved invoices or non-compliant suppliers (422).
- [ ] When one batch item fails at the mock bank, that invoice returns to approved (INT-T-04).

**Source documentation:** `docs/03-strata/PROCUREMENT_AND_INVOICES.md`; `docs/01-product/WORKFLOW_CATALOG.md (WF-09)`; `docs/02-requirements/BUSINESS_RULES.md (BR-ST-13..16)`; `docs/07-api/OPENAPI.yaml (/strata/supplier-invoices, /payment-batches)`

**Traceability:** REQ: FR-ST-16, FR-ST-17, FR-ST-24 · US: US-14, US-15, US-16 · WF: WF-09 · BR: BR-ST-13, BR-ST-14, BR-ST-15, BR-ST-16 · SCR: SCR-111, SCR-112, SCR-156 · TESTS: FT-ST-17, FT-ST-18, FT-ST-19, FT-ST-20, INT-T-04 · DEMO: Demo 8, Demo 9, Demo 10

### VX-070 — Implement Aged Debtors report (JSON/PDF) and Strata dashboard KPIs

- **Epic:** EP-18 EPIC: Reporting & Dashboards · **Module:** 08 · Reporting & Analytics
- **Lane:** DEV2 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P0 · **Estimate:** 1.5 h · **State:** Backlog
- **Evidence:** OBSERVED · **Labels:** REPORTING, STRATA, FEATURE
- **Depends on:** VX-022, VX-025

reporting.v_lot_ageing view; GET /strata/reports/aged-debtors?format=json|pdf|csv reproducing the OBSERVED structure (EV-028): columns Building/Floor/Lot No., Unit, Name, Type, Debtor Level, 1–30, 31–60, 61–90, 91+ (From Due Date), Total; Levy and Sundry groups with subtotals; grand total; 'gross of GST' note; 'Excludes Unpresented Transactions' flag. The styling is our own, not a copy. Dashboard endpoint for KPI-ST-01/02/03/05/09/10.

**Acceptance criteria**

- [ ] Report totals equal the ledger query for overdue receivables (FIN-10).
- [ ] The PDF contains the observed column set, groups and footer (FT-ST-31).
- [ ] Dashboard KPI values equal reference SQL (FT-ST-33).

**Source documentation:** `docs/11-reporting/REPORT_SPECIFICATION.md (RPT-ST-01)`; `docs/11-reporting/KPI_CATALOG.md (KPI-ST-*)`; `docs/11-reporting/DATA_SOURCES.md`; `docs/00-discovery/EVIDENCE_REGISTER.md (EV-028)`

**Traceability:** REQ: FR-ST-27, FR-ST-29 · US: US-26 · SCR: SCR-101, SCR-118 · TESTS: FT-ST-31, FT-ST-33, FIN-10, PERF-07 · DEMO: Demo 1, Demo 11

### VX-045 — Implement client variation approvals (NTE) and FM customer portal request tracking

- **Epic:** EP-12 EPIC: FM — Service Requests, Work Orders & SLA · **Module:** 04 · FM
- **Lane:** DEV3 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P1 · **Estimate:** 2 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** FM, FEATURE
- **Depends on:** VX-010, VX-043

WO cost above NTE → awaiting_approval with an ApprovalRequest scoped to the client's properties; on approve the WO resumes and on reject it is cancelled or re-quoted. fm_client APIs (/fm/portal/requests) to raise and track requests with a status timeline. Client approval workflow is CONFIRMED (EV-090); the branded customer portal is CONFIRMED (EV-084, W19).

**Acceptance criteria**

- [ ] A cost above NTE blocks the WO until the client approves; approval resumes it (FT-FM-15).
- [ ] An fm_client cannot see or approve another client's WOs (RBAC-N07, RBAC-N13).

**Source documentation:** `docs/03-fm/WORK_MANAGEMENT.md (Client approvals)`; `docs/03-fm/OPS_CENTRE_AND_PORTAL.md (Customer portal)`; `docs/01-product/WORKFLOW_CATALOG.md (WF-21)`

**Traceability:** REQ: FR-FM-06, FR-FM-13 · US: US-30, US-36 · WF: WF-21 · BR: BR-FM-09, BR-FM-10 · SCR: SCR-215, SCR-261 · TESTS: FT-FM-15, E2E-FM-03, RBAC-N07, RBAC-N13 · DEMO: Demo 19

### VX-046 — Implement Ops Centre aggregates and basic FM analytics (cost by property, SLA %, supplier performance)

- **Epic:** EP-18 EPIC: Reporting & Dashboards · **Module:** 08 · Reporting & Analytics
- **Lane:** DEV3 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P1 · **Estimate:** 2 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** REPORTING, FM, FEATURE
- **Depends on:** VX-043, VX-044

GET /fm/ops-centre with open WOs by status, at-risk/breached, today planned vs done, unassigned, awaiting approval, and compliance alerts. Materialised views mv_sla and mv_fm_cost with a manual refresh, served by /fm/analytics for cost by property, SLA compliance % and supplier performance. Ops Centre and analytics are CONFIRMED (EV-071, EV-079). The BI stack is UNKNOWN (U-10).

**Acceptance criteria**

- [ ] Ops Centre widget counts equal direct SQL (FT-FM-17).
- [ ] Cost totals equal the sum of WO cost (FT-FM-18).

**Source documentation:** `docs/03-fm/OPS_CENTRE_AND_PORTAL.md`; `docs/11-reporting/KPI_CATALOG.md (KPI-FM-01, 02, 04, 08, 09, 11)`; `docs/11-reporting/DASHBOARD_SPECIFICATION.md (DB-FM-01, DB-FM-02)`

**Traceability:** REQ: FR-FM-15, FR-FM-16 · US: US-34, US-38 · SCR: SCR-201, SCR-216 · TESTS: FT-FM-17, FT-FM-18, PERF-06 · DEMO: Demo 16, Demo 21 (basic)

### VX-047 — Implement 10-year asset lifecycle plan generation and CAPEX export

- **Epic:** EP-10 EPIC: FM — Properties, Assets & Lifecycle · **Module:** 04 · FM
- **Lane:** DEV3 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P1 · **Estimate:** 2 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** FM, FEATURE
- **Depends on:** VX-040, VX-041

POST /fm/asset-plans (scope, start year, escalation) → generate lines with the lifecycle formula from VX-040 → publish → RPT-FM-03 CAPEX matrix (year × property/category) as JSON/CSV and a simple PDF. 10-year plans are CONFIRMED (EV-072, EV-073); the method and benchmarks are UNKNOWN (U-27), so the seeded defaults are illustrative.

**Acceptance criteria**

- [ ] Plan lines match the formula for seeded assets (FT-FM-03).
- [ ] The CAPEX matrix total equals the sum of lines.

**Source documentation:** `docs/03-fm/ASSET_LIFECYCLE.md`; `docs/01-product/WORKFLOW_CATALOG.md (WF-22)`; `docs/11-reporting/REPORT_SPECIFICATION.md (RPT-FM-03)`

**Traceability:** REQ: FR-FM-03 · US: US-28 · WF: WF-22 · BR: BR-FM-12 · SCR: SCR-206 · TESTS: FT-FM-03, E2E-FM-04 · DEMO: Demo 20

**Risks:** Lifecycle assumptions unvalidated (R-17).

**Unknowns / decisions:** D-11

### VX-065 — Build owner portal PWA (home tiles, ledger & pay, requests, documents, committee approvals)

- **Epic:** EP-09 EPIC: Strata — Owner Portal (PWA) · **Module:** 09 · Frontend & UX
- **Lane:** DEV4 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P0 · **Estimate:** 2.5 h · **State:** Backlog
- **Evidence:** OBSERVED · **Labels:** FRONTEND, STRATA, FEATURE
- **Depends on:** VX-061, VX-024, VX-026, VX-008

/portal PWA: SCR-151 home (owner balance and next due; committee fund tiles Admin cash, Capital works cash, Bank balance, Investments, Scheme arrears, as OBSERVED in EV-038); SCR-152 ledger with penalty lines and pay (EV-039, EV-050); SCR-153 requests; SCR-154 documents; SCR-156 committee invoice approval card with budget remaining (EV-040). Uses tenant branding and no Urbanise trademarks ('Vertex Owner Portal').

**Acceptance criteria**

- [ ] An owner sees only their own lots; an occupier gets 403 for the scheme summary (RBAC-N03).
- [ ] Committee tiles equal the GL balances (FT-ST-28).
- [ ] The pay flow returns to the ledger showing the receipt.

**Source documentation:** `docs/03-strata/OWNER_PORTAL_AND_COMMS.md`; `docs/08-ux/SCREEN_INVENTORY.md (SCR-151..156)`; `docs/07-api/API_CATALOG.md (Owner portal)`

**Traceability:** REQ: FR-ST-23, FR-ST-24 · US: US-09, US-15, US-22, US-23, US-24 · WF: WF-13 · BR: BR-ST-20 · SCR: SCR-151, SCR-152, SCR-153, SCR-154, SCR-156 · TESTS: FT-ST-27, FT-ST-28, E2E-ST-08, RBAC-N03 · DEMO: Demo 5, Demo 9

**Unknowns / decisions:** C-04 owner portal identity

### VX-069 — Build AI assistant panel UI (streaming, citations, action proposal confirm)

- **Epic:** EP-16 EPIC: AI Assistant & RAG · **Module:** 09 · Frontend & UX
- **Lane:** DEV4 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P1 · **Estimate:** 1.5 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** FRONTEND, AI, FEATURE
- **Depends on:** VX-060, VX-066

SCR-301 right drawer (⌘J): SSE token streaming, tool-step indicators, CitationChips that open a record or the document at a page, ActionProposalCard with Confirm/Discard, unavailable and budget-exceeded states, and a markdown renderer with no remote images (AIT-25).

**Acceptance criteria**

- [ ] A proposal executes only after Confirm (E2E-AI-01).
- [ ] Remote images in answers are not loaded (AIT-25).

**Source documentation:** `docs/08-ux/SCREEN_INVENTORY.md (SCR-301)`; `docs/08-ux/UX_STATES.md (AI streaming)`; `docs/09-ai/AI_GUARDRAILS.md (Output guardrails)`

**Traceability:** REQ: FR-AI-01, FR-AI-04 · SCR: SCR-301 · TESTS: E2E-AI-01, AIT-25 · DEMO: Demo 14

### VX-067 — Build cross-module Playwright E2E suite for the Demo Lite path and seed reset

- **Epic:** EP-21 EPIC: Testing & Quality · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV4 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P0 · **Estimate:** 1.5 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** QA, TEST
- **Depends on:** VX-063, VX-064, VX-065

Playwright tests against the compose stack: E2E-ST-02 (budget → levy → owner pays), E2E-ST-03 (reconcile), E2E-ST-05 (invoice → committee mobile approval → batch), E2E-FM-01 (resident request → completion), E2E-AI-01, plus axe scans of primary screens. `pnpm seed --reset demo` completes in about 2 min.

**Acceptance criteria**

- [ ] The suite runs headless in CI against a fresh seed and passes.
- [ ] axe reports 0 serious/critical issues on demo-path screens.

**Source documentation:** `docs/12-testing/UI_E2E_TESTS.md`; `docs/15-build/DEMO_SCRIPT.md`; `docs/16-plane/PROJECT_MODEL.md (Demo Lite)`

**Traceability:** TESTS: E2E-ST-02, E2E-ST-03, E2E-ST-05, E2E-FM-01, E2E-AI-01, UI-A11Y · DEMO: Demo Lite all

**Risks:** Day 4 integration slips compress this item → Day 5 morning buffer.

### VX-071 — Deploy demo environment (compose on single VM) with seed reset and smoke check

- **Epic:** EP-22 EPIC: DevOps & Environments · **Module:** 12 · DevOps & Deployment
- **Lane:** DEV4 · **Cycle:** Day 4 — Integration & Hardening · **Priority:** P0 · **Estimate:** 1 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** DEVOPS
- **Depends on:** VX-001, VX-012

Single-VM demo environment (TLS via Caddy) running the compose stack with mocks and Mailpit. Secrets come from the environment (no repo secrets). Includes a migrate + seed demo script and a smoke test (login, list schemes, create WO in sandbox). The cloud reference deployment (ECS/Helm) is POST-DAY-5.

**Acceptance criteria**

- [ ] The demo URL serves the app over TLS; smoke passes; reset restores the seed in under 5 min.
- [ ] Rollback = redeploy previous image tag (documented).

**Source documentation:** `docs/13-devops/DEPLOYMENT.md`; `docs/13-devops/ENVIRONMENTS.md (demo)`; `docs/13-devops/SECRETS.md`; `docs/13-devops/ROLLBACK.md`

**Traceability:** REQ: NFR-05 · TESTS: Smoke · DEMO: Day 5 environment

**Risks:** No cloud account/VM provisioned (external dependency) → fallback: presenter laptop running compose.

**Unknowns / decisions:** Hosting target not yet chosen (D-16).

### VX-090 — Day 5: Full system smoke and Demo Lite critical-workflow run

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV4 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P0 · **Estimate:** 2 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** QA, TEST
- **Depends on:** VX-067, VX-071

Run the E2E suite and a manual walk-through of every Demo Lite step on the demo environment; log defects as BUG items linked to their source item.

**Acceptance criteria**

- [ ] Every Demo Lite step passes or has a linked BUG item with severity.

**Source documentation:** `docs/15-build/DEMO_SCRIPT.md`; `docs/16-plane/PROJECT_MODEL.md (Demo Lite)`

**Traceability:** TESTS: E2E-* · DEMO: Demo Lite all

### VX-091 — Day 5: Security validation run (auth, RBAC negatives, tenant isolation, document access, AI authz/injection)

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 10 · Security & Compliance
- **Lane:** DEV1 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P0 · **Estimate:** 2 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** SECURITY, TEST
- **Depends on:** VX-007, VX-012, VX-068

Execute and record results for API-AUTH, RBAC-N01..16 (implemented subset), TEN-01..12 (subset), DOC-01..08, SEC subset and AIT-03/04/06/08/18. Record results in the Release Gate item.

**Acceptance criteria**

- [ ] Zero cross-tenant leaks; zero AI authorization leaks; any failure is a P0 BUG that blocks the gate.

**Source documentation:** `docs/12-testing/SECURITY_TESTS.md`; `docs/09-ai/AI_TEST_CASES.md`

**Traceability:** TESTS: TEN-*, RBAC-N*, DOC-*, SEC-*, AIT-03, AIT-04, AIT-06, AIT-08, AIT-18 · DEMO: Demo 23

### VX-092 — Day 5: Strata financial integrity validation (FIN tests, invariants, report totals)

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV2 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P0 · **Estimate:** 2 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** STRATA, TEST
- **Depends on:** VX-025, VX-026, VX-070

Run FIN-01..10 and INV-01..05 on demo data; reconcile Aged Debtors totals and dashboard KPIs against the ledger; dry-run Strata demo steps 1–11.

**Acceptance criteria**

- [ ] All FIN/INV pass; report totals equal ledger.

**Source documentation:** `docs/12-testing/FINANCIAL_INTEGRITY_TESTS.md`; `docs/06-database/DATA_GOVERNANCE.md`

**Traceability:** TESTS: FIN-*, INV-* · DEMO: Demo 1–11

### VX-093 — Day 5: FM workflow validation (SLA clock, compliance gate, offline sync, resident-app round trip)

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV3 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P0 · **Estimate:** 2 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** FM, TEST
- **Depends on:** VX-043, VX-045, VX-064

Validate FT-FM-07..15, E2E-FM-01/05/06 and INT-T-11..14 on the demo environment; dry-run FM demo steps 15–20.

**Acceptance criteria**

- [ ] All listed tests pass or have linked BUG items.

**Source documentation:** `docs/12-testing/FUNCTIONAL_TESTS.md`; `docs/12-testing/INTEGRATION_TESTS.md`

**Traceability:** TESTS: FT-FM-07..15, E2E-FM-01, E2E-FM-05, E2E-FM-06, INT-T-11..14 · DEMO: Demo 15–20

### VX-094 — Day 5: AI evaluation subset run and AI demo rehearsal

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 06 · AI & Intelligence
- **Lane:** DEV1 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P1 · **Estimate:** 1.5 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** AI, TEST
- **Depends on:** VX-066, VX-068, VX-069

Run the AIT-01..25 subset implemented plus a reduced EV-STRATA-QA / EV-RAG / EV-AUTHZ / EV-INJECT set (≥ 10 cases each), and record metrics against the AI_EVALUATION gates (POC gates are indicative, given reduced datasets).

**Acceptance criteria**

- [ ] Authorization leakage = 0 and injection success = 0; accuracy and groundedness are reported with sample size.

**Source documentation:** `docs/09-ai/AI_EVALUATION.md`; `docs/09-ai/AI_TEST_CASES.md`

**Traceability:** TESTS: AIT-* · DEMO: Demo 14, Demo 22

### VX-095 — Day 5: Regression and gap-closure buffer (P0/P1 bug fixing)

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV2 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P0 · **Estimate:** 4 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** QA
- **Depends on:** VX-090

Shared buffer: every developer reserves the remaining Day 5 hours for BUG items found by VX-090..094. Re-run the E2E suite after fixes.

**Acceptance criteria**

- [ ] 0 open S1 defects; S2 defects have a documented workaround.

**Source documentation:** `docs/15-build/UAT_PLAN.md (Defect severity)`

**Traceability:** TESTS: E2E regression

### VX-096 — Day 5: Traceability and documentation verification (update matrix with Plane IDs and test results)

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV3 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P1 · **Estimate:** 1.5 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** QA, DOCUMENTATION
- **Depends on:** VX-090

Update docs/14-traceability/TRACEABILITY_MATRIX.md with a Plane item column and pass/fail per test ID. Mark features not built as POST-DAY-5. Record any design change in docs without altering evidence rows.

**Acceptance criteria**

- [ ] Every Demo Lite feature row shows a Plane ID and test results; no evidence row edited.

**Source documentation:** `docs/14-traceability/TRACEABILITY_MATRIX.md`; `docs/00-discovery/VALIDATION_REPORT.md`

**Traceability:** 

### VX-097 — Day 5: Known-gap review and post-Day-5 backlog grooming

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV4 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P1 · **Estimate:** 1 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** DOCUMENTATION
- **Depends on:** VX-090

Review KNOWN_LIMITATIONS, decision status (D-01..D-16) and POST-DAY-5 items; re-prioritise for the next iteration; capture demo feedback.

**Acceptance criteria**

- [ ] Each POST-DAY-5 item has priority and next-iteration target; open decisions have an owner and date.

**Source documentation:** `docs/15-build/KNOWN_LIMITATIONS.md`; `docs/15-build/FUTURE_BACKLOG.md`; `docs/00-discovery/RESEARCH_GAPS.md`

**Traceability:** 

### VX-098 — Day 5: Reduced performance smoke (k6 PERF-01/03/04 at small scale)

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV3 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P2 · **Estimate:** 1 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** QA, TEST
- **Depends on:** VX-071

Run small-scale k6 scripts (50 VUs, demo dataset) and report p95s. The full perf dataset and soak are POST-DAY-5.

**Acceptance criteria**

- [ ] p95 results recorded; any NFR miss is logged as a POST-DAY-5 item.

**Source documentation:** `docs/12-testing/PERFORMANCE_TESTS.md`; `docs/02-requirements/NON_FUNCTIONAL_REQUIREMENTS.md`

**Traceability:** TESTS: PERF-01, PERF-03, PERF-04

### VX-099 — Release Readiness / Demo Gate

- **Epic:** EP-23 EPIC: Day 5 Validation, Demo & Release Gate · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV1 · **Cycle:** Day 5 — Validation & Demo · **Priority:** P0 · **Estimate:** 1 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** QA, DOCUMENTATION
- **Depends on:** VX-090, VX-091, VX-092, VX-093, VX-094, VX-095, VX-096

Go/no-go for the Day 5 demo using the POC subset of 15-build/ACCEPTANCE_CHECKLIST. Record what was demonstrated, test evidence, open defects, open decisions and POST-DAY-5 scope. Product owner signs off. Do not mark Done without recorded evidence.

**Acceptance criteria**

- [ ] The gate record lists pass/fail for: Demo Lite steps, security run, FIN/INV, FM validation, AI eval; 0 S1 defects; PO decision recorded.

**Source documentation:** `docs/15-build/ACCEPTANCE_CHECKLIST.md`; `docs/00-discovery/BUILD_READINESS_REPORT.md`; `docs/16-plane/pages/05_BUILD_READINESS.md`

**Traceability:** TESTS: All Day 5 runs · DEMO: Demo Lite

### D-01 — Decision Required: Levy apportionment & rounding rules per jurisdiction

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 03 · Strata
- **Lane:** PO/SME · **Cycle:** Day 1 — Foundation · **Priority:** P1 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, STRATA, BLOCKED / UNKNOWN
- **Depends on:** —

Evidence: the levy formula is UNKNOWN (U-20). The POC implements PROPOSED BR-ST-03 (entitlement-based, cents, remainder to last instalment and lowest lot). A strata-accountant SME must confirm or amend this per jurisdiction (QLD/NSW) before UAT. It does not block Day 1–4, because the default is configurable.

**Acceptance criteria**

- [ ] SME decision recorded; config defaults updated, or confirmed in writing.

**Source documentation:** `docs/00-discovery/UNKNOWN_INFORMATION.md (U-20, U-23)`; `docs/02-requirements/BUSINESS_RULES.md (BR-ST-03)`; `docs/00-discovery/RESEARCH_GAPS.md (G-04)`

**Traceability:** BR: BR-ST-03 · TESTS: FIN-01

**Risks:** Wrong legal default (R-01).

**Unknowns / decisions:** U-20

### D-02 — Decision Required: Penalty/interest and early-payment discount rules

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 03 · Strata
- **Lane:** PO/SME · **Cycle:** Day 1 — Foundation · **Priority:** P1 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, STRATA, BLOCKED / UNKNOWN
- **Depends on:** —

Penalty lines are OBSERVED (EV-039), but rates, grace, day-count and discount rules are UNKNOWN (U-22). The PROPOSED defaults are BR-ST-09/10 (10% p.a. simple, discount off).

**Acceptance criteria**

- [ ] Rates and rules confirmed per jurisdiction.

**Source documentation:** `docs/00-discovery/UNKNOWN_INFORMATION.md (U-22)`; `docs/03-strata/LEVY_ENGINE.md (Discounts & penalties)`

**Traceability:** BR: BR-ST-09, BR-ST-10

**Unknowns / decisions:** U-22

### D-03 — Decision Required: Payment allocation order

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 03 · Strata
- **Lane:** PO/SME · **Cycle:** Day 2 — Core Domains · **Priority:** P1 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, STRATA, BLOCKED / UNKNOWN
- **Depends on:** —

Allocation order is UNKNOWN. The PROPOSED BR-ST-05 is oldest due first, with penalty last.

**Acceptance criteria**

- [ ] Order confirmed by SME.

**Source documentation:** `docs/02-requirements/BUSINESS_RULES.md (BR-ST-05)`; `docs/01-product/WORKFLOW_CATALOG.md (WF-06 Business Rules [U])`

**Traceability:** BR: BR-ST-05

**Unknowns / decisions:** U-22

### D-04 — Decision Required: Arrears level thresholds, actions and fees

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 03 · Strata
- **Lane:** PO/SME · **Cycle:** Day 3 — Product Experience · **Priority:** P1 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, STRATA, BLOCKED / UNKNOWN
- **Depends on:** —

Levels exist (CONFIRMED EV-024, OBSERVED EV-025), but thresholds are UNKNOWN (U-21). The PROPOSED defaults are 14/35/60 days.

**Acceptance criteria**

- [ ] Thresholds and templates confirmed.

**Source documentation:** `docs/00-discovery/UNKNOWN_INFORMATION.md (U-21)`; `docs/03-strata/ARREARS_AND_DEBT_RECOVERY.md`

**Traceability:** BR: BR-ST-08

**Unknowns / decisions:** U-21

### D-05 — Decision Required: Meeting notice, quorum, proxy and voting threshold rules

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 03 · Strata
- **Lane:** PO/SME · **Cycle:** none · **Priority:** P2 · **Estimate:** 0 h · **State:** Backlog
- **Evidence:** UNKNOWN · **Labels:** DECISION, STRATA, BLOCKED / UNKNOWN, POST-DAY-5
- **Depends on:** —

Voting is CONFIRMED (EV-045/046), but its rules are UNKNOWN (U-24), and ownership of voting is CONFLICTED (C-11). The feature itself is POST-DAY-5.

**Acceptance criteria**

- [ ] Rules confirmed before the meetings feature starts.

**Source documentation:** `docs/00-discovery/UNKNOWN_INFORMATION.md (U-24)`; `docs/00-discovery/CONFLICTING_INFORMATION.md (C-11)`; `docs/03-strata/MEETINGS_AND_VOTING.md`

**Traceability:** BR: BR-ST-18, BR-ST-19

**Unknowns / decisions:** U-24

### D-06 — Decision Required: Trust accounting statutory requirements (AU states/NZ)

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 03 · Strata
- **Lane:** PO/SME · **Cycle:** Day 2 — Core Domains · **Priority:** P1 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, STRATA, BLOCKED / UNKNOWN
- **Depends on:** —

Trust accounting is CONFIRMED as integrated (EV-043), but statutory rules are UNKNOWN (G-05). The POC ledger is not a statutory product (KNOWN_LIMITATIONS #4).

**Acceptance criteria**

- [ ] SME lists mandatory rules; gaps logged as POST-DAY-5 items.

**Source documentation:** `docs/00-discovery/RESEARCH_GAPS.md (G-05)`; `docs/03-strata/TRUST_ACCOUNTING.md`

**Traceability:** BR: BR-ST-12

**Unknowns / decisions:** G-05

### D-07 — Decision Required: Bank statement formats and receipt matching keys (Macquarie/NAB)

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 07 · Integrations
- **Lane:** PO/SME · **Cycle:** none · **Priority:** P2 · **Estimate:** 0 h · **State:** Backlog
- **Evidence:** UNKNOWN · **Labels:** DECISION, INTEGRATION, BLOCKED / UNKNOWN
- **Depends on:** —

Bank integrations are CONFIRMED (EV-023, 049..052), but formats are UNKNOWN (U-25, G-07). The POC uses CSV/camt.053 mocks; real integration is blocked on bank developer access.

**Acceptance criteria**

- [ ] Bank developer docs obtained and adapter scope agreed.

**Source documentation:** `docs/00-discovery/UNKNOWN_INFORMATION.md (U-25)`; `docs/10-integrations/INTEGRATION_CATALOG.md (INT-01)`

**Risks:** External blocker.

**Unknowns / decisions:** U-25; G-07

### D-08 — Decision Required: Payment provider and payment rails for pay-now

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 07 · Integrations
- **Lane:** PO/SME · **Cycle:** none · **Priority:** P2 · **Estimate:** 0 h · **State:** Backlog
- **Evidence:** UNKNOWN · **Labels:** DECISION, INTEGRATION, BLOCKED / UNKNOWN
- **Depends on:** —

Pay-now is CONFIRMED (EV-050), but the rails are UNKNOWN and the source is CONFLICTED (C-08). The POC uses mock-payments only.

**Acceptance criteria**

- [ ] Provider chosen for post-POC.

**Source documentation:** `docs/00-discovery/CONFLICTING_INFORMATION.md (C-08)`

**Unknowns / decisions:** C-08

### D-09 — Decision Required: Partner integration protocols (LevyCollect, StrataVote, Conpago/MyVillage)

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 07 · Integrations
- **Lane:** PO/SME · **Cycle:** none · **Priority:** P2 · **Estimate:** 0 h · **State:** Backlog
- **Evidence:** UNKNOWN · **Labels:** DECISION, INTEGRATION, BLOCKED / UNKNOWN
- **Depends on:** —

Partner interfaces are UNKNOWN (G-19), so the POC uses generic adapters with mocks. Partner agreements are required for real integration.

**Acceptance criteria**

- [ ] Integration partners and access confirmed.

**Source documentation:** `docs/00-discovery/RESEARCH_GAPS.md (G-19)`; `docs/10-integrations/INTEGRATION_ARCHITECTURE.md`

**Risks:** External blocker.

**Unknowns / decisions:** G-19

### D-10 — Decision Required: FM SLA priority matrix and business calendars

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 04 · FM
- **Lane:** PO/SME · **Cycle:** Day 2 — Core Domains · **Priority:** P1 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, FM, BLOCKED / UNKNOWN
- **Depends on:** —

SLAs are CONFIRMED (EV-098), but their definitions are UNKNOWN (U-26). The PROPOSED BR-FM-01 matrix is P1 1h/4h through P4 5bd/20bd.

**Acceptance criteria**

- [ ] FM SME confirms defaults.

**Source documentation:** `docs/00-discovery/UNKNOWN_INFORMATION.md (U-26)`; `docs/02-requirements/BUSINESS_RULES.md (BR-FM-01..03)`

**Traceability:** BR: BR-FM-01

**Unknowns / decisions:** U-26

### D-11 — Decision Required: Asset lifecycle method and benchmark data

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 04 · FM
- **Lane:** PO/SME · **Cycle:** none · **Priority:** P2 · **Estimate:** 0 h · **State:** Backlog
- **Evidence:** UNKNOWN · **Labels:** DECISION, FM, BLOCKED / UNKNOWN
- **Depends on:** —

10-year plans are CONFIRMED (EV-073), but the method and benchmarks are UNKNOWN (U-27). The seeded useful lives are illustrative only.

**Acceptance criteria**

- [ ] Benchmark source chosen.

**Source documentation:** `docs/03-fm/ASSET_LIFECYCLE.md`; `docs/00-discovery/UNKNOWN_INFORMATION.md (U-27)`

**Traceability:** BR: BR-FM-12

**Unknowns / decisions:** U-27

### D-12 — Decision Required: Required supplier compliance document types and minimum cover

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 04 · FM
- **Lane:** PO/SME · **Cycle:** Day 2 — Core Domains · **Priority:** P2 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, FM, BLOCKED / UNKNOWN
- **Depends on:** —

Licences and insurance are CONFIRMED (EV-077) and safeguarding is CONFIRMED (EV-078), but the full type list is UNKNOWN (U-28).

**Acceptance criteria**

- [ ] Type list confirmed.

**Source documentation:** `docs/03-fm/SUPPLIERS_AND_COMPLIANCE.md`; `docs/00-discovery/UNKNOWN_INFORMATION.md (U-28)`

**Traceability:** BR: BR-SUP-02

**Unknowns / decisions:** U-28

### D-13 — Decision Required: PO sign-off on unresolved conflicts (AI status C-01, owner portal C-04, FM apps C-05, voting C-11)

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** —
- **Lane:** PO/SME · **Cycle:** Day 1 — Foundation · **Priority:** P1 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, BLOCKED / UNKNOWN
- **Depends on:** —

Four conflicts remain UNKNOWN/CONFLICT. The POC choices are: own AI gateway; single Vertex Owner Portal; one PWA with role views; native voting (post-Day-5). The PO confirms these as design choices, which does not change the evidence. This is a condition of BUILD_READINESS_REPORT.

**Acceptance criteria**

- [ ] PO sign-off recorded on page 04.

**Source documentation:** `docs/00-discovery/CONFLICTING_INFORMATION.md`; `docs/00-discovery/BUILD_READINESS_REPORT.md (Conditions)`

**Unknowns / decisions:** C-01; C-04; C-05; C-11

### D-14 — Decision Required: Obtain authorized product access / staff UI screenshots

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** —
- **Lane:** PO/SME · **Cycle:** none · **Priority:** P2 · **Estimate:** 0 h · **State:** Backlog
- **Evidence:** UNKNOWN · **Labels:** DECISION, BLOCKED / UNKNOWN
- **Depends on:** —

There is no Priority-1 evidence (G-02, G-03): the staff UI is UNKNOWN. This raises the Discovery/UX confidence scores but does not block the POC.

**Acceptance criteria**

- [ ] Access granted or explicitly declined.

**Source documentation:** `docs/00-discovery/RESEARCH_GAPS.md (G-02, G-03)`

**Unknowns / decisions:** G-02; G-03

### D-15 — Decision Required: Approve LLM & embedding providers, data processing terms, and provide API keys for dev/demo

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 06 · AI & Intelligence
- **Lane:** PO/SME · **Cycle:** Day 1 — Foundation · **Priority:** P0 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, AI, BLOCKED / UNKNOWN
- **Depends on:** —

AI features (VX-066, VX-068) need an approved provider (Anthropic Claude is the default per docs), an embedding provider, a no-training / minimal-retention setting, and keys in the secret manager. Without them, AI runs on mock-llm only. Needed by Day 3 morning. This is an external blocker.

**Acceptance criteria**

- [ ] Keys available in dev and demo secret stores; data terms approved.

**Source documentation:** `docs/09-ai/AI_ARCHITECTURE.md (Configuration)`; `docs/09-ai/AI_SECURITY.md`; `docs/13-devops/SECRETS.md`

**Traceability:** REQ: FR-AI-07

**Risks:** AI demo falls back to mock responses.

### D-16 — Decision Required: Demo hosting target (VM/cloud account) and DNS

- **Epic:** EP-24 EPIC: Decisions Required & Unknowns · **Module:** 12 · DevOps & Deployment
- **Lane:** PO/SME · **Cycle:** Day 2 — Core Domains · **Priority:** P1 · **Estimate:** 0 h · **State:** Todo
- **Evidence:** UNKNOWN · **Labels:** DECISION, DEVOPS, BLOCKED / UNKNOWN
- **Depends on:** —

VX-071 needs a VM or cloud account by Day 4. The fallback is running the compose stack on the presenter's laptop.

**Acceptance criteria**

- [ ] Host provisioned and access shared with DEV4.

**Source documentation:** `docs/13-devops/ENVIRONMENTS.md`; `docs/13-devops/DEPLOYMENT.md`

### FX-01 — Meetings, motions, e-voting, proxies and minutes

- **Epic:** EP-08 EPIC: Strata — Meetings, Voting, Comms, Wall & Insurance · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** none · **Priority:** P3 · **Estimate:** 16 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, FEATURE, POST-DAY-5
- **Depends on:** D-05

WF-11, F-ST-10, FR-ST-19..21, SCR-115/116/157, FT-ST-22..25, Demo 12.

**Acceptance criteria**

- [ ] See FT-ST-22..25.

**Source documentation:** `docs/03-strata/MEETINGS_AND_VOTING.md`

**Traceability:** REQ: FR-ST-19, FR-ST-20, FR-ST-21, FR-IN-04 · TESTS: FT-ST-22, FT-ST-23, FT-ST-24, FT-ST-25, INT-T-10

**Unknowns / decisions:** U-24; C-11

### FX-02 — Comms campaigns with dynamic audiences and test send

- **Epic:** EP-08 EPIC: Strata — Meetings, Voting, Comms, Wall & Insurance · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** none · **Priority:** P3 · **Estimate:** 8 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, FEATURE, POST-DAY-5
- **Depends on:** VX-009

WF-12, F-ST-11, FR-ST-22, SCR-117, FT-ST-26, Demo 13.

**Acceptance criteria**

- [ ] See FT-ST-26.

**Source documentation:** `docs/03-strata/OWNER_PORTAL_AND_COMMS.md`

**Unknowns / decisions:** U-32

### FX-03 — Community & committee wall with moderation

- **Epic:** EP-08 EPIC: Strata — Meetings, Voting, Comms, Wall & Insurance · **Module:** 03 · Strata
- **Lane:** DEV4 · **Cycle:** none · **Priority:** P3 · **Estimate:** 6 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, FEATURE, POST-DAY-5
- **Depends on:** VX-065

F-ST-13, FR-ST-25, SCR-155, FT-ST-29.

**Acceptance criteria**

- [ ] See FT-ST-29.

**Source documentation:** `docs/03-strata/OWNER_PORTAL_AND_COMMS.md`

**Unknowns / decisions:** U-29

### FX-04 — Strata insurance & compliance register with renewal tasks

- **Epic:** EP-08 EPIC: Strata — Meetings, Voting, Comms, Wall & Insurance · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** none · **Priority:** P3 · **Estimate:** 6 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, FEATURE, POST-DAY-5
- **Depends on:** —

WF-27, F-ST-14, FR-ST-26, SCR-119, FT-ST-30.

**Acceptance criteria**

- [ ] See FT-ST-30.

**Source documentation:** `docs/01-product/WORKFLOW_CATALOG.md (WF-27)`

### FX-05 — Quote requests, quote comparison and strata work orders (+ escalate to FM)

- **Epic:** EP-07 EPIC: Strata — Supplier Invoices, Procurement & Approvals · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** none · **Priority:** P3 · **Estimate:** 10 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** STRATA, FEATURE, POST-DAY-5
- **Depends on:** VX-042

WF-10, F-ST-09, FR-ST-18, SCR-114, FT-ST-21, Demo 7a.

**Acceptance criteria**

- [ ] See FT-ST-21.

**Source documentation:** `docs/03-strata/PROCUREMENT_AND_INVOICES.md`

### FX-06 — Data import wizard and templates (schemes, lots, owners, assets, opening balances)

- **Epic:** EP-15 EPIC: Shared Workflow — Documents, Notifications, Approvals, Tasks, Search · **Module:** 05 · Workflow, Documents & Notifications
- **Lane:** DEV1 · **Cycle:** none · **Priority:** P3 · **Estimate:** 12 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** PLATFORM, FEATURE, POST-DAY-5
- **Depends on:** —

WF-01, F-SH-09, FR-SH-12, SCR-008, FT-SH-10. Template columns are UNKNOWN (G-20).

**Acceptance criteria**

- [ ] See FT-SH-10.

**Source documentation:** `docs/04-shared-platform/COMMON_SERVICES.md (Imports)`

**Unknowns / decisions:** G-20

### FX-07 — FM inspections & compliance schedules with follow-up WOs

- **Epic:** EP-11 EPIC: FM — Planned Maintenance & 52-week Planner · **Module:** 04 · FM
- **Lane:** DEV3 · **Cycle:** none · **Priority:** P3 · **Estimate:** 6 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** FM, FEATURE, POST-DAY-5
- **Depends on:** VX-044

F-FM-11, FR-FM-14, FT-FM-16, Demo 20a.

**Acceptance criteria**

- [ ] See FT-FM-16.

**Source documentation:** `docs/03-fm/WORK_MANAGEMENT.md (Inspections)`

### FX-08 — CRM contact history and dispatch board

- **Epic:** EP-13 EPIC: FM — Workforce & Technician Mobile · **Module:** 04 · FM
- **Lane:** DEV3 · **Cycle:** none · **Priority:** P3 · **Estimate:** 10 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** FM, FEATURE, POST-DAY-5
- **Depends on:** VX-043

F-FM-14, FR-FM-11, FR-FM-17, SCR-212, SCR-217, FT-FM-12, FT-FM-19.

**Acceptance criteria**

- [ ] See FT-FM-12, FT-FM-19.

**Source documentation:** `docs/03-fm/OPS_CENTRE_AND_PORTAL.md (CRM)`

### FX-09 — Scheduled report distribution and full Strata report set (TB, I&E, BS, levy register, statements)

- **Epic:** EP-18 EPIC: Reporting & Dashboards · **Module:** 08 · Reporting & Analytics
- **Lane:** DEV2 · **Cycle:** none · **Priority:** P3 · **Estimate:** 14 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** REPORTING, POST-DAY-5
- **Depends on:** VX-070

WF-14, FR-ST-28, FR-ST-30, RPT-ST-02..12.

**Acceptance criteria**

- [ ] See FT-ST-32.

**Source documentation:** `docs/11-reporting/REPORT_SPECIFICATION.md`

### FX-10 — Full FM analytics and client self-serve reports

- **Epic:** EP-18 EPIC: Reporting & Dashboards · **Module:** 08 · Reporting & Analytics
- **Lane:** DEV3 · **Cycle:** none · **Priority:** P3 · **Estimate:** 10 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** REPORTING, FM, POST-DAY-5
- **Depends on:** VX-046

DB-FM-02/03, KPI-FM-03/05/06/07/10/12, RPT-FM-01..07.

**Source documentation:** `docs/11-reporting/DASHBOARD_SPECIFICATION.md`

**Unknowns / decisions:** U-10

### FX-11 — AI email reply drafts (human-in-the-loop)

- **Epic:** EP-16 EPIC: AI Assistant & RAG · **Module:** 06 · AI & Intelligence
- **Lane:** DEV1 · **Cycle:** none · **Priority:** P3 · **Estimate:** 6 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** AI, FEATURE, POST-DAY-5
- **Depends on:** VX-066

WF-24, FR-AI-05, SCR-302, AIT-14/15, Demo 14a.

**Acceptance criteria**

- [ ] See AIT-14/15.

**Source documentation:** `docs/09-ai/AI_CAPABILITIES.md`

### FX-12 — AI invoice field extraction with confidence review

- **Epic:** EP-16 EPIC: AI Assistant & RAG · **Module:** 06 · AI & Intelligence
- **Lane:** DEV1 · **Cycle:** none · **Priority:** P3 · **Estimate:** 8 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** AI, FEATURE, POST-DAY-5
- **Depends on:** VX-026

WF-25, FR-AI-06, SCR-303, AIT-16/17. Urbanise status: announced (EV-111).

**Acceptance criteria**

- [ ] See AIT-16/17.

**Source documentation:** `docs/09-ai/AI_CAPABILITIES.md`

### FX-13 — Public API clients and webhook subscription management (incl. redelivery, auto-disable)

- **Epic:** EP-17 EPIC: Integrations & Mock Providers · **Module:** 07 · Integrations
- **Lane:** DEV1 · **Cycle:** none · **Priority:** P3 · **Estimate:** 8 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** INTEGRATION, POST-DAY-5
- **Depends on:** VX-043

FR-SH-13, WH-01..07, F-SH-10. The Day 3 resident-app webhook is hard-wired; general management is future work.

**Acceptance criteria**

- [ ] See WH-*.

**Source documentation:** `docs/07-api/WEBHOOKS.md`

### FX-14 — Complete OpenAPI for all ~190 catalogued operations and oasdiff gate

- **Epic:** EP-21 EPIC: Testing & Quality · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV1 · **Cycle:** none · **Priority:** P2 · **Estimate:** 8 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** DOCUMENTATION, POST-DAY-5
- **Depends on:** —

BUILD_READINESS condition 1. Within Days 1–4 each item extends OPENAPI.yaml for the operations it builds; this item covers the remainder.

**Acceptance criteria**

- [ ] Every catalog operation is defined; API-OAS-01 in CI.

**Source documentation:** `docs/07-api/API_CATALOG.md`; `docs/00-discovery/BUILD_READINESS_REPORT.md`

**Risks:** Contract drift (R-19).

### FX-15 — Full performance suite, ZAP DAST, backup/restore rehearsal

- **Epic:** EP-21 EPIC: Testing & Quality · **Module:** 11 · Testing, Validation & Demo
- **Lane:** DEV3 · **Cycle:** none · **Priority:** P3 · **Estimate:** 12 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** QA, SECURITY, POST-DAY-5
- **Depends on:** VX-071

PERF-01..10, SEC-16, FAILREC-02..10.

**Source documentation:** `docs/12-testing/PERFORMANCE_TESTS.md`; `docs/12-testing/FAILURE_RECOVERY_TESTS.md`

### FX-16 — Observability stack: OTel → Grafana dashboards, alerts and runbooks

- **Epic:** EP-22 EPIC: DevOps & Environments · **Module:** 12 · DevOps & Deployment
- **Lane:** DEV4 · **Cycle:** none · **Priority:** P3 · **Estimate:** 10 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** DEVOPS, POST-DAY-5
- **Depends on:** VX-071

13-devops MONITORING, ALERTING, OPERATIONS.

**Source documentation:** `docs/13-devops/MONITORING.md`; `docs/13-devops/ALERTING.md`

### FX-17 — Cloud reference deployment (ECS/Helm), release pipeline with signing and SBOM

- **Epic:** EP-22 EPIC: DevOps & Environments · **Module:** 12 · DevOps & Deployment
- **Lane:** DEV4 · **Cycle:** none · **Priority:** P3 · **Estimate:** 14 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** DEVOPS, POST-DAY-5
- **Depends on:** VX-071

13-devops DEPLOYMENT, CI_CD release.yml, DEVSECOPS signing.

**Source documentation:** `docs/13-devops/DEPLOYMENT.md`

### FX-18 — Full AI evaluation datasets and CI gates; owner-facing AI (BL-13)

- **Epic:** EP-16 EPIC: AI Assistant & RAG · **Module:** 06 · AI & Intelligence
- **Lane:** DEV1 · **Cycle:** none · **Priority:** P3 · **Estimate:** 12 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** AI, QA, POST-DAY-5
- **Depends on:** VX-094

AI_EVALUATION datasets at full size (60/50/60/40/30/25/40).

**Source documentation:** `docs/09-ai/AI_EVALUATION.md`

### FX-19 — Accessibility audit, responsive polish, global search UI, saved views

- **Epic:** EP-19 EPIC: Frontend Shell & Staff UX · **Module:** 09 · Frontend & UX
- **Lane:** DEV4 · **Cycle:** none · **Priority:** P3 · **Estimate:** 10 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** FRONTEND, POST-DAY-5
- **Depends on:** VX-011

NFR-12, UI-A11Y full, SCR-007, UI-HELP.

**Source documentation:** `docs/08-ux/UX_STATES.md`; `docs/08-ux/NAVIGATION.md`

**Traceability:** REQ: FR-SH-10, FR-SH-14, NFR-12 · TESTS: UI-A11Y, UI-HELP, FT-SH-08

### FX-20 — Payment plans self-service, special levies UI, collections full lifecycle

- **Epic:** EP-06 EPIC: Strata — Arrears & Debt Recovery · **Module:** 03 · Strata
- **Lane:** DEV2 · **Cycle:** none · **Priority:** P3 · **Estimate:** 10 h · **State:** Backlog
- **Evidence:** PROPOSED · **Labels:** STRATA, POST-DAY-5
- **Depends on:** VX-025

FR-ST-14 (full), BL-16.

**Source documentation:** `docs/15-build/FUTURE_BACKLOG.md`

### FX-22 — Tasks, notes and timeline UI with configurable automation rules

- **Epic:** EP-15 EPIC: Shared Workflow — Documents, Notifications, Approvals, Tasks, Search · **Module:** 05 · Workflow, Documents & Notifications
- **Lane:** DEV1 · **Cycle:** none · **Priority:** P3 · **Estimate:** 8 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** PLATFORM, FEATURE, POST-DAY-5
- **Depends on:** VX-009

F-SH-08 complete: SCR-009 tasks, notes and timeline per entity, and the rule catalog (invoice pending > 5 days, insurance expiry, compliance expiring, WO at-risk). Tasks/notes/timeline are CONFIRMED capabilities (EV-012).

**Acceptance criteria**

- [ ] See FT-SH-09.

**Source documentation:** `docs/04-shared-platform/COMMON_SERVICES.md`

**Traceability:** REQ: FR-SH-11 · TESTS: FT-SH-09

### FX-21 — Future backlog umbrella (BL-01..BL-20: native apps, real banks, E-Services, term deposits, M365 channels…)

- **Epic:** EP-22 EPIC: DevOps & Environments · **Module:** —
- **Lane:** — · **Cycle:** none · **Priority:** P3 · **Estimate:** 0 h · **State:** Backlog
- **Evidence:** CONFIRMED · **Labels:** POST-DAY-5, DOCUMENTATION
- **Depends on:** —

Tracks 15-build/FUTURE_BACKLOG.md. Split into items when prioritised.

**Source documentation:** `docs/15-build/FUTURE_BACKLOG.md`; `docs/15-build/KNOWN_LIMITATIONS.md`
