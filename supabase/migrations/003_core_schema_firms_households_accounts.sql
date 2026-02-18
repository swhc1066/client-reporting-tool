-- Core schema v1: firms, households, accounts, positions, transactions, sessions, meeting_records.
-- Kept lean; no columns for features 3+ phases out.

create table public.firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.firms enable row level security;

-- Link users to a firm so RLS can scope data by firm.
alter table public.profiles
  add column if not exists firm_id uuid references public.firms (id) on delete set null;

create table public.households (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms (id) on delete cascade,
  name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  symbol text not null,
  quantity numeric not null,
  as_of_date date not null default current_date,
  created_at timestamptz default now() not null
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  type text not null,
  amount numeric not null,
  transaction_date date not null default current_date,
  created_at timestamptz default now() not null
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  advisor_id uuid not null references public.profiles (id) on delete cascade,
  household_id uuid not null references public.households (id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz default now() not null
);

create table public.meeting_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS: users see only data for their firm.
alter table public.households enable row level security;
alter table public.accounts enable row level security;
alter table public.positions enable row level security;
alter table public.transactions enable row level security;
alter table public.sessions enable row level security;
alter table public.meeting_records enable row level security;

create policy "Users can insert firms"
  on public.firms for insert
  with check (auth.uid() is not null);

create policy "Users can manage own firm"
  on public.firms for select
  using (id = (select firm_id from public.profiles where id = auth.uid()));

create policy "Users can update own firm"
  on public.firms for update
  using (id = (select firm_id from public.profiles where id = auth.uid()));

create policy "Users can manage households in own firm"
  on public.households for all
  using (firm_id = (select firm_id from public.profiles where id = auth.uid()));

create policy "Users can manage accounts in own firm"
  on public.accounts for all
  using (
    household_id in (
      select id from public.households
      where firm_id = (select firm_id from public.profiles where id = auth.uid())
    )
  );

create policy "Users can manage positions in own firm"
  on public.positions for all
  using (
    account_id in (
      select a.id from public.accounts a
      join public.households h on h.id = a.household_id
      where h.firm_id = (select firm_id from public.profiles where id = auth.uid())
    )
  );

create policy "Users can manage transactions in own firm"
  on public.transactions for all
  using (
    account_id in (
      select a.id from public.accounts a
      join public.households h on h.id = a.household_id
      where h.firm_id = (select firm_id from public.profiles where id = auth.uid())
    )
  );

create policy "Users can manage own sessions"
  on public.sessions for all
  using (advisor_id = auth.uid());

create policy "Users can manage meeting_records for own sessions"
  on public.meeting_records for all
  using (
    session_id in (select id from public.sessions where advisor_id = auth.uid())
  );

-- Indexes for common lookups.
create index idx_households_firm_id on public.households (firm_id);
create index idx_accounts_household_id on public.accounts (household_id);
create index idx_positions_account_id on public.positions (account_id);
create index idx_transactions_account_id on public.transactions (account_id);
create index idx_sessions_advisor_id on public.sessions (advisor_id);
create index idx_sessions_household_id on public.sessions (household_id);
create index idx_meeting_records_session_id on public.meeting_records (session_id);