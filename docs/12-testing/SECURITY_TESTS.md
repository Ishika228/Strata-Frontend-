# Security, RBAC, Tenant Isolation & Document Access Tests (incl. negative tests)

## Security (SEC)
| ID | Case | Expected |
|---|---|---|
| SEC-01 | SQL injection payloads in q/filter params | No error leakage; parameterised; 0 rows / 400 |
| SEC-02 | XSS in wall post / notes / campaign body | Escaped on render; CSP blocks inline |
| SEC-03 | CSRF on cookie-less bearer API | N/A (bearer); refresh endpoint uses SameSite=strict + origin check |
| SEC-04 | Mass assignment (`tenantId`, `status`, `approvalLimit` in body) | 422 UNKNOWN_FIELD |
| SEC-05 | Brute force login | Lockout after 5 |
| SEC-06 | JWT `alg:none` / wrong key | 401 |
| SEC-07 | Webhook replay (old timestamp) | 401 |
| SEC-08 | Supplier bank details change without step-up | 403 MFA_STEP_UP_REQUIRED |
| SEC-09 | Bank change by single user then payment | Requires second approver; 24 h hold |
| SEC-10 | Upload EICAR file | infected; not downloadable |
| SEC-11 | Upload polyglot (PDF header + JS) / mime spoof | Rejected by magic-byte check |
| SEC-12 | Attempt UPDATE on audit_events as app role | Permission denied; verifier detects tampering in test DB |
| SEC-13 | Secrets in repo (gitleaks) | none |
| SEC-14 | Logs contain password/token/bank number | none (log assertion) |
| SEC-15 | Security headers present | CSP, HSTS, XCTO, frame-ancestors |
| SEC-16 | ZAP baseline | no high |
| SEC-17 | Rate limit on pay link endpoint | 429 |
| SEC-18 | Pay link token for lot A used for charge of lot B | 403 |
| SEC-20 | TLS config | TLS ≥ 1.2 only |
| SEC-21 | Encrypted columns unreadable in DB dump | ciphertext only |
| SEC-30 | Tenant export & deletion | Export complete; purge leaves no rows except retained financial archive |

## RBAC negative (RBAC-N)
RBAC-N01..N10 defined in [../04-shared-platform/RBAC.md](../04-shared-platform/RBAC.md), plus:
| ID | Case | Expected |
|---|---|---|
| RBAC-N11 | Occupier attempts vote | 403 NOT_ELIGIBLE |
| RBAC-N12 | Owner lists /strata/schemes (staff API) | 403 |
| RBAC-N13 | fm_client sees WO cost of other client | 404 |
| RBAC-N14 | Revoked role still in active token | Denied within 60 s (server-side roles) |
| RBAC-N15 | Contractor views owner phone numbers beyond job site contact | Fields absent |
| RBAC-N16 | Committee member of scheme A lists portal approvals | Only scheme A |

## Tenant isolation (TEN)
| ID | Case | Expected |
|---|---|---|
| TEN-01 | GET entity by id from other tenant (every resource type, generated) | 404 |
| TEN-02 | List endpoints never include other tenant rows | pass |
| TEN-03 | Search for other tenant's unique scheme name | 0 hits |
| TEN-04 | Signed document URL from tenant 1 used by tenant 2 session | URL expires/opaque; API authorization required to obtain |
| TEN-05 | DB query without `app.tenant_id` set | 0 rows (RLS) |
| TEN-06 | Job payload with tampered tenant id for entity of other tenant | Not found; alert |
| TEN-07 | AI retrieval with same-text doc in other tenant | Not retrieved |
| TEN-08 | Webhook subscription in tenant 1 never receives tenant 2 events | pass |
| TEN-09 | Cache key collision test | Isolated |
| TEN-10 | Import referencing other tenant ids | Rejected |
| TEN-11 | Reporting materialised views via security-barrier views | Scoped |
| TEN-12 | Write with mismatched tenant_id (WITH CHECK) | RLS violation |

## Document access (DOC)
| ID | Case | Expected |
|---|---|---|
| DOC-01 | Owner downloads by-law (owners visibility) | 200 |
| DOC-02 | Owner downloads committee-only minutes | 404 |
| DOC-03 | Occupier downloads insurance (owners only) | 404 |
| DOC-04 | Contractor downloads doc linked to their WO | 200; other WO doc 404 |
| DOC-05 | Pending-scan doc download | 409 |
| DOC-06 | Signed URL after 5 min | 403 from storage |
| DOC-07 | Deleted doc's RAG chunks | Removed ≤ 10 min |
| DOC-08 | Visibility downgraded | Re-index; AI no longer retrieves for lower roles |

## AI security (AISEC)
AISEC-01..11 per [../09-ai/AI_SECURITY.md](../09-ai/AI_SECURITY.md), executed via AIT-03/04/06/08/09/10/18/19/25 and EV-AUTHZ / EV-INJECT eval sets.
