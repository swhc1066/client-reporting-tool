# Deployment plan: cloud provider and repo connection (Step 1)

Detailed steps to choose a cloud provider and connect this repo so you get staging (preview) and production deployments.

---

## Why Vercel for this step

- Next.js is made by Vercel; zero config for App Router, API routes, and server components.
- One connection gives you: production (e.g. from `main`) and preview deployments (every PR or branch).
- Env vars are set in the dashboard per environment (production vs preview).
- Free tier is enough to confirm the pipeline; you can switch later if needed.

Alternatives: Netlify (also good for Next.js), AWS Amplify, or self-hosted (e.g. Node on a VPS). This plan uses Vercel.

---

## Prerequisites

- GitHub repo pushed (e.g. `origin/main`).
- A GitHub account (same one that owns or has access to the repo).
- Node 20 locally (you already use this for CI).

---

## Part A: Create and configure the Vercel project (dashboard)

### 1. Sign in to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with **GitHub**.
2. If asked, authorize Vercel to access your GitHub account (and the org that owns the repo, if applicable).

### 2. Import the repository

1. In the Vercel dashboard, click **Add New…** then **Project**.
2. Find **client-reporting-tool** in the list (or use **Import Git Repository** and paste the repo URL).
3. Click **Import** next to the repo.

### 3. Configure the project (before first deploy)

On the import screen, set:

| Field | Value | Notes |
|-------|--------|--------|
| **Framework Preset** | Next.js | Should be auto-detected. |
| **Root Directory** | `./` | Leave default unless the app lives in a subfolder. |
| **Build Command** | `npm run build` | Default for Next.js. |
| **Output Directory** | (leave default) | Vercel sets this for Next.js. |
| **Install Command** | `npm install` or `npm ci` | Default is fine. |

Do **not** add environment variables yet; we’ll do that in the next deployment step so staging and production can use different Supabase projects.

Click **Deploy**. Let the first deployment run (it may fail if the app expects env vars; that’s fine).

### 4. Note the URLs

After the first deploy:

- **Production URL**: e.g. `https://client-reporting-tool-xxx.vercel.app` (or your custom domain later).
- **Preview URL**: every branch/PR gets a URL like `https://client-reporting-tool-<branch>-xxx.vercel.app`.

Vercel serves all deployments over HTTPS. The app middleware redirects any HTTP request to HTTPS in production so traffic is always encrypted.

You’ll use these when configuring Supabase redirect URLs and env vars.

---

## Part B: Connect via Vercel CLI (optional but useful)

Use the CLI to link the repo, pull envs, and trigger deploys from the terminal.

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

Or run without installing: `npx vercel`.

### 2. Log in

```bash
vercel login
```

Follow the browser or email link to authenticate.

### 3. Link this repo to the existing project

From the project root:

```bash
cd /path/to/client-reporting-tool
vercel link
```

- **Set up and deploy?** Yes.
- **Which scope?** Your account (or the team that owns the project).
- **Link to existing project?** Yes.
- **What’s the name of your existing project?** Choose **client-reporting-tool** (or the name you gave in the dashboard).

This creates or updates `.vercel/project.json` (and optionally `.vercel/.gitignore`). Commit only what makes sense for your team (often you add `.vercel/` to `.gitignore` and let each dev run `vercel link`).

### 4. Confirm pipeline

- **Production:** Push to `main` (or the branch you set as Production in Vercel). A new production deploy should start automatically.
- **Preview (staging):** Push a branch or open a PR. A preview deploy should start and a comment may appear on the PR with the preview URL.

That’s the end of Step 1: cloud provider chosen (Vercel), repo connected, and pipeline working (build + deploy). Next steps will add env vars, Supabase staging/production, and a “hello world” check.

---

## Checklist (Step 1 only)

- [ ] Vercel account created and signed in with GitHub.
- [ ] Repo **client-reporting-tool** imported as a Vercel project.
- [ ] First deploy run (even if app fails without env vars).
- [ ] Production URL and preview URL pattern noted.
- [ ] (Optional) Vercel CLI installed and `vercel link` run.
- [ ] Push to `main` triggers a production deploy.
- [ ] Push to another branch or open PR triggers a preview deploy.

Once this is done, move on to Step 2 below.

---

# Step 2: Staging Supabase and Vercel env vars

You have production: Vercel production deploy and one Supabase project. For staging (preview deploys) you use a **second Supabase project** so beta testing never touches production data. Same schema, different data.

## 2.1 Create a staging Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard).
2. Click **New project**.
3. Pick an org, then set:
   - **Name**: e.g. `client-reporting-tool-staging` (or your app name + `-staging`).
   - **Database Password**: generate and store it somewhere safe (you need it for direct DB access; the app only uses URL + anon key).
   - **Region**: same as production if you want parity, or a nearby region.
4. Create the project and wait for it to be ready.

## 2.2 Run the migration in both projects (production and staging)

Your app expects a `public.profiles` table and a trigger that creates a profile row when someone signs up. If you have not run any SQL in Supabase yet, do this in **both** projects.

**In each project (production first, then staging):**

1. Open the Supabase project in the dashboard.
2. Go to **SQL Editor**.
3. Click **New query**.
4. Paste the full script below (it matches `supabase/migrations/001_profiles.sql` in your repo).
5. Click **Run** (or Cmd/Ctrl+Enter). You should see "Success. No rows returned."
6. Repeat for the other project.

**Script to run (copy all of it):**

```sql
-- Profiles table for app-specific user data.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

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

When you add migrations later, run them on both production and staging so schema stays in sync.

## 2.3 Get staging env values

In the **staging** Supabase project:

1. Go to **Project Settings > API**.
2. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`) → this will be `NEXT_PUBLIC_SUPABASE_URL` for staging.
   - **anon public** key → this will be `NEXT_PUBLIC_SUPABASE_ANON_KEY` for staging.

Keep these for the next step.

## 2.4 Configure Vercel environment variables

So production uses the prod Supabase project and every preview (staging) uses the staging project:

1. In Vercel, open your project **client-reporting-tool**.
2. Go to **Settings > Environment Variables**.
3. Add variables **per environment**:

   **Production (only):**

   | Name | Value | Environment |
   |------|--------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your **production** Supabase project URL | Production |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your **production** Supabase anon key | Production |

   **Preview (staging only):**

   | Name | Value | Environment |
   |------|--------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your **staging** Supabase project URL | Preview |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your **staging** Supabase anon key | Preview |

   Use the dropdown to select **Production** or **Preview** when adding each row so the right value is used for each environment.

4. Save. New production deploys will use prod Supabase; new preview deploys will use staging Supabase.

## 2.5 Auth redirect URLs in Supabase

Each Supabase project only allows redirect URLs you list. Add the deployed app URLs for each project.

**Production Supabase project:**

1. **Authentication > URL Configuration**.
2. **Site URL**: your production app URL (e.g. `https://client-reporting-tool.vercel.app` or your custom domain).
3. **Redirect URLs**: add:
   - `https://client-reporting-tool.vercel.app/auth/callback`
   - (and your custom domain callback if you use one, e.g. `https://yourdomain.com/auth/callback`).

**Staging Supabase project:**

1. **Authentication > URL Configuration**.
2. **Site URL**: use your main preview URL pattern, e.g. `https://client-reporting-tool-*.vercel.app` or the exact URL of a branch you use for staging (e.g. `https://client-reporting-tool-git-staging-xxx.vercel.app`). Supabase allows wildcards in redirect URLs: `https://*.vercel.app/auth/callback` so all preview URLs work.
3. **Redirect URLs**: add:
   - `http://localhost:3000/auth/callback` (optional, for local dev against staging)
   - `https://*.vercel.app/auth/callback` (covers all Vercel preview URLs).

Save. Staging auth will work for any preview deployment.

## 2.6 Redeploy so env vars apply

- **Production:** Trigger a redeploy from the Vercel dashboard (Deployments > … > Redeploy) or push a commit to `main`. Production will now use production env vars (if you just added them).
- **Preview:** Push to a non-main branch or open a PR. The new preview deploy will use the Preview env vars and the staging Supabase project.

## Checklist (Step 2)

- [ ] Staging Supabase project created.
- [ ] `001_profiles.sql` (and any other migrations) run on staging.
- [ ] Production env vars set in Vercel (Production only): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Preview env vars set in Vercel (Preview only): same names, staging project URL and anon key.
- [ ] Production Supabase redirect URLs include production app callback URL.
- [ ] Staging Supabase redirect URLs include `https://*.vercel.app/auth/callback` (and optionally localhost).
- [ ] Redeployed and verified: production uses prod DB, preview uses staging DB (e.g. sign in on a preview URL and confirm data is separate).
