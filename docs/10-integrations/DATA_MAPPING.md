# Data Mapping

## Bank statement (CSV generic / camt.053) → `strata.bank_transactions`
| Source (CSV) | camt.053 | Vertex |
|---|---|---|
| Date | `Ntry/BookgDt/Dt` | txn_date |
| Amount (signed) | `Ntry/Amt` + `CdtDbtInd` | amount_cents (credit +, debit −) |
| Description | `NtryDtls/TxDtls/RmtInf/Ustrd` | description |
| Reference | `RmtInf/Strd/CdtrRefInf/Ref` | reference (CRN expected) |
| Bank reference | `NtryRef` / `AcctSvcrRef` | bank_ref (unique) |
| Account | `Stmt/Acct/Id` | bank_account_id via account map |
| Opening/closing | `Bal` (OPBD/CLBD) | bank_statements.opening/closing_cents |

## Payment provider → `strata.payments`
| Provider | Vertex |
|---|---|
| `payment.id` | provider_ref |
| `amount` (minor units) | amount_cents |
| `metadata.charge_ids` | allocation hints |
| `metadata.lot_id`, `tenant_id` | lot_id (verified against token) |
| `status` succeeded/failed | status |
| `created` | received_at |

## Resident app request → `common.service_requests`
| Inbound | Vertex |
|---|---|
| externalId | external_refs(provider, external_id) |
| propertyRef | property via tenant `propertyMap` |
| unitRef | location (type=unit) by name/code |
| category | category via map (default "General") |
| description | description |
| photos[] (URLs) | downloaded → documents (AV scanned) → links |
| accessConsent | access_consent jsonb |
| requester | contact (match by email/phone, else create with role resident) |

## WO status → resident app webhook
| Vertex status | Outbound status |
|---|---|
| new / triaged | acknowledged |
| assigned / accepted | scheduled |
| in_progress | in_progress |
| on_hold | on_hold (+reason) |
| completed / verified / closed | completed (+completed_at, photos) |
| cancelled | cancelled |

## Collections referral payload
`{referralId, scheme{name, registrationNo}, lot{number, label}, debtors[{name, email, phone, postalAddress}], amounts{d1_30,…,total}, statementPdfUrl (signed 7 d)}`

## Import templates
Column definitions per template are published as JSON schema at `/imports/templates/{type}` (POC-defined; Urbanise templates UNKNOWN, G-20).
