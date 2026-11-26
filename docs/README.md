# Vertex Strata + Vertex FM — POC Engineering Documentation

Independent POC inspired by publicly described capabilities of Urbanise Strata and Urbanise FM. **No Urbanise code, private API, internal design or customer data was used.** Every product claim is traced to a public source in the evidence register; every design decision is labelled PROPOSED.

Start here:
1. [00-discovery/BUILD_READINESS_REPORT.md](00-discovery/BUILD_READINESS_REPORT.md) — status & scores
2. [00-discovery/EVIDENCE_REGISTER.md](00-discovery/EVIDENCE_REGISTER.md) — what is known (96 evidence rows)
3. [00-discovery/PRODUCT_SCOPE.md](00-discovery/PRODUCT_SCOPE.md) — what we build
4. [15-build/BUILD_ORDER.md](15-build/BUILD_ORDER.md) — how we build it

| Folder | Contents |
|---|---|
| 00-discovery | Source inventory, web source register, evidence register, summary, scope, unknowns, conflicts, gaps, validation, readiness |
| 01-product | Product model, personas, glossary, workflow catalog (27 workflows) |
| 02-requirements | Functional & non-functional requirements, user stories, business rules |
| 03-strata | Capability matrix, levy engine, arrears, trust accounting, procurement & invoices, meetings & voting, portal & comms |
| 03-fm | Capability matrix, work management, asset lifecycle, suppliers & compliance, ops centre & portal |
| 04-shared-platform | RBAC, tenancy, identity, common services |
| 05-architecture | System architecture, ADRs, state machines, events, security architecture |
| 06-database | Domain model, SCHEMA.sql, ERD, data governance |
| 07-api | API catalog, OPENAPI.yaml, auth, authz, validation, errors, pagination, filtering, idempotency, webhooks, versioning |
| 08-ux | IA, screen inventory (63), navigation, flows, components, forms, tables, dashboards, states |
| 09-ai | Requirements, capabilities, architecture, tools, RAG, document RAG, security, guardrails, evaluation, test cases |
| 10-integrations | Catalog, architecture, mapping, auth, webhooks, retry, errors, mocks |
| 11-reporting | Requirements, KPIs, dashboards, reports, data sources |
| 12-testing | Strategy + functional, API, integration, E2E, security, performance, notifications/webhooks, failure recovery, financial integrity |
| 13-devops | DevSecOps, CI/CD, environments, configuration, secrets, migrations, deployment, rollback, monitoring, logging, alerting, operations |
| 14-traceability | Traceability matrix & gaps |
| 15-build | Build order, implementation guide, repo structure, seed, demo, UAT, acceptance, phase checklist, limitations, backlog |

Labels used everywhere: CONFIRMED · OBSERVED · INFERRED · PROPOSED · UNKNOWN · CONFLICT. ⚖ marks jurisdiction-sensitive rules needing SME validation.
