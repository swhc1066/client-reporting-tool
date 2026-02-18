# MVP Scope and Build Plan: Client Reporting Tool

Based on the PRD, this document defines what is in scope for MVP and a step-by-step plan to build it.

---

## Part 1: MVP Scope

### What MVP Is

A working advisor flow: **see a list of clients (mock), pick one, launch a fixed presentation, and walk through pre-built screens** with that client's data. No external services. No deck building.

### In Scope

| Area | Scope |
|------|--------|
| **Data** | Mock only. Client list and per-client presentation data from in-code or static JSON. Same TypeScript types as future CRM/screen contract so swapping later is minimal. |
| **Screens** | Fixed set of pre-built screens (e.g. title/overview, allocation, performance, summary). Order fixed in code. No add/remove/reorder. |
| **Client list** | Display clients from mock; optional search/filter; select client to launch presentation. |
| **Presentation** | Full-screen, one screen at a time; next/previous (click + keyboard); optional speaker notes; exit to client list/dashboard. Data on each screen = selected client (from mock). |
| **Auth** | None or minimal (e.g. placeholder). No Supabase in MVP. |
| **Users** | Advisor only. No client login or client-facing portal. |

### Out of Scope (Explicitly)

- Supabase (auth, DB)
- CRM API or any external API
- Presentation builder / custom slides / reordering
- Client portal or client login
- Trading, compliance automation, full CRM

### Success Criteria for MVP

- User sees client list (mock).
- User selects a client and launches the default presentation.
- All pre-built screens render with that client's mock data.
- User can advance/back through all screens and exit without errors.
- App runs with no external dependencies (no Supabase, no CRM).

---

## Part 2: Step-by-Step Build Plan

Build order is chosen to: (1) define contracts first so mock and UI stay aligned, (2) get end-to-end flow working early, (3) add polish and tests after core flow works.

---

### Step 1: Project and Tooling Setup

**What:** Initialize Next.js (App Router), TypeScript, Tailwind CSS, ESLint, Prettier. Add shadcn/ui. Optional: Vitest and Playwright (or Cypress) for tests.

**Why:** Single source of truth for stack (per PRD). shadcn + Tailwind matches your UI rules. Establishing lint/format and test runners early avoids drift.

**Decisions:**

- Use App Router (per PRD) for routing and future API routes.
- Put app code under `src/` (per PRD scaffolding).
- Add `.env.local.example` even if empty so env pattern is clear for later Supabase/CRM.

**shadcn/ui, design tokens, and global styles (sub-step):** The reporting tool does not need to match another product's UI (e.g. fa-tool-implementation-plan). Use **out-of-the-box shadcn** for MVP. Install and initialize shadcn (`npx shadcn@latest init`). Choose the **CSS variables** theme option so tokens can be overridden later if needed. Keep `globals.css` with shadcn's **default** CSS variable slots (standard neutral palette for primary, secondary, muted, destructive, etc.); no custom product color mapping required. Use **Tailwind's default font stack** (or leave body font unspecified); no Google Fonts or custom font families (Fraunces, Outfit, JetBrains Mono) required for MVP. Add only the shadcn components needed for Week 1–2: Button, Input, Card, Badge, Dialog, Popover, DropdownMenu, Separator, Skeleton, Tooltip. Keep the component list lean; add others on demand.

**Deliverable:** `npm run dev` runs; lint/format pass; shadcn available; project layout matches PRD scaffold (e.g. `src/app`, `src/components`, `src/lib`, `src/types`).

---

### Step 2: Types and Data Contracts

**What:** Define shared TypeScript types/interfaces for:

- **Client list:** e.g. `id`, `name`, optional `identifier`.
- **Per-client data:** One type (or a small set) that matches what each default screen needs (overview, allocation, performance, summary). Prefer a single "client presentation data" shape that screen components consume so mock and future CRM can both satisfy it.

**Why:** Mock and future CRM must agree on shape. Defining types first prevents rework when adding real API and keeps screen components stable.

**Decisions:**

- Types live in `src/types/` (e.g. `index.ts` or split by domain).
- No backend yet; types are used by mock and by React components only.
- If a screen needs "optional" fields (e.g. performance might be missing), model that in the type (optional or discriminated union) and handle empty/placeholder in the UI.

**Deliverable:** Types file(s) that describe client list item and per-client presentation data; no mock implementation yet.

---

### Step 3: Mock Data Layer

**What:** Implement mock client list and per-client data (in-code or static JSON in `src/lib/data/mock/`). Data must conform to the types from Step 2. Provide at least 2–3 mock clients with enough variation to test all default screens (e.g. one with full data, one with partial).

**Why:** Unblocks full flow without any backend. PRD requires MVP to run without Supabase or CRM.

**Decisions:**

- Prefer in-code (e.g. `clients.ts`, `clientData.ts`) for simplicity; static JSON is fine if you want to edit data without code changes.
- File naming: e.g. `getClients()`, `getClientById(id)`, `getClientPresentationData(clientId)` so the next step can wrap them in a single abstraction.

**Deliverable:** Mock modules that return client list and per-client data; both used only via the abstraction in Step 4.

---

### Step 4: Data Abstraction (Data Layer API)

**What:** Single entry point for the app to get "clients" and "client presentation data" (e.g. `src/lib/data/index.ts`). For MVP, this layer calls the mock from Step 3. Export hooks like `useClients()` and `useClientData(clientId)` that return the same shape the UI expects, so later you can swap in Supabase/CRM without changing components.

**Why:** PRD explicitly asks for a data layer so that "swapping in Supabase/CRM later requires minimal UI changes." One abstraction keeps UI decoupled from mock vs API.

**Decisions:**

- No API routes required for MVP; hooks can call mock directly. Optional: add Route Handlers (`/api/clients`, `/api/clients/[id]`) that return mock data so the same fetch code works when you add a real backend.
- Hooks should handle loading and error state so list and presentation screens can show loading/empty/error consistently.

**Deliverable:** `useClients()` and `useClientData(clientId)` (or equivalent) used everywhere; UI never imports mock modules directly.

---

### Step 5: App Shell and Layout

**What:** Root layout, app shell (e.g. Header, optional Sidebar), and a simple dashboard home. Navigation: Dashboard, Clients (and later optional Login placeholder). Use shadcn and Tailwind.

**Why:** Consistent chrome and nav before building client list and presentation; avoids rework when adding more pages.

**Decisions:**

- Dashboard can be minimal (e.g. "Welcome" and a link to Clients) so the main entry to the flow is the client list.
- Route structure: `/` (redirect or dashboard), `/dashboard`, `/clients` (list). Presentation at `/clients/[id]/present` (Step 8).

**Deliverable:** Shell and nav work; `/` and `/dashboard` and `/clients` exist; styling and responsiveness started.

---

### Step 6: Client List Page

**What:** Page at `/clients` that uses `useClients()`, displays the list (cards or table), and lets the user select a client. Selection navigates to `/clients/[id]/present` (or to a "Launch presentation" action that does the same). Optional: search or filter on client name.

**Why:** Core user story: "select a client so I can present that client's data." Must work with mock only.

**Decisions:**

- Use Next.js Link or router.push for navigation to `/[id]/present` so the next step can read `[id]` and load that client's data.
- Show loading and empty state from the data layer hooks.

**Deliverable:** Client list loads from mock via abstraction; selecting a client goes to presentation route with that client's id.

---

### Step 7: Pre-Built Default Screens (Slide Components)

**What:** One React component per default screen type (e.g. Title/Overview, Allocation, Performance, Summary). Each component receives the per-client data (or a slice of it) as props and renders read-only. No editing. Handle missing/partial data with placeholders or empty states.

**Why:** PRD: "screens are built for the advisor"; "fixed set and order." Implementing screen components before presentation mode keeps presentation mode generic (it just renders the Nth screen with client data).

**Decisions:**

- Screen order is defined in one place (e.g. array of screen type ids or component references in `src/components/presentation/` or `DefaultScreens.tsx`).
- Each screen component has a clear prop interface (e.g. `data: ClientPresentationData` or a slice). Optional: speaker notes as a prop or static text per screen type for MVP.

**Deliverable:** All default screen components implemented and render correctly when given mock client data; order defined in code.

---

### Step 8: Presentation Mode and Route

**What:**

- Route: `/clients/[id]/present`. Read `id` from params, load client and presentation data via `useClientData(id)`.
- Presentation mode UI: full-screen (minimal chrome), show one screen at a time by index; "Next" / "Previous" buttons; keyboard (e.g. arrow right/space = next, arrow left = previous); "Exit" to go back to `/clients` or dashboard. Optional: speaker notes panel or overlay.
- Render the current default screen component with the loaded client data.

**Why:** This is the core "run the meeting" experience. Tying it to a route allows direct linking and refresh; using the same data layer keeps everything mock-based and swappable later.

**Decisions:**

- Store current slide index in React state (or URL query if you want shareable "deep link" to a slide). For MVP, state is enough.
- On refresh: re-fetch client data by `id`; optionally restore slide index from sessionStorage for better UX (PRD edge case).
- Focus trap and keyboard handling for accessibility (PRD a11y).

**Deliverable:** User can open `/clients/[id]/present`, see first screen with that client's data, advance/back through all default screens, use keyboard, and exit to client list.

---

### Step 9: Polish (Responsive, A11y, Empty States)

**What:** Ensure client list and presentation work on smaller viewports; add ARIA where needed and verify keyboard nav; explicit empty/partial data states and error states from the data layer.

**Why:** PRD calls out responsive and a11y; edge case "client has no or incomplete data" should show placeholders, not break.

**Decisions:**

- Prioritize desktop; tablet-friendly is enough for MVP if time is limited.
- Use shadcn components that support a11y; add aria-labels for "Next", "Previous", "Exit", and slide context if needed.

**Deliverable:** No critical a11y violations; graceful behavior for empty or partial data; layout usable on target viewport sizes.

---

### Step 10: Tests

**What:**

- **Unit:** Critical paths (e.g. data layer returning correct shape; key presentation logic like next/prev and bounds; one or two default screen components with mock data).
- **E2E:** Flow "open app → go to clients → select a client → enter presentation → advance a few screens → exit" with mock data.

**Why:** PRD quality gates: unit tests for critical paths, E2E for select-client-and-present. Prevents regressions when adding Supabase/CRM later.

**Decisions:**

- Vitest for unit; Playwright or Cypress for E2E (PRD suggests both). Run E2E in CI on main if possible.
- Mock data in tests can reuse the same mock module or a minimal inline fixture that matches the types.

**Deliverable:** Unit tests for data layer and presentation behavior; one E2E test covering the full MVP flow; both pass locally (and in CI if configured).

---

## Summary: Build Order and Dependencies

```
Step 1  Project setup
   ↓
Step 2  Types
   ↓
Step 3  Mock data (conforms to Step 2)
   ↓
Step 4  Data abstraction + hooks (uses Step 3)
   ↓
Step 5  App shell + layout
   ↓
Step 6  Client list page (uses Step 4, 5)
   ↓
Step 7  Default screen components (use Step 2 types)
   ↓
Step 8  Presentation mode + /clients/[id]/present (uses 4, 6, 7)
   ↓
Step 9  Polish (responsive, a11y, empty states)
   ↓
Step 10 Tests (unit + E2E)
```

---

## What Comes After MVP (Not in This Plan)

- Connect Supabase (auth, profiles, optional persistence).
- Replace mock with CRM API (client list + per-client data).
- Customizing slides (order, which screens, narrative text).
- Client-facing view-only links.

When you are ready to proceed, the next step is **Step 1: Project and Tooling Setup**. I can outline exact commands and file changes for that step, or we can adjust the plan first if you want to change scope or order.
