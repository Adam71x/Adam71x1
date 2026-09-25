# Rasmi (رسمي): product plan (locked)

**Status:** locked on 24 Sep 2026. The build order is in [milestones.md](milestones.md). The research behind this plan is in [saas-idea.md](saas-idea.md).

Rasmi is a subscription SaaS for Saudi freelancers, small studios and small marketing agencies. It covers pricing, marketing, offers, contracts, delivery, invoicing, payment recording, compliance and reports in one product. **Rasmi has no payment gateway between client and freelancer.** Clients pay outside Rasmi, and freelancers record those payments in Rasmi.

---

## 1. Product principles
- **Arabic-first, Saudi-native:** RTL, Hijri and Gregorian dates, SAR, 15% VAT, Saudi seasons.
- **Rasmi never touches money.** It records, tracks and reminds; clients pay the freelancer directly. This removes payment licensing and escrow questions and gateway fees.
- **One record, many uses.** Every price, offer, click, payment and expense is entered once and reused across the product (see §3).
- **Honest numbers.** The product never shows invented "market rates". Pricing advice comes from the freelancer's own costs and history, plus aggregated anonymous Rasmi data only once enough users exist.

## 2. Modules

### M1. Portfolio page (storefront)
- Public page at `name.rasmi.sa`, or a custom domain on paid tiers.
- Sections: bio, services with "starting from" prices (pulled from the Pricing Studio), case studies (images, video, PDF), testimonials, freelance-document badge, contact and inquiry form.
- Themes, colors, fonts (Arabic and Latin), section ordering, and a bilingual toggle.
- SEO settings and share previews (Open Graph). Every visit and inquiry is tagged with its source link (from M4).

### M2. Pricing Studio (new)
- **Rate calculator:** target monthly income + business costs (software, equipment, internet, workspace) + voluntary GOSI + VAT if registered + billable hours or utilisation → minimum hourly/day rate and a recommended rate with margin.
- **Service price builder:** for each service, set hours per deliverable, revisions, rush fee, licensing or usage rights, and add-ons. The result is a suggested **3-tier package** (Basic, Standard, Premium) sent directly to Offers (M3).
- **Project estimator:** list tasks with hours, plus a risk buffer and a discount floor. It warns when a price falls below the minimum rate.
- **Learning from own history:** win rate by price band, average discount given, and revenue per hour actually earned (from time tracking, invoices and payments). Example: "Offers above SAR X win 20% less often."
- **Benchmarks (later, opt-in):** anonymous, aggregated prices by service and city, shown only when a bucket has enough freelancers. The launch UI states clearly that this data is not available yet.
- **Price-update reminders:** yearly or quarterly prompts to raise rates, based on the user's own win rate and workload.

### M3. Offers and Offer Links (new, core)
**Building an offer**
- **Tiers:** 1–4 packages with a comparison table, a "recommended" badge, and per-tier deliverables, timeline, revisions and price.
- **Add-ons:** optional extras the client can tick, such as rush delivery, source files, extra revisions or usage rights. The total updates live, VAT included or excluded.
- **Clause library:** reusable Arabic and English clauses the freelancer can edit for each offer. Covers scope, revisions, IP transfer, payment terms, cancellation, confidentiality and delivery. Clauses can differ per tier.
- **Payment terms:** deposit %, milestone schedule, due dates, and accepted methods. Accepted methods are the freelancer's IBAN, an external payment link, STC Pay, or cash. All are display-only.
- **Visual customization:** theme, brand colors, logo, cover image or video, fonts, section order, portfolio samples, FAQ, and testimonials pulled from M1.
- **Commercial tools:** expiry date with countdown, discount or early-acceptance price, limited slots ("2 spots this month"), and a note on validity.
- **Templates:** save any offer as a template, duplicate it, or keep versions (v1, v2 after negotiation).

**Sending**
- Each offer gets a dedicated link such as `rasmi.sa/o/abc123`, with a private or password option and a QR code.
- Share by WhatsApp, email or social media, or as a PDF copy.
- Each channel can get its own tracked link (from M4).

**Client side (no account needed)**
- The client views the offer, picks a tier and add-ons, asks questions in a comment thread, or requests changes.
- The client **accepts with an e-signature**: typed name plus OTP by SMS or email. The acceptance is timestamped, and the exact version accepted is stored.

**Analytics**
- Opened (when and how many times), time spent, tier viewed or selected, forwarded, and expired.
- An alert for "the client opened your offer 3 times today", which is a good moment to follow up.

**On acceptance, automatically:**
- create the contract (M6);
- create the project (M7);
- create the invoice schedule from the payment terms (M8);
- mark the lead as won (M5);
- credit the revenue to the campaign or link that brought it (M4).

### M4. Marketing and Ad Planner (new)
- **Campaign planner:** goal (leads, bookings, brand), offer or service promoted, channels (Instagram, Snapchat, TikTok, X, LinkedIn, Google, WhatsApp broadcast, influencer), dates, and budget per channel. Spend is **entered by the user**; there is no ad-account API at MVP.
- **Content calendar:** posts per channel with a checklist and reminders. A pre-loaded Saudi season calendar covers Ramadan, the Eids, Founding Day (22 Feb), National Day (23 Sep), back-to-school and year-end, with suggested offer ideas for each.
- **Trackable links:** UTM-style short links for every campaign and channel that point to the portfolio or to an offer. They show clicks → inquiries → offers sent → offers accepted → revenue.
- **ROI dashboard:** spend compared with revenue from won offers, cost per lead, and cost per won client, by channel and campaign.
- **Budget suggestion:** a simple rule-based split from past ROI (more budget to channels that won clients). Clearly labeled as a suggestion from the user's own data.
- **Compliance note for influencer collaborations:**
  - Paid advertising by content creators in KSA requires the **Mawthooq license** from the General Authority for Media Regulation (formerly GCAM).
  - Arab News and a 2026 guide report it costs SAR 15,000 for 3 years (fee to be checked on gmedia.gov.sa).
  - The planner adds a "check the influencer's Mawthooq license number" field.

### M5. CRM and leads inbox
- All inquiries in one place: the portfolio form, offer comments, and manual entries (from WhatsApp or phone).
- Each lead is tagged with its source.
- Pipeline: new → contacted → offer sent → negotiating → won or lost, with a loss reason (price, timing, scope). Loss reasons feed the Pricing Studio.
- Client profiles: history, offers, projects, invoices, amount paid, and amount still owed.

### M6. Contracts
- The contract is generated from the accepted offer's clauses. It can also be created on its own from a template.
- E-signature by both sides, a downloadable PDF, and an audit trail.
- Change orders: extra scope becomes a mini-offer and link, which updates the contract and the invoice schedule once accepted.

### M7. Projects and client portal (communication)
- One portal link per project, no client account needed.
- **Chat:** threaded, with file sharing.
- **Deliverables:** versions, previews and **approve / request revision** buttons. A revision counter compares used revisions with the contracted number.
- **Timeline:** milestones, due dates and status.
- **Notifications:** email and WhatsApp (WhatsApp Business API).
- **Freelancer side:** task board, time tracking, and a "Revision limit reached → send change order" prompt.

### M8. Invoices and payment recording (changed: no gateway)
- Invoices are created from the offer's payment schedule or manually: deposit, milestone, retainer or one-off.
- Each invoice shows the **freelancer's own payment details**: IBAN, bank name, external payment link, or STC Pay number.
- **Recording a payment:**
  - The freelancer records the amount, date and method, and attaches proof (a transfer screenshot or receipt).
  - Partial payments are supported, and the balance updates automatically.
- **Client "I've paid" button:** the client uploads proof from the invoice link. The freelancer confirms or rejects it, and a receipt is sent automatically.
- **Reminders:** automatic before the due date, on the due date and when overdue, by email and WhatsApp. Tone templates range from friendly to firm.
- **Aging report:** amounts owed by client, grouped into 0–30, 31–60 and 60+ days overdue. A project can be put on hold until payment arrives, which also pauses the portal.
- **Retainers:** recurring invoices that are generated automatically.

### M9. Compliance
- **For everyone:** simplified invoices with sequential numbering, a reminder to renew the freelance document, and a voluntary-GOSI reminder.
- **Threshold tracker:** revenue measured from recorded payments.
  - Alert at **SAR 187,500:** optional VAT registration, and the ZATCA Wave 25 e-invoicing threshold for VAT-registered businesses.
  - Alert at **SAR 375,000:** VAT registration becomes mandatory.
- **For VAT-registered users: ZATCA Phase-2 (Fatoora) e-invoicing.**
  - Tax and simplified invoices with QR code and UBL XML, plus clearance or reporting.
  - Credit and debit notes.
  - Wave 25 deadline: **1 Feb 2027**.

### M10. Money and reports
- **Expenses:** amount, category, and receipt photo.
- **Tax:** VAT summary for users who are VAT-registered.
- **Profitability:** profit by client, service and project, and effective hourly rate (feeds M2).
- **Income statement PDF:** for 6 or 12 months, for banks or Social Development Bank financing requests.
- **Export:** CSV/Excel, and later direct export to Qoyod, Wafeq and Daftra.

### M11. Team, studio and agency
- Seats and roles: owner, manager, member, accountant (view-only).
- Assign projects and leads. Utilisation per member feeds the Pricing Studio's team rates.
- White-label: custom domain, and no Rasmi branding on the portfolio, offers, portal or invoices.
- Shared template, clause and asset libraries. Brand kits for several brands, for agencies.

### M12. Home dashboard and assistant
- The day's "next actions": offers opened but not answered, overdue invoices, revisions waiting, campaign posts due, and documents about to expire.
- Headline numbers: revenue this month, money owed, win rate, and best channel.

## 3. Why one SaaS: the connected loop
```
Pricing Studio ─► Offer (tiers/prices) ─► Offer Link (tracked by campaign) ─► Accept + e-sign
      ▲                                                                        │
      │                                    ┌───────────────────────────────────┘
      │                                    ▼
Win/loss + real hourly rate ◄── Contract ─► Project/Portal ─► Invoices ─► Recorded payments
      ▲                                                                        │
      └───────── Ad Planner ROI ◄── revenue by source ◄────────────────────────┤
                                            ZATCA threshold + reports ◄────────┘
```
- **Prices learn from results.** Won and lost offers and the hourly rate actually earned show whether prices are right. Separate tools can't do this because the data is split across them.
- **Marketing measured in SAR, not likes.** A click on a campaign link can be traced all the way to recorded payment.
- **No double entry.** Accepting an offer produces the contract, the project, the invoice schedule and the reminders.
- **Compliance comes free.** Recorded payments drive the VAT and e-invoicing threshold alerts and the income statement.
- **Replaces several tools with one subscription:** WhatsApp chaos, Canva quotes, Word contracts, spreadsheet invoices, Linktree and Behance, and ad-hoc accounting.

## 4. Subscription tiers
Prices are **hypotheses to test**, not market data. For reference, Wafeq starts at SAR 99/mo (annual), Qoyod Pro is SAR 207/mo, and Mostaql and Khamsat take 15–20% commission. Annual billing gets 2 months free.

| Feature | **Free** (SAR 0) | **Pro** (SAR 39/mo) | **Growth** (SAR 79/mo) | **Studio** (SAR 199/mo, 3 seats; +SAR 39/extra seat) |
|---|---|---|---|---|
| Portfolio page | 1, Rasmi subdomain, 2 themes, Rasmi branding | Custom domain, all themes | Same as Pro | Up to 3 brand pages, white-label |
| Pricing Studio | Rate calculator | + Service price builder, project estimator | + Win-rate analysis and price-update advice | + Team and blended rates, utilisation |
| Offers & Offer Links | 3 active offers, 1 tier, basic theme | Unlimited offers, up to 4 tiers, add-ons, clause library, full visual customization, expiry, templates | + Offer analytics (views, tier interest), versions, discounts and scarcity, password links | + Shared template and clause libraries, approval before sending |
| E-sign on acceptance | ✓ | ✓ | ✓ | ✓ |
| CRM / leads | 25 contacts | Unlimited, pipeline | + Loss reasons, source attribution | + Assign to team members |
| Contracts | — | From offers, e-sign | + Change orders | + Team templates |
| Client portal & chat | 1 active project | 5 active projects, 5 GB | Unlimited projects, 25 GB, WhatsApp notifications | Unlimited, 100 GB, per-client portals |
| Invoices & payment recording | 3 invoices/mo | Unlimited, proof upload, "I've paid" | + Automatic reminders, aging report, retainers | + Multi-brand invoices |
| ZATCA Phase-2 e-invoicing | — | Add-on SAR 30/mo | ✓ included | ✓ included |
| Threshold / doc / GOSI alerts | ✓ | ✓ | ✓ | ✓ |
| Ad Planner | — | Content calendar + Saudi seasons | + Campaigns, tracked links, ROI dashboard, budget suggestions | + Multi-client campaigns (agency) |
| Expenses & reports | — | Expenses, basic P&L | + Income statement PDF, profitability by client and service | + Per-member reports, accountant role |
| Time tracking | — | ✓ | ✓ | ✓ + utilisation |
| Support | Help center | Email | Priority chat | Priority + onboarding session |

**How people move up the tiers:**
- **Free → Pro:** unlimited offers, custom domain, contracts.
- **Pro → Growth:** reminders, analytics, and the ROI/ad planner that shows what actually earns money. ZATCA is included, which is the Wave 25 driver.
- **Growth → Studio:** team seats and white-label.

## 5. Build roadmap
1. **MVP (sells on its own):**
   - M1 portfolio;
   - M2 rate calculator and price builder;
   - M3 Offer Links with tiers, add-ons, clauses, themes and e-sign;
   - M8 invoices with payment recording;
   - M5 basic CRM;
   - Free and Pro tiers.
2. **V2:** M7 portal and chat, M6 contracts and change orders, M4 ad planner and tracked links, reminders, offer analytics, and the Growth tier.
3. **V3:** M9 ZATCA Phase-2 (before the 1 Feb 2027 deadline), M10 reports, M11 Studio, and Qoyod/Wafeq export.
4. **Later:** anonymous pricing benchmarks, and ad-account integrations (Meta, Snap, TikTok APIs).

**Tech outline:**
- Next.js (RTL) and PostgreSQL, hosted in a KSA region for PDPL.
- Object storage in KSA.
- WhatsApp Business API, SMS OTP for e-sign, and a ZATCA SDK.
- Multi-tenant model with role-based access and a full audit log.

## 6. Locked decisions
These are the recommended defaults. The review raised no changes, so they are now fixed and can be revisited at a milestone review.

| Decision | Locked choice |
|---|---|
| Tiers and prices | Free SAR 0 · Pro SAR 39/mo · Growth SAR 79/mo · Studio SAR 199/mo (3 seats, +SAR 39 for each extra seat). Annual billing gets 2 months free. These prices are hypotheses to test. |
| ZATCA in Pro | Paid add-on (SAR 30/mo); included in Growth and Studio |
| MVP order | Offer Links before the client portal and chat |
| E-signature | Typed name + OTP (SMS/email) with audit trail at MVP; Nafath signing to be explored later |
| Client payments | Outside Rasmi; recorded manually with proof; Rasmi never touches client money |
| Rasmi's own subscription billing | A Saudi gateway (e.g. Moyasar) for Rasmi's own revenue only |

## Sources for new facts
- GAMR Mawthooq licensing service: https://gmedia.gov.sa/en/services/licensing-for-providing-advertising-content-through-social-media-platforms-trusted
- Arab News, GCAM Mawthooq rules: https://www.arabnews.com/node/2176661/%7B%7B
- Miqwal, Mawthooq guide 2026 (SAR 15,000 / 3 years): https://miqwal.com/en/blog/saudi-mawthooq-influencer-certification
- All other sources: [saas-idea.md](saas-idea.md#sources)
