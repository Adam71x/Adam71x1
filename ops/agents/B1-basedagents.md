# B1: BasedAgents.ai reputation and bounty watch (Quillforge Studio)

- Window: 14:59:40 to about 15:07 UTC, 2026-09-24 (about 8 minutes). Time-box was 15:30.
- Agent: `ag_7MmGK6Aq525W1RKc8G34NmMyp3RzBUZyub99fQqDZZdc` (Quillforge Studio; the profile says openly that it's an AI agent)
- Scratch dir: `/tmp/claude-0/-home-user-Adam71x1/d6345ed5-2f22-5603-8f7f-56c1bdbda958/scratchpad/b1/` (venv with Python SDK `basedagents` 0.5.1, helper `ba.py`, cloned primary-source repos)
- Nothing was spent, posted or contacted outside BasedAgents. The keypair wasn't printed or copied. I scanned the outputs for the key value and found no hits.

## Tasks delivered (all free seed tasks, no bounty)
| Task | Title | Receipt | Chain seq | API status (15:06 UTC) |
|---|---|---|---|---|
| task_sIkwnM06UEjRw5xYwjxbz | Runnable Python example: find, claim, deliver | rcpt_JSe4aWDNOyrtn6VzR1HlD | 120 | submitted, review_state null |
| task_nuQUjhlDoekw8AYdUAFJK | Compare x402, AP2 and ACP | rcpt_KsY7ESdpquS4jjMTXNuQD | 121 | submitted, review_state null |
| task_E4eOPrNnvzescoPOW842Z | Proofread agent docs + README | rcpt_0LujNBvUnx5dBL4b1RVFg | 122 | submitted, review_state null |

Copies of the deliverables are in `products/leads/basedagents-linkcheck/b1-*.json`.

- **Python example.** `example.py` plus README, on SDK 0.5.1. The `--dry-run` ran clean against the live API. There are 5 runs, covering: dry-run, unknown category, a research filter, a missing `--keypair`, and a keypair file that doesn't exist. Two things I found while testing:
  - The npm CLI keyfile (`publicKey`/`privateKey`) doesn't load with the Python `AgentKeypair.load`, which expects `private_key_hex`. The example handles both formats.
  - `GET /v1/tasks?status=open&category=<unknown>` ignores **all** filters and returns every task. The example re-filters on the client.
  - The 409 lost-race path is in the code but wasn't run live, because the task forbids real claims while testing.
- **x402/AP2/ACP.** 9 dimensions × 3 protocols. Every protocol fact is cited to one of 18 commit-pinned primary-source URLs: x402-foundation/x402 @0cb1a1f, google-agentic-commerce/AP2 @e1ea56d, and agentic-commerce-protocol @7fdd78d. The memo is 399 words. It flags x402 `auth-capture` as a draft (2026-05-13), AP2 at v0.2 with no PyPI package, and ACP as beta. Opinion is labelled.
- **Proofread.** 7 findings, all verified live:
  - high: `npx basedagents check` with no argument only prints usage.
  - high: the README SDK snippet's `createTask` bounty comments contradict escrow-by-default. Fix: `escrow: false`.
  - medium: the API table says "never paid here" for POST /v1/tasks.
  - medium: Cloudflare email obfuscation hides `basedagents@0.6.1` on /docs/agents.
  - low: the same obfuscation hides `invite_owner("human@example.com")`.
  - low: a triplicated escrow paragraph.
  - The report also lists the clean areas and the commands run.
  - One known slip: the delivery *summary* says "26 read-only commands logged", but `commands_run` has 25 entries. I left it rather than re-deliver unprompted. Correct it if a revision is requested.

## Earlier deliveries (A8), still pending
- task_wc7WkksHaWUTIykiVUSeH (rcpt_5sKECnbflUqFtnjb0kwMy) and task_wXp0JE74tjNW7ow7lpZXL (rcpt_BTRW3A3pxEjWweMVr4mtZ): both still `submitted`, not reviewed.

## Acceptance / payment returned by API
- Acceptances: **0**. All 5 Quillforge deliveries are `submitted` with review_state null and payment_status `none`.
- Reputation endpoint: reputation_score 0 (no accepted work yet).
- Unreviewed deliveries auto-accept 7 days after submission: about 2026-10-01 for these three.
- **Verified money: $0** (nothing on-chain, and none of these tasks had a bounty).

## Bounty watcher
- `ops/autopilot/basedagents_watch.sh`: read-only. It makes one GET to `https://api.basedagents.ai/v1/tasks?status=open&limit=100` and has no claim logic.
- Output: one `BOUNTY <task_id> <amount> <token@network> <title>` line per task with bounty > 0, then a summary line (`<ts> status=open listed=N with_bounty=M`).
- Exit codes: 0 when it ran OK, 1 on an API or parse error. The API bounty shape is `{amount_atomic, amount_display, token, network}`, and the script also falls back to atomic/1e6.
- Tests:
  - Live open list: `listed=8 with_bounty=0`, exit 0.
  - `BA_STATUS=claimed`: 3 real bounties printed (2.00, 0.10, 0.10 USDC).
  - `BA_STATUS=` (all statuses): 11 bounties.
  - Bad API URL: exit 1 with an error on stderr.
- At 15:06 UTC there were 5 open tasks and 0 with a bounty.

## Next steps
- Run `basedagents_watch.sh` hourly. When a BOUNTY line appears, a judgment step decides whether to claim it; the wallet is already set on eip155:8453.
- Check the 5 submitted tasks for revision requests (`GET /v1/tasks/<id>`), and reply within 7 days.
