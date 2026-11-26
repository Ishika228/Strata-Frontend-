# Seed Data (synthetic only)

`pnpm seed` (idempotent; fixed UUIDs; `SEED_PROFILE=demo|test|perf`). All names, addresses and numbers are fictional. Test passwords come from `.env.example` and are recorded there, not in docs.

## Tenants
| Tenant | Products | Purpose |
|---|---|---|
| Northshore Strata & Facilities (T1) | strata, fm | Main demo |
| Riverbend Property Services (T2) | strata, fm | Isolation tests (contains look-alike names, e.g. a "Harbour View" scheme) |

## Users (T1)
admin@t1 (tenant_admin), maya.manager (strata_manager, all schemes), sam.accounts (strata_accountant), fiona.fm (fm_manager), carl.coord (fm_coordinator), tara.tech & tom.tech (technician), sparky@brightelectrical (contractor), owner1..owner12 (owners), committee: owner1, owner2, owner5 (Harbour View), occupier1, client.manager@acmecare (fm_client), audit@t1 (auditor). Contractor sparky also has membership in T2.

## Strata
- **Harbour View** (CTS 50123, AU-QLD, quarterly, FY July): Block A (lots 1–6) & Block B (7–12); entitlements 8–12; admin budget $120,000, capital works $48,000; 2 instalments already issued; payments such that lots 3 & 7 are L2, lot 9 L1, lot 11 L3, others paid; 1 sundry charge; penalties posted for lot 11.
- **Garden Terrace** (SP 77881, AU-NSW-like jurisdiction pack, monthly): 6 lots; budget proposed (not approved) to demo budget flow.
- Bank statements: last month CSV with 25 lines (20 matchable, 3 suggested, 2 unknown incl. bank fee).
- Suppliers: Bright Electrical (compliant), AquaFlow Plumbing (insurance expiring in 10 days), Roofline (non-compliant), CleanCo (compliant).
- Invoices: 1 pending manager approval ($2,400), 1 pending committee ($7,800, roof), 2 approved ready to batch.
- Quote request: roof repair with 2 quotes.
- AGM scheduled in 21 days with 3 motions; past AGM minutes (PDF) with results.
- Documents: by-laws PDF (pets clause p.7, parking p.9), insurance certificate, AGM minutes 2025, committee minutes (committee-only).
- Insurance: policy expiring in 55 days.

## FM
- Region "Metro" & "Regional"; client "Acme Care Group" with 3 properties (2 flagged `aged_care`, 1 `child_safe`) + Harbour View common property as FM property.
- Locations: buildings/floors/rooms (≈ 60).
- 30 asset types; 220 assets (warranty active on 15; conditions spread; replacement costs).
- 12 maintenance plans (incl. statutory fire monthly, HVAC quarterly).
- SLA policy "Standard" (BR-FM-01) with Mon–Fri 8–17 calendar + QLD holidays; "24×7 Critical".
- 40 WOs across statuses; 3 at-risk, 1 breached; 2 awaiting client approval; 5 open service requests (2 from mock resident app).
- Technicians Tara (HVAC, general), Tom (electrical, plumbing).

## AI
Pre-indexed seed documents; eval fixtures reference these IDs.

## Perf profile
Generators produce PERFORMANCE_TESTS dataset sizes.
