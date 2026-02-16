# Technical Overview: Client Reporting Tool

Onboarding guide for developers. Covers scaffolding, frontend, backend, and tech structure.

---

## 1. Product Context

Web app for financial advisors to present client financial data in a story-like manner. **MVP:** Advisor sees a mock client list, selects a client, and walks through pre-built presentation screens with that client's mock data. No external services (no Supabase, no CRM API) in MVP.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Linting | ESLint 9 + eslint-config-next |
| Future UI | shadcn/ui (per PRD; to be added) |
| Future testing | Vitest (unit), Playwright or Cypress (E2E) |

**Backend (MVP):** None. All data is mock (in-code or static JSON). Next.js Route Handlers are optional for `/api/clients` and `/api/clients/[id]` to mirror future API shape.

**Post-MVP:** Supabase (auth, persistence), CRM API (client list and per-client data).

---

## 3. Repository Structure

```
client-reporting-tool/
├── .env.local.example    # Env template (no keys needed for MVP)
├── .gitignore
├── documents/             # PRD, MVP plan, research, this doc
├── next.config.ts         # Next.js config (minimal)
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── src/
│   ├── app/               # App Router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home
│   │   └── globals.css
│   ├── components/        # React components (one per file)
│   │   └── .gitkeep
│   ├── lib/               # Data layer, utils, hooks
│   │   └── .gitkeep
│   └── types/             # Shared TypeScript types
│       └── .gitkeep
└── public/                # Static assets (if added)
```

**Path alias:** `@/*` maps to `./src/*` (e.g. `import { X } from "@/components/X"`).

---

## 4. Scaffolding (Current vs Target)

**Current:** App Router under `src/app`; placeholder `src/components`, `src/lib`, `src/types` (`.gitkeep` only).

**Target (from PRD / MVP plan):**

- **Routes:** `/` (landing/dashboard), `/dashboard`, `/clients` (list), `/clients/[id]/present` (presentation mode). Optional later: `/login`, `/signup`.
- **App:** `src/app/(auth)/`, `src/app/dashboard/`, `src/app/clients/`, `src/app/api/` (optional for MVP).
- **Components:** `src/components/ui/` (shadcn), `src/components/layout/` (Header, Sidebar, AppShell), `src/components/presentation/` (PresentationMode, DefaultScreens, slide-types).
- **Data:** `src/lib/data/mock/` (clients, clientData), `src/lib/data/index.ts` (abstraction), `src/lib/hooks/` (useClients, useClientData).
- **Types:** `src/types/` (client list and per-client presentation data; shared by mock and future CRM).

---

## 5. Frontend

- **Next.js App Router:** All pages and layouts live under `src/app/`. Use `layout.tsx` for shared chrome, `page.tsx` for routes.
- **Styling:** Tailwind only. Global styles in `src/app/globals.css`. Content paths in `tailwind.config.ts`: `src/pages/**`, `src/components/**`, `src/app/**`.
- **Conventions:** One component per file; PascalCase components, camelCase props; TypeScript for all UI code; shadcn/ui + Tailwind once added; mobile-first responsive; ARIA and keyboard support where relevant.

---

## 6. Backend and Data (MVP)

- **No server DB or auth in MVP.** Data comes from a mock layer only.
- **Data flow:** UI uses hooks (e.g. `useClients()`, `useClientData(clientId)`). Hooks are implemented by a single data abstraction in `src/lib/data/index.ts`, which for MVP calls mock modules in `src/lib/data/mock/`. UI never imports mock directly so the source can be swapped to Supabase/CRM later.
- **Optional:** Next.js Route Handlers `GET /api/clients` and `GET /api/clients/[id]` that return mock data so client code can use `fetch()` and stay unchanged when a real backend is added.

---

## 7. Configuration Quick Reference

| File | Purpose |
|------|--------|
| `tsconfig.json` | Strict TS, `@/*` → `./src/*`, Next plugin, ES2017 target |
| `next.config.ts` | Next.js config (empty for now) |
| `tailwind.config.ts` | Content paths, theme (defaults) |
| `postcss.config.mjs` | PostCSS (Tailwind, Autoprefixer) |
| `eslint.config.mjs` | ESLint flat config; Next + TypeScript rules for `src/**` |
| `.env.local.example` | Env template; no keys required for MVP |

---

## 8. Scripts

| Command | Purpose |
|--------|--------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Lint `src/` |

---

## 9. Environment

- Copy `.env.local.example` to `.env.local` for local overrides.
- MVP runs without any env vars. Later: Supabase URL/key, CRM API base URL and credentials.

---

## 10. Key Docs

- `documents/prd/prd.md` – Product requirements, user stories, architecture, task breakdown.
- `documents/mvp-scope-and-build-plan.md` – MVP scope and 10-step build plan (types → mock → data layer → shell → client list → screens → presentation → polish → tests).
- `documents/task-tracker.md` – To do / In progress / Done tasks.

---

## 11. Onboarding Checklist

1. Clone repo, run `npm install`, then `npm run dev`; confirm app loads.
2. Read PRD and MVP scope/build plan (sections above).
3. Skim `src/app/layout.tsx` and `src/app/page.tsx`; note `@/*` usage in any existing imports.
4. Confirm Node/npm versions if documented in README; use supported TS/Next versions per `package.json`.
5. Run `npm run lint` and fix any issues before pushing.
6. Use the task tracker to pick up next work (types, mock data, or data abstraction).
