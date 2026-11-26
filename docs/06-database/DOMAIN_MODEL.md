# Domain Model

"Concept status" states whether the **business concept** is evidenced for Urbanise; the **entity design** (attributes, keys) is always PROPOSED for the POC — Urbanise's schema is UNKNOWN (U-01). Physical DDL: [SCHEMA.sql](SCHEMA.sql). Diagram: [ERD.md](ERD.md).

All tenant-owned entities include: `id uuid`, `tenant_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at` (domain records only), `version` (optimistic locking).

## A. Shared entities
| Entity | Concept status | Evidence | Key attributes | Relationships |
|---|---|---|---|---|
| Tenant | INFERRED | EV-015 | name, products[], timezone, currency, locale, jurisdiction, settings jsonb, status | has Memberships, all data |
| User | INFERRED | EV-006 | email, name, phone, kc_subject, status | Memberships |
| Membership | PROPOSED | — | user_id, tenant_id, status | RoleAssignments |
| Role | PROPOSED (code catalog) | EV-041 | key, name, permissions[] | |
| Permission | PROPOSED (code catalog) | — | key | |
| RoleAssignment | PROPOSED | EV-032 (scoped visibility) | membership_id, role, scope_type, scope_id | |
| Contact | CONFIRMED (owners, residents, CRM) | EV-034, EV-080 | type person/company, names, emails, phones, postal address, user_id? | Ownerships, Occupancies, roles |
| ContactPreference | CONFIRMED | EV-022 | channels order, opt-outs | Contact |
| Document | CONFIRMED | EV-014, EV-037 | kind, title, storage_key, sha256, visibility, scan_status | DocumentLinks, Versions, ACL |
| Notification | CONFIRMED | EV-092 | channel, template, status | Contact/User |
| AuditEvent | CONFIRMED | EV-013 | action, entity, before/after, hash | |
| Task / Note | CONFIRMED | EV-012 | title, assignee, due, status / body | entity link |
| ImportJob | CONFIRMED | EV-009 | type, status, report | |
| ApiClient, WebhookSubscription, WebhookDelivery, ExternalRef, OutboxEvent | CONFIRMED capability (API) / PROPOSED entities | EV-007, EV-008 | | |
| Supplier, ComplianceType, ComplianceRecord | CONFIRMED | EV-053, EV-077 | see SUPPLIERS_AND_COMPLIANCE | used by Strata & FM |
| ApprovalRequest, ApprovalStep | CONFIRMED | EV-040, EV-090 | subject, amount, status | invoices, quotes, variations |
| ServiceRequest | CONFIRMED | EV-035, EV-084 | domain strata/fm, source, status | → WorkOrder / StrataWorkOrder |

## B. Strata entities
| Entity | Concept status | Evidence | Key attributes |
|---|---|---|---|
| Scheme | CONFIRMED (plan/OC/body corporate) | EV-029 | name, registration_no, jurisdiction, address, fy_start_month, levy_frequency, first_due_date, lead_days, gst_registered, status |
| Building | OBSERVED | EV-029 | scheme_id, name, address |
| Lot | CONFIRMED/OBSERVED | EV-029 | scheme_id, building_id?, lot_number, unit_label, floor_label, entitlement, lot_type (residential/commercial/parking), crn |
| Ownership (Owner) | CONFIRMED | EV-034, EV-056 | lot_id, contact_id, share_pct, ownership_type (owner_occupier/investor/company), from, to, is_primary |
| Occupancy (Occupier) | CONFIRMED | EV-047 | lot_id, contact_id, from, to |
| CommitteeMembership | CONFIRMED | EV-032 | scheme_id, contact_id, position, from, to |
| Fund | OBSERVED | EV-038 | scheme_id, type admin/capital_works/other, name |
| GLAccount | CONFIRMED (account codes) | EV-044 | scheme_id, code, name, type, fund_id? |
| BankAccount (trust) | CONFIRMED | EV-043 | scheme_id, bank, bsb, account_no (encrypted), gl_account_id |
| Investment | CONFIRMED | EV-049, EV-060 | scheme_id, institution, principal, rate, start, maturity (backlog) |
| Budget / BudgetLine | CONFIRMED | EV-020 | fy, version, status / fund, account, amount |
| LevySchedule / LevyScheduleItem (Levy) | CONFIRMED | EV-021 | type regular/special / lot, fund, instalment, due_date, amount |
| LevyRun | CONFIRMED | EV-021 | period, status, stats |
| Charge (Levy Charge, sundry, penalty) | CONFIRMED/OBSERVED | EV-030, EV-039 | lot_id or debtor_contact_id, type levy/sundry/penalty/fee, fund, amount, due_date, outstanding, status |
| LevyNotice (Invoice) | CONFIRMED | EV-050 | lot, run, document_id, pay_link, total |
| Payment | CONFIRMED | EV-034 | lot?, payer, amount, method, provider_ref, status, received_at |
| PaymentAllocation | INFERRED | — | payment_id, charge_id, amount |
| BankStatement / BankTransaction | CONFIRMED | EV-051 | bank_account, date, amount, description, reference, status |
| Reconciliation | CONFIRMED | EV-042 | bank_account, period, statement_balance, ledger_balance, status |
| JournalEntry / LedgerLine | CONFIRMED (ledger) | EV-041, EV-043 | see TRUST_ACCOUNTING |
| Period | PROPOSED | — | scheme, month, status |
| ArrearsPolicy / ArrearsCase / ArrearsAction (Arrears) | CONFIRMED/OBSERVED | EV-024, EV-025 | levels / lot, level, status / level, sent_at, notification |
| PaymentPlan | PROPOSED | — | lot, instalments, status |
| DebtReferral | CONFIRMED | EV-026 | case, provider, status, external_id |
| Supplier (shared) | CONFIRMED | EV-053 | |
| QuoteRequest / Quote | CONFIRMED | EV-053 | |
| StrataWorkOrder (Purchase Order) | CONFIRMED (work orders) | EV-053 | scheme, supplier, scope, approved_amount, status — acts as purchase order |
| SupplierInvoice | CONFIRMED/OBSERVED | EV-040, EV-044 | supplier, scheme, invoice_no, dates, amount, gst, fund, account, wo_id, status |
| PaymentBatch / PaymentBatchItem | CONFIRMED | EV-052 | status, totals |
| Approval (ApprovalRequest, shared) | OBSERVED | EV-040 | |
| Meeting / Motion / Ballot / Vote / Proxy | CONFIRMED | EV-045, EV-046 | see MEETINGS_AND_VOTING |
| Campaign / CampaignRecipient | CONFIRMED | EV-047 | |
| WallPost | CONFIRMED | EV-036 | scheme, wall committee/community, author, body, pinned, hidden |
| InsurancePolicy | CONFIRMED | EV-054 | |
| ComplianceItem (strata) | CONFIRMED (via partner) | EV-055 | scheme, type, due_date, status |
| Task (shared) | CONFIRMED | EV-012 | |
| ReportSchedule / ReportRun | CONFIRMED | EV-027 | |
| PortalSite | CONFIRMED | EV-032 | scheme, branding, status |

## C. FM entities
| Entity | Concept status | Evidence | Key attributes |
|---|---|---|---|
| Region | CONFIRMED | EV-093 | name |
| Property | CONFIRMED | EV-070 | region, client_id?, name, address, geo, flags[] (child_safe, aged_care), calendar_id, sla_policy_id |
| Client (FM customer org) | INFERRED | W18/W19 | name, contacts |
| Location | CONFIRMED | EV-075 | property, parent_id, name, type (building/floor/room/zone), path (ltree) |
| Asset | CONFIRMED | EV-072 | see ASSET_LIFECYCLE |
| AssetType | INFERRED | EV-072 | default life, cost, plans |
| AssetPlan / AssetPlanLine | CONFIRMED | EV-073 | horizon, lines per year |
| MaintenancePlan | CONFIRMED | EV-075, EV-076 | rrule, lead_days, checklist, is_statutory |
| MaintenanceSchedule | CONFIRMED | EV-075 | occurrence rows |
| ServiceRequest (shared) | CONFIRMED | EV-084 | |
| WorkOrder | CONFIRMED | EV-085 | see WORK_MANAGEMENT |
| WorkOrderEvent / WorkOrderEvidence / TimeEntry / MaterialLine | CONFIRMED (timestamps, photos) | EV-085 | |
| Technician | CONFIRMED (workforce) | EV-074 | user_id, trades[], hourly_rate, home_region, shift calendar |
| Assignment | CONFIRMED | EV-085 | |
| Supplier / Contractor | CONFIRMED | EV-077, EV-082 | Contractor = Supplier + SupplierUsers |
| ComplianceRecord (shared) | CONFIRMED | EV-077 | |
| SLAPolicy / BusinessCalendar / SLAEvent | CONFIRMED (SLA) | EV-098 | |
| Inspection / InspectionTemplate | INFERRED | EV-076 | checklist results |
| ApprovalRequest (shared) | CONFIRMED | EV-090 | |
| AssetDocument | CONFIRMED | EV-088 | = DocumentLink(entity_type='asset') |
| Contact (CRM, shared) | CONFIRMED | EV-080 | |

## D. AI entities (PROPOSED; EV-118 UNKNOWN for Urbanise)
AIConversation, AIMessage, AIToolCall, AICitation, AIActionProposal, AIDraft, AIExtraction, DocumentChunk (embedding vector(1024)), AIUsage (tokens, cost), AIEvalRun.
