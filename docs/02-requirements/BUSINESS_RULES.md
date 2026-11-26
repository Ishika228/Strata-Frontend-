# Business Rules

All thresholds are **configurable defaults (PROPOSED)** unless an evidence ID is cited. Jurisdiction-sensitive rules (U-23) are marked ⚖ and must be validated by an SME before production; the POC is not legal or financial advice.

## Shared
| ID | Rule |
|---|---|
| BR-SH-01 | Every query is scoped by `tenant_id` from the authenticated context; client-supplied tenant ids are ignored except for platform_admin. |
| BR-SH-02 | Soft delete only for domain records; financial records are never deleted — corrections by reversal. |
| BR-SH-03 | Documents inherit visibility from linked entity unless explicit ACL (`staff`, `committee`, `owners`, `lot_owner`, `contractor`, `client`). |
| BR-SH-04 | Notifications respect contact preference (email/sms/in-app/post); statutory notices cannot be unsubscribed (EV-022). |
| BR-SH-05 | Imports require a successful dry-run whose hash matches the committed file. |

## Strata
| ID | Rule | Evidence |
|---|---|---|
| BR-ST-01 | Each scheme has exactly one Admin fund and one Capital Works fund; optional additional funds. | EV-038 |
| BR-ST-02 | Levies derive only from an **approved** budget. | EV-020 |
| BR-ST-03 | Levy apportionment by unit entitlement; amounts in cents; remainder cents to the last instalment of the year; per-lot rounding remainder to lowest lot number. ⚖ | U-20 |
| BR-ST-04 | Levy notices issued `lead_days` (default 30) before due date; one notice per lot per instalment (idempotent). | EV-021 |
| BR-ST-05 | Payment allocation: oldest due date first; within same due date: levy admin, levy capital works, sundry, penalty last. ⚖ | U-22 |
| BR-ST-06 | Overpayment becomes lot credit and auto-applies to the next issued charge. | PROPOSED |
| BR-ST-07 | Ageing from **due date** in buckets 1–30, 31–60, 61–90, 91+ days. | EV-028 |
| BR-ST-08 | Arrears levels: L1 at 14 days overdue (reminder), L2 at 35 days (final notice), L3 at 60 days (eligible for referral); referral requires manager approval. ⚖ | EV-024 / thresholds PROPOSED |
| BR-ST-09 | Penalty: simple interest at scheme rate (default 10% p.a.) on overdue levy principal after grace (default 0 days), charged monthly as `penalty` charge. ⚖ | EV-039 / U-22 |
| BR-ST-10 | Optional early-payment discount (default off) applied if paid in full by due date. ⚖ | U-22 |
| BR-ST-11 | Lots with active payment plan or dispute hold are excluded from escalation and penalties (configurable). | PROPOSED |
| BR-ST-12 | Ledger: every posting balanced; posting to closed period forbidden; reversals reference original. | EV-043 |
| BR-ST-13 | Supplier invoice duplicate if same supplier + invoice number (case-insensitive) in tenant. | PROPOSED |
| BR-ST-14 | Invoice approval required when amount > scheme approval threshold (default $1,000) **or** no linked approved WO/quote; committee approval when > committee threshold (default $5,000). | EV-040 |
| BR-ST-15 | Budget remaining = budget line amount − posted actuals − approved-unpaid commitments. | EV-040 |
| BR-ST-16 | Payment batch can only include `approved` invoices of compliant suppliers. | EV-052, EV-077 |
| BR-ST-17 | Quotes: ≥ 2 quotes required when estimate > $5,000 (configurable). | EV-053 |
| BR-ST-18 | Voting: one vote per lot by default; entitlement-weighted option; owner unfinancial at record date may be excluded for ordinary motions when jurisdiction flag set. ⚖ | U-24 |
| BR-ST-19 | Motion pass thresholds: ordinary > 50% of votes cast; special ≥ 75%; unanimous = no votes against. ⚖ | U-24 |
| BR-ST-20 | Owner sees only lots they own; committee_member sees scheme-level financial summary and approvals for their scheme; occupier sees no financials. | EV-032, EV-038 |
| BR-ST-21 | Campaign audience resolved at send; test send mandatory before first send. | EV-047 |
| BR-ST-22 | Insurance renewal task created 60 days before policy end. | EV-054 |

## FM
| ID | Rule | Evidence |
|---|---|---|
| BR-FM-01 | Priority matrix default: P1 respond 1 h / complete 4 h (24×7); P2 4 h / 24 h; P3 1 bd / 5 bd; P4 5 bd / 20 bd (business calendar). | EV-098 / U-26 |
| BR-FM-02 | SLA clock pauses in `on_hold` (reasons: awaiting access, awaiting parts, awaiting approval). | PROPOSED |
| BR-FM-03 | At-risk at 80% of target elapsed; breach at 100%. | PROPOSED |
| BR-FM-04 | PPM: create WO at `due_date − lead_days` (default 7); skip if previous occurrence still open and plan `skip_if_open=true`. | EV-075 |
| BR-FM-05 | 52-week planner shows virtual occurrences for the next 364 days. | EV-075 |
| BR-FM-06 | Warranty flag displayed when asset `warranty_expiry ≥ today` at WO creation. | EV-091 |
| BR-FM-07 | **Assignment gate**: contractor may be assigned only if supplier compliance status is `compliant` on the scheduled date (all required types verified & unexpired, incl. safeguarding where property flag requires). | EV-077, EV-078 |
| BR-FM-08 | Completion requires ≥ 1 photo when WO category has `evidence_required`. | EV-085 |
| BR-FM-09 | WO with cost > NTE requires client approval before continuing. | EV-090 |
| BR-FM-10 | Approval requests expire after 7 days → escalate to fm_manager. | PROPOSED |
| BR-FM-11 | Technicians see only WOs assigned to them; contractors only their company's assignments. | PROPOSED |
| BR-FM-12 | Lifecycle: remaining life adjusted by condition (1 = +20%, 2 = 0, 3 = −20%, 4 = −40%, 5 = −60%). | U-27 |

## Suppliers & AI
| ID | Rule |
|---|---|
| BR-SUP-01 | Supplier compliance status recomputed on any record change and daily; expiring status at ≤ 30 days. (EV-077) |
| BR-SUP-02 | Required compliance types configured per tenant and per work category. |
| BR-AI-01 | AI acts with the invoking user's permissions only; no elevated service role for data access. |
| BR-AI-02 | AI write actions require explicit user confirmation (AIActionProposal). (EV-113) |
| BR-AI-03 | Every factual AI answer referencing records/documents must include citations; answers without retrieved support must say so. (EV-114) |
| BR-AI-04 | AI never sends external communications. |
