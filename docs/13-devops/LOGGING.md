# Logging

- Pino JSON logs: `ts, level, msg, service, env, trace_id, span_id, tenant_id, user_id (hashed for portal users), route, status, duration_ms, job, event_id`.
- Redaction paths: `req.headers.authorization`, `*.password`, `*.token`, `*.secret`, `*.bankAccount*`, `*.accountNo*`, email bodies, AI prompt content (only lengths + hashes logged).
- Levels: error (actionable), warn (degraded), info (requests summary, job lifecycle), debug (dev only).
- Correlation: `X-Request-Id` accepted/generated; propagated to jobs and outbound calls (W3C traceparent).
- Retention: 30 days hot (Loki), 1 year cold for security logs. Audit events are **not** logs — stored in DB (7 years).
- PII in logs prohibited except tenant/user ids (SEC-14 test).
