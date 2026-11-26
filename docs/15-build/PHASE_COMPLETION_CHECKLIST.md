# Phase (Slice) Completion Checklist

Apply to every slice in BUILD_ORDER.

- [ ] Migrations merged; RLS applied to all new tenant tables (TEN-05 extended automatically)
- [ ] OpenAPI updated (packages/contracts) and oasdiff passes; generated client updated
- [ ] Every new route has `@Permission`/`@Public`
- [ ] Business rules implemented reference BR IDs in code
- [ ] State machines declared; illegal transitions return 409
- [ ] Audit + outbox events for all state changes
- [ ] Unit, API, functional tests for the slice's FRs green; traceability matrix updated
- [ ] RBAC negative and tenant isolation tests added for new resources
- [ ] UI screens with all UX states (loading/empty/error/permission)
- [ ] Accessibility scan clean for new screens
- [ ] Seed data extended; demo step added/updated
- [ ] Observability: metrics, logs, alerts for new jobs/integrations
- [ ] Docs updated where design changed (no evidence statements altered)
- [ ] Product owner demo accepted
