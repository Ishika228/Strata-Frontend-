# Identity & Authentication

Evidence: SSO for Microsoft Azure AD exists (EV-006). Implementation UNKNOWN → PROPOSED.

## Components
- **Keycloak** (POC IdP/broker) — realm `vertex`; clients `vertex-web` (public, PKCE), `vertex-api` (bearer-only), integration clients (confidential, client credentials).
- Identity brokering: per tenant, an OIDC IdP config to Microsoft Entra ID; home-realm discovery by email domain.
- API validates JWT (RS256, JWKS cache 10 min): `iss`, `aud=vertex-api`, `exp`, `sub`; custom claims `tid` (active tenant), `mid` (membership id). Roles are **not** trusted from token for authorization — loaded server-side from `role_assignments` (cached 60 s) so revocations take effect quickly.

## Flows
| Flow | Users | Detail |
|---|---|---|
| Auth code + PKCE | all web/PWA | Access token 10 min, refresh 8 h (staff) / 30 days (portal, rotating) |
| Magic link invite | owners, occupiers, fm_clients, contractors | One-time token (24 h), then set password |
| TOTP MFA | staff required; portal optional | Keycloak OTP policy |
| Client credentials | integrations | Scopes e.g. `fm.requests:write`, `strata.read` |
| Payment link token | owners (unauthenticated pay) | Signed JWT 30 days, scope: pay specific charges only |

## Policies
Password ≥ 12 chars, breached-password check (k-anonymity API optional), lockout 5/15 min, session idle 30 min staff. Logout revokes refresh token. Step-up MFA for: bank details change, payment batch submit, period close, SSO config.

## Tables
`users` (id, email unique, name, phone, status, kc_subject), `memberships` (user, tenant, status), `role_assignments`, `api_clients` (tenant, kc_client_id, scopes), `sessions_audit`.
