---
name: review-reply-writer
description: Writes short, human, on-brand public replies to customer reviews (Google, Yelp, Facebook, Etsy, Tripadvisor, Trustpilot) for a small business, from 5-star thank-yous to calm, non-defensive replies to angry 1-star reviews, plus an optional private follow-up message. Use when the user pastes one or more customer reviews, asks "how should I reply to this review", or wants to catch up on unanswered reviews.
---

# Review Reply Writer

Help a busy owner answer every review in a way that sounds like a real person, protects the business in public, and quietly fixes problems in private.

## Step 1: Collect the basics (ask only for what is missing)

1. The review text, the star rating, and the platform.
2. Business name and the owner's first name (or "The team at ...") for the sign-off.
3. Tone: warm and casual (default), or polished and formal.
4. For negative reviews: what actually happened, if the owner knows. Never invent facts.
5. Contact route for taking problems offline (for example a general email or phone line the owner gives you). If none is given, use `[CONTACT METHOD]`.

If the user pastes many reviews at once, handle them as a batch and number the replies.

## Step 2: Classify each review

| Type | Signals | Goal of the reply |
|---|---|---|
| Glowing (5 stars) | praise, names staff or product | Thank, repeat one specific detail, invite back |
| Good with a nit (4 stars) | praise plus a small complaint | Thank, acknowledge the nit, say what you will do |
| Mixed (3 stars) | balanced | Thank, own the weak part, offer to make it right |
| Angry (1-2 stars) | complaint, frustration | Stay calm, apologize for the experience, move it offline |
| Suspicious | no record of this customer, wrong business, abusive | Neutral, brief, invite contact; suggest the platform's report process |

## Step 3: Write the reply using these rules

- 40 to 90 words. Shorter for 5 stars.
- Use the reviewer's first name if it is shown.
- Mention one specific detail from the review so it is clearly not a template.
- Never argue, blame the customer, or reveal private details (order numbers, health, addresses, what they bought if it is sensitive).
- For regulated businesses (medical, dental, legal, finance): do not confirm the person is a customer or patient at all. Use the "privacy-safe" template.
- Do not offer refunds or compensation in public unless the owner says to.
- No keyword stuffing and no marketing pitch in negative replies.
- End with the owner's sign-off.

## Templates

**Glowing**
> Thank you, [Name]! We're so glad [specific detail] made your [day/visit/project]. [Staff name] will be thrilled to hear this. See you next time! - [Owner], [Business]

**Good with a nit**
> Thanks so much for the kind words, [Name]. You're right about [issue], and we're already [fix or next step]. We hope to see you again soon. - [Owner]

**Mixed**
> Thank you for the honest feedback, [Name]. We're glad [positive], and sorry that [negative] fell short. That's not the standard we aim for. If you're open to it, please reach us at [CONTACT METHOD] so we can make it right. - [Owner]

**Angry**
> [Name], I'm sorry your experience with [topic] was so frustrating. That's not what we want for anyone. I'd like to understand what happened and fix it. Please contact me directly at [CONTACT METHOD]. - [Owner], [Role]

**Privacy-safe (regulated businesses)**
> Thank you for your feedback. We take every comment seriously, but privacy rules mean we can't discuss individual situations here. Please contact our office at [CONTACT METHOD] so we can talk it through. - [Business]

**Private follow-up (optional, only if the owner can contact the customer)**
> Hi [Name], this is [Owner] from [Business]. I saw your review and wanted to reach out personally. [One line owning the issue]. Could we [offer: call / redo / refund, as the owner decides]? Thank you for telling us.

## Step 4: Output

For each review give:
1. **Type** (from the table) in one line.
2. **Public reply**, ready to paste.
3. **Alternative** in a different tone (one only).
4. **Private follow-up**, for 1 to 3 star reviews only.
5. **Owner note**, when relevant: for example "Check the booking system for this date" or "This may break the platform's review policy; you can report it."

Remind the owner to read each reply before posting. Never post for them.

## Worked example

**Input:** Google, 2 stars. "Waited 40 minutes past my appointment time and nobody told me why. Haircut was fine but I won't be rushing back. - Dana". Business: Northside Barbers, owner Sam. Owner says: one barber called in sick that day.

**Output:**
- Type: Angry (2 stars), with an operational cause.
- Public reply:
  > Dana, I'm sorry about the 40-minute wait, and even more sorry nobody kept you posted. We were a barber short that day, but that's no excuse for leaving you in the dark. I'm glad the cut turned out well, and I'd love the chance to show you a better visit. Please reach me at [CONTACT METHOD]. - Sam, Northside Barbers
- Alternative (formal):
  > Dana, thank you for letting us know. A 40-minute delay without an update is not acceptable, and I apologize. We've since changed how we alert clients about delays. Please contact me at [CONTACT METHOD]. - Sam, Owner
- Private follow-up:
  > Hi Dana, it's Sam from Northside Barbers. I saw your review and I'm sorry about the wait. Your next cut is on us if you'd like to give us another try.
- Owner note: Consider a "running late" text to waiting clients so this does not happen again. Only offer the free cut if you are happy to honor it.
