# Test Strategy

| Level | Tooling | Scope | Gate |
|---|---|---|---|
| Unit | Vitest | Pure logic: levy apportionment, allocation, ageing, penalties, SLA business-time, RRULE, lifecycle, state machines, RBAC policy | ≥ 85% lines on `domain/**`; 100% on money functions |
| Component | Vitest + Testing Library | UI components, forms | key flows |
| API / integration | Vitest + Supertest + Testcontainers (Postgres, Redis, MinIO, Keycloak) | Endpoints with DB, RLS, outbox | all API_TESTS |
| Contract | Adapter contract suites vs mocks; OpenAPI response validation (every API test validates against OPENAPI.yaml) | adapters, API | 100% pass |
| E2E | Playwright (desktop + mobile emulation) against docker-compose stack with seed | UI_E2E_TESTS | smoke on PR, full nightly |
| Security | Custom suites (SECURITY_TESTS), OWASP ZAP baseline, Semgrep, gitleaks, dependency scan | | 0 high/critical |
| Performance | k6 | PERFORMANCE_TESTS | NFR thresholds |
| AI | Eval runner (AI_EVALUATION) + AIT cases | | gates |
| Accessibility | axe-core in Playwright (UI-A11Y) | all primary screens | 0 serious |
| Financial integrity | Property-based tests (fast-check) + nightly invariants | FIN-*, INV-* | 100% |
| Failure recovery | Chaos-style scripted tests | FAILURE_RECOVERY_TESTS | pass |

Test data: deterministic seed ([../15-build/SEED_DATA.md](../15-build/SEED_DATA.md)) + factories. Two tenants always seeded to exercise isolation. Clock control via injectable `Clock` for schedulers/SLA.

Coverage rule: every FR maps to ≥ 1 test ID in [../14-traceability/TRACEABILITY_MATRIX.md](../14-traceability/TRACEABILITY_MATRIX.md); CI script `scripts/check-traceability.ts` fails if an FR lacks a test ID.
