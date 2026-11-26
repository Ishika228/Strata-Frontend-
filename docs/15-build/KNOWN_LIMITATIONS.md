# Known Limitations (POC)

1. Built from **public evidence only** (19 web sources, 0 local files); no authorized product observation — UI and internal behaviour are independent designs.
2. Jurisdiction rules (levy calc, penalties, discounts, voting, notice periods, trust accounting) are configurable defaults, **not** legally validated (⚖).
3. All banking, payments, collections and resident-app integrations are mocks; no real money movement.
4. Not a statutory accounting product: no audited financial statements, BAS/GST lodgement, or trust audit reports.
5. PWA instead of native iOS/Android apps; no push notifications on iOS < 16.4.
6. No live GPS tracking of workforce; only check-in coordinates.
7. Single active assignment per WO; no multi-crew scheduling optimisation.
8. AI uses a third-party LLM (Anthropic); availability and cost depend on provider; owner-facing AI not included.
9. E-Services storefront, appointment booking, term deposits, M365 (Outlook/Teams) channels excluded.
10. Search uses Postgres FTS; no fuzzy multilingual search.
11. Reporting via SQL views & PDFs; no ad-hoc BI designer.
12. Import templates are POC-defined; not compatible with any vendor's templates.
13. Single region; no DR site.
14. Custom roles not supported (system roles only).
