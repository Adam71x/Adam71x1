# Claude Code Skills Starter Pack for Freelance Developers

Five ready-to-use [Claude Code](https://code.claude.com/docs/en/skills) skills for the jobs that surround the code: pull request descriptions, changelogs and client updates, READMEs and handoff docs, scopes and invoices, and dependency security reports.

Each skill is a folder with a `SKILL.md` (YAML frontmatter `name` + `description`, then instructions). Claude loads a skill automatically when your request matches its description, or you can run it directly with `/<skill-name>`.

| Skill | What it does | Helpers |
|---|---|---|
| `pr-description-writer` | Title and body for a PR, based on the real diff. Follows your repo's PR template and commit style if you have them | `scripts/pr_context.sh` |
| `changelog-from-git` | Keep a Changelog release notes, GitHub release bodies, or plain-English client update emails from a tag or date range | `scripts/git_changelog.py` (Conventional Commits + heuristics, `--json`) |
| `readme-generator` | Scans the repo for stack, commands, env vars, CI, and license, then writes a README that only claims what it can check. Includes a client handoff variant | `scripts/project_scan.py` |
| `client-scope-and-invoice` | Turns a client's brief or email into a scope of work, an itemized invoice, or a change request | `templates/scope-of-work.md`, `invoice.md`, `change-request.md` |
| `dependency-audit-summary` | Runs any audit tools you already have installed (npm/pnpm/yarn, pip-audit, cargo audit, govulncheck, bundler-audit, composer), then gives a ranked fix list with upgrade commands. Includes a client-facing summary | `scripts/run_audits.sh`, `scripts/summarize_audit.py` |

## Requirements

- Claude Code (a version that supports skills)
- `git`, `bash`, and Python 3.8 or newer. The helper scripts use only the standard library; `project_scan.py` reads `pyproject.toml` on Python 3.11 and newer.
- Optional: the audit tools for your stack. The audit skill lists the ones that are missing and does not install anything itself.

## Install

**Personal (all projects):**

```bash
mkdir -p ~/.claude/skills
cp -R skills/* ~/.claude/skills/
```

**Per project (share with your team via git):**

```bash
mkdir -p .claude/skills
cp -R skills/* .claude/skills/
```

Restart Claude Code, or start a new session. Ask "what skills are available?" to confirm they loaded.

## Try it

```text
> Write the PR description for this branch
> Draft release notes since v2.3.0, and a short client update email version
> Generate a README for this repo, it's being handed off to the client
> Here's the client's email: <paste>. Draft a fixed-price scope of work, 50% upfront
> Audit our dependencies and give me a client-friendly summary
```

## Safety design

- All helper scripts only read. They never commit, push, install packages, or edit your dependencies. `run_audits.sh` writes raw reports to `./audit-out/` only.
- The skills tell Claude not to make up facts: no made-up CVEs, rates, hours, commands, or features. Values it cannot check are marked `[PLACEHOLDER]` or `# TODO: verify`.
- Secrets: the README scanner reports environment variable names only, never their values. The PR skill tells Claude to leave out secrets it sees in diffs.
- The client documents are template drafts. They are not legal, tax, or accounting advice.

## Customize

Each `SKILL.md` is plain Markdown. Edit the templates to add your business name, your default payment terms, or your house style for PRs. Keep the frontmatter `description` specific, because Claude uses it to decide when to load the skill.

## Changelog

- 1.0.0 (2026-09-24): Initial release, 5 skills.

See `LICENSE.md` for the terms of use.
