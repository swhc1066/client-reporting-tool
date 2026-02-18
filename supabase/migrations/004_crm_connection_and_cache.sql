-- CRM + Schwab as source of truth: connection config, optional cache, and session link to CRM client.
-- Run after 003. Keeps existing tables; adds CRM-specific tables and optional external_id for cache/sync.

-- Per-firm CRM connection (provider, config, tokens). Store secrets in vault; use config for non-secret only if needed.
create table public.crm_connections (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms (id) on delete cascade,
  provider text not null,
  config jsonb not null default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (firm_id)
);

alter table public.crm_connections enable row level security;

create policy "Users can manage crm_connections for own firm"
  on public.crm_connections for all
  using (firm_id = (select firm_id from public.profiles where id = auth.uid()));

create index idx_crm_connections_firm_id on public.crm_connections (firm_id);

-- Optional: cache of client/portfolio data from CRM/Schwab (jsonb blob per client). Refresh on TTL or on demand.
create table public.client_data_cache (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms (id) on delete cascade,
  crm_client_id text not null,
  data jsonb not null default '{}',
  fetched_at timestamptz not null default now(),
  unique (firm_id, crm_client_id)
);

alter table public.client_data_cache enable row level security;

create policy "Users can manage client_data_cache for own firm"
  on public.client_data_cache for all
  using (firm_id = (select firm_id from public.profiles where id = auth.uid()));

create index idx_client_data_cache_firm_crm on public.client_data_cache (firm_id, crm_client_id);
create index idx_client_data_cache_fetched_at on public.client_data_cache (fetched_at);

-- Sessions can reference a client by CRM id when there is no local household (e.g. data comes only from API).
alter table public.sessions
  add column if not exists crm_client_id text,
  alter column household_id drop not null;

alter table public.sessions
  add constraint sessions_household_or_crm check (
    household_id is not null or (crm_client_id is not null and crm_client_id <> '')
  );

comment on column public.sessions.crm_client_id is 'CRM/Schwab client or household id when session is for a client not stored locally';

-- Optional: use existing tables as sync/cache from CRM by storing external id. Source of truth stays CRM + Schwab.
alter table public.households
  add column if not exists crm_id text;
alter table public.accounts
  add column if not exists crm_id text;

create unique index if not exists idx_households_firm_crm_id
  on public.households (firm_id, crm_id) where crm_id is not null;
create unique index if not exists idx_accounts_household_crm_id
  on public.accounts (household_id, crm_id) where crm_id is not null;

comment on column public.households.crm_id is 'External id from CRM; used when syncing from CRM/Schwab as source of truth';
comment on column public.accounts.crm_id is 'External id from CRM/Schwab; used when syncing from CRM as source of truth';