# Key User Flows (UI-level; business detail in WORKFLOW_CATALOG)

| Flow | Steps (screens) | WF |
|---|---|---|
| UF-01 Create scheme | SCR-102 New → wizard: details → buildings → lots (grid paste / import) → owners → funds & bank → review → SCR-103 (portal live banner) | WF-03 |
| UF-02 Budget to levies | SCR-106 enter lines → Levy preview modal (per lot table, totals check ✔) → Propose → Approve → SCR-107 schedule visible | WF-04 |
| UF-03 Levy run | SCR-107 "Run now" → confirm period → progress → summary (notices, total) → open sample notice PDF | WF-05 |
| UF-04 Owner pays | email notice → pay link → `/pay` summary → mock checkout → success → SCR-152 shows receipt | WF-06 |
| UF-05 Reconcile | SCR-109 upload statement → auto-match summary (x matched, y suggested, z unmatched) → resolve suggested (accept) → match unmatched (search lot/CRN) → difference 0 → Lock | WF-07 |
| UF-06 Arrears | SCR-110 filter Level ≥2 → select lot → ledger peek → actions (call log, hold, plan, refer) → referral modal → status chip | WF-08 |
| UF-07 Invoice approval | SCR-111 upload PDF → AI extraction review SCR-303 → code → submit → (committee) SCR-156 approve on phone → SCR-111 batch → submit (MFA) | WF-09, WF-25 |
| UF-08 AGM | SCR-115 new AGM → agenda from template → motions → issue notice → owners vote SCR-157 → open/close → tally → publish minutes → SCR-154 | WF-11 |
| UF-09 Campaign | SCR-117 new → audience filters (live count) → compose → preview → test send → send → delivery stats | WF-12 |
| UF-10 Resident request → completion | SCR-261/SCR-153 raise → SCR-209 triage (P2) → SCR-212 assign (compliance gate) → SCR-251/252 accept, check-in, photos, complete → SCR-211 verify → requester sees completion with photo | WF-17, WF-18 |
| UF-11 PPM | SCR-207 create plan (monthly, lead 7 d) → SCR-208 planner shows 52 weeks → nightly job creates WO → technician notified | WF-16 |
| UF-12 Variation approval | SCR-211 request approval (amount > NTE) → client SCR-215 approve → WO resumes | WF-21 |
| UF-13 Lifecycle plan | SCR-206 generate (start year, escalation) → review matrix → adjust lines → publish → export PDF/CSV | WF-22 |
| UF-14 Assistant | SCR-301 ask → streaming answer with citations → action proposal card ("Create task for …") → Confirm → toast with link | WF-23 |
| UF-15 Draft reply | SCR-302 paste/select email → Draft → edit → Send via email provider | WF-24 |
| UF-16 Import | SCR-008 choose type → download template → upload → dry-run errors grid → fix & re-upload → commit → summary | WF-01 |
