# Product Model

```
                         VERTEX PLATFORM (shared)
   Tenancy · Identity/SSO · RBAC · Documents · Notifications · Audit
   Search · Tasks/Notes · Imports · API/Webhooks · AI Gateway · Reporting
                 │                                   │
        ┌────────┴────────┐                 ┌────────┴────────┐
        │  VERTEX STRATA  │                 │    VERTEX FM    │
        ├─────────────────┤                 ├─────────────────┤
        │ Register        │                 │ Regions/Props   │
        │ Budget & Funds  │                 │ Locations       │
        │ Levies          │                 │ Assets & Plans  │
        │ Receipts/Bank   │                 │ PPM / Planner   │
        │ Arrears         │                 │ Service Desk    │
        │ Trust Ledger/GL │                 │ Work Orders     │
        │ Creditors/AP    │                 │ SLA / Ops Centre│
        │ Procurement     │                 │ Workforce       │
        │ Meetings/Voting │                 │ Approvals       │
        │ Comms           │                 │ Compliance      │
        │ Owner Portal    │                 │ Customer Portal │
        │ Insurance/Compl │                 │ Analytics / CRM │
        └────────┬────────┘                 └────────┬────────┘
                 └──────────────┬────────────────────┘
                                ▼
                      COMMON SERVICES
   Suppliers & Contractor Compliance · Contacts · Service Requests intake
   Approvals engine · Scheduler · Outbox/Events · Integration adapters
```

## Module ownership

| Module | Owns entities | Evidence | Status |
|---|---|---|---|
| platform.tenancy | Tenant, Membership, Branding | EV-015 | INFERRED → PROPOSED |
| platform.identity | User, Session, IdP config | EV-006 | CONFIRMED capability / PROPOSED impl |
| platform.rbac | Role, Permission, RoleAssignment(scope) | EV-041 "Serious Security" | PROPOSED |
| platform.documents | Document, DocumentVersion, DocumentAcl | EV-014, EV-037 | CONFIRMED / PROPOSED |
| platform.notifications | Notification, Template, ContactPreference | EV-022, EV-092 | CONFIRMED / PROPOSED |
| platform.audit | AuditEvent | EV-013 | CONFIRMED / PROPOSED |
| platform.tasks | Task, Note, TimelineEntry | EV-012 | CONFIRMED |
| platform.imports | ImportJob | EV-009, EV-093 | CONFIRMED |
| platform.integration | WebhookSubscription, OutboxEvent, ExternalRef, ApiClient | EV-007, EV-008 | CONFIRMED / PROPOSED |
| platform.ai | AIConversation, AIMessage, AICitation, AIDraft, AIExtraction, AIToolCall, AIActionProposal, Embedding | EV-110..118 | PROPOSED |
| common.suppliers | Supplier, SupplierUser, ComplianceRecord, ComplianceType | EV-053, EV-077 | CONFIRMED |
| common.approvals | ApprovalRequest, ApprovalStep | EV-040, EV-090 | CONFIRMED / PROPOSED engine |
| strata.* | see [../06-database/DOMAIN_MODEL.md](../06-database/DOMAIN_MODEL.md) §B | EV-020..060 | |
| fm.* | see DOMAIN_MODEL §C | EV-070..099 | |

## Cross-domain rules
- A tenant may license Strata, FM or both (`tenant.products[]`). PROPOSED.
- Suppliers are tenant-level and shared by Strata and FM (one compliance record set). PROPOSED (reasoning: same contractors serve both; EV-053, EV-077).
- Strata owners may raise maintenance requests (EV-035); in the POC a Strata service request may be **escalated** into an FM work order when the tenant has FM. PROPOSED (mirrors W08 "updates via Community app", EV-083).
- Modules communicate through in-process service interfaces and domain events via the outbox; no cross-module table writes. PROPOSED.
