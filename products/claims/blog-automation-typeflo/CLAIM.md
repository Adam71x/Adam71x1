# CLAIM: Automate AI blog writing to Typeflo ($25 setup + a monthly fee)

- **Post:** https://www.reddit.com/r/slavelabour/comments/1wo18rf/task_automate_my_ai_blogwriting_process_25/
  - The same client also posted /1wo17ri/ and /1wo15zl/ ("Show me how to automate…"), both on r/slavelabour.
- **Posted:** 2026-09-23 09:33 UTC by u/YetiMaverick. It was about 30h old when found.
- **Budget:** $25 stated, which is **below the $50 floor**. The client also says "I'm fine paying a reasonable monthly fee" and asks for the expected running cost. I included it because the build is already done and it could turn into recurring revenue.
- **Fit:** very high. They want: once a month, 8 titles go in; an AI writes ~1,500-word articles with a featured image plus 2–3 more images; the posts publish on Typeflo at 2 a week. They want to stay on Typeflo.

## Already done (working, dry-run tested)
- `autoblog.py` is one Python file with no dependencies. It reads a titles file and, for each title:
  - generates the article with the OpenAI API. The client's own fixed ChatGPT prompt can be dropped in through `PROMPT_FILE`.
  - generates 1 hero image and 2 inline images, and hosts them on imgbb.
  - inserts the images between sections.
  - creates the post through the **Typeflo Admin API**: `POST https://<sub>.typeflo.io/api/headless/admin/posts` with a Bearer key. It uses the documented `scheduled` field (`DD/MM/YYYY HH:MM AM/PM`), so **one monthly run queues all 8 posts, Tuesdays and Fridays at 9 AM** (configurable).
  - `--dry-run` writes HTML previews and a run log with no API calls. I verified this locally: slots were computed correctly and images were placed correctly.
- `.github/workflows/monthly.yml` runs the script on the 1st of each month with no server (GitHub Actions free tier).
- `titles.example.txt` is a sample input.
- API facts come from typeflo.io/knowledge-base/headless-cms-admin-api-documentation, read on 2026-09-24. **Caveat:** that documentation has no field for a *featured image*, so the hero image is embedded at the top of the content. If the theme needs a true featured image, ask Typeflo support whether the API has a hidden field; otherwise it's one manual click per post.

## Estimated running cost (for the reply)
The only costs are the client's own API usage: 8 articles plus about 24 images a month on OpenAI. That's roughly **$3–$10 a month** depending on the model and image quality. GitHub Actions and imgbb are free, and Typeflo API access comes with their existing plan. Quillforge's optional maintenance would be a flat fee on top (suggested: $15 a month).

## Reply to send (Reddit comment or DM to u/YetiMaverick)

> Hi, this is Quillforge Studio (we build with AI tools, openly). We've already built this and tested it in dry-run mode, so you can see it working before you pay anything.
>
> How it works: you drop 8 titles into a text file once a month. A script writes each ~1,500-word article with your existing ChatGPT prompt, generates a featured image plus 2 inline images, and uses Typeflo's official Admin API to **schedule** the posts: 2 a week (Tue/Fri by default) in your workspace. It stays on Typeflo; no platform switch. It runs on free GitHub Actions on the 1st of each month, so there's no server to pay for.
>
> Recurring cost: just your OpenAI usage, roughly $3–10/month for 8 articles and ~24 images. You need a Typeflo Admin API key (Settings → Apps → custom app) and a free imgbb key for image hosting.
>
> One caveat: Typeflo's public API docs don't show a featured-image field, so the hero image goes at the top of the article body. If you need it in the theme's featured slot, we'll check with Typeflo support or it's one click per post.
>
> Price: $25 to set it up on your account, including a test post as a draft so you can approve the formatting. Optional $15/month if you want us to maintain it and fix anything if an API changes. Happy to do a screen-share walkthrough too.

## Payment and identity
- Off-platform, direct payment through PayPal or Wise in the owner's name. $25 is small enough to ask for payment after the client sees the first test post publish as a draft.
- **Never ask the client to send API keys over Reddit DM.** They should add them as GitHub Secrets in their own repo, or run the setup on a screen-share. The owner needs no platform KYC.

## Owner steps
1. Post the reply as a comment on 1wo18rf, or DM u/YetiMaverick.
2. On a yes: create a private GitHub repo for the client, or have them create it. Copy in `autoblog.py`, the `.github/workflows/monthly.yml` file and a `titles.txt`. Have the client add the 4 secrets.
3. First run: run with `AS_DRAFT=1` on a single test title so it lands as a draft. Once they approve, switch it back and run the month.
4. Invoice $25, and offer the $15/month maintenance.
