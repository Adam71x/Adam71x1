#!/usr/bin/env bash
# basedagents_watch.sh - list open BasedAgents tasks and print any with bounty > 0.
# Read-only: one GET to the public API. No claiming, no keys, no spending.
# Output: "BOUNTY <task_id> <amount> <network> <title>" per paid task, then a summary line.
# Env: BA_STATUS (default open; set to "" to scan all statuses - used for testing).
# Exit 0 = ran OK (with or without bounties); exit 1 = API/parse error.
set -euo pipefail
API="${BASEDAGENTS_API_URL:-https://api.basedagents.ai}"
export BA_STATUS="${BA_STATUS-open}"
TMP="$(mktemp)"; trap 'rm -f "$TMP"' EXIT
if ! curl -sS --fail --max-time 30 "$API/v1/tasks?${BA_STATUS:+status=$BA_STATUS&}limit=100" -o "$TMP"; then
  echo "$(date -u +%FT%TZ) ERROR: could not fetch $API/v1/tasks" >&2; exit 1
fi
python3 - "$TMP" <<'PY'
import json, sys, datetime, os
STATUS = os.environ.get("BA_STATUS", "open")
try:
    d = json.load(open(sys.argv[1]))
    tasks = d["tasks"] if isinstance(d, dict) else d
except Exception as e:
    print(f"ERROR: bad JSON from API: {e}", file=sys.stderr); sys.exit(1)
def amount(t):
    b = t.get("bounty")
    if isinstance(b, dict):  # API shape: {amount_atomic, amount_display, token, network}
        if b.get("amount_display") is not None: b = b["amount_display"]
        elif b.get("amount_atomic") is not None:
            try: return int(b["amount_atomic"]) / 1e6  # USDC has 6 decimals
            except (TypeError, ValueError): return 0.0
        else: b = b.get("amount")
    try: return float(b)
    except (TypeError, ValueError): return 0.0
paid = []
for t in tasks:
    if STATUS and t.get("status", "open") != STATUS: continue
    a = amount(t)
    if a > 0:
        b = t.get("bounty")
        net = (b.get("network") if isinstance(b, dict) else None) or t.get("bounty_network") or "-"
        tok = (b.get("token") if isinstance(b, dict) else None) or "USDC"
        net = f"{tok}@{net}"
        paid.append((t.get("task_id") or t.get("id"), a, net, (t.get("title") or "").replace("\n", " ")))
for tid, a, net, title in paid:
    print(f"BOUNTY {tid} {a:.2f} {net} {title}")
now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
print(f"{now} status={STATUS or 'all'} listed={len(tasks)} with_bounty={len(paid)}")
PY
