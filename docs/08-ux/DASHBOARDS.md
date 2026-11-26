# Dashboards (UI)

KPI definitions: [../11-reporting/KPI_CATALOG.md](../11-reporting/KPI_CATALOG.md). Specifications: [../11-reporting/DASHBOARD_SPECIFICATION.md](../11-reporting/DASHBOARD_SPECIFICATION.md).

| Dashboard | Screen | Layout | Evidence |
|---|---|---|---|
| Strata portfolio | SCR-101 | Row 1 KPI tiles: Trust cash, Levies issued (period), Collection rate, Arrears total, Paid-in-full %, Invoices awaiting approval. Row 2: Revenue vs expenses (12-mo bars), Cash flow line + 3-month forecast. Row 3: Arrears by bucket (stacked), Top 10 schemes by arrears (table) | EV-031, EV-059 |
| Committee summary | SCR-151 | 5 tiles: Admin cash, Capital works cash, Bank balance, Investments, Scheme arrears; budget vs actual bars | EV-038 OBSERVED |
| Ops Centre | SCR-201 | See OPS_CENTRE_AND_PORTAL widgets 1–7 | EV-071 |
| FM analytics | SCR-216 | Cost by property (bar), Cost trend (line), Supplier performance table (SLA %, avg completion, cost, jobs), Asset failures (top types/assets), Requests volume by source | EV-079, EV-089 |
| Client self-serve | SCR-261 Reports tab | SLA compliance %, Jobs by status, Spend by month (client scope) | EV-089 |
| AI usage | SCR-304 | Tokens & cost by month, queries/day, draft acceptance %, citation coverage % | PROPOSED |

Interaction: every tile/chart drills into a filtered list; "as at" timestamp shown; data refresh: Strata 5 min cache, Ops Centre 60 s, analytics nightly materialised + on-demand.
