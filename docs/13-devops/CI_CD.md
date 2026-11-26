# CI/CD (GitHub Actions)

## Workflows
| Workflow | Trigger | Jobs |
|---|---|---|
| `ci.yml` | PR, push main | install (pnpm, cache) → lint/typecheck → unit → api (Testcontainers) → contract → traceability check → semgrep/gitleaks/osv → build web/api images → Playwright smoke (compose) → AI eval (mock subset) |
| `nightly.yml` | cron 02:00 | full E2E, ZAP baseline, k6 PERF-01/03/04 (reduced), AI live evals, dependency scan |
| `release.yml` | tag `v*` | build & sign images, SBOM, push to registry, deploy staging, run migrations, smoke, manual approval → demo env |

## Promotion
`main` → auto deploy **dev**; tag → **staging** → approval → **demo** (POC "prod"). Same immutable image digest across envs. Migrations run as a pre-deploy job (`node dist/migrate.js up`) with lock.

## Conventions
Trunk-based, short-lived branches, Conventional Commits, changelog via release-please. Required checks: ci.yml all green.
