# Rollback

| Situation | Action |
|---|---|
| App bug after deploy, schema compatible | Redeploy previous image digest (ECS/Helm rollback) — < 5 min |
| Bad migration (expand phase) | Forward-fix migration; app N-1 still works by design |
| Data corruption by job | Pause queue (`pnpm queue:pause <name>`), identify via audit/outbox, corrective reversal journals (never delete ledger), replay if needed |
| Severe | Restore PITR snapshot into new instance, verify invariants (INV-01..05), switch DNS; RPO 24 h / RTO 4 h (NFR-20) |
| Feature misbehaving | Disable via feature flag (e.g. `ai.assistant`) without deploy |

Rollback decision owner: on-call engineer; communicate in #vertex-poc channel; post-incident review within 3 days.
