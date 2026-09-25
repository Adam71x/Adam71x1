@AGENTS.md

# Rasmi conventions

- Arabic is the default locale. Every user-facing string lives in `src/lib/i18n/messages/ar.ts` and `en.ts`; never hard-code UI text.
- Every page or action inside the app calls `requireAppContext()` (`src/lib/auth/dal.ts`) and scopes queries by `workspace.id`.
- Domain functions take `db: Db` as their first argument so they can be tested against in-memory PGlite (`createTestDb()`).
- Use CSS logical properties (`inset-inline-start`, `padding-inline`) so layouts work in RTL and LTR.
- Run `npm run check` before committing; run `npm run build && npm run test:e2e` for UI changes.
