# 07 — Day 5 Demo Plan (Mon 30 Nov 2026)

## Schedule
| Time | Activity | Item |
|---|---|---|
| 09:00–10:30 | Smoke + Demo Lite run on demo env; log BUGs | VX-090 |
| 09:00–11:00 | Parallel validation: security (DEV1), Strata FIN (DEV2), FM (DEV3) | VX-091/092/093 |
| 11:00–12:00 | AI eval subset + rehearsal | VX-094 |
| 11:00–15:00 | Fix P0/P1 bugs, re-run E2E | VX-095 |
| 13:00–14:00 | Traceability update; gap review | VX-096/097 |
| 14:00–14:30 | Perf smoke | VX-098 |
| 15:00–15:45 | Full rehearsal on reset seed | — |
| 16:00–16:45 | **Stakeholder demo** | — |
| 16:45–17:15 | **Release Readiness / Demo Gate** (go/no-go record) | VX-099 |

## Demo flows (Demo Lite, ≈ 40 min) — subset of `15-build/DEMO_SCRIPT.md`
| # | Persona | Flow | Evidence shown | Built by |
|---|---|---|---|---|
| 1 | Maya (strata manager) | SSO login → Strata dashboard KPIs | EV-006, 031, 059 | VX-004, 060, 070 |
| 2 | Maya | Harbour View: lots, owners, funds, ledger | EV-029, 038 | VX-021, 022, 063 |
| 3 | Sam (accountant) | Garden Terrace budget → levy preview → approve | EV-020 | VX-020, 023 |
| 4 | Sam | Levy run → notices with pay link (Mailpit) | EV-021, 050 | VX-023, 009 |
| 5 | Owner (phone) | Pay via link (mock) → portal ledger updates | EV-034, 039, 050 | VX-024, 065 |
| 6 | Sam | Bank statement import → auto-match → lock rec | EV-042, 051 | VX-024, 063 |
| 7 | Maya | Arrears L1–L3 → refer lot 11 to collections (mock) | EV-024..026 | VX-025 |
| 8–10 | Sam → Committee (phone) | Invoice coded → committee approves with budget remaining → payment batch (mock bank) | EV-040, 052 | VX-026, 010, 065 |
| 11 | Maya | Aged Debtors PDF (observed layout) | EV-028 | VX-070 |
| 14 | Maya | Assistant: "Which Harbour View lots are at level 2?" + "What do by-laws say about pets?" → confirm a task | EV-110, 113, 114 (POC design) | VX-066, 068, 069 |
| 15 | Resident (mock app) | Submit leaking-tap request with photo | EV-086 | VX-043, 062 |
| 16 | Carl (coordinator) | Ops Centre → triage P2 (warranty flag) → blocked non-compliant contractor → assign technician | EV-071, 078, 091 | VX-043, 042, 046, 064 |
| 17 | Tom (technician phone) | Accept → check-in → photo → complete (offline if stable) | EV-081, 085 | VX-064 |
| 18 | Resident app | Sees completion + photo + timestamp | EV-086 | VX-043 |
| 19 | Client manager | Approves variation above NTE | EV-090 | VX-045 |
| 20 | Fiona (FM manager) | 52-week planner; 10-year CAPEX plan | EV-073, 075 | VX-044, 047 |
| 23 | Admin | Audit trail; tenant T2 user cannot see T1 | EV-013 | VX-006, 007 |

**Error paths to show live:** duplicate invoice 409 · non-compliant assignment 422 · out-of-scope 404 · AI refusing out-of-scope data.

**Fallbacks:** mock-llm scripted answers if D-15 is unresolved; presenter laptop if D-16 is unresolved; online technician flow if offline sync is unstable.

**Narration rule:** say "Urbanise publicly describes X; this is our independent implementation". Never claim knowledge of Urbanise internals.
