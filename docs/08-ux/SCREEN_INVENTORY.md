# Screen Inventory

Evidence basis for UI: only W15 (Community app screenshots) and W16 (report output) are OBSERVED. All other layouts are **POC Design (PROPOSED)** — no Urbanise staff UI is publicly visible, so staff screens are UNKNOWN. States key: L loading · E empty · Er error · P partial/permission · S success (see [UX_STATES.md](UX_STATES.md)).

## Shared
| Screen | Purpose | Actor | Navigation | Data | Actions | Filters | Forms | Validation | Permissions | API | States | Notifications | Evidence | Unknowns | POC Design |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-001 Login | Sign in / SSO | all | entry | — | sign in, SSO, forgot pw | — | credentials, OTP | lockout | public | Keycloak | L,Er | new-device email | EV-006 | Urbanise login UX | Keycloak themed page |
| SCR-002 Home / tenant switch | Landing per role | staff | top bar | tasks, notifications, shortcuts | switch tenant | — | — | — | authenticated | /me, /tasks | L,E | in-app | EV-003 | — | Role-based home cards |
| SCR-003 Users & roles | Manage users | tenant_admin | Settings | users, assignments | invite, assign, revoke | role, scope | invite form | email unique | platform.user.manage | /users | L,E,Er | invite email | INFERRED | — | Table + side drawer |
| SCR-004 Audit log | Trace changes | admin, auditor | entity tab / Settings | events | export CSV | entity, actor, date | — | — | platform.audit.read | /audit-events | L,E | — | EV-013 | — | Timeline + diff viewer |
| SCR-005 Documents | Library | staff | entity tab / menu | docs | upload, tag, set visibility, preview | kind, entity, date | upload | type/size | document.* | /documents | L,E,Er(scan) | — | EV-014 | — | Grid/list toggle |
| SCR-006 Notification centre | Alerts | all | bell | notifications | mark read | unread | — | — | own | /notifications | E | — | EV-092 | — | Popover |
| SCR-007 Global search | Find anything | staff | ⌘K | results | open | type | — | min 2 chars | scoped | /search | L,E | — | — | — | Command palette |
| SCR-008 Data import | Migrate data | platform/tenant admin | Settings › Import | jobs | upload, validate, commit, rollback | type | template pick | template | platform.import.run | /imports | L,Er,S | summary email | EV-009 | template columns | Stepper with error grid |
| SCR-009 Tasks | My work | staff | sidebar | tasks | complete, reassign | due, entity | task form | due ≥ now | task.manage | /tasks | E | assignment | EV-012 | automation | Kanban/list |

## Strata (staff)
| Screen | Purpose | Actor | Navigation | Data | Actions | Filters | Forms | Validation | Permissions | API | States | Notifications | Evidence | Unknowns | POC Design |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-101 Strata dashboard | Portfolio health | s_mgr, s_acct | Strata › Dashboard | cash, revenue, expenses, arrears, paid-in-full %, pending approvals | drill | scheme, period | — | — | strata.report.run | /strata/dashboard | L,E | — | EV-031, EV-059 | forecast | KPI tiles + charts |
| SCR-102 Schemes list | Find scheme | s_mgr | Strata › Schemes | schemes | create | q, status | — | — | strata.scheme.read | /strata/schemes | L,E | — | EV-029 | — | Table |
| SCR-103 Scheme detail | 360° scheme | s_mgr | list → tabs | overview, lots, contacts, funds, budget, docs, meetings, insurance, tasks, timeline | edit, quick actions | — | scheme form | SchemeCreate | strata.scheme.* | /strata/schemes/{id} | L,P | — | EV-029 | — | Tabbed page |
| SCR-104 Lot detail & ledger | Lot balance | s_mgr, s_acct | scheme › lot | owners, ledger, arrears, docs | add charge, receipt, statement PDF | date | sundry form | amount>0 | strata.ledger.read | /strata/lots/{id}/ledger | L,E | — | EV-039 | — | Ledger table w/ running balance |
| SCR-105 Strata roll & contacts | Owners register | s_mgr | scheme › contacts | ownerships, occupancies | transfer ownership, add occupier | current/history | ownership form | dates | strata.contact.manage | /strata/lots/{id}/ownerships | L | portal invite | EV-056 | — | Table + transfer wizard |
| SCR-106 Budget editor | Annual budget | s_acct | scheme › budget | lines by fund/account, prior year actuals | edit, propose, approve, levy preview | FY | grid editing | amounts ≥0 | strata.budget.* | /strata/budgets | L,Er | committee notified | EV-020, EV-044 | — | Spreadsheet-like grid |
| SCR-107 Levy schedule & runs | Issue levies | s_acct | Strata › Levies | schedule, runs, notices | run now, view notice | scheme, period | — | duplicate run | strata.levy.issue | /strata/schemes/{id}/levy-runs | L,S | run summary | EV-021 | notice layout | Calendar + run log |
| SCR-108 Receipts | Payments in | s_acct | Strata › Receipts | payments | quick receipt, refund | scheme, date, status | receipt form | amount, lot | strata.payment.create | /strata/payments | L,E | receipt email | EV-042 | — | Fast-entry form (keyboard) |
| SCR-109 Bank reconciliation | Reconcile | s_acct | Strata › Banking | statement lines, suggestions, rec summary | import, match, exclude, lock | status | upload | format | strata.bank.reconcile | /strata/bank-* | L,Er | unmatched task | EV-042, EV-051 | match algorithm | Two-pane matcher |
| SCR-110 Arrears console | Debt recovery | s_mgr | Strata › Arrears | cases, buckets, levels | hold, release, refer, payment plan, call log | scheme, level | referral form | eligibility | strata.arrears.* | /strata/arrears | L,E | notices | EV-024..026 | thresholds | Table grouped by level |
| SCR-111 Supplier invoices inbox | AP processing | s_acct | Strata › Invoices | invoices by status | upload, AI extract, code, submit, batch | status, scheme, supplier | coding form | duplicate, GST | strata.invoice.code | /strata/supplier-invoices | L,E | approver notified | EV-044, EV-111 | — | Inbox + PDF side-by-side |
| SCR-112 Invoice detail / approval | Approve | s_mgr, s_acct | inbox → detail | invoice, PDF, budget remaining, history | approve, reject, hold | — | comment | limit | strata.invoice.approve | /approvals/{id}/decision | L,Er | requester | EV-040 | approval chain | Detail with sticky decision bar |
| SCR-113 Suppliers | Register | staff | Common › Suppliers | suppliers, compliance | add, verify compliance, bank details | trade, status | supplier form | ABN, bank (MFA) | supplier.* | /suppliers | L,E | expiry reminders | EV-053, EV-077 | — | Table + compliance badges |
| SCR-114 Quotes & work orders | Procurement | s_mgr | Strata › Works | QRs, quotes, WOs | invite, compare, accept, issue, escalate to FM | scheme, status | QR form | ≥2 quotes | strata.workorder.manage | /strata/quote-requests | L,E | supplier invite | EV-053 | — | Comparison table |
| SCR-115 Meetings list | Meetings | s_mgr | Strata › Meetings | meetings | create | scheme, type, date | — | — | strata.meeting.manage | /strata/meetings | E | — | EV-045 | — | Calendar/list |
| SCR-116 Meeting detail | Run meeting | s_mgr | list → detail | motions, attendance, proxies, tally | issue notice, open, close, minutes | — | motion form | notice period | strata.meeting.manage | /strata/meetings/{id} | L,P | notices | EV-045, EV-046 | statutory rules | Stepper lifecycle |
| SCR-117 Comms campaigns | Bulk comms | s_mgr | Strata › Comms | campaigns, delivery | build audience, preview, test, send | status | campaign editor | test send | strata.campaign.send | /strata/campaigns | L,E,S | delivery | EV-047 | channels | Editor + live audience count |
| SCR-118 Reports | Reporting | s_mgr, s_acct | Strata › Reports | report list, schedules | run, export, schedule | scheme, as-at | schedule form | cron, recipients | strata.report.run | /strata/reports | L | scheduled email | EV-027, EV-028 | other layouts | Catalog + viewer |
| SCR-119 Insurance & compliance | Cover & obligations | s_mgr | scheme tab | policies, items | add, renew | expiring | policy form | dates | strata.insurance.manage | /strata/schemes/{id}/insurance-policies | E | renewal | EV-054, EV-055 | — | Table w/ expiry chips |
| SCR-120 GL & journals | Accounting | s_acct, auditor | Strata › Ledger | trial balance, journals, periods | journal, reverse, close period | scheme, period | journal form | balanced | strata.journal.post | /strata/journals | L,Er | — | EV-043 | statutory | Accountant view |

## Owner portal (PWA)
| Screen | Purpose | Actor | Navigation | Data | Actions | Filters | Forms | Validation | Permissions | API | States | Notifications | Evidence | Unknowns | POC Design |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-151 Portal home | Overview | owner, committee | bottom tab Home | balance, next due; committee: fund tiles | pay, view | scheme switch | — | — | portal | /portal/me, /portal/schemes/{id}/summary | L,E | push/email | OBSERVED EV-038 | — | Tiles as observed |
| SCR-152 Levy ledger & pay | Pay levies | owner | Home → Ledger | ledger lines incl. penalties | pay selected | period | payment | charges own | owner (own) | /portal/lots/{id}/ledger, /portal/payments/intent | L,Er,S | receipt | OBSERVED EV-039, EV-050 | rails | Ledger list + pay CTA |
| SCR-153 Service requests | Report issue | owner, occupier, committee | tab Requests | requests | create, comment | status | request form | photos ≤5 | portal | /portal/service-requests | E,S | status updates | EV-035 | — | Card list + form |
| SCR-154 Documents | Scheme docs | portal users | tab Docs | docs by kind | open/download | kind | — | — | ACL | /portal/documents | E | new doc | OBSERVED EV-037 | — | Grouped list |
| SCR-155 Walls | Community | portal users | tab Community | posts | post, report; mgr pin/hide | wall | post | ≤4000 chars | strata.wall.post | /portal/walls | E | mentions | EV-036 | moderation | Feed |
| SCR-156 Invoice approvals | Committee approval | committee approver | Home badge | invoice fields, budget remaining, PDF | approve, reject | — | comment | — | strata.invoice.approve | /portal/approvals | E,S | push | OBSERVED EV-040 | — | Card with Approve/Reject |
| SCR-157 Meetings & vote | Vote | owner | tab Meetings | motions, docs | vote, appoint proxy | — | ballot | eligibility | strata.vote.cast | /strata/motions/{id}/votes | P(ineligible),S | notice | EV-046 | rules | Ballot cards |
| SCR-158 Contacts & profile | Contacts & prefs | portal users | tab More | manager, committee; prefs | update prefs | — | prefs | — | own | /portal/contacts, /portal/preferences | — | — | EV-034, EV-022 | — | Simple list |

## FM (staff)
| Screen | Purpose | Actor | Navigation | Data | Actions | Filters | Forms | Validation | Permissions | API | States | Notifications | Evidence | Unknowns | POC Design |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-201 Ops Centre | Live operations | fm_mgr, fm_coord | FM › Ops Centre | WIDGETS (OPS_CENTRE) | drill, assign | region, property, client, trade | — | — | fm.workorder.read | /fm/ops-centre | L,E | SLA alerts | EV-071 | — | Dashboard grid, 60 s refresh |
| SCR-202 Properties | Sites | fm_mgr | FM › Properties | regions, properties | create, import | region, client | property form | code unique | fm.property.manage | /fm/properties | E | — | EV-093 | — | Table/map |
| SCR-203 Location tree | Spaces | fm_mgr | property tab | tree | add, move | — | location form | parent same property | fm.property.manage | /fm/locations | E | — | EV-075 | — | Tree view |
| SCR-204 Asset register | Assets | fm_mgr, coord | FM › Assets | assets | create, import, QR print | property, type, warranty, condition | — | — | fm.asset.read | /fm/assets | L,E | — | EV-072 | — | Table + filters |
| SCR-205 Asset detail | Asset 360 | fm staff | register → detail | attributes, warranty, photos, WOs, plans, docs | edit, raise WO | — | asset form | AssetCreate | fm.asset.* | /fm/assets/{id} | L | — | EV-072, EV-091 | — | Tabs + warranty badge |
| SCR-206 Lifecycle plan | 10-yr CAPEX | fm_mgr | FM › Planning | plan lines by year | generate, adjust, publish, export | property, category | plan params | escalation 0–15% | fm.assetplan.manage | /fm/asset-plans | L,E | — | EV-073 | method | Year × property matrix + chart |
| SCR-207 PPM plans | Planned maintenance | fm_mgr, coord | FM › PPM | plans | create, pause | property, trade, statutory | plan form (RRULE builder) | RRULE | fm.maintenanceplan.manage | /fm/maintenance-plans | E | — | EV-075, EV-076 | — | Form w/ recurrence builder |
| SCR-208 52-week planner | Forecast | fm_mgr, coord | FM › Planner | weekly occurrences, workload | open WO, reschedule | property, trade | — | — | fm.workorder.read | /fm/planner | L | — | EV-075 | — | Heatmap grid 52 cols |
| SCR-209 Triage queue | Helpdesk | fm_coord | FM › Requests | new requests | triage, convert, reject, duplicate | source, property | triage form | priority required | fm.request.triage | /fm/service-requests | E | ack to requester | EV-083, EV-085 | — | Split list/detail |
| SCR-210 Work orders | All WOs | fm staff | FM › Work orders | WOs | create, bulk assign | status, priority, SLA, property | — | — | fm.workorder.read | /fm/work-orders | L,E | — | EV-085 | — | Table, saved views |
| SCR-211 WO detail | Manage WO | fm staff | list → detail | timeline, assignment, checklist, evidence, costs, approvals, SLA | transition, assign, request approval | — | various | guards | fm.workorder.* | /fm/work-orders/{id} | L,Er(409) | assignee/requester | EV-085, EV-091 | — | Header w/ SLA clock, tabs |
| SCR-212 Dispatch board | Assign work | fm_coord | FM › Dispatch | technicians × day, unassigned | drag-assign | region, trade | — | compliance gate | fm.workorder.assign | /fm/dispatch-board | L | assignee notif | EV-074, EV-078 | GPS tracking | Resource timeline |
| SCR-213 SLA policies & calendars | SLA setup | fm_mgr | Settings › SLA | policies | create/edit | — | targets grid | minutes > 0 | fm.sla.manage | /fm/sla-policies | E | — | EV-098 | definitions | Matrix editor |
| SCR-214 Supplier compliance | Contractor compliance | fm_mgr | Common › Suppliers | records | verify, reject | status, expiring | — | — | supplier.compliance.verify | /suppliers/{id}/compliance-records | E | reminders | EV-077 | types | Review queue |
| SCR-215 Approvals | Client/internal approvals | fm_mgr, fm_client | Approvals | pending | approve/reject | type | comment | limit | fm.approval.decide | /approvals | E,S | requester | EV-090 | — | Inbox |
| SCR-216 FM analytics | Insights | fm_mgr, fm_client | FM › Analytics | costs, supplier perf, failures, SLA | export | period, property, supplier | — | — | fm.analytics.read | /fm/analytics | L,E | — | EV-079, EV-089 | BI | Charts + drill table |
| SCR-217 CRM contacts | Contacts | fm staff | FM › Contacts | contacts & history | create, link | role | contact form | email | fm.workorder.read | /contacts | E | — | EV-080 | — | Table + history |

## Mobile & external portals (PWA)
| Screen | Purpose | Actor | Navigation | Data | Actions | Filters | Forms | Validation | Permissions | API | States | Notifications | Evidence | Unknowns | POC Design |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-251 Tech job list | Today's work | technician, contractor | app home | assigned WOs | accept/decline, navigate | today/upcoming | — | — | own | /fm/me/work-orders | E, offline | new assignment push | EV-081 | — | List sorted by schedule; offline badge |
| SCR-252 Job execution | Do the job | technician, contractor | list → job | WO, asset, checklist, history | check-in, checklist, photos, time, complete, hold | — | completion form | evidence rule | fm.workorder.execute | /fm/work-orders/{id}/transitions, /fm/me/sync | offline queue, Er(409) | — | EV-081, EV-085 | — | Big-button flow |
| SCR-253 Asset capture | Field asset audit | technician | app menu | location, asset type | create asset w/ photo+GPS | — | asset form | GPS accuracy | fm.asset.manage | /fm/assets | offline | — | EV-088 | — | Camera-first form |
| SCR-254 Contractor portal | Supplier self-service | contractor | app | jobs, quotes, invoices, compliance | submit quote/invoice, upload compliance | — | forms | — | contractor scope | /fm/me/*, /suppliers/{id}/compliance-records | E | expiry | EV-082 | app split | Tabs |
| SCR-261 FM customer portal | Raise & track | fm_client | /fm-portal | requests, approvals, reports | raise, comment, approve | status | request form | photos | fm.request.create | /fm/portal/requests | E,S | status | EV-084 | — | Branded portal |

## AI
| Screen | Purpose | Actor | Navigation | Data | Actions | Filters | Forms | Validation | Permissions | API | States | Notifications | Evidence | Unknowns | POC Design |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-301 Assistant panel | Ask questions | staff | right drawer (⌘J) | messages, citations, proposals | ask, confirm/discard action | context chip | prompt | ≤4000 | ai.assistant.use | /ai/conversations | streaming, Er(503), budget | — | EV-110, EV-114 | model | Chat w/ citation chips |
| SCR-302 Draft reply review | Email drafts | s_mgr | inbox / assistant | source email, draft | edit, send, discard | — | editor | — | ai.draft.create | /ai/drafts | L | — | EV-113 | — | Split editor |
| SCR-303 Invoice extraction review | Confirm fields | s_acct | invoice detail | fields + confidence + PDF highlights | accept/edit fields | — | coding | confidence | strata.invoice.code | /ai/extractions | L,Er | — | EV-111 | — | Low-confidence highlighted |
| SCR-304 AI settings & usage | Govern AI | tenant_admin | Settings › AI | enabled features, budget, usage, eval | toggle, set budget | month | settings | budget ≥0 | ai.settings.manage | /ai/settings, /ai/usage | — | budget alerts | EV-115, EV-116 | — | Settings page |

Total screens: **63**.
