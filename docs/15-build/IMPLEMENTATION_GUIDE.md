# Implementation Guide

## Module recipe (repeat per feature)
1. **Migration**: tables from SCHEMA.sql subset; RLS applied by baseline loop for new tables (`scripts/apply-rls.sql` re-run); indexes.
2. **Domain**: pure functions in `domain/` (e.g. `apportionLevy()`, `allocatePayment()`, `ageCharges()`, `addBusinessMinutes()`), unit tests first (FIN-*).
3. **State machine**: declarative table `*.states.ts` → `transition(entity, to, ctx)` checks guards, writes event, audit, outbox.
4. **Repository**: Kysely queries via `ScopedRepository` (tenant + scope predicates).
5. **Service**: transactions (`db.transaction(trx => …)` with `SET LOCAL app.tenant_id`), business rules (BUSINESS_RULES IDs in code comments), emit events.
6. **Controller**: DTOs generated from `packages/contracts`; `@Permission()`; idempotency decorator for money ops.
7. **Jobs**: BullMQ processors; idempotent; use `Clock`.
8. **UI**: route + feature folder; API hooks generated; forms with zod; DataTable configs (TABLES.md); UX states.
9. **Tests**: FT/API/E2E per traceability matrix; update `docs/14-traceability` if IDs added.
10. **Seed**: extend seed for demo.

## Key implementation notes
- **Money**: `Money` type = `{amountCents: bigint|number, currency}`; never floats; rounding half-up only in penalty/discount functions.
- **Business time** (SLA): implement `addBusinessMinutes(start, minutes, calendar)` with holidays; unit-test DST transitions (Australia/Sydney).
- **RRULE**: `rrule` npm lib; limit to DAILY+; occurrences generated in tenant timezone.
- **PDF**: worker renders HTML templates in `apps/api/src/*/templates/*.hbs` via Playwright; store in documents.
- **Offline PWA**: Workbox; IndexedDB queue `{clientEventId, woId, type, payload, occurredAt}`; `/fm/me/sync` processes in order per WO; conflict returns per-item error.
- **Search index**: outbox consumer upserts `platform.search_index` with `scope_keys` (`scheme:<id>`, `property:<id>`, `tenant`).
- **RBAC scope predicates**: `scopeFilter(user, perm)` returns SQL fragment e.g. `scheme_id = ANY($schemes)`; lots for owners via ownership join.
- **AI**: Anthropic SDK tool-use loop with max 6 tool iterations; stream via SSE; persist each step.
- **Do not**: put business logic in controllers; call another module's repository; log PII; use `BYPASSRLS`.
