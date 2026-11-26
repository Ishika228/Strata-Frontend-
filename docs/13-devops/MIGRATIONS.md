# Database Migrations

- Tool: node-pg-migrate, SQL files in `apps/api/migrations/NNNN_name.sql`; run by `migrator` role; advisory lock prevents concurrent runs.
- Strategy: **expand → migrate → contract** to keep N-1 app compatible (FAILREC-09). No destructive change in same release as code depending on it.
- Every migration: up only (down via new forward migration), reviewed, tested in CI against seed, timing-checked on perf seed (> 5 s lock → needs `CONCURRENTLY`/batching).
- Baseline migration = [../06-database/SCHEMA.sql](../06-database/SCHEMA.sql) + RLS loop + grants + triggers:

```sql
CREATE FUNCTION strata.assert_entry_balanced() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE d bigint; c bigint;
BEGIN
  SELECT coalesce(sum(debit_cents),0), coalesce(sum(credit_cents),0) INTO d, c
  FROM strata.ledger_lines WHERE journal_entry_id = NEW.journal_entry_id;
  IF d <> c THEN RAISE EXCEPTION 'UNBALANCED_ENTRY % (% <> %)', NEW.journal_entry_id, d, c; END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER je_balanced AFTER INSERT ON strata.ledger_lines
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION strata.assert_entry_balanced();

CREATE FUNCTION strata.assert_period_open() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM strata.periods WHERE scheme_id = NEW.scheme_id AND month = NEW.period AND status = 'closed')
  THEN RAISE EXCEPTION 'PERIOD_CLOSED'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER je_period_open BEFORE INSERT ON strata.journal_entries FOR EACH ROW EXECUTE FUNCTION strata.assert_period_open();

REVOKE UPDATE, DELETE ON platform.audit_events, strata.ledger_lines, strata.journal_entries FROM app_user;
```
- `COMMENT ON` statements generated from DOMAIN_MODEL descriptions (data dictionary).
- Seed data is not a migration; `pnpm seed` (SEED_DATA.md).
