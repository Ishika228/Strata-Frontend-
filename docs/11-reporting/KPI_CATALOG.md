# KPI Catalog

Refresh: **RT** computed on request (≤ 5 min cache) · **N** nightly materialised view (`reporting.*`) · **60s** Ops Centre polling.

| KPI | Definition | Formula | Source Data | Dimensions | Filters | Permissions | Refresh | Drilldown | Evidence | POC Implementation |
|---|---|---|---|---|---|---|---|---|---|---|
| KPI-ST-01 Arrears total | Overdue receivable | Σ charges.outstanding where due_date < asAt | charges | scheme, bucket, level | scheme, manager | strata.report.run; committee (own scheme) | RT | Arrears console | EV-024, EV-038 | view `v_lot_ageing` |
| KPI-ST-02 Arrears by bucket | Ageing | Σ outstanding by (asAt − due_date) in 1–30/31–60/61–90/91+ | charges | bucket, type (levy/sundry) | scheme | same | RT | Aged debtors | EV-028 | `v_lot_ageing` |
| KPI-ST-03 Paid-in-full % | Lots with zero overdue | count(lots overdue=0)/count(active lots) | charges, lots | scheme, manager | period | strata.report.run | RT | Lots list filtered | EV-059 | SQL |
| KPI-ST-04 Collection rate | Levies collected vs issued for period | Σ allocations to levy charges due in period / Σ levy charges due in period | charges, payment_allocations | scheme, period | period | strata.report.run | N | Levy register | EV-024 (INFERRED KPI) | MV `mv_levy_collection` |
| KPI-ST-05 Trust cash | Bank-ledger cash | Σ ledger 1000 per fund | ledger_lines | scheme, fund | asAt | strata.ledger.read; committee summary | RT | GL | EV-038 | SQL |
| KPI-ST-06 Revenue vs expenses | Income & expense by month | Σ income acc − Σ expense acc | ledger_lines | month, fund, account | scheme(s), FY | strata.report.run | N | I&E report | EV-031 | MV `mv_monthly_pl` |
| KPI-ST-07 Cash flow forecast | Next 3 months projected cash | current cash + scheduled levies × trailing 6-mo collection rate − (approved unpaid invoices + avg monthly expenses) | schedule items, invoices, ledger | month | scheme | strata.report.run | N | Forecast table | EV-031 (method UNKNOWN → PROPOSED) | service calc |
| KPI-ST-08 Budget utilisation | Actual/budget | Σ actual / budget line | ledger, budget_lines | account, fund | FY | strata.report.run; committee | RT | Budget vs actual | EV-034, EV-040 | SQL |
| KPI-ST-09 Invoices awaiting approval | Count & value | count/Σ supplier_invoices status=pending_approval | supplier_invoices | scheme, age | — | strata.invoice.code | RT | Inbox | EV-040 | SQL |
| KPI-ST-10 Unreconciled items | Unmatched bank lines | count bank_transactions status in (unmatched,suggested) | bank_transactions | account, age | — | strata.bank.reconcile | RT | Rec screen | EV-042 | SQL |
| KPI-FM-01 Open WOs | Backlog | count WOs status not in (closed,cancelled,completed,verified) | work_orders | status, priority, property | region, client | fm.workorder.read | 60s | WO list | EV-071 | SQL |
| KPI-FM-02 SLA compliance % | WOs meeting completion target | count(completed_at ≤ complete_due_at + paused)/count(completed in period) | work_orders, sla_events | priority, property, client, supplier | period | fm.analytics.read; client scope | N | Breached list | EV-071, EV-098 | MV `mv_sla` |
| KPI-FM-03 Response SLA % | Response target met | count(responded_at ≤ response_due_at)/count | work_orders | same | period | same | N | — | EV-098 | MV |
| KPI-FM-04 At-risk / breached now | Live SLA | counts sla_state | work_orders | priority | — | fm.workorder.read | 60s | lists | EV-071 | SQL |
| KPI-FM-05 PPM compliance % | Planned jobs done on time | count(schedules completed by due)/count(schedules due in period) | maintenance_schedules, work_orders | property, trade, statutory | period | fm.analytics.read | N | Missed PPM list | EV-076 | MV |
| KPI-FM-06 Mean time to complete | Avg hours created→completed | avg(completed_at − created_at) | work_orders | priority, category, supplier | period | fm.analytics.read | N | WO list | EV-096 | MV |
| KPI-FM-07 First-time fix rate | Completed without follow-up WO on same asset within 14 d | 1 − repeat/total | work_orders | supplier, category | period | fm.analytics.read | N | repeats | PROPOSED | MV |
| KPI-FM-08 Maintenance cost | Σ WO cost | Σ cost_cents | work_orders | property, asset type, category, month | period | fm.analytics.read; client | N | WO list | EV-079 | MV `mv_fm_cost` |
| KPI-FM-09 Supplier performance | Per supplier SLA %, avg completion, jobs, cost | composite | work_orders, assignments | supplier | period | fm.analytics.read | N | supplier detail | EV-079 | MV |
| KPI-FM-10 Asset failures | Breakdown WOs per asset/type | count WOs category=breakdown | work_orders | asset, asset type, property | period | fm.analytics.read | N | asset history | EV-079 | MV |
| KPI-FM-11 Supplier compliance % | Compliant active suppliers | count compliant/count active | suppliers | trade | — | supplier.manage | RT | non-compliant list | EV-077 | SQL |
| KPI-FM-12 Request volume | Requests by source | count service_requests | service_requests | source, property, category | period | fm.analytics.read | N | list | EV-084 | MV |
| KPI-FM-13 CAPEX forecast | Planned spend per year | Σ plan lines | asset_plan_lines | year, property, category | plan | fm.assetplan.manage | RT | plan lines | EV-073 | SQL |
| KPI-AI-01 Assistant usage | Messages/day, users | counts | ai.messages | user, product | period | ai.settings.manage | N | — | PROPOSED | SQL |
| KPI-AI-02 Draft acceptance | Drafts sent / generated | ratio | ai.drafts | user | period | ai.settings.manage | N | — | EV-113 | SQL |
