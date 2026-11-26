# Asset Register & Lifecycle (F-FM-02, F-FM-03)

Evidence: asset register, 10-year lifecycle modelling with benchmarks (EV-072); compliant 10-year plans, CAPEX (EV-073); GPS-tagged photos (EV-088); warranty status (EV-091); ISO 55001 support (EV-096). Method & benchmarks UNKNOWN (U-27) → PROPOSED.

## Asset
`Asset{id, tenant, property, location, asset_type, code (QR-ready), name, make, model, serial, install_date, warranty_expiry, condition 1–5, criticality 1–5, replacement_cost_cents, useful_life_years (override), status: active|inactive|disposed, geo{lat,lng,accuracy}, photos[], attributes jsonb}`

`AssetType{name, category, default_useful_life_years, default_replacement_cost_cents, default_maintenance_plans[], attribute_schema jsonb}` — seeded with ~30 common types (HVAC split system 12 y, chiller 20 y, lift 25 y, fire panel 15 y, emergency light 10 y, hot water system 12 y, roof membrane 25 y, carpet 10 y, paint internal 8 y, pump 15 y …). Benchmarks are **illustrative POC defaults**, not industry data.

## Lifecycle formula (PROPOSED)
```
base_remaining = max(0, install_year + useful_life − plan_start_year)
condition_factor = {1: 1.2, 2: 1.0, 3: 0.8, 4: 0.6, 5: 0.4}[condition]
adj_remaining = round(base_remaining × condition_factor)
replacement_year = plan_start_year + adj_remaining
cost_in_year(y) = replacement_cost × (1 + escalation)^(y − plan_start_year)
```
Plan horizon 10 years; assets with `replacement_year` within horizon produce `AssetPlanLine{asset, year, action: replace|refurbish, cost_cents, priority = criticality × (6 − adj_remaining_clamped)}`. Replaced assets recur after useful_life if within horizon.

Plan states: `draft → published → superseded`. Report: CAPEX by year × property × category (RPT-FM-03).

## Asset history
Timeline of WOs, inspections, failures (WO category `breakdown` linked to asset), costs → "asset failures" analytics (EV-079).
