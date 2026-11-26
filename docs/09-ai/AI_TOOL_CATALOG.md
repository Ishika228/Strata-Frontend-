# AI Tool Catalog

All tools: run as the invoking user; return `{data, sources:[{type, id, label, href}]}`; max 50 rows (truncated flag); errors `forbidden | not_found | invalid_args`. Write tools only create **proposals** (SM-25).

| Tool | Kind | Args | Required permission | Service called | Returns |
|---|---|---|---|---|---|
| search_records | read | q, types[] | scoped | SearchService | hits with ids |
| strata_get_scheme_summary | read | schemeId | strata.scheme.read | Strata.SchemeService | lots, funds balances, arrears total, open invoices, next meeting, insurance expiry |
| strata_get_lot_ledger | read | lotId, from?, to? | strata.ledger.read | LedgerService | lines, balance |
| strata_list_arrears | read | schemeId?, minLevel?, minBalance? | strata.arrears.manage | ArrearsService | cases with buckets |
| strata_get_owner_contact | read | lotId | strata.contact.manage | ContactService | names, email, phone (no bank) |
| strata_list_pending_invoices | read | schemeId?, status? | strata.invoice.code | InvoiceService | invoices |
| strata_budget_vs_actual | read | schemeId, fy | strata.report.run | ReportService | lines |
| strata_list_meetings | read | schemeId, upcoming? | strata.meeting.manage | MeetingService | meetings, motions, results |
| strata_compare_quotes | read | quoteRequestId | strata.workorder.manage | ProcurementService | normalised comparison |
| strata_insurance_status | read | schemeId | strata.insurance.manage | InsuranceService | policies & expiry |
| fm_list_work_orders | read | filters (status, priority, propertyId, slaState) | fm.workorder.read | WorkOrderService | WOs |
| fm_get_work_order | read | woId | fm.workorder.read | WorkOrderService | WO with timeline |
| fm_sla_at_risk | read | withinHours (≤72) | fm.workorder.read | SlaService | WOs predicted to breach |
| fm_get_asset | read | assetId or code | fm.asset.read | AssetService | asset, warranty, plan lines |
| fm_asset_history | read | assetId | fm.asset.read | AssetService | WOs, failures, costs |
| fm_supplier_compliance | read | supplierId? / expiringWithinDays | supplier.manage | SupplierService | statuses |
| fm_planner_week | read | weekStart, propertyId? | fm.workorder.read | PlannerService | occurrences, hours |
| search_documents | rag | query, kinds[]?, schemeId?/propertyId? | document.read | Retriever | chunks with doc/page |
| propose_task | write-proposal | title, entityRef, dueAt, assignee? | task.manage | TaskService (on confirm) | proposal id |
| propose_arrears_hold | write-proposal | caseId, reason, until | strata.arrears.manage | ArrearsService | proposal id |
| propose_service_request_triage | write-proposal | requestId, priority, category, assetId? | fm.request.triage | ServiceRequestService | proposal id |
| propose_work_order | write-proposal | propertyId, description, priority, assetId? | fm.workorder.manage | WorkOrderService | proposal id |

Tool availability = tools whose permission the user holds (others are not even shown to the model). Arguments validated with JSON Schema; ids must be UUIDs that resolve within scope.
