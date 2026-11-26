# Strata Capability Matrix

Columns answer: publicly confirmed? observed? inferred? proposed (POC)? unknown (implementation/rules)?

| Capability | Confirmed | Observed | Inferred | POC proposal | Unknown | Evidence | POC Feature |
|---|---|---|---|---|---|---|---|
| Strata management (schemes) | ✔ | ✔ (CTS title) | | Scheme entity w/ jurisdiction | Data fields beyond basics | EV-029, EV-057 | F-ST-01 |
| Buildings | | ✔ (Block/Floor/Lot) | | Building + floor label | | EV-029 | F-ST-01 |
| Lots | ✔ | ✔ | | Lot w/ entitlement | Entitlement field names | EV-029, EV-004 | F-ST-01 |
| Owners | ✔ | | | Contact + Ownership (effective dates) | | EV-034, EV-056 | F-ST-01 |
| Occupiers | ✔ ("residents") | | | Occupancy | | EV-047 | F-ST-01 |
| Levies | ✔ | ✔ (ledger) | | Charges type=levy | | EV-020, EV-039 | F-ST-03 |
| Levy schedules | ✔ (frequency) | | | LevySchedule/Items | | EV-021 | F-ST-03 |
| Levy calculations | ✔ (from budget) | | ✔ entitlement-based | BR-ST-03 | Exact formula, rounding | EV-020 | F-ST-03 |
| Invoices (levy notices) | ✔ (branded, pay-now) | | | PDF notice | Layout | EV-050 | F-ST-03 |
| Payments | ✔ | | | Mock provider | Rails, methods | EV-034, EV-050 | F-ST-04 |
| Banking | ✔ (Macquarie, NAB) | | multi-bank | Adapter + mock | File formats | EV-023, EV-049 | F-IN-01 |
| Reconciliation | ✔ automated | | | Auto-match rules | Match algorithm | EV-042, EV-051 | F-ST-05 |
| Arrears | ✔ multi-level | ✔ Debtor Level | | Policy L1–L3 | Thresholds | EV-024, EV-025 | F-ST-06 |
| Debt management | ✔ LevyCollect | | | Referral adapter | Protocol | EV-026 | F-ST-06 |
| Accounting / trust | ✔ | ✔ funds | | Double-entry per scheme | Statutory rules | EV-043, EV-038 | F-ST-07 |
| Budgets | ✔ | ✔ (budget remaining) | | Budget by fund/account | | EV-020, EV-040 | F-ST-02 |
| Supplier invoices | ✔ | ✔ approval screen | | Invoice + approvals | | EV-040, EV-044 | F-ST-08 |
| Procurement | ✔ (tile, quotes) | | | Quote requests, WO | Details | EV-041, EV-053 | F-ST-09 |
| Approvals | ✔ online approvals | ✔ | | Approval engine | Approval chains | EV-040, EV-042 | F-ST-08 |
| Tasks | ✔ | | | Tasks/notes/timeline | Automation rules | EV-012 | F-SH-08 |
| Communications | ✔ comms module | | | Campaigns | Non-email channels | EV-047 | F-ST-11 |
| Meetings | ✔ (StrataVote) | | | Native meetings | Statutory rules | EV-045 | F-ST-10 |
| Voting | ✔ (digital voting) | | | Native e-voting | Rules, proxies | EV-046 | F-ST-10 |
| Documents | ✔ | ✔ docs list | | Document service | | EV-014, EV-037 | F-SH-04 |
| Community portal | ✔ | ✔ | | Owner portal | | EV-032..040 | F-ST-12 |
| Mobile experience | ✔ native apps | ✔ | | PWA | App tech | EV-033 | F-ST-12 |
| Dashboards | ✔ | ✔ summary tiles | | Strata dashboard | Forecast method | EV-031, EV-038 | F-ST-15 |
| Reporting | ✔ scheduled | ✔ aged debtors | | Report engine | Other layouts | EV-027, EV-028 | F-ST-15 |
| AI assistant | ✔ partner; native announced | | | AI gateway + tools | Model, prompts | EV-110..118 | F-AI-* |
| Integrations | ✔ API, partners | | | Adapters + webhooks | Endpoints | EV-007, EV-008, EV-048 | F-IN-* |
| Automation | ✔ | | | Scheduler + rules | Engine | EV-058 | F-SH-08 |
| Insurance & compliance | ✔ | ✔ (docs) | | Register + reminders | | EV-054, EV-055 | F-ST-14 |
| Term deposits | ✔ (NAB) | | | Backlog | | EV-049 | BL-07 |
