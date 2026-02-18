# Database schema when CRM + Schwab are the source of truth

When client and portfolio data comes from a CRM that integrates with Schwab's API, this app's database should **not** be the source of truth for that data. It should store:

1. **Identity and org**: who uses the app and which firm they belong to.
2. **Connectivity**: how the app talks to the CRM (and thus indirectly to Schwab).
3. **App-owned data**: meeting sessions and meeting records.
4. **Optional cache**: copies of CRM/Schwab data for performance, with external IDs and TTL/refresh.

---

## What lives where

| Data | Source of truth | In our DB? |
|------|-----------------|------------|
| Users (advisors/analysts) | This app (Supabase Auth + profiles) | Yes |
| Firms | This app | Yes |
| CRM connection config / tokens | This app (encrypted or in vault) | Yes |
| Clients/households, accounts, positions, transactions | CRM + Schwab API | Optional: cache or thin sync only |
| Sessions (meeting runs) | This app | Yes |
| Meeting records (notes, outcomes) | This app | Yes |

---

## Recommended schema (CRM + Schwab world)

### Always in our DB

- **profiles** – id, email, display_name, avatar_url, **role** (advisor/analyst), **firm_id**, timestamps. (Extends auth.users.)
- **firms** – id, name, timestamps.
- **crm_connections** – per-firm or per-user link to the CRM (which talks to Schwab). Stores provider, tokens/refs, config (e.g. which Schwab env). Credentials in config or in a secrets vault; DB holds references and non-secret config.
- **sessions** – advisor_id, **household_id or crm_client_id** (reference into CRM world), started_at, ended_at. So we know "which meeting" without owning the client record.
- **meeting_records** – session_id, notes, timestamps.

So we **reference** clients/households by an external id (e.g. `crm_household_id` or `crm_client_id`) from the CRM, instead of owning a full `households` table.

### Optional: cache/sync tables

If you want to cache API responses in the DB (for speed or offline-ish UX) instead of calling the CRM/Schwab on every request:

- **client_data_cache** – (firm_id or owner_id), **crm_client_id**, **data** (jsonb: household, accounts, positions, etc. as returned by CRM/Schwab), **fetched_at**. Unique on (firm_id, crm_client_id) or (owner_id, crm_client_id). Refresh on TTL or on demand.

Or, if you prefer queryable cache:

- Keep **households**, **accounts**, **positions**, **transactions** but add **crm_id** / **schwab_id** (or one **external_id**) per table so each row is tied to the CRM/Schwab entity. Treat these as sync/cache: app refreshes from API and upserts by external_id. Source of truth remains CRM + Schwab.

---

## Sessions and meeting records when we don't own households

- **sessions** should store either:
  - **crm_household_id** (or crm_client_id) text, and optionally **firm_id**, so you know which client/household the meeting was for without a local `households` row; or
  - **household_id** uuid only if you keep a local `households` table as cache (with **crm_id** on it).
- **meeting_records** stay tied to **session_id**; no change.

---

## Summary

- **Minimal (no local client/account copy):** profiles, firms, crm_connections, sessions (with crm_client_id), meeting_records, and optionally **client_data_cache** (jsonb blob per client).
- **Queryable cache:** same plus households/accounts/positions/transactions each with an **external_id** (crm/schwab id) and refreshed from CRM/Schwab; sessions reference household_id from that cache.

Your existing migrations already give you profiles (with role), firms, households, accounts, positions, transactions, sessions, meeting_records. To align with "CRM + Schwab as source of truth" you add **crm_connections** and either (a) a **client_data_cache** table and sessions.**crm_client_id**, or (b) **external_id** columns on households/accounts/positions/transactions and treat them as cache/sync only.
