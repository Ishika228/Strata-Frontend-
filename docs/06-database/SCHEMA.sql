-- Vertex Strata + Vertex FM — POC reference schema (PostgreSQL 16)
-- INDEPENDENT DESIGN (PROPOSED). Not derived from any Urbanise schema (UNKNOWN, U-01).
-- Conventions: uuid PKs (uuid v7 generated in app), money = BIGINT cents, timestamps timestamptz,
-- every tenant-owned table has tenant_id + RLS policy (see bottom).

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS platform;
CREATE SCHEMA IF NOT EXISTS strata;
CREATE SCHEMA IF NOT EXISTS fm;
CREATE SCHEMA IF NOT EXISTS common;
CREATE SCHEMA IF NOT EXISTS ai;

-- ============ PLATFORM ============
CREATE TABLE platform.tenants (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  products text[] NOT NULL CHECK (products <@ ARRAY['strata','fm']::text[]),
  timezone text NOT NULL DEFAULT 'Australia/Brisbane',
  currency char(3) NOT NULL DEFAULT 'AUD',
  locale text NOT NULL DEFAULT 'en-AU',
  jurisdiction text NOT NULL DEFAULT 'AU-QLD',
  settings jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'provisioning' CHECK (status IN ('provisioning','active','suspended','offboarding','deleted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE platform.users (
  id uuid PRIMARY KEY,
  email citext UNIQUE,
  name text NOT NULL,
  phone text,
  kc_subject text UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('invited','active','disabled')),
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE platform.memberships (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  user_id uuid NOT NULL REFERENCES platform.users(id),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);

CREATE TABLE platform.role_assignments (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  membership_id uuid NOT NULL REFERENCES platform.memberships(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('platform_admin','tenant_admin','strata_manager','strata_accountant','committee_member','owner','occupier','fm_manager','fm_coordinator','technician','contractor','fm_client','auditor')),
  scope_type text NOT NULL CHECK (scope_type IN ('tenant','scheme','lot','region','property','supplier','client')),
  scope_id uuid,
  approval_limit_cents bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((scope_type = 'tenant') = (scope_id IS NULL))
);
CREATE INDEX ON platform.role_assignments (tenant_id, membership_id);

CREATE TABLE platform.contacts (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  kind text NOT NULL CHECK (kind IN ('person','company')),
  first_name text, last_name text, company_name text,
  email citext, phone text, postal_address jsonb,
  user_id uuid REFERENCES platform.users(id),
  roles text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz, version int NOT NULL DEFAULT 1
);
CREATE INDEX ON platform.contacts (tenant_id, email);
CREATE INDEX contacts_name_trgm ON platform.contacts USING gin ((coalesce(first_name,'')||' '||coalesce(last_name,'')||' '||coalesce(company_name,'')) gin_trgm_ops);

CREATE TABLE platform.contact_preferences (
  contact_id uuid PRIMARY KEY REFERENCES platform.contacts(id),
  tenant_id uuid NOT NULL,
  channel_order text[] NOT NULL DEFAULT ARRAY['email','in_app'],
  opt_outs text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE platform.documents (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  kind text NOT NULL,
  title text NOT NULL,
  mime text NOT NULL,
  size_bytes bigint NOT NULL CHECK (size_bytes <= 26214400),
  sha256 char(64) NOT NULL,
  storage_key text NOT NULL,
  version int NOT NULL DEFAULT 1,
  visibility text NOT NULL DEFAULT 'staff' CHECK (visibility IN ('staff','committee','owners','lot_owner','contractor','client','public_link')),
  scan_status text NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending','clean','infected','failed')),
  ai_indexed_at timestamptz,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE TABLE platform.document_links (
  tenant_id uuid NOT NULL, document_id uuid NOT NULL REFERENCES platform.documents(id),
  entity_type text NOT NULL, entity_id uuid NOT NULL,
  PRIMARY KEY (document_id, entity_type, entity_id)
);
CREATE INDEX ON platform.document_links (tenant_id, entity_type, entity_id);
CREATE TABLE platform.document_acl (
  tenant_id uuid NOT NULL, document_id uuid NOT NULL REFERENCES platform.documents(id),
  principal_type text NOT NULL CHECK (principal_type IN ('role','user','contact')),
  principal_id text NOT NULL, perm text NOT NULL CHECK (perm IN ('read','write')),
  PRIMARY KEY (document_id, principal_type, principal_id, perm)
);

CREATE TABLE platform.notification_templates (
  id uuid PRIMARY KEY, tenant_id uuid, key text NOT NULL, channel text NOT NULL, locale text NOT NULL DEFAULT 'en-AU',
  subject text, body text NOT NULL, UNIQUE (tenant_id, key, channel, locale)
);
CREATE TABLE platform.notifications (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL,
  recipient_user_id uuid, recipient_contact_id uuid,
  channel text NOT NULL CHECK (channel IN ('email','sms','in_app','post')),
  template_key text NOT NULL, payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','delivered','failed','bounced','read')),
  provider_id text, attempts int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), sent_at timestamptz
);
CREATE INDEX ON platform.notifications (tenant_id, recipient_user_id, status);

CREATE TABLE platform.audit_events (
  id uuid PRIMARY KEY, tenant_id uuid, occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_type text NOT NULL CHECK (actor_type IN ('user','system','api_client','ai')),
  actor_id text, on_behalf_of uuid, action text NOT NULL,
  entity_type text, entity_id uuid, before jsonb, after jsonb,
  ip inet, user_agent text, trace_id text,
  prev_hash char(64), hash char(64) NOT NULL
);
CREATE INDEX ON platform.audit_events (tenant_id, entity_type, entity_id, occurred_at);

CREATE TABLE platform.tasks (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, title text NOT NULL, description text,
  assignee_user_id uuid, due_at timestamptz, priority text DEFAULT 'normal',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','done','cancelled')),
  entity_type text, entity_id uuid, source text NOT NULL DEFAULT 'manual', rule_key text,
  created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
CREATE TABLE platform.notes (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, entity_type text NOT NULL, entity_id uuid NOT NULL,
  body text NOT NULL, visibility text NOT NULL DEFAULT 'staff', author_user_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE platform.import_jobs (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, type text NOT NULL, document_id uuid NOT NULL,
  file_sha256 char(64) NOT NULL,
  status text NOT NULL CHECK (status IN ('uploaded','validating','validated','failed','committing','committed','rolled_back')),
  dry_run_report jsonb, stats jsonb, created_by uuid, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE platform.api_clients (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, kc_client_id text NOT NULL UNIQUE,
  scopes text[] NOT NULL, scope_property_ids uuid[], status text NOT NULL DEFAULT 'active'
);
CREATE TABLE platform.webhook_subscriptions (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, api_client_id uuid REFERENCES platform.api_clients(id),
  url text NOT NULL CHECK (url LIKE 'https://%'), event_types text[] NOT NULL,
  secret_enc bytea NOT NULL, status text NOT NULL DEFAULT 'active', failure_count int NOT NULL DEFAULT 0
);
CREATE TABLE platform.webhook_deliveries (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, subscription_id uuid NOT NULL, event_id uuid NOT NULL,
  attempt int NOT NULL, status_code int, status text NOT NULL, next_attempt_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subscription_id, event_id, attempt)
);
CREATE TABLE platform.external_refs (
  tenant_id uuid NOT NULL, provider text NOT NULL, external_id text NOT NULL,
  entity_type text NOT NULL, entity_id uuid NOT NULL,
  PRIMARY KEY (tenant_id, provider, external_id)
);
CREATE TABLE platform.outbox_events (
  id uuid PRIMARY KEY, tenant_id uuid, type text NOT NULL, version int NOT NULL DEFAULT 1,
  subject_type text, subject_id uuid, payload jsonb NOT NULL, trace_id text,
  created_at timestamptz NOT NULL DEFAULT now(), published_at timestamptz
);
CREATE INDEX outbox_unpublished ON platform.outbox_events (created_at) WHERE published_at IS NULL;
CREATE TABLE platform.integration_events (
  id uuid PRIMARY KEY, tenant_id uuid, provider text NOT NULL, provider_event_id text NOT NULL, type text NOT NULL,
  payload jsonb NOT NULL, status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','processed','failed','ignored')),
  received_at timestamptz NOT NULL DEFAULT now(), processed_at timestamptz, UNIQUE (provider, provider_event_id)
);
CREATE TABLE platform.processed_events (consumer text NOT NULL, event_id uuid NOT NULL, processed_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (consumer, event_id));
CREATE TABLE platform.idempotency_keys (
  tenant_id uuid NOT NULL, key text NOT NULL, actor_id text NOT NULL, method text NOT NULL, path text NOT NULL,
  request_hash char(64) NOT NULL, response_status int, response_body jsonb, created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, actor_id, key)
);
CREATE TABLE platform.search_index (
  tenant_id uuid NOT NULL, entity_type text NOT NULL, entity_id uuid NOT NULL,
  title text NOT NULL, subtitle text, body text, scope_keys text[] NOT NULL, tsv tsvector,
  PRIMARY KEY (tenant_id, entity_type, entity_id)
);
CREATE INDEX ON platform.search_index USING gin (tsv);
CREATE INDEX ON platform.search_index USING gin (scope_keys);

-- ============ COMMON ============
CREATE TABLE common.suppliers (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, tax_id text, trades text[] NOT NULL DEFAULT '{}',
  email citext, phone text, address jsonb, bank_account_enc bytea, bank_account_last4 char(4),
  bank_details_changed_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  compliance_status text NOT NULL DEFAULT 'non_compliant' CHECK (compliance_status IN ('compliant','expiring','non_compliant')),
  created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz,
  UNIQUE (tenant_id, tax_id)
);
CREATE TABLE common.compliance_types (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, code text NOT NULL, name text NOT NULL,
  requires_expiry boolean NOT NULL DEFAULT true, min_cover_cents bigint,
  applies_to_trades text[], applies_to_property_flags text[], UNIQUE (tenant_id, code)
);
CREATE TABLE common.compliance_records (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, supplier_id uuid NOT NULL REFERENCES common.suppliers(id),
  type_id uuid NOT NULL REFERENCES common.compliance_types(id), number text, issuer text, cover_cents bigint,
  issue_date date, expiry_date date, document_id uuid,
  status text NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review','verified','rejected','expired')),
  verified_by uuid, verified_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON common.compliance_records (tenant_id, supplier_id, status, expiry_date);
CREATE TABLE common.approval_requests (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, subject_type text NOT NULL CHECK (subject_type IN ('supplier_invoice','quote','variation','budget')),
  subject_id uuid NOT NULL, amount_cents bigint NOT NULL, approver_scope jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','expired','cancelled')),
  requested_by uuid, decided_by uuid, decided_at timestamptz, comment text, expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE common.service_requests (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, domain text NOT NULL CHECK (domain IN ('strata','fm')),
  number text NOT NULL, scheme_id uuid, lot_id uuid, property_id uuid, location_id uuid, asset_id uuid,
  source text NOT NULL CHECK (source IN ('portal','staff','email','api')),
  requester_contact_id uuid, category text NOT NULL, description text NOT NULL,
  access_consent jsonb, status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','triaged','converted','rejected','duplicate','closed')),
  work_order_id uuid, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, number)
);

-- ============ STRATA ============
CREATE TABLE strata.schemes (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, registration_no text NOT NULL,
  jurisdiction text NOT NULL, address jsonb NOT NULL, fy_start_month smallint NOT NULL DEFAULT 7 CHECK (fy_start_month BETWEEN 1 AND 12),
  levy_frequency text NOT NULL DEFAULT 'quarterly' CHECK (levy_frequency IN ('monthly','quarterly','half_yearly','annual')),
  first_due_date date, lead_days smallint NOT NULL DEFAULT 30, gst_registered boolean NOT NULL DEFAULT false,
  settings jsonb NOT NULL DEFAULT '{}',  -- thresholds, penalty, discount, voting config
  status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, version int NOT NULL DEFAULT 1,
  UNIQUE (tenant_id, jurisdiction, registration_no)
);
CREATE TABLE strata.buildings (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL REFERENCES strata.schemes(id), name text NOT NULL, address jsonb);
CREATE TABLE strata.lots (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL REFERENCES strata.schemes(id),
  building_id uuid REFERENCES strata.buildings(id), lot_number text NOT NULL, unit_label text, floor_label text,
  entitlement integer NOT NULL CHECK (entitlement > 0), lot_type text NOT NULL DEFAULT 'residential',
  crn text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz,
  UNIQUE (scheme_id, lot_number), UNIQUE (tenant_id, crn)
);
CREATE TABLE strata.ownerships (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, lot_id uuid NOT NULL REFERENCES strata.lots(id), contact_id uuid NOT NULL REFERENCES platform.contacts(id),
  share_pct numeric(5,2) NOT NULL DEFAULT 100, ownership_type text NOT NULL DEFAULT 'owner_occupier' CHECK (ownership_type IN ('owner_occupier','investor','company')),
  is_primary boolean NOT NULL DEFAULT true, valid_from date NOT NULL, valid_to date
);
CREATE INDEX ON strata.ownerships (tenant_id, contact_id) WHERE valid_to IS NULL;
CREATE TABLE strata.occupancies (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, lot_id uuid NOT NULL REFERENCES strata.lots(id), contact_id uuid NOT NULL, valid_from date NOT NULL, valid_to date);
CREATE TABLE strata.committee_memberships (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, contact_id uuid NOT NULL, position text, valid_from date NOT NULL, valid_to date);
CREATE TABLE strata.funds (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL REFERENCES strata.schemes(id), type text NOT NULL CHECK (type IN ('admin','capital_works','other')), name text NOT NULL);
CREATE UNIQUE INDEX one_admin_cw_fund ON strata.funds (scheme_id, type) WHERE type IN ('admin','capital_works');
CREATE TABLE strata.gl_accounts (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, code text NOT NULL, name text NOT NULL,
  type text NOT NULL CHECK (type IN ('asset','liability','equity','income','expense')), fund_id uuid, UNIQUE (scheme_id, code)
);
CREATE TABLE strata.bank_accounts (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, bank text NOT NULL, bsb text NOT NULL,
  account_no_enc bytea NOT NULL, account_last4 char(4) NOT NULL, gl_account_id uuid NOT NULL REFERENCES strata.gl_accounts(id)
);
CREATE TABLE strata.periods (tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, month date NOT NULL, status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')), PRIMARY KEY (scheme_id, month));
CREATE TABLE strata.journal_entries (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, entry_date date NOT NULL, period date NOT NULL,
  source_type text NOT NULL, source_id uuid, memo text, reversal_of uuid REFERENCES strata.journal_entries(id),
  posted_by text NOT NULL, posted_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE strata.ledger_lines (
  id bigserial PRIMARY KEY, tenant_id uuid NOT NULL, journal_entry_id uuid NOT NULL REFERENCES strata.journal_entries(id),
  scheme_id uuid NOT NULL, account_id uuid NOT NULL REFERENCES strata.gl_accounts(id), fund_id uuid,
  lot_id uuid, debtor_contact_id uuid, supplier_id uuid, charge_id uuid,
  debit_cents bigint NOT NULL DEFAULT 0 CHECK (debit_cents >= 0), credit_cents bigint NOT NULL DEFAULT 0 CHECK (credit_cents >= 0),
  CHECK ((debit_cents = 0) <> (credit_cents = 0))
);
CREATE INDEX ON strata.ledger_lines (scheme_id, account_id);
CREATE INDEX ON strata.ledger_lines (lot_id) WHERE lot_id IS NOT NULL;
-- Balanced-entry constraint trigger (deferred) — see MIGRATIONS.md for function body:
-- CREATE CONSTRAINT TRIGGER je_balanced AFTER INSERT ON strata.ledger_lines DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION strata.assert_entry_balanced();
-- Period lock trigger: reject insert into journal_entries when periods.status='closed'.

CREATE TABLE strata.budgets (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, fiscal_year int NOT NULL, version int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','proposed','approved','superseded')),
  approved_by uuid, approved_at timestamptz, meeting_motion_id uuid, UNIQUE (scheme_id, fiscal_year, version)
);
CREATE TABLE strata.budget_lines (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, budget_id uuid NOT NULL REFERENCES strata.budgets(id) ON DELETE CASCADE, fund_id uuid NOT NULL, account_id uuid NOT NULL, amount_cents bigint NOT NULL CHECK (amount_cents >= 0), note text);
CREATE TABLE strata.levy_schedules (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, budget_id uuid, type text NOT NULL CHECK (type IN ('regular','special')), status text NOT NULL DEFAULT 'active');
CREATE TABLE strata.levy_schedule_items (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, schedule_id uuid NOT NULL REFERENCES strata.levy_schedules(id), lot_id uuid NOT NULL, fund_id uuid NOT NULL,
  instalment smallint NOT NULL, due_date date NOT NULL, amount_cents bigint NOT NULL CHECK (amount_cents >= 0),
  UNIQUE (schedule_id, lot_id, fund_id, instalment)
);
CREATE TABLE strata.levy_runs (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, period_due_date date NOT NULL, status text NOT NULL, stats jsonb, started_at timestamptz, finished_at timestamptz, UNIQUE (scheme_id, period_due_date));
CREATE TABLE strata.charges (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, lot_id uuid, debtor_contact_id uuid,
  type text NOT NULL CHECK (type IN ('levy','sundry','penalty','fee','discount')),
  fund_id uuid, levy_schedule_item_id uuid UNIQUE, levy_run_id uuid, description text,
  amount_cents bigint NOT NULL, outstanding_cents bigint NOT NULL, due_date date NOT NULL,
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued','part_paid','paid','overdue','written_off','void')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (lot_id IS NOT NULL OR debtor_contact_id IS NOT NULL)
);
CREATE INDEX ON strata.charges (tenant_id, lot_id, status, due_date);
CREATE TABLE strata.levy_notices (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, levy_run_id uuid NOT NULL, lot_id uuid NOT NULL, document_id uuid, pay_link_url text, total_cents bigint NOT NULL, UNIQUE (levy_run_id, lot_id));
CREATE TABLE strata.payments (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, lot_id uuid, payer_contact_id uuid,
  amount_cents bigint NOT NULL CHECK (amount_cents > 0), method text NOT NULL CHECK (method IN ('pay_link','bank_transfer','bpay_like','manual','direct_debit')),
  provider text, provider_ref text, status text NOT NULL CHECK (status IN ('pending','succeeded','failed','reconciled','refunded')),
  received_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id, provider, provider_ref)
);
CREATE TABLE strata.payment_allocations (payment_id uuid NOT NULL REFERENCES strata.payments(id), charge_id uuid NOT NULL REFERENCES strata.charges(id), tenant_id uuid NOT NULL, amount_cents bigint NOT NULL CHECK (amount_cents > 0), PRIMARY KEY (payment_id, charge_id));
CREATE TABLE strata.bank_statements (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, bank_account_id uuid NOT NULL, statement_date date NOT NULL, opening_cents bigint NOT NULL, closing_cents bigint NOT NULL, source text NOT NULL, file_sha256 char(64), UNIQUE (bank_account_id, statement_date));
CREATE TABLE strata.bank_transactions (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, statement_id uuid NOT NULL REFERENCES strata.bank_statements(id), bank_account_id uuid NOT NULL,
  txn_date date NOT NULL, amount_cents bigint NOT NULL, description text, reference text, bank_ref text,
  status text NOT NULL DEFAULT 'unmatched' CHECK (status IN ('unmatched','suggested','matched','excluded')),
  matched_type text, matched_id uuid, match_rule text, UNIQUE (bank_account_id, bank_ref)
);
CREATE TABLE strata.reconciliations (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, bank_account_id uuid NOT NULL, period date NOT NULL, statement_balance_cents bigint NOT NULL, ledger_balance_cents bigint NOT NULL, unpresented_cents bigint NOT NULL, outstanding_deposits_cents bigint NOT NULL, status text NOT NULL CHECK (status IN ('draft','balanced','locked')), locked_by uuid, locked_at timestamptz, UNIQUE (bank_account_id, period));
CREATE TABLE strata.arrears_policies (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid, levels jsonb NOT NULL, UNIQUE (tenant_id, scheme_id));
CREATE TABLE strata.arrears_cases (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, lot_id uuid NOT NULL UNIQUE, level smallint NOT NULL DEFAULT 0, status text NOT NULL CHECK (status IN ('open','on_hold','referred','resolved','written_off')), hold_reason text, balance_cents bigint NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE strata.arrears_actions (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, case_id uuid NOT NULL, level smallint NOT NULL, action text NOT NULL, notification_id uuid, fee_charge_id uuid, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE strata.payment_plans (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, lot_id uuid NOT NULL, instalments jsonb NOT NULL, status text NOT NULL CHECK (status IN ('active','completed','broken','cancelled')));
CREATE TABLE strata.debt_referrals (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, case_id uuid NOT NULL, provider text NOT NULL, external_id text, status text NOT NULL, amount_cents bigint NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE strata.quote_requests (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, title text NOT NULL, scope text NOT NULL, estimate_cents bigint, due_date date, status text NOT NULL);
CREATE TABLE strata.quotes (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, quote_request_id uuid NOT NULL, supplier_id uuid NOT NULL, amount_cents bigint, gst_cents bigint, valid_until date, document_id uuid, status text NOT NULL, UNIQUE (quote_request_id, supplier_id));
CREATE TABLE strata.work_orders (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, number text NOT NULL, supplier_id uuid NOT NULL, quote_id uuid, service_request_id uuid, scope text NOT NULL, approved_amount_cents bigint, status text NOT NULL, fm_work_order_id uuid, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id, number));
CREATE TABLE strata.supplier_invoices (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, supplier_id uuid NOT NULL, invoice_no text NOT NULL,
  invoice_date date NOT NULL, due_date date, amount_cents bigint NOT NULL CHECK (amount_cents > 0), gst_cents bigint NOT NULL DEFAULT 0,
  fund_id uuid, account_id uuid, work_order_id uuid, document_id uuid, ai_extraction_id uuid,
  status text NOT NULL CHECK (status IN ('received','coded','pending_approval','approved','scheduled','paid','rejected','on_hold','void')),
  created_at timestamptz NOT NULL DEFAULT now(), CHECK (gst_cents <= amount_cents)
);
CREATE UNIQUE INDEX supplier_invoice_dup ON strata.supplier_invoices (tenant_id, supplier_id, lower(invoice_no)) WHERE status <> 'void';
CREATE TABLE strata.payment_batches (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, status text NOT NULL, total_cents bigint NOT NULL, submitted_by uuid, submitted_at timestamptz);
CREATE TABLE strata.payment_batch_items (batch_id uuid NOT NULL, invoice_id uuid NOT NULL UNIQUE, tenant_id uuid NOT NULL, amount_cents bigint NOT NULL, status text NOT NULL, PRIMARY KEY (batch_id, invoice_id));
CREATE TABLE strata.meetings (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, type text NOT NULL CHECK (type IN ('agm','egm','committee')), scheduled_at timestamptz NOT NULL, mode text NOT NULL CHECK (mode IN ('online','onsite','hybrid')), location text, video_link text, record_date date, quorum_pct numeric(5,2) NOT NULL DEFAULT 25, status text NOT NULL, agenda_document_id uuid, minutes_document_id uuid);
CREATE TABLE strata.motions (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, meeting_id uuid NOT NULL REFERENCES strata.meetings(id), number int NOT NULL, title text NOT NULL, body text, resolution_type text NOT NULL CHECK (resolution_type IN ('ordinary','special','unanimous','committee')), weighting text NOT NULL DEFAULT 'per_lot', secret_ballot boolean NOT NULL DEFAULT false, status text NOT NULL, result jsonb, UNIQUE (meeting_id, number));
CREATE TABLE strata.proxies (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, meeting_id uuid NOT NULL, grantor_lot_id uuid NOT NULL, proxy_contact_id uuid NOT NULL, document_id uuid, UNIQUE (meeting_id, grantor_lot_id));
CREATE TABLE strata.votes (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, motion_id uuid NOT NULL REFERENCES strata.motions(id), lot_id uuid NOT NULL, voter_contact_id uuid NOT NULL, proxy_id uuid, choice text NOT NULL CHECK (choice IN ('for','against','abstain')), weight int NOT NULL DEFAULT 1, channel text NOT NULL, cast_at timestamptz NOT NULL DEFAULT now(), UNIQUE (motion_id, lot_id));
CREATE TABLE strata.campaigns (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, subject text NOT NULL, body text NOT NULL, signature_id uuid, audience jsonb NOT NULL, channels text[] NOT NULL, status text NOT NULL, tested_at timestamptz, sent_at timestamptz);
CREATE TABLE strata.campaign_recipients (campaign_id uuid NOT NULL, contact_id uuid NOT NULL, tenant_id uuid NOT NULL, notification_id uuid, PRIMARY KEY (campaign_id, contact_id));
CREATE TABLE strata.wall_posts (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, wall text NOT NULL CHECK (wall IN ('community','committee')), author_contact_id uuid NOT NULL, body text NOT NULL CHECK (length(body) <= 4000), pinned boolean NOT NULL DEFAULT false, hidden boolean NOT NULL DEFAULT false, report_count int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE strata.insurance_policies (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, insurer text NOT NULL, policy_no text NOT NULL, type text NOT NULL, sum_insured_cents bigint, premium_cents bigint, start_date date NOT NULL, end_date date NOT NULL, document_id uuid, CHECK (end_date > start_date));
CREATE TABLE strata.compliance_items (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL, type text NOT NULL, due_date date NOT NULL, status text NOT NULL, document_id uuid);
CREATE TABLE strata.portal_sites (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, scheme_id uuid NOT NULL UNIQUE, branding jsonb, status text NOT NULL DEFAULT 'live');
CREATE TABLE strata.report_schedules (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, report_key text NOT NULL, scheme_ids uuid[] NOT NULL, params jsonb NOT NULL, cron text NOT NULL, recipients jsonb NOT NULL, created_by uuid NOT NULL, active boolean NOT NULL DEFAULT true);
CREATE TABLE strata.report_runs (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, schedule_id uuid, report_key text NOT NULL, params jsonb NOT NULL, document_id uuid, status text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());

-- ============ FM ============
CREATE TABLE fm.regions (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, UNIQUE (tenant_id, name));
CREATE TABLE fm.clients (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL);
CREATE TABLE fm.business_calendars (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, timezone text NOT NULL, weekly_hours jsonb NOT NULL, holidays date[] NOT NULL DEFAULT '{}');
CREATE TABLE fm.sla_policies (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, calendar_id uuid REFERENCES fm.business_calendars(id), targets jsonb NOT NULL);
CREATE TABLE fm.properties (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, region_id uuid REFERENCES fm.regions(id), client_id uuid REFERENCES fm.clients(id), name text NOT NULL, code text, address jsonb, geo point, flags text[] NOT NULL DEFAULT '{}', calendar_id uuid, sla_policy_id uuid, settings jsonb NOT NULL DEFAULT '{}', deleted_at timestamptz, UNIQUE (tenant_id, code));
CREATE TABLE fm.locations (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, property_id uuid NOT NULL REFERENCES fm.properties(id), parent_id uuid REFERENCES fm.locations(id), name text NOT NULL, type text NOT NULL, path ltree NOT NULL);
CREATE INDEX ON fm.locations USING gist (path);
CREATE TABLE fm.asset_types (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, category text NOT NULL, default_useful_life_years int NOT NULL, default_replacement_cost_cents bigint, attribute_schema jsonb NOT NULL DEFAULT '{}', UNIQUE (tenant_id, name));
CREATE TABLE fm.assets (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, property_id uuid NOT NULL REFERENCES fm.properties(id), location_id uuid REFERENCES fm.locations(id),
  asset_type_id uuid NOT NULL REFERENCES fm.asset_types(id), code text NOT NULL, name text NOT NULL, make text, model text, serial text,
  install_date date, warranty_expiry date, condition smallint CHECK (condition BETWEEN 1 AND 5), criticality smallint CHECK (criticality BETWEEN 1 AND 5),
  replacement_cost_cents bigint, useful_life_years int, status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','disposed')),
  geo_lat double precision, geo_lng double precision, geo_accuracy_m real, attributes jsonb NOT NULL DEFAULT '{}', deleted_at timestamptz,
  UNIQUE (tenant_id, code)
);
CREATE INDEX ON fm.assets (tenant_id, property_id, asset_type_id);
CREATE TABLE fm.asset_plans (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, scope jsonb NOT NULL, start_year int NOT NULL, horizon_years int NOT NULL DEFAULT 10, escalation_pct numeric(5,2) NOT NULL DEFAULT 3.00, status text NOT NULL CHECK (status IN ('draft','published','superseded')));
CREATE TABLE fm.asset_plan_lines (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, plan_id uuid NOT NULL REFERENCES fm.asset_plans(id) ON DELETE CASCADE, asset_id uuid NOT NULL, year int NOT NULL, action text NOT NULL, cost_cents bigint NOT NULL, priority int NOT NULL);
CREATE TABLE fm.technicians (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, user_id uuid NOT NULL, trades text[] NOT NULL, hourly_rate_cents bigint NOT NULL, region_id uuid, calendar_id uuid, active boolean NOT NULL DEFAULT true);
CREATE TABLE fm.maintenance_plans (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, target_type text NOT NULL CHECK (target_type IN ('asset','asset_type_at_property','location')), target_id uuid NOT NULL, property_id uuid NOT NULL, rrule text NOT NULL, lead_days int NOT NULL DEFAULT 7, duration_minutes int NOT NULL DEFAULT 60, checklist jsonb NOT NULL DEFAULT '[]', default_assignee jsonb, priority text NOT NULL DEFAULT 'P3', trade text, is_statutory boolean NOT NULL DEFAULT false, skip_if_open boolean NOT NULL DEFAULT true, active boolean NOT NULL DEFAULT true);
CREATE TABLE fm.maintenance_schedules (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, plan_id uuid NOT NULL REFERENCES fm.maintenance_plans(id), due_date date NOT NULL, status text NOT NULL CHECK (status IN ('planned','generated','skipped','completed')), work_order_id uuid, UNIQUE (plan_id, due_date));
CREATE TABLE fm.work_orders (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, number text NOT NULL, type text NOT NULL CHECK (type IN ('reactive','planned','inspection','project')),
  property_id uuid NOT NULL, location_id uuid, asset_id uuid, priority text NOT NULL CHECK (priority IN ('P1','P2','P3','P4')), category text NOT NULL, trade text,
  description text NOT NULL, service_request_id uuid, maintenance_schedule_id uuid, sla_policy_id uuid,
  response_due_at timestamptz, complete_due_at timestamptz, responded_at timestamptz, completed_at timestamptz,
  sla_paused_minutes int NOT NULL DEFAULT 0, sla_state text NOT NULL DEFAULT 'ok' CHECK (sla_state IN ('ok','at_risk','breached','met')),
  nte_cents bigint, cost_cents bigint NOT NULL DEFAULT 0, under_warranty boolean NOT NULL DEFAULT false,
  status text NOT NULL CHECK (status IN ('new','assigned','accepted','declined','in_progress','on_hold','awaiting_approval','completed','verified','closed','cancelled')),
  hold_reason text, checklist jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now(), version int NOT NULL DEFAULT 1,
  UNIQUE (tenant_id, number)
);
CREATE INDEX ON fm.work_orders (tenant_id, status, complete_due_at);
CREATE INDEX ON fm.work_orders (tenant_id, property_id, created_at);
CREATE TABLE fm.assignments (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, work_order_id uuid NOT NULL REFERENCES fm.work_orders(id), assignee_type text NOT NULL CHECK (assignee_type IN ('technician','supplier')), technician_id uuid, supplier_id uuid, scheduled_start timestamptz, scheduled_end timestamptz, status text NOT NULL CHECK (status IN ('offered','accepted','declined','withdrawn','done')), created_at timestamptz NOT NULL DEFAULT now());
CREATE UNIQUE INDEX one_active_assignment ON fm.assignments (work_order_id) WHERE status IN ('offered','accepted');
CREATE TABLE fm.work_order_events (id bigserial PRIMARY KEY, tenant_id uuid NOT NULL, work_order_id uuid NOT NULL, type text NOT NULL, from_status text, to_status text, actor_id text, geo_lat double precision, geo_lng double precision, note text, occurred_at timestamptz NOT NULL DEFAULT now(), client_event_id uuid UNIQUE);
CREATE TABLE fm.work_order_evidence (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, work_order_id uuid NOT NULL, document_id uuid NOT NULL, kind text NOT NULL CHECK (kind IN ('before','after','signature','other')), captured_at timestamptz NOT NULL);
CREATE TABLE fm.time_entries (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, work_order_id uuid NOT NULL, technician_id uuid, minutes int NOT NULL CHECK (minutes > 0), rate_cents bigint NOT NULL);
CREATE TABLE fm.material_lines (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, work_order_id uuid NOT NULL, description text NOT NULL, qty numeric(10,2) NOT NULL, unit_cost_cents bigint NOT NULL);
CREATE TABLE fm.sla_events (id bigserial PRIMARY KEY, tenant_id uuid NOT NULL, work_order_id uuid NOT NULL, type text NOT NULL CHECK (type IN ('at_risk','breached','met','paused','resumed')), target text NOT NULL CHECK (target IN ('response','completion')), occurred_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE fm.inspection_templates (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, name text NOT NULL, items jsonb NOT NULL);
CREATE TABLE fm.inspections (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, work_order_id uuid NOT NULL UNIQUE, template_id uuid NOT NULL, results jsonb NOT NULL DEFAULT '[]', outcome text);

-- ============ AI ============
CREATE TABLE ai.conversations (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, user_id uuid NOT NULL, product text, context jsonb, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE ai.messages (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, conversation_id uuid NOT NULL, role text NOT NULL CHECK (role IN ('user','assistant','tool')), content text NOT NULL, model text, input_tokens int, output_tokens int, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE ai.tool_calls (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, message_id uuid NOT NULL, tool text NOT NULL, args jsonb NOT NULL, result_summary jsonb, status text NOT NULL CHECK (status IN ('ok','forbidden','error','not_found')), duration_ms int);
CREATE TABLE ai.citations (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, message_id uuid NOT NULL, source_type text NOT NULL CHECK (source_type IN ('document_chunk','record')), document_id uuid, chunk_id uuid, entity_type text, entity_id uuid, page int, quote text);
CREATE TABLE ai.action_proposals (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, conversation_id uuid NOT NULL, user_id uuid NOT NULL, action text NOT NULL, args jsonb NOT NULL, status text NOT NULL CHECK (status IN ('proposed','confirmed','executed','failed','discarded','expired')), expires_at timestamptz NOT NULL, result jsonb);
CREATE TABLE ai.drafts (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, user_id uuid NOT NULL, source_message jsonb NOT NULL, contact_id uuid, draft text NOT NULL, final_text text, status text NOT NULL CHECK (status IN ('generated','edited','sent','discarded')), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE ai.extractions (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, document_id uuid NOT NULL, kind text NOT NULL, fields jsonb NOT NULL, confidence jsonb NOT NULL, status text NOT NULL CHECK (status IN ('pending','extracted','confirmed','rejected','failed')), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE ai.document_chunks (
  id uuid PRIMARY KEY, tenant_id uuid NOT NULL, document_id uuid NOT NULL, document_kind text NOT NULL, chunk_index int NOT NULL, page int,
  content text NOT NULL, visibility text NOT NULL, scope_keys text[] NOT NULL, embedding vector(1024) NOT NULL,
  tsv tsvector, UNIQUE (document_id, chunk_index)
);
CREATE INDEX ON ai.document_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON ai.document_chunks (tenant_id);
CREATE INDEX ON ai.document_chunks USING gin (scope_keys);
CREATE TABLE ai.usage (tenant_id uuid NOT NULL, month date NOT NULL, input_tokens bigint NOT NULL DEFAULT 0, output_tokens bigint NOT NULL DEFAULT 0, cost_micro_usd bigint NOT NULL DEFAULT 0, PRIMARY KEY (tenant_id, month));

-- ============ RLS (applied by migration to every table having tenant_id) ============
-- DO $$ DECLARE r record; BEGIN
--   FOR r IN SELECT table_schema, table_name FROM information_schema.columns
--            WHERE column_name='tenant_id' AND table_schema IN ('platform','strata','fm','common','ai') LOOP
--     EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.table_schema, r.table_name);
--     EXECUTE format('ALTER TABLE %I.%I FORCE ROW LEVEL SECURITY', r.table_schema, r.table_name);
--     EXECUTE format($p$CREATE POLICY tenant_isolation ON %I.%I USING (tenant_id = current_setting('app.tenant_id', true)::uuid) WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid)$p$, r.table_schema, r.table_name);
--   END LOOP; END $$;
-- platform.tenants / platform.users are not tenant-scoped; access only via platform services.
-- audit_events: REVOKE UPDATE, DELETE ON platform.audit_events FROM app_user;
-- ledger_lines, journal_entries: REVOKE UPDATE, DELETE FROM app_user (corrections via reversal).
