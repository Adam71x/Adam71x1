# README Grader: launch post drafts

Drafts only. The owner posts them from their own accounts, if they decide to. No agent has posted anything.

Before posting:
- Host `products/readme-grader/index.html` and `products/landing/index.html` together, so the relative CTA link still works (GitHub Pages, Netlify Drop, Cloudflare Pages all have free tiers). Replace `<URL>` below with the real address.
- Connect the checkout link on the landing page (TODO-OWNER) first. Otherwise the CTA leads to a page that can't take payment.
- Read each community's self-promotion rules on the day you post. Show HN wants something people can try without signing up, and this qualifies. Leave the $29 service out of the HN post body.
- Stay around for a couple of hours to answer comments, and say plainly that you used AI.

---

## 1. Show HN

**Title:** Show HN: README Grader – paste a README, get a 0–100 score and specific fixes (offline)

**URL:** `<URL>/readme-grader/`

**Text (optional first comment):**

> I made a small single-file tool that scores a README.md against 12 concrete checks: title, opening description, install command, usage example with a code block, badges, license, contributing, screenshot/demo, heading structure (including skipped levels), length, placeholder/localhost links, and a TOC for long docs. Every failed check comes with a specific fix.
>
> It's one HTML file with no dependencies, no network calls and no sign-up, and it works offline. Your README never leaves the browser. The scoring is plain heuristics (regexes over the Markdown), not an LLM, so it's fast and deterministic, but it can be fooled. I'd like to hear about false positives and negatives.
>
> Disclosure: I built this with heavy help from an AI coding assistant, and I reviewed and tested the result. The scoring function has a small Node test run against weak, medium and strong sample READMEs.

---

## 2. r/SideProject

**Title:** I built a free README grader: paste your README, get a score out of 100 and a fix list (runs 100% in your browser)

**Body:**

> Most READMEs I open are missing the same few things: a one-line pitch, a copy-pasteable install command, or a working example. So I made a tiny tool that checks for those.
>
> **What it checks (12 things):** title, description, install, usage + code block, badges, license, contributing, screenshot/demo, heading structure, length, broken-looking links, TOC for long docs.
>
> **What it doesn't do:** upload anything, need an account, or use AI to score. It's plain heuristics in one HTML file and works offline.
>
> Try it: `<URL>/readme-grader/`
>
> Full disclosure: I built it with an AI coding assistant, and I also offer a paid AI-assisted, human-reviewed README rewrite ($29, linked at the bottom of the results). The grader is free and useful without it. Feedback on the scoring weights is very welcome.

---

## 3. dev.to

**Title:** 12 things your README is probably missing (and a free tool that checks them)

**Tags:** `#documentation #opensource #beginners #webdev`

**Body:**

> A README has about ten seconds to answer three questions: *what is this, how do I install it, and what does using it look like?* I turned that into 12 checks and packed them into a free, offline grader: `<URL>/readme-grader/`
>
> ## The checks
>
> 1. **One H1 title.** Exactly one `#` heading.
> 2. **An opening description.** 80+ characters directly under the title: what it does and who it's for.
> 3. **Install.** An `## Install` section *and* a real command (`npm install`, `pip install`, ...).
> 4. **Usage with a code block.** A fenced, language-tagged example of the smallest thing that works.
> 5. **Badges.** Build, version, license. These tell readers the project is maintained.
> 6. **License.** Named explicitly. Many companies can't touch unlicensed code.
> 7. **Contributing.** How to file bugs and run tests.
> 8. **Screenshot or demo.** A GIF or asciinema cast beats three paragraphs.
> 9. **Heading structure.** At least 4 `##` sections, with no jumps from `#` straight to `###`.
> 10. **Length.** Under 150 words is too thin. Over 2,500 words belongs in `docs/`.
> 11. **Links that look real.** No `(TODO)`, `#`, `localhost`, or `example.com`.
> 12. **A table of contents,** but only once the doc gets long.
>
> ## How it works
>
> It's one HTML file: a pure `gradeReadme(markdown)` function plus a textarea. Code fences are stripped before headings are detected, so `# comment` lines in a bash block don't count. There's a Node test that extracts the function from the HTML and checks that a weak, a medium and a strong README score in that order.
>
> ## Disclosure
>
> I built this with an AI coding assistant and reviewed and tested it myself. I also sell an AI-assisted, human-edited README rewrite ($29, linked from the results page), but the grader and this checklist are free to use without it.
