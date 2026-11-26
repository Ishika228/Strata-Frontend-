# Traceability Matrix

Chain: Evidence → Evidence ID → Requirement → Feature → User Story → Workflow → Business Rule → Data Entity → API → UI → Permission → Integration → Test → Demo. "—" = not applicable; **GAP** = missing link (listed in [TRACEABILITY_GAPS.md](TRACEABILITY_GAPS.md)).

| Feature | Evidence ID(s) | Requirement | User Story | Workflow | Business Rule | Data Entity | API | UI | Permission | Integration | Test | Demo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F-SH-01 Tenancy | EV-015 (INFERRED) | FR-SH-01/02 | US-01 | WF-01 | BR-SH-01 | Tenant, Membership | /tenants | SCR-002 | platform.tenant.manage | — | FT-SH-01, TEN-01..12 | 23 |
| F-SH-02 Identity/SSO | EV-006 | FR-SH-03/04 | US-02 | WF-02 | — | User | /me, Keycloak | SCR-001 | authenticated | INT-07 | FT-SH-02/03, SEC-05/06, INT-T-16 | 1 |
| F-SH-03 RBAC | EV-041, EV-032 | FR-SH-05 | US-03 | — | BR-SH-01 | RoleAssignment | /users/{id}/role-assignments | SCR-003 | platform.user.manage | — | FT-SH-04, RBAC-N01..16 | 23 |
| F-SH-04 Documents | EV-014, EV-037 | FR-SH-06 | US-22 | WF-13 | BR-SH-03 | Document | /documents | SCR-005, SCR-154 | document.* | — | FT-SH-05, DOC-01..08, SEC-10/11 | 14 |
| F-SH-05 Notifications | EV-022, EV-092 | FR-SH-07/08 | US-08 | WF-05, WF-16 | BR-SH-04 | Notification, Template | /notifications | SCR-006 | own | INT-06 | FT-SH-06, NOT-01..10 | 4 |
| F-SH-06 Audit | EV-013, EV-002 | FR-SH-09 | US-45 | all | BR-SH-02 | AuditEvent | /audit-events | SCR-004 | platform.audit.read | — | FT-SH-07, SEC-12 | 23 |
| F-SH-07 Search | — (PROPOSED) | FR-SH-10 | US-46 | — | — | search_index | /search | SCR-007 | scoped | — | FT-SH-08, TEN-03 | 2 |
| F-SH-08 Tasks/notes | EV-012 | FR-SH-11 | US-12 (task), US-39 | WF-08, WF-27 | — | Task, Note | /tasks | SCR-009 | task.manage | — | FT-SH-09 | 14 |
| F-SH-09 Imports | EV-009, EV-093 | FR-SH-12 | US-04 | WF-01 | BR-SH-05 | ImportJob | /imports | SCR-008 | platform.import.run | — | FT-SH-10, E2E-SH-02 | App. A |
| F-SH-10 API & webhooks | EV-007, EV-008 | FR-SH-13 | US-44 | WF-26 | — | ApiClient, WebhookSubscription | /integration/clients, /webhooks | Settings › Integrations | integration.client.manage | INT-05 | FT-SH-11, WH-01..07 | 15, 18 |
| F-SH-11 Contextual help | EV-005 | FR-SH-14 | **GAP** (accepted) | — | — | — | — | all (help icon) | — | — | UI-HELP | **GAP** (accepted) |
| F-ST-01 Register | EV-029, EV-056 | FR-ST-01/02 | US-05, US-06 | WF-03 | BR-ST-20 | Scheme, Building, Lot, Ownership, Occupancy | /strata/schemes, /lots, /ownerships | SCR-102..105 | strata.scheme.*, strata.contact.manage | — | FT-ST-01/02 | 2 |
| F-ST-02 Budget & funds | EV-020, EV-038, EV-044 | FR-ST-03/04 | US-07 | WF-04 | BR-ST-01/02/15 | Budget, Fund, GLAccount | /strata/budgets | SCR-106 | strata.budget.* | — | FT-ST-03/04, FIN-01 | 3 |
| F-ST-03 Levies | EV-020, EV-021, EV-050 | FR-ST-05/06/07 | US-07, US-08 | WF-04, WF-05 | BR-ST-03/04/10 | LevySchedule, Charge, LevyRun, LevyNotice | /levy-runs, /charges | SCR-107 | strata.levy.issue | INT-02 | FT-ST-03..06, FIN-01, PERF-03 | 3, 4 |
| F-ST-04 Payments | EV-034, EV-050 | FR-ST-08/09 | US-09 | WF-06 | BR-ST-05/06 | Payment, PaymentAllocation | /strata/payments, /portal/payments/intent, /pay | SCR-108, SCR-152 | strata.payment.create, owner | INT-02 | FT-ST-07..09, FIN-02, INT-T-05..08 | 5 |
| F-ST-05 Bank & reconciliation | EV-042, EV-051, EV-023 | FR-ST-10 | US-10, US-11 | WF-07 | BR-ST-12 | BankStatement, BankTransaction, Reconciliation | /bank-accounts/{id}/statements, /bank-transactions | SCR-109 | strata.bank.reconcile | INT-01 | FT-ST-10/11, INT-T-01..03, PERF-04 | 6 |
| F-ST-06 Arrears | EV-024..026, EV-039 | FR-ST-11..14 | US-12, US-13 | WF-08 | BR-ST-07/08/09/11 | ArrearsCase, ArrearsAction, DebtReferral, PaymentPlan | /strata/arrears | SCR-110 | strata.arrears.* | INT-03 | FT-ST-12..15, FIN-06/07, INT-T-09 | 7 |
| F-ST-07 Trust ledger | EV-043, EV-041 | FR-ST-15 | US-11 | WF-07 | BR-ST-12 | JournalEntry, LedgerLine, Period | /strata/journals, /periods | SCR-120 | strata.journal.post, strata.period.close | — | FT-ST-16, FIN-03/04/08/09 | 6 |
| F-ST-08 Invoices & payables | EV-040, EV-042, EV-044, EV-052 | FR-ST-16/17 | US-14..16 | WF-09 | BR-ST-13..16 | SupplierInvoice, ApprovalRequest, PaymentBatch | /supplier-invoices, /approvals, /payment-batches | SCR-111/112, SCR-156 | strata.invoice.*, strata.payment_batch.submit | INT-01 | FT-ST-17..20, INT-T-04 | 8, 9, 10 |
| F-ST-09 Procurement | EV-053 | FR-ST-18 | US-17 | WF-10 | BR-ST-17 | QuoteRequest, Quote, StrataWorkOrder | /quote-requests, /strata/work-orders | SCR-114 | strata.workorder.manage | — | FT-ST-21 | 7a |
| F-ST-10 Meetings & voting | EV-045, EV-046 | FR-ST-19..21 | US-18..20 | WF-11 | BR-ST-18/19 | Meeting, Motion, Vote, Proxy | /strata/meetings, /motions/{id}/votes | SCR-115/116, SCR-157 | strata.meeting.manage, strata.vote.cast | INT-04 | FT-ST-22..25, INT-T-10 | 12 |
| F-ST-11 Comms | EV-047, EV-022 | FR-ST-22 | US-21 | WF-12 | BR-ST-21 | Campaign | /strata/campaigns | SCR-117 | strata.campaign.send | INT-06 | FT-ST-26, NOT-04 | 13 |
| F-ST-12 Owner portal | EV-032..040 | FR-ST-23/24 | US-22..24, US-15 | WF-13 | BR-ST-20 | PortalSite | /portal/* | SCR-151..158 | owner, committee_member, occupier | — | FT-ST-27/28, E2E-ST-08, RBAC-N01..03 | 5, 9 |
| F-ST-13 Community wall | EV-036 | FR-ST-25 | US-47 | WF-13 | — | WallPost | /portal/walls | SCR-155 | strata.wall.post | — | FT-ST-29, SEC-02 | 2a |
| F-ST-14 Insurance & compliance | EV-054, EV-055 | FR-ST-26 | US-25 | WF-27 | BR-ST-22 | InsurancePolicy, ComplianceItem | /insurance-policies, /compliance-items | SCR-119 | strata.insurance.manage | — | FT-ST-30 | 2 |
| F-ST-15 Reports & dashboard | EV-027, EV-028, EV-031, EV-059 | FR-ST-27..30 | US-26 | WF-14 | BR-ST-07 | ReportSchedule, ReportRun | /strata/reports, /report-schedules, /strata/dashboard | SCR-101, SCR-118 | strata.report.run | INT-06 | FT-ST-31..33, FIN-10, PERF-07 | 1, 11 |
| F-FM-01 Properties & locations | EV-093, EV-070 | FR-FM-01 | US-27 | WF-15 | — | Region, Property, Location | /fm/properties, /fm/locations | SCR-202/203 | fm.property.manage | — | FT-FM-01 | 16 |
| F-FM-02 Asset register | EV-072, EV-088, EV-091 | FR-FM-02 | US-27 | WF-15 | BR-FM-06 | Asset, AssetType | /fm/assets | SCR-204/205, SCR-253 | fm.asset.* | — | FT-FM-02 | 16 |
| F-FM-03 Lifecycle | EV-072, EV-073 | FR-FM-03 | US-28 | WF-22 | BR-FM-12 | AssetPlan, AssetPlanLine | /fm/asset-plans | SCR-206 | fm.assetplan.manage | — | FT-FM-03, E2E-FM-04 | 20 |
| F-FM-04 PPM & planner | EV-075, EV-076 | FR-FM-04/05 | US-29 | WF-16 | BR-FM-04/05 | MaintenancePlan, MaintenanceSchedule | /fm/maintenance-plans, /fm/planner | SCR-207/208 | fm.maintenanceplan.manage | — | FT-FM-04/05, E2E-FM-02 | 20 |
| F-FM-05 Service requests & portal | EV-083, EV-084 | FR-FM-06/07 | US-30, US-31 | WF-17 | — | ServiceRequest | /fm/service-requests, /fm/portal/requests | SCR-209, SCR-261 | fm.request.* | INT-05 | FT-FM-06/07 | 15, 16 |
| F-FM-06 Work orders | EV-085, EV-096 | FR-FM-08 | US-31..33 | WF-17, WF-18 | BR-FM-08 | WorkOrder, WorkOrderEvent, Evidence | /fm/work-orders, /transitions | SCR-210/211 | fm.workorder.* | INT-05 | FT-FM-08, API-STATE-01 | 16, 17 |
| F-FM-07 SLA | EV-071, EV-098 | FR-FM-09 | US-34 | WF-19 | BR-FM-01..03 | SLAPolicy, BusinessCalendar, SLAEvent | /fm/sla-policies | SCR-213 | fm.sla.manage | — | FT-FM-09/10 | 16 |
| F-FM-08 Workforce & mobile | EV-074, EV-081 | FR-FM-10/11 | US-33 | WF-18 | BR-FM-11 | Technician, Assignment, TimeEntry | /fm/me/*, /fm/dispatch-board | SCR-212, SCR-251/252 | fm.workorder.execute/assign | — | FT-FM-11/12, E2E-FM-05, PERF-08 | 17 |
| F-FM-09 Suppliers & compliance | EV-077, EV-078, EV-082 | FR-FM-12 | US-32, US-35 | WF-20 | BR-FM-07, BR-SUP-01/02 | Supplier, ComplianceRecord, ComplianceType | /suppliers, /compliance-records | SCR-113, SCR-214, SCR-254 | supplier.* | — | FT-FM-13/14, NOT-07 | 16 |
| F-FM-10 Client approvals | EV-090 | FR-FM-13 | US-36 | WF-21 | BR-FM-09/10 | ApprovalRequest | /approvals, /fm/work-orders/{id}/approval-requests | SCR-215 | fm.approval.decide | — | FT-FM-15, E2E-FM-03 | 19 |
| F-FM-11 Compliance schedules & inspections | EV-076 | FR-FM-14 | US-37 | WF-16 | — | Inspection, InspectionTemplate | /fm/inspection-templates | SCR-207, SCR-211 | fm.maintenanceplan.manage | — | FT-FM-16 | 20a |
| F-FM-12 Ops Centre | EV-071 | FR-FM-15 | US-34 | WF-19 | — | (views) | /fm/ops-centre | SCR-201 | fm.workorder.read | — | FT-FM-17, PERF-06 | 16 |
| F-FM-13 Analytics | EV-079, EV-089 | FR-FM-16 | US-38 | — | — | (MVs) | /fm/analytics | SCR-216 | fm.analytics.read | — | FT-FM-18 | 21 |
| F-FM-14 CRM | EV-080 | FR-FM-17 | US-48 | — | — | Contact | /contacts, /fm/contacts/{id}/history | SCR-217 | fm.workorder.read | — | FT-FM-19 | 20b |
| F-AI-01 Gateway | EV-115, EV-116 | FR-AI-01/07 | US-39 | WF-23 | BR-AI-01..04 | AIConversation, AIToolCall, AIActionProposal | /ai/conversations, /ai/action-proposals | SCR-301, SCR-304 | ai.assistant.use, ai.settings.manage | INT-10 | AIT-03/04/09..11/18..24 | 14 |
| F-AI-02 Strata tools | EV-110, EV-113 | FR-AI-02 | US-39 | WF-23 | BR-AI-01 | — | /ai/conversations/{id}/messages | SCR-301 | per tool | INT-10 | AIT-01/02 | 14 |
| F-AI-03 FM tools | EV-079 | FR-AI-03 | US-40 | WF-23 | BR-AI-01 | — | same | SCR-301 | per tool | INT-10 | AIT-12/13 | 22 |
| F-AI-04 RAG & citations | EV-114 | FR-AI-04 | US-41 | WF-23 | BR-AI-03 | DocumentChunk, AICitation | same | SCR-301 | document.read | INT-11 | AIT-05..08, 25, DOC-07/08 | 14 |
| F-AI-05 Email drafts | EV-113 | FR-AI-05 | US-42 | WF-24 | BR-AI-02/04 | AIDraft | /ai/drafts | SCR-302 | ai.draft.create | INT-06 | AIT-14/15, E2E-AI-02 | 14a |
| F-AI-06 Invoice extraction | EV-111 | FR-AI-06 | US-43 | WF-25 | — | AIExtraction | /ai/extractions | SCR-303 | strata.invoice.code | INT-10 | AIT-16/17 | 8 |
| F-IN-01 Bank | EV-023, EV-049..052 | FR-IN-01 | US-10 | WF-07, WF-09 | — | BankTransaction | /integrations/bank/* | SCR-109 | — | INT-01 | INT-T-01..04 | 6, 10 |
| F-IN-02 Payments | EV-050 | FR-IN-02 | US-09 | WF-06 | — | Payment | /integrations/payments/* | SCR-152 | — | INT-02 | INT-T-05..08 | 5 |
| F-IN-03 Collections | EV-026 | FR-IN-03 | US-13 | WF-08 | — | DebtReferral | /integrations/collections/* | SCR-110 | — | INT-03 | INT-T-09 | 7 |
| F-IN-04 E-voting inbound | EV-046 | FR-IN-04 | US-49 | WF-11 | — | Motion | /strata/motions/{id}/results | — (API-only) | strata.voting:write scope | INT-04 | INT-T-10 | **GAP** (accepted) |
| F-IN-05 Resident apps | EV-086, EV-087 | FR-IN-05 | US-44 | WF-26 | — | ServiceRequest, ExternalRef | /integrations/resident-apps/* | — | client scope | INT-05 | INT-T-11..14 | 15, 18 |
| F-IN-06 Email/SMS | EV-022 | FR-IN-06 | US-08, US-21 | WF-05, WF-12 | BR-SH-04 | Notification | — | — | — | INT-06 | INT-T-15, NOT-* | 4, 13 |
| F-IN-07 SSO IdP | EV-006 | FR-IN-07 | US-02 | WF-02 | — | User | Keycloak | SCR-001 | — | INT-07 | INT-T-16 | 1 |

Rows: 53 features. Fully linked: 51. Accepted gaps: 2 features (F-SH-11 story/demo; F-IN-04 UI/demo) — see gaps file. 10 gaps found during validation were fixed.
