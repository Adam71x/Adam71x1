#!/usr/bin/env bash
# Installs block_destructive.py into ~/.claude/hooks and registers it as a PreToolUse hook for Bash.
set -euo pipefail
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/block_destructive.py"
mkdir -p "$HOME/.claude/hooks"
install -m 755 "$SRC" "$HOME/.claude/hooks/block_destructive.py"
python3 - <<'PY'
import json, os
p = os.path.expanduser("~/.claude/settings.json")
s = json.load(open(p)) if os.path.exists(p) and os.path.getsize(p) else {}
cmd = "python3 ~/.claude/hooks/block_destructive.py"
pre = s.setdefault("hooks", {}).setdefault("PreToolUse", [])
if not any(h.get("command") == cmd for e in pre for h in e.get("hooks", [])):
    pre.append({"matcher": "Bash", "hooks": [{"type": "command", "command": cmd}]})
json.dump(s, open(p, "w"), indent=2)
print("Installed: ~/.claude/hooks/block_destructive.py (registered in ~/.claude/settings.json)")
PY
