# 0001 · Application stack

**Status:** accepted (MS-01) · 25 Sep 2026

## Decision

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript | One codebase for the app, the public portfolio pages and the client-facing offer/invoice links; server rendering keeps client links fast on mobile. |
| Database | PostgreSQL through Drizzle ORM | Relational data (offers → invoices → payments) and SQL migrations committed in `drizzle/`. |
| Local / test database | PGlite (Postgres compiled to WebAssembly) | Development and tests run a real Postgres with no server to install or host. Setting `DATABASE_URL` switches to a normal Postgres server with the same schema and migrations. |
| Auth | Email one-time codes, database sessions | No passwords to leak. Codes are 6 digits, stored as HMAC hashes, expire in 10 minutes, lock after 5 wrong attempts, 60 s resend cooldown, 5 codes per hour. Session cookies are `HttpOnly`, `SameSite=Lax`, and only a SHA-256 hash of the token is stored. |
| Tenancy | `workspaces` + `memberships`; every app page goes through `requireAppContext()` | Workspace-scoped reads and writes check membership. Tests cover cross-tenant reads and writes. |
| i18n | Own lightweight dictionaries (`src/lib/i18n`) | Two languages, Arabic default. The language is a cookie plus a user preference; `<html lang dir>` flips between RTL and LTR. Arabic and English keys and placeholders are checked by tests and the type checker. |
| Dates and money | `Intl` with Umm al-Qura calendar, Latin digits, `Asia/Riyadh` time zone | Gregorian and Hijri dates side by side; SAR amounts as `3,250 ر.س` / `3,250 SAR`. |
| Styling | Plain CSS with design tokens ported from the approved prototype | Matches the prototype exactly and handles light/dark and RTL with logical properties. |
| Quality gates | ESLint, Prettier, `tsc`, Vitest (unit + DB integration), Playwright (desktop + mobile e2e), GitHub Actions | The same commands run locally and in CI. |
| Error tracking | `reportError()` in `src/lib/log.ts`, wired to Next's `onRequestError` | Structured logs today; an external provider plugs into this one function at hosting time. |
| Email | `Mailer` interface: `console` (dev) and `file` (e2e) transports | A real provider is chosen at hosting time (see 0002). |
