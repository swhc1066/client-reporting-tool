# Auth usage (for UI implementation)

Backend is wired. Use these from your sign-in and sign-up screens.

## Client-side (browser)

Use the browser client in Client Components or client-side code:

```ts
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
```

### Sign up (email + password, with email confirmation)

```ts
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});
// If success and email confirmation is required, Supabase sends an email.
// User clicks link -> /auth/callback -> session set -> redirect to /dashboard.
// Show a "Check your email to confirm" message.
```

### Sign in

```ts
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
// If success, middleware and cookies already have the session; redirect to /dashboard.
```

### Sign out

```ts
await supabase.auth.signOut();
// Then redirect to /sign-in (or let middleware handle it).
```

### Errors

- `error.message` and `error.status` for display (e.g. "Invalid login credentials", 400).
- Duplicate sign up: Supabase returns success but `data.user?.identities?.length === 0` when email already exists; show "An account exists for this email" and link to sign in.

## Server-side (current user)

In Server Components or Route Handlers:

```ts
import { getUser } from "@/lib/supabase/auth";

const { user, error } = await getUser();
// user is null if not signed in.
```

## Redirects

- After sign in: redirect to `searchParams.get("next") ?? "/dashboard"` so the `next` param from middleware is honored.
- After sign up (if no email confirmation): redirect same way. If email confirmation is on: show "Check your email" and do not redirect until they confirm.
