# Supabase Project Setup

Do this when you create your Supabase project. Backend auth is already wired to these settings.

## 1. Create project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a project.
2. In **Project Settings > API**, copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Add both to `.env.local` (see `.env.example`).

## 2. Auth URL configuration

In **Authentication > URL Configuration**:

- **Site URL**: Your app origin (e.g. `http://localhost:3000` in dev, `https://yourdomain.com` in prod).
- **Redirect URLs**: Add:
  - `http://localhost:3000/auth/callback`
  - `https://yourdomain.com/auth/callback` (when you deploy)

Email confirmation and password reset links use the same callback URL; the app then redirects to `/dashboard`, `/update-password`, or the `next` param.

## 3. Email confirmation

In **Authentication > Providers > Email**:

- Turn **Confirm email** ON so users must click the link before signing in.

## 4. Profiles table (run in SQL Editor)

Run this in the Supabase **SQL Editor** to create `public.profiles` and keep it in sync with `auth.users`:

```sql
-- Table for app-specific user data (display name, company, etc.)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS: users can read/update their own row
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

Add more columns to `profiles` as needed (e.g. `company`, `role`).

## 5. Sign up redirect (in your UI)

When calling `supabase.auth.signUp()`, pass the callback URL so email confirmation lands on your app:

```ts
await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

After the user confirms, Supabase redirects to `/auth/callback?code=...`, the app exchanges the code for a session and redirects to `/dashboard`.
