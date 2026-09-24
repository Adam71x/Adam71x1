# block-destructive: Claude Code PreToolUse hook

A `PreToolUse` hook for Claude Code that stops destructive Bash commands before they run. When it blocks a command, it tells Claude why. It also logs every blocked attempt.

## Install (2 commands)
```bash
git clone --depth 1 https://github.com/claude-builders-bounty/claude-builders-bounty && cd claude-builders-bounty/hooks/block-destructive
bash install.sh
```
`install.sh` copies `block_destructive.py` to `~/.claude/hooks/` and adds this hook to `~/.claude/settings.json` without touching other settings. It is safe to run twice:
```json
{"hooks":{"PreToolUse":[{"matcher":"Bash","hooks":[{"type":"command","command":"python3 ~/.claude/hooks/block_destructive.py"}]}]}}
```
Restart Claude Code, or open `/hooks`, to load it.

## What is blocked
| Pattern | Examples |
|---|---|
| `rm -rf` in any flag form | `rm -rf x`, `rm -fr`, `rm -r -f`, `rm -Rf`, `rm --recursive --force`, `sudo rm -rf /` |
| `DROP TABLE` / `DROP DATABASE` / `DROP SCHEMA` | `psql -c 'DROP TABLE users'` |
| `git push --force` | `--force`, `-f`, `--force-with-lease`, `+branch` refspecs |
| `TRUNCATE` | `TRUNCATE TABLE logs`, `truncate logs` |
| `DELETE FROM` with no `WHERE` | `DELETE FROM users;` (`DELETE FROM users WHERE id=3` is allowed) |
| Extras | `git reset --hard`, `git clean -f`, `mkfs`, `dd of=/dev/…`, `curl … \| sh`, fork bomb, `terraform destroy`, `kubectl delete --all` |

SQL matching ignores case. Normal commands pass through untouched: `rm file`, `rm -r dir`, `git push origin main`, `ls -rf`, `grep -rf`, `npm test` and so on.

## How Claude sees a block
The hook exits with code `2` and writes to stderr. Claude Code cancels the tool call and passes this message to Claude:
```
Blocked by block_destructive hook: rm -rf (recursive forced delete) is irreversible.
Command: rm -rf dist
Ask the user to run it manually, or propose a safer alternative.
```

## Log
Each blocked attempt adds one JSON line to `~/.claude/hooks/blocked.log`:
```json
{"timestamp": "2026-09-24T15:16:03Z", "reason": "...", "command": "rm -rf dist", "project": "/path/to/project", "session_id": "..."}
```
`project` comes from `$CLAUDE_PROJECT_DIR`. If that is unset, the hook uses the `cwd` field of the hook input.

## Escape hatch / tests
- To bypass the hook, start Claude Code with `CLAUDE_ALLOW_DESTRUCTIVE=1`.
- If the hook gets malformed input, it exits 0, so it never breaks a session.
- Run `python3 test_block_destructive.py`. It runs 51 checks covering the blocked cases, the allowed cases, non-Bash tools, the override, malformed input and the log fields.
