# Report Specification

| ID | Report | Parameters | Layout | Evidence |
|---|---|---|---|---|
| RPT-ST-01 | **Aged Debtors** | scheme, asAt, excludeUnpresented (default true) | Header: "{scheme legal title} {registration no.}", address, "AGED DEBTORS", "as at {date} (Excludes Unpresented Transactions)". Columns: Building/Floor/Lot No. · Unit · Name · Type · Debtor Level · 1 to 30 days · 31 to 60 days · 61 to 90 days · 91+ days (From Due Date) · Total. Groups by Type (Levy, Sundry) with "Levy Total"/"Sundry Total"; "Grand Total"; note "This report is gross of GST"; footer: report name, scheme, printed date, page x of y | **OBSERVED** EV-028 (layout replicated generically, own styling) |
| RPT-ST-02 | Levy register | scheme, period | Lot, owner, fund, instalment, due, amount, paid, outstanding | EV-021 |
| RPT-ST-03 | Owner ledger statement | lot, from, to | Opening, lines (date, type, fund, desc, DR, CR, balance), closing; pay details | EV-039 |
| RPT-ST-04 | Trial balance | scheme, asAt | Account, DR, CR; totals equal | EV-043 |
| RPT-ST-05 | Income & expenditure | scheme, FY/period, by fund | Income/expense accounts, actual, budget, variance | EV-027, EV-034 |
| RPT-ST-06 | Balance sheet | scheme, asAt | Assets, liabilities, owners' funds per fund | EV-027 |
| RPT-ST-07 | Budget vs actual | scheme, FY | Line, budget, actual, committed, remaining | EV-040 |
| RPT-ST-08 | Bank reconciliation | account, period | Statement balance, unpresented, outstanding deposits, ledger balance, difference | EV-042 |
| RPT-ST-09 | Creditors aged | scheme(s), asAt | Supplier, invoice, due, buckets | INFERRED |
| RPT-ST-10 | Strata roll | scheme, asAt | Lot, unit, entitlement, owners, addresses for service | EV-056 |
| RPT-ST-11 | Arrears actions log | scheme, period | Lot, level changes, notices, referrals | EV-024 |
| RPT-ST-12 | Insurance & compliance register | scheme | Policies, expiry, items due | EV-054 |
| RPT-FM-01 | Work order register | filters | Number, property, priority, status, dates, SLA, cost | EV-085 |
| RPT-FM-02 | SLA performance | period, client | Per priority targets vs actual | EV-098 |
| RPT-FM-03 | 10-year CAPEX plan | plan | Year × property/category matrix, totals; asset lines appendix | EV-073 |
| RPT-FM-04 | Asset register | property | Code, type, location, install, warranty, condition, replacement cost | EV-072 |
| RPT-FM-05 | PPM compliance | period | Plans, due, done on time, missed | EV-076 |
| RPT-FM-06 | Supplier compliance | — | Supplier, type, expiry, status | EV-077 |
| RPT-FM-07 | Supplier performance | period | KPI-FM-09 | EV-079 |

Rendering: HTML templates (Handlebars-safe) → Playwright PDF in worker; CSV via streaming SQL. Annual "financial statements pack" = RPT-ST-04+05+06+08 bundled (EV-027); statutory audit-ready formats out of scope.
