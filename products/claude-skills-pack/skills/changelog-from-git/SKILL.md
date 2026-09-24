---
name: changelog-from-git
description: Generates a human-readable CHANGELOG entry or release notes from git history between two tags, commits, or dates, grouped into Added / Changed / Fixed / Removed / Security following Keep a Changelog. Use when the user asks for a changelog, release notes, "what changed since v1.2", a version bump summary, or a client update describing recent work.
---

# Changelog from Git

Turn raw commit history into release notes that users and clients actually read.

## Step 1: Pick the range

- If the user names a range (`v1.2.0..v1.3.0`, "since last release", "last 2 weeks"), use it.
- Otherwise use the latest tag to HEAD: `git describe --tags --abbrev=0`.
- If there are no tags, use the last 50 commits and say so.

## Step 2: Collect and pre-group commits

Run the helper (read-only, Python 3 standard library only):

```bash
python3 "${CLAUDE_SKILL_DIR:-.claude/skills/changelog-from-git}/scripts/git_changelog.py" --from v1.2.0 --to HEAD
# or: --since "2 weeks ago"
# add --json for machine-readable output
```

It parses Conventional Commit prefixes (`feat`, `fix`, `perf`, `refactor`, `docs`, `chore`, `BREAKING CHANGE`, `!`) and falls back to keyword heuristics ("add", "fix", "remove", "bump", "security", "CVE") for non-conventional repos. It also extracts PR numbers (`#123`) and authors.

## Step 3: Rewrite, do not copy

The script output is a draft grouping. Your job is editorial:

1. **Merge** related commits into one bullet ("Add OAuth login" + "fix oauth redirect" + "oauth tests" -> one bullet).
2. **Drop noise**: merge commits, typo fixes, CI tweaks, formatting, version bumps, "wip". Keep dependency bumps only if they are security-relevant or user-visible.
3. **Rewrite for the reader**: describe user-visible effect, not implementation. "Fix crash when uploading files over 2 GB" beats "fix int overflow in chunker".
4. **Promote breaking changes** to a `### Breaking` section at the top with migration instructions. Read the diff of breaking commits if needed (`git show <sha> --stat`).
5. If a commit message is unclear, inspect `git show --stat <sha>` before guessing. Never invent features.

## Step 4: Format

Default to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/):

```markdown
## [1.3.0] - 2026-09-24

### Breaking
- `config.timeout` is now in seconds, not milliseconds. Divide existing values by 1000.

### Added
- Export reports as CSV (#142)

### Changed
- Dashboard loads 40% faster on large accounts (#150)

### Fixed
- Crash when uploading files over 2 GB (#147)

### Security
- Upgrade `jsonwebtoken` to 9.0.2 (CVE-2022-23529)
```

- Omit empty sections.
- Version: use the user's number; otherwise suggest one using SemVer (breaking -> major, feat -> minor, else patch) and say it is a suggestion.
- Date: today's date in ISO format unless the tag has a date (`git log -1 --format=%as <tag>`).

## Variants (on request)

- **Client update email**: 3-6 bullets in plain English, no PR numbers, grouped as "New", "Improved", "Fixed", with a one-line intro and a "Next up" line if the user provides it.
- **GitHub release body**: same as default plus a "Full diff" link `https://github.com/<owner>/<repo>/compare/<from>...<to>` (derive owner/repo from `git remote get-url origin`).
- **Tweet / social post**: one headline feature, max 280 characters.

## Writing to CHANGELOG.md

If asked to update the file: insert the new section directly below the `## [Unreleased]` heading (or below the title if there is none), keep existing content untouched, and update the comparison links at the bottom if the file uses them. Show the diff to the user.
