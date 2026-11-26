# Reporting Data Sources

| Source | Kind | Feeds |
|---|---|---|
| `strata.ledger_lines` + `journal_entries` | OLTP | TB, I&E, BS, KPI-ST-05/06/08 |
| `strata.charges` + `payment_allocations` | OLTP | Ageing, collection, paid-in-full |
| `reporting.v_lot_ageing` | view: per charge outstanding with bucket at `current_setting('app.as_at')` | RPT-ST-01, KPI-ST-01/02 |
| `reporting.mv_levy_collection` | materialised (nightly) | KPI-ST-04 |
| `reporting.mv_monthly_pl` | materialised | KPI-ST-06/07 |
| `fm.work_orders`, `sla_events`, `assignments`, `time_entries`, `material_lines` | OLTP | Ops Centre |
| `reporting.mv_sla`, `mv_fm_cost`, `mv_supplier_perf`, `mv_asset_failures`, `mv_ppm` | materialised (nightly 02:30 tenant tz; manual refresh button) | FM analytics |
| `fm.asset_plan_lines` | OLTP | CAPEX |
| `ai.*` | OLTP | AI usage |

Rules: materialised views include `tenant_id` and are queried through RLS-enabled security-barrier views; refresh `CONCURRENTLY`; reports run in read-only transactions (optionally against a read replica in cloud deployments).
