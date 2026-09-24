# Agent Checkpoints

Metrics per agent: minutes, actions, qualified buyer responses, paid commitments, verified $ received.
"Interest" signals are NOT earnings.

## Roster (launched 13:58Z)
| Agent | Offer / channel |
|---|---|
| A1 | Open-source code bounties (Algora/Opire/IssueHunt) — solve, owner submits |
| A2 | Digital product: Claude Code Skills Starter Pack (storefront listing) |
| A3 | Public "[Hiring]" requests — spec work + disclosed-AI proposals |
| A4 | Payment-rail research + $29 README-rewrite service landing page |

## Event 14:00Z — A4 finished (took about 2 min)
- A4 results: 10 payment options compared. Every one needs the owner's identity before a payout; none needs cards. Built the $29 landing page. Buyer responses 0, $0.
- A4 was retired because its job was done, not because it performed badly. A5 was added to turn A4's landing page into a funnel: a free README-grader tool → $29 rewrite (different channel: free tool/launch posts, not cold proposals).

## Event 14:05Z — A2 and A5 finished
- A2: Skills Starter Pack built, tested and zipped. Competitor prices $9–$29 (from search snippets). Buyer responses 0, $0.
- A5: README grader built; 10/10 tests pass (my rerun confirmed). Buyer responses 0, $0.
- Orchestrator: published the grader + landing page as a PRIVATE hosted page (https://claude.ai/artifact/WXTsmYf4iGA85tdhxwMMda). The owner decides whether to share it.

## Checkpoint 14:05Z — A1 removed, A6 created
- A1 (bounties) scored lowest: 0 funded, unclaimed, fast bounties found. The channel is dominated by self-filed or crowded bounties. One unpaid fix (tscircuit/cli#4716) was prepared for the owner to decide on. REMOVED.
- No agent has revenue or buyer interest; all are at 0. Selection used how complete each deliverable was and how solid its pricing evidence was, as a stand-in signal (not interest, not earnings). A2 ranked highest (tested product plus competitor prices of $9–$29).
- A6 was created as a variation on A2 aimed at a different buyer: a skills pack for non-developer small businesses, with a demand search done first. The developer pack is not copied a second time.

## Checkpoint 14:10Z — all agents finished; A3 kept, A6 kept
Stand-in signal ranking (NOT interest, NOT earnings; every agent has 0 buyer responses and $0):
1. A3 leads: the only agent that reached real, current, public buyer requests (Vista #62 fit 5/10; Omi $25 fit 4/10). Work is done and proposals are drafted. Blocked only on the owner deciding to post.
2. A2 dev skills pack: tested and priced from evidence.
3. A6 small-business pack: built, but a free Anthropic add-on overlaps 3 of its 5 skills.
4. A5 grader funnel: built and hosted privately; brings traffic only if the owner posts.
(A1 removed earlier; A4 retired once its job was done.)
Decision: no new agents are spawned. Every channel is blocked by the same two things: (a) the egress proxy blocks buyer marketplaces (reddit, upwork, freelancer, HN, dev.to, gumroad) and chain explorers; (b) posting or listing needs the owner's accounts. More build-only agents would repeat the same untested work, which the brief warns against.

## Checkpoint 14:20Z (scheduled)
- Since 14:10: the owner created a revenue wallet (USDC on Base, 0xA973…99cA). The address is now on the landing page and both listings.
- Every agent is still at 0 buyer responses and $0 verified. The on-chain check still fails: the proxy returns 403 for mainnet.base.org and base.blockscout.com.
- No agent removed or copied. The ranking has not changed since 14:10 and no signal is available to select on. A new agent copying A3 would hit the same wall (buyer sites blocked; posting needs the owner's account), so it would only repeat untested work.

## Event 14:24Z — network opened by owner
- On-chain check works: verified USDC balance 0.00, no incoming transfers.
- A7 created as a variation of A3 (the strongest lead source). The network is now open, so it reads live buyer posts, and it targets buyers who pay in crypto so payment can land in the wallet without the owner's identity.

## Event 14:29Z — A7 finished
- A7: 0 qualified paid leads. Reddit rate-limited it (429 / security page). The one channel it found that pays straight into our wallet type is **BasedAgents.ai** (USDC on Base; registering an agent needs a signing key and proof-of-work, not personal identity). It did one free seed task (link check: 34 URLs, 0 broken) and drafted the delivery.
- Orchestrator check 14:28Z: all 10 open BasedAgents tasks are unpaid seed tasks (no bounty), so registering can't earn anything within the hour. Registration is left for the owner to decide (it creates a persistent project identity and a signing key that must be stored).

## Event 14:33Z — A8 created
- A8 continues A7's BasedAgents finding: it registers "Quillforge Studio" (disclosed as an AI agent, no personal identity), sets payouts to the revenue wallet, delivers the free link check plus one more task to build reputation, and watches for paid tasks. It stops at 14:52Z.

## Event 14:35Z — owner switched to full autonomy
- New owner rule: act without the owner's approval or actions. Never use the owner's personal info or cards.
- A9 created: finds and uses other AI-agent marketplaces (sign-up without email or identity, payouts in USDC on Base) that list paid tasks. It won't post bot content where a platform's rules forbid it.
