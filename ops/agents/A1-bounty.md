# A1 "Bounty Hunter": results

Window: 13:57:42 to about 14:04 UTC on 2026-09-24, measured with `date -u`.

## Metrics
| Metric | Value |
|---|---|
| Minutes spent | about 7 by the sandbox clock (13:57:42 to 14:04 UTC) |
| Actions completed | see list below |
| Qualified buyer responses | **0**. No maintainer was contacted and none replied. |
| Paid commitments | **0** |
| Verified money received | **$0** |

## Actions completed
1. Tried the GitHub search API. It is blocked; only repo-scoped endpoints work for this session. algora.io, api.opire.dev, dev.to and catchthesignal.com are blocked by the egress proxy.
2. Searched the web and read the bounty aggregators: AsherKasper/bounty-census (BOUNTIES.md), BountyScout alert issues from Sep 17–24, and bounty-radar.
3. Checked the repo-level issue lists of known Algora funders: tscircuit/core, tscircuit/cli, tscircuit/docs, tscircuit/tscircuit, zio/zio, archestra-ai/archestra, screenpipe, activepieces, projectdiscovery/nuclei-templates, coollabsio/coolify, CapSoftware/Cap. One caveat: the GitHub HTML view seems to return nothing for emoji-label filters, so I also searched for the word "bounty" as plain text.
4. Checked the individual candidates listed below.
5. Cloned tscircuit/cli with `git clone --depth 1`. Git clone works through the proxy. I wrote a fix and 2 tests for #4716, ran the tests in a separate setup (2 pass), and exported the patch.
6. Wrote `products/bounties/tscircuit-cli-4716-kicad-design-rules/` (README.md, fix.patch, BASE_COMMIT).

Nothing was submitted, commented on or claimed anywhere. No accounts were created and nothing was spent.

## Main finding
I found **no funded, uncontested bounty that can be done in under 30 minutes.** The market is saturated:
- bounty-census says 99% of about $1.14M in Algora bounties sits in 3 repos. After its filters, **only 1 bounty qualified**, and it had no amount and 24 comments.
- Most "new bounties" in September 2026 fall into three groups:
  - (a) BasedHardware/omi "[Bounty proposal]" issues. A contributor files the issue with their own PR already attached and proposes the amount themselves, so these are taken by design. Payment is not confirmed: #13478, which asked for proof of payouts, was closed as a duplicate with no proof given.
  - (b) UnsafeLabs/Bounty-Hunters. It is labelled "AI only allowed – no humans", has 401 forks, has a "clankers leaderboard", and requires a `_generation.json`. It looks like an agent honeypot or research farm, and I found no evidence of payouts.
  - (c) Bot-generated or self-referential bounty repos such as MergeEarn, BountyScout and relayhop.
- Big funders show no open bounty-labelled issues right now: tscircuit/core, Cap, archestra, screenpipe, activepieces, coolify and nuclei-templates.
- Two policy flags came up in search results: Algora's terms prohibit robotic access, and about 37 projects ban AI-written PRs. Any submission needs human review and disclosure.

## Candidate list (all status checks at about 14:00 UTC, 2026-09-24)
| URL | Amount | Status verified | Difficulty | Verdict |
|---|---|---|---|---|
| https://github.com/tscircuit/cli/issues/4716 | **none** (no bounty yet) | Open, 0 comments; earlier PR #4816 closed by the stale-bot without review | Easy; **patch done** | Best available. It is unpaid unless tscircuit adds a bounty. |
| https://github.com/BasedHardware/omi/issues/11481 | none stated (omi pays "on request") | Open; filed by a maintainer (kodjima33); needs backend and client changes in order, or a trimmed prompt | Medium; needs product judgment | Possible, but payment is unconfirmed |
| https://github.com/BasedHardware/omi/issues/15588 | $50 "proposed" by the issue author | Open; the author's own PR #15587 is attached | Easy | Taken. Do not snipe. |
| https://github.com/BasedHardware/omi/issues/17845 | $25 | Open; the author's own PR #17844 is attached | Easy | Taken |
| https://github.com/BasedHardware/omi/issues/15116 | $25 | Closed | n/a | Done |
| https://github.com/tscircuit/file-server/issues/5 | $10 | Open but labelled 💰 Rewarded | n/a | Already paid |
| https://github.com/tscircuit/docs/issues/886 | $50 (migrated from docs-old#47) | Open; the filer's own PR #887 exists | Medium | Taken |
| https://github.com/UnsafeLabs/Bounty-Hunters/issues/801 | $30 | Open; "AI only" | Easy | Red flag: likely an agent farm and payout is unverified. Avoid. |
| https://github.com/watney-ai/open-source-bounties/issues/1 | €2 | Open; 18 competing PRs; the repo has no BOUNTY.md file | Trivial | Not worth it |
| https://github.com/PG-AGI/toingg-jarvis/issues/13 | unspecified | Open; 24 comments | Large | Not suitable |

## Awaiting owner decision
1. **Whether to submit the tscircuit/cli #4716 patch** under the owner's GitHub identity (`products/bounties/tscircuit-cli-4716-kicad-design-rules/`). The steps are in the README. The repo's full test suite and typecheck have **not** been run here because dependency install hits 403s. Expected cash is $0 unless a maintainer adds a bounty. The benefit would be reputation with tscircuit, which has paid out 707 bounties.
2. Whether to set up an Algora account (GitHub OAuth plus Stripe Express KYC). Any future Algora payout needs this.
3. Whether it is worth spending owner time on omi #11481. There is no stated amount and payment is unproven.

Recommendation: bounty hunting is a poor channel for fast revenue from $0 right now. Real bounties are either very large and contested, or claimed by their own filers within minutes.
