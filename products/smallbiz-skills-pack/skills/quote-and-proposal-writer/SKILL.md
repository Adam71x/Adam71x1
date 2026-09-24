---
name: quote-and-proposal-writer
description: Turns a customer's inquiry (email, DM, voicemail notes, or a site-visit summary) into a clear priced quote or a one-page proposal with options, what is included and excluded, timeline, payment terms, and a friendly cover message. Built for service businesses and freelancers such as cleaners, trades, photographers, designers, VAs, coaches, and consultants. Use when the user asks to write a quote, estimate, proposal, bid, or price a job, or pastes a customer request and asks how to respond.
---

# Quote and Proposal Writer

Answer inquiries fast with a quote that looks professional, prices the job clearly, and prevents "I thought that was included" arguments later.

This skill writes drafts. It does not set your prices for you and it is not legal or tax advice. The owner checks every number before sending.

## Step 1: Gather inputs (ask only for what is missing)

1. The customer's request, pasted as-is.
2. The owner's pricing: hourly rate, day rate, per-item prices, package prices, or "here's what I charged last time". **Never make up prices.** If none are given, leave `[PRICE]` placeholders and say so.
3. Business name, owner name, and how the customer should accept (reply "yes", sign, pay a deposit link the owner has).
4. Deposit and payment terms (default suggestion: 50% deposit, balance on completion, due in 7 days; label it as a suggestion).
5. Tax: if the owner charges sales tax or VAT, ask for the rate. Otherwise write "Tax: [if applicable]".

## Step 2: Decide the format

- **Quick quote** (default for small jobs under about a day): a short message plus a line-item table.
- **Proposal** (bigger or multi-step jobs, or when the customer is comparing providers): one page with options.

## Step 3: Build the price

- List line items with quantity, unit, rate, and amount. Show the maths so the owner can check it.
- Offer **three options** when possible (good / better / best). The middle one should be the one the owner most wants to sell.
- Add a clear **Not included** list: this is the most important part for avoiding disputes.
- Add assumptions ("Price assumes access to water and power on site").
- Add a validity date (default: 14 days from today).

## Templates

**Quick quote message**
```
Hi [Customer first name],

Thanks for reaching out about [job in their words]. Here's your quote:

| Item | Qty | Rate | Amount |
|---|---|---|---|
| [Item] | [n] | [rate] | [amount] |
| **Total** | | | **[total]** |

Included: [list]
Not included: [list]
Timing: [when you can start / how long it takes]
To book: [reply "yes" / pay the [deposit]% deposit / sign]. This quote is valid until [date].

Any questions, just reply here.
[Owner], [Business]
```

**One-page proposal**
```
# Proposal for [Customer] - [Project name]
Prepared by [Business] | [Date] | Valid until [date]

## What you told us
[2-3 sentences restating their goal and pain point in their own words.]

## Our recommendation
[One paragraph: what we'll do and why.]

## Options
| | Essential | Recommended | Premium |
|---|---|---|---|
| [Feature] | yes | yes | yes |
| [Feature] | - | yes | yes |
| Price | [ ] | [ ] | [ ] |

## Not included
- ...

## Timeline
- [Milestone] - [date/week]

## Payment terms
[Deposit]% to book, balance [when]. Payment due within [n] days of invoice.

## Next step
[How to accept.]
```

## Step 4: Output

1. The quote or proposal, ready to paste.
2. A 2-line **cover message** for email or text.
3. **Check before sending**: a short list of the numbers and assumptions the owner must confirm.
4. Optionally, a polite **follow-up** message for 3 days later if there is no reply.

## Worked example

**Input:** "Hi, do you do end-of-tenancy cleans? 2-bed flat, 1 bathroom, oven's pretty bad. Need it done by the 30th." Owner (Bright Clean, Priya): "Standard 2-bed end-of-tenancy is 220. Oven deep clean is 60 extra. Carpets 25 per room. Deposit 30%."

**Output:**

```
Hi there,

Thanks for getting in touch about your end-of-tenancy clean. Here's your quote for a 2-bed, 1-bath flat:

| Item | Qty | Rate | Amount |
|---|---|---|---|
| End-of-tenancy clean, 2-bed/1-bath | 1 | 220 | 220 |
| Oven deep clean | 1 | 60 | 60 |
| **Total** | | | **280** |

Optional: carpet cleaning at 25 per room (2 bedrooms = 50).

Included: all rooms, kitchen inside cupboards, bathroom descale, windows inside, skirting boards.
Not included: carpets (unless added), outside windows, rubbish removal, wall repainting.
Timing: we can do it any weekday before the 30th; it takes about 5 hours.
To book: a 30% deposit (84) secures your date. This quote is valid for 14 days.

Priya, Bright Clean
```

Check before sending: confirm the "Included" list matches your checklist; confirm whether you add tax; confirm 30% of 280 = 84.

Follow-up (day 3): "Hi, just checking you got the quote for your end-of-tenancy clean. Dates before the 30th are filling up, so let me know if you'd like me to hold one."
