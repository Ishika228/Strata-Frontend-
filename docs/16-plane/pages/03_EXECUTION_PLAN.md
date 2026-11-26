# 03 — 4-Day Execution Plan (+ Day 5 validation)

Capacity assumption: **6.5 productive h/dev/day** (standups, reviews and integration take the rest). Estimates are for a thin, demo-path implementation, not production completeness. Full detail: `docs/16-plane/BACKLOG.md`.

Dates: Day 1 Tue 24 Nov · Day 2 Wed 25 · Day 3 Thu 26 · Day 4 Fri 27 · Day 5 Mon 30 Nov 2026.

## Day 1 — Foundation
| Dev | Items | Hours |
|---|---|---|
| DEV1 | VX-003 API core (tenant ctx, errors, pagination, idempotency) · VX-004 Auth (Keycloak, JWT, /me) · VX-005 RBAC guard + route coverage | 7 ⚠ |
| DEV2 | VX-002 Schema baseline + RLS + ledger triggers · VX-020 Strata calc library (FIN property tests) | 7 ⚠ |
| DEV3 | VX-040 FM calc library (business time, RRULE, lifecycle, WO states) · VX-006 Audit hash chain + outbox + scheduler/Clock | 6.5 |
| DEV4 | VX-001 Monorepo + compose + CI (**push 1 within 90 min**) · VX-060 Web shell + OIDC login | 7 ⚠ |
**Exit:** `docker compose up` → log in → /me returns roles → RLS test TEN-05 passes in CI.

## Day 2 — Core Domains
| Dev | Items | Hours |
|---|---|---|
| DEV1 | VX-007 RBAC scope predicates + TEN/RBAC negative suites · VX-008 Documents service | 6.5 |
| DEV2 | VX-021 Scheme register + provisioning + Strata seed · VX-022 Trust ledger + period close + lot ledger | 6.5 |
| DEV3 | VX-041 Properties/locations/assets + FM seed · VX-042 Suppliers + compliance + assignment gate | 6.5 |
| DEV4 | VX-061 UI kit · VX-062 Mock providers (payments, bank, collections, resident app, sms, llm) | 6.5 |
**Exit:** schemes, lots, ledger and assets queryable via API with isolation tests green; mocks running.

## Day 3 — Product Experience + Intelligence
| Dev | Items | Hours |
|---|---|---|
| DEV1 | VX-009 Notifications · VX-010 Approvals engine · VX-066 AI gateway + tools + proposals | 6.5 |
| DEV2 | VX-023 Budgets → levy schedule → levy runs + notices + pay links · VX-024 Payments + bank import/auto-match/rec lock | 7 ⚠ |
| DEV3 | VX-043 Service requests → triage → WOs + assignment + evidence + SLA + resident-app webhooks · VX-044 PPM + 52-week planner | 6.5 |
| DEV4 | VX-063 Strata staff screens · VX-064 FM staff screens + technician PWA (offline) | 7 ⚠ |
**Exit:** levy → payment → rec works via API and UI; resident request → WO → completion works via API; assistant answers a Strata question with citations.

## Day 4 — Integration & Hardening
| Dev | Items | Hours |
|---|---|---|
| DEV1 | VX-068 RAG + citation validator · VX-012 Security hardening + scanners + INV jobs | 6.5 |
| DEV2 | VX-025 Arrears engine + referral · VX-026 Invoices + approval routing + payment batch · VX-070 Aged Debtors + dashboard KPIs | 6.5 |
| DEV3 | VX-045 Client variation approvals + FM portal · VX-046 Ops Centre + basic analytics · VX-047 10-yr lifecycle plan | 6 |
| DEV4 | VX-065 Owner portal PWA · VX-069 AI panel UI · VX-067 E2E Demo Lite suite · VX-071 Demo environment | 6.5 |
**Exit:** candidate build deployed to the demo environment; E2E suite green or with known BUG items.

## Day 5 — Validation / Demo / Gap closure (no new features)
| Item | Owner |
|---|---|
| VX-090 Full smoke + Demo Lite run | DEV4 |
| VX-091 Security validation (auth, RBAC, tenant isolation, documents, AI authz/injection) | DEV1 |
| VX-092 Strata financial integrity validation | DEV2 |
| VX-093 FM workflow validation | DEV3 |
| VX-094 AI eval subset + AI demo rehearsal | DEV1 |
| VX-095 Regression & gap-closure buffer (shared) | DEV2 lead, all |
| VX-096 Traceability & docs verification | DEV3 |
| VX-097 Known-gap review & post-Day-5 grooming | DEV4 |
| VX-098 Reduced perf smoke | DEV3 |
| **VX-099 Release Readiness / Demo Gate** (PM-chaired) | DEV1 + PO |

⚠ = slightly above 6.5 h. Mitigation: Day 5 buffer; per-day fallbacks noted in each item's risks (e.g. online-only technician demo; mock-llm if D-15 is not resolved).

## Cross-developer dependencies
```
DEV4 VX-001 ─┬─► DEV2 VX-002 ─► DEV3 VX-006 ─► DEV2 VX-021 ─► DEV2 VX-022 ─► DEV2 VX-023/024 ─► DEV4 VX-063/065
             ├─► DEV1 VX-003/004 ─► VX-005 ─► VX-007 ─► (all domain APIs) ─► DEV1 VX-066 ─► VX-068
             └─► DEV3 VX-040 ─► VX-041 ─► VX-042 ─► VX-043 ─► DEV4 VX-064 ─► DEV4 VX-067 ─► Day 5
DEV4 VX-062 mocks ─► DEV2 VX-023/024/025/026 · DEV3 VX-043
DEV1 VX-010 approvals ─► DEV2 VX-026 · DEV3 VX-045
DEV1 VX-008 documents ─► DEV3 VX-042 · DEV1 VX-068 · DEV4 VX-065
```
**Critical path (33 h of chained work):** VX-001 → VX-002 → VX-006 → VX-021 → VX-022 → VX-024 → VX-065 → VX-067 → VX-090 → VX-095 → VX-099.
