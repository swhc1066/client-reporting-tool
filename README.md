# Client Reporting Tool

Next.js app for client reporting with dashboard, client management, and presentation views.

## Prerequisites

- Node.js 20+
- npm

## Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` with your Supabase values:

   - `NEXT_PUBLIC_SUPABASE_URL` – https://dscznpphqmpmzohjxpdb.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – sb_publishable_Hxf8ccsfPqojvHqHCwfIuw_pHF-UpdS

   (Or use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` instead of the anon key.)

## Scripts

| Command         | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run start`| Start production server  |
| `npm run lint` | Run ESLint               |
| `npm run test:run` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |

## Tech

- Next.js 16 (App Router, API routes)
- React 19
- Tailwind CSS, shadcn/ui
- Supabase (auth + data)
- Vitest, Playwright
