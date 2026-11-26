# FM Capability Matrix

| Capability | Confirmed | Observed | Inferred | POC proposal | Unknown | Evidence | POC Feature |
|---|---|---|---|---|---|---|---|
| Facilities management | ✔ | | | Vertex FM module | | EV-070 | F-FM-* |
| Properties | ✔ (sites, villages, camps, services) | | | Property | Fields | EV-070, W11, W18, W19 | F-FM-01 |
| Regions | ✔ (import) | | grouping above property | Region | | EV-093 | F-FM-01 |
| Locations | ✔ (planned work vs locations) | | hierarchy | Location tree | Depth | EV-075 | F-FM-01 |
| Assets / register | ✔ | | | Asset + AssetType | Attribute set | EV-072 | F-FM-02 |
| Asset photos & GPS | ✔ | | | Evidence & geo fields | | EV-088 | F-FM-02 |
| Warranty | ✔ | | | warranty_expiry + flag | | EV-091 | F-FM-02 |
| Asset plans (10-yr) | ✔ | | | AssetPlan lines | Method, benchmarks | EV-072, EV-073 | F-FM-03 |
| Lifecycle planning / CAPEX | ✔ | | | Formula ASSET_LIFECYCLE | | EV-073 | F-FM-03 |
| Maintenance (general) | ✔ | | | | | EV-070 | F-FM-04/06 |
| Preventive maintenance | ✔ | | | MaintenancePlan RRULE | | EV-076 | F-FM-04 |
| 52-week planner | ✔ | | | Planner view | | EV-075 | F-FM-04 |
| Reactive maintenance | ✔ (requests → WOs) | | | WO type reactive | | EV-085 | F-FM-06 |
| Work orders | ✔ | | | WO lifecycle | States | EV-085, EV-096 | F-FM-06 |
| Service requests | ✔ | | | ServiceRequest + triage | | EV-083, EV-084 | F-FM-05 |
| Help desk | ✔ (Building Service Delivery) | | | Triage queue | | EV-083 | F-FM-05 |
| Workforce | ✔ | | | Technician, availability | Location tracking | EV-074 | F-FM-08 |
| Technicians mobile | ✔ | | | PWA | | EV-081 | F-FM-08 |
| Assignments | ✔ (triage & assignment) | | | Assignment entity | | EV-085 | F-FM-06 |
| Priority | | | ✔ (SLA implies) | P1–P4 | Scale | EV-098 | F-FM-07 |
| SLA | ✔ | | | SLA policies + calendars | Definitions | EV-071, EV-098 | F-FM-07 |
| Suppliers / contractors | ✔ | | | Shared Supplier | | EV-077, EV-082 | F-FM-09 |
| Compliance (supplier) | ✔ | | | ComplianceRecord + gate | Types | EV-077, EV-078 | F-FM-09 |
| Compliance schedules | ✔ | | | Plans flagged statutory | | EV-076 | F-FM-11 |
| Inspections | | | ✔ (compliance schedules, audit) | Inspection + checklist | | EV-076 | F-FM-11 |
| Evidence (photos, timestamps) | ✔ | | | WorkOrderEvidence | | EV-085 | F-FM-06 |
| Documents | ✔ (audit trail) | | | Document service | | EV-013 | F-SH-04 |
| Client approvals | ✔ | | | ApprovalRequest + NTE | | EV-090 | F-FM-10 |
| Reporting / analytics | ✔ | | | SQL views + charts | BI stack | EV-079, EV-089 | F-FM-13 |
| Ops centre | ✔ | | | Ops Centre dashboard | | EV-071 | F-FM-12 |
| CRM | ✔ | | | Contacts + history | | EV-080 | F-FM-14 |
| Customer portal | ✔ | | | /fm-portal | | EV-084 | F-FM-05 |
| Integrations | ✔ (Conpago, MyVillage, open API) | | | Generic resident-app adapter | Protocol | EV-086, EV-087 | F-IN-05 |
| AI | ✔ claim ("deep AI") | | | FM tools in AI gateway | Content | EV-079 | F-AI-03 |
| SSO | ✔ | | | OIDC | Protocol | EV-006 | F-SH-02 |
| E-Services / bookings | ✔ | | | Out of scope | | EV-094 | BL-03 |
