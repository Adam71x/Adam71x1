# 0002 · Hosting is deferred

**Status:** accepted (MS-01) · 25 Sep 2026

## Context

MS-01 planned a decision record for hosting in a KSA cloud region. The product owner decided not to host anything until the product has proven itself.

## Decision

- No servers, domains or paid services are set up for now.
- The app runs fully on a developer machine: `npm run dev` uses the embedded PGlite database in `.data/`, and sign-in codes print in the terminal.
- CI (GitHub Actions) only builds and tests. It deploys nothing.

## When we host, these are required

1. **Region and data residency:** host the app, database and file storage in a KSA region to meet the PDPL rules on transferring personal data outside the Kingdom.
2. **Database:** managed PostgreSQL. Set `DATABASE_URL` and run `npm run db:migrate` before each release.
3. **Secrets:** a random `AUTH_SECRET` of at least 32 characters (the app refuses to start in production without it).
4. **Email:** an email provider behind the `Mailer` interface in `src/lib/email` for sign-in codes.
5. **Error tracking:** connect a provider inside `reportError()` in `src/lib/log.ts`.
6. **Domains:** `rasmi.sa` for the app and wildcard `*.rasmi.sa` for portfolio pages (MS-03).
7. **Backups and monitoring:** part of MS-12 hardening.
