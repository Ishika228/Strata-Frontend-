# API Tests

Every test validates responses against OPENAPI.yaml (where the operation is defined) and Problem format for errors.

| ID | Area | Case | Expected |
|---|---|---|---|
| API-AUTH-01 | Auth | No token | 401 Problem |
| API-AUTH-02 | Auth | Expired token | 401 |
| API-AUTH-03 | Auth | Token for tenant user is not member of | 401 |
| API-AUTH-04 | Auth | Client-credentials token missing scope | 403 |
| API-PERM-01 | Authz | Every route has permission metadata (route enumeration) | pass |
| API-VAL-01 | Validation | Unknown field in body | 422 UNKNOWN_FIELD |
| API-VAL-02 | Validation | Money float `amountCents: 10.5` | 422 |
| API-VAL-03 | Validation | Currency mismatch | 422 CURRENCY_MISMATCH |
| API-VAL-04 | Validation | limit=101 | 400/422 INVALID_LIMIT |
| API-PAGE-01 | Pagination | Iterate cursor over 120 rows | No dupes/missing; stable |
| API-PAGE-02 | Pagination | Tampered cursor | 400 INVALID_CURSOR |
| API-FILT-01 | Filtering | Unknown filter | 400 UNKNOWN_FILTER |
| API-FILT-02 | Filtering | Range filters | Correct subset |
| API-IDEM-01 | Idempotency | Same key + body twice (payment) | One payment; replay header |
| API-IDEM-02 | Idempotency | Same key different body | 409 IDEMPOTENCY_KEY_REUSED |
| API-IDEM-03 | Idempotency | Concurrent duplicates | One succeeds, other 409 REQUEST_IN_PROGRESS or replay |
| API-IDEM-04 | Idempotency | Missing key on levy run | 400 |
| API-LOCK-01 | Concurrency | PATCH with stale If-Match | 409 VERSION_CONFLICT |
| API-STATE-01 | State | Invalid WO transition (new→completed) | 409 INVALID_STATE_TRANSITION |
| API-STATE-02 | State | Approve already-approved | 409 |
| API-ERR-01 | Errors | 500 path | Problem without stack trace; traceId present |
| API-RL-01 | Rate limit | 200 req/10 s | 429 with Retry-After |
| API-OAS-01 | Contract | oasdiff breaking vs main | none |
| API-ST-* | Strata | One happy + one negative test per Strata operation in API_CATALOG | as documented |
| API-FM-* | FM | Same for FM operations | as documented |
| API-PT-* | Portal | Same for portal operations | as documented |
