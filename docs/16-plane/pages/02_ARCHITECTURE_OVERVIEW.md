# 02 — Architecture Overview (independent POC design — PROPOSED)

Urbanise's internal architecture is **UNKNOWN** (EV-016). The only public facts are cloud/AWS hosting, browser access, ISO 27001 and an open API (EV-001, 002, 007). Everything below is our own design (`docs/05-architecture`).

```
Browser SPA (/app) · PWAs (/portal, /field, /fm-portal) · /pay
        │ OIDC PKCE (Keycloak)
Reverse proxy (TLS)
        │
api  (Node 22 · NestJS/Fastify · TypeScript)      worker (same codebase · BullMQ)
  core: tenant ctx · RBAC guard · Problem errors · pagination · idempotency · audit · outbox
  platform · common (suppliers, approvals, service requests) · strata · fm · ai · integrations
        │
PostgreSQL 16 (+pgvector, pg_trgm, ltree, RLS) · Redis 7 · S3/MinIO · Keycloak · Mailpit
Mocks: bank · payments · collections · resident-app · sms · llm      LLM: Anthropic Claude (config)
```

| Area | Decision | Doc |
|---|---|---|
| Services | Modular monolith (api + worker), module boundaries lint-enforced (ADR-001) | 05-architecture/SYSTEM_ARCHITECTURE |
| Database | Shared schema + `tenant_id` + **RLS** (ADR-002); money as BIGINT cents (ADR-003); double-entry ledger with balanced and period-lock triggers (ADR-004) | 06-database/SCHEMA.sql |
| Async | Transactional outbox → BullMQ; idempotent consumers (ADR-005) | 05-architecture/EVENTS |
| APIs | REST `/api/v1`, OpenAPI 3.1, Problem errors, cursor pagination, Idempotency-Key | 07-api |
| Identity | Keycloak OIDC, MFA for staff, Entra ID brokering; roles resolved server-side (ADR-006, ADR-016) | 04-shared-platform |
| Frontend | React + Vite + TanStack + Radix/Tailwind; PWAs replace native apps (ADR-008) | 08-ux |
| AI | Gateway with tool-calling over the service layer (no text-to-SQL), pgvector RAG with citations, human confirmation for writes (ADR-010/011) | 09-ai |
| Integrations | Ports & adapters; all providers mocked (ADR-012) | 10-integrations |
| Security | Defence in depth: guard → scoped repository → RLS; encrypted bank fields; hash-chained audit | 05-architecture/SECURITY_ARCHITECTURE |
| State machines | 28 declared transition tables (WO, invoices, approvals, levies…) | 05-architecture/STATE_MACHINES |
| Ops | Compose locally and on the demo VM; CI in GitHub Actions; OTel later | 13-devops |
