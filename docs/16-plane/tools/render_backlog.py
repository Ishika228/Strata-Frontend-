"""Render backlog.json -> BACKLOG.md, backlog.csv, and print a consistency/capacity audit.

Usage: python -I docs/16-plane/tools/render_backlog.py
"""
import csv
import json
import os
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DOCS = os.path.dirname(ROOT)

data = json.load(open(os.path.join(ROOT, "backlog.json"), encoding="utf-8"))
items = data["items"]
epics = {e["id"]: e for e in data["epics"]}
mods = {m["key"]: m for m in data["modules"]}
cyc = {c["key"]: c for c in data["cycles"]}
byid = {i["id"]: i for i in items}
order = {k: n for n, k in enumerate(["D1", "D2", "D3", "D4", "D5"], 1)}
cap = data["capacity_hours_per_dev_per_day"]

problems = []
# --- dependency checks
for i in items:
    for d in i["depends_on"]:
        if d not in byid:
            problems.append(f"{i['id']}: unknown dependency {d}")
            continue
        dep = byid[d]
        if i["cycle"] and not d.startswith("D-"):
            if dep["cycle"] is None:
                problems.append(f"{i['id']} ({i['cycle']}) depends on unscheduled {d}")
            elif order[dep["cycle"]] > order[i["cycle"]]:
                problems.append(f"{i['id']} ({i['cycle']}) depends on later {d} ({dep['cycle']})")
    if i["epic"] not in epics:
        problems.append(f"{i['id']}: unknown epic {i['epic']}")
    if i["module"] and i["module"] not in mods:
        problems.append(f"{i['id']}: unknown module {i['module']}")
    if i["state"] == "Done":
        problems.append(f"{i['id']}: marked Done without evidence")
    for s in i["sources"]:
        path = s.split(" (")[0]
        if not os.path.exists(os.path.join(DOCS, path)):
            problems.append(f"{i['id']}: source not found {path}")
    if i["cycle"] in ("D1", "D2", "D3", "D4") and not i["id"].startswith("D-") and i["lane"] not in ("DEV1", "DEV2", "DEV3", "DEV4"):
        problems.append(f"{i['id']}: Day 1-4 item without a developer lane")

# --- capacity
load = defaultdict(float)
for i in items:
    if i["cycle"] and i["lane"] and i["lane"].startswith("DEV"):
        load[(i["lane"], i["cycle"])] += i["est_h"]

# --- critical path (longest chain by hours over scheduled engineering items)
memo = {}
def longest(iid):
    if iid in memo:
        return memo[iid]
    it = byid[iid]
    best = (0.0, [])
    for d in it["depends_on"]:
        if d in byid and not d.startswith("D-") and byid[d]["cycle"]:
            best = max(best, longest(d), key=lambda x: x[0])
    memo[iid] = (best[0] + it["est_h"], best[1] + [iid])
    return memo[iid]
sched = [i["id"] for i in items if i["cycle"] and not i["id"].startswith("D-")]
cp = max((longest(x) for x in sched), key=lambda x: x[0])

# --- CSV (one row per epic + item), Plane-friendly columns
with open(os.path.join(ROOT, "backlog.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["key", "title", "type", "parent", "module", "cycle", "start", "due", "priority", "plane_priority",
                "state", "lane", "estimate_h", "labels", "evidence", "depends_on", "sources", "acceptance"])
    pmap = {"P0": "urgent", "P1": "high", "P2": "medium", "P3": "low"}
    for e in data["epics"]:
        w.writerow([e["id"], e["title"], "epic", "", mods[e["module"]]["name"] if e["module"] else "", "", "", "", "", "none",
                    "Backlog", "", "", ";".join(e["labels"] + ["EPIC", e["evidence"]]), e["evidence"], "", "", ""])
    for i in items:
        c = cyc.get(i["cycle"]) if i["cycle"] else None
        labels = i["labels"] + [i["priority"], i["evidence"]] + ([i["lane"]] if i["lane"] and i["lane"].startswith("DEV") else [])
        w.writerow([i["id"], i["title"], "decision" if i["id"].startswith("D-") else "work_item", i["epic"],
                    mods[i["module"]]["name"] if i["module"] else "", c["name"] if c else "",
                    c["start"] if c else "", c["end"] if c else "", i["priority"], pmap[i["priority"]], i["state"],
                    i["lane"] or "", i["est_h"], ";".join(dict.fromkeys(labels)), i["evidence"], ";".join(i["depends_on"]),
                    " | ".join(i["sources"]), " | ".join(i["acceptance"])])

# --- Markdown
L = []
A = L.append
A("# Plane Backlog — Vertex Strata + Vertex FM\n")
A("Generated from [backlog.json](backlog.json) by `tools/render_backlog.py`. Do not edit by hand; edit the JSON and re-render.\n")
A("States are honest: Day 1 items `Todo`, later items `Backlog`, nothing `Done`. `D-xx` = Decision Required (label `BLOCKED / UNKNOWN`). `FX-xx` = POST-DAY-5.\n")
A("## Cycles\n\n| Cycle | Dates | Goal |\n|---|---|---|")
for c in data["cycles"]:
    A(f"| {c['name']} | {c['start']} → {c['end']} | {c['goal']} |")
A("\n## Capacity (hours planned vs " + str(cap) + " h/dev/day)\n")
A("| Lane | D1 | D2 | D3 | D4 | D5 | Total D1–D4 |\n|---|---|---|---|---|---|---|")
for lane in ["DEV1", "DEV2", "DEV3", "DEV4"]:
    row = [load[(lane, d)] for d in ["D1", "D2", "D3", "D4", "D5"]]
    flag = lambda h: f"**{h:g}** ⚠" if h > cap else f"{h:g}"
    A(f"| {lane} — {data['lanes'][lane]} | " + " | ".join(flag(h) for h in row) + f" | {sum(row[:4]):g} |")
A("\n## Critical path (longest dependency chain by estimated hours)\n")
A(" → ".join(f"{x} ({byid[x]['lane']}, {byid[x]['cycle']}, {byid[x]['est_h']}h)" for x in cp[1]) + f"\n\nTotal: **{cp[0]:g} h**.\n")
A("## Epics\n\n| Epic | Module | Evidence | Summary |\n|---|---|---|---|")
for e in data["epics"]:
    A(f"| {e['id']} {e['title']} | {mods[e['module']]['name'] if e['module'] else '—'} | {e['evidence']} | {e['summary']} |")
A("\n## Schedule by day and developer\n")
for d in ["D1", "D2", "D3", "D4", "D5"]:
    A(f"### {cyc[d]['name']} ({cyc[d]['start']})\n")
    A("| Lane | Item | Priority | Est | Depends on |\n|---|---|---|---|---|")
    for i in sorted([x for x in items if x["cycle"] == d], key=lambda x: (x["lane"] or "Z", x["id"])):
        A(f"| {i['lane']} | {i['id']} {i['title']} | {i['priority']} | {i['est_h']:g}h | {', '.join(i['depends_on']) or '—'} |")
    A("")
A("### Unscheduled (POST-DAY-5 / decisions without a day)\n\n| Item | Priority | Est | Lane |\n|---|---|---|---|")
for i in [x for x in items if not x["cycle"]]:
    A(f"| {i['id']} {i['title']} | {i['priority']} | {i['est_h']:g}h | {i['lane'] or '—'} |")
A("\n## Work item details\n")
for i in items:
    A(f"### {i['id']} — {i['title']}\n")
    A(f"- **Epic:** {i['epic']} {epics[i['epic']]['title']} · **Module:** {mods[i['module']]['name'] if i['module'] else '—'}")
    A(f"- **Lane:** {i['lane'] or '—'} · **Cycle:** {cyc[i['cycle']]['name'] if i['cycle'] else 'none'} · **Priority:** {i['priority']} · **Estimate:** {i['est_h']:g} h · **State:** {i['state']}")
    A(f"- **Evidence:** {i['evidence']} · **Labels:** {', '.join(i['labels'])}")
    A(f"- **Depends on:** {', '.join(i['depends_on']) or '—'}\n")
    A(i["description"] + "\n")
    if i["acceptance"]:
        A("**Acceptance criteria**\n")
        for a in i["acceptance"]:
            A(f"- [ ] {a}")
        A("")
    A("**Source documentation:** " + "; ".join(f"`docs/{s}`" for s in i["sources"]) + "\n")
    t = i.get("trace", {})
    if t:
        A("**Traceability:** " + " · ".join(f"{k.upper()}: {', '.join(v)}" for k, v in t.items() if v) + "\n")
    if i["risks"]:
        A("**Risks:** " + "; ".join(i["risks"]) + "\n")
    if i["unknowns"]:
        A("**Unknowns / decisions:** " + "; ".join(i["unknowns"]) + "\n")
open(os.path.join(ROOT, "BACKLOG.md"), "w", encoding="utf-8").write("\n".join(L))

# --- audit print
print("items", len(items), "epics", len(epics), "modules", len(mods), "cycles", len(cyc))
cnt = defaultdict(int)
for i in items:
    cnt["decision" if i["id"].startswith("D-") else "future" if i["id"].startswith("FX") else "day5" if i["cycle"] == "D5" else "scheduled"] += 1
print(dict(cnt))
for lane in ["DEV1", "DEV2", "DEV3", "DEV4"]:
    print(lane, [load[(lane, d)] for d in ["D1", "D2", "D3", "D4", "D5"]])
print("critical path", cp[0], cp[1])
print("PROBLEMS" if problems else "no problems", *problems, sep="\n")
