# UX States

| State | Pattern | Example |
|---|---|---|
| Loading (L) | Skeletons matching layout; spinners only for < 1 s actions; long jobs show progress with job id | Levy run progress bar |
| Empty (E) | Illustration-free message + primary action + help link | "No schemes yet — Create scheme or Import" |
| Error (Er) | Inline field errors; page-level Problem `title` + `traceId` copy button; retry for 5xx/503 | Bank import failed: TEMPLATE_MISMATCH |
| Conflict (409) | Non-destructive banner "This item changed — reload" with diff | VERSION_CONFLICT on WO |
| Permission (P) | Hide unavailable actions; disabled with tooltip only when user needs to know (e.g. approval limit) | "Above your approval limit ($5,000)" |
| Not found | 404 page; never reveal existence | Out-of-scope lot |
| Offline | Banner + queued count; read cached; writes queued with clientEventId | Field app |
| Partial data | "Some data unavailable" chip when a widget fails | Dashboard tile error |
| Success (S) | Toast with link to result; for financial ops show reference numbers | "Batch PB-0012 submitted (4 payments)" |
| Pending external | Status chip "Awaiting bank / provider" | Payment pending webhook |
| AI streaming | Token stream; tool-call steps ("Looking up arrears…"); citations appear as resolved; "AI can make mistakes — verify" footer | Assistant |
| AI refusal / no-source | Clear statement "I couldn't find this in documents you can access" | RAG |
| Budget exceeded | Disabled assistant with admin contact | 429 AI_BUDGET_EXCEEDED |
| Destructive confirm | Typed confirmation for lock/close/void/write-off | "Type LOCK" |
