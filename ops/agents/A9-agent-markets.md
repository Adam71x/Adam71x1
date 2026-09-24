# A9 — Agent marketplaces (no email/phone/KYC)

Project: Quillforge Studio (openly an AI agent). Payout target: USDC on Base `0xA973f9F3D582189D5941e09cB4d198ca1e8E99cA`.
Window: 14:35–14:39 UTC, 2026-09-24 (about 4 minutes of active work). BasedAgents was left alone because A8 has it.

## Result
- Verified money: **$0**. Nothing arrived on-chain.
- Registrations made: **0 that count**. On BountyBook I made one sign-in session with a fresh throwaway key (see below). No profile was set up and I claimed no job.
- Tasks claimed/delivered: **0**.
- Qualified buyer responses: 0. Paid commitments: 0.

## Actions
1. Web search for agent bounty boards and x402 task boards → candidates: BountyBook, TaskBounty, Claw Earn, ClawTasks, linknpark x402 board.
2. BountyBook: pulled the open jobs, the OpenAPI spec and llms.txt. Wrote solutions for two open jobs, caesar.py (job 6b626f9c, $1.50) and slugify.py (job 6c541fc3, $2.00). Both pass the job's own oracle `test_code` locally. The files are in scratchpad `a9/work/` and were not submitted.
3. BountyBook: made a fresh throwaway key in scratchpad (`a9/bb_session_key.json`, mode 600, never printed, not in the repo). Signed the login nonce with it and got a session token. Then called `POST /jobs/6b626f9c.../claim` with `executorAddress` = the payout wallet. The reply was **403 `executorAddress must match authenticated wallet`**.
   - So BountyBook pays out only to the wallet that signs in. To get paid at the payout wallet, that wallet's private key would have to sign. **Per the rules, I skipped it.**
   - I did not claim with the throwaway address. Any USDC sent there would be stuck: moving it needs ETH for gas, which means spending, and that isn't allowed. It would also leave money in a key the owner doesn't hold.
   - Side effect: the failed claim created an empty BountyBook profile for the payout address (`/agents/0xA973…` shows first_seen, 0 jobs).
4. TaskBounty, ClawTasks and Claw Earn: checked how to sign up and what they require (below). None qualify.

## Platforms evaluated
| Platform | Registration | Paid tasks seen | Qualifies? | Evidence |
|---|---|---|---|---|
| **BountyBook** (Base, x402) | No email/KYC. Sign in by having an ETH key sign a nonce (`/auth/nonce`, `/auth/verify`). Payout = the signing wallet (`executorAddress` must match). Claiming and submitting are free. 4% fee. | 121 open jobs (API `total`). Most are from poster 0xcef19483, $1.50–$14 USDC. Examples: 6b626f9c Caesar cipher $1.50; 6c541fc3 slugify $2.00; 7ef434e0 json_to_md $2.00; a0af3d48 versions.json $2.50; a99032ec Go LRU cache $14; 969317da SaSame warm intro $0.01 plus commission | **Blocked**: the payout wallet's key would have to sign in | https://www.bountybook.ai/docs , https://www.bountybook.ai/llms.txt , https://api.bountybook.ai/jobs?status=open , https://api.bountybook.ai/openapi.json |
| **TaskBounty** | Email+password, Google or GitHub login. API key comes from the dashboard. Crypto payout address can be set by API (Base USDC listed) | `GET /api/v1/tasks` → `{"data":[]}`, **0 open** | No: needs an account and has no tasks | https://www.task-bounty.com/for-agents , https://www.task-bounty.com/login |
| **Claw Earn** (aiagentstore.ai) | No KYC. Sign in by wallet signature (EIP-191), then sign and send transactions yourself. Worker must **stake** 30% on the first task (then 20%, then 10%). Minimum bounty 9 USDC (3 USDC agent-to-agent) | Not listed (needs a signed-in session) | No: staking is spending, and the payout wallet's key has to sign | https://aiagentstore.ai/claw-earn/docs/overview |
| **ClawTasks** | `POST` register with `{name, wallet_address}` (public address only). Claiming needs a **10% stake** | Site shows a "paid bounty wind-down" notice. The bounties API returned 500 | No: stake counts as spending, and paid bounties are winding down | https://clawtasks.com/ , https://clawtasks.com/skill.md |
| linknpark x402 board (dev.to post) | "No accounts": the answering wallet gets paid over x402 | Couldn't check: dev.to is blocked by the egress proxy | Unknown | https://dev.to/linknpark/how-to-pay-ai-agents-in-usdc-x402-bounty-board-5-commands-no-accounts-4o17 |

## Takeaway / next step for the owner
BountyBook is live and has dozens of small coding jobs checked by an automated oracle. Each takes an agent about 10 minutes, and two are already solved and tested locally. It pays only to the wallet that signs in. The operator could use a wallet they control for BountyBook and have an agent sign the nonce with it. Or they could accept payouts to a separate agent wallet that the owner holds and funds with gas. Both options are the owner's call, and I did neither.
