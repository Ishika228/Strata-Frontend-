# Meetings & Voting (F-ST-10)

Evidence: meeting management powered by StrataVote — automated agendas/minutes from templates, online or onsite (EV-045); digital voting, ballot outcomes via API (EV-046); AGM docs in portal (EV-037). Statutory rules UNKNOWN (U-24) ⚖. POC implements a **native** module (C-11).

## Entities
Meeting{type: agm|egm|committee, scheme, scheduled_at, mode: online|onsite|hybrid, location, video_link, notice_sent_at, record_date, quorum_rule, status}
Motion{meeting, number, title, text, resolution_type: ordinary|special|unanimous|committee, weighting: per_lot|entitlement, secret_ballot, status, result}
Ballot{motion, lot, voter_contact, proxy_id?}, Vote{ballot, choice: for|against|abstain, cast_at, channel}
Proxy{meeting, grantor_lot, proxy_contact, file}

## Lifecycle
Meeting: `draft → notice_issued → open → closed → minutes_published`, `cancelled`.
Motion: `draft → open → closed → carried | lost`.

## Rules
- Notice period default 21 days (AGM) / 7 days (committee), configurable per jurisdiction.
- Eligible voters: owners of lots on record date; one ballot per lot; co-owners → first nominated owner votes (configurable).
- Financial check (optional): lot with overdue levies at record date excluded from ordinary motions.
- Quorum: % of lots represented (default 25%) — checked at open.
- Tally per BR-ST-19; entitlement weighting uses lot entitlement.
- Secret ballot: audit stores that a vote was cast, not its value; vote values readable only by tally service.
- Vote changes allowed until motion closes (last vote wins), audited.

## Documents
Agenda generated from template (merge: scheme, date, motions) → PDF in documents (visibility: owners). Minutes template merges attendance, quorum, motion results → published to portal.

## Inbound results (parity)
`POST /api/v1/strata/motions/{id}/results` for external voting providers (idempotent by provider ballot id).
