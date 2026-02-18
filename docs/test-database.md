# Test database for testing the app with actual data

Use a **separate Supabase project** as the test database. Same schema as production (run the same migrations), different data. Never point production at this project.

---

## Approach

| Environment | Supabase project | Purpose |
|-------------|------------------|---------|
| Production | Project A | Live users and data |
| Test / Staging | Project B | QA, demos, testing with real-looking data |

You already use this pattern in the deployment plan (staging Supabase for preview deploys). The "test" database can be that same staging project, or a third project (e.g. "dev" for local testing with real data).

1. **Create a dedicated Supabase project** (e.g. `client-reporting-tool-test` or reuse staging).
2. **Apply the same migrations** (001 through 004) so the schema matches production.
3. **Run the seed script** so the project has firms, households, accounts, and sample data.
4. **Create at least one test user** in Supabase Auth and link them to the seeded firm (see below).
5. **Point the app at the test project** when you want to test with actual data (env vars or `.env.test`).

---

## Steps

### 1. Create the test Supabase project

In [Supabase Dashboard](https://supabase.com/dashboard): **New project** → name e.g. `client-reporting-tool-test`, set region and database password, create.

### 2. Apply migrations

In the test project, **SQL Editor** → run each migration in order:

- `supabase/migrations/001_profiles.sql`
- `supabase/migrations/002_add_role_to_profiles.sql`
- `supabase/migrations/003_core_schema_firms_households_accounts.sql`
- `supabase/migrations/004_crm_connection_and_cache.sql`

Or use Supabase CLI from the repo: `supabase link` (to the test project), then `supabase db push`.

### 3. Run the seed

In the test project, **SQL Editor** → open and run `supabase/seed.sql`. This inserts:

- One firm
- Two households
- Several accounts, positions, and transactions
- No auth users (those are created in Supabase Auth)

### 4. Create a test user and link to the firm

1. In the test project, go to **Authentication > Users** and create a user (e.g. test@example.com, set a password).
2. Copy the user’s **UUID** (from the users table or the Auth user list).
3. In **SQL Editor**, run:

```sql
update public.profiles
set firm_id = (select id from public.firms limit 1),
    role = 'advisor'
where id = '<paste-user-uuid-here>';
```

If the trigger already created a profile for that user, this links them to the seeded firm. If not, insert a profile first:

```sql
insert into public.profiles (id, email, display_name, role, firm_id)
values (
  '<paste-user-uuid-here>',
  'test@example.com',
  'Test Advisor',
  'advisor',
  (select id from public.firms limit 1)
)
on conflict (id) do update set firm_id = excluded.firm_id, role = excluded.role;
```

### 5. Point the app at the test project

When running the app locally against the test DB, set:

- `NEXT_PUBLIC_SUPABASE_URL` = test project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = test project anon key  

Options:

- **Replace** `.env.local` with test project values when you want to test with real data (remember to switch back for production).
- **Use a separate file** e.g. `.env.test` and run Next.js with it: `env $(cat .env.test | xargs) npm run dev` (or a script that loads `.env.test`). Do not commit `.env.test` if it contains keys.

For Vercel preview (staging) deploys, set the staging Supabase URL and anon key in Vercel under **Preview** environment variables (as in your deployment plan).

---

## Resetting test data

To reset and re-seed:

1. In the test project, **SQL Editor**, run the "Teardown" section at the bottom of `supabase/seed.sql` (deletes seed data in dependency order).
2. Run the seed again (insert section of `supabase/seed.sql`).

Or use Supabase CLI: `supabase db reset` (resets the linked DB and reapplies migrations; add seed to the reset flow if you use `supabase/seed.sql` in a script).

---

## Optional: local Supabase

For fully local testing (no hosted test project), use [Supabase local development](https://supabase.com/docs/guides/cli/local-development):

```bash
supabase start
supabase db reset   # applies migrations
# then run seed.sql manually or via supabase db seed if configured
```

Then point `.env.local` at the local Supabase URL and anon key printed by `supabase start`. Good for CI and offline dev; hosted test project is still useful for QA and demos.
