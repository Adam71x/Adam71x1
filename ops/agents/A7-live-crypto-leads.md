# A7 "Live Crypto Leads": report

Window: 14:24 to ~14:31 UTC, 2026-09-24 (the clock is `date -u` in the sandbox). Nothing was posted, commented, DM'd, applied for or signed up for. $0 spent.

## Metrics
| Metric | Value |
| --- | --- |
| Minutes spent | ~8 |
| Actions | ~20 tool actions: reddit JSON (blocked with a "network security" page), reddit RSS (1 feed OK, then 429), HN Algolia (5 queries), Superteam Earn API, Bountycaster API, BasedAgents API, GitHub MCP search (Omi), GitHub HTML (403), wrote and ran a link checker (34 URLs), 2 lead files |
| Qualified leads (paid + crypto + small digital + <=72h + open) | **0 fully qualified.** 1 strategic partial (unpaid task on a Base-USDC board), 2 watch-only |
| Qualified buyer responses | **0** (none contacted) |
| Paid commitments | **0** |
| Verified money | **$0** |

## Source reachability (network "open", but only partly)
- reddit.com `/new.json`: blocked by a "network security" HTML page. `/new/.rss` worked once for r/forhire (25 posts), then every other sub returned 429.
- github.com HTML: 403 through the proxy. api.github.com search is scoped to this repo. The GitHub MCP search works.
- Worked: hn.algolia.com, earn.superteam.fun/api, api.basedagents.ai, bountycaster (returned an empty list).

## Leads
| # | Lead | URL | Posted | Budget | Accepts crypto? | Fit (0-10) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | BasedAgents: link-check the agent docs and discovery files | api.basedagents.ai/v1/tasks, task_wc7WkksHaWUTIykiVUSeH (board: https://basedagents.ai/tasks) | 2026-09-24 02:53Z | **$0** ("free, with no bounty", reputation only) | **Y**: the board's paid tasks settle in USDC on eip155:8453 (Base), e.g. task_cCvO29iq $1.00 USDC verified. llms.txt: "wallet set 0x... --network eip155:8453 (USDC on Base)" | 6 (fit), 1 (revenue) | **Work done**: report with 34 URLs, 0 broken, false positives explained. Draft delivery written. Owner must register an agent to deliver |
| 2 | Superteam Earn: "Build and Demo a Mermail Agent Skill" | https://earn.superteam.fun/listing/build-and-demo-a-mermail-agent-skill | open, deadline 2026-10-07 | 500 USDC (contest, 160 submissions) | Y, but USDC on **Solana**, not Base. Marked `HUMAN_ONLY` | 1 | No-go: marked human-only, needs a demo video on X, contest odds |
| 3 | Omi docs-recipe bounty (A3) | https://github.com/BasedHardware/omi/issues (e.g. #18598, 11:15Z today) | still active today | $25 proposed | **N**: no crypto evidence | 3 | Still open and still flooded: 102 matching proposals, 8+ today alone. A3's work is still in products/leads/omi-todotxt-recipe |
| 4 | Vista #62 (A3) | https://github.com/Mantitup-Org/vista/issues/62 | 2026-09-20 | not stated | unknown | - | **Could not re-check**: github.com returns 403, and the MCP is not scoped to that repo |

Rejected (no crypto, or wrong type): r/forhire posts from the last 72h, which were a German WordPress dev, a $25 logo, graphic design, an LA shoot crew, AI-eval finance experts, and "chatters" (Telegram recruiter, a scam risk). None mentions crypto. Most Superteam listings are X-content contests that need an X or Superteam account. The HN "USDC" hits were not job posts. They surfaced BasedAgents via user maxcr, 2026-09-24.

## Key finding
The only live buyer found that pays small digital work to our exact rail (USDC on Base) is **BasedAgents.ai**, and all of its currently open tasks are unpaid seed tasks. Paid tasks there are micro ($0.10 to $2) and get claimed fast. Revenue is only realistic if the owner registers an agent, sets the wallet to 0xA973f9F3D582189D5941e09cB4d198ca1e8E99cA, builds reputation with free deliveries like #1, and then watches for paid tasks.

## Files
- `/home/user/Adam71x1/products/leads/basedagents-linkcheck/linkcheck.py`
- `/home/user/Adam71x1/products/leads/basedagents-linkcheck/linkcheck-report.json`
- `/home/user/Adam71x1/products/leads/basedagents-linkcheck/PROPOSAL.md` (owner steps + delivery draft as "Quillforge Studio (AI-assisted)")

## Owner decisions
1. Should we register a BasedAgents agent (an identity action, so it's the owner's call) with the Base wallet, and deliver #1?
2. Posting to Omi is still the owner's call, as in A3. It has no crypto rail.
