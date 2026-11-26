# Architecture Decision Records (POC)

| ADR | Decision | Status | Alternatives | Consequences |
|---|---|---|---|---|
| ADR-001 | Modular monolith (api + worker from one codebase) | Accepted | Microservices | Simple deploy; must enforce module boundaries via lint (eslint-plugin-boundaries) |
| ADR-002 | PostgreSQL shared schema + `tenant_id` + RLS | Accepted | DB-per-tenant; schema-per-tenant | Cheap, scalable; RLS must be tested (TEN-*) |
| ADR-003 | Money as BIGINT cents + ISO currency on tenant | Accepted | NUMERIC | No float errors; formatting at edges |
| ADR-004 | Double-entry ledger per scheme, immutable lines | Accepted | Single-entry balances | Auditable; reversal-based corrections |
| ADR-005 | Transactional outbox + BullMQ | Accepted | Kafka; SNS/SQS | Exactly-once effect via idempotent consumers |
| ADR-006 | Keycloak for identity | Accepted | Auth0, Cognito, custom | Free, OIDC brokering to Entra ID |
| ADR-007 | REST + OpenAPI 3.1, URI versioning `/api/v1` | Accepted | GraphQL | Simple for integrators (EV-007) |
| ADR-008 | PWA instead of native apps | Accepted | React Native | One codebase; native backlog BL-01 |
| ADR-009 | Native meetings/voting (not partner) | Accepted | Integrate partner | Demonstrable end-to-end; partner inbound API kept (C-11) |
| ADR-010 | AI gateway with tool-calling over service layer; RAG in pgvector | Accepted | Direct DB SQL by LLM | No SQL generation by LLM; RBAC reuse |
| ADR-011 | Human confirmation for all AI writes | Accepted | Autonomous agents | Safety; mirrors EV-113 |
| ADR-012 | Mock adapters for bank, payments, collections, resident apps | Accepted | Real sandboxes | No real money / partner contracts in POC |
| ADR-013 | Playwright HTML→PDF | Accepted | PDFKit | Template reuse with web components |
| ADR-014 | Strata WO lightweight & separate from FM WO | Accepted | Single WO table | Decoupled modules; escalation link via external_refs |
| ADR-015 | Shared Supplier & compliance across products | Accepted | Per-product suppliers | One compliance truth (EV-053, EV-077) |
| ADR-016 | Server-side role resolution (not token roles) | Accepted | Roles in JWT | Fast revocation |
