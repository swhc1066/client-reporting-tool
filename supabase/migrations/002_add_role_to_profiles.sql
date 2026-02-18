-- Add role to profiles (advisor | analyst). Default advisor for existing and new users.
alter table public.profiles
  add column if not exists role text not null default 'advisor'
    check (role in ('advisor', 'analyst'));

comment on column public.profiles.role is 'User role: advisor or analyst';