---
name: sop-writer
description: Turns a rambling voice-note transcript, a messy description, or a list of steps into a clean standard operating procedure (SOP) or checklist that a new hire, contractor, or virtual assistant can follow without asking questions. Use when a small-business owner or freelancer asks to write an SOP, document a process, create a checklist, write "how we do X" instructions, or prepare to delegate a task.
---

# SOP Writer

Get the process out of the owner's head and into a document someone else can follow on their first day.

## Step 1: Get the raw process

Accept any format: a voice-note transcript, bullet points, a pasted email, or "let me just tell you how I do it". If the user gives nothing yet, ask them to describe the task out loud from start to finish, "like you're explaining it to a new assistant over your shoulder". Then ask up to 5 short questions, only about gaps:

1. Who will do this task (role, experience level)?
2. How often, and what triggers it (a day, an event, a customer action)?
3. Which tools, logins, or files are needed? (Names only. Never ask for passwords.)
4. What does "done right" look like?
5. What usually goes wrong, and when must they stop and ask the owner?

## Step 2: Structure it

- Break the process into numbered steps. One action per step, starting with a verb ("Open", "Check", "Send").
- Group steps into phases if there are more than 12.
- Add a **decision point** wherever the doer must choose ("If the order is over $500, go to step 9").
- Mark anything that needs owner approval with **[OWNER APPROVAL]**.
- Put exact wording (emails, scripts) in quote blocks so they can be copied.
- Replace anything sensitive (passwords, card numbers, account numbers) with `[STORED IN: password manager / location]`.
- Use plain words at roughly an 8th-grade reading level. Define any jargon the first time.

## Step 3: Fill the template

```
# SOP: [Process name]
Version 1.0 | Owner: [name/role] | Last reviewed: [date] | Time needed: [estimate]

## Purpose
[One sentence: why this matters to the business or the customer.]

## When to do this
[Trigger or schedule.]

## Who does this
[Role.] Escalate to [role] when: [conditions].

## Before you start
- [ ] Access to: [tools/files]
- [ ] Have ready: [info/materials]

## Steps
1. [Verb + action.] 
   - Tip: [optional]
2. ...
   - If [condition], go to step [n]. Otherwise continue.

## Done means
- [Checkable outcome 1]
- [Checkable outcome 2]

## Common mistakes
- [Mistake] -> [How to avoid it]

## Quick checklist (print this)
- [ ] ...
```

## Step 4: Review pass

Before showing the result, check it:
- Could a new person follow it with no context? If a step says "the usual way", rewrite it.
- Does every step have exactly one action?
- Are all [OWNER APPROVAL] points and escalation rules listed?
- Is there any sensitive data? Remove it.

Then list **Open questions** for anything you had to assume, so the owner can fill in the gaps. Offer to make a one-page checklist-only version.

## Worked example

**Input (voice-note transcript):** "ok so when a cake order comes in on the website, I check the date, we need at least five days, if it's less I email them saying rush fee is 25 dollars, then I put it in the google calendar with the flavor and the name, send the deposit invoice, 50 percent, and once they pay I mark it green. oh and if it's a wedding cake I always call them, those are over 300 usually."

**Output (abridged):**

```
# SOP: New Custom Cake Order
Version 1.0 | Owner: [Owner name] | Time needed: 10 minutes per order

## Purpose
Confirm every order on time and collect a deposit before we buy ingredients.

## When to do this
Each time a new order form arrives from the website.

## Steps
1. Open the new order and check the pickup date.
2. Count the days from today to pickup.
   - If fewer than 5 days, send the Rush Fee email (below) and wait for a reply before going on.
3. If the order is a wedding cake, phone the customer to confirm details. [OWNER APPROVAL] needed for any wedding cake quote.
4. Add the order to the shared Google Calendar on the pickup date. Title: "[Customer name] - [flavor] - [size]".
5. Send the deposit invoice for 50% of the total.
6. When the deposit is paid, change the calendar event color to green.

> Rush Fee email: "Hi [Name], thanks for your order! Because your pickup is less than 5 days away, a $25 rush fee applies. Reply 'yes' to confirm and I'll send your deposit invoice."

## Done means
- The order is on the calendar, the deposit invoice is sent, and the event is green once paid.

## Open questions
- What happens if the deposit is not paid within a set number of days?
- Who can approve a rush order if the owner is away?
```
