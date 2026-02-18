-- Seed data for test/staging Supabase project. Run after migrations 001–004.
-- Creates one firm, two households, accounts, positions, and transactions.
-- Does not create auth users: create a test user in Supabase Auth, then set their profile.firm_id (see docs/test-database.md).

-- Use fixed UUIDs so "link test user to firm" can use (select id from public.firms limit 1).
insert into public.firms (id, name)
values ('a0000000-0000-4000-8000-000000000001', 'Acme Wealth Advisors')
on conflict (id) do nothing;

insert into public.households (id, firm_id, name)
values
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Smith Family'),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Jones Family')
on conflict (id) do nothing;

insert into public.accounts (id, household_id, name)
values
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Smith Joint Brokerage'),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'Smith IRA'),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002', 'Jones Trust Account')
on conflict (id) do nothing;

insert into public.positions (account_id, symbol, quantity, as_of_date)
values
  ('c0000000-0000-4000-8000-000000000001', 'VTI', 150.5, current_date),
  ('c0000000-0000-4000-8000-000000000001', 'BND', 200.0, current_date),
  ('c0000000-0000-4000-8000-000000000002', 'VTI', 85.0, current_date),
  ('c0000000-0000-4000-8000-000000000003', 'SPY', 100.0, current_date);

insert into public.transactions (account_id, type, amount, transaction_date)
values
  ('c0000000-0000-4000-8000-000000000001', 'contribution', 5000.00, current_date - 30),
  ('c0000000-0000-4000-8000-000000000002', 'contribution', 2000.00, current_date - 14),
  ('c0000000-0000-4000-8000-000000000003', 'transfer', -1000.00, current_date - 7);

-- Teardown (run this to reset seed data before re-seeding).
-- delete from public.transactions where account_id in (select id from public.accounts where household_id in (select id from public.households where firm_id = 'a0000000-0000-4000-8000-000000000001'));
-- delete from public.positions where account_id in (select id from public.accounts where household_id in (select id from public.households where firm_id = 'a0000000-0000-4000-8000-000000000001'));
-- delete from public.accounts where household_id in (select id from public.households where firm_id = 'a0000000-0000-4000-8000-000000000001');
-- delete from public.households where firm_id = 'a0000000-0000-4000-8000-000000000001';
-- delete from public.firms where id = 'a0000000-0000-4000-8000-000000000001';