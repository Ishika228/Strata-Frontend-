# Security Architecture

## Evidence
Urbanise publicly states AWS hosting, ISO 27001 certification and "bank-grade security" (EV-001, EV-002, EV-058); Merlo states no customer data is used to train AI models (EV-115). Controls and implementation are **UNKNOWN**. Everything below is an **independent POC proposal**, aligned to OWASP ASVS L2 and ISO 27001 Annex A themes.

## Threat model (STRIDE summary)
| Asset | Threat | Control |
|---|---|---|
| Tenant data | Cross-tenant read (I) | App scoping + RLS + tenant-prefixed storage/cache (TENANCY) |
| Trust ledger | Tampering (T), repudiation (R) | Immutable lines, balanced trigger, period lock, hash-chained audit |
| Payments | Spoofed webhooks (S) | HMAC-SHA256 signatures, timestamp tolerance 5 min, idempotency |
| Supplier bank details | Fraudulent change (T) | Step-up MFA, dual control (second user approves), notify supplier, 24 h payment hold after change |
| Accounts | Credential stuffing (S) | MFA, lockout, breached-password check, SSO |
| Documents | Unauthorised download (I) | Authz before signed URL, 5 min expiry, no public buckets |
| Uploads | Malware, polyglots (E) | AV scan, magic-byte check, allow-list, size cap, re-encode images, strip EXIF GPS on portal photos (keep for asset capture by staff) |
| AI | Prompt injection, data exfiltration (I/E) | Tools under user RBAC, retrieval tenant filter in SQL, output validation, no auto-actions, egress allow-list (AI_SECURITY) |
| API | Mass assignment, IDOR (T/I) | DTO allow-lists (class-validator `whitelist: true, forbidNonWhitelisted`), scoped loaders, 404 on out-of-scope |
| Availability | Abuse (D) | Rate limits per user/IP/client (Redis token bucket), body size limits, query cost limits (page size ≤ 100) |

## Controls
| Area | Control |
|---|---|
| Authentication | Keycloak OIDC, PKCE, MFA (staff), SSO Entra ID (IDENTITY_AND_AUTH) |
| Authorization | RBAC with scopes; guard + service + RLS (RBAC) |
| Tenant isolation | TENANCY.md |
| Audit logging | Append-only, hash chain, sensitive-read logging |
| Document authorization | BR-SH-03 + ACL; signed URLs |
| API authorization | Route permission metadata required — CI test fails if any route lacks `@Permission()` or `@Public()` |
| Secrets | Env from secret manager (Doppler/Vault/AWS SM); never committed; gitleaks in CI; rotation runbook (13-devops/SECRETS) |
| Encryption in transit | TLS 1.2+ (HSTS), internal TLS optional in POC |
| Encryption at rest | Postgres volume/RDS encryption; S3 SSE; app-level AES-256-GCM envelope encryption for bank account numbers & TFN-like identifiers (KMS-wrapped data key) |
| Input validation | Zod/class-validator schemas from OpenAPI; server-side only trust; output encoding in React; CSP `default-src 'self'` |
| File validation | See uploads row |
| AI authorization | AI_SECURITY.md |
| Headers | CSP, X-Content-Type-Options, Referrer-Policy, frame-ancestors 'none' |
| Dependencies | Renovate, `npm audit`/OSV scan, SBOM (CycloneDX) |
| Logging hygiene | Pino redaction paths (authorization, password, bank, token, email body) |
| Backups | Encrypted daily backups, restore test monthly |

## Negative tests
Full catalog: [../12-testing/SECURITY_TESTS.md](../12-testing/SECURITY_TESTS.md) (SEC-*, RBAC-N*, TEN-*, DOC-*, AISEC-*).
