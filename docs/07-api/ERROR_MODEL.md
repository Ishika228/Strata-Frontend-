# Error Model

RFC 9457 Problem Details, `Content-Type: application/problem+json`.
```json
{
  "type": "https://errors.vertex.local/validation",
  "title": "Validation failed",
  "status": 422,
  "code": "VALIDATION_FAILED",
  "detail": "2 fields are invalid",
  "instance": "/api/v1/strata/schemes",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "errors": [{"path": "/registrationNo", "code": "REQUIRED", "message": "is required"}]
}
```
| HTTP | code(s) | When |
|---|---|---|
| 400 | `MALFORMED_REQUEST` | Unparseable JSON |
| 401 | `UNAUTHENTICATED` | Missing/invalid token or signature |
| 403 | `FORBIDDEN`, `APPROVAL_LIMIT_EXCEEDED`, `NOT_ELIGIBLE`, `MFA_STEP_UP_REQUIRED` | Authenticated but not allowed |
| 404 | `NOT_FOUND` | Missing **or out of scope** |
| 409 | `INVALID_STATE_TRANSITION`, `DUPLICATE_*`, `PERIOD_CLOSED`, `VERSION_CONFLICT`, `IDEMPOTENCY_KEY_REUSED`, `TEST_SEND_REQUIRED` | Conflicts |
| 410 | `PROPOSAL_EXPIRED` | AI action expired |
| 413 | `PAYLOAD_TOO_LARGE` | Body > 1 MB (JSON) |
| 422 | `VALIDATION_FAILED`, `SUPPLIER_NON_COMPLIANT`, `EVIDENCE_REQUIRED`, `UNBALANCED_ENTRY` | Semantic validation |
| 429 | `RATE_LIMITED`, `AI_BUDGET_EXCEEDED` | With `Retry-After` |
| 500 | `INTERNAL` | No internal details leaked |
| 503 | `DEPENDENCY_UNAVAILABLE` | Downstream outage (e.g. LLM) |

Optimistic locking: `If-Match: "<version>"` on PATCH; mismatch → 409 `VERSION_CONFLICT`.
