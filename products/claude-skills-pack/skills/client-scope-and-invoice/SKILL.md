---
name: client-scope-and-invoice
description: Drafts freelance client paperwork from bundled templates, including a scope of work (SOW) with deliverables, exclusions, milestones and acceptance criteria, an itemized invoice, and a change request for scope creep. Use when a freelance developer asks to write a proposal, scope doc, statement of work, estimate, quote, invoice, or change order, or to turn a client's messy request or email into a defined project.
---

# Client Scope and Invoice Drafter

Turn a vague client request into clear, professional paperwork. This skill produces **drafts from templates**. It is not legal, tax, or accounting advice, and every document ends with a reminder for the user to review it before sending.

## Templates (in `templates/`)

| File | Use for |
|---|---|
| `scope-of-work.md` | Proposal / SOW before work starts |
| `invoice.md` | Billing for a milestone, a period of hours, or a fixed fee |
| `change-request.md` | Pricing new asks that fall outside the agreed scope |

Read the relevant template first, then fill it in. Keep its section order.

## Workflow: scope of work

1. **Collect inputs.** From the user's message, pasted client email, or brief. The minimum you need: client name, project goal, rough deliverables, deadline, and pricing model (fixed, hourly, or retainer). If pricing numbers are missing, ask. **Never invent rates, totals, or dates.**
2. **Turn wishes into deliverables.** Each deliverable must be concrete and checkable: "Responsive landing page with 5 sections, built in Next.js, deployed to the client's Vercel account" and not "a nice website".
3. **Write exclusions explicitly.** List at least 4 plausible things the client may assume are included (copywriting, stock photos, hosting fees, SEO, ongoing maintenance, more than N revision rounds, browser support below X, data migration). Exclusions prevent most scope disputes.
4. **Milestones and payment.** Tie payments to milestones. A common freelance default is 30-50% upfront; suggest it but let the user decide.
5. **Acceptance criteria.** How the client signs off on each deliverable, and a review window (e.g. 5 business days, after which it is deemed accepted). Mark it as a suggestion.
6. **Assumptions and dependencies.** What the client must provide and by when (content, access, brand assets), and what happens to the timeline if they are late.
7. **Flag risks** to the user separately (not in the document): unclear requirements, unrealistic deadline, fixed price on an unknown codebase.

If the repo is available and the work is on an existing codebase, you may inspect it to size the work, and list technical assumptions (framework versions, hosting) in the SOW.

## Workflow: invoice

1. Gather: invoice number, issue date, due date / terms (Net 7/14/30), client billing details, line items (description, quantity or hours, rate), currency, tax rate if the user gives one, and payment instructions.
2. For hourly work, you can derive line items from the user's time log or from git history (`git log --since=... --author=... --format='%as %s'`) grouped by day or feature, **but the hours must come from the user**. Commits do not equal hours.
3. Compute subtotal, tax, and total with explicit arithmetic. Double-check every multiplication and the sum; show the math to the user in your reply (not in the invoice).
4. Never fill in bank details, tax IDs, or addresses you were not given. Leave `[PLACEHOLDER]` markers.

## Workflow: change request

Use when the client asks for something not listed in the SOW deliverables (or listed in exclusions). Quote the original scope line, describe the new ask, give the impact on cost and timeline, and require written approval before work starts. Keep the tone friendly and non-defensive.

## Output

- Produce the filled document in Markdown (save to a file such as `docs/client/SOW-<client>-<date>.md` only if the user asks).
- If the user wants PDF, suggest `pandoc SOW.md -o SOW.pdf` or printing from a Markdown preview.
- End your reply with: "Draft only: please review terms, amounts, and legal/tax requirements for your jurisdiction before sending."
- Tone: plain English, short sentences, no legalese beyond what the template contains.
