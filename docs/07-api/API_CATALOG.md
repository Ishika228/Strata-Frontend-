# API Catalog

For every capability: **Capability** status from evidence · **Actual Urbanise API: UNKNOWN** (EV-008 describes resource scope only; no endpoint paths, payloads or auth are public) · **POC API: PROPOSED** below. No row is an Urbanise endpoint.

Base URL `/api/v1`. Auth: Bearer JWT (users) or client-credentials token (integrations). All list endpoints support [PAGINATION](PAGINATION.md) and [FILTERING](FILTERING.md). Money-moving POSTs require `Idempotency-Key` ([IDEMPOTENCY](IDEMPOTENCY.md)) — marked 🔑.

## Platform
| Method | Path | Permission | FR | Capability evidence |
|---|---|---|---|---|
| GET | /me | authenticated | FR-SH-05 | — |
| POST | /me/tenant-switch | authenticated | FR-SH-01 | — |
| GET/POST | /tenants | platform.tenant.manage | FR-SH-01 | INFERRED EV-015 |
| PATCH | /tenants/{id} | platform.tenant.manage | FR-SH-01 | |
| GET/POST | /users | platform.user.manage | FR-SH-05 | |
| POST | /users/{id}/role-assignments | platform.user.manage | FR-SH-05 | |
| DELETE | /role-assignments/{id} | platform.user.manage | FR-SH-05 | |
| PUT | /settings/sso | platform.settings.manage | FR-SH-04 | CONFIRMED EV-006 |
| POST | /documents (init upload → presigned URL) | document.write | FR-SH-06 | CONFIRMED EV-014 |
| POST | /documents/{id}/complete | document.write | FR-SH-06 | |
| GET | /documents?entityType=&entityId= | document.read | FR-SH-06 | |
| GET | /documents/{id}/download | document.read | FR-SH-06 | |
| GET | /notifications | authenticated (own) | FR-SH-07 | CONFIRMED EV-092 |
| POST | /notifications/{id}/read | own | FR-SH-07 | |
| GET | /audit-events?entityType=&entityId= | platform.audit.read | FR-SH-09 | CONFIRMED EV-013 |
| GET | /search?q= | authenticated (scoped) | FR-SH-10 | |
| GET/POST/PATCH | /tasks, /tasks/{id} | task.manage | FR-SH-11 | CONFIRMED EV-012 |
| GET/POST | /notes?entityType=&entityId= | task.manage | FR-SH-11 | |
| GET | /timeline?entityType=&entityId= | read of entity | FR-SH-11 | |
| POST | /imports (type, documentId) | platform.import.run | FR-SH-12 | CONFIRMED EV-009 |
| POST | /imports/{id}/validate · /commit · /rollback | platform.import.run | FR-SH-12 | |
| GET | /imports/templates/{type} | platform.import.run | FR-SH-12 | |
| GET/POST/DELETE | /integration/clients | integration.client.manage | FR-SH-13 | CONFIRMED EV-007 |
| GET/POST/PATCH/DELETE | /webhooks/subscriptions | integration.client.manage | FR-SH-13 | |
| POST | /webhooks/subscriptions/{id}/test | integration.client.manage | FR-SH-13 | |

## Common
| Method | Path | Permission | FR | Evidence |
|---|---|---|---|---|
| GET/POST/PATCH | /suppliers, /suppliers/{id} | supplier.manage | FR-FM-12, FR-ST-16 | CONFIRMED EV-053 |
| PUT | /suppliers/{id}/bank-details (step-up MFA, dual control) | supplier.manage | FR-ST-16 | |
| GET/POST | /suppliers/{id}/compliance-records | supplier.compliance.upload | FR-FM-12 | CONFIRMED EV-077 |
| POST | /compliance-records/{id}/verify · /reject | supplier.compliance.verify | FR-FM-12 | |
| GET | /approvals?status=pending&mine=true | approver | FR-ST-16, FR-FM-13 | CONFIRMED EV-040, EV-090 |
| POST | /approvals/{id}/decision {approve|reject, comment} | strata.invoice.approve / fm.approval.decide | FR-ST-24, FR-FM-13 | OBSERVED EV-040 |

## Strata
| Method | Path | Permission | FR | Evidence |
|---|---|---|---|---|
| GET/POST | /strata/schemes | strata.scheme.read / manage | FR-ST-01 | CONFIRMED EV-029 |
| GET/PATCH | /strata/schemes/{id} | | FR-ST-01 | |
| GET/POST | /strata/schemes/{id}/buildings | | FR-ST-01 | OBSERVED |
| GET/POST | /strata/schemes/{id}/lots | strata.lot.read / scheme.manage | FR-ST-01 | |
| GET/PATCH | /strata/lots/{id} | | FR-ST-01 | |
| GET/POST | /strata/lots/{id}/ownerships | strata.contact.manage | FR-ST-01 | CONFIRMED EV-056 |
| POST | /strata/ownerships/{id}/end | strata.contact.manage | FR-ST-01 | |
| GET/POST | /strata/lots/{id}/occupancies | strata.contact.manage | FR-ST-01 | |
| GET/POST/PATCH | /contacts, /contacts/{id} | strata.contact.manage | FR-ST-01, FR-FM-17 | |
| GET | /strata/schemes/{id}/roll | strata.scheme.read | FR-ST-01 | |
| GET | /strata/schemes/{id}/funds | strata.ledger.read | FR-ST-03 | OBSERVED EV-038 |
| GET/POST | /strata/schemes/{id}/gl-accounts | strata.journal.post | FR-ST-15 | CONFIRMED EV-044 |
| GET/POST | /strata/schemes/{id}/budgets | strata.budget.edit | FR-ST-04 | CONFIRMED EV-020 |
| PUT | /strata/budgets/{id}/lines | strata.budget.edit | FR-ST-04 | |
| POST | /strata/budgets/{id}/propose · /approve | strata.budget.edit / approve | FR-ST-04 | |
| GET | /strata/budgets/{id}/levy-preview | strata.budget.edit | FR-ST-05 | |
| GET | /strata/schemes/{id}/levy-schedules | strata.ledger.read | FR-ST-05 | CONFIRMED EV-021 |
| POST | /strata/schemes/{id}/levy-runs 🔑 {periodDueDate} | strata.levy.issue | FR-ST-06 | |
| GET | /strata/levy-runs/{id} | strata.ledger.read | FR-ST-06 | |
| POST | /strata/charges 🔑 (sundry) | strata.levy.issue | FR-ST-07 | OBSERVED EV-030 |
| POST | /strata/charges/{id}/void | strata.journal.post | FR-ST-15 | |
| GET | /strata/lots/{id}/ledger?from=&to= | strata.ledger.read | FR-ST-23 | OBSERVED EV-039 |
| GET | /strata/lots/{id}/statement.pdf | strata.ledger.read | FR-ST-23 | |
| POST | /strata/payments 🔑 (manual receipt) | strata.payment.create | FR-ST-09 | CONFIRMED EV-042 |
| POST | /strata/payments/{id}/refund 🔑 | strata.payment.create | FR-ST-08 | |
| POST | /strata/bank-accounts/{id}/statements (upload) | strata.bank.reconcile | FR-ST-10 | CONFIRMED EV-051 |
| GET | /strata/bank-accounts/{id}/transactions?status= | strata.bank.reconcile | FR-ST-10 | |
| POST | /strata/bank-transactions/{id}/match · /unmatch · /exclude | strata.bank.reconcile | FR-ST-10 | |
| POST | /strata/bank-accounts/{id}/reconciliations {period} | strata.bank.reconcile | FR-ST-10 | |
| POST | /strata/reconciliations/{id}/lock | strata.bank.reconcile | FR-ST-11 | |
| POST | /strata/journals 🔑 | strata.journal.post | FR-ST-15 | CONFIRMED EV-043 |
| POST | /strata/journals/{id}/reverse 🔑 | strata.journal.post | FR-ST-15 | |
| POST | /strata/schemes/{id}/periods/{month}/close | strata.period.close | FR-ST-15 | |
| GET/PUT | /strata/schemes/{id}/arrears-policy | strata.arrears.manage | FR-ST-11 | CONFIRMED EV-024 |
| GET | /strata/arrears?schemeId=&level= | strata.arrears.manage | FR-ST-12 | |
| POST | /strata/arrears/{caseId}/hold · /release | strata.arrears.manage | FR-ST-14 | |
| POST | /strata/arrears/{caseId}/referrals | strata.arrears.refer | FR-ST-13 | CONFIRMED EV-026 |
| POST | /strata/lots/{id}/payment-plans | strata.arrears.manage | FR-ST-14 | |
| GET/POST | /strata/supplier-invoices | strata.invoice.code | FR-ST-16 | CONFIRMED EV-044 |
| PATCH | /strata/supplier-invoices/{id} (code) | strata.invoice.code | FR-ST-16 | |
| POST | /strata/supplier-invoices/{id}/submit | strata.invoice.code | FR-ST-16 | |
| GET | /strata/supplier-invoices/{id}/budget-remaining | strata.invoice.approve | FR-ST-16 | OBSERVED EV-040 |
| POST | /strata/payment-batches 🔑 · /{id}/submit 🔑 | strata.payment_batch.submit | FR-ST-17 | CONFIRMED EV-052 |
| GET/POST | /strata/quote-requests · /{id}/quotes | strata.workorder.manage / contractor | FR-ST-18 | CONFIRMED EV-053 |
| POST | /strata/quotes/{id}/accept | strata.workorder.manage | FR-ST-18 | |
| GET/POST/PATCH | /strata/work-orders | strata.workorder.manage | FR-ST-18 | |
| POST | /strata/work-orders/{id}/escalate-to-fm | strata.workorder.manage | FR-ST-18 | |
| GET/POST/PATCH | /strata/meetings | strata.meeting.manage | FR-ST-19 | CONFIRMED EV-045 |
| POST | /strata/meetings/{id}/issue-notice · /open · /close · /publish-minutes | strata.meeting.manage | FR-ST-19 | |
| GET/POST | /strata/meetings/{id}/motions | strata.meeting.manage | FR-ST-20 | |
| POST | /strata/motions/{id}/votes 🔑 | strata.vote.cast | FR-ST-20 | CONFIRMED EV-046 |
| POST | /strata/motions/{id}/results (inbound provider) | integration scope strata.voting:write | FR-ST-21 | CONFIRMED EV-046 |
| GET/POST/PATCH | /strata/campaigns | strata.campaign.send | FR-ST-22 | CONFIRMED EV-047 |
| POST | /strata/campaigns/audience-preview | strata.campaign.send | FR-ST-22 | |
| POST | /strata/campaigns/{id}/test-send · /send | strata.campaign.send | FR-ST-22 | |
| GET/POST | /strata/schemes/{id}/insurance-policies | strata.insurance.manage | FR-ST-26 | CONFIRMED EV-054 |
| GET/POST | /strata/schemes/{id}/compliance-items | strata.insurance.manage | FR-ST-26 | CONFIRMED EV-055 |
| GET | /strata/dashboard?schemeId= | strata.report.run | FR-ST-29 | CONFIRMED EV-031 |
| GET | /strata/reports/{key}?format=json|pdf|csv | strata.report.run | FR-ST-27, FR-ST-30 | OBSERVED EV-028 |
| GET/POST/DELETE | /strata/report-schedules | strata.report.run | FR-ST-28 | CONFIRMED EV-027 |

## Owner portal (`/portal`, owner/committee/occupier)
| Method | Path | Permission | FR | Evidence |
|---|---|---|---|---|
| GET | /portal/me (lots, schemes, roles) | portal user | FR-ST-23 | CONFIRMED EV-032 |
| GET | /portal/schemes/{id}/summary | committee_member | FR-ST-24 | OBSERVED EV-038 |
| GET | /portal/lots/{id}/ledger | owner (own) | FR-ST-23 | OBSERVED EV-039 |
| POST | /portal/payments/intent 🔑 {chargeIds[]} | owner (own) | FR-ST-08 | CONFIRMED EV-050 |
| GET | /portal/documents | ACL | FR-ST-23 | CONFIRMED EV-037 |
| GET | /portal/contacts | portal user | FR-ST-23 | CONFIRMED EV-034 |
| GET/POST | /portal/service-requests | portal user | FR-ST-23 | CONFIRMED EV-035 |
| GET/POST | /portal/walls/{wall}/posts · POST /portal/wall-posts/{id}/report | portal user | FR-ST-25 | CONFIRMED EV-036 |
| GET | /portal/approvals | committee approver | FR-ST-24 | OBSERVED EV-040 |
| GET | /portal/meetings · /portal/motions/{id} | owner | FR-ST-20 | CONFIRMED EV-046 |
| PUT | /portal/preferences | portal user | FR-SH-07 | CONFIRMED EV-022 |
| GET | /pay/{token} (public, token-scoped) | payment link token | FR-ST-08 | CONFIRMED EV-050 |

## FM
| Method | Path | Permission | FR | Evidence |
|---|---|---|---|---|
| GET/POST/PATCH | /fm/regions, /fm/properties, /fm/properties/{id} | fm.property.manage | FR-FM-01 | CONFIRMED EV-093 |
| GET/POST/PATCH | /fm/properties/{id}/locations, /fm/locations/{id} | fm.property.manage | FR-FM-01 | |
| GET/POST | /fm/asset-types | fm.asset.manage | FR-FM-02 | |
| GET/POST/PATCH | /fm/assets, /fm/assets/{id} | fm.asset.read / manage | FR-FM-02 | CONFIRMED EV-072 |
| GET | /fm/assets/{id}/history | fm.asset.read | FR-FM-02 | |
| GET/POST | /fm/asset-plans · POST /fm/asset-plans/{id}/generate · /publish | fm.assetplan.manage | FR-FM-03 | CONFIRMED EV-073 |
| GET/POST/PATCH | /fm/maintenance-plans | fm.maintenanceplan.manage | FR-FM-04 | CONFIRMED EV-075 |
| GET | /fm/planner?from=&weeks=52&propertyId=&trade= | fm.workorder.read | FR-FM-05 | CONFIRMED EV-075 |
| GET/POST | /fm/service-requests | fm.request.create / triage | FR-FM-06 | CONFIRMED EV-084 |
| POST | /fm/service-requests/{id}/triage {priority, category, assetId, convert:true} | fm.request.triage | FR-FM-07 | CONFIRMED EV-085 |
| POST | /fm/service-requests/{id}/reject · /mark-duplicate | fm.request.triage | FR-FM-07 | |
| GET/POST/PATCH | /fm/work-orders, /fm/work-orders/{id} | fm.workorder.read / manage | FR-FM-08 | CONFIRMED EV-085 |
| POST | /fm/work-orders/{id}/assign {technicianId|supplierId, start, end} | fm.workorder.assign | FR-FM-12 | CONFIRMED EV-078 |
| POST | /fm/work-orders/{id}/transitions {to, reason?, clientEventId} | per transition | FR-FM-08 | |
| POST | /fm/work-orders/{id}/evidence | fm.workorder.execute | FR-FM-10 | CONFIRMED EV-085 |
| POST | /fm/work-orders/{id}/time-entries · /materials | fm.workorder.execute | FR-FM-08 | |
| POST | /fm/work-orders/{id}/approval-requests | fm.workorder.manage | FR-FM-13 | CONFIRMED EV-090 |
| GET | /fm/me/work-orders?status= | technician/contractor (own) | FR-FM-10 | CONFIRMED EV-081 |
| POST | /fm/me/sync (batched offline events) 🔑 | technician/contractor | FR-FM-10 | |
| GET/POST/PATCH | /fm/sla-policies, /fm/calendars | fm.sla.manage | FR-FM-09 | CONFIRMED EV-098 |
| GET/POST | /fm/technicians | fm.workorder.assign | FR-FM-11 | CONFIRMED EV-074 |
| GET | /fm/dispatch-board?date= | fm.workorder.assign | FR-FM-11 | |
| GET/POST | /fm/inspection-templates · /fm/work-orders/{id}/inspection | fm.maintenanceplan.manage / execute | FR-FM-14 | INFERRED |
| GET | /fm/ops-centre?regionId=&propertyId= | fm.workorder.read | FR-FM-15 | CONFIRMED EV-071 |
| GET | /fm/analytics/{metric}?groupBy=&from=&to= | fm.analytics.read | FR-FM-16 | CONFIRMED EV-079 |
| GET | /fm/contacts/{id}/history | fm.workorder.read | FR-FM-17 | CONFIRMED EV-080 |
| GET/POST | /fm/portal/requests | fm_client | FR-FM-06 | CONFIRMED EV-084 |

## AI
| Method | Path | Permission | FR | Evidence |
|---|---|---|---|---|
| POST | /ai/conversations | ai.assistant.use | FR-AI-01 | announced EV-110 |
| POST | /ai/conversations/{id}/messages (SSE stream) | ai.assistant.use | FR-AI-02..04 | CONFIRMED (partner) EV-114 |
| POST | /ai/action-proposals/{id}/confirm · /discard | ai.assistant.use + target permission | FR-AI-01 | PROPOSED |
| POST | /ai/drafts {sourceEmail, contactId?} | ai.draft.create | FR-AI-05 | CONFIRMED (partner) EV-113 |
| PATCH | /ai/drafts/{id} · POST /ai/drafts/{id}/send | ai.draft.create | FR-AI-05 | |
| POST | /ai/extractions {documentId, kind:'supplier_invoice'} | strata.invoice.code | FR-AI-06 | announced EV-111 |
| POST | /ai/extractions/{id}/confirm | strata.invoice.code | FR-AI-06 | |
| GET/PUT | /ai/settings | ai.settings.manage | FR-AI-01 | CONFIRMED EV-116 |
| GET | /ai/usage | ai.settings.manage | NFR-19 | |

## Integrations (inbound)
| Method | Path | Auth | FR | Evidence |
|---|---|---|---|---|
| POST | /integrations/payments/{provider}/webhook | HMAC | FR-IN-02 | CONFIRMED EV-050 |
| POST | /integrations/bank/{provider}/statements | client creds / mTLS (prod) | FR-IN-01 | CONFIRMED EV-023, EV-051 |
| POST | /integrations/collections/{provider}/webhook | HMAC | FR-IN-03 | CONFIRMED EV-026 |
| POST | /integrations/resident-apps/{provider}/requests 🔑 | client creds `fm.requests:write` | FR-IN-05 | CONFIRMED EV-086, EV-087 |
| GET | /integrations/resident-apps/{provider}/requests/{externalId} | client creds | FR-IN-05 | |

**Total: ~190 operations** across ~150 paths. OpenAPI definitions for the core subset: [OPENAPI.yaml](OPENAPI.yaml).
