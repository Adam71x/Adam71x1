# Lead: BasedHardware/omi — "action items -> todo.txt" docs recipe ($25 proposed bounty)

**Status: DRAFT. Not posted.** The owner must decide whether to post it. The draft needs a GitHub account, and for the PR, a fork.

## Lead facts
- Buyer: BasedHardware (Omi), https://github.com/BasedHardware/omi
- What they have posted: docs.omi.me/doc/developer/Contribution says contributors may browse "Paid Bounty" issues. When none are open, it says to *suggest your own bounty*. Payment is claimed via team@basedhardware.com (PayPal) after merge.
- Evidence of recent payouts or acceptance: many `[Bounty proposal] docs(cli): ... ($25 proposed)` issues were closed as **completed** on 2026-09-24 (e.g. #14781, #14783, #14785, #15529). "Completed" means only that the issue was closed. It does **not** prove anyone was paid.
- Competition: very heavy. On 2026-09-24 alone, 12+ proposals for action-items recipes were opened (CSV #18598, TSV #18534, JSONL #18528, ICS #18509, VTODO #18556, Todoist #18580, Trello #18567, Kanban #18550, HTML #18503, …). At 14:05 UTC, a search for **todo.txt** returned no issues.
- Budget: $25 (the going rate that proposers state themselves, not a price the maintainer posted).
- Fit score: **4/10**. The scope is tiny and the work is already done. But the price is low, the channel is flooded with AI-made proposals, and neither acceptance nor payout is guaranteed.

## What's already built (in this folder)
- `action_items_to_todotxt.py`: stdlib-only converter. Supports stdin or a file, BOM input, `--status`, `--project`, and an idempotent `--merge`.
- `test_action_items_to_todotxt.py`: 12 unit tests, all passing locally (`python3 -m unittest`).
- `action_items_todotxt.md`: the recipe doc, written in the same structure as the existing `sdks/python-cli/examples/action_items_markdown.md`.
- Target paths in the repo: `sdks/python-cli/examples/action_items_to_todotxt.py`, `.../action_items_todotxt.md`, and a test file placed wherever the maintainers keep example tests.

## Draft issue text (for the owner to post if approved)

**Title:** `[Bounty proposal] docs(cli): action items -> todo.txt recipe ($25 proposed)`

> Hi, this is Quillforge Studio, a small project that uses AI to help write code and docs. A person reviews every change before it's submitted. **This contribution was drafted with AI assistance.**
>
> **Proposal:** add a recipe that exports `omi --json action-item list` to the plain-text [todo.txt](https://github.com/todotxt/todo.txt) format. That format is used by todo.sh, Simpletask, SwiftoDo, sleek, topydo and editor plugins. It's the only common plain-text task format the examples folder doesn't cover yet.
>
> **Scope:**
> - `sdks/python-cli/examples/action_items_to_todotxt.py`: stdlib only. Reads stdin or a file and handles a BOM. Filters with `--status open|completed|all`, sets a `+project` tag with `--project`, and has an idempotent `--merge` that skips items whose `omi:<id>` is already in the file, so it's safe to run from cron.
> - `sdks/python-cli/examples/action_items_todotxt.md`: recipe doc in the same format as `action_items_markdown.md`.
> - 12 unit tests covering completed/open lines, spec date order, reserved-prefix escaping (`x `, `(A) `, a leading date), tag sanitising, invalid dates, BOM input, and merge dedupe.
>
> **Proposed bounty:** $25, matching the other CLI docs bounties, payable only after review and merge.
> A PR is ready to open if this is useful. If you'd rather not add another export format, just close this issue.

## Next action for owner
1. Decide whether to post at all. The channel is saturated, and the maintainers may see AI-drafted proposals as spam.
2. If yes: fork, copy the three files into `sdks/python-cli/examples/`, open the issue and then the PR, and use the owner's own PayPal for the claim. Don't make multiple proposals.
