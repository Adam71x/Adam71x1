# Rasmi (رسمي): the operating system for the Saudi freelancer

> Working name. A subscription SaaS for Saudi freelancers, small studios and small marketing agencies. It covers the full money cycle, **portfolio → lead → proposal → contract → delivery → invoice → payment → tax and reports**, with Saudi compliance built in.

> **Status:** this is the original research brief. The **locked product scope** is in [product-plan.md](product-plan.md) and the build order is in [milestones.md](milestones.md). Main change: Rasmi has **no payment gateway**. Clients pay freelancers outside Rasmi, and freelancers record those payments in Rasmi.

Research date: **24 September 2026**. Every number below links to a source in the [Sources](#sources) section. Where data is missing or weak, this brief says so.

---

## 1. The problem

A Saudi knowledge freelancer (designer, developer, marketer, photographer, consultant) who works with **their own clients** today usually juggles:

- **WhatsApp and email** to talk with clients, with no project history, approvals or file versions.
- **Instagram, Behance or PDFs** as a portfolio, which shows no Saudi trust signals such as the freelance document.
- **Word or Canva** for quotes and contracts.
- **Bank transfers and payment links** with manual follow-up. Late payment is widespread in the region: about **58% of B2B credit sales are paid late** and about **10% of invoice value ends as bad debt** (Atradius 2025, UAE used as a GCC indicator [S6]). Average **DSO in the Middle East was 81.1 days in 2024** (PwC [S6]).
- **Compliance done by hand.** Freelancers must register for VAT above **SAR 375,000** a year and may register from **SAR 187,500** [S5]. On **24 July 2026** ZATCA announced **Wave 25** of e-invoicing Phase 2. It halves the integration threshold to **SAR 187,500** (revenue in any year 2022–2025), sets an integration deadline of **1 February 2027**, and carries fines of **SAR 5,000–50,000** [S4].

The alternatives each miss part of this:

- **Marketplaces** (Mostaql, Khamsat, Bahr) take **15–20% commission** [S10] and keep the client relationship.
- **Accounting SaaS** (Qoyod, Daftra, Wafeq) is priced and designed for SMEs, from **SAR 99–270/month** [S7–S9]. It has no portfolio, proposals, client portal or project chat.

## 2. Verified market data

| Fact | Figure | Source |
|---|---|---|
| People registered on the national freelance platform | **2.25M+** (by Sept 2024) | Future Work report via SPA / Arab News, 25 Dec 2024 [S1][S2] |
| Freelance contribution to GDP | **SAR 72.5B (~2% of GDP)**, 2023 | [S1] |
| Regional concentration | Riyadh 27%, Makkah 22%, Eastern Province 14% | [S1] |
| Education of freelancers | 62% bachelor's, 7% higher degree, 31% high school or less | [S1] |
| Women interested in freelancing | 3.2M | [S1] |
| Freelance documents issued / freelancers practising | ~2.358M issued; 1.674M+ practising (end H1 2023) | Saudipedia [S3] |
| Freelance document | Saudi nationals, 18+, active Absher; valid 1 year; no fee for issue or renewal (per Qoyod) | [S5] |
| VAT thresholds | Mandatory > SAR 375k; optional from SAR 187.5k; rate 15% | [S5] |
| ZATCA Wave 25 | Threshold SAR 187.5k; integrate by 1 Feb 2027 | [S4] |
| Regional late payment | 58% of credit sales late; ~10% bad debt; DSO 81.1 days | [S6] |
| Data protection | PDPL fully enforceable since 14 Sep 2024; restrictions on transferring personal data outside KSA | [S17] |

### Honest gaps
- **I found no official count of digital or creative freelancers**, the segment this product targets. The 2.25M registrations include ride-hailing, delivery, productive families, handicrafts and other programs [S3]. The sector split reported by Arab News (trade/retail 38%, industry 13%, business services 11%) [S1] is not clearly a headcount split, so **do not multiply it into a TAM**.
- Freelance-document fee information conflicts between secondary sources. Confirm the fee on freelance.sa.
- **Action:** size the real segment with 20–30 freelancer interviews plus a waitlist landing page before building beyond the MVP.

## 3. Competitive landscape

| Category | Players | What they do | Why they are not Rasmi |
|---|---|---|---|
| Marketplaces | **Mostaql, Khamsat** (Hsoub) | Arab freelance marketplaces. Mostaql charges 15% or 20% depending on membership; Khamsat charges sellers 20% plus a 5% buyer fee [S10] | Commission-based; the platform owns the client; no tool for off-platform clients |
| Marketplaces | **Bahr** | Government-backed marketplace, an HRDF initiative [S14] | Matching, not operations |
| Marketplaces | **Nafae** | Saudi escrow marketplace, 50+ categories [S13] | Matching, not operations |
| Accounting SaaS | **Qoyod** | SAR 207/mo Pro (VAT incl.) [S7] | SME accounting; no portfolio, proposals, portal |
| Accounting SaaS | **Daftra** | SAR 270/mo Advanced [S9] | Same |
| Accounting SaaS | **Wafeq** | From SAR 99/mo (annual) [S8] | Same |
| Freelancer client portal | **Delivvo** | UAE-registered; Arabic + English; branded portals, approvals, contracts, invoices; 0% payment fee; connects Tap, PayTabs, Stripe and others; prices in AED [S11] | **Closest competitor.** Its site does not mention ZATCA e-invoicing, freelance-document verification or mada-first onboarding |
| Open source | **Bilfora** | Arabic-first invoicing for Saudi freelancers; beta MVP [S12] | Invoicing only; not a commercial competitor |

**The gap:** in my research I found **no Saudi-built product** that combines all of these:

- portfolio page
- client communication
- proposals and contracts
- invoicing and payment tracking for payments made outside Rasmi
- ZATCA Phase-2 e-invoicing
- freelance-document and VAT compliance

This does not prove none exists. Re-check before launch, and watch Delivvo closely.

## 4. The product

### Module 1: Portfolio page (the storefront)
- Arabic-first (RTL) and bilingual page at `name.rasmi.sa` or a custom domain.
- A **"freelance document holder" badge**: the document number plus the uploaded certificate. Check whether HRSD or freelance.sa offers a verification service or API.
- A services menu with SAR prices and packages, case studies, testimonials and an inquiry/booking form that feeds the CRM.

### Module 2: Lead → proposal → contract
- An inquiry inbox and a light CRM pipeline.
- Arabic proposal templates by profession: design, development, marketing, photography, consulting.
- An e-signed contract with milestones, number of revisions, IP transfer and cancellation terms.

### Module 3: Client portal and communication
- One magic link per project; **the client never has to create an account**.
- Threaded chat, file delivery with versions, and **approve / request revision** buttons that keep an audit trail.
- Notifications by email and WhatsApp (WhatsApp Business API).

### Module 4: Get paid (payments happen outside Rasmi)
- Deposit, milestone and retainer invoices showing the freelancer's own payment details: IBAN, their own payment link, or STC Pay.
- Clients pay **outside Rasmi**, for example by bank transfer or through the freelancer's own gateway such as Moyasar or Tap [S15][S16]. The freelancer records each payment with proof. The client can press "I've paid" and upload a receipt.
- Automatic reminders and late-payment escalation.
- **Rasmi never touches client money**, so there is no escrow and no payment licensing.

### Module 5: Compliance autopilot
- Simplified invoices for everyone.
- For VAT-registered users: **ZATCA Phase-2 (Fatoora) e-invoicing** with QR code, UBL XML, and clearance or reporting.
- A threshold tracker that warns at **SAR 187,500** (optional VAT and the Wave 25 e-invoicing threshold) and **SAR 375,000** (mandatory VAT) [S4][S5].
- Reminders for freelance-document renewal and voluntary GOSI contributions.

### Module 6: Money and reports
- Income and expense ledger, VAT summary, and profit per client and project.
- An **income statement PDF** a freelancer can show a bank or the Social Development Bank. The freelance document is linked to SDB's financing product [S5].
- Export to Qoyod, Wafeq and Daftra, so the product works with accountants instead of replacing them.

### Module 7: Studios and small agencies
- Team seats and roles, per-client portals and white-labelling.
- Retainer (recurring) billing, time tracking, and team utilisation.

### Built for Saudi from day one
- Hijri and Gregorian dates, SAR, 15% VAT, and Arabic numerals as an option.
- Nafath or Absher-style identity for trust, if feasible.
- **Data hosted in a KSA cloud region** to meet PDPL requirements on transfers outside the Kingdom [S17].

## 5. Business model

Subscription only; Rasmi takes **no cut of client payments**. That contrasts with the 15–20% marketplace commission [S10] and sits below the cheapest SME accounting plan (Wafeq, SAR 99/mo annual [S8]).

Locked tiers: **Free (SAR 0) · Pro (SAR 39/mo) · Growth (SAR 79/mo) · Studio (SAR 199/mo, 3 seats)**. The full feature matrix is in [product-plan.md](product-plan.md#4-subscription-tiers).

These prices are hypotheses to test with the waitlist; they are not researched benchmarks.

## 6. Go-to-market

1. **Wave 25 urgency campaign** (Oct 2026 – Jan 2027): "Freelancers and studios above SAR 187.5k must integrate e-invoicing by 1 Feb 2027" [S4].
2. **Start in Riyadh, then Makkah and the Eastern Province**, which together account for 63% of freelancers [S1].
3. Partner with freelancer communities, university career centres and incubators. Offer accountants a referral program, since the product exports to their tools.
4. A free portfolio page is the viral loop: every page and invoice carries a "Made with Rasmi" link.

## 7. Risks

- **Delivvo adds ZATCA and Saudi features.** Mitigation: move first on ZATCA and freelance-document features, go deep on the Saudi market, and build partnerships.
- **Accounting players add freelancer workflows.** Mitigation: they serve SMEs; stay focused on the client-facing workflow.
- **Target segment size is unverified.** Mitigation: interviews and a waitlist before a full build.
- **Freelance documents are Saudi-only** [S5]. The core market is Saudi nationals plus studios and agencies with a CR.
- **Regulatory exposure** (payments, PDPL, ZATCA solution requirements). Mitigation: never hold funds, host in KSA, and follow ZATCA technical guidelines.

## 8. Validation plan (before the full build)

1. Landing page in Arabic plus a waitlist. Target 300 sign-ups from knowledge freelancers.
2. 20–30 interviews to confirm the top pains: late payment, client chaos, ZATCA, portfolio.
3. Concierge MVP: portfolio page + Offer Link + invoice with payment recording, with 10 paying users.
4. Then add the client portal, contracts and ZATCA Phase-2.

## 9. Suggested MVP stack (follow-up)

- Next.js (RTL-ready) + PostgreSQL, hosted in a KSA region.
- WhatsApp Business API; a gateway (e.g. Moyasar) **only for Rasmi's own subscription billing**, never for client payments.
- A ZATCA Phase-2 SDK and implementation of ZATCA's technical guidelines.
- File storage in KSA; audit log for approvals and contracts.

---

## Sources

- [S1] Arab News, "2.25m freelancers in Saudi Arabia join national economy" (25 Dec 2024), citing the Future Work report via SPA: https://www.arabnews.com/node/2584265/business-economy
- [S2] Saudi Press Agency, "Freelancing on the Rise in Saudi Arabia: Over Two Million Registered by September 2024": https://spa.gov.sa/en/N2232537
- [S3] Saudipedia, "Freelancing in the Kingdom": https://saudipedia.com/en/freelancing-in-the-kingdom
- [S4] VATupdate, "ZATCA Announces Wave 25 of E-Invoicing: Threshold Halved to SAR 187,500, Integration Deadline 1 February 2027" (27 Jul 2026): https://www.vatupdate.com/2026/07/27/zatca-announces-wave-25-of-e-invoicing-threshold-halved-to-sar-187500-integration-deadline-1-february-2027/
- [S5] Qoyod, "Freelance Work Document in Saudi Arabia: Conditions and Renewal": https://www.qoyod.com/en/blog/labor-market/what-is-a-freelance-work-document-sa/
- [S6] Qoyod, "Payment Collection in Saudi Arabia: The Gap" (cites Atradius 2025 and the PwC ME Working Capital Study 2025): https://www.qoyod.com/en/reports/payment-collection-saudi/
- [S7] Qoyod Help Center, plans and pricing: https://www.qoyod.com/en/knowledge-base/qoyod-plans-and-pricing-subscription-tiers-features-add-ons/
- [S8] Wafeq, best accounting software in Saudi Arabia / pricing: https://www.wafeq.com/en-sa/e-invoicing-in-saudi-arabia/preparing-for-e-invoicing/best-accounting-software-in-saudi-arabia
- [S9] Daftra, best accounting software Saudi 2026: https://www.daftra.com/en/hub/best-accounting-software-saudi
- [S10] Arbe7na, freelance platform fees source log (verified 17 Aug 2026): https://www.arbe7na.com/blog/freelance-platform-fees-source-log/
- [S11] Delivvo: https://delivvo.io/
- [S12] Bilfora (GitHub): https://github.com/samuadda/Bilfora
- [S13] Nafae: https://nafae.app/
- [S14] Bahr: https://bahr.sa/
- [S15] Moyasar, startups and freelancers: https://moyasar.com/en/solutions/startups-and-freelancers/
- [S16] Raghdan, "Payment Gateways in Saudi Arabia Guide 2025": https://raghdan.sa/en/news/payment-gateways-in-saudi-arabia-guide-2025-requirements-fees-registration-steps-and-comprehensive-comparison/
- [S17] Morgan Lewis, "Saudi Arabia Personal Data Protection Law: Transition Period Ends September 14" (2024): https://www.morganlewis.com/pubs/2024/09/saudi-arabia-personal-data-protection-law-transition-period-ends-september-14
