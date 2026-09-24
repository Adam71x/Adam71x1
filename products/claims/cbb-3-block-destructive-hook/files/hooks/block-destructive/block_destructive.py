#!/usr/bin/env python3
"""Claude Code PreToolUse hook: block destructive Bash commands.

Reads the hook JSON from stdin. If tool_name == "Bash" and the command matches a
destructive pattern, it prints the reason to stderr and exits 2 (Claude Code
blocks the call and shows the reason to the model). Otherwise it exits 0.
Allow-list override: set CLAUDE_ALLOW_DESTRUCTIVE=1 in the environment.
Log: blocked attempts are appended to ~/.claude/hooks/blocked.log (best effort).
"""
import json, os, re, shlex, sys, time

RULES = [
    # Any recursive + forced rm (rm -rf, rm -fr, rm -r -f, rm -Rf, --recursive --force), anywhere in a pipeline.
    (r"(^|[;&|(`]|\s)(sudo\s+)?rm\s+(?=(?:[^\s;&|]*\s+)*?(-[a-zA-Z]*[rR][a-zA-Z]*|--recursive)(\s|$))(?=(?:[^\s;&|]*\s+)*?(-[a-zA-Z]*f[a-zA-Z]*|--force)(\s|$))",
     "rm -rf (recursive forced delete) is irreversible"),
    (r"\brm\s+.*--no-preserve-root", "rm --no-preserve-root"),
    (r"\bgit\s+push\b.*(\s--force\b|\s-f\b|\s--force-with-lease\b|\s\+\S+)", "force push rewrites remote history"),
    (r"\bgit\s+reset\s+--hard\b", "git reset --hard discards uncommitted work"),
    (r"\bgit\s+clean\s+-[a-zA-Z]*f", "git clean -f deletes untracked files"),
    (r"\bgit\s+checkout\s+(--\s+)?\.(\s|$)", "git checkout . discards local changes"),
    (r"\bgit\s+(branch\s+-D|filter-branch|filter-repo)\b", "destructive git history/branch operation"),
    (r"\b(DROP\s+(DATABASE|TABLE|SCHEMA)|TRUNCATE(\s+TABLE)?\s+\w)", "destructive SQL statement"),
    (r"\bDELETE\s+FROM\s+[\w.`\"\[\]]+\s*(;|$|\"|'|\))", "DELETE without WHERE clause"),
    (r"\bmkfs(\.\w+)?\b|\bdd\b.*\bof=/dev/", "disk format / raw device write"),
    (r">\s*/dev/(sd|nvme|hd|disk)\w*", "redirect onto a block device"),
    (r":\(\)\s*\{\s*:\|:&\s*\};:", "fork bomb"),
    (r"\bchmod\s+(-R\s+)?0?777\s+/(\s|$)|\bchown\s+-R\s+\S+\s+/(\s|$)", "recursive permission change on /"),
    (r"\b(curl|wget)\b[^|]*\|\s*(sudo\s+)?(ba|z)?sh\b", "piping a remote script into a shell"),
    (r"\b(shutdown|reboot|halt|poweroff)\b", "system power command"),
    (r"\bkubectl\s+delete\b.*(--all\b|\bnamespace\b)|\bterraform\s+destroy\b", "infrastructure teardown"),
]
COMPILED = [(re.compile(p, re.IGNORECASE), why) for p, why in RULES]

def check(cmd: str):
    norm = " ".join(cmd.split())
    for rx, why in COMPILED:
        if rx.search(norm):
            return why
    return None

def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0  # never break the session on malformed input
    if data.get("tool_name") != "Bash" or os.environ.get("CLAUDE_ALLOW_DESTRUCTIVE") == "1":
        return 0
    cmd = (data.get("tool_input") or {}).get("command", "")
    why = check(cmd)
    if not why:
        return 0
    try:
        p = os.path.expanduser("~/.claude/hooks/blocked.log")
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "a") as f:
            f.write(json.dumps({"timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                                "reason": why, "command": cmd,
                                "project": os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd") or os.getcwd(),
                                "session_id": data.get("session_id")}) + "\n")
    except Exception:
        pass
    print(f"Blocked by block_destructive hook: {why}.\nCommand: {cmd}\n"
          "Ask the user to run it manually, or propose a safer alternative.", file=sys.stderr)
    return 2

if __name__ == "__main__":
    sys.exit(main())
