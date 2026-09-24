# tscircuit/cli #4716: KiCad project export drops board design rules

- Issue: https://github.com/tscircuit/cli/issues/4716 (opened 2026-09-11 by raykholo, a user, not a maintainer)
- **Bounty: none.** No Algora bounty comment or 💎 label was found when checked at about 14:00 UTC on 2026-09-24. tscircuit often adds a bounty to issues later, but this one does not have one. Treat this as an unpaid contribution unless a maintainer adds a bounty.
- Status when checked: open, 0 comments, no linked PR.
- Earlier attempt: PR #4816 by iprasen used the same approach. The stale-bot closed it on 2026-09-23 without any review, so the approach was never rejected.

## Problem
`tsci build --kicad-project` writes `.kicad_pro` from a hand-written stub (`createKicadProContent` in
`cli/build/generate-kicad-project.ts`). That stub has no `board.design_settings.rules`, so KiCad DRC falls back to
its default limits. For example, a 0.4 mm edge clearance fails KiCad's default 0.5 mm check even though the board declares
`minBoardEdgeClearance={0.3}`.

## Fix (fix.patch)
- The `.kicad_pro` is now built with `CircuitJsonToKicadProConverter` from `circuit-json-to-kicad`. The `export --format kicad_zip` path already uses this converter. It maps `min_trace_width`, via pad and hole sizes, and trace-to-pad clearance into `design_settings.rules` and the Default netclass.
- The converter (v0.0.212) does not map `min_board_edge_clearance`, so the patch sets it on
  `design_settings.rules.min_copper_edge_clearance` itself.
- Adds `tests/cli/build/build-kicad-project-design-rules.test.ts`, which has 2 tests.

## Verification
The full `bun install` fails in this sandbox because some private tscircuit CDN and GitHub tarballs return 403. The new test file was
run in a separate test setup against `circuit-json-to-kicad@0.0.212`, the version pinned in the repo: **2 pass, 0 fail**.
The repo's own suite and typecheck were **not** run, so run `bun test tests/cli/build` and `bunx tsc --noEmit` before submitting.

Base commit: see `BASE_COMMIT`.

## How the owner could submit (owner decision; nothing was submitted)
1. Fork tscircuit/cli with your own GitHub account, then `git apply fix.patch` on a branch.
2. Run `bun install && bun test tests/cli/build/build-kicad-project-design-rules.test.ts tests/cli/build/build.test.ts && bunx tsc --noEmit`, then `bunx biome format --write .` if the repo uses it.
3. Open a PR that says "Fixes #4716" and mentions that it revives the approach in #4816.
4. If a maintainer later adds an Algora bounty, put `/claim #4716` in the PR body. Algora payout needs GitHub OAuth and a Stripe Express account with KYC in the owner's name.
5. Check the repo's AI-contribution policy first and disclose AI assistance if it asks for that.
