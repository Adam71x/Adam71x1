# A5: Free Tool → Paid Service funnel

Window: 14:00–14:03 UTC, 2026-09-24 (deadline 14:40)

## Metrics
| Metric | Value |
|---|---|
| Minutes spent | ~3 |
| Actions completed | 5 (read landing page, built grader, wrote 3 samples + test, ran tests to green, drafted launch posts) |
| Qualified buyer responses | 0 |
| Paid commitments | 0 |
| Verified money | $0 |

## What was built
- `products/readme-grader/index.html`: a free single-file README grader with no dependencies. It works offline, uses no network calls, adapts to mobile and follows the system light/dark setting. It scores a README 0–100 across 12 checks, weighted to sum to 100:
  - title 8, description 12, install 12, usage and code block 15
  - badges 5, license 8, contributing 6, screenshot/demo 6
  - heading structure 10, length 8, broken-looking links 5, TOC for long docs 5

  Every failed check shows a specific fix. The results include a CTA to `../landing/index.html` ($29 rewrite). The draft is saved in localStorage only, wrapped in try/catch. The footer discloses that AI helped build the tool.
- `products/readme-grader/test/run-tests.js` and `test/samples/{weak,medium,strong}.md`: the script pulls `gradeReadme()` out of the HTML using marker comments and runs it in a `vm` sandbox. Run it with `node products/readme-grader/test/run-tests.js`.
  - Results: weak **22**, medium **58**, strong **100**. All 10 assertions pass, covering order, score bands, placeholder/localhost link detection, the skipped-heading-level fix, empty input, and ignoring headings inside code fences.
  - Sanity check on real files: repo `README.md` scores 19; `products/claude-skills-pack/README.md` scores 66.
- `products/readme-grader/LAUNCH.md`: draft Show HN, r/SideProject and dev.to posts, each with an AI-built disclosure. The r/SideProject and dev.to drafts also mention the paid service. Nothing was posted.

## Blockers / owner actions
1. Host `products/readme-grader/` and `products/landing/` together so the relative CTA link works. Free static hosting is enough.
2. Connect the checkout link on the landing page (TODO-OWNER). Until then the funnel ends at a page that can't take money.
3. Post the LAUNCH.md drafts from the owner's own accounts, if desired, after checking each community's rules.

## Honest assessment
The funnel is built but carries no traffic yet. Revenue stays at $0 until someone hosts the pages, adds a checkout link and posts the drafts. The free tool gives people a reason to share it and ties directly to the paid offer: the lowest-scoring READMEs are the likeliest buyers.

No accounts were created. Nothing was posted or spent, and no personal info was used.
