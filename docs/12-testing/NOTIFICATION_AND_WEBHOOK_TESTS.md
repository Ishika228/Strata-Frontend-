# Notification & Webhook Tests

| ID | Case | Expected |
|---|---|---|
| NOT-01 | Levy notice → owner preferring email | Email with PDF link; in-app notification |
| NOT-02 | Preference SMS then email | SMS mock + email fallback on SMS failure |
| NOT-03 | Statutory notice to opted-out contact | Still sent (BR-SH-04) |
| NOT-04 | Marketing campaign to opted-out | Skipped, logged |
| NOT-05 | Assignment notification (planned job) | Technician notified (EV-092) |
| NOT-06 | SLA at-risk | Coordinator in-app + email |
| NOT-07 | Compliance expiry 30/14/1 days | 3 reminders, no duplicates |
| NOT-08 | Template merge missing field | Send blocked; error shown |
| NOT-09 | Email bounce | Contact flagged; task |
| NOT-10 | In-app unread counts real-time (SSE) | Updates < 2 s |
| WH-01 | Subscription receives subscribed events only | pass |
| WH-02 | Signature verifiable with secret | pass |
| WH-03 | Subscriber 500 → retries per schedule (clock-controlled) | 7 attempts then failed |
| WH-04 | Redeliver | delivered |
| WH-05 | 50 consecutive failures | auto-disabled + admin email |
| WH-06 | Payload PII limited to scope | pass |
| WH-07 | Timeout 10 s | treated as failure |
