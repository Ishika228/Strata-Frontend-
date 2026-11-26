# Arrears & Debt Recovery (F-ST-06)

Evidence: automated notices driven by business rules, multiple levels (EV-024); Debtor Level column Nil/Level 1 (EV-025); ageing buckets from due date (EV-028); penalties (EV-039); LevyCollect handoff (EV-026); debt recovery dashboard (W12). Thresholds UNKNOWN → PROPOSED.

## Policy model
`ArrearsPolicy{scheme_id|tenant default, levels[]}`; `Level{n, name, days_overdue, min_balance_cents, template_id, fee_cents, action ∈ {notice, notice_and_task, eligible_for_referral}}`.

Default:
| Level | Name | Days overdue | Min balance | Action |
|---|---|---|---|---|
| 0 | Nil | — | — | none |
| 1 | Reminder | 14 | $10 | notice |
| 2 | Final notice | 35 | $10 | notice_and_task (manager call) |
| 3 | Referral eligible | 60 | $500 | eligible_for_referral (manager approval) |

## Nightly job (WF-08)
1. For each lot with balance > 0: compute oldest overdue due date and bucketed amounts.
2. Skip if `payment_plan.active` or `dispute_hold` (BR-ST-11).
3. Target level = highest level whose thresholds are met. If target > current: create `ArrearsAction`, send template, post fee charge (sundry) if configured, set `arrears_case.level`.
4. If balance = 0 → case `resolved`, level = 0.
5. Penalties posted monthly (LEVY_ENGINE).

## Referral
Manager selects L3 cases → `DebtReferral{provider, status: pending→sent→acknowledged→in_progress→settled|closed|withdrawn}`. Adapter payload: scheme, lot, debtor contacts, ledger statement PDF, amounts by bucket. Provider webhooks update status. Payments still flow through scheme trust account.

## Ageing
Bucket of a charge's outstanding amount by `today − due_date`: 1–30, 31–60, 61–90, 91+. Not-yet-due amounts are excluded from aged debtors (sample shows only overdue buckets). Report excludes unpresented transactions when flag on (EV-028).

## Payment plans
`PaymentPlan{lot, instalments[], status}`; missed instalment → plan `broken` → escalation resumes.

## Outputs
Aged Debtors report (RPT-ST-01), arrears dashboard (KPI-ST-01..04), owner portal ledger with penalty lines.
