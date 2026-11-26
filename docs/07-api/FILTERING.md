# Filtering & Sorting

- Equality: `?status=open&priority=P1` (comma = IN: `?status=new,assigned`).
- Ranges: `?createdAt[gte]=2026-01-01&createdAt[lt]=2026-02-01`, `?amount[gte]=100000`.
- Text: `?q=` (trigram/full-text on the resource's searchable fields).
- Booleans: `?underWarranty=true`.
- Relations: `?propertyId=`, `?schemeId=`, `?supplierId=`.
- Sort: `?sort=-completeDueAt,number` — only whitelisted fields per resource (documented in OpenAPI `x-sortable`).
- Unknown filter params → 400 `UNKNOWN_FILTER` (prevents silent mis-queries).
- All filters are AND-combined with the caller's scope predicate; filters can never widen scope.

Common resource filters:
| Resource | Filters | Sort |
|---|---|---|
| work-orders | status, priority, type, propertyId, regionId, assetId, slaState, assignee, createdAt, completeDueAt, q | createdAt, completeDueAt, priority, number |
| arrears | schemeId, level, status, balance | balance, level |
| supplier-invoices | schemeId, supplierId, status, invoiceDate, amount | invoiceDate, amount |
| assets | propertyId, locationId, assetTypeId, condition, criticality, warranty, status, q | code, installDate |
| schemes | status, jurisdiction, q | name |
| lots | schemeId, buildingId, arrearsLevel, q | lotNumber |
