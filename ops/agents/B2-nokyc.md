# B2: Work that pays to a wallet with no KYC (Quillforge Studio, AI agent)

Window: 14:59:48 to 15:06 UTC, 2026-09-24. Payout target: USDC on Base `0xA973f9F3D582189D5941e09cB4d198ca1e8E99cA`. Nothing was spent and no account was created. The only thing posted anywhere was a Cashu mint quote request (details below). BasedAgents and BountyBook were skipped because other agents cover them.

## Metrics
| Metric | Value |
|---|---|
| Minutes | ~7 |
| Actions | ~22: 4 web searches; 3 Nostr relay scans (NIP-90 2-day and 7-day windows, SatShoot kind 32767); 1 Cashu mint quote test; 2 repo clones (agent-bounties, claude-builders-bounty; x402-mcp was private or gone); 1 agentbounties feed pull; 5 DeskCrew/npm/gigs.sh probes; 1 dev.to API read; 1 ZapWork scrape; 1 deliverable built and tested |
| Candidates evaluated | 9 |
| Submissions made | **0** |
| Buyer responses | 0 |
| Paid commitments | 0 |
| Verified money | **$0** (nothing on-chain) |

## Candidates
| # | Candidate | URL | Amount | KYC / identity / payout evidence | Status | Feasible? |
|---|---|---|---|---|---|---|
| 1 | Nostr NIP-90 DVM job requests (kinds 5000–5099) | wss://relay.damus.io, nos.lol, relay.primal.net | 7-day total across 3 relays: 23 requests, 8 with a `bid`, bids summing to **543 sats** (~$0.35). The largest bid was 100 sats | No account. Answering needs a fresh Nostr keypair, and getting paid needs a bolt11 invoice. I tested that a Cashu mint issues an invoice with no signup (`POST mint.minibits.cash/Bitcoin/v1/mint/quote/bolt11` returned a `lnbc1u…` for 100 sats in state UNPAID). | Open, but 19 of 23 requests already have DVM responses, and every bid-bearing job was answered. Most are test spam ("fddddd", "Hey") | **No.** The pay is trivial, and all bids are already answered. Payment arrives as bearer ecash held inside this ephemeral sandbox, which is lost at session end, not USDC on Base. Converting it would need a swap service. |
| 2 | DeskCrew x402 bounty board (the "linknpark" dev.to post) | https://deskcrew.io/agents, /.well-known/x402 | Rewards $0.25–$10 per ticket, and the agent gets 85% | No account ("the wallet is the identity"). But "Reads are free. **Writes are cents.** Paid tools run $0.02 – $5.00 per call", and dev.to says "Enter an answer: a few cents, the answering agent" pays | Live (x402 manifest updated 2026-09-24) | **No.** Every submission costs money, and the x402 payment must be signed by a funded key. |
| 3 | Agent Bounties (NSPG13) | https://api.agentbounties.app/v1/opportunities/feed.json | Past issues show 0.90 USDC per solve | Quickstart: "Ask the wallet owner to sign the returned `wallet_request`". Issues show a 0.10 USDC entry/claim **bond** | Feed returned `"items": []`, so there is nothing open | **No.** Needs a signature from the payout key plus a bond, and there is no open work. |
| 4 | claude-builders-bounty (GitHub) | https://github.com/claude-builders-bounty/claude-builders-bounty | README lists #1 $50, #2 $75, #3 $100, #4 $150, #5 $200 | "Comment `/opire try`… Submit a PR". "Payment is handled by Opire (**Stripe**)". Needs a GitHub account, and a Stripe payout means KYC | Listed as open. The issue pages return 403 through the proxy | **No (identity and KYC).** I built the #3 deliverable anyway (see below). |
| 5 | kwizzlesurp10-ctrl/x402-mcp #496 "$25 USDC add-only docs/LIVE_LEDGER.md" | github.com/kwizzlesurp10-ctrl/x402-mcp/issues/496 | $25 USDC | A clone failed with an auth prompt, so the repo is private or deleted. Any submission would be a GitHub PR, which needs an account | Unverifiable | No |
| 6 | ZapWork (Nostr freelance) | https://zap-work.com/jobs | 17,313 sats and 10,990 sats | Needs a "Login". The first job asks to "send a DM or an email" | 2 listings, posted **189 and 300 days ago**, so stale | No |
| 7 | SatShoot (Nostr freelance, nutzaps) | github.com/Pleb5/satshoot | n/a | Nostr key identity. Pays in sats or ecash, not Base USDC | 0 kind-32767 events in 30 days on the 3 relays (relay.satshoot.com has a TLS hostname mismatch) | No |
| 8 | Base Builder Grants / Base Batches / Base Creator Grant | gitcoin.co/apps/base-builder-grants, batches.base.org | 1–5 ETH; $10k; up to $4k | Retroactive and nominated, or team applications with a formal process. None accept a bare wallet address | Open | No (needs an identity or team) |
| 9 | gigs.sh directory of agent-native gigs (discovery only) | https://gigs.sh | n/a | n/a | TLS connection reset through the proxy, so the directory was not read | Not checked |

Every no-KYC rail I found hits the same structural wall. The payout goes to **the wallet that signs** the claim or the x402 entry fee: BountyBook (per A9), Claw Earn, DeskCrew and Agent Bounties all work this way. We hold only the public address, and spending is forbidden, so none of these can pay the target wallet. The rails that accept a free-text payout address (GitHub-issue bounties) need a GitHub account. The session's GitHub credential is the user's personal account, so I did not use it.

## Work product (finished, not submitted)
`/home/user/Adam71x1/products/nokyc/claude-hook-block-destructive/` is for claude-builders-bounty #3 (listed at $100):
- `block_destructive.py`: a Claude Code PreToolUse hook. It exits with code 2 and a reason for rm -rf on root/home/cwd/wildcard, git force-push/reset --hard/clean -f, DROP/TRUNCATE/unscoped DELETE, mkfs/dd onto devices, curl|sh, fork bombs, shutdown, and terraform destroy/kubectl delete --all. It has an env override and a JSONL log of blocked attempts.
- `test_block_destructive.py`: **35/35 pass**.
- `README.md`: install snippet, plus the reason it was not submitted. It needs a GitHub account and `/opire try`, and Opire pays out through Stripe, which needs KYC. The acceptance criteria weren't readable because the issue page returns 403.

## Recommendation
With no key, no spend and no identity, the realistic earning paths are zero today. The smallest unlock would be one of these:
(a) the owner signs a single claim or x402 entry with the payout wallet's key on BountyBook or DeskCrew, or
(b) the owner submits the ready hook to claude-builders-bounty #3 under their own GitHub account, accepting Opire/Stripe KYC.
Revisit NIP-90 only if a DVM job appears with a bid above ~5k sats and a way to cash out to Base.
