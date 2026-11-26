# User Stories

Acceptance criteria are testable; test IDs map in [../14-traceability/TRACEABILITY_MATRIX.md](../14-traceability/TRACEABILITY_MATRIX.md).

| ID | As a | I want to | So that | Acceptance criteria | FR |
|---|---|---|---|---|---|
| US-01 | platform_admin | create a tenant with Strata and/or FM | a customer can start | Tenant created with products; admin invite sent; other tenants unaffected | FR-SH-01 |
| US-02 | tenant_admin | configure Entra ID SSO | staff use corporate login | Login via IdP succeeds; local password disabled for SSO domain | FR-SH-04 |
| US-03 | tenant_admin | assign roles scoped to schemes/properties | least privilege | User with scheme A role gets 403 on scheme B | FR-SH-05 |
| US-04 | platform_admin | import schemes/lots/owners from XLSX with dry-run | fast migration | Dry-run lists row errors; commit creates rows; re-commit idempotent | FR-SH-12 |
| US-05 | strata_manager | create a scheme with lots and entitlements | manage it | Scheme active; 2 funds; trust account; portal live | FR-ST-01/02/03 |
| US-06 | strata_manager | maintain the strata roll (ownership changes) | records are current | New ownership effective date; previous closed; roll report reflects | FR-ST-01 |
| US-07 | strata_accountant | enter and approve the annual budget | levies can be raised | Approved budget locks; schedule generated with correct per-lot amounts summing to fund totals | FR-ST-04/05 |
| US-08 | system | issue levy notices automatically | no manual effort | Run occurs at lead days; each lot one notice; PDF + email; rerun creates nothing | FR-ST-06 |
| US-09 | owner | pay a levy from the notice link | stay up to date | Payment success → ledger shows receipt within 5 s; receipt email | FR-ST-08 |
| US-10 | strata_accountant | import a bank statement and auto-match | reconciliation is fast | ≥ 95% of seeded lines auto-matched; remainder in unmatched queue | FR-ST-10 |
| US-11 | strata_accountant | reconcile and lock a period | trust records are final | Balanced rec locks; postings to locked period rejected | FR-ST-10/15 |
| US-12 | strata_manager | define an arrears policy with levels | follow-ups are automatic | Lot overdue 14 d → L1 notice; 35 d → L2; 60 d → L3 flag | FR-ST-11/12 |
| US-13 | strata_manager | refer a debtor to collections | recover debt | Referral sent to mock provider; status updates shown | FR-ST-13 |
| US-14 | strata_accountant | capture and code a supplier invoice | it can be paid | Duplicate blocked; coded to fund/account; approval created if > threshold | FR-ST-16 |
| US-15 | committee_member | approve or reject an invoice on my phone | spending is controlled | Sees amount, supplier, category, budget remaining; decision recorded & audited | FR-ST-24 |
| US-16 | strata_accountant | pay approved invoices in a batch | suppliers are paid | Batch only includes approved & compliant; ledger posts; status `paid` | FR-ST-16/17 |
| US-17 | strata_manager | request quotes and compare them | choose best value | ≥ 2 quotes enforced over threshold; accept creates WO | FR-ST-18 |
| US-18 | strata_manager | schedule an AGM with agenda from template | meetings are efficient | Notice issued to owners; agenda PDF stored | FR-ST-19 |
| US-19 | owner | vote electronically on motions | participate remotely | One vote per lot; can't vote twice; result tallied at close | FR-ST-20 |
| US-20 | strata_manager | publish minutes with results | owners are informed | Minutes doc generated from template & visible in portal | FR-ST-19 |
| US-21 | strata_manager | send a campaign to owners of building A | targeted comms | Audience preview count correct; test send; delivery log | FR-ST-22 |
| US-22 | owner | see my balance, ledger, documents and contacts | self-service | Only own lots visible; ledger live | FR-ST-23 |
| US-23 | committee_member | see scheme fund balances and arrears | govern finances | Tiles: admin cash, capital works cash, bank, investments, arrears | FR-ST-24 |
| US-24 | owner | log a maintenance request with photos | issue gets fixed | Request tracked with status updates | FR-ST-23 |
| US-25 | strata_manager | track insurance renewals | cover never lapses | Renewal task at 60 days | FR-ST-26 |
| US-26 | strata_manager | email aged debtors monthly to the committee | transparency | Schedule runs; PDF matches layout RPT-ST-01 | FR-ST-27/28 |
| US-27 | fm_manager | build a location tree and asset register | know what we maintain | Assets with warranty, condition, photo, GPS | FR-FM-01/02 |
| US-28 | fm_manager | produce a 10-year CAPEX plan | budget renewals | Plan lines per year; totals by property | FR-FM-03 |
| US-29 | fm_manager | define PPM plans on assets | compliance & reliability | WOs auto-created at lead days; planner shows 52 weeks | FR-FM-04/05 |
| US-30 | fm_client | raise and track a request in the portal | issues are resolved | Request visible with status timeline | FR-FM-06 |
| US-31 | fm_coordinator | triage requests into work orders | correct priority & SLA | Priority sets SLA due times; warranty flag shown | FR-FM-07 |
| US-32 | fm_coordinator | assign to technician or contractor | work gets done | Non-compliant contractor cannot be assigned | FR-FM-12 |
| US-33 | technician | execute a job on mobile incl. offline | update in real time | Accept, check-in, checklist, photo, complete; offline queue syncs | FR-FM-10 |
| US-34 | fm_manager | monitor SLAs in Ops Centre | prevent breaches | At-risk & breached lists; alerts | FR-FM-09/15 |
| US-35 | contractor | upload my insurance & licences | stay eligible | Verified records → compliant status; reminders before expiry | FR-FM-12 |
| US-36 | fm_client | approve a variation | control cost | WO resumes on approval; blocked otherwise | FR-FM-13 |
| US-37 | fm_manager | schedule statutory inspections with checklists | compliance | Inspection results recorded; failed items spawn WOs | FR-FM-14 |
| US-38 | fm_manager | analyse cost and supplier performance | decisions | Charts by property/supplier; drilldown | FR-FM-16 |
| US-39 | strata_manager | ask the assistant "Which lots in SP 1234 are at arrears level 2?" | save time | Correct list with citations to ledger; no cross-tenant data | FR-AI-02 |
| US-40 | fm_manager | ask "Which WOs will breach SLA today?" | act early | Correct list with links | FR-AI-03 |
| US-41 | strata_manager | ask about by-laws and get cited answers | accurate advice | Answer cites document & page; refuses when doc not permitted | FR-AI-04 |
| US-42 | strata_manager | get a drafted reply to an owner email | respond faster | Draft uses only that owner's data; must be sent manually | FR-AI-05 |
| US-43 | strata_accountant | extract invoice fields with AI | less typing | Fields prefilled with confidence; requires confirm | FR-AI-06 |
| US-44 | integration client | post resident requests and receive status webhooks | stay in sync | Idempotent create; signed webhooks with retries | FR-IN-05 |
| US-46 | staff user | search across schemes, lots, contacts, assets, WOs and documents | find things fast | Only in-scope results; other-tenant names never returned | FR-SH-10 |
| US-47 | owner | post on and read my building's community wall | stay connected | Post visible to scheme members; reported posts auto-hidden after 3 reports | FR-ST-25 |
| US-48 | fm_coordinator | see a contact's history of requests, WOs and comms | serve them with context | History tab lists all linked items in date order | FR-FM-17 |
| US-49 | e-voting provider (integration) | post ballot results for a motion | results are recorded | Idempotent by provider ballot id; motion result stored | FR-ST-21, FR-IN-04 |
| US-45 | auditor | view the audit trail for a work order or invoice | verify process | Complete ordered events; tamper-evident | FR-SH-09 |
