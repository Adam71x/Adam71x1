# C1 "Bounties": results

Window: 15:13:03 to 15:19 UTC on 2026-09-24 (`date -u`), about 6 minutes on the sandbox clock. The deadline was 15:55.
Nothing was posted, commented on, claimed or submitted anywhere, and no accounts were created. I did not use the GitHub MCP.

## Outcome
**0 claim packages produced.** I found no bounty that is funded, open, uncontested, on an active repo and in the $50+ range. Every candidate failed at least one of these checks. I chose not to build a patch that the owner could not realistically get paid for. `products/claims/` was **not** created.

## How I searched (and what access works)
- Algora: the global listing (`/bounties`) needs a login, and `api/trpc/bounty.list` is hard-coded to return `[]`. I confirmed this by reading `algora-io/algora`, `lib/algora_web/controllers/api/bounty_controller.ex`. The public org pages at `algora.io/<org>/bounties` do work. I scraped about 150 org slugs. **Warning:** these pages list bounties as "open" long after the GitHub issue has closed, so every hit needs a check on GitHub.
- Opire: `api.opire.dev/rewards` works and returns only 6 rewards in total.
- IssueHunt: `oss.issuehunt.io/issues` works. It only lists old issues, $2 to $42 each, most with PRs already submitted.
- Polar: the connection to polar.sh was reset. Polar also shut down issue funding in 2024.
- Aggregators: AsherKasper/bounty-census (regenerated 2026-09-24 11:40 UTC) finds **1** claimable Algora bounty worldwide, and it has no amount and 24 comments. JuanM94/bounty-radar needs the GitHub search API, which is blocked here.
- GitHub: api.github.com and github.com HTML return 403 for repos not attached to this session. I checked issue and PR state with WebFetch and `git ls-remote`/`git clone` instead.

## Candidates evaluated (checked 15:14 to 15:19 UTC)
| Issue | Amount / platform | Why rejected |
|---|---|---|
| https://github.com/tscircuit/jlcsearch/issues/92 | $75 Algora | Open and the repo is active, but it is swarmed: 10 or more open PRs (#486, #563, #571, #577, #583, #584, #585, #586, #589, #590 from Sep 1 to 24) and 103 Algora claims |
| https://github.com/projectdiscovery/nuclei/issues/6674 | $100 Algora | Closed and 💰 Rewarded (PR #6825 merged). The Algora page is stale |
| https://github.com/projectdiscovery/nuclei/issues/6532 | $100 Algora | Closed |
| https://github.com/tscircuit/tscircuit/issues/1130 | $25 Algora | Closed (schematic-viewer#149) |
| https://github.com/seveibar/pgstrap/issues/2 | $30 Algora | Already done: `generate --pglite` is on main (v1.0.6) |
| https://github.com/tscircuit/dsn-converter/issues/54 | $1 + $170 + $30 + $70 + $70 Algora | 236 claims, large conversion task |
| https://github.com/tscircuit/autorouting/issues/92 | $50 Algora | Repo dormant since 2025-08-15 (tscircuit moved to a new autorouter); algorithmic work |
| https://github.com/tscircuit/pcb-viewer/issues/163 | $3 | Too small, 39 claims |
| https://github.com/antinomyhq/forge/issues/389 | $50 Algora (tailcallhq) | Closed and assigned (PR #1262) |
| https://github.com/tailcallhq/rust-grpc/issues/44 | $50 Algora | Repo dormant since 2024-12-03, with 14 or more PRs (#75 to #87) |
| https://github.com/tailcallhq/graphql-benchmarks/issues/272 | $50 Algora | Repo dormant since 2025-01-29 |
| tailcallhq.github.io #216, #217, #373; graphql-conf-2024#1 | $100 / $100 / $500 / $50 | Tailcall has pivoted and these repos are dormant; bounties 24 to 29 months old |
| https://github.com/rohitdash08/FinMind/issues/124 (and #121, #130, #132, #133, #144) | $50 to $1,000 Algora | **Repo archived 2026-06-19**. It also had 36 open PRs |
| https://github.com/lablab-ai/community-content/issues/462 | $60 Algora | Deadline passed (Apr 2024); 2 open PRs (#1007, #1067); asks for a personal authorial voice, so an AI-written tutorial is a poor fit |
| https://github.com/Mudlet/Mudlet/issues/5310 | $30 Algora | Below $50; a Windows-only focus bug from 2021 with no repro steps; needs a GUI to test |
| https://github.com/rustdesk/rustdesk/issues/3762 | $100 Algora | ASIO audio support: a large Windows-only task |
| https://github.com/Mail-0/Zero/issues/883 | $750 Algora | 8 claims, 16 months old, a large theming feature |
| https://github.com/xevrion-v2/agent-playground (#1, #2, #17) | $50 / $50 / $1,000 | Bait or test repo with 27 to 37 claims each |
| https://github.com/UnsafeLabs/Bounty-Hunters (#916 to #920 etc.) | $250 to $900 | "AI only" farm, 0 completed payouts on Algora, 22 to 32 claims each. Avoid |
| https://github.com/colinhacks/zod/issues/2654 | $25 (triggerdotdev) | 37 months old, below $50 |
| https://github.com/highlight/highlight/issues/8032 | $20 | Highlight was acquired and is dormant; 26 claims |
| https://github.com/cal-com/font/issues/2 | $50 + $100 | Font design work ("weights"), not code |
| https://github.com/aueangpanit/electron-template/issues/1 | $100 Opire | Returns 404 (repo gone or private) |
| https://github.com/rodrigompy/bugb/issues/1 | $100 Opire | Title "c1work", no stars and no real spec; looks like a test |
| https://github.com/radumarias/rencfs/issues/3 | $42 Opire | A research task (Windows implementation) |
| https://github.com/buape/kiai-bounties/issues/1 | $20 Opire | Below $50 |
| https://github.com/trovu/trovu/issues/329, https://github.com/flowese/UdioWrapper/issues/7 | $30 / $20 Opire | 38 and 24 people trying |
| IssueHunt listing (Boostnote#2567, RSSHub#12883, ant-design#11889, ...) | $2 to $42 | Below $50, and PRs already submitted |

Orgs I probed with 0 open bounties on Algora: zio, golemcloud, mediar-ai, activepieces, keephq, twentyhq, coollabsio, archestra-ai, CapSoftware, Infisical, formbricks, maybe-finance, permitio, onyx-dot-app, deskflow, lancedb, qdrant, tursodatabase, documenso, unkey, remotion, and about 100 other slugs.

## Takeaways for the owner
1. The Algora bounty market is effectively empty for newcomers. Legitimate funders (tscircuit, projectdiscovery) get 10 or more PRs within days. The rest is dormant, stale-listed or farm-like. This matches A1's finding from 14:00 UTC.
2. The only place worth watching is new tscircuit and projectdiscovery bounties **within hours of posting**. That needs a watcher, such as a Routine that polls `algora.io/tscircuit/bounties` and `algora.io/projectdiscovery/bounties` and alerts on new rows. The owner then needs to open a PR fast under their own identity.
3. Algora payout needs a GitHub login plus Stripe Connect Express KYC (government ID and bank account). Set this up before chasing any bounty.

## Packages produced
None. The earlier A1 package (`products/bounties/tscircuit-cli-4716-kicad-design-rules/`) is still the only ready patch. It has no bounty attached.
