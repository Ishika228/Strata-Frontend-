# Levy Engine (F-ST-02, F-ST-03)

Evidence: budget-driven, annual, frequency-based automatic issuance (EV-020, EV-021); pay-now notices (EV-050); penalty lines (EV-039). **Formula: UNKNOWN (U-20) → PROPOSED below.** ⚖ Validate per jurisdiction.

## Inputs
- Approved `Budget` (financial year FY) with `BudgetLine{fund_id, gl_account_id, amount_cents}` for expense lines; levy target per fund = Σ expense lines of fund − Σ non-levy income lines of fund (configurable "levy_target_override").
- `Scheme.levy_frequency` ∈ {monthly, quarterly (default), half_yearly, annual}.
- `Scheme.first_due_date`, `lead_days` (30), `rounding` (cent).
- `Lot.entitlement` (integer), active lots at FY start.

## Algorithm (PROPOSED)
```
n = instalments_per_year(frequency)
E = Σ lot.entitlement (active lots)
for fund in scheme.funds_with_levy:
    T = levy_target(fund)                       # cents
    for i in 1..n:
        I_i = floor(T / n) ; I_n += T − n*floor(T/n)          # instalment remainder → last
        for lot in lots ordered by lot_number:
            a = floor(I_i * lot.entitlement / E)
        r = I_i − Σ a ;  distribute r one cent at a time to lots in descending fractional part, ties → lowest lot_number
        create LevyScheduleItem(lot, fund, instalment=i, due_date=first_due + (i−1)*period, amount=a)
```
Invariant: Σ items per fund = T exactly (test FIN-01).

### Worked example
Admin fund T = $10,000.00 (1,000,000 c), quarterly, lots entitlements 10/20/30/40 (E = 100).
I = 250,000 c each quarter. Lot amounts: 25,000 / 50,000 / 75,000 / 100,000 c. Sum = 250,000 ✔.

## Levy run
- Daily job selects schedule items with `due_date − lead_days ≤ today` and no `charge` yet.
- Creates `Charge{type=levy, lot, fund, amount, due_date, reference}` and posting:
  `DR 1200 Levies Receivable (lot sub-ledger)` / `CR 4000 Levy Income – <fund>`.
- Payment reference (CRN) = `scheme_no` + `lot_number` padded + Luhn check digit (PROPOSED) — used for bank matching (WF-07).
- Notice PDF: scheme title & registration no., lot, owner(s), period, amounts per fund, arrears brought forward, total due, due date, pay-now link, CRN, discount if applicable.
- Idempotency: unique `(lot_id, levy_schedule_item_id)` on charges.

## Discounts & penalties (⚖ configurable, U-22)
| Setting | Default | Effect |
|---|---|---|
| `discount_pct` | 0 (off) | If paid in full by due date, discount charge reversal posted |
| `penalty_rate_pa` | 10.00% | Simple interest on overdue levy principal |
| `penalty_grace_days` | 0 | Days after due before accrual |
| `penalty_frequency` | monthly | Penalty charges posted on 1st of month for prior month accrual |
| `penalty_min_cents` | 100 | Below threshold not charged |

Penalty for a charge in month m: `round(principal_outstanding × rate × days_overdue_in_month / 365)`.

## Special levies
Ad-hoc `LevySchedule{type=special}` with its own amount & due dates, apportioned identically. (INFERRED — common practice; not in public evidence.)

## Edge cases
- Lot added mid-year: receives remaining instalments only, recompute not retroactive.
- Ownership change: charges stay on the **lot**; ledger is per lot, statements show owner at date.
- Budget amended after approval: requires new version; future unissued items regenerated; issued items untouched.
