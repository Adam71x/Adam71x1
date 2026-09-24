# C2: GitHub-issue bounties (claim-ready packages for the owner)

Window: 15:13 to ~15:25 UTC, 2026-09-24. I did not post, comment, fork, open PRs or create accounts. GitHub MCP tools were not used. api.github.com and github.com return 403 through the proxy for curl, so I read issue and PR data with WebFetch on github.com. The Opire public API was read with curl.

## Part A: claude-builders-bounty #3 ($100, hook)
**Package:** `/home/user/Adam71x1/products/claims/cbb-3-block-destructive-hook/` (CLAIM.md, fix.patch, files/). The source was also updated in `/home/user/Adam71x1/products/nokyc/claude-hook-block-destructive/`.

- **Issue:** https://github.com/claude-builders-bounty/claude-builders-bounty/issues/3. It is open and has no assignee.
- **Adapted to the real acceptance criteria**, which B2 never saw:
  - It now blocks **every** form of `rm -rf`. The old version only blocked root, home or wildcard targets.
  - `TRUNCATE` without `TABLE` is caught.
  - A `DELETE FROM schema.table` with no WHERE clause is caught.
  - Each log entry is JSONL with `timestamp`, `command` and `project` (`$CLAUDE_PROJECT_DIR`, or `cwd` if that is unset).
  - A new idempotent `install.sh` gives the README a two-command install.
- **Tests:** 51/51 pass. The patch was checked with `git apply` on a fresh clone of upstream `main`, and the installer was checked in a fake HOME.
- **The payout is almost certainly fake or unfunded:**
  - Opire's public `api.opire.dev/rewards` lists 6 rewards across the whole platform, and **none** is for this repo.
  - The repo has **0 merged PRs out of 4,161**.
  - **991** PRs match "destructive" (760 open), several of them opened in the last 48 hours.
  - The "proof of payments?" issue (#4188) has no maintainer reply.
  - Payout, if it ever happens, goes through Opire, which requires Stripe KYC.
- **Recommendation:** NO-GO on payout grounds. CLAIM.md has exact owner steps in case the owner wants it as a portfolio PR. Its step 1 is a re-check of the Opire API that tells the owner to stop if it shows no reward.

## Part B: a second funded bounty of $50 or more, doable in about 15 minutes
**None qualified.** Nothing was built. What I checked:

| Source | Finding |
|---|---|
| Opire `api.opire.dev/rewards` (all available rewards) | Only 6 exist. <br>- electron-template #1 ($100): repo is gone (404). <br>- rodrigompy/bugb #1 ($100): archived and closed. <br>- rencfs #3 ($42): below $50, and it is a research task. <br>- The other three are $20–30 with 15–38 people already trying. |
| Algora | algora.io/bounties returns 404, and the site has moved to jobs listings. <br>- activepieces #15366 ($50): 6 PRs already. One opened today, 5 were closed. <br>- tscircuit jlcsearch #92 ($75): 170 comments. |
| IssueHunt (sorted by most funded) | Top items are $2–$42 and years old. |
| GitHub search, `💎 Bounty` / `label:bounty` | Mostly bait boards with 0 merged PRs, such as UnsafeLabs/Bounty-Hunters ("AI only allowed", 183 issues, 0 PRs) and SecureBananaLabs/bug-bounty. <br>OphirPay's `bounty` issues are hard Stellar tasks with no dollar amounts. <br>BasedHardware/omi has only $25 *proposals* (self-proposed and unfunded) and 0 open "Paid Bounty" issues. |

## Takeaway
Across these 2026 GitHub bounty boards, AI-agent PRs heavily outnumber the funded rewards: hundreds of PRs per bounty, and many boards have never paid. Opire's reward API is a quick sanity check before starting any bounty. Every legitimate rail I found (Opire, Algora, IssueHunt, omi's PayPal) needs a GitHub identity plus Stripe or PayPal KYC.

AI-assistance disclosure: all research and code were produced by an AI agent (Claude Code, Agent C2).
