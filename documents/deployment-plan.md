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

Once this is done, move on to: create staging and production Supabase projects, set env vars in Vercel for each environment, add redirect URLs in Supabase, then deploy and open the app to confirm end-to-end.
