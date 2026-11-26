# System Architecture (Independent POC)

## Evidence
Status: **UNKNOWN**. Public evidence establishes only that Urbanise is cloud-hosted on AWS, browser-based, ISO 27001 certified and exposes APIs (EV-001, EV-002, EV-007). Its internal architecture (services, database, queues, AI) is not public (EV-016). Marketing "pillars" (Workflow Engine, Rules & Automation, Data Model, API Framework, Reporting, Mobile & Portal, Security — EV-058) are treated as capability goals only.

## Independent POC Proposal
```
 Browser (staff SPA)   PWA (owner portal / fm portal / technician / contractor)
          │ HTTPS (OIDC PKCE)                     │
          ▼                                       ▼
   ┌─────────────────────── Reverse proxy (Caddy/Nginx, TLS) ───────────────┐
   │                                                                        │
   │   web (static, Vite build)        api (Node 22, NestJS, TypeScript)    │
   │                                    ├─ platform/* modules               │
   │                                    ├─ strata/* modules                 │
   │                                    ├─ fm/* modules                     │
   │                                    ├─ common/* (suppliers, approvals)  │
   │                                    ├─ ai/* (gateway, tools, rag)       │
   │                                    └─ integrations/* (adapters)        │
   │                                         │            │                 │
   │   worker (same codebase, BullMQ consumers & schedulers)                │
   └──────────┬─────────────┬──────────────┬────────────┬─────────────┬─────┘
              ▼             ▼              ▼            ▼             ▼
        PostgreSQL 16   Redis 7       S3-compatible   Keycloak 25   Mailpit/SMTP
        (+pgvector,     (queues,      (MinIO local;   (OIDC, MFA,   SMS mock
         pg_trgm, RLS)   cache)        S3 in cloud)    Entra fed.)
              │
              └── LLM provider (Anthropic Claude API) via AI gateway (egress allow-list)
        Mock services (docker): mock-bank, mock-payments, mock-collections, mock-resident-app
```

### Tech stack (PROPOSED)
| Layer | Choice | Reason |
|---|---|---|
| Language | TypeScript 5 (strict) end-to-end | One language, shared types |
| API | NestJS 10 on Fastify | Modules map to domains; DI; guards for RBAC |
| ORM / SQL | Kysely (typed SQL) + SQL migrations (node-pg-migrate) | Explicit SQL for ledger & RLS |
| DB | PostgreSQL 16 + pgvector + pg_trgm | Integrity, RLS, vector search |
| Queue | BullMQ on Redis 7 | Jobs, schedules, retries |
| Web | React 18 + Vite + TanStack Router/Query + Tailwind + Radix UI | Fast build, accessible primitives |
| PWA | Same React app, Workbox service worker, IndexedDB offline queue | Single codebase for mobile |
| PDF | Playwright (Chromium) HTML→PDF in worker | Pixel-stable reports/notices |
| Auth | Keycloak | OIDC, MFA, brokering |
| Storage | S3 API (MinIO) | Portable |
| AI | Anthropic Claude (`claude-sonnet-5-5` default, `claude-haiku-5-5` for classification/extraction triage), embeddings via configurable provider | See 09-ai |
| Observability | OpenTelemetry → Grafana stack (Tempo, Loki, Prometheus) | Open source |
| CI/CD | GitHub Actions; Docker images; Helm chart (optional) | 13-devops |

### Module boundaries
- Modules expose `*.service.ts` interfaces; other modules call services, never repositories of another module.
- Cross-module async via outbox events ([EVENTS.md](EVENTS.md)).
- Strata ↔ FM coupling only through `common` (suppliers, approvals, service-request escalation event).

### Request lifecycle
1. Proxy → API; 2. `AuthGuard` validates JWT; 3. `TenantContext` sets `tid`; 4. `PermissionGuard` checks route permission; 5. handler → service loads resource with scope check; 6. transaction opens, `SET LOCAL app.tenant_id`; 7. writes + audit + outbox in same transaction; 8. response with `X-Request-Id`.

## Reasoning
A modular monolith minimises infrastructure and lets the POC demonstrate all vertical slices quickly while keeping seams for later extraction. PostgreSQL gives transactional guarantees required for a trust ledger and native RLS for tenant isolation. All choices are independent and are **not** claims about Urbanise.
