# Functional Tests

| ID | FR | Scenario | Expected |
|---|---|---|---|
| FT-SH-01 | FR-SH-01 | Create tenant with products [strata] | FM menus hidden; FM API 403 `PRODUCT_NOT_LICENSED` |
| FT-SH-02 | FR-SH-03 | Staff login without MFA enrolled | Forced enrolment |
| FT-SH-03 | FR-SH-04 | SSO login via test IdP | Session in correct tenant; local password disabled for domain |
| FT-SH-04 | FR-SH-05 | Assign strata_manager scoped to scheme A | Access A only |
| FT-SH-05 | FR-SH-06 | Upload PDF, scan clean, link to scheme, owner visibility | Owner sees in portal |
| FT-SH-06 | FR-SH-07 | Contact prefers SMS | Levy notice via SMS mock + portal |
| FT-SH-07 | FR-SH-09 | Change WO status | Audit event with before/after; hash chain valid |
| FT-SH-08 | FR-SH-10 | Search "Harbour" | Scheme + docs in scope only |
| FT-SH-09 | FR-SH-11 | Arrears L2 reached | Rule creates call task for manager |
| FT-SH-10 | FR-SH-12 | Import lots with 2 bad rows | Dry-run lists rows; commit blocked until fixed; commit idempotent |
| FT-SH-11 | FR-SH-13 | Create API client & webhook | Token works with scopes; ping delivered |
| FT-ST-01 | FR-ST-01 | Create scheme + 4 lots + owners | Funds, chart, trust account, portal created (FR-ST-02/03) |
| FT-ST-02 | FR-ST-01 | Transfer ownership | Old ownership ends; roll updated; new owner invited |
| FT-ST-03 | FR-ST-04/05 | Approve budget $10,000 admin, quarterly, ent. 10/20/30/40 | Items 25,000/50,000/75,000/100,000 c per quarter |
| FT-ST-04 | FR-ST-05 | Budget $1,000.01 with 3 lots equal ent. quarterly | Σ items = 100,001 c exactly; remainder rules applied |
| FT-ST-05 | FR-ST-06 | Clock = due − 30 d | Run creates notices; PDF; email; rerun no-op |
| FT-ST-06 | FR-ST-07 | Sundry charge to non-owner debtor | Appears in aged debtors "Sundry" group |
| FT-ST-07 | FR-ST-08 | Owner pays 2 charges via pay link | Allocation oldest-first; ledger; receipt |
| FT-ST-08 | FR-ST-08 | Overpay $50 | Credit; auto-applied to next levy |
| FT-ST-09 | FR-ST-09 | Manual receipt with CRN | Allocated to lot |
| FT-ST-10 | FR-ST-10 | Import statement 20 lines | ≥ 18 auto-matched; 1 suggested; 1 unmatched |
| FT-ST-11 | FR-ST-10 | Reconcile difference 0 → lock | Locked; posting to month rejected after period close |
| FT-ST-12 | FR-ST-11/12 | Overdue 14/35/60 days | L1/L2/L3 notices; L3 flagged eligible |
| FT-ST-13 | FR-ST-11 | Penalty month-end | Penalty charge = principal×rate×days/365 rounded |
| FT-ST-14 | FR-ST-13 | Refer L3 case | Referral sent; webhook updates status |
| FT-ST-15 | FR-ST-14 | Payment plan active | No escalation/penalty |
| FT-ST-16 | FR-ST-15 | Post unbalanced journal | 422 UNBALANCED_ENTRY |
| FT-ST-17 | FR-ST-16 | Invoice $3,000 (staff threshold $1,000) | Approval request to manager; budget remaining shown |
| FT-ST-18 | FR-ST-16 | Invoice $6,000 | Routed to committee; approve on portal |
| FT-ST-19 | FR-ST-16 | Duplicate invoice no. | 409 |
| FT-ST-20 | FR-ST-17 | Batch 3 invoices same supplier 2 schemes | 2 payments (per scheme account), one remittance |
| FT-ST-21 | FR-ST-18 | QR estimate $8,000 with 1 quote | Accept blocked; with 2 quotes OK → WO |
| FT-ST-22 | FR-ST-19 | Create AGM, issue notice | Agenda PDF; owners notified |
| FT-ST-23 | FR-ST-20 | 4 lots vote ordinary motion 3 for 1 against | Carried |
| FT-ST-24 | FR-ST-20 | Special motion 2 for 1 against 1 abstain (entitlement weighting) | Per BR-ST-19 computed correctly |
| FT-ST-25 | FR-ST-20 | Lot votes twice | Second replaces first; one ballot counted |
| FT-ST-26 | FR-ST-22 | Campaign to building A owners | Audience = owners in A; test send required |
| FT-ST-27 | FR-ST-23 | Owner portal | Own lot only; ledger shows penalties |
| FT-ST-28 | FR-ST-24 | Committee portal | Fund tiles match GL |
| FT-ST-29 | FR-ST-25 | Wall post reported 3× | Auto-hidden |
| FT-ST-30 | FR-ST-26 | Policy ends in 59 days | Renewal task exists |
| FT-ST-31 | FR-ST-27 | Aged debtors report | Matches layout & totals = Σ outstanding overdue |
| FT-ST-32 | FR-ST-28 | Monthly schedule | Email with PDF to committee |
| FT-ST-33 | FR-ST-29/30 | Dashboard & TB | KPIs equal SQL reference queries |
| FT-FM-01 | FR-FM-01 | Import regions/properties/locations | Tree correct |
| FT-FM-02 | FR-FM-02 | Asset with warranty future | under_warranty true on WO creation |
| FT-FM-03 | FR-FM-03 | Generate 10-yr plan | Lines per lifecycle formula |
| FT-FM-04 | FR-FM-04 | Monthly plan lead 7 | WO created due−7; not duplicated |
| FT-FM-05 | FR-FM-05 | Planner | 52 weekly columns; hours totals |
| FT-FM-06 | FR-FM-06 | Portal request | Request created, ack sent |
| FT-FM-07 | FR-FM-07 | Triage P2 | WO with SLA due times per calendar |
| FT-FM-08 | FR-FM-08 | Full WO lifecycle | All transitions & guards |
| FT-FM-09 | FR-FM-09 | Clock to 80% / 100% | at_risk / breached events, notifications |
| FT-FM-10 | FR-FM-09 | on_hold 2 h | SLA due extended by paused time |
| FT-FM-11 | FR-FM-10 | Tech completes offline | Sync applies events once |
| FT-FM-12 | FR-FM-11 | Dispatch board drag | Assignment created |
| FT-FM-13 | FR-FM-12 | Assign expired-insurance contractor | 422 SUPPLIER_NON_COMPLIANT |
| FT-FM-14 | FR-FM-12 | Child-safe property, contractor lacks WWC | Blocked; other property allowed |
| FT-FM-15 | FR-FM-13 | Cost > NTE | awaiting_approval; client approves → resumes |
| FT-FM-16 | FR-FM-14 | Inspection with failed item | Follow-up WO created |
| FT-FM-17 | FR-FM-15 | Ops Centre | Widget counts = queries |
| FT-FM-18 | FR-FM-16 | Analytics | Cost totals = Σ WO cost |
| FT-FM-19 | FR-FM-17 | Contact history | Shows requests, WOs, comms |


Integration features (FR-IN-01..07) are tested by INT-T-01..18 in [INTEGRATION_TESTS.md](INTEGRATION_TESTS.md); AI features (FR-AI-01..07) by AIT-01..25 in [../09-ai/AI_TEST_CASES.md](../09-ai/AI_TEST_CASES.md).
