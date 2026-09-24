# A4: Payment Rails + Micro-offer

Window: 13:58:03 to ~13:59:30 UTC by the container clock (`date -u`). That clock looks compressed next to the work done, so treat it with caution.

## Metrics
| Metric | Value |
|---|---|
| Minutes spent (container clock) | ~2 (wall-clock effort is closer to 15 to 20) |
| Actions completed | 11 web searches, 2 fetch attempts (blocked by the egress proxy: help.gumroad.com, docs.stripe.com), 1 landing page, 1 report |
| Qualified buyer responses | 0 |
| Paid commitments | 0 |
| Verified money | $0 |

Nothing was created, published or spent. No accounts, no wallets, no keys.

## Part 1: Ways to get paid without the owner's cards

A card is not needed to *receive* money on any of these. What each one needs instead is identity (KYC) from the owner before a payout can happen. None of them can legitimately be set up by an agent on the owner's behalf.

| Rail | Needed before payout | Speed / fees | Source |
|---|---|---|---|
| **Gumroad** | Legal name, physical address (no PO box), phone, age 18+. **PayPal payout: no ID documents.** Bank payout goes through Stripe KYC: date of birth, government ID number (e.g. SSN), photo ID, possibly proof of address. | 10% + $0.50 per sale plus processing. Weekly Friday payouts after a 7-day hold. Minimum $10 (some sources now say $100 for unverified sellers). | [payout settings](https://help.gumroad.com/article/260-your-payout-settings-page), [getting paid](https://help.gumroad.com/article/13-getting-paid), [schedule](https://insightraider.com/en/answers/when-does-gumroad-pay-out) |
| **Lemon Squeezy** | Government photo ID plus personal details. The **store must be approved** after KYC/KYB review before any sale. | Review said to take 1 to 3 business days, often longer. 5% + 50¢. $50 payout minimum. | [verify identity](https://docs.lemonsqueezy.com/help/getting-started/verify-your-identity), [activate store](https://docs.lemonsqueezy.com/help/getting-started/activate-your-store), [getting paid](https://docs.lemonsqueezy.com/help/getting-started/getting-paid), [fees](https://docs.lemonsqueezy.com/help/getting-started/fees) |
| **Payhip** | Payhip holds no funds. The owner connects **PayPal** (personal or business) and/or **Stripe**, and KYC is whatever that processor requires. | Money goes straight to PayPal/Stripe. Free plan takes a 5% platform fee. | [how do I get paid](https://help.payhip.com/article/173-how-do-i-get-paid), [PayPal](https://help.payhip.com/article/64-connecting-your-paypal-account), [Stripe](https://help.payhip.com/article/65-connecting-your-stripe-account) |
| **Ko-fi** | Ko-fi never holds money. The owner links **PayPal or Stripe**, which do the KYC. | Paid instantly into the linked account. 5% fee on shop and commissions (Standard plan) plus processor fees. Has a native **Commissions** feature, which suits a $29 service. | [how do I get paid](https://help.ko-fi.com/hc/en-us/articles/115003980093-How-do-I-get-paid), [Stripe](https://help.ko-fi.com/hc/en-us/articles/360007522474-Connect-your-Stripe-account-and-start-earning), [fees](https://help.ko-fi.com/hc/en-us/articles/360002506494-Does-Ko-fi-take-a-fee) |
| **Buy Me a Coffee** | Stripe-only onboarding: identity verification plus bank details. Only in Stripe-supported countries. | First payout can take 7 to 14 days. | [supported countries](https://help.buymeacoffee.com/en/articles/6258038-supported-countries-for-payouts-on-buy-me-a-coffee), [Stripe Express payouts](https://help.buymeacoffee.com/en/articles/9770774-understanding-your-payouts-on-buy-me-a-coffee-through-stripe-express) |
| **GitHub Sponsors** | 2FA on GitHub, then a Stripe Connect account (legal name and DOB are hard to change later), a bank in the same country, and a tax form (W-9 / W-8BEN). Enrollment needs GitHub's approval. | Slow to start. Built for donations and sponsorships, not a fixed-price service. | [personal setup](https://docs.github.com/en/sponsors/receiving-sponsorships-through-github-sponsors/setting-up-github-sponsors-for-your-personal-account), [additional terms](https://docs.github.com/en/site-policy/github-terms/github-sponsors-additional-terms), [payout FAQ](https://github.com/orgs/community/discussions/153919) |
| **itch.io** | A **tax interview** is required before any payout request. Payouts go via PayPal or Payoneer ("collected by itch.io"), or directly to the owner's own PayPal/Stripe ("direct to you"). | Built for games and digital files, a poor fit for a service. Sellers report payout delays. | [seller/payout/tax update](https://itch.io/updates/updates-to-itchio-seller-accounts-payouts-tax-interview), [payments docs](https://itch.io/docs/creators/payments) |
| **Stripe Payment Links** | Account activation in live mode: legal name, DOB, address, SSN/EIN (or ITIN; photo ID in some cases), business type, product description, and a bank account in the owner's name. | Standard processing fees. First payout is typically delayed by several days. | [account setup](https://docs.stripe.com/get-started/account/set-up), [US account requirements](https://support.stripe.com/questions/requirements-for-having-a-us-stripe-account), [Payment Links](https://stripe.com/payments/payment-links) |
| **PayPal (direct: PayPal.me / invoice)** | An unverified account can receive about $500/month before funds are held (per a third-party guide, not PayPal itself). Lifting the limit takes name, DOB, address, SSN (last 4 or full) and a linked, confirmed bank account. | Funds reach the PayPal balance immediately. A PayPal invoice fits a $29 service with no platform in between. | [PayPal limits](https://www.paypal.com/us/brc/article/understanding-account-limitations), [receiving limits summary](https://wealthvieu.com/banking/paypal/receiving-limits/), [SSN](https://wise.com/us/blog/paypal-ssn) |
| **Self-custodial crypto (USDC address)** | No KYC to *receive*: the owner creates a wallet on their own device and holds the keys (e.g. Trust Wallet, Exodus). **Turning USDC into bank money goes through an exchange (e.g. Coinbase) that requires full KYC.** Income is still taxable. | Settles in minutes, but few documentation buyers pay in USDC. Irreversible, so mistakes can't be undone. | [non-custodial overview](https://aurpay.net/aurspace/accept-crypto-payments-without-kyc-non-custodial/), [off-ramp guide](https://eco.com/support/en/articles/15039727-how-to-off-ramp-crypto-2026-guide-for-usdc-usdt-eth) |

Caveat: two official help pages could not be fetched directly (egress proxy block). Those rows rely on search-result excerpts of the official pages, plus some third-party guides as cited.

### Conclusion: fastest legitimate route
**The owner's own existing PayPal account, used through a Ko-fi Commission (or a plain PayPal invoice).**
- Ko-fi and Payhip hold no funds and add no approval queue. Lemon Squeezy has a store review; GitHub Sponsors has enrollment. Money lands in PayPal on each sale, and there is no Gumroad-style 7-day hold.
- If the owner's PayPal is already verified (bank linked), the route works within minutes of setup. If it is not, payments work up to the unverified limit (about $500/month per the guide cited above), and then PayPal will ask for name, DOB, address, SSN and a bank link.
- Runner-up: Gumroad with PayPal payout (no ID documents), but weekly payouts after a 7-day hold.
- Crypto is fastest to *receive*, but it is unlikely to convert buyers, and cashing out still requires KYC.

**Owner's decision / actions (only the owner can do these):**
1. Choose a rail: recommended is Ko-fi + PayPal, or a PayPal invoice for one-off orders.
2. Create or sign in to that account personally, complete PayPal's identity and bank steps if prompted, and accept the platform terms.
3. Create a "$29 README rewrite" commission or product, copy its checkout URL, and replace the `TODO-OWNER` `href="#"` in `products/landing/index.html`. Also add a contact method and a refund/terms line.
4. Decide whether and where to publish the landing page.

## Part 2: Landing page
`/home/user/Adam71x1/products/landing/index.html`: one static file with no external assets.
- Mobile-friendly (16px gutter, responsive grid) with light/dark themes.
- AI-assistance disclosure box plus an FAQ entry.
- $29 flat, 24h delivery, 1 revision, refund if the deadline is missed.
- The payment button is disabled and marked `TODO-OWNER`; the footer contact is also `TODO-OWNER`.
- Before/after README sample for a fictional CLI, "tidewatch".
- No personal info, not published.
