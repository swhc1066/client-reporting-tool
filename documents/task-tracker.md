# Task Tracker: Client Reporting Tool

Status key: **To Do** | **In Progress** | **Done**

Update this file as work is started and completed.

---

## Done

| Task | Source | Notes |
|------|--------|--------|
| Initialize Next.js (App Router), TypeScript, Tailwind, ESLint | Step 1 / INF-1 | Project runs; `npm run dev` works |
| Basic root layout and home page | Step 1 | `src/app/layout.tsx`, `src/app/page.tsx` |
| Path alias `@/*` → `./src/*` | Step 1 | In tsconfig.json |
| `.env.local.example` | Step 1 | Env pattern for later Supabase/CRM |
| Add shadcn/ui | Step 1 | New York style, neutral, css vars; `src/lib/utils.ts`, `components.json` |
| Define client list type (id, name, optional identifier) | Step 2 | In `src/types/index.ts` |
| Define per-client presentation data type(s) for default screens | Step 2 | ClientPresentationData + overview, allocation, performance, summary; partial OK |
| Implement mock client list (2–3 clients) | Step 3 / INF-2 | `src/lib/data/mock/clients.ts` |
| Implement per-client mock data (full + partial) | Step 3 | `clientData.ts`; client-1 full, client-2 partial, client-3 minimal |
| Expose getClients(), getClientById(id), getClientPresentationData(clientId) | Step 3 | `src/lib/data/mock/index.ts` |
| Single data entry point in `src/lib/data/index.ts` | Step 4 / BE-1 | Re-exports from mock; swap here for CRM |
| useClients() hook | Step 4 | `src/lib/hooks/useClients.ts`; loading, error state |
| useClientData(clientId) hook | Step 4 | `src/lib/hooks/useClientData.ts`; returns client + data |
| Optional: Route Handlers GET /api/clients, GET /api/clients/[id] | Step 4 | Return mock; GET /api/clients/[id] returns { client, data } |
| Header, Sidebar, AppShell | Step 5 / FE-1 | shadcn Sidebar; `src/components/layout/` |
| Dashboard home (minimal) | Step 5 | Welcome + View clients button at /dashboard |
| Routes: /, /dashboard, /clients | Step 5 | / redirects to /dashboard; nav: Dashboard, Clients |
| Page at /clients using useClients() | Step 6 / FE-2 | Cards, search filter, loading/empty/error |
| Select client to /clients/[id]/present | Step 6 | Link from card; placeholder present page |
| Loading and empty states | Step 6 | Skeleton, error card, empty and no-matches states |
| One component per default screen (Overview, Allocation, Performance, Summary) | Step 7 / FE-3 | `src/components/presentation/screens/` |
| Define screen order in code | Step 7 | `DEFAULT_SCREEN_ORDER` in screen-order.tsx |
| Each screen: props = client data; handle empty/partial; optional speaker notes | Step 7 | All four screens; speaker notes in config, sr-only in UI |
| Route /clients/[id]/present; load client via useClientData(id) | Step 8 / FE-4 | id from params; PresentationView client component |
| Full-screen UI: one screen at a time, Next/Previous, Exit | Step 8 | Fixed overlay; keyboard ArrowRight/Space=next, ArrowLeft=prev |
| Render current default screen with client data | Step 8 | DEFAULT_SCREEN_ORDER; optional speaker notes panel (showSpeakerNotes) |
| Responsive client list and presentation | Step 9 / FE-5 | Client list: grid cols, responsive title; presentation: responsive footer, padding, typography |
| ARIA and keyboard nav | Step 9 | Focus trap (useFocusTrap), aria-label on Next/Previous/Exit, live region for slide context |
| Empty/partial data and error states | Step 9 | role=alert on errors; screens already handle empty; data ?? {} in presentation |
| Unit: data layer shape, presentation next/prev, screen components | Step 10 / QA-1 | Vitest: data/index.test, screen-order.test, title-overview + allocation screens |
| E2E: open app, clients, select client, present, advance, exit | Step 10 / QA-2 | Playwright e2e/present-flow.spec.ts |
| CI (optional): run E2E on main | Step 10 | .github/workflows/test.yml: unit + e2e on push/PR to main |

---

## In Progress

| Task | Source | Notes |
|------|--------|--------|
| (None) | | |

---

## To Do

### Step 1 (finish)

| Task | Source | Notes |
|------|--------|--------|
| Add Prettier (optional) | Step 1 | Format on save / CI |
| Add Vitest and Playwright or Cypress (optional) | Step 1 | Unit + E2E |

### Step 2: Types and Data Contracts

| Task | Source | Notes |
|------|--------|--------|
| *(Complete)* | Step 2 | See Done |

### Step 3: Mock Data Layer

| Task | Source | Notes |
|------|--------|--------|
| *(Complete)* | Step 3 | See Done |

### Step 4: Data Abstraction

| Task | Source | Notes |
|------|--------|--------|
| *(Complete)* | Step 4 | See Done |

### Step 5: App Shell and Layout

| Task | Source | Notes |
|------|--------|--------|
| *(Complete)* | Step 5 | See Done. Sidebar required for MVP. |

### Step 6: Client List Page

| Task | Source | Notes |
|------|--------|--------|
| *(Complete)* | Step 6 | See Done |

### Step 7: Pre-Built Default Screens

| Task | Source | Notes |
|------|--------|--------|
| *(Complete)* | Step 7 | See Done |

### Step 8: Presentation Mode and Route

| Task | Source | Notes |
|------|--------|--------|
| *(Complete)* | Step 8 | See Done |

### Step 9: Polish

| Task | Source | Notes |
|------|--------|--------|
| *(Complete)* | Step 9 | See Done |

### Step 10: Tests

| Task | Source | Notes |
|------|--------|--------|
| *(Complete)* | Step 10 | See Done |

### Post-MVP (future)

| Task | Source | Notes |
|------|--------|--------|
| Supabase project and env | INF-3 | |
| Supabase Auth and schema/RLS | INF-4 / BE-2 | |
| CRM API client; replace mock | BE-3 | Same interface as mock |

---

## Summary

- **Done:** Project scaffold through Step 10 (unit + E2E tests, optional CI).
- **In Progress:** (none)
- **To Do:** Step 1 optional (Prettier only; Vitest/Playwright added in Step 10).

When you finish a task, move it from **To Do** or **In Progress** to **Done** and add a short note if useful. When you start a task, add it to **In Progress**. When a full step is complete, keep its header under To Do with a *(Complete)* row so the step outline stays visible.
