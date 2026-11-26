# Operations Runbooks

| Runbook | Steps |
|---|---|
| Levy run failed | Check job logs (trace id) → fix cause (e.g. missing budget approval) → `POST /strata/schemes/{id}/levy-runs` with same period (idempotent) → verify notices count |
| Unmatched bank lines spike | Inspect statement references; check CRN format change; bulk match via UI; update matching rule config |
| Invariant failure | Freeze period closes (flag), identify entries via reference query, create corrective journal with approval, document incident |
| Webhook subscriber disabled | Contact subscriber; re-enable; redeliver failed events range |
| DLQ items | Inspect redacted payload, fix, retry or discard (audited) |
| AI budget exceeded | Confirm with tenant admin; raise budget in Settings › AI or wait for month reset |
| AI provider outage | Confirm status; circuit breaker auto; disable `ai.*` flags if prolonged |
| Rotate secret | Create new secret version → deploy → for HMAC enable dual-validity → revoke old after 24 h |
| Restore backup | Provision instance from snapshot/PITR → run invariants → switch connection string → smoke |
| Onboard tenant | Create tenant → SSO config (optional) → admin invite → import jobs (WF-01) → enable products |
| Offboard tenant | Export (`/tenants/{id}/export`) → suspend → after 30 d purge job (financial archive retained) |
| Supplier bank change fraud suspicion | Freeze supplier payments flag → verify with supplier via known contact → audit trail review |

On-call (POC): business hours only; demo environment has scheduled downtime windows announced in advance.
