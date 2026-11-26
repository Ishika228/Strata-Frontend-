# Monitoring

OpenTelemetry SDK in api & worker → collector → Prometheus (metrics), Tempo (traces), Loki (logs), Grafana dashboards.

| Signal | Metrics |
|---|---|
| API (RED) | `http_server_requests_total{route,status}`, duration histogram, error rate |
| Jobs | queue depth, job duration, failures, DLQ size per queue (levy, arrears, ppm, sla, notifications, webhooks, ai-index) |
| Business | levy runs completed/failed, payments succeeded/failed, unmatched bank lines, SLA breaches/hour, WOs created/closed, approvals pending age |
| Integrations | calls by provider/op/status, latency, webhook delivery success % |
| AI | requests, tokens in/out, cost, latency, tool errors, validator interventions, budget utilisation |
| DB | connections, slow queries (pg_stat_statements), replication lag, table bloat |
| Security | login failures, lockouts, 403/404 spikes per user, signature failures |
| Invariants | INV-01..05 result gauge (1 = pass) |

Dashboards: Platform overview, API, Jobs & queues, Strata finance ops, FM ops, Integrations, AI, Security. Synthetic checks every 5 min: login page, `/readyz`, portal pay link mock.
