"""Push docs/16-plane/backlog.json into an existing Plane project via the Plane REST API (v1).

UNTESTED against a live Plane instance — run with --dry-run first (the default) and review the plan output.

Safety properties:
  * Never deletes or renames anything. Existing items are matched by exact name and skipped (or only reported).
  * Writes a reconcile report of existing modules/cycles/work items before creating anything.
  * Reads the API key from the PLANE_API_KEY environment variable; it is never printed or written to disk.

Usage (PowerShell):
  $env:PLANE_API_KEY = "<your key>"
  python -I docs/16-plane/tools/push_to_plane.py --base-url https://app.plane.so --workspace <slug> \
      --project "Vertex Strata - Vertex FM"            # dry run: prints the plan + writes reconcile_report.json
  python -I docs/16-plane/tools/push_to_plane.py ... --apply           # actually create
  python -I docs/16-plane/tools/push_to_plane.py ... --apply --relations   # also try 'blocked_by' relations

Pages: the public v1 API does not reliably expose Pages, so paste docs/16-plane/pages/*.md into Plane Pages manually
(or let a Plane MCP-enabled session create them).
"""
import argparse
import html
import json
import os
import sys
import time
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

LABEL_COLORS = {"STRATA": "#2563eb", "FM": "#059669", "PLATFORM": "#7c3aed", "AI": "#db2777", "FRONTEND": "#0891b2",
                "INTEGRATION": "#ca8a04", "REPORTING": "#4f46e5", "DEVOPS": "#475569", "SECURITY": "#dc2626", "QA": "#16a34a",
                "P0": "#b91c1c", "P1": "#ea580c", "P2": "#ca8a04", "P3": "#64748b", "BLOCKED / UNKNOWN": "#991b1b",
                "DECISION": "#9333ea", "POST-DAY-5": "#94a3b8", "CONFIRMED": "#15803d", "OBSERVED": "#0d9488",
                "INFERRED": "#a16207", "PROPOSED": "#6366f1", "UNKNOWN": "#71717a"}
PRIORITY = {"P0": "urgent", "P1": "high", "P2": "medium", "P3": "low"}


class Plane:
    def __init__(self, base, slug, key, items_path):
        self.base = base.rstrip("/") + "/api/v1/workspaces/" + slug
        self.root = base.rstrip("/") + "/api/v1"
        self.key = key
        self.items_path = items_path

    def req(self, method, url, body=None):
        data = json.dumps(body).encode() if body is not None else None
        r = urllib.request.Request(url, data=data, method=method,
                                   headers={"X-API-Key": self.key, "Content-Type": "application/json"})
        for attempt in range(5):
            try:
                with urllib.request.urlopen(r, timeout=30) as resp:
                    txt = resp.read().decode()
                    return json.loads(txt) if txt else {}
            except urllib.error.HTTPError as e:
                if e.code == 429:
                    time.sleep(2 ** attempt)
                    continue
                raise SystemExit(f"{method} {url} -> HTTP {e.code}: {e.read().decode()[:300]}")
        raise SystemExit("rate limited too long")

    def list(self, url):
        out, cursor = [], None
        while True:
            u = url + ("&" if "?" in url else "?") + "per_page=100" + (f"&cursor={cursor}" if cursor else "")
            res = self.req("GET", u)
            if isinstance(res, list):
                return res
            out += res.get("results", [])
            if not res.get("next_page_results"):
                return out
            cursor = res.get("next_cursor")


def md_to_html(text):
    return "<p>" + html.escape(text).replace("\n\n", "</p><p>").replace("\n", "<br/>") + "</p>"


def body_html(it, epic_title):
    parts = [f"<p><b>Epic:</b> {html.escape(epic_title)} · <b>Lane:</b> {it.get('lane') or '—'} · <b>Estimate:</b> {it['est_h']} h · "
             f"<b>Evidence:</b> {it['evidence']} · <b>Backlog ID:</b> {it['id']}</p>", md_to_html(it["description"])]
    if it["acceptance"]:
        parts.append("<h3>Acceptance criteria</h3><ul>" + "".join(f"<li>{html.escape(a)}</li>" for a in it["acceptance"]) + "</ul>")
    parts.append("<h3>Depends on</h3><p>" + (html.escape(", ".join(it["depends_on"])) or "—") + "</p>")
    parts.append("<h3>Source documentation</h3><ul>" + "".join(f"<li>docs/{html.escape(s)}</li>" for s in it["sources"]) + "</ul>")
    tr = it.get("trace") or {}
    if tr:
        parts.append("<h3>Traceability</h3><p>" + " · ".join(f"{k.upper()}: {html.escape(', '.join(v))}" for k, v in tr.items() if v) + "</p>")
    if it["risks"]:
        parts.append("<h3>Risks</h3><p>" + html.escape("; ".join(it["risks"])) + "</p>")
    if it["unknowns"]:
        parts.append("<h3>Unknowns / decisions</h3><p>" + html.escape("; ".join(it["unknowns"])) + "</p>")
    return "".join(parts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", required=True)
    ap.add_argument("--workspace", required=True)
    ap.add_argument("--project", default="Vertex Strata - Vertex FM")
    ap.add_argument("--items-path", default="issues", help="'issues' (v1) or 'work-items' (newer Plane)")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--relations", action="store_true")
    a = ap.parse_args()
    key = os.environ.get("PLANE_API_KEY")
    if not key:
        raise SystemExit("Set PLANE_API_KEY in the environment.")
    data = json.load(open(os.path.join(ROOT, "backlog.json"), encoding="utf-8"))
    p = Plane(a.base_url, a.workspace, key, a.items_path)

    projects = p.list(p.base + "/projects/")
    proj = next((x for x in projects if x["name"].strip().lower() == a.project.lower()), None)
    if not proj:
        raise SystemExit(f"Project '{a.project}' not found. Available: {[x['name'] for x in projects]}")
    P = p.base + f"/projects/{proj['id']}"

    existing = {
        "modules": p.list(P + "/modules/"), "cycles": p.list(P + "/cycles/"), "labels": p.list(P + "/labels/"),
        "states": p.list(P + "/states/"), "items": p.list(P + f"/{a.items_path}/"),
    }
    report = {k: [{"id": x.get("id"), "name": x.get("name"), "start_date": x.get("start_date"), "end_date": x.get("end_date")}
                  for x in v] for k, v in existing.items()}
    json.dump(report, open(os.path.join(ROOT, "reconcile_report.json"), "w", encoding="utf-8"), indent=2)
    print(f"Existing: {', '.join(f'{k}={len(v)}' for k, v in existing.items())} -> reconcile_report.json")

    names = lambda k: {x["name"].strip(): x for x in existing[k]}
    plan = []
    want_labels = sorted({l for g in data["labels"].values() for l in g})
    for l in want_labels:
        if l not in names("labels"):
            plan.append(("label", l))
    for m in data["modules"]:
        if m["name"] not in names("modules"):
            plan.append(("module", m["name"]))
    for c in data["cycles"]:
        if c["name"] not in names("cycles"):
            plan.append(("cycle", c["name"]))
    for e in data["epics"]:
        if e["title"] not in names("items"):
            plan.append(("epic", e["title"]))
    for it in data["items"]:
        t = f"[{it['id']}] {it['title']}"
        if t not in names("items"):
            plan.append(("item", t))
    print(f"Planned creations: {len(plan)}")
    for kind, n in plan:
        print(f"  + {kind:6} {n}")
    if not a.apply:
        print("\nDry run only. Re-run with --apply to create. Nothing is deleted or renamed in either mode.")
        return

    me = p.req("GET", p.root + "/users/me/")
    label_id = {x["name"]: x["id"] for x in existing["labels"]}
    for l in want_labels:
        if l not in label_id:
            label_id[l] = p.req("POST", P + "/labels/", {"name": l, "color": LABEL_COLORS.get(l, "#64748b")})["id"]
    state_id = {x["name"].lower(): x["id"] for x in existing["states"]}
    module_id = {x["name"]: x["id"] for x in existing["modules"]}
    for m in data["modules"]:
        if m["name"] not in module_id:
            module_id[m["name"]] = p.req("POST", P + "/modules/", {"name": m["name"], "description": m["description"]})["id"]
    mod_by_key = {m["key"]: module_id[m["name"]] for m in data["modules"]}
    cycle_id = {x["name"]: x["id"] for x in existing["cycles"]}
    for c in data["cycles"]:
        if c["name"] not in cycle_id:
            cycle_id[c["name"]] = p.req("POST", P + "/cycles/", {"name": c["name"], "description": c["goal"],
                                                                 "start_date": c["start"], "end_date": c["end"],
                                                                 "project_id": proj["id"], "owned_by": me["id"]})["id"]
    cyc_by_key = {c["key"]: cycle_id[c["name"]] for c in data["cycles"]}
    item_id = {x["name"].strip(): x["id"] for x in existing["items"]}

    def create(name, desc_html, labels, priority, state, parent=None):
        if name in item_id:
            return item_id[name]
        body = {"name": name, "description_html": desc_html, "priority": priority,
                "labels": [label_id[l] for l in labels if l in label_id]}
        if parent:
            body["parent"] = parent
        sid = state_id.get(state.lower()) or state_id.get("backlog")
        if sid:
            body["state"] = sid
        item_id[name] = p.req("POST", P + f"/{a.items_path}/", body)["id"]
        return item_id[name]

    epic_id, epic_title = {}, {e["id"]: e["title"] for e in data["epics"]}
    mod_members, cyc_members = {}, {}
    for e in data["epics"]:
        epic_id[e["id"]] = create(e["title"], md_to_html(e["summary"]), e["labels"] + ["EPIC", e["evidence"]], "none", "Backlog")
        if e["module"]:
            mod_members.setdefault(mod_by_key[e["module"]], []).append(epic_id[e["id"]])
    key_to_id = {}
    for it in data["items"]:
        labels = it["labels"] + [it["priority"], it["evidence"]] + ([it["lane"]] if (it["lane"] or "").startswith("DEV") else [])
        iid = create(f"[{it['id']}] {it['title']}", body_html(it, epic_title[it["epic"]]), list(dict.fromkeys(labels)),
                     PRIORITY[it["priority"]], it["state"], epic_id[it["epic"]])
        key_to_id[it["id"]] = iid
        if it["module"]:
            mod_members.setdefault(mod_by_key[it["module"]], []).append(iid)
        if it["cycle"]:
            cyc_members.setdefault(cyc_by_key[it["cycle"]], []).append(iid)
    for mid, ids in mod_members.items():
        p.req("POST", P + f"/modules/{mid}/module-issues/", {"issues": ids})
    for cid, ids in cyc_members.items():
        p.req("POST", P + f"/cycles/{cid}/cycle-issues/", {"issues": ids})
    if a.relations:
        for it in data["items"]:
            deps = [key_to_id[d] for d in it["depends_on"] if d in key_to_id]
            if deps:
                try:
                    p.req("POST", P + f"/{a.items_path}/{key_to_id[it['id']]}/relations/", {"relation_type": "blocked_by", "issues": deps})
                except SystemExit as ex:
                    print(f"relation for {it['id']} not created ({ex}); dependencies remain in the description")
    print("Done. Assign developers (DEV1..DEV4 labels) to real members in Plane, then paste pages/*.md into Plane Pages.")


if __name__ == "__main__":
    main()
