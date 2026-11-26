# Common Services

## Documents (F-SH-04; EV-014, EV-037)
- `Document{id, tenant, title, kind (agenda, minutes, by_law, insurance, report, invoice, notice, photo, certificate, plan, other), mime, size, sha256, storage_key, version, visibility, linked[{entity_type, entity_id}], uploaded_by, scan_status: pending|clean|infected, ai_indexed_at}`; `DocumentVersion`; `DocumentAcl{principal_type: role|user|contact, principal_id, perm}`.
- Upload: pre-signed PUT to quarantine bucket → AV scan (ClamAV) → magic-number type check (allow-list: pdf, png, jpg, heic→jpg, docx, xlsx, csv) → max 25 MB → move to clean bucket → index for search and RAG (if `kind` in RAG allow-list).
- Download: API authorizes (BR-SH-03) then issues 5-minute signed GET URL with `Content-Disposition: attachment` for non-images.

## Notifications (F-SH-05; EV-022, EV-092)
- `NotificationTemplate{key, channel, locale, subject, body (Handlebars-safe subset)}`; `Notification{recipient_contact/user, channel, template, payload, status: queued|sent|delivered|failed|bounced, provider_id}`; `ContactPreference{contact, channel_order[], opt_outs[]}`.
- Dispatcher worker: resolve preference → render → provider adapter (SMTP/Mailpit, SMS mock, in-app websocket/SSE) → retries (3, exponential) → status webhooks.
- In-app notification centre (SCR-006) with unread counts.

## Audit (F-SH-06; EV-013)
- `AuditEvent{id, tenant, occurred_at, actor_type: user|system|api_client|ai, actor_id, on_behalf_of?, action, entity_type, entity_id, before jsonb?, after jsonb?, ip, user_agent, trace_id, prev_hash, hash}`.
- Append-only: app role has INSERT/SELECT only; hash chain `hash = sha256(prev_hash || canonical_json(event))` per tenant; nightly verifier job.
- Sensitive reads audited: owner ledger viewed by staff, bank details, exports, AI tool calls.
- Field redaction: bank account numbers, tokens, passwords never stored in before/after.

## Search (F-SH-07)
- Postgres `tsvector` columns + `pg_trgm` on names/numbers; unified `search_index(tenant_id, entity_type, entity_id, title, body, scope_keys[], tsv)` maintained by triggers/outbox consumer.
- Query applies permission scope filter (scope_keys ∩ user's scopes) before ranking. Results: type, title, subtitle, link.

## Tasks, notes & automation (F-SH-08; EV-012)
- `Task{title, description, assignee_user, due_at, status: open|done|cancelled, priority, linked_entity, source: manual|rule}`, `Note{entity, body, author, visibility}`, `TimelineEntry` (projection of audit + notes + comms per entity).
- Automation rules (POC fixed catalog, configurable thresholds): arrears L2 → call task; invoice pending > 5 days → reminder task; insurance expiry 60 d → renewal task; compliance expiring → supplier reminder; WO at-risk → coordinator task.

## Imports (F-SH-09; EV-009, EV-093)
- `ImportJob{type, file_document, status: uploaded→validating→validated|failed→committing→committed|rolled_back, dry_run_report, stats}`.
- Templates (POC-defined columns, Urbanise's UNKNOWN): schemes, buildings, lots, contacts_ownerships, insurance_policies, levy_settings, opening_balances, suppliers, regions, properties, locations, assets.
- Commit in a single transaction per job (≤ 50k rows) and `import_job_id` stamped on rows for rollback.

## Scheduler & outbox
- `outbox_events{id, tenant, type, payload, created_at, published_at}` written in same transaction as state change; relay publishes to BullMQ queues; consumers idempotent by event id.
- Scheduled jobs (BullMQ repeatable): levy-run (daily 02:00 tenant tz), arrears (03:00), penalties (1st 04:00), ppm-generate (01:00), sla-monitor (*/5 min), compliance-expiry (05:00), report-schedules (*/15 min), bank-import poll (hourly), audit-verify (06:00), ai-reindex (*/10 min).
