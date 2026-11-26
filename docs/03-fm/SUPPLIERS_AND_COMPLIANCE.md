# Suppliers, Contractors & Compliance (shared; F-FM-09, F-FM-11, F-ST-08)

Evidence: supplier compliance licences & insurance (EV-077); safeguarding before site attendance (EV-078); Force App for contractors (EV-082); supplier lists (EV-053); supplier oversight (W11).

## Entities
- `Supplier{tenant, name, abn/tax_id, trades[], email, phone, address, bank_details_ref (tokenised, never shown in full), status: active|inactive, compliance_status: compliant|expiring|non_compliant, preferred_for_schemes[], preferred_for_properties[]}`
- `SupplierUser` = User with role `contractor` scoped to supplier.
- `ComplianceType{tenant, code, name, requires_expiry, min_cover_cents?, applies_to_trades[], applies_to_property_flags[] (e.g. 'child_safe')}` — seed: PUBLIC_LIABILITY (min $20M), WORKERS_COMP, TRADE_LICENCE, WORKING_WITH_CHILDREN (safeguarding), SWMS.
- `ComplianceRecord{supplier, type, number, issuer, cover_cents, issue_date, expiry_date, document_id, status: pending_review|verified|rejected|expired, verified_by, verified_at}`

## Status computation (BR-SUP-01)
For supplier S and context C (trade, property flags): required = types applicable to C. `compliant` if ∀ required: ∃ verified record with expiry ≥ date. `expiring` if compliant and any expiry ≤ today+30. Else `non_compliant`. Assignment gate (BR-FM-07) evaluates on scheduled date with the property's flags.

## Contractor portal (PWA)
Assigned jobs (accept/decline, schedule, complete with evidence), quotes (submit), invoices (upload against WO), compliance (upload, view status), company profile. Contractors never see other suppliers, client financials, or owner personal data beyond site access contact on the job.
