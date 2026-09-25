# Rasmi (رسمي)

Subscription SaaS for Saudi freelancers, studios and small agencies: portfolio, pricing, offers with e-signature, clients, invoices and payment recording. Arabic first, English second.

- [Product plan](docs/product-plan.md) · [Milestones](docs/milestones.md) · [Research brief](docs/saas-idea.md)
- Decisions: [stack](docs/decisions/0001-stack.md) · [hosting deferred](docs/decisions/0002-hosting-deferred.md)

## Run it locally

Requires Node.js 22.

```bash
npm install
npm run dev
```

Open http://localhost:3000 and sign in with any email. There is no email service yet, so the 6-digit sign-in code is printed in the terminal running `npm run dev`. Data is stored in the embedded database in `.data/` (delete that folder to start over).

To use a PostgreSQL server instead, copy `.env.example` to `.env.local` and set `DATABASE_URL`; migrations run automatically when the app starts. To email sign-in codes, set `EMAIL_TRANSPORT=resend` and `RESEND_API_KEY`.

## Checks

| Command                             | What it does                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                      | ESLint                                                                                                          |
| `npm run format:check`              | Prettier (use `npm run format` to fix)                                                                          |
| `npm run typecheck`                 | TypeScript                                                                                                      |
| `npm test`                          | Unit and database integration tests (Vitest + in-memory PGlite)                                                 |
| `npm run build && npm run test:e2e` | End-to-end tests in desktop and mobile Chromium (Playwright). Run `npx playwright install chromium` once first. |
| `npm run check`                     | Lint, format, types and unit tests together                                                                     |

After changing `src/lib/db/schema.ts`, run `npm run db:generate` to create a migration in `drizzle/`.

## Project layout

```
src/app/            routes: sign-in, onboarding, (app)/home, (app)/settings, api/health
src/lib/auth/       sign-in codes, sessions, cookies, data access layer, server actions
src/lib/db/         Drizzle schema, database client, test helpers
src/lib/i18n/       locales, Arabic/English messages, SAR and Hijri formatting
src/lib/workspaces.ts  tenants and membership checks
src/components/     shared UI
e2e/                Playwright tests
drizzle/            SQL migrations
```
