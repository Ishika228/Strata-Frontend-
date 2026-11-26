# Evidence Register

This is the **compact evidence layer**. Every downstream document cites these IDs instead of re-reading sources.

**Classifications**
- **CONFIRMED** — Urbanise publicly states the capability (website, partner microsite, case study). Establishes *that* a capability is claimed, not *how* it is built.
- **OBSERVED** — Visible in a public product screenshot or sample output (W15, W16).
- **INFERRED** — Reasoned from evidence; not stated.
- **PROPOSED** — Independent POC design decision (Vertex). Not a claim about Urbanise.
- **UNKNOWN** — Public evidence does not establish it.
- **CONFLICT** — Sources disagree; see [CONFLICTING_INFORMATION.md](CONFLICTING_INFORMATION.md).

**Confidence**: H = stated on ≥2 sources or shown in output; M = one official source; L = marketing-only/roadmap/partner wording.

Cross-reference keys: Features `F-*` ([../02-requirements/FUNCTIONAL_REQUIREMENTS.md](../02-requirements/FUNCTIONAL_REQUIREMENTS.md)), Workflows `WF-*` ([../01-product/WORKFLOW_CATALOG.md](../01-product/WORKFLOW_CATALOG.md)), Screens `SCR-*` ([../08-ux/SCREEN_INVENTORY.md](../08-ux/SCREEN_INVENTORY.md)), API paths ([../07-api/API_CATALOG.md](../07-api/API_CATALOG.md)). API column always refers to the **proposed POC API** — actual Urbanise endpoints are UNKNOWN.

## A. Shared platform

| Evidence ID | Source | URL/File | Product | Module | Finding | Evidence Type | Classification | Confidence | Related Feature | Related Workflow | Related Entity | Related API | Related Screen | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EV-001 | W01,W02,W03 | urbanise.com | Both | Hosting | 100% cloud, hosted on AWS, browser access, no plugins | Website claim | CONFIRMED | H | F-SH-01 | — | — | — | — | AWS services/regions/topology UNKNOWN |
| EV-002 | W02,W06,W03 | urbanise.com | Both | Security | ISO 27001 certified | Website claim | CONFIRMED | H | F-SH-06 | — | — | — | — | Control set UNKNOWN |
| EV-003 | W02 | / | Both | Platform | Two purpose-built platforms: one strata, one FM | Website claim | CONFIRMED | H | all | — | Tenant | — | SCR-002 | Shared-vs-separate codebase UNKNOWN |
| EV-004 | W02 | / | Both | Scale | 18 countries; 600,000+ lots; 2.2M assets | Website claim | CONFIRMED | M | NFR | — | Lot, Asset | — | — | Used for POC perf targets (scaled) |
| EV-005 | W01,W10 | /urbanise-help-centre | Both | Support | In-platform WalkMe guides, live chat, ticketed service desk | Website claim | CONFIRMED | H | F-SH-11 | — | — | — | SCR-002 | POC: contextual help links only |
| EV-006 | W07 | /pplatform-updates | FM | Identity | SSO for Microsoft Azure AD (Mar 2024) | Release note | CONFIRMED | M | F-SH-02 | WF-02 | User | /auth/* | SCR-001 | Protocol (SAML/OIDC) UNKNOWN |
| EV-007 | W04,W08,W09 | strata-future-ready, FM, aged-care | Both | API | Open API / published APIs / "API Framework" | Website claim | CONFIRMED | H | F-SH-10 | WF-26 | — | all | — | Actual endpoints UNKNOWN |
| EV-008 | W05 | urbanisestrata.cloud/merloai | Strata | API | Two-way API: GET plan, lot, owner, committee, levies, arrears, financial summaries, insurance, compliance, suppliers; POST/PUT contacts, work orders, ballot outcomes, attachments | Partner claim | CONFIRMED | M | F-SH-10 | WF-23 | Scheme, Lot, Owner, Levy, Supplier, WorkOrder | /strata/* | — | Resource *scope* confirmed; paths/payloads UNKNOWN |
| EV-009 | W01,W03 | strata-campaign | Strata | Migration | Excel templates (unit list, owners, insurance policy, levy settings) loaded via "Super User tools"; opening balances loaded separately | Website claim | CONFIRMED | H | F-SH-09 | WF-01 | ImportJob | /imports | SCR-008 | Template columns UNKNOWN |
| EV-010 | W01 | strata-campaign | Strata | Commercial | Priced per lot with volume discounts | Website claim | CONFIRMED | M | — | — | Lot | — | — | Out of POC scope (no billing) |
| EV-011 | W02 vs W04 | /, strata-future-ready | Both | AI | "now AI capability" vs "Urbanise AI is coming" | Website claim | CONFLICT | L | F-AI-* | — | — | — | — | See C-01 |
| EV-012 | W03,W08 | feature pages | Both | Tasks | Tasks, notes and timeline; automation of repetitive tasks; follow-ups | Website claim | CONFIRMED | M | F-SH-08 | — | Task, Note | /tasks | SCR-009 | Rule engine design UNKNOWN |
| EV-013 | W09,W11 | aged-care, TVRG | FM | Audit | Complete digital audit trail from request to completion | Website claim | CONFIRMED | H | F-SH-06 | WF-17,WF-18 | AuditEvent | /audit-events | SCR-004 | Storage design UNKNOWN |
| EV-014 | W02 | / | Strata | Documents | "Document Management" module | Website claim | CONFIRMED | M | F-SH-04 | — | Document | /documents | SCR-005 | |
| EV-015 | — | — | Both | Tenancy | Multi-tenant SaaS serving many management companies | Inference from SaaS + per-lot pricing + 18 countries | INFERRED | M | F-SH-01 | WF-01 | Tenant | /tenants | — | Isolation model UNKNOWN |
| EV-016 | — | — | Both | Architecture | Database tech, services, queues, event bus, AI model, prompts, schema, auth implementation | No public source | UNKNOWN | — | — | — | — | — | — | Never inferred as fact; see UNKNOWN_INFORMATION U-01..U-12 |

## B. Strata

| Evidence ID | Source | URL/File | Product | Module | Finding | Evidence Type | Classification | Confidence | Related Feature | Related Workflow | Related Entity | Related API | Related Screen | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EV-020 | W01,W03 | strata-campaign | Strata | Levies | Budget and levies set up annually; levies driven from budget | Website claim | CONFIRMED | H | F-ST-02,F-ST-03 | WF-04 | Budget, LevySchedule | /strata/budgets | SCR-106 | Formula UNKNOWN → PROPOSED entitlement apportionment |
| EV-021 | W01 | strata-campaign | Strata | Levies | Automatic levy issuance by each scheme's frequency | Website claim | CONFIRMED | H | F-ST-03 | WF-05 | LevyRun, LevyNotice | /strata/levy-runs | SCR-107 | |
| EV-022 | W01 | strata-campaign | Strata | Comms | Owner communication via owner's preferred method | Website claim | CONFIRMED | M | F-SH-05 | WF-05 | ContactPreference | /notifications | — | Channels list UNKNOWN |
| EV-023 | W01 | strata-campaign | Strata | Banking | Automated contribution allocation via Macquarie Bank integration | Website claim | CONFIRMED | M | F-IN-01 | WF-06 | BankTransaction, Payment | /integrations/bank/* | SCR-108 | Interface format UNKNOWN; POC = mock |
| EV-024 | W01,W03 | strata-campaign | Strata | Arrears | Automated arrears notices per customer business rules; multiple arrears levels | Website claim | CONFIRMED | H | F-ST-06 | WF-08 | ArrearsCase, ArrearsPolicy | /strata/arrears | SCR-110 | Level thresholds UNKNOWN → configurable |
| EV-025 | W16 | Aged Debtors PDF | Strata | Arrears | "Debtor Level" column with values Nil / Level 1 | Sample output | OBSERVED | H | F-ST-06 | WF-08 | ArrearsCase.level | /strata/reports/aged-debtors | SCR-110 | Confirms per-debtor level field |
| EV-026 | W01,W04 | strata-campaign | Strata | Debt recovery | Collection proceedings initiated through LevyCollect (partner) | Website claim | CONFIRMED | H | F-IN-03 | WF-08 | DebtReferral | /strata/arrears/{id}/refer | SCR-110 | Interface UNKNOWN; POC = mock |
| EV-027 | W01 | strata-campaign | Strata | Reporting | Scheduled reports (monthly aged debtors, annual financial statements) emailed to clients | Website claim | CONFIRMED | H | F-ST-15 | WF-14 | ReportSchedule | /reports/schedules | SCR-118 | |
| EV-028 | W16 | Aged Debtors PDF | Strata | Reporting | Aged debtors layout: Building/Floor/Lot, Unit, Name, Type, Debtor Level, 1–30/31–60/61–90/91+ days from due date, Total; grouped Levy/Sundry; gross of GST; excludes unpresented transactions | Sample output | OBSERVED | H | F-ST-15 | WF-14 | LedgerEntry | /strata/reports/aged-debtors | SCR-118 | Template for POC report RPT-ST-01 |
| EV-029 | W16 | Aged Debtors PDF | Strata | Register | Scheme title format "Body Corporate for X CTS n" (QLD); lot label "Block/Floor/Lot" | Sample output | OBSERVED | H | F-ST-01 | WF-03 | Scheme, Building, Lot | /strata/schemes | SCR-102 | Jurisdiction-specific registration number |
| EV-030 | W16 | Aged Debtors PDF | Strata | Debtors | Debtor types include Levy and Sundry (non-levy charges, also non-owner debtors) | Sample output | OBSERVED | H | F-ST-07 | WF-05 | Charge.type | /strata/charges | SCR-104 | |
| EV-031 | W01,W03 | strata-campaign | Strata | Dashboard | Real-time dashboard: revenue, expenses, cash flow; forecast trends | Website claim | CONFIRMED | H | F-ST-15 | — | — | /strata/dashboard | SCR-101 | Forecast method UNKNOWN |
| EV-032 | W01,W03,W12 | strata-campaign | Strata | Portal | Community™ portal for owners, committee, managers; auto-created when a new plan is set up; live levy transactions | Website claim | CONFIRMED | H | F-ST-12 | WF-03,WF-13 | PortalAccess | /portal/* | SCR-151 | |
| EV-033 | W01,W03,W15 | app stores | Strata | Mobile | Community app free on iOS and Android | Website claim | CONFIRMED | H | F-ST-12 | WF-13 | — | /portal/* | SCR-151 | POC = responsive PWA |
| EV-034 | W15 | Community flyer | Strata | Portal | View & pay levies; OC financial status; budgets, income & expenditure; manager/committee contacts | Brochure claim | CONFIRMED | H | F-ST-12 | WF-13 | — | /portal/* | SCR-151,152,158 | |
| EV-035 | W15,W12 | Community flyer | Strata | Portal | Log and track service/maintenance requests | Brochure claim | CONFIRMED | H | F-ST-12 | WF-13 | ServiceRequest | /portal/service-requests | SCR-153 | |
| EV-036 | W15 | Community flyer | Strata | Portal | Community & Committee Wall (notice board, events, reminders) | Brochure claim | CONFIRMED | M | F-ST-13 | WF-13 | WallPost | /portal/wall | SCR-155 | |
| EV-037 | W15 | Community flyer | Strata | Documents | Owner documents: agendas & minutes, reports, by-laws, insurance policies | Brochure claim | CONFIRMED | H | F-SH-04 | WF-13 | Document | /portal/documents | SCR-154 | |
| EV-038 | W15 | Community flyer screenshot | Strata | Funds | Financial summary tiles: Admin Cash, Maintenance Cash, Bank Balance, Investment Funds, Community Arrears | Screenshot | OBSERVED | H | F-ST-02,F-ST-12 | — | Fund, BankAccount, Investment | /portal/summary | SCR-151 | Two-fund model (admin + maintenance/capital works) |
| EV-039 | W15 | Community flyer screenshot | Strata | Ledger | Levy Ledger with Penalty lines and running DR balance | Screenshot | OBSERVED | H | F-ST-06,F-ST-07 | WF-08 | LedgerEntry, Penalty | /portal/lots/{id}/ledger | SCR-152 | Penalty calc UNKNOWN → configurable |
| EV-040 | W15,W03 | Community flyer screenshot | Strata | Approvals | Committee invoice approval in app: Approve/Reject; contractor, invoice no., reference, dates, amount, category, budget remaining | Screenshot | OBSERVED | H | F-ST-08 | WF-09 | SupplierInvoice, Approval | /portal/approvals | SCR-156 | |
| EV-041 | W02 | / | Strata | Modules | Tiles: Ledger Accounting, Powerful Invoicing, Communication Tools, Procurement, Quick App, Extensive Reporting, Meeting Management, Document Management, Budgeting, Serious Security | Website claim | CONFIRMED | H | F-ST-* | — | — | — | — | "Quick App" meaning UNKNOWN |
| EV-042 | W03 | strata-management-software | Strata | Accounting | Electronic banking; quick transaction entry; automated bank reconciliations; bulk invoicing; online approvals; single payment across multiple accounts | Website claim | CONFIRMED | H | F-ST-05,F-ST-07,F-ST-08 | WF-07,WF-09 | Payment, BankTransaction, Reconciliation | /strata/reconciliations | SCR-109 | |
| EV-043 | W04 | strata-future-ready | Strata | Trust accounting | Trust accounting integrated within the platform | Website claim | CONFIRMED | M | F-ST-07 | WF-07 | TrustAccount, Journal | /strata/journals | SCR-120 | Rules per jurisdiction UNKNOWN |
| EV-044 | W12 | MelbOC | Strata | Accounting | Invoice processing module; budget management; account codes | Case study | CONFIRMED | M | F-ST-02,F-ST-08 | WF-04,WF-09 | GLAccount, SupplierInvoice | /strata/gl-accounts | SCR-111,SCR-106 | |
| EV-045 | W03,W12 | strata-management-software | Strata | Meetings | Meeting management powered by StrataVote: automated agenda & minutes from templates; online or onsite meetings; AGMs | Website claim | CONFIRMED | H | F-ST-10 | WF-11 | Meeting, Motion | /strata/meetings | SCR-115,116 | Voting is via partner → POC native |
| EV-046 | W05 | merloai | Strata | Voting | Digital voting; ballot outcomes and committee decisions writable via API | Partner claim | CONFIRMED | M | F-ST-10 | WF-11 | Ballot, Vote | /strata/motions/{id}/votes | SCR-157 | Voting rules UNKNOWN |
| EV-047 | W03,W14 | comms-module | Strata | Comms | Campaigns; dynamic recipient lists filtered by building, role, ownership type; preview; test sends; signatures; audiences owners, residents, service providers | Website claim | CONFIRMED | H | F-ST-11 | WF-12 | Campaign, Audience | /strata/campaigns | SCR-117 | Non-email channels UNKNOWN |
| EV-048 | W04,W05 | future-ready, merloai | Strata | Partners | Strategic partners: StrataVote, BING, LevyCollect, NAB, Merlo AI | Website claim | CONFIRMED | H | F-IN-* | — | — | — | — | BING scope UNKNOWN |
| EV-049 | W06 | nab-partnership | Strata | Banking | Term deposit integration available now (create TDs; import & reconcile interest/maturity) | Partner page | CONFIRMED | M | F-ST-07 | — | Investment | — | — | POC backlog BL-07 |
| EV-050 | W06 | nab-partnership | Strata | Payments | Branded levy notices with embedded pay-now links; auto-pay/recurring options; owners portal | Partner page | CONFIRMED | L | F-ST-04 | WF-05,WF-06 | Payment, PaymentLink | /portal/payments | SCR-152 | Rollout status UNKNOWN (C-04) |
| EV-051 | W06 | nab-partnership | Strata | Receivables | Payments auto-matched to owner & lot from daily statements + real-time updates | Partner page | CONFIRMED | L | F-ST-05 | WF-06,WF-07 | BankTransaction | /integrations/bank/statements | SCR-109 | Matching key (e.g. reference) UNKNOWN → PROPOSED |
| EV-052 | W06 | nab-partnership | Strata | Payables | Supplier payments made from within platform, no payment file upload; status visible | Partner page | CONFIRMED | L | F-ST-08 | WF-09 | PaymentBatch | /strata/payment-batches | SCR-111 | |
| EV-053 | W05,W02 | merloai, / | Strata | Procurement | Supplier & preferred contractor lists; quote requests & comparisons; work orders and status | Partner + website | CONFIRMED | M | F-ST-09 | WF-10 | Supplier, Quote, StrataWorkOrder | /strata/work-orders | SCR-114 | |
| EV-054 | W01,W05,W15 | various | Strata | Insurance | Insurance policies held per scheme; renewals tracked | Website + partner | CONFIRMED | H | F-ST-14 | WF-27 | InsurancePolicy | /strata/insurance-policies | SCR-119 | |
| EV-055 | W05 | merloai | Strata | Compliance | Compliance tracking incl. AFSS (annual fire safety statement, NSW) | Partner claim | CONFIRMED | L | F-ST-14 | WF-27 | ComplianceItem | /strata/compliance-items | SCR-119 | Performed by partner AI; native register INFERRED |
| EV-056 | W05 | merloai | Strata | Register | Ownership, contact and strata roll updates | Partner claim | CONFIRMED | M | F-ST-01 | WF-03 | Ownership, Contact | /strata/lots/{id}/ownerships | SCR-105 | |
| EV-057 | W03 | strata-management-software | Strata | Market | Positioned for Australian & NZ strata managers; terms: owners corporation, body corporate, levies, lots, plans | Website claim | CONFIRMED | H | glossary | — | — | — | — | |
| EV-058 | W04 | strata-future-ready | Strata | Platform | Pillars: Workflow Engine, Rules & Automation, Data Model, API Framework, Reporting & Analytics, Mobile & Portal, Security | Marketing claim | CONFIRMED (as claim) | L | arch | — | — | — | — | Internal implementation UNKNOWN |
| EV-059 | W12 | MelbOC | Strata | KPI | Paid-in-full rate tracked as a KPI (98% target) | Case study | CONFIRMED | M | F-ST-15 | — | — | /strata/dashboard | SCR-101 | KPI-ST-03 |
| EV-060 | W01 | strata-campaign | Strata | Funds | Investment accounts part of opening financial data | Website claim | CONFIRMED | M | F-ST-07 | WF-01 | Investment | — | — | |

## C. FM

| Evidence ID | Source | URL/File | Product | Module | Finding | Evidence Type | Classification | Confidence | Related Feature | Related Workflow | Related Entity | Related API | Related Screen | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EV-070 | W08 | FM page | FM | Platform | Facilities, assets and workforce management in one cloud platform | Website claim | CONFIRMED | H | F-FM-* | — | — | — | — | |
| EV-071 | W08,W09 | FM page | FM | Ops Centre | Visibility over current/outstanding jobs, SLAs, supply chain | Website claim | CONFIRMED | H | F-FM-12 | WF-19 | WorkOrder, SLA | /fm/ops-centre | SCR-201 | |
| EV-072 | W08,W09 | FM page | FM | Assets | Asset register; 10-year lifecycle modelling; industry benchmarks | Website claim | CONFIRMED | H | F-FM-02,F-FM-03 | WF-15,WF-22 | Asset, AssetPlan | /fm/assets | SCR-204,206 | Benchmark data source UNKNOWN |
| EV-073 | W09 | aged-care | FM | Assets | Compliant 10-year asset management plans; forecast lifecycles, plan maintenance & CAPEX | Website claim | CONFIRMED | H | F-FM-03 | WF-22 | AssetPlan | /fm/asset-plans | SCR-206 | |
| EV-074 | W08 | FM page | FM | Workforce | Shows where teams & suppliers are; availability; productivity | Website claim | CONFIRMED | M | F-FM-08 | WF-18 | Technician, Assignment | /fm/technicians | SCR-212 | Location tracking method UNKNOWN |
| EV-075 | W08 | FM page | FM | Scheduling | Planned work against assets or locations; 52-week planner workload forecast | Website claim | CONFIRMED | H | F-FM-04 | WF-16 | MaintenancePlan, Schedule | /fm/schedules | SCR-207,208 | |
| EV-076 | W11,W17 | case studies | FM | PPM | Preventive maintenance schedules; compliance schedules | Case study | CONFIRMED | H | F-FM-04,F-FM-11 | WF-16 | MaintenancePlan | /fm/maintenance-plans | SCR-207 | |
| EV-077 | W08,W09,W19 | FM page | FM | Suppliers | Supplier compliance: licences & insurance recorded and tracked; no manual follow-up | Website claim | CONFIRMED | H | F-FM-09 | WF-20 | ComplianceRecord | /suppliers/{id}/compliance | SCR-214 | |
| EV-078 | W19 | Story House | FM | Suppliers | Contractors must meet safeguarding compliance before attending site | Case study | CONFIRMED | M | F-FM-09 | WF-18,WF-20 | ComplianceRecord | /fm/work-orders/{id}/assign | SCR-212 | → BR-FM-07 assignment gate |
| EV-079 | W08,W09 | FM page | FM | Analytics | Costs, supplier performance, asset failures; "deep AI enabled analytics" | Website claim | CONFIRMED | M | F-FM-13 | — | — | /fm/analytics | SCR-216 | AI analytics content UNKNOWN |
| EV-080 | W08 | FM page | FM | CRM | Property owner, tenant, resident contacts with history of communications, jobs, purchases | Website claim | CONFIRMED | M | F-FM-14 | — | Contact | /fm/contacts | SCR-217 | |
| EV-081 | W08 | FM page | FM | Mobile | Workforce FM App: job details, view/prioritise tasks, update in real time, progress tracking | Website claim | CONFIRMED | H | F-FM-08 | WF-18 | WorkOrder | /fm/me/work-orders | SCR-251,252 | |
| EV-082 | W08 | FM page | FM | Mobile | Force App: supplier/contractor visibility, real-time tracking, comms | Website claim | CONFIRMED | M | F-FM-09 | WF-18 | Contractor | /fm/me/work-orders | SCR-254 | Relationship to Workforce App: C-05 |
| EV-083 | W08 | FM page | FM | Helpdesk | Building Service Delivery: online help desk; automatic customer updates via Community app | Website claim | CONFIRMED | M | F-FM-05 | WF-17 | ServiceRequest | /fm/service-requests | SCR-209,261 | |
| EV-084 | W09,W19,W17 | aged-care, Story House | FM | Portal | Customer portal: residents/families/service managers log & track requests, progress updates | Website + case study | CONFIRMED | H | F-FM-05 | WF-17 | ServiceRequest | /fm/portal/requests | SCR-261 | |
| EV-085 | W11 | TVRG | FM | Work orders | Requests triaged and assigned; work order management; completion timestamps & photos returned | Case study | CONFIRMED | H | F-FM-05,F-FM-06 | WF-17,WF-18 | WorkOrder, Evidence | /fm/work-orders | SCR-211 | |
| EV-086 | W11 | TVRG | FM | Integration | Conpago bidirectional integration: inbound requests, outbound status in real time, digital access consent | Case study | CONFIRMED | H | F-IN-05 | WF-26 | ExternalRef, Consent | /integrations/inbound/{provider} | — | Protocol UNKNOWN |
| EV-087 | W18 | Sodexo | FM | Integration | MyVillage resident app integrated for real-time interaction | Case study | CONFIRMED | M | F-IN-05 | WF-26 | ExternalRef | /integrations/inbound/{provider} | — | |
| EV-088 | W18 | Sodexo | FM | Assets | Technicians photograph & GPS-tag assets in mobile app | Case study | CONFIRMED | M | F-FM-02 | WF-15 | Asset.geo | /fm/assets | SCR-253 | |
| EV-089 | W18 | Sodexo | FM | BI | Embedded BI dashboards; client self-serve reporting on work, KPIs, compliance | Case study | CONFIRMED | M | F-FM-13 | — | — | /fm/analytics | SCR-216 | BI vendor UNKNOWN |
| EV-090 | W18 | Sodexo | FM | Approvals | Digital client approval workflow for variation works & cost approvals | Case study | CONFIRMED | M | F-FM-10 | WF-21 | ApprovalRequest | /fm/approvals | SCR-215 | |
| EV-091 | W07 | updates | FM | Assets | Asset warranty status visible when viewing assets and raising jobs | Release note | CONFIRMED | M | F-FM-02 | WF-17 | Asset.warrantyExpiry | /fm/assets/{id} | SCR-205,211 | |
| EV-092 | W07 | updates | FM | Notifications | Job assignee notifications for planned jobs | Release note | CONFIRMED | M | F-SH-05 | WF-16 | Notification | /notifications | SCR-006 | |
| EV-093 | W07 | updates | FM | Hierarchy | Regions import | Release note | CONFIRMED | M | F-FM-01 | WF-15 | Region | /imports | SCR-008 | Region = grouping above property (INFERRED) |
| EV-094 | W08 | FM page | FM | Commerce | Optional E-Services storefront; aged-care appointment booking | Website claim | CONFIRMED | M | — | — | — | — | — | Out of POC scope (BL-03) |
| EV-095 | W08 | FM page | FM | Market | Sectors: FM providers, health & aged care, NDIS, education, government, retail, utilities, property, infrastructure | Website claim | CONFIRMED | H | — | — | — | — | — | |
| EV-096 | W17 | Knight FM | FM | Outcome | 30% reduction in WO processing time; client portals; KPI reporting; ISO 55001 support | Case study | CONFIRMED | M | F-FM-06,F-FM-13 | — | — | — | — | Vendor-reported |
| EV-097 | W08 vs W11/W17/W18 | various | FM | Terminology | "Job" (FM page, updates) and "work order" (case studies) used interchangeably | Website | CONFLICT (terminology) | M | glossary | — | WorkOrder | — | — | C-06: POC uses "Work Order", UI alias "Job" |
| EV-098 | W08 | FM page | FM | SLA | SLAs tracked in Ops Centre | Website claim | CONFIRMED | M | F-FM-07 | WF-19 | SLAPolicy | /fm/sla-policies | SCR-213 | SLA targets & clock rules UNKNOWN |
| EV-099 | W11 | TVRG | FM | Integration | TVRG building central data store across platforms for capex planning (in progress) | Case study | CONFIRMED | L | F-SH-10 | — | — | — | — | Indicates data export need (BL-10) |

## D. AI

| Evidence ID | Source | URL/File | Product | Module | Finding | Evidence Type | Classification | Confidence | Related Feature | Related Workflow | Related Entity | Related API | Related Screen | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EV-110 | W04 | strata-future-ready | Strata | AI | Roadmap: AI Assistant answering portfolio/operational questions | Roadmap claim | CONFIRMED (announced) | L | F-AI-02 | WF-23 | AIConversation | /ai/conversations | SCR-301 | Not GA (C-01) |
| EV-111 | W04 | strata-future-ready | Strata | AI | Roadmap: invoice processing — upload, extract, allocate, progress automatically | Roadmap claim | CONFIRMED (announced) | L | F-AI-06 | WF-25 | AIExtraction | /ai/extractions | SCR-303 | |
| EV-112 | W04 | strata-future-ready | Strata | AI | Roadmap: AI-assisted onboarding reduces migration time | Roadmap claim | CONFIRMED (announced) | L | F-SH-09 | WF-01 | ImportJob | /imports | SCR-008 | POC backlog BL-11 |
| EV-113 | W05 | merloai | Strata | AI (partner) | Email assistant drafts owner/committee replies using live data in user's tone; human reviews & sends | Partner claim | CONFIRMED | M | F-AI-05 | WF-24 | AIDraft | /ai/drafts | SCR-302 | Human-in-the-loop pattern adopted |
| EV-114 | W05 | merloai | Strata | AI (partner) | Teams assistant gives source-backed answers on plan/owner/levy/ticket questions | Partner claim | CONFIRMED | M | F-AI-02,F-AI-04 | WF-23 | AICitation | /ai/messages | SCR-301 | Citations requirement adopted |
| EV-115 | W05 | merloai | Strata | AI governance | Operates within Urbanise AI governance framework; no customer data used to train models | Partner claim | CONFIRMED | M | F-AI-01 | — | — | — | — | Framework content UNKNOWN |
| EV-116 | W05 | merloai | Strata | AI (partner) | Configuration during implementation: templates, workflows, permissions per portfolio | Partner claim | CONFIRMED | M | F-AI-01 | — | AIPolicy | /ai/settings | SCR-304 | |
| EV-117 | W05,W03 | merloai | Strata | AI outcome | "Up to 30%" time saved per manager; 60% faster email response | Partner claim | CONFIRMED (claim) | L | — | — | — | — | — | Not a POC acceptance target |
| EV-118 | — | — | Both | AI | Production AI model, prompts, RAG design, vendor | No source | UNKNOWN | — | — | — | — | — | — | POC proposes its own (09-ai) |
