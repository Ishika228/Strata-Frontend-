# Deployment

## Artifacts
- `vertex-api` image (Node 22 alpine, non-root, read-only FS) — runs `api` or `worker` by `ROLE` env.
- `vertex-web` image (Nginx serving static build, CSP headers).
- `vertex-mocks` image.
- Keycloak with realm import.

## Topology (demo, reference AWS — independent proposal)
ALB (TLS) → ECS Fargate services: web (2), api (2), worker (2), keycloak (1); RDS PostgreSQL 16 (Multi-AZ optional) with pgvector; ElastiCache Redis; S3 (SSE-KMS, block public); CloudWatch/OTel collector sidecar; Secrets Manager. Equivalent Helm chart for k8s in `infra/helm`.

## Procedure
1. `release.yml` builds & signs images.
2. Run migration task (one-off) → wait success.
3. Rolling update api/worker (min healthy 100%, max 200%); health checks `/healthz` (liveness) and `/readyz` (DB, Redis, S3 reachable).
4. Smoke tests (login, list schemes, create WO in demo tenant sandbox).
5. Mark release; post deploy note.

Local: `docker compose up -d && pnpm migrate && pnpm seed && pnpm dev`.
