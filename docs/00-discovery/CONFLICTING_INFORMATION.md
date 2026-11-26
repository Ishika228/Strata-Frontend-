# Conflicting Information

Resolution rule: source priority (P1 direct observation → P7 POC proposal). Where unresolved, status stays **UNKNOWN / CONFLICT** and the POC makes an explicit, labelled design choice that does **not** alter the evidence.

| ID | Topic | Source A | Source B | Analysis | Status | POC handling |
|---|---|---|---|---|---|---|
| C-01 | Native AI availability | W02: "now AI capability"; W08: "Deep AI and machine learning" | W04: "Urbanise AI is coming" (roadmap); W05: AI delivered by partner Merlo | Same priority (P2). Homepage claim may refer to partner AI or FM analytics. Native Strata AI GA status cannot be determined. | **UNKNOWN / CONFLICT** | POC builds its own AI gateway (F-AI-01) regardless; no claim about Urbanise AI status |
| C-02 | Years of experience | W02: "20+ years experience" | W04: "10+ Years Serving the Strata Industry" | Different scopes (company vs strata vertical). | Resolved — not a true conflict | Not used |
| C-03 | Market | W03/W04: Australia & NZ strata | W02: clients in 18 countries; teams in UAE, Europe, South Africa | Strata = AU/NZ; FM = multi-region (case studies: Al Mouj, Emrill, Sodexo). INFERRED. | Resolved (INFERRED) | POC: Strata AU-first (multi-jurisdiction config), FM region-agnostic; currency & timezone per tenant |
| C-04 | Owner portal identity | W01/W03/W15: "Community™" portal & app | W06: "new Owners Portal", white-labelled, payment journey | Unclear whether W06 replaces, extends, or is a separate NAB-branded portal. | **UNKNOWN / CONFLICT** | POC: single "Owner Portal" (Community-style) with optional white-label branding per tenant |
| C-05 | FM mobile apps | W08: "Workforce FM App" (own team) | W08: "Force App" (suppliers/contractors) | Possibly two apps or two names for one. | **UNKNOWN / CONFLICT** | POC: one mobile PWA with role-based views (technician vs contractor) |
| C-06 | Job vs Work Order | W07/W08: "jobs", "planned jobs" | W11/W17/W18/W19: "work orders" | Synonyms in practice (W19 uses both). | Resolved — synonym | Canonical entity `WorkOrder`; UI label configurable ("Job") |
| C-07 | Banking partner | W01: Macquarie Bank integration | W04/W06: NAB strategic partnership; "choice of banking integrations" | Multiple banks supported; not mutually exclusive. | Resolved (INFERRED: multi-bank) | POC: bank-agnostic adapter + mock bank |
| C-08 | Payment availability | W15: owners can "view and pay levies" (current flyer) | W06: pay-now links & owners portal rolled out "in stages" | Payment rails existing vs new NAB-based ones unclear. | **UNKNOWN** | POC: mock payment provider with pay-now link |
| C-09 | Page currency | W01–W03, W07: © 2024 | W05/W06: © 2026 | Some pages may be stale; W07 latest item Mar 2024. | Noted | Prefer newer pages when describing roadmap status |
| C-10 | TVRG volumes | W11: 13,500+ requests to date | W11: 5,000 WOs in first 3 months | Different time windows; not reconciled on page. | Noted (no impact) | Not used as requirement |
| C-11 | Voting ownership | W03/W12: meetings "powered by StrataVote" (partner) | W05: Merlo "supports digital voting"; API accepts ballot outcomes | Voting may be partner-hosted with results written back. | **UNKNOWN** | POC: native meetings + voting module (F-ST-10), plus inbound ballot-result API for parity |

Evidence was **not** changed to resolve any conflict.
