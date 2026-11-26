# Workflow Catalog (reverse-engineered business workflows)

Labels: **[E]** EVIDENCE (cites EV-ID) · **[I]** INFERENCE · **[P]** POC PROPOSAL · **[U]** UNKNOWN (public evidence silent; POC fills with [P]).
Every workflow writes an `AuditEvent` and emits outbox events (names in [../05-architecture/EVENTS.md](../05-architecture/EVENTS.md)). State machines: [../05-architecture/STATE_MACHINES.md](../05-architecture/STATE_MACHINES.md). Business rules: [../02-requirements/BUSINESS_RULES.md](../02-requirements/BUSINESS_RULES.md).

| ID | Workflow | Product | Feature |
|---|---|---|---|
| WF-01 | Tenant onboarding & data import | Shared | F-SH-01, F-SH-09 |
| WF-02 | Sign-in (password / SSO) | Shared | F-SH-02 |
| WF-03 | Scheme setup & portal auto-provision | Strata | F-ST-01, F-ST-12 |
| WF-04 | Annual budget & levy schedule | Strata | F-ST-02, F-ST-03 |
| WF-05 | Levy run (issue notices) | Strata | F-ST-03 |
| WF-06 | Payment receipt (pay-now / bank) | Strata | F-ST-04 |
| WF-07 | Bank reconciliation | Strata | F-ST-05 |
| WF-08 | Arrears escalation & debt referral | Strata | F-ST-06 |
| WF-09 | Supplier invoice → approval → payment | Strata | F-ST-08 |
| WF-10 | Strata quote & work order | Strata | F-ST-09 |
| WF-11 | Meeting → motions → voting → minutes | Strata | F-ST-10 |
| WF-12 | Comms campaign | Strata | F-ST-11 |
| WF-13 | Owner self-service & service request | Strata | F-ST-12, F-ST-13 |
| WF-14 | Scheduled report distribution | Strata | F-ST-15 |
| WF-15 | FM property/location/asset onboarding | FM | F-FM-01, F-FM-02 |
| WF-16 | PPM schedule → work order generation | FM | F-FM-04 |
| WF-17 | Service request → triage → work order | FM | F-FM-05, F-FM-06 |
| WF-18 | Dispatch → mobile execution → completion evidence | FM | F-FM-06, F-FM-08 |
| WF-19 | SLA monitoring & breach | FM | F-FM-07, F-FM-12 |
| WF-20 | Contractor compliance verification | Common | F-FM-09 |
| WF-21 | Client approval (quote/variation) | FM | F-FM-10 |
| WF-22 | 10-year asset lifecycle plan | FM | F-FM-03 |
| WF-23 | AI assistant query | AI | F-AI-01..04 |
| WF-24 | AI email draft (human-in-loop) | AI | F-AI-05 |
| WF-25 | AI invoice extraction | AI | F-AI-06 |
| WF-26 | Resident-app integration (inbound/outbound) | Integration | F-IN-05 |
| WF-27 | Insurance & compliance register (strata) | Strata | F-ST-14 |

---

## WF-01 Tenant onboarding & data import
| Step | Detail | Label |
|---|---|---|
| Trigger | New customer signed | [I] (EV-009 proposal → kickoff) |
| Actor | platform_admin | [E] EV-009 "Super User tools" |
| Authentication | OIDC session, MFA required | [P] |
| Authorization | `platform.tenant.create`, `platform.import.run` | [P] |
| Input | Tenant profile; XLSX/CSV templates: schemes, lots, owners, insurance, levy settings; opening balances; regions/properties/assets | [E] EV-009, EV-093 / columns [U] |
| Validation | Template schema, required columns, referential checks (lot→scheme), duplicate detection, entitlement totals > 0 | [P] |
| Business Rules | Dry-run mandatory before commit; opening balances must net to zero per scheme trust ledger | [P] |
| Calculation | Opening trial balance per scheme | [P] |
| Database Changes | `tenants`, `import_jobs`, domain rows, `ledger_entries` (opening) | [P] |
| External Integration | None | [P] |
| Notification | Import summary email to admin | [P] |
| Audit | `import.committed` with row counts, file hash | [P] |
| Reporting | Import report (created/updated/rejected rows) | [P] |
| Final State | ImportJob `committed`; schemes/portals provisioned (triggers WF-03 per scheme) | [P] |

## WF-02 Sign-in
| Step | Detail | Label |
|---|---|---|
| Trigger | User opens app | [E] EV-001 browser access |
| Actor | Any user | — |
| Authentication | Local password + TOTP MFA, or SSO via OIDC to Entra ID | [E] EV-006 SSO exists / protocol [U] → [P] OIDC |
| Authorization | Membership in ≥1 tenant; role assignments loaded into token claims | [P] |
| Input | Credentials or IdP assertion | [P] |
| Validation | Lockout after 5 failures/15 min; MFA for staff roles | [P] |
| Business Rules | SSO-enforced tenants disable local passwords for staff domains | [P] |
| Calculation | — | — |
| Database Changes | `sessions`, `users.last_login_at` | [P] |
| External Integration | IdP (Keycloak broker → Entra ID) | [P] |
| Notification | New-device login email | [P] |
| Audit | `auth.login.succeeded/failed` | [P] |
| Reporting | Login audit report | [P] |
| Final State | Session with tenant context selected | [P] |

## WF-03 Scheme setup & portal auto-provision
| Step | Detail | Label |
|---|---|---|
| Trigger | Manager creates scheme (or import) | [E] EV-032 |
| Actor | strata_manager | [E] |
| Authentication | Staff session | [P] |
| Authorization | `strata.scheme.create` | [P] |
| Input | Scheme name, registration no. (e.g. CTS/SP), jurisdiction, address, financial year, levy frequency, funds, buildings, lots (number, label, entitlement), owners, occupiers | [E] EV-029, EV-021 / [P] fields |
| Validation | Unique registration no. per jurisdiction in tenant; lot numbers unique per scheme; entitlement > 0 | [P] |
| Business Rules | Every scheme gets Admin + Capital Works funds and a trust bank account; owner portal auto-created | [E] EV-038, EV-032 |
| Calculation | Total entitlement | [P] |
| Database Changes | `schemes`, `buildings`, `lots`, `contacts`, `ownerships`, `funds`, `bank_accounts`, `gl_accounts` (chart template), `portal_sites` | [P] |
| External Integration | None | — |
| Notification | Portal invitation emails to owners with email addresses | [I] EV-032 |
| Audit | `strata.scheme.created` | [P] |
| Reporting | Strata roll report | [E] EV-056 |
| Final State | Scheme `active`; portal `live` | [P] |

## WF-04 Annual budget & levy schedule
| Step | Detail | Label |
|---|---|---|
| Trigger | New financial year / AGM approval | [E] EV-020 "set up annually" |
| Actor | strata_manager / strata_accountant | [E] |
| Authentication | Staff session | [P] |
| Authorization | `strata.budget.edit`, `strata.budget.approve` | [P] |
| Input | Budget lines per fund & GL account; frequency (quarterly default); first due date | [E] EV-044 account codes |
| Validation | Each line has fund + expense/income account; totals ≥ 0 | [P] |
| Business Rules | Budget states draft→proposed→approved; only approved budget generates schedule; approval reference to meeting motion optional | [P] / [I] EV-045 AGM |
| Calculation | Levy per lot per instalment = round2(fund_total × lot_entitlement / total_entitlement / instalments); remainder to last instalment | [U] → [P] LEVY_ENGINE |
| Database Changes | `budgets`, `budget_lines`, `levy_schedules`, `levy_schedule_items` | [P] |
| External Integration | None | — |
| Notification | Committee notified of proposed budget (portal) | [P] |
| Audit | `strata.budget.approved` | [P] |
| Reporting | Budget vs actual | [E] EV-034 |
| Final State | Schedule `active` | [P] |

## WF-05 Levy run
| Step | Detail | Label |
|---|---|---|
| Trigger | Scheduler: N days (default 30) before instalment due date | [E] EV-021 automatic issuance / N [P] |
| Actor | System (job); manager may run manually | [E] |
| Authentication | Service identity | [P] |
| Authorization | `strata.levy.issue` (manual) | [P] |
| Input | Active schedule items for period | [P] |
| Validation | No existing notice for (lot, schedule item); scheme active | [P] |
| Business Rules | Idempotent per (scheme, period); notices include pay-now link and payment reference (CRN) | [E] EV-050 / [P] |
| Calculation | Amount per lot per fund; optional early-payment discount | [U] → [P] |
| Database Changes | `levy_runs`, `charges` (type=levy), `ledger_entries` (DR owner receivable / CR levy income per fund), `documents` (PDF notice) | [P] |
| External Integration | Payment provider: create payment link | [E] EV-050 / [P] mock |
| Notification | Notice via owner preferred channel (email / portal / post-print queue) | [E] EV-022 |
| Audit | `strata.levy_run.completed` | [P] |
| Reporting | Levy register | [P] |
| Final State | LevyRun `completed`; charges `issued` | [P] |

## WF-06 Payment receipt
| Step | Detail | Label |
|---|---|---|
| Trigger | Owner pays via pay-now link, or bank statement line arrives | [E] EV-050, EV-051 |
| Actor | owner / system | [E] |
| Authentication | Portal session or signed payment link token; provider webhook signature | [P] |
| Authorization | Owner may only pay charges on own lots | [P] |
| Input | Payment amount, reference, provider txn id | [P] |
| Validation | Webhook HMAC; amount > 0; idempotency key = provider txn id | [P] |
| Business Rules | Allocation order: oldest due first, penalties before principal? → **[U]**; POC default: oldest due date first, interest last (configurable) | [U] → [P] |
| Calculation | Allocation across charges; overpayment = credit on account | [P] |
| Database Changes | `payments`, `payment_allocations`, `ledger_entries` (DR trust bank / CR owner receivable) | [P] |
| External Integration | Payment provider webhook | [P] mock |
| Notification | Receipt email; portal ledger live | [E] EV-032 live transactions |
| Audit | `strata.payment.received` | [P] |
| Reporting | Receipts register; arrears recalculated | [P] |
| Final State | Payment `succeeded` → `reconciled` after WF-07 | [P] |

## WF-07 Bank reconciliation
| Step | Detail | Label |
|---|---|---|
| Trigger | Daily statement import | [E] EV-051 daily statements |
| Actor | System + strata_accountant | [E] EV-042 |
| Authentication | Service identity / staff session | [P] |
| Authorization | `strata.bank.reconcile` | [P] |
| Input | Statement file (CSV/camt.053) or bank adapter feed | [U] → [P] |
| Validation | Account number matches scheme trust account; opening balance = prior closing | [P] |
| Business Rules | Auto-match: (1) exact provider txn id, (2) CRN reference + amount, (3) amount + date ±3 days single candidate → suggested; else unmatched | [P] |
| Calculation | Reconciled balance = statement closing − unpresented + outstanding deposits | [E] EV-028 "unpresented" concept |
| Database Changes | `bank_statements`, `bank_transactions`, `reconciliations` | [P] |
| External Integration | Bank adapter | [E] EV-023 / [P] mock |
| Notification | Unmatched items task to accountant | [P] |
| Audit | `strata.reconciliation.completed` | [P] |
| Reporting | Bank reconciliation report | [P] |
| Final State | Reconciliation `balanced` (locked) | [P] |

## WF-08 Arrears escalation & debt referral
| Step | Detail | Label |
|---|---|---|
| Trigger | Nightly arrears job | [E] EV-024 automated |
| Actor | System; strata_manager approves referral | [E] |
| Authentication | Service identity | [P] |
| Authorization | `strata.arrears.refer` for referral | [P] |
| Input | Overdue charges per lot; scheme arrears policy | [E] EV-024 business rules |
| Validation | Exclude lots with active payment plan or dispute hold | [P] |
| Business Rules | Level thresholds e.g. L1 at 14 days overdue (reminder), L2 at 35 (final notice), L3 at 60 (eligible for referral); penalty per jurisdiction | [E] levels exist EV-024/025 / thresholds [U] → [P] |
| Calculation | Ageing buckets 1–30, 31–60, 61–90, 91+ from due date; penalty = principal × rate × days/365 | [E] EV-028 buckets / penalty [U]→[P] |
| Database Changes | `arrears_cases`, `arrears_actions`, `charges` (type=penalty), `debt_referrals` | [P] |
| External Integration | Collection agency adapter (LevyCollect-like) | [E] EV-026 / [P] mock |
| Notification | Arrears notice per level template | [E] EV-024 |
| Audit | `strata.arrears.level_changed`, `strata.arrears.referred` | [P] |
| Reporting | Aged debtors (RPT-ST-01); debt recovery dashboard | [E] EV-028, W12 |
| Final State | Case `resolved` when balance 0, or `referred` → `closed` | [P] |

## WF-09 Supplier invoice → approval → payment
| Step | Detail | Label |
|---|---|---|
| Trigger | Invoice emailed/uploaded | [E] EV-111 (AI roadmap), EV-044 |
| Actor | strata_accountant; committee_member approver | [E] EV-040 |
| Authentication | Staff / portal session | [P] |
| Authorization | `strata.invoice.code`, `strata.invoice.approve` (committee scoped to scheme) | [P] |
| Input | PDF; supplier, invoice no., dates, amount, GST, GL account, fund, scheme, linked work order | [E] EV-040 fields |
| Validation | Duplicate (supplier+invoice no.); supplier active & compliant; GST ≤ amount | [P] |
| Business Rules | Approval required if amount > scheme threshold (default $1,000) or no linked WO; approver sees *budget remaining* | [E] EV-040 budget remaining / threshold [P] |
| Calculation | Budget remaining = budget line − actuals − committed | [E] EV-040 / [P] formula |
| Database Changes | `supplier_invoices`, `approval_requests`, `ledger_entries` (DR expense / CR creditors), `payment_batches`, `payment_batch_items` | [P] |
| External Integration | Bank payables adapter (no file upload) | [E] EV-052 / [P] mock |
| Notification | Approver push/email; supplier remittance | [P] |
| Audit | `strata.invoice.approved/rejected/paid` | [P] |
| Reporting | Creditors aged report; budget vs actual | [P] |
| Final State | Invoice `paid` | [P] |

## WF-10 Strata quote & work order
| Step | Detail | Label |
|---|---|---|
| Trigger | Owner request, inspection, or committee decision | [E] EV-053 |
| Actor | strata_manager; contractor | [E] |
| Authentication | Staff / contractor session | [P] |
| Authorization | `strata.workorder.create`, `supplier.quote.submit` | [P] |
| Input | Scope, scheme, location (common property), suppliers to invite, budget line | [P] |
| Validation | Invited suppliers compliant (BR-SUP-01) | [E] EV-077 |
| Business Rules | ≥2 quotes when estimate > threshold (configurable); comparison table; acceptance may require committee approval | [E] EV-053 comparisons / [P] thresholds |
| Calculation | Quote comparison (price, ex/inc GST, validity) | [P] |
| Database Changes | `quote_requests`, `quotes`, `strata_work_orders` | [P] |
| External Integration | Optional escalation to Vertex FM WO | [P] |
| Notification | Supplier invitation; acceptance | [P] |
| Audit | `strata.quote.accepted`, `strata.workorder.issued` | [P] |
| Reporting | Open WOs by scheme | [P] |
| Final State | WO `completed` → invoice expected (WF-09) | [P] |

## WF-11 Meeting → motions → voting → minutes
| Step | Detail | Label |
|---|---|---|
| Trigger | AGM due / committee request | [E] EV-045 |
| Actor | strata_manager; owners vote | [E] EV-046 |
| Authentication | Staff; owner portal session | [P] |
| Authorization | `strata.meeting.manage`; `strata.vote.cast` (owner of lot financial on record date if rule enabled) | [P] / [U] statutory |
| Input | Meeting type, date, online/onsite, agenda template, motions (ordinary/special/unanimous) | [E] templates, online/onsite EV-045 |
| Validation | Notice period ≥ jurisdiction minimum (config); quorum config | [U] → [P] |
| Business Rules | One vote per eligible lot (or entitlement-weighted); proxies recorded; unfinancial owners excluded for ordinary motions if jurisdiction flag set | [U] → [P] |
| Calculation | Tally; pass thresholds: ordinary >50%, special ≥75% (default config) | [U] → [P] |
| Database Changes | `meetings`, `motions`, `ballots`, `votes`, `proxies`, `documents` (agenda/minutes) | [P] |
| External Integration | Optional inbound ballot result API (StrataVote-like) | [E] EV-046 / [P] |
| Notification | Notice + agenda to owners; results | [P] |
| Audit | `strata.vote.cast` (no vote value for secret ballots), `strata.meeting.closed` | [P] |
| Reporting | Minutes auto-generated from template with results | [E] EV-045 |
| Final State | Meeting `minutes_published` | [P] |

## WF-12 Comms campaign
| Step | Detail | Label |
|---|---|---|
| Trigger | Manager creates campaign | [E] EV-047 |
| Actor | strata_manager | [E] |
| Authentication | Staff | [P] |
| Authorization | `strata.campaign.send` | [P] |
| Input | Subject, body (merge fields), signature, audience filters: scheme(s), building, role (owner/occupier/committee/supplier), ownership type | [E] EV-047 |
| Validation | Audience non-empty; merge fields resolvable; unsubscribe respected for non-statutory | [P] |
| Business Rules | Test send to self before send; audience resolved at send time from live data | [E] EV-047 |
| Calculation | Recipient de-duplication by contact | [P] |
| Database Changes | `campaigns`, `campaign_recipients`, `notifications` | [P] |
| External Integration | Email/SMS provider | [P] mock |
| Notification | Delivered per contact preference | [E] EV-022 |
| Audit | `strata.campaign.sent` | [P] |
| Reporting | Delivery/open stats | [P] |
| Final State | Campaign `sent` | [P] |

## WF-13 Owner self-service & service request
| Step | Detail | Label |
|---|---|---|
| Trigger | Owner opens portal / app | [E] EV-032..037 |
| Actor | owner, committee_member, occupier | [E] |
| Authentication | Portal login (email + password/magic link), MFA optional | [P] |
| Authorization | Data limited to own lots (owner) or scheme (committee financials) | [E] EV-032 committee access / [P] |
| Input | Service request: category, description, location, photos | [E] EV-035 |
| Validation | File type/size; text length | [P] |
| Business Rules | Committee sees scheme financial summary (EV-038); owners see own ledger; wall posts moderated | [E]/[P] |
| Calculation | Fund summaries (admin cash, capital works cash, bank, investments, arrears) | [E] EV-038 |
| Database Changes | `service_requests` (domain=strata), `wall_posts` | [P] |
| External Integration | Escalate to FM WO if tenant has FM | [P] |
| Notification | Status updates to requester | [E] EV-035 track |
| Audit | `portal.request.created` | [P] |
| Reporting | Requests by scheme | [P] |
| Final State | Request `closed` | [P] |

## WF-14 Scheduled report distribution
| Step | Detail | Label |
|---|---|---|
| Trigger | Report schedule (e.g. monthly) | [E] EV-027 |
| Actor | System | [E] |
| Authentication | Service identity | [P] |
| Authorization | Schedule creator must hold report permission; recipients are scheme committee/contacts | [P] |
| Input | Report type, scheme(s), parameters, recipients, cron | [P] |
| Validation | Recipients belong to scheme | [P] |
| Business Rules | Reports reflect "as at" date; excludes unpresented transactions flag | [E] EV-028 |
| Calculation | Report-specific (see REPORT_SPECIFICATION) | [P] |
| Database Changes | `report_schedules`, `report_runs`, `documents` | [P] |
| External Integration | Email provider | [P] |
| Notification | Email with PDF attachment/link | [E] EV-027 |
| Audit | `report.distributed` | [P] |
| Reporting | Distribution log | [P] |
| Final State | ReportRun `delivered` | [P] |

## WF-15 FM property/location/asset onboarding
| Step | Detail | Label |
|---|---|---|
| Trigger | Contract mobilisation | [I] W18 describes contract mobilisation; trigger itself inferred |
| Actor | fm_manager; technician (field capture) | [E] EV-088 |
| Authentication | Staff / mobile session | [P] |
| Authorization | `fm.asset.create`, `fm.property.create` | [P] |
| Input | Regions, properties, location tree, assets (type, make, model, serial, install date, warranty expiry, condition, criticality, photo, GPS) | [E] EV-072, EV-088, EV-091, EV-093 |
| Validation | Location belongs to property; asset type exists; GPS within property radius (warning) | [P] |
| Business Rules | Asset type default useful life & maintenance plan templates auto-applied | [P] |
| Calculation | Remaining life = install year + useful life − now | [P] |
| Database Changes | `regions`, `properties`, `locations`, `assets`, `asset_types`, `documents` | [P] |
| External Integration | — | — |
| Notification | — | — |
| Audit | `fm.asset.created` | [P] |
| Reporting | Asset register | [E] EV-072 |
| Final State | Assets `active` | [P] |

## WF-16 PPM schedule → work order generation
| Step | Detail | Label |
|---|---|---|
| Trigger | Nightly scheduler | [E] EV-075 |
| Actor | System | [E] |
| Authentication | Service identity | [P] |
| Authorization | — | — |
| Input | Maintenance plans (RRULE, lead days, task checklist, default assignee, SLA) linked to assets/locations | [E] against assets or locations EV-075 |
| Validation | Asset active; no open WO from same plan occurrence | [P] |
| Business Rules | Generate occurrences 52 weeks ahead for planner (virtual); create real WO at `due − lead_days` | [E] 52-week planner EV-075 / [P] |
| Calculation | Next due dates from RRULE; workload hours per week | [P] |
| Database Changes | `maintenance_schedules` (occurrences), `work_orders` (type=planned) | [P] |
| External Integration | — | — |
| Notification | Assignee notification for planned job | [E] EV-092 |
| Audit | `fm.workorder.created` source=ppm | [P] |
| Reporting | PPM compliance % | [P] |
| Final State | WO `assigned` | [P] |

## WF-17 Service request → triage → work order
| Step | Detail | Label |
|---|---|---|
| Trigger | Request from customer portal, email, phone, or resident app | [E] EV-083, EV-084, EV-086 |
| Actor | fm_client / resident; fm_coordinator triages | [E] EV-085 |
| Authentication | Portal session / API client credentials for integrations | [P] |
| Authorization | `fm.request.create`; `fm.request.triage` | [P] |
| Input | Property, location, category, description, photos, access consent | [E] EV-086 consent |
| Validation | Property within requester's scope | [P] |
| Business Rules | Coordinator sets priority (P1–P4), category, asset; warranty flag shown if asset under warranty | [E] EV-091 / [P] |
| Calculation | SLA due times from priority + calendar | [P] |
| Database Changes | `service_requests` → `work_orders` (type=reactive) | [P] |
| External Integration | Status back to source app | [E] EV-086 |
| Notification | Requester acknowledgement | [P] |
| Audit | `fm.request.triaged` | [E] EV-013 audit trail |
| Reporting | Requests volume, conversion | [P] |
| Final State | Request `converted`; WO `new` | [P] |

## WF-18 Dispatch → mobile execution → completion evidence
| Step | Detail | Label |
|---|---|---|
| Trigger | WO ready to assign | [E] EV-085 |
| Actor | fm_coordinator; technician / contractor | [E] EV-081, EV-082 |
| Authentication | Staff/mobile session | [P] |
| Authorization | `fm.workorder.assign`; assignee `fm.workorder.execute` on own assignments only | [P] |
| Input | Assignee; schedule; on site: check-in GPS, checklist, notes, photos, parts, time; completion signature optional | [E] EV-085 photos/timestamps |
| Validation | Contractor compliance valid on scheduled date (hard block) | [E] EV-078 |
| Business Rules | Accept/decline within response SLA; completion requires ≥1 photo when category flag `evidence_required` | [P] |
| Calculation | Labour cost = hours × rate; SLA met flags | [P] |
| Database Changes | `assignments`, `work_order_events`, `work_order_evidence`, `time_entries` | [P] |
| External Integration | Status/timestamps/photos to resident app | [E] EV-086 |
| Notification | Assignee notification; requester completion update | [E] EV-092 |
| Audit | Each transition | [E] EV-013 |
| Reporting | Time-to-complete, first-time fix | [P] |
| Final State | WO `completed` → `closed` after verification | [P] |

## WF-19 SLA monitoring & breach
| Step | Detail | Label |
|---|---|---|
| Trigger | Every 5 min job | [P] |
| Actor | System; fm_manager | [E] EV-071 |
| Authentication | Service | [P] |
| Authorization | — | — |
| Input | Open WOs with SLA targets | [E] EV-098 |
| Validation | — | — |
| Business Rules | At-risk at 80% elapsed; breached at 100%; clock paused in `on_hold` with reason | [U] → [P] |
| Calculation | Elapsed business minutes using calendar | [P] |
| Database Changes | `work_orders.sla_*` flags, `sla_events` | [P] |
| External Integration | — | — |
| Notification | At-risk alert to coordinator; breach to manager | [P] |
| Audit | `fm.sla.breached` | [P] |
| Reporting | SLA compliance % (KPI-FM-02) | [E] EV-071 |
| Final State | Breach recorded | [P] |

## WF-20 Contractor compliance verification
| Step | Detail | Label |
|---|---|---|
| Trigger | Contractor uploads certificate; daily expiry job | [E] EV-077 |
| Actor | contractor; fm_manager verifies | [E] |
| Authentication | Contractor portal session | [P] |
| Authorization | `supplier.compliance.upload` (own), `supplier.compliance.verify` | [P] |
| Input | Type (public liability, workers comp, trade licence, safeguarding check…), number, insurer, cover amount, expiry, file | [E] EV-077, EV-078 / types [U] |
| Validation | Expiry in future; cover ≥ tenant minimum | [P] |
| Business Rules | Supplier status `compliant` only if all required types verified & unexpired; expiring at 30 days → reminders | [E] no manual follow-up EV-077 / [P] |
| Calculation | Days to expiry | [P] |
| Database Changes | `compliance_records`, `suppliers.compliance_status` | [P] |
| External Integration | — | — |
| Notification | Expiry reminders 30/14/1 days | [E] EV-077 |
| Audit | `supplier.compliance.verified` | [P] |
| Reporting | Supplier compliance % | [P] |
| Final State | Supplier `compliant` / `non_compliant` | [P] |

## WF-21 Client approval (quote / variation)
| Step | Detail | Label |
|---|---|---|
| Trigger | Quote received or cost exceeds NTE (not-to-exceed) | [E] EV-090 |
| Actor | fm_coordinator; fm_client approver | [E] |
| Authentication | Client portal | [P] |
| Authorization | `fm.approval.decide` scoped to client's properties; amount ≤ approver limit | [P] |
| Input | Amount, description, attachments | [P] |
| Validation | Approval not expired | [P] |
| Business Rules | WO blocked in `awaiting_approval` until decision; expiry 7 days default | [P] |
| Calculation | Variation delta vs original NTE | [P] |
| Database Changes | `approval_requests`, `approval_steps`, `work_orders.nte_amount` | [P] |
| External Integration | — | — |
| Notification | Approver email with deep link | [P] |
| Audit | `approval.decided` | [P] |
| Reporting | Approval turnaround | [P] |
| Final State | Approved → WO resumes; rejected → WO cancelled or re-quoted | [P] |

## WF-22 10-year asset lifecycle plan
| Step | Detail | Label |
|---|---|---|
| Trigger | Annual planning or on demand | [E] EV-073 |
| Actor | fm_manager | [E] |
| Authentication | Staff | [P] |
| Authorization | `fm.assetplan.manage` | [P] |
| Input | Assets with install date, useful life, condition (1–5), replacement cost, criticality; escalation rate | [U] method → [P] |
| Validation | Replacement cost present | [P] |
| Business Rules | Replacement year adjusted by condition (cond 5→ −50% remaining life) | [P] |
| Calculation | See [../03-fm/ASSET_LIFECYCLE.md](../03-fm/ASSET_LIFECYCLE.md) | [P] |
| Database Changes | `asset_plans`, `asset_plan_lines` | [P] |
| External Integration | — | — |
| Notification | — | — |
| Audit | `fm.assetplan.published` | [P] |
| Reporting | CAPEX by year/property (RPT-FM-03) | [E] EV-073 |
| Final State | Plan `published` | [P] |

## WF-23 AI assistant query
| Step | Detail | Label |
|---|---|---|
| Trigger | Staff asks question in assistant panel | [E] EV-110, EV-114 |
| Actor | strata_manager / fm_manager / coordinator | [E] |
| Authentication | Staff session | [P] |
| Authorization | AI uses caller's permissions; every tool call re-checks RBAC & tenant | [P] |
| Input | Natural-language question, optional context (scheme/property) | [P] |
| Validation | Length; prompt-injection screening on retrieved docs | [P] |
| Business Rules | Read tools auto-run; write tools produce `AIActionProposal` requiring user confirmation | [E] EV-113 human reviews / [P] |
| Calculation | — | — |
| Database Changes | `ai_conversations`, `ai_messages`, `ai_tool_calls`, `ai_citations` | [P] |
| External Integration | LLM provider via gateway | [U] Urbanise model / [P] Claude |
| Notification | — | — |
| Audit | `ai.tool_call` with args hash, `ai.response` | [P] |
| Reporting | AI usage & eval dashboard | [P] |
| Final State | Answer with citations | [E] EV-114 source-backed |

## WF-24 AI email draft
| Step | Detail | Label |
|---|---|---|
| Trigger | Inbound owner email (shared mailbox ingest) or manager clicks "Draft reply" | [E] EV-113 |
| Actor | strata_manager | [E] |
| Authentication | Staff | [P] |
| Authorization | `ai.draft.create`; data limited to sender's matched lot/scheme | [P] |
| Input | Email text; matched contact | [P] |
| Validation | Sender matched to contact by email; if ambiguous, no personal data retrieved | [P] |
| Business Rules | Never auto-send; user edits and sends | [E] EV-113 |
| Calculation | — | — |
| Database Changes | `ai_drafts` | [P] |
| External Integration | Email provider for sending | [P] |
| Notification | — | — |
| Audit | `ai.draft.created`, `ai.draft.sent` (diff ratio) | [P] |
| Reporting | Draft acceptance rate | [P] |
| Final State | Draft `sent` or `discarded` | [P] |

## WF-25 AI invoice extraction
| Step | Detail | Label |
|---|---|---|
| Trigger | Invoice PDF uploaded/emailed | [E] EV-111 |
| Actor | strata_accountant | [E] |
| Authentication | Staff | [P] |
| Authorization | `strata.invoice.code` | [P] |
| Input | PDF | [E] |
| Validation | Extracted ABN/supplier match; totals arithmetic check | [P] |
| Business Rules | Fields with confidence < 0.85 highlighted; human confirms before posting | [P] |
| Calculation | GST check: gst ≈ total/11 (AU) warning | [P] |
| Database Changes | `ai_extractions`, `supplier_invoices` (draft) | [P] |
| External Integration | LLM (vision) | [P] |
| Notification | — | — |
| Audit | `ai.extraction.confirmed` | [P] |
| Reporting | Extraction accuracy | [P] |
| Final State | Invoice `coded` → WF-09 | [P] |

## WF-26 Resident-app integration
| Step | Detail | Label |
|---|---|---|
| Trigger | External app posts request; Vertex status changes | [E] EV-086, EV-087 |
| Actor | Integration client | [E] |
| Authentication | OAuth2 client credentials + HMAC-signed webhooks | [U] → [P] |
| Authorization | Client scoped to tenant & properties | [P] |
| Input | External request id, property ref, unit, description, photos, consent | [E] |
| Validation | Schema; idempotency on external id | [P] |
| Business Rules | Outbound events: acknowledged, assigned, scheduled, completed (with photos/timestamps) | [E] EV-086 |
| Calculation | — | — |
| Database Changes | `external_refs`, `service_requests`, `webhook_deliveries` | [P] |
| External Integration | Outbound webhook with retries | [P] |
| Notification | Via external app | [E] |
| Audit | `integration.inbound`, `webhook.delivered` | [P] |
| Reporting | Delivery success rate | [P] |
| Final State | External app in sync | [P] |

## WF-27 Insurance & compliance register (strata)
| Step | Detail | Label |
|---|---|---|
| Trigger | Policy recorded / renewal approaching | [E] EV-054, EV-055 |
| Actor | strata_manager | [E] |
| Authentication | Staff | [P] |
| Authorization | `strata.insurance.manage` | [P] |
| Input | Insurer, policy no., type, sum insured, premium, start/end, certificate | [P] |
| Validation | End > start | [P] |
| Business Rules | Renewal task 60 days before expiry; compliance items (e.g. fire safety statement) with due dates | [E] EV-055 / [P] |
| Calculation | — | — |
| Database Changes | `insurance_policies`, `compliance_items`, `tasks` | [P] |
| External Integration | — | — |
| Notification | Renewal reminders | [P] |
| Audit | `strata.insurance.updated` | [P] |
| Reporting | Expiring policies | [P] |
| Final State | Policy `active` | [P] |
