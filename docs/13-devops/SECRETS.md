# Secrets Management

- Local: `.env` (git-ignored) generated from `.env.example` with **dummy** values; `scripts/dev-secrets.ts` creates random local keys.
- Cloud: AWS Secrets Manager / Doppler / Vault — injected as env at runtime; never baked into images.
- Inventory: DB passwords, Redis password, S3 keys (prefer IAM roles), Keycloak admin & client secrets, pay-link signing key, KMS key ref, webhook HMAC secrets (per subscription/provider, stored encrypted in DB), Anthropic & embedding API keys, SMTP creds.
- Rotation: API keys 90 d; HMAC secrets dual-validity 24 h; DB creds on staff change; runbook `OPERATIONS.md#rotate-secret`.
- Detection: gitleaks pre-commit + CI; log redaction tests (SEC-14).
- Access: least privilege; only CI deploy role and runtime role can read prod-like secrets; break-glass audited.
