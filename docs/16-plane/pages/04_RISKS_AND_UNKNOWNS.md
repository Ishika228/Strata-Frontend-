# 04 — Risks, Unknowns, Conflicts & Decisions

## Decisions required (Plane items D-01..D-16, label `BLOCKED / UNKNOWN`)
| ID | Decision | Owner | Needed by | Blocks? |
|---|---|---|---|---|
| D-01 | Levy apportionment & rounding (U-20) | Strata SME | Before UAT | No — configurable default BR-ST-03 |
| D-02 | Penalty/interest & discount (U-22) | Strata SME | Before UAT | No — default BR-ST-09/10 |
| D-03 | Payment allocation order | Strata SME | Before UAT | No — default BR-ST-05 |
| D-04 | Arrears thresholds/actions (U-21) | Strata SME | Before UAT | No — default 14/35/60 |
| D-05 | Meeting/voting rules (U-24, C-11) | Strata SME | Before the meetings feature | Feature POST-DAY-5 |
| D-06 | Trust accounting statutory rules (G-05) | Accounting SME | Before production | POC not statutory |
| D-07 | Bank formats & matching keys (U-25, G-07) | PO + bank | Post-POC | Real integration blocked; mocks used |
| D-08 | Payment provider/rails (C-08) | PO | Post-POC | Mock used |
| D-09 | Partner protocols (G-19) | PO + partners | Post-POC | Mocks used |
| D-10 | FM SLA matrix (U-26) | FM SME | Day 2 (soft) | No — default BR-FM-01 |
| D-11 | Lifecycle method/benchmarks (U-27) | FM SME | Post-POC | Illustrative defaults |
| D-12 | Compliance document types (U-28) | FM SME | Day 2 (soft) | No — seeded types |
| D-13 | PO sign-off on conflicts C-01, C-04, C-05, C-11 | PO | Day 1 | Readiness condition |
| D-14 | Authorized product access / staff UI screenshots (G-02/03) | PO | Any time | No |
| D-15 | LLM & embedding provider approval + API keys | PO + security | **Day 3 morning** | **Yes, for live AI** (fallback mock-llm) |
| D-16 | Demo hosting target | PO/IT | **Day 4 morning** | **Yes, for the demo env** (fallback laptop) |

## External blockers
D-15 (AI keys), D-16 (hosting), D-07/08/09 (real partner access — out of POC scope).

## Top risks (from docs + planning)
| # | Risk | Mitigation | Item |
|---|---|---|---|
| R-01 | Jurisdiction defaults wrong (⚖) | Configurable; SME decisions D-01..06 | VX-020, VX-025 |
| R-02 | Ledger integrity bugs | DB triggers + FIN property tests + INV jobs | VX-002, VX-022, VX-092 |
| R-03 | Tenant isolation gap | RLS + generated TEN tests | VX-002, VX-007, VX-091 |
| R-04 | RBAC scoping exposes owner data | Scoped repositories, 404 policy, RBAC-N suite | VX-007 |
| R-05 | AI cross-scope leakage | Tools as user; SQL-filtered retrieval | VX-066, VX-068 |
| R-06 | Prompt injection | Delimiters, no auto-writes, AIT-08 | VX-068 |
| R-07 | AI states wrong amounts | Numeric validator (POST-DAY-5 if no time) | VX-066 |
| R-08 | LLM cost/availability | Budget, circuit breaker, mock-llm | VX-066 |
| R-09 | Mocks hide real complexity | Documented limitation; contract tests | VX-062 |
| R-10 | Day 1 foundation slips → everything slips | Skeleton push in 90 min; parallel dev against contracts | VX-001 |
| R-11 | Bank matching accuracy | Rule order + manual match | VX-024 |
| R-12 | Offline sync complexity | Online-only fallback | VX-064 |
| R-13 | DST/business-time errors | Unit tests | VX-040 |
| R-14 | Overloaded days (4 lane-days > 6.5 h) | Day 5 buffer, scope cut order below | — |
| R-15 | Scope creep | Demo Lite fixed; everything else POST-DAY-5 | — |
| R-16 | UI drifting toward copying Urbanise | Own design system; no trademarks | VX-060 |
| R-17 | Lifecycle assumptions | Labelled illustrative | VX-047 |
| R-18 | Supplier bank-detail fraud | Encrypted, step-up (thin) | VX-042 |
| R-19 | OpenAPI partial → contract drift | Each item extends spec; FX-14 | all |
| R-20 | SME availability for UAT | Book SMEs now | D-01..06 |

**Scope-cut order if behind:** (1) VX-047 lifecycle → POST; (2) VX-046 analytics → Ops Centre only; (3) offline mode in VX-064; (4) VX-026 payment batch (keep approval); (5) VX-068 RAG (keep record tools).

## Conflicts (evidence unchanged)
C-01 native AI status · C-04 owner portal identity · C-05 FM app split · C-08 payment rails · C-11 voting ownership — all UNKNOWN/CONFLICT. POC choices are recorded in D-13.
