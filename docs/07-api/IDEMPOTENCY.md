# Idempotency

Required (`Idempotency-Key` header, 8–128 chars) on: levy runs, sundry charges, payments/refunds, payment intents, journals/reversals, payment batches & submit, votes, debt referrals, technician sync, inbound integration creates.

Behaviour:
1. Key scoped by (tenant, actor, key). Stored in `platform.idempotency_keys` with request hash (method+path+canonical body).
2. First request: row inserted (status in-progress) inside the transaction; response persisted on commit.
3. Replay with same hash → original status & body, header `Idempotent-Replayed: true`.
4. Same key, different hash → 409 `IDEMPOTENCY_KEY_REUSED`.
5. Concurrent duplicate while in progress → 409 `REQUEST_IN_PROGRESS` with `Retry-After: 1`.
6. TTL 24 h (payments 7 days).

Natural idempotency in addition: unique constraints (provider_ref, bank_ref, levy_schedule_item_id, (motion, lot), clientEventId, external_refs).
Inbound webhooks are idempotent on provider event id. Consumers of outbox events are idempotent on event id (`processed_events` table per consumer).
