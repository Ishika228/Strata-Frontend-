# UAT Plan

- **Participants**: 1 strata manager SME, 1 strata accountant SME, 1 FM coordinator SME, 1 technician, 2 owner testers, product owner.
- **Environment**: staging with demo seed + tester-created data. Duration 2 weeks (slice 14).
- **Entry**: all slices complete, P1/P2 defects zero, automated suites green.
- **Scripts**: UAT-01..UAT-20 derived from USER_STORIES (US-01..45); each tester runs their persona's stories and DEMO_SCRIPT steps.
- **Jurisdiction review** (⚖): SMEs review BR-ST-03/05/08/09/10/18/19 configuration defaults and record required changes (feeds G-04..G-06).
- **Defect severity**: S1 blocks scenario/no workaround; S2 major with workaround; S3 minor; S4 cosmetic.
- **Exit**: 100% UAT scripts executed; 0 S1, ≤ 3 S2 with plan; SME sign-off per area; ACCEPTANCE_CHECKLIST complete.

| UAT | Story | Persona |
|---|---|---|
| UAT-01 | US-05/06 scheme & roll | strata manager |
| UAT-02 | US-07/08 budget & levies | accountant |
| UAT-03 | US-09 owner payment | owner |
| UAT-04 | US-10/11 reconciliation | accountant |
| UAT-05 | US-12/13 arrears | strata manager |
| UAT-06 | US-14..16 invoices & payments | accountant, committee |
| UAT-07 | US-17 quotes | strata manager |
| UAT-08 | US-18..20 AGM | strata manager, owners |
| UAT-09 | US-21 campaign | strata manager |
| UAT-10 | US-22..24 portal | owners |
| UAT-11 | US-25/26 insurance & reports | strata manager |
| UAT-12 | US-27/28 assets & lifecycle | FM coordinator |
| UAT-13 | US-29 PPM | FM coordinator |
| UAT-14 | US-30..33 request → completion | FM coordinator, technician |
| UAT-15 | US-34 SLA | FM coordinator |
| UAT-16 | US-35 contractor compliance | contractor tester |
| UAT-17 | US-36/37 approvals & inspections | FM client |
| UAT-18 | US-38 analytics | FM manager |
| UAT-19 | US-39..43 AI | strata manager, accountant |
| UAT-20 | US-44/45 integration & audit | product owner |
