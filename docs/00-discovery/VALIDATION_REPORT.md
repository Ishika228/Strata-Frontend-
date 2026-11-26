# Validation Report (consistency audit)

Date: 2026-11-20. Method: automated cross-reference script (every ID referenced anywhere must be defined in its owning document) + manual review of terminology, states, thresholds and evidence labels.

## 1. Automated cross-reference results
| ID family | Defined | Undefined references |
|---|---|---|
| Evidence EV-### | 96 | 0 |
| Features F-* | 53 | 0 |
| Requirements FR-* | 75 | 0 (all covered by matrix incl. slash/range notation) |
| Business rules BR-* | 45 | 0 |
| Workflows WF-* | 27 | 0 |
| Screens SCR-* | 63 | 0 |
| User stories US-* | 49 | 0 |
| KPIs / Reports | 25 / 19 | 0 / 0 |
| State machines SM-* | 28 | 0 |
| Unknowns / Gaps / Conflicts | 26 / 20 / 11 | 0 |
| Integrations INT-## | 12 | 0 |
| Tests (FT, API, INT-T, E2E, SEC, RBAC-N, TEN, DOC, PERF, NOT, WH, FAILREC, FIN, INV, UI, AIT) | 260+ | 0 after fixes |
| OpenAPI | 42 paths / 45 operations / 28 schemas — YAML parses | — |

## 2. Contradictions found and fixed
| # | Issue | Fix | Evidence changed? |
|---|---|---|---|
| V-01 | RAG SQL filtered on `document_kind`, column absent in schema | Added `document_kind` to `ai.document_chunks` | No |
| V-02 | Webhook docs referenced `integration_events` and consumer dedupe table not in schema | Added `platform.integration_events`, `platform.processed_events` | No |
| V-03 | Suspense account 2900 used in error handling, missing from chart of accounts | Added 2900 to TRUST_ACCOUNTING | No |
| V-04 | `citext` type used without extension | Added `CREATE EXTENSION citext` | No |
| V-05 | AI_SECURITY referenced undefined test `AIE-03` | Pointed to AIT-23 | No |
| V-06 | INV-01..05 referenced but only described in prose | Defined as table in DATA_GOVERNANCE | No |
| V-07 | FT-IN/FT-AI placeholder IDs ambiguous | Replaced with explicit pointers to INT-T/AIT suites | No |
| V-08 | PRODUCT_SCOPE said 12 roles; RBAC defines 13 | Corrected to 13 | No |
| V-09 | WF-15 trigger mislabelled as [E] with wrong evidence ID | Relabelled [I] | No (label corrected, not evidence) |
| V-10 | 10 traceability gaps (stories/demo steps) | US-46..49, demo steps 2/2a/7a/14a/20a/20b, UI-HELP test | No |
| V-11 | DISCOVERY_SUMMARY counts estimated before register was final | Recomputed from register (84/7/1/2/2 = 96) | No |

## 3. Manual consistency checks (pass)
- **Terminology**: canonical terms (Scheme, Lot, Work Order, Fund…) consistent with GLOSSARY; "Job" only as UI alias (C-06). No Urbanise trademarks used as product names (POC = Vertex Owner Portal).
- **Strata modules / FM modules / shared services**: same set in PRODUCT_SCOPE, PRODUCT_MODEL, FUNCTIONAL_REQUIREMENTS, BUILD_ORDER, TRACEABILITY_MATRIX.
- **State machines**: WO, invoice, approval, meeting/motion states identical across STATE_MACHINES, WORK_MANAGEMENT, PROCUREMENT_AND_INVOICES, MEETINGS_AND_VOTING, SCHEMA.sql CHECK constraints and OPENAPI enums.
- **Thresholds**: arrears 14/35/60 d; invoice approval $1,000/$5,000; quotes >$5,000; penalty 10% p.a.; SLA matrix — identical in BUSINESS_RULES, workflow, tests, seed, demo.
- **Permissions**: every API in API_CATALOG names a permission present in RBAC matrix; AI tools reuse those permissions.
- **Integrations**: catalog, mapping, retry, error handling and mocks cover the same 7 POC integrations + LLM/embeddings.
- **AI**: model configuration (claude-sonnet-5-5 / claude-haiku-5-5) identical in AI_ARCHITECTURE, CONFIGURATION, SYSTEM_ARCHITECTURE.
- **Reporting**: Aged Debtors spec matches OBSERVED W16 columns/buckets/groupings.
- **Seed ↔ demo ↔ UAT**: demo personas and data exist in SEED_DATA.
- **Evidence integrity**: no evidence row was altered to resolve a design contradiction; all fixes were in design documents.

## 4. Residual issues (not contradictions)
- OpenAPI formally specifies 45 of ~190 catalogued operations; remaining ones must be added per slice (PHASE_COMPLETION_CHECKLIST enforces).
- Jurisdiction-sensitive defaults (⚖) unvalidated by SMEs.
- 4 conflicts remain UNKNOWN/CONFLICT (C-01, C-04, C-05, C-08/C-11) — design choices documented, evidence unchanged.
