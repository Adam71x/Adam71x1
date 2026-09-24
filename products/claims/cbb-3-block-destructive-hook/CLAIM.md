# CLAIM: claude-builders-bounty #3, "[BOUNTY $100] HOOK: Pre-tool-use hook that blocks destructive bash commands"

## Verdict: deliverable is ready, but the payout is almost certainly NOT real. Recommend NO-GO (or submit only for portfolio value)

| Field | Value |
|---|---|
| Issue | https://github.com/claude-builders-bounty/claude-builders-bounty/issues/3 |
| Listed amount | $100 (title and README) |
| Platform / payout | Opire (`/opire try`, then a PR; "payment is released automatically on merge"). Opire pays out through **Stripe Connect**, which needs a GitHub login plus Stripe identity/KYC (legal name, bank account, and possibly a tax ID). |
| Verified open | 2026-09-24 ~15:14 UTC. The issue is open, has no assignee, and is labelled bounty/hook/security. |
| Base commit | upstream `main` @ `1aeae2adc82d33f971fd7731644348dcdd24b5a6` (the repo contains only README and LICENSE) |

### Red flags found (competing attempts and payout evidence)
1. **No Opire reward exists.** Opire's public API `GET https://api.opire.dev/rewards` (15:18 UTC) lists all 6 available rewards platform-wide, and **none is for claude-builders-bounty**. The `$100` looks like it was only a title. It was never funded (Opire only lists a reward after the creator pays).
2. **Nothing has ever been merged.** The repo has 4,161 PRs (3,240 open and 921 closed), and the `is:pr is:merged` search returns **0**. Since March 2026 no PR has been merged, so no "payment on merge" has ever triggered.
3. **Massive competition.** A search for PRs matching "destructive" returns **991** (760 open). At least 4 of those were opened on Sep 22–24 alone (#4440, #4453, #4456, #4459, #4465).
4. Issue #4188, "Question: proof of contributor payments?" (Sep 9), has **no maintainer reply**. Other issues show people asking to be paid (#3128, #4223, and the `/claim` spam #3806–#3820).

Expected value is about $0. If the owner still wants to submit (for example as a public portfolio piece), follow the steps below. Do not do Stripe KYC for this unless a reward appears on Opire first.

## Deliverable (adapted to the exact acceptance criteria)
The acceptance criteria below are copied from the issue. Each one has its own test in `test_block_destructive.py`.

| Criterion | How it is met |
|---|---|
| Follows the Claude Code hooks format (`~/.claude/hooks/`) | `PreToolUse` command hook with matcher `Bash`, installed to `~/.claude/hooks/block_destructive.py` and registered in `~/.claude/settings.json` |
| Blocks `rm -rf`, `DROP TABLE`, `git push --force`, `TRUNCATE`, `DELETE FROM` without WHERE | Each has a regex rule. `rm -rf` is caught in every flag form (-rf/-fr/-r -f/-Rf/--recursive --force/sudo). Force push covers --force/-f/--force-with-lease/+refspec. SQL matching ignores case. Plus extras: reset --hard, clean -f, mkfs, dd, curl\|sh, fork bomb, terraform destroy |
| Logs to `~/.claude/hooks/blocked.log` with timestamp, command, project path | One JSONL line per block with `timestamp`, `command`, `project` (`$CLAUDE_PROJECT_DIR`, falling back to hook `cwd`), `reason`, `session_id` |
| Clear message to Claude | Exit code 2 and a stderr message: "Blocked by block_destructive hook: <reason>. Command: … Ask the user to run it manually, or propose a safer alternative." |
| Does not interfere with normal commands | 19 allow-cases pass (`rm -r dir`, `rm -f file`, `git push origin main`, `DELETE … WHERE`, `grep -rf`, `ls -rf`, `rm -r a && ls -f`, …). Malformed input exits 0 |
| README with install in 2 commands or fewer | `git clone … && cd …/hooks/block-destructive` then `bash install.sh`. The installer merges settings and is idempotent (tested twice on an existing settings.json) |

Files: `files/hooks/block-destructive/{block_destructive.py,install.sh,README.md,test_block_destructive.py}` and `fix.patch` (git format-patch, adds `hooks/block-destructive/`).

## Test evidence
```
$ git clone --depth 1 https://github.com/claude-builders-bounty/claude-builders-bounty ap && cd ap
$ git apply --check fix.patch && git apply fix.patch
$ python3 hooks/block-destructive/test_block_destructive.py
51/51 passed
# installer in a fake HOME with an existing settings.json, run twice -> one PreToolUse entry, other keys kept
# live run: echo '{"tool_name":"Bash","cwd":"/p","tool_input":{"command":"rm -rf dist"}}' | python3 ~/.claude/hooks/block_destructive.py -> exit=2
# blocked.log: {"timestamp": "2026-09-24T15:16:03Z", "reason": "rm -rf (recursive forced delete) is irreversible", "command": "rm -rf dist", "project": "/p", "session_id": null}
```

## Exact owner steps (only if choosing to submit)
1. Check again that it is worth it: `curl -s https://api.opire.dev/rewards | grep -c claude-builders-bounty`. **If this prints 0, stop.** There is no funded reward.
2. On the issue, comment exactly: `/opire try`
3. Fork `claude-builders-bounty/claude-builders-bounty`, then:
   ```bash
   git clone https://github.com/<you>/claude-builders-bounty && cd claude-builders-bounty
   git checkout -b hook-block-destructive
   git am /path/to/fix.patch        # or: git apply fix.patch && git add hooks && git commit -m "hook: PreToolUse hook that blocks destructive bash commands (#3)"
   python3 hooks/block-destructive/test_block_destructive.py   # expect 51/51 passed
   git push -u origin hook-block-destructive
   ```
   (`git am` will record the author as "owner <owner@example.com>". Run `git commit --amend --reset-author --no-edit` afterwards.)
4. Open a PR against `main`.
   - Title: `[BOUNTY #3] HOOK: PreToolUse hook that blocks destructive bash commands`
   - Body:
     ```
     /claim #3
     Closes #3

     Adds `hooks/block-destructive/`: a Claude Code PreToolUse hook (Python, stdlib only).
     - Blocks rm -rf (all flag forms), DROP TABLE/DATABASE, git push --force (-f, --force-with-lease, +refspec), TRUNCATE, DELETE FROM without WHERE (+ reset --hard, clean -f, mkfs, dd, curl|sh)
     - Logs each block to ~/.claude/hooks/blocked.log as JSONL: timestamp, command, project path (CLAUDE_PROJECT_DIR or cwd), reason
     - Exit 2 + stderr message so Claude sees why and can propose a safer alternative
     - Normal commands untouched; malformed input never breaks the session; CLAUDE_ALLOW_DESTRUCTIVE=1 escape hatch
     - Install in 2 commands (idempotent installer that merges ~/.claude/settings.json)
     - Tests: `python3 hooks/block-destructive/test_block_destructive.py` → 51/51 passed

     AI-assistance disclosure: this PR was drafted with Claude Code (AI) and reviewed/tested by me.
     ```
5. The payout only happens if Opire shows a reward and the PR is merged. Opire then asks you to connect Stripe, which needs KYC.

AI-assistance disclosure: code, tests and docs were written by an AI agent (Claude Code, Agent C2 / B2) for the owner to review and submit under their own identity.
