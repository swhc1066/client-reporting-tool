# Email-Only Auth Implementation Steps

Steps to add email-based sign up and sign in. No UI screens in this doc; implement these in order.

---

## Current implementation (Supabase, email + password)

Backend auth is already configured:

- **Provider:** Supabase Auth (email + password, email confirmation required).
- **Clients:** `src/lib/supabase/client.ts` (browser), `src/lib/supabase/server.ts` (server), `src/lib/supabase/middleware.ts` (session refresh).
- **Auth helper:** `src/lib/supabase/auth.ts` – `getUser()` for server-side current user.
- **Middleware:** Session refresh + route protection; unauthenticated users redirect to `/sign-in`; authenticated users on `/sign-in` or `/sign-up` redirect to `/dashboard`.
- **Callback:** `src/app/auth/callback/route.ts` – exchanges email confirmation code for session, redirects to `/dashboard` (or `next` param).
- **Profiles:** `public.profiles` table synced with `auth.users` via trigger; migration in `supabase/migrations/001_profiles.sql`. See `docs/supabase-setup.md` for full Supabase project setup (env, redirect URLs, email confirmation, running the migration).

When building UI: use browser client for `signUp`, `signInWithPassword`, `signOut`; pass `emailRedirectTo: origin + '/auth/callback'` on sign up so confirmation lands on the app.

---

## 1. Choose Auth Strategy

Decide how users prove ownership of their email:

- **Magic link (passwordless):** User enters email, receives a one-time link to sign in. No passwords to store or reset.
- **Password:** User signs up with email + password; signs in with email + password. Requires password reset flow.

Pick one and use it consistently for both sign up and sign in.

---

## 2. Choose Auth Provider / Backend

Pick one approach:

- **NextAuth (Auth.js)** – works well with Next.js; supports credentials and custom providers. You implement the actual sign up/sign in logic (e.g. against your DB or a BaaS).
- **Clerk** – hosted auth; supports email/password and magic link; less custom code, vendor lock-in.
- **Supabase Auth** – email/password and magic link; fits if you use or plan to use Supabase for DB/API.
- **Custom** – your own API routes + DB (e.g. Prisma/Drizzle) for users, sessions, and tokens; you handle hashing, cookies, and CSRF.

Document the choice and where sessions/tokens live (cookie name, storage, expiry).

---

## 3. Data Model and Storage

- **Users:** table (or equivalent) with at least: `id`, `email` (unique), `emailVerified` (optional), `createdAt`, `updatedAt`. If using passwords: `passwordHash` (never store plain passwords).
- **Sessions:** table if you use DB-backed sessions (e.g. session id, user id, expires at). Optional if using JWT-in-cookie and no server-side session list.
- **Verification tokens (if magic link):** table or cache for token, email, expires at; one-time use and short TTL.

Ensure indexes on `email` and any session/token lookups you use often.

---

## 4. Environment and Secrets

- Add env vars for: auth secret (e.g. `AUTH_SECRET`), DB URL if needed, and any third-party auth keys (Clerk, Supabase, etc.).
- If sending email: configure SMTP or an email API (Resend, SendGrid, etc.) and add API key or SMTP credentials. Do not commit secrets.

---

## 5. Auth Library Setup

- Install the chosen auth library (e.g. `next-auth`, `@clerk/nextjs`, `@supabase/supabase-js`, or none for full custom).
- Create the core config: auth options, session strategy (JWT vs database), callbacks for session and JWT (e.g. attach `userId`, `email`). No UI in this step; only wiring so that “sign in” and “sign out” can later read/write session.

---

## 6. API Surface

Implement the server-side behavior only (no screens):

- **Sign up:** Accept email (and password if applicable). Validate email format and uniqueness. If password: hash and store user. If magic link: create verification token, send email with link that hits a dedicated route (e.g. `GET /api/auth/verify?token=...`).
- **Sign in:** Accept email (and password if applicable). If password: verify against stored hash and create session. If magic link: accept token in request (from link), validate token, create session, invalidate token.
- **Sign out:** Invalidate session (and clear cookie/JWT) via the auth provider’s sign-out API or your custom route.
- **Session:** Provide a way to get current user (e.g. `getServerSession()`, `auth()`, or your own helper that reads cookie/JWT and returns user or null).

Use existing Next.js API routes or server actions; keep validation and errors consistent (e.g. 400/401/409 and clear messages).

---

## 7. Route Protection (Middleware / Layout)

- **Middleware:** In Next.js middleware, read session (or JWT). Redirect unauthenticated users to the sign-in route and authenticated users away from sign-in/sign-up (optional). Protect `/dashboard` and all routes that require auth.
- **Layouts:** In the dashboard (or app) layout, optionally double-check session and redirect if missing. This is the second line of defense after middleware.

Do not build the sign-in/sign-up pages yet; just define the route paths (e.g. `/sign-in`, `/sign-up`) and redirect logic so that once those pages exist, behavior is correct.

---

## 8. Email Sending (If Using Magic Link)

- Create a small email module or use your provider’s SDK.
- Implement “send magic link” (and optionally “send password reset” later): build the link with token, send email with that link. Use a template that includes the URL and expiry note.
- Ensure the link points to your verification API route (e.g. `https://yourapp.com/api/auth/verify?token=...`).

---

## 9. Verification and Error Handling

- **Sign up:** Duplicate email → clear error (e.g. “An account exists for this email” or “Sign in instead”).
- **Sign in:** Invalid credentials or expired/invalid magic link → clear error, no info leak (e.g. “Invalid email or link”).
- **Verify token:** Expired or already used → clear message and redirect to sign-in or resend flow.
- **Validation:** Validate email format and required fields on both client and server; return consistent error shapes for the future UI.

---

## 10. Testing and Security Checklist

Before building UI:

- Confirm passwords are never logged or stored in plain text.
- Confirm auth secret and DB credentials are env-only.
- Use HTTPS in production; set secure, httpOnly, sameSite cookies.
- If using magic link, ensure tokens are single-use and short-lived; invalidate on use.
- Add a few tests: sign up (success + duplicate email), sign in (success + invalid), session read, sign out. Prefer integration/API tests that hit your routes.

---

## 11. Document for UI Phase

Leave a short note for when you build screens:

- **Sign-up screen:** Calls sign-up API with email (and password if used); shows validation and duplicate-email errors; redirect or link to sign-in after success.
- **Sign-in screen:** Calls sign-in API (or requests magic link); shows errors; on success redirect to dashboard or intended URL.
- **Magic link (if used):** Verification route renders a simple “Signing you in…” then redirects; or “Link expired” with link back to sign-in.
- **Protected pages:** Rely on middleware + layout; optionally show user email in header from session.

---

## Summary Order

1. Choose strategy (magic link vs password).
2. Choose provider (NextAuth, Clerk, Supabase, or custom).
3. Define data model and create migrations.
4. Add env and secrets (auth secret, DB, email, provider keys).
5. Install and configure auth library (no UI).
6. Implement sign up, sign in, sign out, and session APIs.
7. Add middleware and layout protection; define sign-in/sign-up paths.
8. Implement email sending (if magic link).
9. Harden validation and error handling.
10. Add tests and security checks.
11. Document UI contract for sign-in, sign-up, and verification screens.

After these steps, the app will have working email-based auth and protected routes; then you can add the actual sign-in and sign-up screens.
