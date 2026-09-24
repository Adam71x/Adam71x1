---
name: readme-generator
description: Creates or overhauls a project README.md by scanning the repository for language, framework, install/run/test commands, environment variables, and license, then writing an accurate, skimmable README. Use when the user asks to write, generate, improve, or update a README, project documentation front page, or handoff docs for a client repository.
---

# README Generator

Write a README that is accurate (every command works), skimmable (a new developer is running the project in 5 minutes), and honest (no invented features or badges).

## Step 1: Scan the project

Run the helper from the repository root (read-only, Python 3 standard library only):

```bash
python3 "${CLAUDE_SKILL_DIR:-.claude/skills/readme-generator}/scripts/project_scan.py" .
```

It reports: detected languages and manifests (package.json, pyproject.toml, requirements.txt, go.mod, Cargo.toml, Gemfile, composer.json, pom.xml, build.gradle, Dockerfile, docker-compose), declared scripts/commands, runtime versions (.nvmrc, .python-version, engines), environment variables referenced in `.env.example` and source code, license, CI config, test directories, and the top-level tree.

Then read the most important files yourself: the entry point, the main config, and any existing README or docs folder.

## Step 2: Decide the audience

Ask (or infer from context) which one this README serves, since it changes emphasis:

- **Open-source library**: install, quick example, API overview, contributing.
- **Application / client project**: prerequisites, setup, env vars, run, deploy, architecture.
- **Internal tool / script**: what it does, usage examples, options.

## Step 3: Write it

Use this skeleton, dropping sections that do not apply:

```markdown
# <Project name>

<One sentence: what it is and who it is for.>

<Optional: 2-4 bullet key features, only ones that exist in the code.>

## Quick start
<The shortest path from clone to running, as copy-pasteable commands.>

## Requirements
- <Runtime + version, from .nvmrc / engines / python_requires / go.mod>
- <Services: Postgres 15, Redis, etc., from docker-compose or config>

## Installation
## Configuration
| Variable | Required | Default | Description |
|---|---|---|---|

## Usage
<Real examples: CLI invocations, API calls, or screenshots placeholder.>

## Development
- Run tests: `<command>`
- Lint / format: `<command>`
- Project structure: <short annotated tree of the top-level dirs>

## Deployment
## Contributing
## License
<From the LICENSE file. If none exists, say "No license file found" and tell the user, do not invent one.>
```

## Accuracy rules

- Every command must come from the manifest, Makefile, scripts, CI config, or Dockerfile. If you cannot verify a command, mark it `# TODO: verify` and tell the user.
- Offer to run the Quick start commands to confirm they work, when that is safe (no deploys, no destructive commands, no paid APIs).
- Environment variables: list names and purpose only. Never copy real values from `.env` files; only use placeholders.
- Badges: only add CI/license badges whose source you can see (e.g. a GitHub Actions workflow file). Never add coverage or download badges you cannot back up.
- Keep the Quick start under 10 lines.

## Updating an existing README

Preserve the author's voice, custom sections, and anything you cannot verify as wrong. Fix outdated commands, add missing sections, and show the user a summary of what changed and why.

## Client handoff variant

When the user says the README is for handing a project to a client, add: "Where things live" (hosting, domains, dashboards, by name only, no credentials), "Common tasks" (how to update content, restart, rotate keys), and "Support" (placeholder for the freelancer's contact and support terms).
