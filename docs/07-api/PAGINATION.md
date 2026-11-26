# Pagination

Cursor-based (keyset) for all list endpoints.
- Request: `?limit=25&cursor=<opaque>`; `limit` 1–100, default 25.
- Response: `{ "data": [...], "nextCursor": "eyJ...", "hasMore": true }`.
- Cursor = base64url(JSON `{sort values of last row, id}`) + HMAC to prevent tampering; bound to the same filter/sort hash (mismatch → 400 `INVALID_CURSOR`).
- Default sort `-createdAt,id`; stable tie-breaker `id`.
- `?include=total` (opt-in) returns `total` using a capped count (≤ 10,000, else `"10000+"`).
- Reports and exports use streaming (`format=csv`) rather than pagination.
