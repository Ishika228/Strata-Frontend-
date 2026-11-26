# Dashboard Specification

| Dashboard | Widgets (KPI) | Filters | Audience | Refresh | Evidence |
|---|---|---|---|---|---|
| DB-ST-01 Strata portfolio (SCR-101) | Tiles: KPI-ST-05, KPI-ST-04, KPI-ST-01, KPI-ST-03, KPI-ST-09, KPI-ST-10 · Chart: KPI-ST-06 (12-month bars) · Chart: KPI-ST-07 (line + 3-mo forecast, dashed) · Stacked bar KPI-ST-02 · Table: top 10 schemes by arrears | manager, scheme, FY | s_mgr, s_acct | RT + N | EV-031, EV-059 |
| DB-ST-02 Committee summary (SCR-151) | Tiles: Admin cash, Capital works cash, Bank balance, Investments, Scheme arrears (KPI-ST-05/01) · Budget vs actual (KPI-ST-08) | scheme (fixed) | committee | RT | EV-038 (OBSERVED) |
| DB-FM-01 Ops Centre (SCR-201) | KPI-FM-01 by status · KPI-FM-04 list · Today planned vs done · Unassigned queue · Awaiting approval · Compliance alerts (KPI-FM-11) · Technician availability | region, property, client, trade, priority | fm_mgr, fm_coord | 60s | EV-071 |
| DB-FM-02 FM analytics (SCR-216) | KPI-FM-08 (bar by property, line by month) · KPI-FM-09 table · KPI-FM-10 top 10 · KPI-FM-02/03 gauge · KPI-FM-05 · KPI-FM-06 · KPI-FM-12 | period, region, property, client, supplier, trade | fm_mgr | N | EV-079, EV-089 |
| DB-FM-03 Client self-serve (SCR-261) | KPI-FM-02, KPI-FM-01 (client scope), KPI-FM-08 (client scope) | period, property | fm_client | N | EV-089 |
| DB-FM-04 Lifecycle (SCR-206) | KPI-FM-13 by year (bar) · by category (stacked) | plan, property | fm_mgr | RT | EV-073 |
| DB-AI-01 AI usage (SCR-304) | KPI-AI-01/02, eval scores | month | tenant_admin | N | PROPOSED |

Charts: Recharts, accessible data-table toggle, colour-blind-safe palette, consistent money formatting. Every widget shows "as at" and has a drill link to the filtered list.
