# Environments

| Env | Purpose | Hosting | Data | Integrations | AI |
|---|---|---|---|---|---|
| local | Development | docker-compose (postgres, redis, minio, keycloak, mailpit, clamav, mocks, otel-lgtm) | seed | mocks | mock-llm or dev key |
| ci | Automated tests | GitHub runners + Testcontainers | factories/seed | mocks | mock-llm (+ nightly live) |
| dev | Integration of main | Single VM or small k8s (k3s) / AWS ECS Fargate reference | seed, reset nightly | mocks | dev key, low budget |
| staging | Release validation, UAT | Same as demo | seed + UAT data | mocks | staging key |
| demo | Stakeholder demos | Managed Postgres (RDS/Cloud SQL), managed Redis, S3, Keycloak container | curated demo seed | mocks | prod-tier key with budget |

No real customer data in any POC environment. Each env has separate secrets, Keycloak realm, buckets, and AI budgets. Data residency default: Australia region (e.g. ap-southeast-2) for cloud envs (PROPOSED; Urbanise hosting region UNKNOWN).
