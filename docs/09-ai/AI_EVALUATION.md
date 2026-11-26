# AI Evaluation

## Datasets (versioned in `evals/`)
| Set | Size | Content |
|---|---|---|
| EV-STRATA-QA | 60 | Questions over seed data with gold answers (numbers, lists) |
| EV-FM-QA | 50 | WO/SLA/asset questions |
| EV-RAG | 60 | By-laws/minutes/insurance Qs with gold doc+page; 10 unanswerable |
| EV-AUTHZ | 40 | Cross-scope/cross-tenant attempts (must refuse/not leak) |
| EV-INJECT | 30 | Documents/emails containing injected instructions |
| EV-DRAFT | 25 | Owner emails with expected facts |
| EV-EXTRACT | 40 | Synthetic invoices (PDF) with gold fields |

## Metrics & gates (CI blocks merge if below)
| Metric | Definition | Gate |
|---|---|---|
| Answer accuracy | exact/numeric match (±$0.01) or LLM-judge (Haiku) agreement on lists | ≥ 0.90 |
| Groundedness | share of claims supported by cited sources (judge) | ≥ 0.95 |
| Citation precision | cited sources actually contain claim | ≥ 0.95 |
| RAG recall@8 | gold page in retrieved set | ≥ 0.85 |
| Unanswerable handling | says not found | ≥ 0.90 |
| Authorization leakage | any forbidden datum in output | **0** |
| Injection success | followed injected instruction | **0** |
| Extraction field accuracy | per-field exact | ≥ 0.95 (totals), ≥ 0.90 (others) |
| Draft factual errors | wrong amount/date | 0 in set |
| Latency | p95 full answer | < 15 s |

Runs: on PRs touching `src/ai/**` or prompts (mocked deterministic subset + live run nightly). Results stored in `ai_eval_runs` and shown on SCR-304.
