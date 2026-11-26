# Configuration

12-factor; validated at startup with Zod (`src/config.ts`); app refuses to start on invalid config.

| Variable | Example | Notes |
|---|---|---|
| NODE_ENV | production | |
| PORT | 3000 | |
| DATABASE_URL | postgres://app_user@db:5432/vertex | app role without BYPASSRLS |
| DATABASE_MIGRATOR_URL | postgres://migrator@… | migrations only |
| REDIS_URL | redis://redis:6379 | |
| S3_ENDPOINT / S3_BUCKET_QUARANTINE / S3_BUCKET_DOCS / S3_REGION | | |
| OIDC_ISSUER | http://keycloak:8080/realms/vertex | |
| OIDC_AUDIENCE | vertex-api | |
| PUBLIC_BASE_URL | https://demo.vertex.example | links in emails |
| SMTP_URL | smtp://mailpit:1025 | |
| SMS_PROVIDER_URL | http://mocks:4010/sms | |
| CLAMAV_HOST | clamav:3310 | |
| KMS_KEY_ID / LOCAL_MASTER_KEY | | envelope encryption |
| PAYLINK_SIGNING_KEY | (secret) | ES256 |
| ANTHROPIC_API_KEY | (secret) | optional locally |
| AI_MODEL_MAIN / AI_MODEL_FAST | claude-sonnet-5-5 / claude-haiku-5-5 | |
| EMBEDDING_PROVIDER / EMBEDDING_API_KEY / EMBEDDING_DIM | voyage / … / 1024 | |
| AI_DEFAULT_MONTHLY_BUDGET_USD | 50 | per tenant default |
| OTEL_EXPORTER_OTLP_ENDPOINT | http://otel:4318 | |
| LOG_LEVEL | info | |
| FEATURE_FLAGS | ai.assistant,ai.drafts,fm.offline | |

Tenant-level configuration lives in `platform.tenants.settings` (thresholds, jurisdictions, branding, integrations, AI) and scheme/property settings — edited via Settings UI, audited.
