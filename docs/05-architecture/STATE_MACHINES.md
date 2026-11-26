# State Machines (canonical)

Implemented as declarative transition tables (`src/<module>/*.states.ts`); every transition audited and emits `<entity>.<to_state>` event. Illegal transition → 409 `INVALID_STATE_TRANSITION`.

| ID | Entity | States | Transitions (from → to : actor/guard) |
|---|---|---|---|
| SM-01 | Budget | draft, proposed, approved, superseded | draft→proposed (mgr); proposed→approved (mgr, `strata.budget.approve`); proposed→draft; approved→superseded (new version approved) |
| SM-02 | LevyRun | pending, running, completed, failed | pending→running (scheduler); running→completed/failed |
| SM-03 | Charge | issued, part_paid, paid, overdue, written_off, void | issued→part_paid/paid (allocation); issued/part_paid→overdue (due passed, job); overdue→part_paid/paid; any unpaid→void (reversal, acct) ; overdue→written_off (mgr) |
| SM-04 | Payment | pending, succeeded, failed, reconciled, refunded | pending→succeeded/failed (webhook); succeeded→reconciled (rec); succeeded→refunded (acct) |
| SM-05 | BankTransaction | unmatched, suggested, matched, excluded | unmatched→suggested (auto); suggested/unmatched→matched (auto exact / acct); any→excluded (acct, reason) ; matched→unmatched (unmatch before lock) |
| SM-06 | Reconciliation | draft, balanced, locked | draft→balanced (difference=0); balanced→locked (acct); balanced→draft (change) |
| SM-07 | ArrearsCase | open(level 0..3), on_hold, referred, resolved, written_off | open level↑ (job); open→on_hold (plan/dispute); on_hold→open; open(L3)→referred (mgr); any→resolved (balance 0); referred→written_off |
| SM-08 | DebtReferral | pending, sent, acknowledged, in_progress, settled, closed, withdrawn | per provider webhooks; withdrawn by mgr |
| SM-09 | SupplierInvoice | received, coded, pending_approval, approved, scheduled, paid, rejected, on_hold, void | received→coded; coded→pending_approval / approved (auto rule); pending_approval→approved/rejected; approved→scheduled (batch); scheduled→paid; *→on_hold↔prev; rejected→coded (resubmit); received/coded→void |
| SM-10 | ApprovalRequest | pending, approved, rejected, expired, cancelled | pending→approved/rejected (approver); pending→expired (job); pending→cancelled (requester) |
| SM-11 | PaymentBatch | draft, submitted, processed, partially_failed, failed | adapter results |
| SM-12 | QuoteRequest / Quote | QR: open, closed, awarded, cancelled · Q: requested, submitted, accepted, declined, expired | contractor submits; mgr accepts (others → declined) |
| SM-13 | StrataWorkOrder | draft, issued, accepted, completed, invoiced, closed, cancelled | see PROCUREMENT_AND_INVOICES |
| SM-14 | Meeting | draft, notice_issued, open, closed, minutes_published, cancelled | mgr |
| SM-15 | Motion | draft, open, closed, carried, lost | open with meeting; close → tally → carried/lost |
| SM-16 | ServiceRequest | submitted, triaged, converted, rejected, duplicate, closed | coordinator; converted closes when WO closed |
| SM-17 | WorkOrder (FM) | new, assigned, accepted, declined, in_progress, on_hold, awaiting_approval, completed, verified, closed, cancelled | see WORK_MANAGEMENT guards |
| SM-18 | Assignment | offered, accepted, declined, withdrawn, done | assignee/coordinator |
| SM-19 | MaintenanceSchedule | planned, generated, skipped, completed | job/WO close |
| SM-20 | ComplianceRecord | pending_review, verified, rejected, expired | verifier; job sets expired |
| SM-21 | Supplier compliance_status | compliant, expiring, non_compliant | derived (BR-SUP-01) |
| SM-22 | AssetPlan | draft, published, superseded | mgr |
| SM-23 | ImportJob | uploaded, validating, validated, failed, committing, committed, rolled_back | admin/job |
| SM-24 | Campaign | draft, tested, scheduled, sending, sent, cancelled | test send required before scheduled/sending |
| SM-25 | AIActionProposal | proposed, confirmed, executed, failed, discarded, expired(15 min) | user confirms; executor runs via service layer |
| SM-26 | AIDraft | generated, edited, sent, discarded | user |
| SM-27 | Tenant | provisioning, active, suspended, offboarding, deleted | platform_admin |
| SM-28 | Period | open, closed | acct (requires locked recs) |
