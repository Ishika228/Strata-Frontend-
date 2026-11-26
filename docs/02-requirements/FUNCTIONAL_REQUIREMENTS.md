# Functional Requirements

Format: `FR-<area>-<nn>` · Priority M (must, POC), S (should), C (could). Source: evidence ID or PROPOSED.

## Shared (F-SH)
| ID | Feature | Requirement | Pri | Source |
|---|---|---|---|---|
| FR-SH-01 | F-SH-01 | Create/suspend tenants with licensed products (strata, fm), timezone, currency, locale, jurisdiction defaults | M | EV-015 |
| FR-SH-02 | F-SH-01 | Every tenant-owned record carries `tenant_id`; cross-tenant access impossible via API/UI/AI | M | PROPOSED |
| FR-SH-03 | F-SH-02 | Email+password with TOTP MFA; MFA mandatory for staff roles | M | PROPOSED |
| FR-SH-04 | F-SH-02 | OIDC SSO with Microsoft Entra ID per tenant | M | EV-006 |
| FR-SH-05 | F-SH-03 | Roles with scoped assignments (tenant / scheme / property / lot / supplier) | M | PROPOSED |
| FR-SH-06 | F-SH-04 | Upload, version, tag, ACL documents; link to any entity; virus scan; preview | M | EV-014, EV-037 |
| FR-SH-07 | F-SH-05 | Notifications via in-app, email, SMS (mock) honouring contact preference | M | EV-022 |
| FR-SH-08 | F-SH-05 | Template management with merge fields | S | EV-045, EV-047 |
| FR-SH-09 | F-SH-06 | Immutable audit of all state changes & sensitive reads | M | EV-013 |
| FR-SH-10 | F-SH-07 | Global search across schemes, lots, contacts, properties, assets, work orders, documents (permission-filtered) | M | PROPOSED |
| FR-SH-11 | F-SH-08 | Tasks with assignee, due date, entity link; notes & timeline per entity; rule-based task automation | M | EV-012 |
| FR-SH-12 | F-SH-09 | XLSX/CSV import with dry-run, row errors, commit, rollback | M | EV-009, EV-093 |
| FR-SH-13 | F-SH-10 | Versioned REST API with OAuth2 client credentials; outbound webhooks | M | EV-007, EV-008 |
| FR-SH-14 | F-SH-11 | Contextual help links per screen | C | EV-005 |

## Strata (F-ST)
| ID | Feature | Requirement | Pri | Source |
|---|---|---|---|---|
| FR-ST-01 | F-ST-01 | CRUD schemes, buildings, lots (number, label, entitlement), contacts, ownerships, occupancies; strata roll report | M | EV-029, EV-056 |
| FR-ST-02 | F-ST-01 | Owner portal auto-created on scheme creation | M | EV-032 |
| FR-ST-03 | F-ST-02 | Funds (admin, capital works) per scheme with chart-of-accounts template | M | EV-038, EV-044 |
| FR-ST-04 | F-ST-02 | Annual budget by fund & account; draft→approved | M | EV-020 |
| FR-ST-05 | F-ST-03 | Generate levy schedule from approved budget by frequency | M | EV-020, EV-021 |
| FR-ST-06 | F-ST-03 | Automatic levy runs ahead of due date; PDF notice with pay reference & pay-now link | M | EV-021, EV-050 |
| FR-ST-07 | F-ST-03 | Sundry charges to lots or non-owner debtors | S | EV-030 |
| FR-ST-08 | F-ST-04 | Pay-now via payment provider; receipts; allocation; credits | M | EV-050, EV-034 |
| FR-ST-09 | F-ST-04 | Manual receipt entry ("quick transaction entry") | M | EV-042 |
| FR-ST-10 | F-ST-05 | Import bank statements; auto-match; manual match; reconcile & lock | M | EV-042, EV-051 |
| FR-ST-11 | F-ST-06 | Arrears policy per scheme with levels, templates, penalties | M | EV-024, EV-039 |
| FR-ST-12 | F-ST-06 | Nightly arrears escalation and notices | M | EV-024 |
| FR-ST-13 | F-ST-06 | Refer debt to collection provider; track status | S | EV-026 |
| FR-ST-14 | F-ST-06 | Payment plans and dispute holds suspend escalation | S | PROPOSED |
| FR-ST-15 | F-ST-07 | Double-entry trust ledger per scheme; journals; trial balance; period close | M | EV-043 |
| FR-ST-16 | F-ST-08 | Supplier invoices: capture, code, approve (staff & committee), pay in batches; budget remaining shown | M | EV-040, EV-042, EV-044 |
| FR-ST-17 | F-ST-08 | Single payment across multiple invoices/schemes for one supplier | S | EV-042 |
| FR-ST-18 | F-ST-09 | Quote requests, quote comparison, strata work orders | M | EV-053 |
| FR-ST-19 | F-ST-10 | Meetings (AGM/EGM/committee), agenda/minutes templates, online/onsite | M | EV-045 |
| FR-ST-20 | F-ST-10 | Motions with electronic voting, proxies, tally, results | M | EV-046 |
| FR-ST-21 | F-ST-10 | Inbound ballot result API | C | EV-046 |
| FR-ST-22 | F-ST-11 | Campaigns with dynamic audience filters, preview, test send, signatures | M | EV-047 |
| FR-ST-23 | F-ST-12 | Portal: financial summary, own ledger, pay, documents, contacts, requests | M | EV-034..038 |
| FR-ST-24 | F-ST-12 | Committee: scheme financials & invoice approvals in portal | M | EV-038, EV-040 |
| FR-ST-25 | F-ST-13 | Community & committee walls | S | EV-036 |
| FR-ST-26 | F-ST-14 | Insurance policies and compliance items with reminders | M | EV-054, EV-055 |
| FR-ST-27 | F-ST-15 | Aged debtors report per OBSERVED layout | M | EV-028 |
| FR-ST-28 | F-ST-15 | Scheduled report emailing | M | EV-027 |
| FR-ST-29 | F-ST-15 | Strata dashboard (cash, revenue, expenses, arrears, paid-in-full %) | M | EV-031, EV-059 |
| FR-ST-30 | F-ST-15 | Financial statements: trial balance, income & expenditure, balance sheet, levy register | S | EV-027 |

## FM (F-FM)
| ID | Feature | Requirement | Pri | Source |
|---|---|---|---|---|
| FR-FM-01 | F-FM-01 | Regions → properties → location tree; import | M | EV-093 |
| FR-FM-02 | F-FM-02 | Asset register with types, attributes, warranty, condition, photos, GPS | M | EV-072, EV-088, EV-091 |
| FR-FM-03 | F-FM-03 | 10-year lifecycle plan & CAPEX forecast | M | EV-072, EV-073 |
| FR-FM-04 | F-FM-04 | Maintenance plans (RRULE) against assets/locations; auto WO generation | M | EV-075, EV-076 |
| FR-FM-05 | F-FM-04 | 52-week planner (calendar + workload) | M | EV-075 |
| FR-FM-06 | F-FM-05 | Service requests from customer portal, staff entry, API | M | EV-083, EV-084 |
| FR-FM-07 | F-FM-05 | Triage queue: priority, category, asset, convert to WO | M | EV-085 |
| FR-FM-08 | F-FM-06 | Work order lifecycle, checklist, notes, evidence, costs | M | EV-085 |
| FR-FM-09 | F-FM-07 | SLA policies per client/priority with business calendars; at-risk/breach | M | EV-098 |
| FR-FM-10 | F-FM-08 | Technician mobile (PWA): job list, accept, check-in, checklist, photos, complete, offline queue | M | EV-081 |
| FR-FM-11 | F-FM-08 | Dispatch board with availability | S | EV-074 |
| FR-FM-12 | F-FM-09 | Supplier register, contractor users, compliance records, assignment gate | M | EV-077, EV-078 |
| FR-FM-13 | F-FM-10 | Client approvals for quotes/variations with NTE | M | EV-090 |
| FR-FM-14 | F-FM-11 | Compliance schedules (statutory checks) and inspections with checklists | M | EV-076 |
| FR-FM-15 | F-FM-12 | Ops Centre: open/overdue jobs, SLA status, supplier status | M | EV-071 |
| FR-FM-16 | F-FM-13 | Analytics: cost by property, supplier performance, asset failures | M | EV-079, EV-089 |
| FR-FM-17 | F-FM-14 | CRM contacts with history | S | EV-080 |

## AI (F-AI)
| ID | Feature | Requirement | Pri | Source |
|---|---|---|---|---|
| FR-AI-01 | F-AI-01 | Single AI gateway: auth, RBAC, tenant scoping, tool routing, audit, cost limits | M | EV-115 (governance) / PROPOSED |
| FR-AI-02 | F-AI-02 | Strata tools: scheme/lot/owner lookup, levy & arrears summary, meeting info, insurance | M | EV-110, EV-113 |
| FR-AI-03 | F-AI-03 | FM tools: WO status, SLA at-risk, asset history, supplier compliance | M | EV-079 |
| FR-AI-04 | F-AI-04 | RAG over permitted documents with citations | M | EV-114 |
| FR-AI-05 | F-AI-05 | Draft email replies; never auto-send | M | EV-113 |
| FR-AI-06 | F-AI-06 | Invoice field extraction with confidence & human confirm | S | EV-111 |
| FR-AI-07 | F-AI-01 | Customer data not used for model training (provider setting + contract) | M | EV-115 |

## Integrations (F-IN)
| ID | Feature | Requirement | Pri | Source |
|---|---|---|---|---|
| FR-IN-01 | F-IN-01 | Bank statement adapter (file + mock API) | M | EV-023, EV-051 |
| FR-IN-02 | F-IN-02 | Payment provider adapter (mock) with webhooks | M | EV-050 |
| FR-IN-03 | F-IN-03 | Debt collection referral adapter (mock) | S | EV-026 |
| FR-IN-04 | F-IN-04 | E-voting result inbound (mock) | C | EV-046 |
| FR-IN-05 | F-IN-05 | Resident-app inbound/outbound (generic) | M | EV-086, EV-087 |
| FR-IN-06 | F-IN-06 | Email (SMTP/Mailpit) & SMS (mock) | M | EV-022 |
| FR-IN-07 | F-IN-07 | OIDC IdP federation | M | EV-006 |
