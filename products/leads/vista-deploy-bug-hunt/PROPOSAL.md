# Lead: Mantitup-Org/vista #62 / #61, "vista deploy" bug-hunt bounty

**Status: DRAFT. Not posted.** Posting needs a GitHub account and the owner's approval.

## Lead facts
- URL: https://github.com/Mantitup-Org/vista/issues/62 (deploy bugs) and https://github.com/Mantitup-Org/vista/issues/61 (framework-wide hunt)
- Posted: 2026-09-20 18:51 UTC (4 days ago)
- Budget: **not stated**. The label only says "Paid or credited bug/feature hunt", so the payout could be credit only. That fails the "budget stated" criterion, and this lead is only partially qualified.
- Legitimacy: a small org with a real npm package (`@vistagenic/vista@0.3.6`, published 2026-09-20). The issue has a clear pass/fail rubric. 11–13 comments at the time of the search (content not read).
- Fit score: **5/10**. The work is real and I can check it myself (done, see REPRO-FINDINGS.md), but payment is uncertain and no amount is given.

## Deliverable already produced
`REPRO-FINDINGS.md`: 5 findings against 0.3.6, each with the source file and line and a suggested fix. F1 (Render startCommand) and F2 (identity `.rsc` rewrite in `_redirects`) reproduce failure modes the issue lists. F3 (Netlify `node_bundler = "none"`) may be new and should be checked against Netlify docs first. Live-site checks weren't possible from the sandbox.

## Draft comment/issue (the owner posts it if approved)

Following #61's rules ("open a new issue with a minimal repro, link this issue"):

**Title:** `vista deploy (0.3.6): Render startCommand mismatch + identity .rsc rewrite in Cloudflare _redirects`

> Hi, this report comes from Quillforge Studio, a project that uses AI for code review and bug reproduction. **This report was prepared with AI assistance.** A person should review it before you act on it.
>
> Repro on `create-vista-app@0.3.6` / `@vistagenic/vista@0.3.6`, Linux, following the steps in #62:
> 1. **Render**: `adapters/render.js:20` emits `startCommand: npm run start`, while the docker target uses `node .vista/standalone/server.js` and the Render dry-run lists `.vista/standalone/server.js` as its artifact. Suggested fix: emit the standalone command.
> 2. **Cloudflare static** (`deploy.output: 'static'`): `utils.js` `writeStaticRscRedirects()` writes `/rsc/*.rsc /rsc/:splat.rsc 200`, which rewrites a path to itself, followed by `/rsc/* /rsc/:splat.rsc 200`. The static `rsc/*.rsc` files already exist, so line 3 isn't needed. Line 4 can double the `.rsc` suffix. I think this is the cause of the "Flight fetch returns HTML" symptom. I couldn't check it live on Pages.
> 3. **Netlify** (please verify): `node_bundler = "none"` isn't one of Netlify's documented `node_bundler` values (`esbuild`/`zisi`).
>
> Full logs and the other notes (Node 20 runtime pins, Cloudflare target always emitting the Containers setup) are available if useful. Linked to #61 / #62.
> If the bounty is paid, what are the amount and the process?

## Next action for owner
1. Decide whether a bug hunt with an unstated payout is worth posting. Consider first asking in #62 whether the bounty is cash, and how much.
2. If posting: verify F3 against Netlify docs, then post from the owner's own GitHub account.
