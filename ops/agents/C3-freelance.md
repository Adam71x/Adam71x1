# C3: Freelance "claim" packages (paid small jobs, last 72h)

Window: 15:13 to 15:19 UTC, 2026-09-24. I posted, DMed, applied and signed up for nothing.
Money verified: **$0**. Every package below still needs the owner to send it.

## Sources and access
| Source | Result |
|---|---|
| reddit.com / old.reddit.com `.json` and `.rss` | Blocked. `.json` redirects to login, and RSS returns 429 from this IP |
| **arctic-shift.photon-reddit.com API** (no key) | **Works.** It returned full post text for r/forhire, r/slavelabour, r/jobbit, r/HireaWriter, r/DoneDirtCheap and r/hiring for 2026-09-21 to 2026-09-24 |
| api.pullpush.io | 429, and it asks agents to buy access |
| HN "Freelancer? Seeking freelancer?" | The Algolia index's newest thread is Oct 2025. I didn't find a Sept 2026 thread before running out of time |
| Upwork job search | 403 Cloudflare challenge |

## Market reality (about 200 hiring/task posts scanned)
Most posts are one of: hourly jobs or jobs limited to certain countries; human-only work (voice recordings, cold calling, local presence, phone checks); commission-only sales; or scam-shaped offers ($3–5 a day "LinkedIn VA", "screenshot projects", account rental). Several posts had already been removed by moderators. Only **one** post in the window was a well-scoped digital job with a stated budget of $50–$500 that AI could do: the boxing script. The other two picks are below $50, but the work is already finished and they're quick to close.

**Excluded:** the Figma "assignment" ($15, looks like coursework), the internship research and cold-email job (post removed), "search for old Swiss exams" (possible academic dishonesty), a casino affiliate promoter, "Experienced Reddit users earn $600" (account rental), and a GMB profile needing a local presence.

## Top 3 (budget × fit × freshness)
| # | Job | Budget | Posted (UTC) | Built already | Package |
|---|---|---|---|---|---|
| 1 | Boxing YouTube scriptwriter (r/forhire 1woearm + r/HireaWriter) | **$110–$140/script, about weekly** | 09-23 18:37 | A full ~1,550-word, 15-minute documentary script (Douglas vs Tyson, "42 to 1") with [CLIP] cues and fact-check notes | `products/claims/boxing-script-sample/` |
| 2 | Automate AI blog writing to Typeflo (r/slavelabour 1wo18rf) | $25 + a monthly fee (below floor) | 09-23 09:33 | `autoblog.py` (dry-run tested) using the documented Typeflo Admin API with scheduling, OpenAI text and images, imgbb hosting, and a monthly GitHub Actions workflow | `products/claims/blog-automation-typeflo/` |
| 3 | Med-spa logo (r/forhire 1wougoo) | $25, "very flexible" (upsell to $45) | 09-24 06:48 | 3 SVG logo concepts with a placeholder name, **not rendered or visually checked** | `products/claims/medspa-logo-concepts/` |

Each folder has a `CLAIM.md` with: post URL, posted time, budget, what's done, the exact reply from "Quillforge Studio" (openly AI-assisted, no links), payment and identity notes, and owner steps.

## Payment and identity (all three)
All three are Reddit or Google-Form jobs paid off-platform: PayPal or Wise in the owner's name, and no platform KYC. Rules: previews before payment, final files after payment. Refuse overpayment or check schemes. Never take client API keys over DM.

## Owner next actions (in order)
1. **#1 first:** it has the biggest value and is recurring. Fill in the Google Form linked from the post and paste the application text. Human fact-check the script's flagged details before sharing it.
2. #2: comment or DM the reply. Setup is about 15 minutes once the client has keys.
3. #3: open the SVGs in a browser, fix anything that looks off, then DM.
4. For future runs, use arctic-shift for Reddit (e.g. `/api/posts/search?subreddit=forhire&after=<ISO>&limit=100`) and filter for "[Hiring]" plus a stated "$".
