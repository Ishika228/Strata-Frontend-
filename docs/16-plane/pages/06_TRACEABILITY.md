# 06 — Traceability

Chain: **Evidence (EV-###) → Requirement (FR/NFR/BR) → Plane item (VX-###) → Implementation (PR) → Test (FT/API/E2E/SEC/TEN/FIN/AIT…) → Demo step**.
The full feature-level matrix is `docs/14-traceability/TRACEABILITY_MATRIX.md`. Each Plane item carries a "Source documentation" and "Traceability" section. PR links are added as implementation lands, and test results are recorded on Day 5 (VX-096).

## ID scheme used in Plane
| Prefix | Meaning | Defined in |
|---|---|---|
| EV-### | Evidence | 00-discovery/EVIDENCE_REGISTER |
| FR-xx-## / NFR-## | Requirements | 02-requirements |
| BR-xx-## | Business rules | 02-requirements/BUSINESS_RULES |
| WF-## / US-## | Workflows / stories | 01-product, 02-requirements |
| SCR-### | Screens | 08-ux/SCREEN_INVENTORY |
| SM-## / ADR-### | State machines / decisions | 05-architecture |
| FT/API/INT-T/E2E/SEC/RBAC-N/TEN/DOC/PERF/NOT/WH/FAILREC/FIN/INV/AIT | Tests | 12-testing, 09-ai |
| U-## / C-## / G-## | Unknowns / conflicts / gaps | 00-discovery |
| VX-### / D-## / FX-## / EP-## | Plane work items / decisions / future / epics | 16-plane/backlog.json |

## Feature → Plane mapping (Demo Lite)
| Feature | Requirements | Plane items | Key tests | Demo |
|---|---|---|---|---|
| F-SH-01/02/03 Tenancy, identity, RBAC | FR-SH-01..05 | VX-002, 004, 005, 007 | TEN-*, RBAC-N*, API-AUTH-* | 1, 23 |
| F-SH-04 Documents | FR-SH-06 | VX-008 | DOC-*, SEC-10/11 | 11, 14 |
| F-SH-05 Notifications | FR-SH-07/08 | VX-009 | NOT-* | 4 |
| F-SH-06 Audit | FR-SH-09 | VX-006, 012 | FT-SH-07, SEC-12, INV-03 | 23 |
| Approvals (shared) | FR-ST-16/24, FR-FM-13 | VX-010 | RBAC-N06/16 | 9, 19 |
| F-ST-01 Register | FR-ST-01..03 | VX-021 | FT-ST-01/02 | 2 |
| F-ST-02/03/07 Budget, levies, ledger | FR-ST-04..07, 15 | VX-020, 022, 023 | FIN-01..09, FT-ST-03..05 | 3, 4 |
| F-ST-04/05 Payments, bank rec | FR-ST-08..10 | VX-024 | FT-ST-07..11, INT-T-01..08 | 5, 6 |
| F-ST-06 Arrears | FR-ST-11..14 | VX-025 | FT-ST-12..15 | 7 |
| F-ST-08 Invoices | FR-ST-16/17 | VX-026 | FT-ST-17..20 | 8–10 |
| F-ST-12 Owner portal | FR-ST-23/24 | VX-065 | FT-ST-27/28 | 5, 9 |
| F-ST-15 Reports | FR-ST-27, 29 | VX-070 | FT-ST-31/33, FIN-10 | 1, 11 |
| F-FM-01/02 Properties, assets | FR-FM-01/02 | VX-041 | FT-FM-01/02 | 16 |
| F-FM-03 Lifecycle | FR-FM-03 | VX-040, 047 | FT-FM-03 | 20 |
| F-FM-04 PPM/planner | FR-FM-04/05 | VX-044 | FT-FM-04/05 | 20 |
| F-FM-05/06/07 Requests, WOs, SLA | FR-FM-06..09 | VX-040, 043 | FT-FM-06..10 | 15–18 |
| F-FM-08 Workforce mobile | FR-FM-10 | VX-064 | E2E-FM-05 | 17 |
| F-FM-09 Supplier compliance | FR-FM-12 | VX-042 | FT-FM-13/14 | 16 |
| F-FM-10 Client approvals | FR-FM-13 | VX-045 | FT-FM-15 | 19 |
| F-FM-12/13 Ops Centre, analytics | FR-FM-15/16 | VX-046 | FT-FM-17/18 | 16, 21 |
| F-AI-01..04 AI + RAG | FR-AI-01..04, 07 | VX-066, 068, 069 | AIT-01..12, 19..25 | 14, 22 |
| F-IN-01/02/03/05/06/07 Integrations | FR-IN-* | VX-062, 024, 025, 043, 009, 004 | INT-T-* | 5–7, 15, 18 |
| UI shell & screens | NFR-12 | VX-060, 061, 063, 064 | E2E-*, UI-A11Y | all |

## Features not in the 5-day build (traced to POST-DAY-5 items)
F-ST-09 → FX-05 · F-ST-10 → FX-01 · F-ST-11 → FX-02 · F-ST-13 → FX-03 · F-ST-14 → FX-04 · F-SH-07 → VX-011/FX-19 · F-SH-09 → FX-06 · F-SH-10 → FX-13 · F-FM-11 → FX-07 · F-FM-14 → FX-08 · F-AI-05 → FX-11 · F-AI-06 → FX-12 · F-IN-04 → FX-01.
