# Tables (DataTable configurations)

Common behaviour: server-side cursor pagination (25 default), sortable whitelisted columns, filter bar, column chooser, CSV export (respecting scope), sticky header, row click → detail, bulk actions where listed, money right-aligned.

| Table | Columns | Default sort | Bulk actions |
|---|---|---|---|
| Schemes | Name, Reg no., Jurisdiction, Lots, Arrears total, Manager, Status | Name | Assign manager |
| Lots | Lot, Unit, Building/Floor, Entitlement, Owner(s), Balance, Arrears level | Lot | Sundry charge |
| Lot ledger | Date, Type, Fund, Description, Debit, Credit, Running balance | Date asc | — |
| Aged debtors (RPT-ST-01 on screen) | Building/Floor/Lot, Unit, Name, Type, Debtor level, 1–30, 31–60, 61–90, 91+, Total | Lot | Export PDF/CSV |
| Arrears cases | Scheme, Lot, Debtor, Level, Oldest due, Balance, Status, Last action | Balance desc | Send notice, Hold |
| Bank transactions | Date, Description, Reference, Amount, Status, Suggested match, Score | Date | Accept suggestions |
| Supplier invoices | Received, Supplier, Scheme, Invoice no., Amount, Due, Status, Approver | Received desc | Submit, Add to batch |
| Payment batches | Created, Invoices, Total, Status | Created desc | — |
| Meetings | Date, Scheme, Type, Mode, Status | Date desc | — |
| Campaigns | Name, Audience size, Sent, Delivered %, Status | Updated desc | — |
| Suppliers | Name, Trades, Compliance, Expiring next, Open WOs | Name | Send reminder |
| Work orders | Number, Property, Priority, Category, Status, Assignee, SLA due, SLA state, Created | SLA due asc | Assign, Cancel |
| Service requests | Number, Source, Property, Category, Requester, Age, Status | Age desc | Merge duplicates |
| Assets | Code, Name, Type, Property/Location, Condition, Warranty, Install date, Status | Code | Create PPM, Print QR |
| Asset plan lines | Year, Property, Asset, Action, Cost, Priority | Year | — |
| Planner | Week columns × plan rows; cell = occurrence count/hours | Week | Reschedule |
| Compliance records | Supplier, Type, Number, Expiry, Status | Expiry asc | Verify |
| Audit events | Time, Actor, Action, Entity, Changes | Time desc | Export |
