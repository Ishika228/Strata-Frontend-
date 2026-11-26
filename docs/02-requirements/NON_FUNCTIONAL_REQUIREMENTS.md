# Non-Functional Requirements (POC targets — all PROPOSED)

| ID | Category | Requirement | Verification |
|---|---|---|---|
| NFR-01 | Performance | p95 API read < 300 ms, write < 500 ms at seed volume ×10 (50 tenants, 2,000 schemes, 60,000 lots, 200,000 assets) | PERF-01..05 |
| NFR-02 | Performance | Levy run for 1,000-lot scheme < 30 s | PERF-03 |
| NFR-03 | Performance | Bank statement of 5,000 lines auto-matched < 60 s | PERF-04 |
| NFR-04 | Performance | AI assistant first token < 3 s, full answer p95 < 15 s | AI-PERF-01 |
| NFR-05 | Availability | 99.5% POC demo env (single region) | MON |
| NFR-06 | Security | OWASP ASVS L2 controls; tenant isolation via app checks **and** Postgres RLS | SEC-* |
| NFR-07 | Security | TLS 1.2+; AES-256 at rest (DB, object store); secrets in vault/env never in repo | SEC-20.. |
| NFR-08 | Privacy | PII minimisation in logs; AU Privacy Act-aligned data handling; data export & deletion per tenant | SEC-30 |
| NFR-09 | Audit | 100% of state transitions audited; audit append-only (DB grant + hash chain) | SEC-12 |
| NFR-10 | Financial integrity | Ledger always balanced (sum DR = sum CR per scheme); money as integer cents; no float | FIN-* tests |
| NFR-11 | Idempotency | All POST that create money movements require `Idempotency-Key` | API-IDEM-* |
| NFR-12 | Accessibility | WCAG 2.2 AA for portal & staff UI | UI-A11Y |
| NFR-13 | Mobile | Technician PWA usable offline for viewing assigned WOs and queuing updates | E2E-FM-05 |
| NFR-14 | Observability | Structured JSON logs with trace_id, tenant_id; OpenTelemetry traces; RED metrics | 13-devops |
| NFR-15 | Scalability | Stateless API horizontally scalable; workers scale independently | ARCH |
| NFR-16 | Data retention | Financial records 7 years (configurable); soft delete for domain records | U-33 |
| NFR-17 | i18n | Currency, date, timezone per tenant; terminology aliases per jurisdiction | GLOSSARY |
| NFR-18 | Browser | Latest Chrome, Edge, Firefox, Safari; no plugins | EV-001 |
| NFR-19 | AI cost | Per-tenant monthly token budget; hard stop with message | AI-SEC |
| NFR-20 | Recoverability | RPO 24 h, RTO 4 h for POC (daily backup + PITR optional) | ROLLBACK, FAILREC |
