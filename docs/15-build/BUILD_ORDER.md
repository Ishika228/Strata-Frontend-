# Build Order (Vertical Slices)

Each slice is shippable: migrations + API + UI + tests + seed + demo step. A slice is "done" only when [PHASE_COMPLETION_CHECKLIST.md](PHASE_COMPLETION_CHECKLIST.md) passes.

| # | Slice | Scope (FR) | Key entities | Screens | Tests | Depends on | Est. (1 team of 3–4) |
|---|---|---|---|---|---|---|---|
| 0 | Foundation | repo, compose, CI, config, logging, OTel, error model, pagination, idempotency middleware, outbox, audit | outbox, audit, idempotency | AppShell | API-ERR, API-IDEM, API-PAGE | — | 1 wk |
| 1 | Tenant + User + Auth + RBAC | FR-SH-01..05, FR-SH-09 | tenants, users, memberships, role_assignments | SCR-001..004 | FT-SH-01..04, RBAC-N*, TEN-01..05, SEC-05/06 | 0 | 1.5 wk |
| 2 | Strata Scheme + Lot + Owner | FR-ST-01..03, FR-SH-06 (docs basic), FR-SH-12 (imports) | schemes, buildings, lots, contacts, ownerships, funds, gl_accounts, bank_accounts, portal_sites, documents, import_jobs | SCR-102..105, SCR-005, SCR-008 | FT-ST-01/02, FT-SH-05, FT-SH-10 | 1 | 2 wk |
| 3 | Strata Levy + Payment + Arrears | FR-ST-04..15 | budgets, levy_*, charges, payments, allocations, bank_*, reconciliations, journals, ledger_lines, periods, arrears_* | SCR-104, SCR-106..110, SCR-120, SCR-151/152 | FT-ST-03..16, FIN-*, INT-T-01..08 | 2 | 3 wk |
| 4 | Strata Meetings + Documents + Communications | FR-ST-19..26, FR-SH-07/08 | meetings, motions, votes, proxies, campaigns, notifications, wall_posts, insurance, compliance_items | SCR-115..117, SCR-119, SCR-153..158 | FT-ST-22..30, NOT-*, DOC-* | 3 (portal), 2 | 2 wk |
| 5 | FM Property + Location + Asset | FR-FM-01..03 | regions, clients, properties, locations, asset_types, assets, asset_plans | SCR-202..206, SCR-253 | FT-FM-01..03 | 1 | 1.5 wk |
| 6 | FM Maintenance + Work Order | FR-FM-04..08 | maintenance_plans/schedules, service_requests, work_orders, events | SCR-207..211, SCR-261 | FT-FM-04..08 | 5 | 2 wk |
| 7 | FM Assignment + SLA + Evidence | FR-FM-09..11, FR-FM-13/14 | assignments, technicians, sla_policies, calendars, sla_events, evidence, time, inspections, approval_requests | SCR-212/213/215, SCR-251/252 | FT-FM-09..16, E2E-FM-05 | 6 | 2 wk |
| 8 | Supplier + Compliance (+ Strata AP/procurement) | FR-FM-12, FR-ST-16..18 | suppliers, compliance_*, supplier_invoices, payment_batches, quotes, strata WOs | SCR-111..114, SCR-214, SCR-254, SCR-156 | FT-FM-13/14, FT-ST-17..21 | 3, 7 | 2 wk |
| 9 | Search + Notifications + Reporting | FR-SH-10/11, FR-ST-27..30, FR-FM-15..17 | search_index, tasks, report_*, MVs | SCR-007, SCR-009, SCR-101, SCR-118, SCR-201, SCR-216, SCR-217 | FT-SH-08/09, FT-ST-31..33, FT-FM-17..19 | 3–8 | 2 wk |
| 10 | AI Gateway + Strata tools | FR-AI-01/02/05/07 | ai.conversations/messages/tool_calls/proposals/drafts | SCR-301, SCR-302, SCR-304 | AIT-01..04, 09..11, 14, 15, 18..24 | 9 | 1.5 wk |
| 11 | AI Gateway + FM tools | FR-AI-03 | — | SCR-301 | AIT-12, 13 | 10, 7 | 0.5 wk |
| 12 | RAG + Documents + Citations; invoice extraction | FR-AI-04, FR-AI-06 | document_chunks, extractions | SCR-301, SCR-303 | AIT-05..08, 16, 17, 25, DOC-07/08 | 10 | 1.5 wk |
| 13 | Integrations | FR-IN-01..07, FR-SH-13 | api_clients, webhooks, external_refs, integration_events | Settings › Integrations | INT-T-*, WH-* | 3, 6 | 1.5 wk |
| 14 | Security + Performance + UAT | NFR-*, all | — | — | SEC-*, PERF-*, FAILREC-*, UAT | all | 2 wk |

Total ≈ 26 weeks for one team; ≈ 14–16 weeks with two teams running Strata (2→3→4→8) and FM (5→6→7) tracks in parallel after slice 1.

Note: mock bank/payments (part of slice 13) are needed by slice 3 — build `mock-bank` & `mock-payments` minimal endpoints inside slice 3, complete in 13.
