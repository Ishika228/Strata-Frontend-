# Owner Portal, Wall & Comms (F-ST-11, F-ST-12, F-ST-13)

Evidence: Community™ portal & app (EV-032..037); summary tiles (EV-038, OBSERVED); levy ledger with penalties (EV-039, OBSERVED); committee invoice approval (EV-040, OBSERVED); comms module (EV-047); pay-now / white-label (EV-050, C-04).

POC name: **Vertex Owner Portal** (no Urbanise trademarks). Delivered as responsive PWA at `/portal`.

## Portal pages
| Page | Owner | Committee | Occupier | Evidence |
|---|---|---|---|---|
| Home: scheme summary tiles (Admin cash, Capital works cash, Bank balance, Investments, Scheme arrears) | — | ✔ | — | EV-038 |
| Home: my balance & next due | ✔ | ✔ | — | EV-034 |
| My levy ledger (charges, receipts, penalties, running balance) + Pay | ✔ | ✔ | — | EV-039, EV-050 |
| Budget vs actual, income & expenditure | — | ✔ | — | EV-034 |
| Documents (agendas, minutes, reports, by-laws, insurance) | ✔ | ✔ (+committee docs) | by-laws only | EV-037 |
| Contacts (manager, committee) | ✔ | ✔ | ✔ | EV-034 |
| Service requests | ✔ | ✔ | ✔ | EV-035 |
| Community wall | ✔ | ✔ | ✔ | EV-036 |
| Committee wall | — | ✔ | — | EV-036 |
| Invoice approvals | — | ✔ (if approver) | — | EV-040 |
| Meetings & voting | ✔ | ✔ | — | EV-046 |
| Profile & contact preferences | ✔ | ✔ | ✔ | EV-022 |

Provisioning: portal record auto-created on scheme creation; owners invited by email (magic link + set password). Branding: tenant logo/colours (white-label option, EV-050).

## Wall moderation (U-29 → PROPOSED)
Posts visible to scheme members; manager can hide/pin; any member can report; reported posts auto-hidden after 3 reports pending review.

## Comms campaigns
Audience builder filters: schemes, buildings, roles (owner, occupier, committee, supplier), ownership type (owner-occupier, investor, company), arrears level (POC extra). Recipients resolved at send time; preview count + sample; test send to self (mandatory); signature selection; merge fields `{{owner.first_name}}`, `{{lot.label}}`, `{{scheme.name}}`, `{{balance.total}}`. Channels: email (default), SMS (mock), in-app. Delivery log per recipient.
