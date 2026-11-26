# Procurement, Supplier Invoices & Payments (F-ST-08, F-ST-09)

Evidence: Procurement tile (EV-041); quote comparisons & work orders (EV-053); invoice processing module (EV-044); online approvals (EV-042); in-app committee approval with budget remaining (EV-040); payables from within platform (EV-052); single payment across multiple accounts (EV-042); AI invoice processing roadmap (EV-111).

## Entities
QuoteRequest → Quote(s) → StrataWorkOrder → SupplierInvoice → ApprovalRequest → PaymentBatch → Payment.

## Quote request
Fields: scheme, title, scope, location (common property / lot), estimate, invited suppliers, due date. Rule BR-ST-17 (≥2 quotes above threshold). Comparison table: supplier, amount ex GST, GST, total, validity, compliance status, notes. Acceptance → WO with `approved_amount`; may require committee approval (approval engine).

## Strata work order
States: `draft → issued → accepted → completed → invoiced → closed | cancelled`. Lightweight compared to FM WO; optional "escalate to Vertex FM" creates an FM WO linked via `external_refs`.

## Supplier invoice
States: `received → coded → pending_approval → approved → scheduled → paid`, side states `rejected`, `on_hold`, `void`.
Capture: upload/email-in → (optional AI extraction WF-25) → code: supplier, scheme, invoice no., invoice date, due date, amount, GST, fund, GL account, linked WO/quote.
Approval routing (BR-ST-14):
1. amount ≤ staff threshold and linked approved WO → auto-approve (system).
2. > staff threshold → strata_manager.
3. > committee threshold → committee (any 1 / majority per scheme setting).
Approver screen shows: supplier, invoice no., reference, dates, amount, category (GL), **budget remaining** (BR-ST-15), attachment.

## Payment batch
Select approved invoices (any schemes) → group by supplier → one payment per supplier per scheme bank account (multi-scheme requires per-scheme payments; "single payment across multiple accounts" interpreted as one remittance listing multiple invoices — INFERRED). Submit to bank adapter (mock) → statuses `submitted → processed | failed`. Remittance email to supplier.
