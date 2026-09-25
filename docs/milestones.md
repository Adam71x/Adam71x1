# Rasmi: build milestones

This file breaks the [locked product plan](product-plan.md) into small milestones that can each be built, reviewed and shipped on their own. **Module** references (M1–M12) point to [product-plan.md §2](product-plan.md#2-modules). Milestones are numbered **MS-xx** to keep them distinct from modules.

**Status:** MS-01 and MS-02 are built (see below). Hosting is deferred by decision ([0002](decisions/0002-hosting-deferred.md)); everything runs locally. Each milestone is reviewed before the next one starts.

## Overview

| Phase | Milestone | Delivers | Depends on |
|---|---|---|---|
| **0: Foundation** | MS-01 | Project skeleton, CI, hosting decision | — |
| | MS-02 | Accounts, workspaces, Arabic/English RTL shell | MS-01 |
| **1: MVP** | MS-03 | Portfolio page (M1) | MS-02 |
| | MS-04 | Pricing Studio: rate calculator (M2) | MS-02 |
| | MS-05 | Pricing Studio: service price builder → 3-tier packages (M2) | MS-04 |
| | MS-06 | Offer builder: tiers, add-ons, VAT totals (M3) | MS-05 |
| | MS-07 | Offer customization: clauses, payment terms, themes, expiry, templates (M3) | MS-06 |
| | MS-08 | Offer Links: client view, questions, accept + e-sign (M3) | MS-07 |
| | MS-09 | CRM basics: leads inbox, pipeline, client profiles (M5) | MS-03, MS-08 |
| | MS-10 | Invoices + external payment recording (M8) | MS-08 |
| | MS-11 | Subscriptions: Free/Pro plans, limits, Rasmi billing | MS-10 |
| | MS-12 | MVP hardening + beta launch | MS-03 … MS-11 |
| **2: V2 (Growth tier)** | MS-13 | Contracts from offers + change orders (M6) | MS-12 |
| | MS-14 | Projects + client portal + chat + approvals (M7) | MS-13 |
| | MS-15 | Reminders (email/WhatsApp), aging report, retainers (M8) | MS-12 |
| | MS-16 | Offer analytics, versions, discounts, password links (M3) | MS-12 |
| | MS-17 | Ad Planner: content calendar + Saudi seasons (M4) | MS-12 |
| | MS-18 | Campaigns, tracked links, ROI dashboard (M4) | MS-16, MS-17 |
| | MS-19 | Pricing Studio: project estimator + win-rate learning (M2) | MS-09, MS-16 |
| | MS-20 | Growth tier launch | MS-13 … MS-19 |
| **3: V3 (Studio tier)** | MS-21 | Compliance alerts: thresholds, document renewal, GOSI (M9) | MS-10 |
| | MS-22 | ZATCA Phase-2 e-invoicing (M9) | MS-21 |
| | MS-23 | Expenses + reports + income statement PDF (M10) | MS-10 |
| | MS-24 | Team seats, roles, white-label, multiple brands (M11) | MS-20 |
| | MS-25 | Home dashboard "next actions" (M12) + exports (CSV, Qoyod/Wafeq/Daftra) | MS-23 |
| | MS-26 | Studio tier launch | MS-21 … MS-25 |

> ⚠️ **Timing risk:** the ZATCA Wave 25 integration deadline is **1 Feb 2027**, about 4 months from the plan date. Two options:
> 1. Pull MS-21 and MS-22 forward to follow MS-12.
> 2. Keep the order and drop the "Wave 25" launch campaign.
>
> Decide at the MS-12 review.

---

## Phase 0: Foundation

### MS-01: Project skeleton and CI · ✅ done
- **Scope:**
  - Next.js + TypeScript monorepo, PostgreSQL + ORM migrations, linting, formatting, unit test runner, and CI on every PR.
  - Environment config and error tracking.
  - A decision record for hosting in a **KSA cloud region** (PDPL) and for object storage.
- **Done when:** CI is green on an empty app; one command starts the app locally; the hosting decision is documented.
- **Delivered:** Next.js 16 + TypeScript, Drizzle + PostgreSQL with committed migrations, embedded PGlite for local and tests, ESLint/Prettier/tsc/Vitest/Playwright, GitHub Actions CI, validated env config, `reportError()` + `onRequestError` hook. Hosting deferred ([0002](decisions/0002-hosting-deferred.md)); stack in [0001](decisions/0001-stack.md).

### MS-02: Accounts, workspaces, bilingual shell · ✅ done
- **Scope:**
  - Sign-up and login by email OTP.
  - Workspace (tenant) model with an owner role.
  - Arabic/English i18n with full RTL, and Hijri and Gregorian dates.
  - SAR currency formatting, a basic design system (colors, type, components) and the settings page.
- **Done when:** a user can sign up, create a workspace, and switch language (the layout flips to RTL correctly); tenant isolation is covered by tests.
- **Delivered:** email-code sign-in with rate limits, database sessions, onboarding (workspace name + page address), app shell (sidebar + mobile bottom bar), home, settings (profile, language, workspace), Arabic/English with RTL/LTR, SAR + Gregorian/Hijri formatting. 43 unit/integration tests and 8 end-to-end scenarios on desktop and mobile.

## Phase 1: MVP

### MS-03: Portfolio page (M1)
- **Scope:**
  - Public page at `name.rasmi.sa`: bio, services with "starting from" prices, case studies (images, PDF), testimonials, and a freelance-document badge (number + uploaded certificate).
  - Inquiry form, 2 themes, bilingual toggle, SEO metadata and Open Graph share previews.
- **Done when:** a published page loads fast on mobile, the inquiry form creates a lead record, and an unpublished page returns 404.

### MS-04: Pricing Studio, rate calculator (M2)
- **Scope:** inputs are target monthly income, business costs, voluntary GOSI, VAT status, billable hours and utilisation. Outputs are a minimum hourly/day rate and a recommended rate with margin. Calculations are saved per workspace.
- **Done when:** calculations are unit-tested against worked examples, and the UI explains every number. There are no "market rate" claims.

### MS-05: Pricing Studio, service price builder (M2)
- **Scope:** for each service, set hours per deliverable, revisions, rush fee, usage rights and add-ons. The builder suggests Basic, Standard and Premium packages from the rate, and warns when a price is below the minimum.
- **Done when:** a service with 3 suggested tiers can be saved and appears on the portfolio as a "starting from" price.

### MS-06: Offer builder core (M3)
- **Scope:**
  - Create an offer for a client: 1–4 tiers (imported from the price builder or entered manually), a comparison table and a "recommended" badge.
  - Optional add-ons, with live totals that include or exclude 15% VAT.
- **Done when:** totals are correct for every tier and add-on combination (unit-tested), and draft offers can be saved and edited.

### MS-07: Offer customization (M3)
- **Scope:**
  - A clause library in Arabic and English (scope, revisions, IP, payment, cancellation, confidentiality), with clauses that can differ per tier.
  - Payment terms: deposit % and a milestone schedule, plus the freelancer's payment details (display only).
  - Visual customization: theme, colors, logo, cover media, section order, FAQ, portfolio samples.
  - An expiry date, and save as template / duplicate.
- **Done when:** an offer can be fully styled and saved as a template, and the preview matches what the client will see.

### MS-08: Offer Links and acceptance (M3)
- **Scope:**
  - A dedicated link `rasmi.sa/o/<id>` with a QR code, share buttons (WhatsApp and email) and a PDF copy.
  - Client view with no account: choose a tier and add-ons, ask a question or request changes, then accept with typed name + OTP e-signature.
  - The accepted version is frozen, with a timestamp and an audit record. Expired offers block acceptance.
  - Notifications to the freelancer.
- **Done when:** a client can complete the full flow on mobile in Arabic, the accepted offer cannot be changed afterwards, and the audit trail is stored.

### MS-09: CRM basics (M5)
- **Scope:** a leads inbox (portfolio form, offer questions, manual entry) with a source tag. Pipeline stages: new → contacted → offer sent → negotiating → won/lost, with a loss reason. Client profiles show offers and invoices.
- **Done when:** sending an offer moves the lead to "offer sent" and accepting it marks the lead "won" automatically.

### MS-10: Invoices and payment recording (M8)
- **Scope:**
  - Invoices are generated from an accepted offer's payment schedule, or created manually. Sequential numbering and simplified invoice format.
  - The freelancer's payment details (IBAN, their own link, STC Pay) are shown on the invoice.
  - **Record a payment:** amount, date, method and proof upload. Partial payments update the balance.
  - The client's "I've paid" button with a receipt upload, which the freelancer confirms or rejects. An automatic receipt follows.
- **Done when:** the full cycle works end to end: accepted offer → deposit invoice → client marks paid → freelancer confirms → balance updates. **No payment processing exists in the code.**

### MS-11: Subscriptions and plan limits
- **Scope:**
  - Free and Pro plans, with limits enforced per the tier matrix (for example, 3 active offers on Free).
  - Upgrade and downgrade flows.
  - Rasmi's **own** subscription billing through a Saudi gateway, used only for Rasmi's revenue.
- **Done when:** limits are enforced on the server, an upgrade unlocks features immediately, and a failed renewal falls back to Free without losing data.

### MS-12: MVP hardening and beta launch
- **Scope:**
  - PDPL basics: privacy policy, consent, and data export and delete.
  - Security review, backups, rate limiting and monitoring.
  - An Arabic landing page with a waitlist; onboard 10 concierge beta users.
- **Done when:** 10 real freelancers have sent at least one Offer Link and recorded at least one payment. Feedback is logged, and the Phase 2 order is re-confirmed along with the timing of the ZATCA milestones.

## Phase 2: V2 (Growth tier)

### MS-13: Contracts and change orders (M6)
- **Scope:** a contract is generated from the accepted offer's clauses, with templates for standalone contracts. Both sides sign by e-sign, with a PDF. Change orders are mini Offer Links that update the contract and the invoice schedule.
- **Done when:** a change order acceptance adds new invoice lines automatically.

### MS-14: Projects, client portal and chat (M7)
- **Scope:**
  - A project is created on acceptance, with a portal link (no client account).
  - Threaded chat, file deliverables with versions and previews, and approve / request-revision buttons.
  - A revision counter compared with the contract, milestones and a task board.
- **Done when:** a revision request beyond the contracted limit prompts a change order.

### MS-15: Reminders, aging report and retainers (M8)
- **Scope:** reminders before the due date, on it and when overdue, by email and WhatsApp Business API, with tone templates. An aging report (0–30 / 31–60 / 60+ days). Recurring retainer invoices. An "on hold until paid" option for projects.
- **Done when:** reminders stop automatically once a payment is recorded.

### MS-16: Offer analytics and advanced offers (M3)
- **Scope:** open, view-time and tier-interest tracking, and alerts such as "opened 3 times today". Offer versions (v1, v2), discounts and early-acceptance prices, limited-slots notes, and password-protected links.
- **Done when:** the freelancer sees a per-offer timeline of client activity.

### MS-17: Ad Planner, calendar and seasons (M4)
- **Scope:** a content calendar per channel with reminders. A pre-loaded Saudi season calendar (Ramadan, the Eids, Founding Day 22 Feb, National Day 23 Sep, back to school) with offer ideas.
- **Done when:** a user can plan a month of posts and receives reminders.

### MS-18: Campaigns, tracked links and ROI (M4)
- **Scope:**
  - Campaigns: goal, channels, dates, budget and manually entered spend.
  - Tracked short links for each campaign and channel, pointing to the portfolio or an offer. Attribution runs click → lead → offer → won → recorded payment.
  - ROI, cost per lead and cost per won client, plus a rule-based budget suggestion.
  - A field to record the Mawthooq license number of any influencer used in a campaign.
- **Done when:** revenue from a recorded payment appears under the campaign that brought the lead.

### MS-19: Pricing Studio, estimator and learning (M2)
- **Scope:** a project estimator (tasks, hours, risk buffer, discount floor). Win rate by price band, average discount, effective hourly rate from time tracking and payments, and price-update reminders.
- **Done when:** the insights use only the user's own data and show the sample size.

### MS-20: Growth tier launch
- **Scope:** Growth plan limits and features per the tier matrix, and upgrade prompts linked to the gated features.
- **Done when:** a Pro user can upgrade to Growth and immediately unlocks reminders, analytics and the ROI dashboard.

## Phase 3: V3 (Studio tier)

### MS-21: Compliance alerts (M9)
- **Scope:** revenue tracking from recorded payments, with alerts at SAR 187,500 and SAR 375,000. Freelance-document renewal and voluntary GOSI reminders.
- **Done when:** the alerts fire correctly on test data at both thresholds.

### MS-22: ZATCA Phase-2 e-invoicing (M9)
- **Scope:**
  - Onboarding: CSR/CSID with ZATCA (sandbox, then production).
  - Tax and simplified invoices in UBL XML, with QR code, hash chain and cryptographic stamp.
  - Clearance and reporting APIs, and credit and debit notes.
  - The Pro add-on (SAR 30/mo) and inclusion in Growth and Studio.
- **Done when:** the ZATCA sandbox compliance checks pass for all invoice types, and there is a production pilot with one VAT-registered user.

### MS-23: Expenses, reports and income statement (M10)
- **Scope:** expenses with receipt photos and categories, P&L, profit by client, service and project, a VAT summary, and an income statement PDF for 6 or 12 months.
- **Done when:** report totals match the recorded invoices, payments and expenses (tested).

### MS-24: Team, white-label and multiple brands (M11)
- **Scope:** seats and roles (owner, manager, member, accountant view-only), assigning projects and leads, utilisation, white-label domain with Rasmi branding removed, up to 3 brand kits, and shared template and clause libraries.
- **Done when:** role permissions are enforced on the server and tested for each role.

### MS-25: Home dashboard and exports (M12)
- **Scope:** "next actions" (unanswered offers, overdue invoices, pending revisions, posts due, documents expiring) and headline numbers. CSV/Excel export, and exports formatted for Qoyod, Wafeq and Daftra.
- **Done when:** every "next action" links directly to the item that needs attention.

### MS-26: Studio tier launch
- **Scope:** Studio plan (3 seats, +SAR 39 per extra seat), onboarding session flow and agency marketing.
- **Done when:** a studio can invite teammates, bill several brands and use white-label end to end.

---

## Working rules for every milestone
- One branch and one PR per milestone. CI must be green, and the PR is reviewed before merge.
- Arabic and RTL are tested in every UI milestone, and mobile-first.
- Every limit and permission is enforced on the server, not only in the UI.
- No invented data in the product. Any benchmark or "market" figure must have a real source or come from aggregated Rasmi data with the sample size shown.
