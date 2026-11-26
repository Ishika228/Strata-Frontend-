# Integration Authentication

| Direction | Mechanism | Details |
|---|---|---|
| Partner → Vertex API | OAuth2 client credentials (Keycloak confidential client) | Scopes per client; `tid` claim fixed to tenant; optional property scope; secrets rotated 90 d |
| Provider → Vertex webhook | HMAC-SHA256 | Header signature over `timestamp.body`, ±5 min tolerance, constant-time compare, per-provider secret |
| Vertex → provider API | API key / OAuth2 client creds / mTLS (bank, prod) | Credentials in secret manager; fetched at startup & cached; never logged |
| Vertex → subscriber webhook | HMAC-SHA256 (`X-Vertex-Signature`) | Per-subscription secret |
| Vertex → LLM | API key | Server-side only; egress allow-list |

Key rotation: dual-secret overlap window (old + new valid for 24 h) for HMAC secrets.
