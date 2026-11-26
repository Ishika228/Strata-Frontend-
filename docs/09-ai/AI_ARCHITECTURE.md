# AI Architecture (Independent POC)

## Evidence
Status: **UNKNOWN** — the public evidence does not establish Urbanise's AI implementation (EV-118). Partner architecture: external AI calling Urbanise's API with Urbanise as system of record (EV-113). The POC adopts the *system-of-record* principle but runs the AI in-process.

## Independent POC Proposal
```
User (staff SPA)
  ↓ HTTPS + JWT
Authentication (JWT validation)            ← same as all API calls
  ↓
Authorization (ai.assistant.use + tenant AI enabled + budget check)
  ↓
AI Gateway (ai/gateway.service.ts)
  ├─ Rate limit & budget (Redis)               
  ├─ Input guard: length, PII scrub of free text secrets, injection heuristics
  ↓
Intent Detection (claude-haiku-5-5, JSON output: {intent: qa_records|qa_docs|summary|draft|action|chitchat, product, entities})
  ↓
Tool Selection (Claude tool-use with an allow-listed tool set for intent + user permissions)
  ↓
Authorized Retrieval
  ├─ Record tools → domain services with user identity (RBAC/scope/RLS)
  └─ Document RAG → pgvector search filtered by tenant_id + scope_keys + visibility (SQL WHERE before ranking)
  ↓
Context Assembly (token budget 24k; records as compact JSON with source ids; doc chunks with [doc:id p:n] tags; untrusted-content delimiters)
  ↓
LLM (claude-sonnet-5-5, temperature 0.2, system prompt with rules; streaming)
  ↓
Validation
  ├─ Every [cite:…] id must exist in the retrieved set → else strip claim & flag
  ├─ Numbers in answer cross-checked against tool results (money/date regex) → mismatch → regenerate once, else warn
  ├─ Action proposals validated against JSON schema + permission pre-check
  └─ Output filter: no bank details, no other-tenant ids
  ↓
Citations (resolved to links: record pages or document viewer at page)
  ↓
Audit (ai.messages, ai.tool_calls, ai.citations, platform.audit_events actor_type=ai on_behalf_of=user)
```

### Components
| Component | Responsibility |
|---|---|
| `AiGatewayController` | SSE endpoint, conversation persistence |
| `IntentClassifier` | Haiku call, cached per message |
| `ToolRegistry` | Tool definitions (JSON schema), required permission, handler → service call |
| `Retriever` | Hybrid search (vector cosine + BM25 tsvector, reciprocal-rank fusion), top-k 8 |
| `ContextBuilder` | Budgeting, delimiting untrusted text |
| `LlmClient` | Anthropic SDK wrapper: retries (429/5xx, 3× expo), timeout 60 s, model from config, zero-retention header/contract where supported |
| `ResponseValidator` | Citation & number checks, schema checks |
| `ActionExecutor` | Executes confirmed proposals through domain services with user identity |
| `Indexer` (worker) | Chunk & embed documents on `document.scanned` events |
| `EvalRunner` | Offline evals in CI (AI_EVALUATION) |

### Configuration
`AI_MODEL_MAIN=claude-sonnet-5-5`, `AI_MODEL_FAST=claude-haiku-5-5`, `EMBEDDING_PROVIDER=voyage|local`, `EMBEDDING_DIM=1024`, `AI_MAX_CONTEXT_TOKENS=24000`, `AI_TENANT_MONTHLY_BUDGET_USD`. Models are configuration, swappable without code change.

## Reasoning
Tool-calling over the existing service layer guarantees the AI cannot see more than the user (no text-to-SQL), keeps business rules in one place, and makes citations exact (record ids). Human confirmation mirrors the publicly described review-before-send pattern.
