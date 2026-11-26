# Data Classification, Retention & Integrity

## Classification
| Class | Examples | Handling |
|---|---|---|
| Restricted | Bank account numbers, supplier bank details, MFA secrets, API secrets | App-level encryption (AES-256-GCM, KMS data key); masked in UI (last 4); never logged; never sent to AI |
| Confidential-PII | Contact names, emails, phones, addresses, ledger balances per lot, votes | RBAC + audit on staff reads of individual ledgers; AI only via tools scoped to user |
| Confidential-Business | Budgets, invoices, WOs, assets | RBAC |
| Internal | Templates, configuration | Staff only |

## Retention (U-33 → PROPOSED defaults, configurable per tenant)
| Data | Retention |
|---|---|
| Ledger, journals, payments, invoices, bank statements | 7 years after FY end |
| Meeting minutes, motions, vote tallies | Life of scheme + 7 years; individual secret-ballot values 1 year after meeting |
| Audit events | 7 years |
| WOs, evidence photos | 7 years |
| AI conversations/messages | 90 days (configurable 0–365); tool-call audit 7 years |
| Notifications | 2 years |
| Deleted tenant | Export provided, purge after 30 days except financial retention (held in cold archive) |

## Integrity rules (DB-enforced)
- Balanced journal entries (deferred constraint trigger).
- Period lock trigger.
- Unique constraints for idempotency: `charges.levy_schedule_item_id`, `payments(provider, provider_ref)`, `bank_transactions(bank_account_id, bank_ref)`, `votes(motion_id, lot_id)`, `maintenance_schedules(plan_id, due_date)`, `one_active_assignment`.
- No UPDATE/DELETE grants on audit and ledger tables for app role.
- Nightly invariants job:

| ID | Invariant |
|---|---|
| INV-01 | Σ charges.outstanding per lot = receivable sub-ledger (1200/1210) balance for that lot − credits (2100) |
| INV-02 | Trial balance per scheme sums to zero |
| INV-03 | Audit hash chain valid per tenant |
| INV-04 | No WO `closed`/`verified` without `completed_at` |
| INV-05 | Stored supplier compliance_status equals recomputation (BR-SUP-01) |

## Data dictionary
Column-level definitions live as `COMMENT ON` statements generated from [SCHEMA.sql](SCHEMA.sql) during migration (MIGRATIONS.md), and entity meanings in [DOMAIN_MODEL.md](DOMAIN_MODEL.md) and [../01-product/GLOSSARY.md](../01-product/GLOSSARY.md).
