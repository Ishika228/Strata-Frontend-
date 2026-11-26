# Integration Architecture (PROPOSED)

```
Domain module ──(outbox event)──► Integration dispatcher (worker)
                                   │ selects adapter by tenant config
                                   ▼
                     Adapter interface (port)  ── mock implementation (docker svc)
                                   │           └─ real implementation (future)
Inbound: provider → /integrations/... controller → signature/auth check → idempotency (external_refs / provider event id) → command to domain service
```
- **Ports & adapters**: `BankAdapter`, `PaymentAdapter`, `CollectionsAdapter`, `ResidentAppAdapter`, `NotificationProvider`, `LlmClient`, `EmbeddingClient`. Each has a contract test suite run against the mock and (later) the real sandbox.
- **Configuration** per tenant: `integrations: {bank: {provider, accountMap}, payments: {provider}, collections: {provider}, residentApps: [{provider, clientId, propertyMap}]}`; secrets in secret manager referenced by key.
- **Mapping**: `external_refs` table maps provider ids ↔ Vertex ids.
- **Reliability**: outbox → BullMQ queue per adapter; retries ([RETRY_STRATEGY.md](RETRY_STRATEGY.md)); DLQ with admin UI and replay.
- **Observability**: span per outbound call (provider, operation, status, latency); metrics `integration_calls_total{provider,op,status}`.
- **Security**: egress allow-list per provider host; HMAC for webhooks; no secrets in logs.
