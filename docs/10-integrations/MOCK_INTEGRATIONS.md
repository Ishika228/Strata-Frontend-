# Mock Integrations

Single Node service `mocks/` (Fastify) started by docker-compose, port 4010, with an admin UI at `/_admin` to trigger scenarios. All mock data synthetic.

| Mock | Endpoints | Scenario controls |
|---|---|---|
| mock-bank | `GET /bank/statements?account=&date=` (camt.053 or CSV), `POST /bank/payments`, `GET /bank/payments/{id}`; webhook `statement.available`, `payment.status` | Generate statement from Vertex pay-ins + noise (bank fees, unknown deposits, wrong refs); fail payment X; delay |
| mock-payments | `POST /checkout-sessions` → hosted page `/checkout/{id}` with Pay / Decline buttons; webhooks signed | Success, decline, delayed webhook, duplicate webhook, amount mismatch |
| mock-collections | `POST /referrals`; webhooks `referral.status_changed` | Auto-progress sent→acknowledged→in_progress→settled over N minutes |
| mock-resident-app | UI to submit resident request (calls Vertex inbound API with client creds); webhook receiver showing timeline of status + photos | Duplicate submit (same externalId), unknown property |
| mock-sms | `POST /sms` stores message; UI lists | Failure rate % |
| Mailpit | SMTP 1025, UI 8025 | — |
| Keycloak test IdP | second realm acting as "corporate IdP" for SSO demo | — |
| LLM | real Anthropic API when `ANTHROPIC_API_KEY` set; otherwise `mock-llm` returns scripted responses for tests | deterministic fixtures for CI |

Contract tests: `packages/adapters/*/contract.spec.ts` run against mocks in CI.
