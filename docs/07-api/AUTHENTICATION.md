# API Authentication

Evidence: Urbanise API authentication is **UNKNOWN**; SSO (Azure AD) exists for users (EV-006). POC design (PROPOSED):

| Caller | Mechanism | Token | Lifetime |
|---|---|---|---|
| Staff/portal web & PWA | OIDC Authorization Code + PKCE (Keycloak) | JWT access token, `aud=vertex-api` | 10 min; refresh rotating |
| Integration (server) | OAuth2 Client Credentials | JWT with `scope`, `tid`, `client_id` | 10 min |
| Payment/webhook providers | HMAC-SHA256 over `timestamp + "." + raw_body`, headers `X-Signature`, `X-Timestamp` | — | ±300 s replay window |
| Pay link (owner) | Signed JWT in URL path `/pay/{token}` (ES256), claims: tid, lot, chargeIds, exp 30 d | single-purpose | 30 d |

Validation steps in API: signature via JWKS → `iss`/`aud`/`exp`/`nbf` → `tid` must equal an active membership (users) or client's tenant (integrations) → load server-side roles. Missing/invalid → 401 `UNAUTHENTICATED` with `WWW-Authenticate: Bearer error="invalid_token"`.

Local dev: Keycloak realm export in `infra/keycloak/vertex-realm.json` with seeded test users (passwords from `.env.example`, never real).
