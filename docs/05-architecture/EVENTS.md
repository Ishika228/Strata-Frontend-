# Domain Events (outbox)

Envelope: `{id (uuid v7), type, version, tenant_id, occurred_at, actor{type,id}, subject{type,id}, data{...}, trace_id}`. Consumers must be idempotent on `id`. Public webhook event names = same `type` (subset marked W).

| Event | Producer | Consumers | W |
|---|---|---|---|
| tenant.created | platform | seed defaults | |
| import.committed | platform | search reindex, portal provisioning | |
| strata.scheme.created | strata | portal provision, chart-of-accounts seed | ✔ |
| strata.ownership.changed | strata | portal access update, AI index | ✔ |
| strata.budget.approved | strata | levy schedule generator | |
| strata.levy_run.completed | strata | notifications, documents | |
| strata.charge.issued | strata | payment-link creator | ✔ |
| strata.payment.succeeded | strata | allocation, receipt notification, arrears recalc | ✔ |
| strata.reconciliation.locked | strata | period close eligibility | |
| strata.arrears.level_changed | strata | notifications, tasks | ✔ |
| strata.arrears.referred | strata | collections adapter | |
| strata.invoice.pending_approval | strata/common | notifications (approver) | |
| strata.invoice.approved / rejected / paid | strata | ledger, notifications | ✔ |
| strata.meeting.notice_issued | strata | notifications, documents | ✔ |
| strata.motion.closed | strata | minutes generator | ✔ |
| strata.campaign.sent | strata | delivery tracking | |
| strata.service_request.created | strata | FM escalation (if enabled) | ✔ |
| fm.service_request.created | fm | triage queue, ack notification, outbound webhook | ✔ |
| fm.workorder.created / assigned / accepted / in_progress / on_hold / completed / verified / closed / cancelled | fm | SLA engine, notifications, resident-app adapter, analytics | ✔ |
| fm.sla.at_risk / breached | fm | notifications, tasks | ✔ |
| fm.maintenance_schedule.generated | fm | planner cache | |
| fm.approval.requested / decided | common | notifications, WO resume | ✔ |
| supplier.compliance.changed | common | assignment gate cache, reminders | ✔ |
| document.uploaded / scanned | platform | AV result, search & RAG indexer | |
| ai.action.executed | ai | audit | |
