# Navigation

- **Staff console**: left sidebar (product sections, collapsible), top bar (tenant switcher, ⌘K search, assistant, notifications, help, profile). Breadcrumbs on detail pages. Entity pages use tabs; tab is reflected in URL (`/app/strata/schemes/:id/arrears`).
- **Deep links**: every entity has a canonical URL; notifications and emails link there; unauthorised → 404 page with "request access" hint.
- **Context carry-over**: selecting a scheme/property sets a context chip used by lists, reports and the AI assistant (can be cleared).
- **Portal/field apps**: bottom tab bar (≤5 tabs), back-stack navigation, pull-to-refresh, offline banner.
- **Keyboard**: ⌘K search, ⌘J assistant, `g s` schemes, `g w` work orders, `n` new item in lists, `/` focus filter.
- **Saved views**: list filters saved per user (localStorage + server for shared views — backlog).
- **Help**: "?" icon opens contextual help article link per screen (EV-005 pattern, POC static docs).

Route map (staff): `/app/strata/...`, `/app/fm/...`, `/app/common/...`, `/app/settings/...`; portal: `/portal/:schemeId/...`; field: `/field/jobs/:woId`.
