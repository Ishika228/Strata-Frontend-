# Discovery Summary

## What the public evidence shows

Urbanise publicly presents **two purpose-built cloud platforms** (EV-003):

1. **Urbanise Strata** — for AU/NZ strata managers (EV-057). Core claims: budget-driven automated levies (EV-020/021), multi-level automated arrears with debt-collection handoff to LevyCollect (EV-024/026), integrated trust/ledger accounting with automated bank reconciliation (EV-042/043), invoice processing with online and in-app committee approvals (EV-040/044), procurement and work orders (EV-053), meetings via StrataVote (EV-045), comms campaigns (EV-047), Community™ owner/committee portal and app (EV-032..040), scheduled reports such as aged debtors (EV-027/028), and banking partnerships (Macquarie, NAB) (EV-023, EV-049..052). AI is partner-delivered today (Merlo, EV-113..116) with native AI announced (EV-110..112, C-01).
2. **Urbanise FM** — for FM providers and asset owners incl. aged care, education, government (EV-095). Core claims: Ops Centre (EV-071), asset register with 10-year lifecycle plans (EV-072/073), planned maintenance with 52-week planner (EV-075), helpdesk and customer portal (EV-083/084), work order triage/assignment/completion with photo evidence (EV-085), SLAs (EV-098), workforce and contractor mobile apps (EV-081/082), supplier compliance gating (EV-077/078), client approvals for variations (EV-090), analytics/BI (EV-079/089), resident-app integrations (Conpago, MyVillage) (EV-086/087).

**Shared characteristics:** AWS-hosted, ISO 27001 (EV-001/002), open/published APIs (EV-007/008), SSO (EV-006), audit trail (EV-013), tasks (EV-012), documents (EV-014), data import (EV-009).

## Strongest evidence (OBSERVED)
- Aged Debtors report structure (W16 → EV-025, 028, 029, 030).
- Community app screens: fund-level financial summary, levy ledger with penalties, committee invoice approval (W15 → EV-038, 039, 040).

## What is not known
All internal implementation (U-01..U-12) and most business formulas (U-20..U-33). The POC therefore **designs** these, labelled PROPOSED.

## Resulting POC ("Vertex Strata + Vertex FM")
A multi-tenant modular monolith with a shared platform (tenancy, identity, RBAC, documents, notifications, audit, search, tasks, imports, API/webhooks, AI gateway) and two domain modules. Scope: [PRODUCT_SCOPE.md](PRODUCT_SCOPE.md). Model: [../01-product/PRODUCT_MODEL.md](../01-product/PRODUCT_MODEL.md).

## Counts
| Classification | Evidence rows |
|---|---|
| CONFIRMED (79 plain + 3 announced/roadmap + 2 marketing/partner "claim") | 84 |
| OBSERVED (screenshots W15, sample report W16) | 7 |
| INFERRED | 1 row (EV-015) + inferences recorded in conflicts C-03, C-07 and domain model |
| UNKNOWN | 2 rows (EV-016, EV-118) expanding to 26 items in UNKNOWN_INFORMATION |
| CONFLICT | 2 rows (EV-011, EV-097); 11 conflict records (C-01..C-11), 4 unresolved |
| **Total evidence rows** | **96** |
| PROPOSED | Kept out of the evidence register by design: 75 FRs, 45 business rules, 27 workflows, 63 screens, ~190 API operations, 16 ADRs |
