# Performance Tests (k6)

Dataset: perf seed (50 tenants, 2,000 schemes, 60,000 lots, 180,000 contacts, 2 years ledger ≈ 6M ledger lines, 400 properties, 200,000 assets, 500,000 WOs). Scaled-down analogue of public scale claims (EV-004).

| ID | Scenario | Load | Threshold |
|---|---|---|---|
| PERF-01 | Staff browsing mix (lists, details, search) | 200 VUs, 15 min | p95 < 300 ms reads, error < 0.5% |
| PERF-02 | Writes mix (receipts, WO transitions, notes) | 50 VUs | p95 < 500 ms |
| PERF-03 | Levy run 1,000-lot scheme | single | < 30 s incl. PDFs queued |
| PERF-04 | Statement 5,000 lines auto-match | single | < 60 s |
| PERF-05 | Portal peak (levy notice day) | 1,000 VUs owners viewing ledger/paying | p95 < 400 ms |
| PERF-06 | Ops Centre polling 100 coordinators | 60 s interval | DB CPU < 60% |
| PERF-07 | Aged debtors 1,000 lots PDF | single | < 10 s |
| PERF-08 | Technician sync 500 events burst | 100 VUs | p95 < 1 s |
| PERF-09 | RAG retrieval 100k chunks per tenant | 20 VUs | p95 retrieval < 150 ms |
| PERF-10 | Soak | PERF-01 for 4 h | no memory growth > 10% |
| AI-PERF-01 | Assistant | 10 concurrent | first token < 3 s; p95 < 15 s |
