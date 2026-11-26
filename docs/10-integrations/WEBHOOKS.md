# Integration Webhooks

Outbound webhook contract: [../07-api/WEBHOOKS.md](../07-api/WEBHOOKS.md).

## Inbound webhooks handled
| Endpoint | Provider events | Handler |
|---|---|---|
| `/integrations/payments/{provider}/webhook` | payment.succeeded, payment.failed, refund.succeeded | Create/update payment; allocate; emit `strata.payment.succeeded` |
| `/integrations/collections/{provider}/webhook` | referral.status_changed, payment.collected | Update referral; (collected payments arrive via bank) |
| `/integrations/bank/{provider}/webhook` | statement.available, payment.status | Trigger statement fetch; update batch item |

Processing: verify signature → persist raw event (`integration_events` with provider event id unique) → 204 quickly → async process → idempotent. Unknown event types → stored & ignored.
