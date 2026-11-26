# Unknown Information

Each item: **Evidence status: UNKNOWN** — public evidence does not establish it. The POC proposal is independent and labelled PROPOSED.

## Internal implementation (never inferred)

| ID | Topic | Evidence | Independent POC proposal | Reasoning |
|---|---|---|---|---|
| U-01 | Database technology & schema | UNKNOWN | PostgreSQL 16, schema in [../06-database/SCHEMA.sql](../06-database/SCHEMA.sql) | Strong relational/financial integrity, RLS for tenancy, pgvector for RAG |
| U-02 | Service decomposition | UNKNOWN | Modular monolith (Strata, FM, Shared modules) | Fastest POC path; module boundaries allow later extraction |
| U-03 | Cloud topology (beyond "AWS-hosted") | UNKNOWN (only "AWS" is public, EV-001) | Container deployment; cloud-agnostic; AWS reference deployment optional | Avoid lock-in for POC |
| U-04 | Private API endpoints & payloads | UNKNOWN (scope only, EV-008) | `/api/v1` REST, [../07-api/OPENAPI.yaml](../07-api/OPENAPI.yaml) | Independently designed |
| U-05 | Event bus / queues | UNKNOWN | Transactional outbox + Redis/BullMQ workers | Reliable async with minimal infra |
| U-06 | Authentication implementation | UNKNOWN (SSO with Azure AD exists, EV-006) | OIDC via Keycloak (local) federating Entra ID | Standards-based |
| U-07 | AI model, prompts, RAG pipeline | UNKNOWN (EV-118) | Claude via AI gateway; pgvector RAG | See 09-ai |
| U-08 | Proprietary algorithms (levy apportionment, penalty, forecasting, lifecycle benchmarks) | UNKNOWN | Configurable formulas in [../03-strata/LEVY_ENGINE.md](../03-strata/LEVY_ENGINE.md), [../03-fm/ASSET_LIFECYCLE.md](../03-fm/ASSET_LIFECYCLE.md) | Statutory norms + configuration |
| U-09 | Search engine | UNKNOWN | Postgres full-text + trigram | Adequate at POC scale |
| U-10 | Reporting/BI stack ("embedded BI", EV-089) | UNKNOWN | SQL views + server-rendered PDF + in-app charts | |
| U-11 | Mobile app technology | UNKNOWN | Responsive PWA (offline queue for technicians) | |
| U-12 | Internal service names | UNKNOWN | Vertex module names only | |

## Business behaviour unknowns (configurable in POC)

| ID | Topic | Evidence | POC handling |
|---|---|---|---|
| U-20 | Levy apportionment formula & rounding | UNKNOWN (budget-driven is CONFIRMED, EV-020) | Entitlement-based, cents rounding, remainder on last instalment (PROPOSED) |
| U-21 | Arrears level thresholds & actions | UNKNOWN (levels exist: EV-024/025) | Policy table: L1/L2/L3 days + template + fee |
| U-22 | Penalty / interest rate & discount rules | UNKNOWN (penalty lines OBSERVED, EV-039) | Per-scheme policy: simple interest p.a., grace days, optional early-payment discount |
| U-23 | Jurisdiction rules (AU states, NZ) | UNKNOWN | `jurisdiction` config pack; POC ships QLD-like and NSW-like samples, **not legal advice** |
| U-24 | Voting rules (quorum, proxies, special resolutions, weighting) | UNKNOWN | Configurable: simple/special/unanimous; weighting by lot or entitlement |
| U-25 | Bank statement format & matching keys | UNKNOWN | CSV + camt.053 parsers; match by payment reference = lot reference (CRN) |
| U-26 | SLA definitions & clock rules | UNKNOWN (SLAs exist, EV-098) | Priority matrix with business calendars, pause on hold |
| U-27 | 10-year plan methodology & benchmarks | UNKNOWN | Useful-life × condition model, escalation rate |
| U-28 | Supplier compliance document types | UNKNOWN (licences & insurance CONFIRMED) | Configurable types incl. safeguarding check |
| U-29 | Community wall moderation | UNKNOWN | Manager-moderated, report button |
| U-30 | "Quick App" meaning (EV-041) | UNKNOWN | Not modelled |
| U-31 | BING partner role | UNKNOWN | Not modelled |
| U-32 | Notification channels beyond email | UNKNOWN | Email + in-app + SMS (mock) |
| U-33 | Data retention periods | UNKNOWN | 7-year financial retention default (configurable) |
