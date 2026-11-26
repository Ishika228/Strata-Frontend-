# Document RAG — Document Types & Access

| Document kind | Product | Typical questions | Default visibility | Indexed |
|---|---|---|---|---|
| By-laws | Strata | pets, parking, renovations, noise | owners | ✔ |
| AGM/EGM minutes & agendas | Strata | "When was the painting levy approved?" | owners | ✔ |
| Committee minutes | Strata | committee decisions | committee | ✔ |
| Insurance policies/certificates | Strata | sum insured, excess, expiry | owners | ✔ |
| Financial reports (generated) | Strata | balances at date | committee | ✔ (structured preferred via tools) |
| Supplier contracts | Both | term, rates | staff | ✔ |
| Building plans / O&M manuals | FM | maintenance procedures | staff | ✔ |
| Compliance certificates | FM/Common | expiry, cover | staff | metadata only |
| Photos | FM | — | — | ✘ |
| Invoices | Strata | — | staff | ✘ (extraction pipeline instead) |

Access rules = document authorization (BR-SH-03). The assistant is staff-only in the POC; owner-facing AI (portal Q&A over by-laws) is backlog BL-13 and would reuse the same filters with owner visibility levels.

Citation UX: chip `[By-laws 2024 · p.7]` → opens document viewer at page with chunk highlighted.

Deletion/retention: chunk rows removed within 10 min of document deletion (event-driven) — test DOC-07.
