# POC Acceptance Checklist

## Functional
- [ ] All M-priority FRs implemented and traced to passing tests (traceability script green)
- [ ] DEMO_SCRIPT runs end-to-end on demo env without manual DB intervention
- [ ] Aged Debtors report reproduces OBSERVED structure (EV-028)
- [ ] Owner portal committee summary shows 5 OBSERVED tiles (EV-038)
- [ ] Committee mobile invoice approval works (EV-040)
- [ ] Resident-app round trip with photo evidence (EV-086)

## Quality
- [ ] FIN-01..10 pass; nightly INV-01..05 green 7 consecutive days
- [ ] Unit coverage domain ≥ 85%; money functions 100%
- [ ] PERF thresholds met (PERF-01..09, AI-PERF-01)
- [ ] axe: 0 serious on primary screens

## Security
- [ ] RBAC-N*, TEN-*, DOC-*, SEC-* pass
- [ ] AI EV-AUTHZ leakage = 0, EV-INJECT success = 0
- [ ] ZAP baseline no high; no critical vulns in images
- [ ] Secrets only in secret manager; gitleaks clean

## AI
- [ ] Eval gates met (AI_EVALUATION)
- [ ] All AI writes require confirmation; no outbound sends by AI

## Operations
- [ ] Dashboards & alerts configured; backup restore rehearsed (FAILREC-10)
- [ ] Runbooks reviewed

## Governance
- [ ] No Urbanise trademarks/assets in product; independent naming
- [ ] KNOWN_LIMITATIONS acknowledged by stakeholders
- [ ] SME review of jurisdiction-sensitive defaults recorded
