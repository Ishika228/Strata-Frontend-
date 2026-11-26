# Outbound Webhooks

Evidence: real-time status sync to resident apps (EV-086, EV-087) and two-way API (EV-008) confirm the need; Urbanise mechanism UNKNOWN. POC design (PROPOSED).

- Subscriptions: per API client; `event_types` from [../05-architecture/EVENTS.md](../05-architecture/EVENTS.md) (W-marked); HTTPS only; per-subscription secret (shown once).
- Payload: event envelope (`id, type, version, occurred_at, tenant_id, subject, data`). Data contains IDs and minimal fields; PII limited to what the subscriber's scope allows; photos as 24 h signed URLs.
- Headers: `X-Vertex-Event`, `X-Vertex-Delivery`, `X-Vertex-Timestamp`, `X-Vertex-Signature: v1=hex(hmac_sha256(secret, timestamp + "." + body))`.
- Delivery: 2xx = success; timeout 10 s; retries with exponential backoff + jitter: 1 m, 5 m, 30 m, 2 h, 6 h, 12 h, 24 h (7 attempts) → `failed`; subscription auto-disabled after 50 consecutive failures, admin notified.
- Ordering: not guaranteed; consumers use `occurred_at` and entity `version`.
- Replay: `POST /webhooks/subscriptions/{id}/redeliver {eventId}`.
- Test: `POST /webhooks/subscriptions/{id}/test` sends `ping`.

Example `fm.workorder.completed`:
```json
{"id":"0192f…","type":"fm.workorder.completed","version":1,"occurred_at":"2026-11-20T03:15:00Z",
 "tenant_id":"…","subject":{"type":"work_order","id":"…"},
 "data":{"number":"WO-000123","external_ref":{"provider":"mock-resident-app","id":"REQ-889"},
         "status":"completed","completed_at":"2026-11-20T03:14:51Z",
         "evidence":[{"kind":"after","url":"https://…signed…","expires_at":"…"}]}}
```
