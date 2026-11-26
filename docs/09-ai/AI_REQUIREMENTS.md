# AI Requirements

## Evidence
- Urbanise publicly announces native AI (assistant, invoice processing, onboarding) as "coming" (EV-110..112) while the homepage says "now AI capability" (C-01).
- Partner Merlo AI (third party) provides drafting, data retrieval, Teams Q&A with source-backed answers, AGM/insurance/compliance help, via Urbanise's API, with human review before sending and no customer data used for training (EV-113..117).
- FM page claims "deep AI and machine learning" / "AI enabled analytics" without detail (EV-079).
- **Urbanise's production model, prompts, RAG pipeline and tooling are UNKNOWN (EV-118).** Nothing below describes them.

## Independent POC requirements
| ID | Requirement | Pri | Derived from |
|---|---|---|---|
| AIR-01 | Staff assistant answering portfolio/operational questions over Strata and FM data | M | EV-110, EV-114 |
| AIR-02 | Every factual answer cites sources (records or document pages) | M | EV-114 |
| AIR-03 | AI uses only data the asking user can access (RBAC + tenant) | M | EV-115 (governance) |
| AIR-04 | AI never performs writes without explicit user confirmation | M | EV-113 |
| AIR-05 | AI never sends communications | M | EV-113 |
| AIR-06 | Draft owner/committee email replies grounded in that contact's data | M | EV-113 |
| AIR-07 | Extract supplier invoice fields with per-field confidence | S | EV-111 |
| AIR-08 | RAG over by-laws, minutes, insurance, reports, contracts | M | EV-114, EV-037 |
| AIR-09 | No training on customer data; provider zero-retention where available | M | EV-115 |
| AIR-10 | Per-tenant enable/disable per feature; monthly token budget | M | EV-116 |
| AIR-11 | Full audit of prompts metadata, tool calls, sources, outputs | M | EV-013 pattern |
| AIR-12 | Evaluation suite with accuracy, groundedness, authorization tests gating releases | M | PROPOSED |
| AIR-13 | Graceful degradation when LLM unavailable (feature off, core app unaffected) | M | PROPOSED |
| AIR-14 | PII minimisation: send minimum fields to the LLM; never bank details | M | PROPOSED |
| AIR-15 | Answer latency: first token < 3 s, p95 complete < 15 s | S | NFR-04 |
