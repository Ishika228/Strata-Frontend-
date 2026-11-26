# 05 — Build Readiness

**Documentation readiness: 82/100 — CONDITIONALLY READY** (`docs/00-discovery/BUILD_READINESS_REPORT.md`).
**Implementation status: 0% — nothing built yet.** No Plane item is Done.

## Ready
- Specified for every Demo Lite item: data model (SCHEMA.sql), API catalog + core OpenAPI, RBAC matrix, screens, business rules, state machines, tests.
- Execution plan: 39 Day 1–4 engineering items and 10 Day 5 validation items, each with acceptance criteria and source docs.

## Conditions (from the readiness report → Plane items)
| Condition | Plane item |
|---|---|
| Complete OpenAPI per slice | Built into each VX item; remainder FX-14 |
| SME review of ⚖ defaults before UAT | D-01..D-06 |
| PO confirms conflict choices | D-13 |
| (Optional) authorized product access | D-14 |

## Blocked / at risk
D-15 AI keys (Day 3) · D-16 demo host (Day 4).

## Remains unknown
Internal Urbanise architecture (never needed) · statutory rules · partner protocols · SLA and lifecycle methods · staff UI.

## UAT requirements (post Day 5)
Per `15-build/UAT_PLAN.md`: SMEs (strata manager, accountant, FM coordinator), 2 weeks, entry 0 P1/P2 defects, scripts UAT-01..20. **Day 5 is a demo gate, not UAT.**

## Score by area (documentation)
Discovery 70 · Requirements 85 · Strata 78 · FM 80 · Shared 88 · Architecture 88 · Database 85 · API 82 · UX 72 · Security 86 · AI 84 · Integrations 75 · Reporting 82 · Testing 85 · DevOps 82 · Traceability 90.
