# 01 — Project Charter

## Goal
Build an **independent** POC, "Vertex Strata + Vertex FM", modelled on capabilities that Urbanise publicly describes for its Strata and FM platforms. In 4 build days plus 1 validation day, demonstrate a thin end-to-end slice through every layer. No Urbanise code, private API, internal design or data is used. Every product claim traces to public evidence (`docs/00-discovery/EVIDENCE_REGISTER.md`); every design choice is labelled PROPOSED.

## Product scope (full documented scope)
- **Shared platform:** tenancy, identity/SSO, RBAC, documents, notifications, audit, search, tasks, imports, API/webhooks, approvals, AI gateway.
- **Strata:** scheme register, budgets & funds, levies, payments, bank reconciliation, trust ledger, arrears & debt recovery, supplier invoices & approvals, procurement, meetings & voting, comms, owner portal, wall, insurance & compliance, reports.
- **FM:** properties & locations, assets, 10-yr lifecycle, PPM & 52-week planner, service requests, work orders, SLA, workforce/mobile, suppliers & compliance gate, client approvals, inspections, Ops Centre, analytics, CRM.

## 5-day scope ("Demo Lite")
- **Built in Days 1–4:** foundation (repo, schema + RLS, auth, RBAC, audit, outbox); Strata register → ledger → budget/levies → payments/bank rec → arrears → invoices with committee approval → Aged Debtors; FM assets → suppliers/compliance gate → service requests/WOs/SLA → PPM/planner → client approvals → Ops Centre/analytics → lifecycle plan; documents, notifications, approvals; AI gateway + RAG with citations; staff screens, owner portal PWA, technician PWA; mocks; E2E; demo environment.
- **Not built (POST-DAY-5):** meetings/voting, campaigns, wall, insurance register, procurement/quotes, import wizard, inspections, CRM/dispatch board, scheduled reports & full report set, full analytics, AI drafts/extraction, webhook management, full OpenAPI, perf/DAST, observability stack, cloud deployment.

## Success criteria (Day 5 gate — work item VX-099)
1. Every Demo Lite step runs on the demo environment (`16-plane/PROJECT_MODEL.md` §5).
2. Zero cross-tenant leaks and zero AI authorization leaks in the security validation run.
3. FIN-01..10 and INV-01..05 pass; Aged Debtors totals equal the ledger.
4. 0 open S1 defects.
5. Decisions D-01..D-16 each have an owner and status; unknowns are not presented as confirmed.
6. Plane reflects reality: nothing Done without recorded evidence.

## Team
DEV1 Platform/Backend/Security + AI backend · DEV2 Strata + schema · DEV3 FM + suppliers + async infra · DEV4 Repo/CI, Frontend/PWAs, Mocks, E2E, Demo env · PO/SME decisions.
