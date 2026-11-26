# Ops Centre, Customer Portal & CRM (F-FM-05, F-FM-12, F-FM-14)

## Ops Centre (EV-071)
Live board for fm_manager / fm_coordinator. Widgets:
1. Open WOs by status (bar) — drill to list.
2. SLA: at-risk & breached counts with list (refresh 60 s).
3. Today's planned jobs vs completed.
4. Unassigned & declined WOs queue.
5. Awaiting client approval (age).
6. Supplier compliance alerts (expiring/non-compliant with assigned future jobs).
7. Technician availability (on shift, on job, off).
Filters: region, property, client, trade, priority.

## Customer portal (EV-084; W19 branded)
`/fm-portal` for `fm_client` users (service managers, residents, families):
- Raise request (property preselected by scope, location picker, category, description, photos, access consent).
- My requests: status timeline (submitted, triaged, scheduled, technician en-route/on-site, completed with photos/time), comment thread.
- Approvals inbox (approvers only).
- Reports (client managers): SLA compliance, jobs volume, spend (self-serve, EV-089).
Branding per tenant/client (logo, colours).

## CRM (EV-080)
`Contact` shared entity with `roles` (owner, tenant, resident, client_manager…), linked to properties/lots; history tab aggregates requests, WOs, communications, approvals.
