# Alerting

| Alert | Condition | Severity | Route |
|---|---|---|---|
| API error rate | 5xx > 2% for 5 min | P1 | on-call |
| API latency | p95 > 1 s for 10 min | P2 | on-call |
| Readiness failing | any instance 3 min | P1 | on-call |
| Queue backlog | depth > 1,000 or oldest > 15 min (levy/arrears/sla) | P2 | on-call |
| DLQ non-empty | > 0 for 30 min | P3 | team channel |
| Levy run failed | any | P2 | finance-ops channel + on-call |
| Invariant failure | any INV-* fails | P1 | on-call + product owner |
| Audit hash chain broken | verifier fails | P1 | security |
| Webhook delivery success | < 90% 1 h | P3 | team |
| Payment webhook signature failures | > 10 in 10 min | P2 | security |
| Login failure spike | > 50/min tenant | P2 | security |
| AI cost | tenant > 80% budget | info → tenant admin; 100% P3 | email |
| AI provider errors | > 20% 5 min | P3 | team |
| DB storage | > 80% | P2 | on-call |
| Backup missing | none in 26 h | P1 | on-call |

Runbook link included in each alert ([OPERATIONS.md](OPERATIONS.md)).
