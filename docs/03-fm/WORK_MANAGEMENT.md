# FM Work Management (F-FM-04..08, F-FM-10)

## Service request
`ServiceRequest{id, tenant, property, location?, asset?, source: portal|staff|email|api, external_ref?, requester_contact, category, description, photos[], access_consent{granted, window, granted_at}, status}`
States: `submitted → triaged → converted | rejected | duplicate → closed`. (EV-083, EV-084, EV-086)

## Work order
`WorkOrder{id, number (WO-000123), type: reactive|planned|inspection|project, property, location, asset?, priority P1–P4, category, description, source_request?, maintenance_schedule?, sla_policy, response_due_at, complete_due_at, nte_amount, status, hold_reason?, cost totals}`

State machine (also in [../05-architecture/STATE_MACHINES.md](../05-architecture/STATE_MACHINES.md)):
```
new → assigned → accepted → in_progress → completed → verified → closed
  \→ awaiting_approval (from new|in_progress) → (approved) previous | (rejected) cancelled
  in_progress ⇄ on_hold (SLA paused)
  assigned → declined → new (re-dispatch)
  any (pre-completed) → cancelled
```
Transition guards:
| Transition | Guard |
|---|---|
| → assigned | assignee is technician or compliant contractor (BR-FM-07) |
| → accepted | by assignee only |
| → in_progress | check-in recorded (time, optional GPS) |
| → completed | checklist required items done; evidence rule BR-FM-08; time entries > 0 |
| → verified | fm_coordinator or fm_client (if property setting `client_verification`) |
| → awaiting_approval | cost estimate > NTE (BR-FM-09) |

## Assignment
`Assignment{work_order, assignee_type: technician|supplier, technician_id?, supplier_id?, scheduled_start, scheduled_end, status: offered|accepted|declined|withdrawn|done}`. One active assignment per WO in POC (multi-crew backlog BL-05).

## Planned maintenance
`MaintenancePlan{name, target: asset|asset_type@location|location, rrule (iCal), lead_days, duration_minutes, checklist_template, default_assignee, priority, is_statutory, sla_policy}`
Occurrences: `MaintenanceSchedule{plan, due_date, status: planned|generated|skipped|completed, work_order_id}` — rows materialised 52 weeks ahead nightly; WOs created at lead time (BR-FM-04). Planner aggregates `duration_minutes` per week per trade.

## SLA
`SLAPolicy{name, client/property scope, calendar_id, targets[{priority, response_minutes, completion_minutes}]}`; `BusinessCalendar{timezone, weekly hours, holidays}`. Engine computes due timestamps by adding business minutes. Breach events recorded (WF-19).

## Client approvals
`ApprovalRequest{subject_type: quote|variation|invoice, subject_id, amount, currency, requested_by, approver_scope, status: pending|approved|rejected|expired, decided_by, decided_at, comment}` (shared with Strata invoice approvals).

## Inspections
`Inspection{work_order (type=inspection), template, results[{item, outcome: pass|fail|na, note, photo}]}`; failed item → optional follow-up reactive WO.

## Costs
`time_entries` (hours × technician rate), `material_lines` (qty × unit cost), supplier invoice amount (link). WO cost = Σ. Used in analytics (cost per property, per asset).
