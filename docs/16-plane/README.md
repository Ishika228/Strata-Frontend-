# 16 · Plane Backlog Package — Vertex Strata + Vertex FM

**Status: pushed to Plane on 22–23 Nov 2026** (project "Vertex Strata - Vertex FM", via the Plane MCP). Implementation status is **0%**. No item is in a Done state.

| File | What |
|---|---|
| [PROJECT_MODEL.md](PROJECT_MODEL.md) | Internal project model: domains → modules, classifications, scale check, Demo Lite scope |
| [backlog.json](backlog.json) | **Source of truth:** 5 cycles, 12 modules, 33 labels, 24 epics and 87 work items. The items are 39 Day 1–4 engineering, 10 Day 5 validation, 16 decisions and 22 POST-DAY-5. All 75 functional requirements are mapped, with dependencies, lanes, estimates, sources and acceptance criteria |
| [plane_ids.json](plane_ids.json) | Map from backlog ID to Plane IDs: work-item UUID and sequence number for every epic and item, plus the module, cycle, label and page UUIDs |
| [BACKLOG.md](BACKLOG.md) | Human-readable render: capacity table, critical path, day × developer schedule, full item details |
| [backlog.csv](backlog.csv) | Flat export with one row per epic and item |
| [pages/](pages/) | Sources of the 7 Plane pages, now published in Plane |
| [tools/render_backlog.py](tools/render_backlog.py) | Re-renders BACKLOG.md/CSV and audits dependencies, capacity, sources and "no fake Done" |
| [tools/push_to_plane.py](tools/push_to_plane.py) | Alternative REST push script. Not used, because the MCP did the push. Untested against a live instance. |

## What exists in Plane

| Object | Count | Notes |
|---|---|---|
| Labels | 33 | Domain, P0–P3, type, evidence class, BLOCKED / UNKNOWN, POST-DAY-5, DEV1–DEV4, EPIC |
| Modules | 12 | 107 of 111 new items are in a module. EP-24, D-13, D-14 and FX-21 are cross-cutting and have no module |
| Cycles | 5 | Day 1 Tue 24 Nov → Day 4 Fri 27 Nov, Day 5 Mon 30 Nov 2026. D1 13 · D2 13 · D3 10 · D4 12 · D5 10 items |
| Epics | 24 | EP-01..EP-24, label EPIC; items are children of their epic |
| Work items | 87 | Sequence numbers 32–118. For example VX-001 = #32 and VX-099 = #80; see plane_ids.json |
| Dependencies | 134 | `blocked_by` edges across 66 items, mirroring `depends_on` in backlog.json |
| Pages | 7 | 01 Charter · 02 Architecture (PROPOSED) · 03 Execution Plan · 04 Risks/Unknowns/Decisions · 05 Build Readiness · 06 Traceability · 07 Day 5 Demo Plan |

States: our items are only in Backlog or Todo. The 3 items in Started/Completed states are Plane's own onboarding samples ("Welcome to Plane", etc.).

## Reconciliation with existing Plane content
1. **Nothing was deleted, renamed or overwritten.** The 7 onboarding sample work items, the sample modules and cycles, and the pages "Project Design Spec" and "Project Draft proposal" were left untouched. Archiving them is your call.
2. No existing item matched a backlog item, so no links were needed.
3. Lanes are labels DEV1–DEV4, because the workspace has no developer members yet. Once real members join, assign them and keep or remove the labels.

## Keeping Plane honest
- Move an item to Done only with evidence: a merged PR plus passing tests or a Day 5 validation record.
- Decision items D-01..D-16 stay `BLOCKED / UNKNOWN` until the owner records a decision. Do not convert them into confirmed requirements.
- Architecture is our PROPOSED design. Urbanise internals remain UNKNOWN.

## Regenerate after edits
```powershell
python -I docs/16-plane/tools/render_backlog.py
```
Changes to backlog.json are not synced to Plane automatically. Apply them in Plane, or ask Claude to reconcile using plane_ids.json.
