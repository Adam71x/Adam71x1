---
name: weekly-money-summary
description: Reads a bank, card, Stripe, Square, PayPal, or spreadsheet transaction export (CSV or pasted rows) and produces a plain-English weekly or monthly money summary for a small business - money in, money out, net, spending by category, biggest items, unusual or duplicate charges, transactions that need a receipt or a category, and 3 suggested actions. No accounting software or connectors needed. Use when the user uploads or pastes transactions and asks "how did we do this week", wants a bookkeeping summary, cash check-in, expense breakdown, or help categorizing transactions.
---

# Weekly Money Summary

Give a busy owner a 2-minute read on where the money went, and a short list of things to fix before they turn into a messy tax season.

This is a bookkeeping helper, not accounting or tax advice. It never moves money, and it points out anything uncertain instead of guessing.

## Step 1: Load the data

- Accept a CSV/XLSX upload or pasted rows. If code execution is available, load the file with code and do all arithmetic in code. Never add up long lists by eye.
- Find the date, description, and amount columns. Some exports use separate Debit and Credit columns: convert them to one signed amount (money in positive, money out negative). If you are unsure which columns mean what, show the first 3 rows and ask.
- Confirm the period covered (first and last date) and the currency.
- Remove exact duplicate rows only after listing them.

## Step 2: Separate what is not income or spending

Exclude these from income and expense totals, but list them in their own section:
- Transfers between the owner's own accounts (for example "TRANSFER TO SAVINGS").
- Credit card payments from the bank account (to avoid counting spending twice).
- Owner draws, loans, and loan repayments (ask if unsure).

## Step 3: Categorize

Use the owner's own categories if they give them. Otherwise use this default list (common small-business bookkeeping groupings):

Income: Sales, Client payments, Other income.
Expenses: Rent/Utilities, Software/Subscriptions, Advertising/Marketing, Supplies/Materials, Vehicle/Fuel, Travel, Meals, Contractors, Bank/Payment fees, Insurance, Taxes/Licenses, Cash withdrawals, **Needs review**.

Rules:
- Put a transaction in **Needs review** whenever the description is unclear, could be personal, or is cash. Do not guess.
- Keep a "rule" note for recurring merchants (for example "ADOBE -> Software") so the owner can reuse it next week.

## Step 4: Check for problems

Flag:
- Possible duplicates (same amount and merchant within 3 days).
- New recurring charges or subscription price changes (if more than one period is present).
- Unusually large items (more than 3 times the median expense, or the owner's threshold).
- Items that normally need a receipt kept (for example meals, travel, equipment, cash).

## Step 5: Output format

```
# Money Summary: [start date] to [end date]

## The headline
[One sentence: e.g. "You brought in $X, spent $Y, and kept $Z."]

| | Amount |
|---|---|
| Money in | ... |
| Money out | ... |
| Net | ... |
| Moved between accounts (not counted) | ... |

## Where money came from
| Category | Amount | % |

## Where money went
| Category | Amount | % |

## Biggest 5 expenses
## Needs your attention
- [ ] [Item]: [why] -> [what to do]

## 3 suggested actions
1. ...

## Category rules to reuse
- MERCHANT -> Category
```

Always show your totals so the owner can check them against the bank balance. If more than 10% of spending is in Needs review, say so in the headline.

## Worked example

**Input:** `examples/sample-bank-export.csv` (14 rows, 14-20 Sep 2026, a freelance designer's business account).

**Output:**

```
# Money Summary: 14 Sep to 20 Sep 2026

## The headline
You brought in $4,068.60, spent $1,477.96, and kept $2,590.64. $118.40 (8%) of spending needs a quick review.

| | Amount |
|---|---|
| Money in | $4,068.60 |
| Money out | $1,477.96 |
| Net | $2,590.64 |
| Moved to savings (not counted) | $500.00 |

## Where money came from
| Category | Amount | % |
|---|---|---|
| Sales (Stripe, Square payouts) | $2,266.50 | 55.7% |
| Client payments (Harbor Dental INV 1042) | $1,800.00 | 44.2% |
| Other income (Stripe fee refund) | $2.10 | 0.1% |

## Where money went
| Category | Amount | % |
|---|---|---|
| Rent/Utilities | $950.00 | 64.3% |
| Supplies/Materials (Costco) | $212.37 | 14.4% |
| Needs review (ATM cash, SQ *KAFE LUNA) | $118.40 | 8.0% |
| Advertising (Meta Ads) | $75.00 | 5.1% |
| Software (Adobe, Google Workspace) | $73.99 | 5.0% |
| Vehicle/Fuel (Shell) | $48.20 | 3.3% |

## Needs your attention
- [ ] ATM withdrawal $100.00: what was the cash for? Keep a receipt or note.
- [ ] SQ *KAFE LUNA $18.40: business meal or personal?
- [ ] Costco $212.37: confirm it was all business supplies; split out anything personal.

## 3 suggested actions
1. Mark invoice 1042 (Harbor Dental, $1,800) as paid in your invoicing tool.
2. Snap receipts for Costco and the cash withdrawal today.
3. Software costs are $73.99 this week; check your annual subscriptions once a quarter.

## Category rules to reuse
- STRIPE PAYOUT, SQUARE PAYOUT -> Sales
- ADOBE, GOOGLE WORKSPACE -> Software
- META ADS -> Advertising
- STUDIO RENT -> Rent/Utilities
- TRANSFER TO SAVINGS -> Transfer (not counted)
```

Note: payout amounts from Stripe or Square are usually after fees. If the owner wants gross sales and fees shown separately, ask for the processor's own payout report.
