# Trust Ledger & Accounting (F-ST-05, F-ST-07)

Evidence: ledger accounting tile (EV-041), trust accounting integrated (EV-043), automated bank reconciliation & electronic banking (EV-042), funds Admin/Maintenance + investments (EV-038, EV-060), account codes (EV-044). Statutory rules UNKNOWN (G-05) ⚖.

## Model (PROPOSED)
- **Books per scheme**: each scheme is a separate ledger (`ledger_id = scheme_id`). Management-company operating ledger is out of scope.
- **Double entry**: `JournalEntry{id, scheme_id, date, period, source_type, source_id, memo, reversal_of}` with `LedgerLine{account_id, fund_id, lot_id?, supplier_id?, debit_cents, credit_cents}`. Constraint: Σdebit = Σcredit per entry (DB trigger + app check).
- **Sub-ledgers**: receivables by lot (`lot_id`), payables by supplier (`supplier_id`).
- **Funds**: every line tagged with fund; fund balance sheet derivable.

## Chart of accounts template
| Code | Name | Type |
|---|---|---|
| 1000 | Trust bank – operating | Asset |
| 1010 | Investments (term deposits) | Asset |
| 1200 | Levies receivable | Asset |
| 1210 | Sundry receivable | Asset |
| 2000 | Creditors | Liability |
| 2100 | Levies in advance / owner credits | Liability |
| 2200 | GST payable / receivable (net) | Liability |
| 2900 | Suspense – unidentified receipts | Liability |
| 3000 | Owners' funds – Admin | Equity |
| 3100 | Owners' funds – Capital works | Equity |
| 4000 | Levy income | Income |
| 4100 | Interest/penalty income | Income |
| 4200 | Other income | Income |
| 5xxx | Expenses (insurance 5100, repairs 5200, cleaning 5300, utilities 5400, management fees 5500, audit 5600, …) | Expense |

## Standard postings
| Event | Debit | Credit |
|---|---|---|
| Levy issued | 1200 (lot) | 4000 (fund) |
| Penalty | 1200 (lot) | 4100 |
| Sundry charge | 1210 (debtor) | 4200 |
| Receipt | 1000 | 1200/1210 (lot) — or 2100 if unallocated |
| Supplier invoice approved | 5xxx (fund) [+2200 GST] | 2000 (supplier) |
| Supplier paid | 2000 | 1000 |
| TD placed (backlog) | 1010 | 1000 |
| Bank fee (from statement) | 5900 | 1000 |

## Periods
Monthly periods; `open → closed`. Closing requires a balanced bank reconciliation for each trust account for that month. Closed periods reject postings (BR-ST-12); corrections via reversal in open period.

## Bank reconciliation (WF-07)
Statement lines → `BankTransaction{status: unmatched|suggested|matched|excluded}`. Matching order: provider txn id → CRN+amount → amount+date window. Reconciliation screen shows: statement closing balance, ledger cash balance, unpresented payments, outstanding deposits, difference (must be 0 to lock).

## Reports
Trial balance, Income & Expenditure per fund, Balance sheet, Levy register, Owner ledger statement, Creditors aged, Bank rec, Aged debtors. (11-reporting)

## GST
Tenant flag `gst_registered` per scheme; rate 10% (AU) configurable; reports state "gross of GST" (EV-028).
