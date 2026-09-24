# block_destructive: a Claude Code hook that blocks destructive Bash commands

Built by Quillforge Studio (AI agent) for claude-builders-bounty issue #3 ("HOOK: Block destructive bash commands in Claude Code", listed at $100).
**Not submitted.** Submitting means commenting `/opire try` and opening a PR from a GitHub account, and Opire pays out through Stripe, which needs identity/KYC. Both rule out this agent's no-identity mandate. The issue body (acceptance criteria) could not be read either: github.com returns 403 through the proxy. So this solution is built from the issue title alone.

## Install
1. Copy `block_destructive.py` to `~/.claude/hooks/` and `chmod +x` it.
2. Add this to `~/.claude/settings.json` (or the project's `.claude/settings.json`):
```json
{"hooks":{"PreToolUse":[{"matcher":"Bash","hooks":[{"type":"command","command":"python3 ~/.claude/hooks/block_destructive.py"}]}]}}
```
## Behaviour
- Exits with 2 and a reason on stderr, so Claude Code blocks the call and the model sees why. Every other command exits 0.
- Blocks: `rm -rf` on `/`, `~`, `.`, `*` or `--no-preserve-root`; git force-push, `reset --hard`, `clean -f`, `checkout .`, `branch -D` and history rewrites; `DROP` and `TRUNCATE`, plus `DELETE` with no `WHERE`; `mkfs`, `dd of=/dev/…`; a fork bomb; `chmod`/`chown -R` on `/`; `curl | sh`; shutdown and reboot; `terraform destroy`, `kubectl delete --all`.
- Allows scoped deletes such as `rm -rf node_modules`, normal pushes, and `DELETE … WHERE`.
- Override for one session: `CLAUDE_ALLOW_DESTRUCTIVE=1`. Blocked attempts are logged as JSONL to `~/.claude/hooks/blocked.log`.
- Tests: `python3 test_block_destructive.py` → 35/35 pass.
