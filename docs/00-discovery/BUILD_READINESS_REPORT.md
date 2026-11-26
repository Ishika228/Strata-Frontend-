# Build Readiness Report

Date: 2026-11-20 · Scope: independent **Vertex Strata + Vertex FM** POC · Inputs: 19 public Urbanise web sources (0 local files) · Package: 121 documents in `docs/`.

## Scores
| Area | Score /100 | Basis |
|---|---|---|
| Product Discovery | 70 | 19 useful public sources incl. 2 observed artefacts; no authorized product access, empty workspace (G-02, G-03) |
| Requirements | 85 | 75 FRs, 20 NFRs, 45 BRs, 49 stories with acceptance criteria |
| Strata | 78 | Full module design; levy/arrears/ledger algorithms specified; jurisdiction rules unvalidated (⚖) |
| FM | 80 | WO/SLA/PPM/assets/lifecycle/compliance specified; SLA & lifecycle methods proposed, not evidenced |
| Shared Platform | 88 | Tenancy, identity, RBAC matrix, documents, notifications, audit, search, tasks, imports |
| Architecture | 88 | Modular monolith, ADRs, events, state machines, security architecture |
| Database | 85 | Complete reference DDL with RLS, constraints, triggers, ERDs, governance |
| API | 82 | ~190-operation catalog; OpenAPI 3.1 for 45 core operations; full conventions |
| UX | 72 | 63 screens fully specified; IA, flows, forms, tables, states; no wireframes; staff UI unobserved |
| Security | 86 | Threat model, controls, ~60 negative tests (RBAC, tenant, document, AI) |
| AI | 84 | Gateway, 22 tools, RAG, guardrails, eval gates, 25 test cases |
| Integrations | 75 | Adapter architecture + mocks complete; real partner interfaces UNKNOWN |
| Reporting | 82 | 25 KPIs with formulas, 19 reports, dashboards, data sources |
| Testing | 85 | 12 test specifications, 260+ test IDs, financial property tests |
| DevOps | 82 | CI/CD, environments, config, secrets, migrations, monitoring, runbooks |
| Traceability | 90 | 53 features traced end-to-end; 2 accepted gaps |

## Overall Score: **82/100**

## Status: **CONDITIONALLY READY**

### Conditions (must be met during the build, not before starting)
1. Complete OpenAPI definitions for each slice's operations before that slice's API work (enforced by PHASE_COMPLETION_CHECKLIST).
2. SME review of jurisdiction-sensitive defaults (BR-ST-03/05/08/09/10/18/19) before UAT (slice 14).
3. Product owner confirms POC design choices on unresolved conflicts C-01, C-04, C-05, C-11.
4. Optional but recommended: authorized demo/screenshots of the reference product to raise Discovery/UX confidence (G-02, G-03).

### Why not "NOT READY"
Every slice in BUILD_ORDER has data model, API contract or catalog entry, permissions, UI specification, business rules, tests and demo steps; nothing blocks slice 0–1.

### Why not "READY"
The evidence base is public marketing/partner material only; financial and statutory rules are configurable proposals; OpenAPI is partial.
