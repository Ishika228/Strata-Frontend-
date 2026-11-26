# Validation Rules

Layers: (1) schema validation from OpenAPI-derived DTOs (`whitelist`, `forbidNonWhitelisted`, type coercion off), (2) domain validation in services, (3) DB constraints as last line.

| Rule | Applies to | Error code |
|---|---|---|
| Unknown properties rejected | all bodies | `UNKNOWN_FIELD` |
| UUID format | ids | `INVALID_UUID` |
| Money: integer cents ≥ 0 (> 0 for payments/invoices); currency = tenant currency | Money | `INVALID_AMOUNT`, `CURRENCY_MISMATCH` |
| Dates ISO-8601; `validTo ≥ validFrom`; `expiryDate > issueDate` | dates | `INVALID_DATE_RANGE` |
| Strings trimmed; max lengths per schema; no control chars except \n | text | `TOO_LONG`, `INVALID_CHARS` |
| Email RFC 5322 (practical), phone E.164 | contacts | `INVALID_EMAIL`, `INVALID_PHONE` |
| Entitlement integer ≥ 1 | lots | `INVALID_ENTITLEMENT` |
| Lot number unique per scheme | lots | `DUPLICATE_LOT` |
| Registration no. unique per jurisdiction | schemes | `DUPLICATE_SCHEME` |
| Duplicate supplier invoice | invoices | `DUPLICATE_INVOICE` (409) |
| GST ≤ amount; AU warning if |gst − total/11| > 1% | invoices | `INVALID_GST` / warning |
| Budget lines reference fund & account of same scheme | budgets | `CROSS_SCHEME_REFERENCE` |
| Posting to closed period | journals | `PERIOD_CLOSED` (409) |
| Journal balanced | journals | `UNBALANCED_ENTRY` |
| Allocation ≤ outstanding | payments | `OVER_ALLOCATION` |
| Vote: lot eligible, motion open | votes | `NOT_ELIGIBLE` (403), `MOTION_CLOSED` (409) |
| RRULE parseable, max frequency daily | maintenance plans | `INVALID_RRULE` |
| Location belongs to property | assets, WOs | `LOCATION_PROPERTY_MISMATCH` |
| Contractor compliant on scheduled date | assignment | `SUPPLIER_NON_COMPLIANT` (422) |
| Evidence required for completion | WO transition | `EVIDENCE_REQUIRED` (422) |
| Upload: mime allow-list, ≤ 25 MB, sha256 matches | documents | `UNSUPPORTED_TYPE`, `FILE_TOO_LARGE`, `CHECKSUM_MISMATCH` |
| Import template headers exact | imports | `TEMPLATE_MISMATCH` |
| AI message ≤ 4,000 chars | AI | `TOO_LONG` |
| Page `limit` 1–100 | lists | `INVALID_LIMIT` |
