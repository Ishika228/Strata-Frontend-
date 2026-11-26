# UI & End-to-End Tests (Playwright)

| ID | Flow | Roles | Steps (summary) | Assertions |
|---|---|---|---|---|
| E2E-SH-01 | Login + MFA + tenant switch | contractor (2 tenants) | login, OTP, switch | data changes per tenant |
| E2E-SH-02 | Import wizard | tenant_admin | UF-16 | rows created |
| E2E-ST-01 | Scheme creation | s_mgr | UF-01 | portal banner, funds |
| E2E-ST-02 | Budget → levy run → owner pays | s_acct, owner | UF-02, UF-03, UF-04 | ledger zero balance |
| E2E-ST-03 | Reconcile & lock | s_acct | UF-05 | locked |
| E2E-ST-04 | Arrears & referral | s_mgr | UF-06 | referral status |
| E2E-ST-05 | Invoice → AI extract → committee mobile approval → batch | s_acct, committee | UF-07 (mobile viewport for approval) | paid |
| E2E-ST-06 | AGM vote & minutes | s_mgr, 3 owners | UF-08 | carried; minutes in portal |
| E2E-ST-07 | Campaign | s_mgr | UF-09 | Mailpit receives |
| E2E-ST-08 | Owner portal tour | owner, committee, occupier | each tab | visibility per role |
| E2E-FM-01 | Resident request → completion (resident app mock) | fm_coord, technician | UF-10 | resident mock shows completed + photo |
| E2E-FM-02 | PPM generation | fm_mgr | UF-11 + clock advance | WO exists |
| E2E-FM-03 | Variation approval | fm_coord, fm_client | UF-12 | resumes |
| E2E-FM-04 | Lifecycle plan | fm_mgr | UF-13 | PDF export |
| E2E-FM-05 | Offline technician | technician (mobile, offline mode) | go offline, complete job, online | synced once |
| E2E-FM-06 | Compliance gate | fm_coord | assign non-compliant | blocked message |
| E2E-AI-01 | Assistant with citation & proposal | s_mgr | UF-14 | task created after confirm |
| E2E-AI-02 | Draft reply | s_mgr | UF-15 | email sent only on click |
| UI-A11Y | All primary screens | — | axe scan | 0 serious/critical |
| UI-HELP | Contextual help | — | visit each primary screen | help icon present with valid link (FR-SH-14) |
| UI-RESP | Portal & field at 375 px | — | visual snapshot | no horizontal scroll |
