# Integration Tests (adapters & mocks)

| ID | FR | Case | Expected |
|---|---|---|---|
| INT-T-01 | FR-IN-01 | Import camt.053 with 3 entries | 3 bank_transactions; balances checked |
| INT-T-02 | FR-IN-01 | Statement gap | Import blocked + task |
| INT-T-03 | FR-IN-01 | Duplicate bank_ref | Skipped |
| INT-T-04 | FR-IN-01 | Payables batch: one item fails | Invoice back to approved; others paid |
| INT-T-05 | FR-IN-02 | Checkout success webhook | Payment succeeded & allocated |
| INT-T-06 | FR-IN-02 | Duplicate webhook | Single payment |
| INT-T-07 | FR-IN-02 | Bad signature | 401; nothing stored except security log |
| INT-T-08 | FR-IN-02 | Webhook never arrives | Poll after 15 min finds status |
| INT-T-09 | FR-IN-03 | Referral created → status progression | Status updates; audit |
| INT-T-10 | FR-IN-04 | Inbound ballot results | Motion result stored; idempotent |
| INT-T-11 | FR-IN-05 | Resident app create request (client creds) | Request + external_ref |
| INT-T-12 | FR-IN-05 | Same externalId again | 200 existing |
| INT-T-13 | FR-IN-05 | Unknown propertyRef | 422 UNKNOWN_PROPERTY_REF |
| INT-T-14 | FR-IN-05 | WO completed | Webhook with photos signed URLs; signature verifies |
| INT-T-15 | FR-IN-06 | Email via Mailpit | Delivered; bounce simulation marks contact |
| INT-T-16 | FR-IN-07 | SSO broker | Claims mapped; membership required |
| INT-T-17 | — | LLM client 429 then 200 | Retries then success |
| INT-T-18 | — | Embedding failure | Index job re-queued |
