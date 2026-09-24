# A3 "Buyer Request Scout": report

Window: 13:58 to 14:10 UTC, 2026-09-24. Nothing was posted, messaged, applied for or signed up for. $0 spent.

## Metrics
| Metric | Value |
| --- | --- |
| Minutes spent | ~12 (13:58 to 14:10 UTC) |
| Actions completed | ~45 tool actions: ~25 searches/fetches across 12 sources; 2 repo clones; scaffolded, built and ran 6 `vista deploy` dry-runs; wrote one converter with 12 passing tests; wrote 3 lead folders |
| Qualified leads (all criteria: budget stated + < 1 day + legit + ≤ 7 days) | **0 fully qualified.** 2 partial leads, 1 watch-only. See table |
| Qualified buyer responses | **0**. No one was contacted, by design |
| Paid commitments | **0** |
| Verified money | **$0** |

## Blocker: most buyer sources were unreachable
The sandbox egress proxy blocked, or the tools refused, every marketplace the brief named:
- reddit.com (r/forhire, r/slavelabour): blocked by the fetch tool and refused by the search tool
- upwork.com, freelancer.com, peopleperhour.com: blocked
- news.ycombinator.com, hn.algolia.com, hacker-news.firebaseio.com: blocked
- dev.to, community.n8n.io, community.airtable.com: blocked
- WebSearch works, but it returns only category pages and old listings. It surfaced no dated [Hiring] posts from the last 7 days.

**GitHub was the only live source.** (Web search pages were read with WebFetch. The MCP search was rate-limited, and the REST search API is limited to this session's repos.) GitHub "bounty" results for the last 7 days are about 95% noise: auto-generated bounty farms (OphirPay, bounty-plaza, relayhop radar, OmniBlocks "bountyfarmer", SecureBananaLabs), scanner bots (BountyScout), and test repos.

## Leads
| # | Lead | URL | Posted | Budget | Fit (0-10) | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Omi (BasedHardware): self-proposed docs bounty "action items -> todo.txt recipe" | https://github.com/BasedHardware/omi (standing invite: docs.omi.me/doc/developer/Contribution). Similar proposals were closed as completed 2026-09-24, e.g. #14781 | Program active; peers opened proposals 2026-09-24 | $25 (the rate proposers name themselves) | 4 | **Work done**: converter, 12 tests, recipe doc, draft issue |
| 2 | Vista framework `vista deploy` bug hunt | https://github.com/Mantitup-Org/vista/issues/62 (+ #61) | 2026-09-20 | **Not stated** ("paid or credited") | 5 | **Work done**: reproduced on 0.3.6, 5 findings with file:line and fixes, draft report |
| 3 | Tenstorrent tt-metal bounties | https://github.com/tenstorrent/tt-metal/issues/56908 | 2026-09-17 | $3,000 | 1 | No-go: needs hardware, already assigned, multi-day |
| - | Rejected: sharmiaalono/go-github #5 "$10 BountyHub" | https://github.com/sharmiaalono/go-github/issues/5 | 2026-09-18 | $10 | 0 | Cloned it: the repo contains only a "Hello, Bounty Hunter!" main.go. The files the issue references don't exist, so it's fake or a test |

## Files
- `/home/user/Adam71x1/products/leads/omi-todotxt-recipe/`: `action_items_to_todotxt.py`, `test_action_items_to_todotxt.py` (12/12 pass), `action_items_todotxt.md`, `PROPOSAL.md`
- `/home/user/Adam71x1/products/leads/vista-deploy-bug-hunt/`: `REPRO-FINDINGS.md`, `PROPOSAL.md`, `logs/` (dry-run logs, emitted `_redirects` and `render.yaml`)
- `/home/user/Adam71x1/products/leads/tenstorrent-bounty-watch/PROPOSAL.md`

All proposals are written as "Quillforge Studio (AI-assisted)", say plainly that AI helped, and claim no personal credentials.

## Owner decisions needed
1. **Omi ($25)**: the fastest path to any cash, but the channel is flooded with AI proposals (12+ action-item recipe proposals on 9-24 alone), and payout is unverified. Post it only if you're comfortable with that.
2. **Vista**: the findings are useful whether or not it pays. Suggest asking in #62 whether the bounty is cash before posting the full report.
3. **Sourcing**: to reach real buyer requests (r/forhire, Upwork), a human needs to browse from an unrestricted network, or those hosts need to be added to the egress allowlist. From this sandbox, the stated-budget buyer market can't be reached.
