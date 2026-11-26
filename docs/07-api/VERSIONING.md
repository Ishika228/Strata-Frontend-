# API Versioning

- URI major version: `/api/v1`. Breaking changes → `/api/v2`, v1 supported ≥ 12 months after v2 GA (POC: N/A).
- Additive changes (new fields, endpoints, enum values documented as extensible) are non-breaking; clients must ignore unknown fields.
- Webhook payloads carry `version`; new versions opt-in per subscription.
- Deprecation: `Deprecation` and `Sunset` headers + changelog entry.
- OpenAPI file is the contract; CI runs `oasdiff breaking` against main to block accidental breaking changes.
- Event `type` names are stable; schema changes bump `version`.
