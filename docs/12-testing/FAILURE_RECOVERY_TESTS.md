# Failure Recovery Tests

| ID | Failure injected | Expected recovery |
|---|---|---|
| FAILREC-01 | Worker killed mid levy run | Job retried; idempotent (no duplicate charges); run completes |
| FAILREC-02 | DB connection loss 30 s | API returns 503 during outage; recovers; no partial transactions |
| FAILREC-03 | Redis down | API serves reads; queued writes to outbox persist; relay resumes and publishes |
| FAILREC-04 | Outbox relay crash after publish before mark | Consumers dedupe by event id |
| FAILREC-05 | Payment webhook processed twice concurrently | One payment (unique constraint) |
| FAILREC-06 | Object storage unavailable | Uploads fail gracefully; documents list still loads |
| FAILREC-07 | Mock bank unavailable for statement poll | Retries; alert after max; manual upload path works |
| FAILREC-08 | LLM provider outage | Circuit breaker; assistant unavailable message; rest unaffected |
| FAILREC-09 | Deploy rollback with forward-only migration | Old app version compatible with new schema (expand/contract) |
| FAILREC-10 | Restore from backup into staging | Data consistent; invariants INV-01..05 pass |
| FAILREC-11 | Technician sync with conflicting server change (WO cancelled) | Event rejected per-item with reason; client shows conflict |
| FAILREC-12 | Clock skew on scheduler pod | Jobs use DB time; no double run (BullMQ repeat key + DB unique) |
