# API Authorization

Model: [../04-shared-platform/RBAC.md](../04-shared-platform/RBAC.md). Evidence: UNKNOWN for Urbanise; PROPOSED.

1. **Route permission** — every controller method carries `@Permission('module.resource.action')` or `@Public()`; a CI test enumerates routes and fails if neither is present.
2. **Resource scope** — services load resources through `ScopedRepository.findForUser(user, id, permission)`; out-of-scope → `404 NOT_FOUND` (prevents enumeration). Explicit permission failures on visible resources → `403 FORBIDDEN`.
3. **Field-level** — response serializers drop restricted fields (e.g. `bankAccount` → only `last4`; owners don't see other owners' contact details).
4. **Value limits** — approval limit (`role_assignments.approval_limit_cents`) checked on decision → `403 APPROVAL_LIMIT_EXCEEDED`.
5. **Integration scopes** — client scopes (`fm.requests:write`, `strata.read`, `strata.voting:write`) and optional `scope_property_ids`.
6. **Database** — RLS enforces tenant regardless of app bugs.
7. **AI** — tools call the same services with the end user's identity (BR-AI-01).

Lists are filtered with scope predicates; counts reflect only visible rows.
