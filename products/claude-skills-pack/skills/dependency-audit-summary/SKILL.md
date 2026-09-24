---
name: dependency-audit-summary
description: Runs the project's native dependency vulnerability and outdated-package checks (npm/pnpm/yarn audit, pip-audit, cargo audit, govulncheck, bundler-audit, composer audit) and turns the raw output into a prioritized, plain-English report with concrete upgrade commands. Use when the user asks to audit dependencies, check for vulnerabilities or CVEs, review outdated packages, assess security before a release, or write a dependency health report for a client.
---

# Dependency Audit Summary

Convert noisy audit output into a short, prioritized action list that a developer can execute and a client can understand.

## Step 1: Detect and run audits

Run the helper from the repository root:

```bash
bash "${CLAUDE_SKILL_DIR:-.claude/skills/dependency-audit-summary}/scripts/run_audits.sh" ./audit-out
```

It detects ecosystems from lockfiles/manifests, runs whichever audit tools are **already installed**, and writes raw JSON to `./audit-out/` (for example `npm-audit.json`, `pip-audit.json`). It never installs tools or modifies dependencies. It prints which tools were missing, with the install command, so you can ask the user whether to install them.

Audits contact public vulnerability databases (npm registry, OSV, RustSec). If the user is offline or in a restricted network, say so and fall back to outdated-version checks.

Then normalize npm-style output (npm, pnpm) and pip-audit output into one table:

```bash
python3 "${CLAUDE_SKILL_DIR:-.claude/skills/dependency-audit-summary}/scripts/summarize_audit.py" ./audit-out
```

For other ecosystems, read the raw JSON directly.

## Step 2: Prioritize

Rank findings with this order, not raw severity alone:

1. **Critical/High in runtime (production) dependencies** that are reachable: server frameworks, auth, crypto, parsers of untrusted input, file upload handling.
2. **Critical/High in dev-only dependencies** (build tools, test runners). Usually lower real risk; say why.
3. **Moderate/Low**, grouped.
4. **Outdated but not vulnerable**: only mention majors that are end-of-life or block security fixes.

For the top items, check whether the vulnerable code path is plausibly used: search the codebase for imports of the package (`grep -rn "from 'pkg'\|require('pkg')\|import pkg"`). State your confidence; do not claim "not exploitable" without evidence.

## Step 3: Recommend fixes

For each actionable item give the exact command, and note whether it is a patch, minor, or major bump:

- npm: `npm install pkg@^1.2.4`; transitive only: use `overrides` in package.json (show the snippet)
- pnpm: `pnpm update pkg` or `pnpm.overrides`
- yarn: `yarn up pkg` or `resolutions`
- pip: `pip install 'pkg>=1.2.4'` and update requirements/pyproject pin
- cargo: `cargo update -p crate`
- go: `go get module@v1.2.4 && go mod tidy`

Warn about majors: link the changelog if you know it, and recommend running the test suite after upgrades. Do not run upgrade commands unless the user asks.

## Step 4: Write the report

```markdown
# Dependency Audit: <project> (<date>)

**Bottom line:** <1-2 sentences: overall risk and the single most important action.>

| Priority | Package | Installed | Fixed in | Severity | Advisory | Runtime? | Action |
|---|---|---|---|---|---|---|---|

## Recommended actions
1. <Command> - <why, risk of the upgrade>

## Accepted / deferred risks
- <Item, reason, revisit date>

## Coverage
- Scanned: <ecosystems and tools>. Not scanned: <missing tools>. Database date: <today>.
```

Client-facing variant: replace the table with 3-5 plain-English bullets ("A library used to process uploaded images has a known flaw that could let an attacker crash the server. Fix: routine update, about 30 minutes including testing.") and an estimate of effort only if the user provides rates or asks.

## Rules

- Report only what the tools output. Never invent CVE IDs, versions, or severities.
- Always list what was **not** scanned, so a clean report is not mistaken for full coverage.
- Keep raw output files out of commits: suggest adding `audit-out/` to `.gitignore`.
