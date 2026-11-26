# Source Inventory

Date of research: 2026-11-20. Research performed for the **independent "Vertex Strata + Vertex FM" POC** — an Urbanise-style product built from public evidence only. No Urbanise source code, private API, credential, tenant data or internal document was used.

## 1. Execution framework (the invoked Skill)

The Skill invoked for this run is `reverse-engineer-anything` (REA). Its tooling targets **shipped artifacts** (native binaries, ASAR/JS bundles, APKs, captures). It is *not* an Urbanise-specific documentation skill, and no shipped artifact was in scope, so no REA engine/tool calls were made (the Skill itself says to skip REA tooling when there is no artifact). The Skill's **method** was applied throughout:

| REA principle | How it is applied in this package |
|---|---|
| Separate observations, inferences and unknowns | Every finding carries CONFIRMED / OBSERVED / INFERRED / PROPOSED / UNKNOWN |
| Cite Evidence IDs | `EV-###` IDs in [EVIDENCE_REGISTER.md](EVIDENCE_REGISTER.md), referenced by every downstream doc |
| Keep a finding ledger with search boundary | [WEB_SOURCE_REGISTER.md](WEB_SOURCE_REGISTER.md) records what each page did / did not contain |
| Bounded negative searches stay bounded | "Not stated on page" ≠ "does not exist" — recorded as UNKNOWN |
| Never imply static evidence observed execution | Marketing statements are classed as *public claims*, not observed behaviour |
| Revisit the checklist; mark answered / partial / unresolved | [RESEARCH_GAPS.md](RESEARCH_GAPS.md), [BUILD_READINESS_REPORT.md](BUILD_READINESS_REPORT.md) |

> If a separate Urbanise-specific Skill exists in another profile, it was not present in this session's skill list. See RESEARCH_GAPS G-01.

## 2. Local workspace files

| Path | Type | Count | Notes |
|---|---|---|---|
| `D:\Vertex Strata & Vertex FM\` | folder | **0 files** | Workspace was empty at start (`find . -type f` → 0). No DOCX/PDF/XLSX/MD/images, no prior audit, no screenshots, no notes were supplied. |

**Consequence:** Priority-1 (direct authorized product observation) and Priority-3/4 (screenshots, prior audits) evidence tiers are **empty**, except for product screenshots embedded in the public Community flyer PDF (W15) and the public sample report (W16).

## 3. Web sources processed

19 public sources were processed (17 HTML pages + 2 PDFs). Details: [WEB_SOURCE_REGISTER.md](WEB_SOURCE_REGISTER.md).

| Tier | Sources |
|---|---|
| Priority 2 — official Urbanise website / product material | W01–W19 (all on urbanise.com or urbanisestrata.cloud, the Urbanise-owned partner microsite) |
| Priority 5 — third-party | none used (app-store, LinkedIn, Merlo.ai and Atlassian links noted, not fetched) |
| Priority 6/7 — inference / proposal | Produced in this package, always labelled |

## 4. Sources identified but not processed

| URL | Reason |
|---|---|
| urbanise.atlassian.net service desk | Customer-gated help content; not authorized |
| /urbanise-strata-log-in, /mycommunity-log-in | Authenticated product; not authorized |
| /investor-centre-* (ASX announcements, reports) | Financial/corporate; low product value for POC (backlog item G-12) |
| /pplatform-updates pages 2–5 | Bounded: page 1 read only (G-08) |
| Remaining 15 case studies, /blog, /news, /testimonials | Bounded for cost; G-09 |
| App Store / Google Play listings | Third-party; G-10 |
| ISO 27001 certificate PDF | Existence of certification already stated on pages |
