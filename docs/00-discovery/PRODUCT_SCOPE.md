# POC Product Scope

Product name (independent): **Vertex Strata** + **Vertex FM** on the **Vertex Platform**. No Urbanise branding, assets, or code are used.

## In scope (MVP POC)

| Area | Features | Evidence basis |
|---|---|---|
| Shared | F-SH-01 Tenancy · F-SH-02 Identity/SSO · F-SH-03 RBAC · F-SH-04 Documents · F-SH-05 Notifications · F-SH-06 Audit · F-SH-07 Search · F-SH-08 Tasks/notes/timeline · F-SH-09 Data import · F-SH-10 Public API & webhooks · F-SH-11 Contextual help | EV-001..015 |
| Strata | F-ST-01 Scheme register & strata roll · F-ST-02 Budgets & funds · F-ST-03 Levy schedules & runs · F-ST-04 Payments & pay-now · F-ST-05 Bank feed & reconciliation · F-ST-06 Arrears & debt recovery · F-ST-07 Trust ledger & GL · F-ST-08 Supplier invoices, approvals, payments · F-ST-09 Procurement (quotes, work orders) · F-ST-10 Meetings, motions, voting · F-ST-11 Comms campaigns · F-ST-12 Owner/committee portal · F-ST-13 Community wall · F-ST-14 Insurance & compliance register · F-ST-15 Reports & dashboard | EV-020..060 |
| FM | F-FM-01 Regions/properties/locations · F-FM-02 Asset register · F-FM-03 Lifecycle plans · F-FM-04 Planned maintenance · F-FM-05 Service requests & customer portal · F-FM-06 Work orders · F-FM-07 SLA · F-FM-08 Workforce & technician mobile · F-FM-09 Suppliers/contractors & compliance · F-FM-10 Client approvals · F-FM-11 Compliance schedules & inspections · F-FM-12 Ops Centre · F-FM-13 Analytics · F-FM-14 CRM contacts | EV-070..099 |
| AI | F-AI-01 Gateway · F-AI-02 Strata tools · F-AI-03 FM tools · F-AI-04 Document RAG + citations · F-AI-05 Email draft (human-in-loop) · F-AI-06 Invoice extraction | EV-110..118 |
| Integrations (mocked) | F-IN-01 Bank statements · F-IN-02 Payment provider · F-IN-03 Debt collection referral · F-IN-04 E-voting provider (inbound results) · F-IN-05 Resident app webhook · F-IN-06 Email/SMS · F-IN-07 SSO IdP | EV-023,026,046,050,086,087,006 |

## Out of scope (see [../15-build/FUTURE_BACKLOG.md](../15-build/FUTURE_BACKLOG.md))
Production banking/real money; legal-grade jurisdiction compliance; term deposits (EV-049); E-Services storefront & appointment booking (EV-094); native iOS/Android apps (PWA instead); billing/per-lot pricing (EV-010); full statutory financial statements (POC provides trial balance, I&E, balance sheet basic); GPS live tracking (POC records check-in coordinates only); AI onboarding (EV-112).

## Non-goals
Pixel-copying Urbanise UI; reproducing Urbanise endpoints or names of private services; using Urbanise trademarks ("Community™") in the product.

## Users
See [../01-product/PERSONAS.md](../01-product/PERSONAS.md): 13 roles across platform, tenant staff, owners/committee/occupiers, contractors and FM clients.
