# DevSecOps

Pipeline security controls (all PROPOSED for the POC):

| Stage | Control | Tool | Fail condition |
|---|---|---|---|
| Pre-commit | Lint, format, secret scan | ESLint, Prettier, gitleaks (husky) | any finding |
| PR | Type check, unit/API tests, traceability check, permission-metadata test | tsc, Vitest | failure |
| PR | SAST | Semgrep (OWASP + custom rules: no raw SQL string concat, no `@Public` without review label) | high |
| PR | Dependency vulns | `npm audit --omit=dev`, OSV-Scanner | high/critical without waiver |
| PR | IaC/Dockerfile scan | Trivy config, hadolint | high |
| PR | OpenAPI breaking-change | oasdiff | breaking |
| Build | Container scan, SBOM | Trivy image, Syft (CycloneDX) | critical |
| Build | Image signing | cosign (keyless) | — |
| Staging | DAST | OWASP ZAP baseline | high |
| Staging | E2E + security suites + AI evals | Playwright, Vitest, eval runner | gates |
| Prod (future) | Signed image verification, admission policy | Kyverno/OPA | unsigned |

Policies: branch protection (2 reviews for `src/**/auth|rbac|ledger|ai`), CODEOWNERS, signed commits recommended, Renovate weekly, waiver file with expiry for accepted vulnerabilities, threat model reviewed per release.
