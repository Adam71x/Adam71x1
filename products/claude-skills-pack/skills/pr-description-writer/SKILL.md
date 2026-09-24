---
name: pr-description-writer
description: Writes a clear, reviewer-friendly pull request title and description from the current branch's commits and diff. Use when the user asks to write, draft, or improve a PR description, PR body, merge request summary, or "what should I put in this PR", or right before opening a pull request with gh pr create.
---

# PR Description Writer

Produce a pull request title and body that a busy reviewer (or a client) can understand in under a minute, grounded only in what the diff actually does.

## Step 1: Collect context

Run the helper from the repository root (it is read-only):

```bash
bash "${CLAUDE_SKILL_DIR:-.claude/skills/pr-description-writer}/scripts/pr_context.sh" [base-branch]
```

If no base branch is given, the script tries `origin/HEAD`, then `main`, then `master`. It prints: current branch, base, merge-base, commit list, diffstat, and changed files grouped by top-level directory.

If the script is unavailable, gather the same data manually:
`git log --oneline <base>..HEAD`, `git diff --stat <base>...HEAD`, `git diff <base>...HEAD`.

Then read the actual diff for the files that matter (skip lockfiles, generated files, snapshots, and vendored code unless they are the point of the change).

Also check for a PR template: `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE/*.md`, `docs/pull_request_template.md`. If one exists, **fill in the template's structure instead of the default below**.

## Step 2: Understand before writing

Answer these for yourself first:

1. What problem does this change solve, or what capability does it add? (Look at linked issue numbers in commit messages or branch name, e.g. `feat/123-login` -> #123.)
2. What is the approach, in one sentence?
3. What are the risky parts: migrations, public API changes, config/env changes, auth, money, deletes, concurrency?
4. How was it verified? Look for new or changed tests. Never claim tests were run unless you ran them or the user said so.

## Step 3: Write the title

- Imperative mood, under 72 characters: `Add retry with backoff to webhook sender`.
- If the repo uses Conventional Commits (check `git log --oneline -30`), match it: `feat(webhooks): add retry with backoff`.
- No trailing period, no emoji unless the repo's history uses them.

## Step 4: Write the body (default structure)

```markdown
## Summary
<2-4 sentences: the why, then the what. Link the issue: "Closes #123".>

## Changes
- <Grouped, concrete bullet per logical change, not per file>
- <Mention renamed/moved files only if reviewers would be confused>

## Risk and rollout
- <Breaking changes, migrations, new env vars, feature flags, or "Low risk: <reason>">

## How to test
1. <Exact steps or commands a reviewer can run>
2. <Expected result>

## Screenshots
<Only for UI changes; otherwise omit this section>
```

## Rules

- Be specific: "Cache user lookups for 60s in `UserService.get`" beats "Improve performance".
- Every claim must be traceable to the diff. If you are unsure why something changed, ask the user or write it as an open question under a `## Notes for reviewers` heading.
- Keep it short. Most PRs need 80-250 words. Large PRs get a "Reading order" list suggesting which files to review first.
- Call out anything a reviewer must do manually (run migration, set env var, rotate secret).
- Never include secrets, tokens, internal hostnames, or customer data that appear in the diff.
- For client-facing repos, add a one-line plain-English summary at the very top that a non-developer could understand.

## Output

Print the title on its own line, then the body in a fenced markdown block so the user can copy it. If the user asked you to open the PR, use `gh pr create --title "<title>" --body-file <tmpfile>` only after showing them the draft, unless they explicitly said to go ahead.
