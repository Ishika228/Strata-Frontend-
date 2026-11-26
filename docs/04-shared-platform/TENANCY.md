# Tenancy & Isolation

Evidence: multi-customer SaaS INFERRED (EV-015); isolation model UNKNOWN → PROPOSED.

## Model
- **Shared database, shared schema, `tenant_id` column** on every tenant-owned table (uuid, NOT NULL, indexed, first column of composite indexes).
- **Defence in depth**:
  1. Auth token → `tenant_id` claim (selected membership). Never from request body/path for non-platform users.
  2. Service layer: repository base class appends `tenant_id = :ctx` to every query; writes stamp tenant.
  3. **Postgres RLS**: `ALTER TABLE … ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation USING (tenant_id = current_setting('app.tenant_id')::uuid) WITH CHECK (same)`. API connects as role `app_user` (no BYPASSRLS); each transaction runs `SET LOCAL app.tenant_id = …`.
  4. Object storage keys prefixed `tenants/{tenant_id}/…`; signed URLs generated only after document authorization.
  5. Search index & embeddings carry `tenant_id`; vector queries filter by tenant **in SQL** before similarity ranking.
  6. Cache keys prefixed with tenant.
  7. Background jobs carry tenant id in payload; worker sets RLS context per job.
- **Platform admin** uses separate `platform_admin` DB role with audited `SET app.tenant_id` per action (no BYPASSRLS for app paths); cross-tenant operations limited to tenant lifecycle & imports.

## Tenant lifecycle
`provisioning → active → suspended → offboarding → deleted` (data export then purge after 30 days; financial retention overrides per NFR-16).

## Tenant configuration
products[], timezone, currency, locale, jurisdiction defaults, terminology aliases, branding, SSO config, notification sender domains, AI settings (enabled, token budget, features), thresholds (approvals, arrears, SLA defaults).

## Users across tenants
A `User` may have `Membership` in several tenants (e.g. a contractor serving two management companies). Token holds one active tenant; switching re-issues token.

## Isolation tests
TEN-01..TEN-12 in [../12-testing/SECURITY_TESTS.md](../12-testing/SECURITY_TESTS.md): API by id across tenants (404), list endpoints, search, documents signed URL reuse, RLS with missing context (0 rows), job payload tampering, AI retrieval, webhook delivery, export, cache poisoning, import, reporting views.
