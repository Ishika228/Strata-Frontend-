# Integration Error Handling

| Scenario | Detection | Handling | User impact |
|---|---|---|---|
| Bank statement gap (opening ≠ prior closing) | import validation | Import blocked; task "missing statement" | Rec cannot lock |
| Statement duplicate | unique (account, date) / bank_ref | Skip duplicates; report count | none |
| Payment webhook for unknown charge | lookup fails | Record payment unallocated to lot credit (if lot known) else suspense account 2900; task | Accountant resolves |
| Payment amount ≠ intent | compare | Accept actual amount; allocate; flag | none |
| Payment batch item failed | provider status | Invoice back to `approved`; notify accountant | re-batch |
| Collections provider down | retries exhausted | Referral `pending`, DLQ | Manager sees warning |
| Resident app unknown property | mapping miss | 422 to client with `UNKNOWN_PROPERTY_REF`; no record | Client fixes map |
| Resident app photo URL unreachable | download fails | Create request without photo; note added | minor |
| Webhook subscriber failing | retries | Backoff → disable; email admin | Subscriber re-sync via API |
| LLM timeout/outage | errors | Circuit breaker; assistant shows unavailable | AI only |
| Email bounce | provider event | Contact email flagged invalid; fallback channel; task | Manager updates contact |

DLQ UI (Settings › Integrations): list failed jobs with payload preview (redacted), error, attempts; actions retry / discard (audited).
