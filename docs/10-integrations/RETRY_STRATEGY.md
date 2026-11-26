# Retry Strategy

| Call type | Retry on | Schedule | Max | After max |
|---|---|---|---|---|
| Outbound provider API (bank, payments, collections) | network errors, 408, 429 (honour Retry-After), 5xx | exponential 1 s, 4 s, 16 s, 1 m, 5 m + jitter ±20% | 5 | DLQ + task to admin |
| Outbound webhooks to subscribers | non-2xx, timeout | 1 m, 5 m, 30 m, 2 h, 6 h, 12 h, 24 h | 7 | `failed`; auto-disable after 50 consecutive |
| Notifications (email/SMS) | transient | 30 s, 2 m, 10 m | 3 | fall back to next preferred channel; mark failed |
| LLM | 429, 529/overloaded, 5xx | 1 s, 2 s, 4 s | 3 | 503 to user; circuit breaker (5 failures/1 min → open 60 s) |
| Embeddings | transient | 5 s, 30 s, 2 m | 3 | re-queue doc index job (max 24 h) |
| Inbound processing (async) | handler exceptions | 10 s, 1 m, 10 m | 3 | DLQ |

Never retry: 400/401/403/404/422 (except 401 once after token refresh). All retried operations must be idempotent (keys in [../07-api/IDEMPOTENCY.md](../07-api/IDEMPOTENCY.md)).
