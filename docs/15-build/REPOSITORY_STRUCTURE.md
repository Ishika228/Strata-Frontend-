# Repository Structure (pnpm monorepo)

```
vertex/
├─ apps/
│  ├─ api/                         # NestJS (api + worker entrypoints)
│  │  ├─ src/
│  │  │  ├─ main.ts  worker.ts  config.ts
│  │  │  ├─ core/                  # auth guard, tenant context, permission guard, problem filter,
│  │  │  │                         # pagination, idempotency, outbox, audit, clock, db (kysely), rls
│  │  │  ├─ platform/              # tenancy, identity, rbac, documents, notifications, search, tasks, imports, integration
│  │  │  ├─ common/                # suppliers, compliance, approvals, service-requests
│  │  │  ├─ strata/                # schemes, register, budgets, levies, payments, banking, ledger, arrears,
│  │  │  │                         # invoices, procurement, meetings, comms, portal, insurance, reports
│  │  │  ├─ fm/                    # properties, assets, lifecycle, ppm, work-orders, sla, workforce, inspections,
│  │  │  │                         # ops-centre, analytics, crm, portal
│  │  │  ├─ ai/                    # gateway, intent, tools/, retriever, indexer, validator, executor, evals
│  │  │  └─ integrations/          # adapters/{bank,payments,collections,resident-apps,notify,llm,embeddings}
│  │  ├─ migrations/               # SQL (node-pg-migrate)
│  │  └─ test/                     # api, integration, security suites
│  ├─ web/                         # React + Vite: /app, /portal, /field, /fm-portal, /pay
│  │  └─ src/{routes,features/<module>,components,lib/api (generated from OpenAPI)}
│  └─ mocks/                       # mock-bank, mock-payments, mock-collections, mock-resident-app, mock-sms, mock-llm
├─ packages/
│  ├─ ui/                          # component library + Storybook
│  ├─ contracts/                   # OPENAPI.yaml → generated TS types & zod (openapi-typescript, orval)
│  ├─ domain-kit/                  # money, dates/business-time, rrule, state-machine helpers
│  └─ eslint-config/
├─ evals/                          # AI datasets & runner
├─ e2e/                            # Playwright
├─ perf/                           # k6 scripts
├─ infra/
│  ├─ docker-compose.yml
│  ├─ keycloak/vertex-realm.json
│  ├─ helm/  terraform/ (reference)
│  └─ grafana/dashboards/
├─ seed/                           # seed scripts + fixtures (synthetic)
├─ scripts/                        # check-traceability.ts, dev-secrets.ts
├─ docs/                           # this documentation
└─ .github/workflows/
```
Module rule (eslint-plugin-boundaries): `strata/*` and `fm/*` may import `core`, `platform` services, `common` services, `domain-kit`; never each other's internals.
