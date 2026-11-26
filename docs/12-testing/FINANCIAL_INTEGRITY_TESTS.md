# Financial Integrity Tests

| ID | Property / case | Method |
|---|---|---|
| FIN-01 | Σ levy schedule items per fund = levy target exactly, for random budgets (1 c – $10M), lot counts (1–2,000), entitlements | fast-check property test |
| FIN-02 | Allocation never exceeds outstanding; Σ allocations ≤ payment; remainder → credit | property |
| FIN-03 | Every journal balanced; DB rejects unbalanced | unit + DB |
| FIN-04 | Trial balance sums to zero after any random sequence of operations | model-based test |
| FIN-05 | Lot sub-ledger balance = Σ outstanding charges − credits | property |
| FIN-06 | Ageing buckets sum = total overdue | property |
| FIN-07 | Penalty calculation matches reference implementation (day-count, rounding half-up) | table tests |
| FIN-08 | Void/reversal restores balances exactly | property |
| FIN-09 | Closed period immutable | DB test |
| FIN-10 | Report totals (RPT-ST-01, 04, 05, 06) equal ledger queries | integration |
| INV-01..05 | Nightly invariants (DATA_GOVERNANCE) | job + alert |
