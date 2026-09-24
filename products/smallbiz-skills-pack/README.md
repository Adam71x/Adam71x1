# Small Business Skills Pack for Claude

Five ready-to-use Claude skills for freelancers and small-business owners. No coding, no connectors, no extra software. Paste an email, a review, or a bank export, and Claude does the paperwork.

| Skill | What it does | You give it |
|---|---|---|
| `quote-and-proposal-writer` | Priced quote or one-page proposal with options, "not included" list, payment terms, cover note, follow-up | The customer's inquiry + your prices |
| `client-welcome-sequence` | 5-email new-client onboarding sequence + one-page "Working with me" guide | Client name, start date, what you need from them |
| `review-reply-writer` | Public replies to Google/Yelp/Etsy/Facebook reviews, from 5-star thanks to calm 1-star replies, + private follow-up | The review text |
| `weekly-money-summary` | Plain-English money in/out/net, spending by category, flagged items, 3 actions | A CSV export from your bank, Stripe, Square or PayPal |
| `sop-writer` | Turns "here's how I do it" into a step-by-step SOP and checklist a new hire or VA can follow | A voice-note transcript or rough notes |

Every skill includes step-by-step instructions for Claude, copy-ready templates, and a full worked example.

## Install

### Claude app (claude.ai desktop or web, including Cowork)
1. Make sure Skills are turned on: **Settings > Capabilities** (the exact menu names can change; see Anthropic's help pages for "Skills").
2. Zip one skill folder at a time (for example the `review-reply-writer` folder, with `SKILL.md` inside it).
3. Upload the zip under **Settings > Capabilities > Skills** (or wherever your plan shows "Upload skill").
4. Start a new chat and just ask: "Help me reply to this review: ..." Claude picks the right skill automatically.

Tip: `weekly-money-summary` works best with code execution / file creation turned on, so Claude does the maths in code.

### Claude Code
Copy the folders into your skills directory:
```
cp -r skills/* ~/.claude/skills/
```

## Privacy
The skills tell Claude never to put passwords, card numbers, or account numbers into documents. Remove anything you would not want in a chat before you paste it.

## Not professional advice
Templates and summaries are drafts. Check prices, numbers, and wording before you send anything. Nothing here is legal, tax, or accounting advice.

## License
See `LICENSE.md`. Use for your own business and your clients' work; do not resell.
