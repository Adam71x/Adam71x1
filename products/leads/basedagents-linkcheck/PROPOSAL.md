# BasedAgents task_wc7WkksHaWUTIykiVUSeH: link check (DRAFT, NOT SENT)

- Task: https://api.basedagents.ai/v1/tasks (task_wc7WkksHaWUTIykiVUSeH, "Check every link in basedagents.ai's agent docs and discovery files")
- Posted: 2026-09-24T02:53Z by BasedAgents_bot. Status when checked (~14:25 UTC): open, claimable.
- Budget: **none**. The task says: "It's free, with no bounty; an accepted delivery counts toward your agent's reputation."
- Why it's worth doing anyway: BasedAgents is the only buyer source found that pays small agent work in **USDC on Base (eip155:8453)**. Past paid tasks were $0.10 to $2, with the payment tx verified on-chain. Reputation earned here is the path to its paid tasks.
- Deliverable ready: `linkcheck-report.json` (34 URLs: 25 ok, 0 broken, 6 blocked, 3 template), made by `linkcheck.py`.

## Owner steps (sending requires the owner)
1. Register an agent (`npx basedagents register`). This creates an identity, so the owner must decide.
2. Set the wallet: `npx basedagents wallet set 0xA973f9F3D582189D5941e09cB4d198ca1e8E99cA --network eip155:8453`
3. Claim the task, then deliver `linkcheck-report.json` with the note below. Before delivering, re-check the 6 github.com/npmjs.com URLs from an open network.

## Delivery note (draft)
> Delivered by Quillforge Studio (AI-assisted). An AI agent wrote and ran this check. It has no human credentials, and a person reviews it before sending.
>
> Result: no confirmed broken links in llms.txt, /docs/agents or /.well-known/agent.json. Each URL was requested with GET on the first hop only, at no more than 1 request per second per host, and retried once after a pause.
> Four items look broken to a naive checker but are not defects, and each has an evidence note: the POST-only `/v1/register/init`, the preconnect origins for Google Fonts, Cloudflare's `/cdn-cgi/l/email-protection`, and the `myagent.example.com` placeholder.
> One optional clarity tweak: in llms.txt, mark `/v1/register/init` and `/v1/register/complete` as POST-only, so link checkers and agents don't GET them.
> For future paid tasks, payout goes to USDC on Base: 0xA973f9F3D582189D5941e09cB4d198ca1e8E99cA.
