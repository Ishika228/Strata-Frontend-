# Forms

Rules: React Hook Form + Zod schemas generated from OpenAPI; inline validation on blur; server errors mapped by `errors[].path`; submit disabled while pending; unsaved-changes guard; autosave drafts for long forms (budget, campaign, meeting).

| Form | Fields (required*) | Client validation | Server rules |
|---|---|---|---|
| Scheme | name*, registrationNo*, jurisdiction*, address*, fyStartMonth, levyFrequency*, firstDueDate*, gstRegistered | formats | DUPLICATE_SCHEME |
| Lot (grid) | lotNumber*, unitLabel, floor, building, entitlement*, type | entitlement ≥1 | DUPLICATE_LOT |
| Ownership transfer | lot*, newOwner (search/create)*, validFrom*, sharePct, type | share sums 100 | dates |
| Budget line | fund*, account*, amount*, note | ≥0 | CROSS_SCHEME_REFERENCE |
| Sundry charge | lot or debtor*, account*, fund, amount*, dueDate*, description* | >0 | — |
| Quick receipt | lot (search by CRN/lot/owner)*, amount*, method*, date*, reference | >0 | OVER_ALLOCATION (shown with allocation preview) |
| Arrears policy | levels[]: days*, minBalance*, template*, fee, action* | days ascending | — |
| Supplier invoice coding | supplier*, scheme*, invoiceNo*, invoiceDate*, dueDate, amount*, gst, fund*, account*, workOrder | GST ≤ amount; AU 1/11 warning | DUPLICATE_INVOICE |
| Supplier | name*, taxId, trades, email*, phone, address; bank (separate, MFA) | ABN checksum (AU) | unique taxId |
| Compliance record | type*, number, issuer, cover, issueDate, expiryDate*, file* | expiry > issue | min cover |
| Meeting | type*, scheme*, datetime*, mode*, location/link, recordDate, quorum% | notice period warning | — |
| Motion | number*, title*, body, resolutionType*, weighting, secretBallot | — | — |
| Campaign | name*, audience*, channels*, subject*, body*, signature | merge fields resolvable | TEST_SEND_REQUIRED |
| Service request (portal) | property/lot*, location, category*, description*, photos (≤5), access consent | sizes | — |
| Triage | priority*, category*, asset, NTE, convert | — | — |
| Assignment | technician XOR supplier*, start*, end | end > start | SUPPLIER_NON_COMPLIANT |
| WO completion | checklist items*, notes, photos (rule), time entries*, materials | evidence rule | EVIDENCE_REQUIRED |
| Asset | property*, location, type*, code*, name*, make, model, serial, installDate, warrantyExpiry, condition, criticality, replacementCost, photo, GPS | code unique | — |
| Maintenance plan | name*, target*, rrule*, leadDays*, duration*, checklist, assignee, priority*, trade, statutory | RRULE preview next 5 dates | INVALID_RRULE |
| SLA policy | name*, calendar*, targets per priority* | minutes > 0 | — |
| AI settings | enabled features, monthly budget, retention days | ≥0 | — |
