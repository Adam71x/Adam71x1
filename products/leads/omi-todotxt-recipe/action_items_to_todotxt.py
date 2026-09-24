"""
Convert Omi action items JSON exports to todo.txt format (https://github.com/todotxt/todo.txt).

todo.txt is a plain-text task format read by todo.sh, Simpletask (Android),
SwiftoDo (iOS), sleek (desktop), topydo, and many editor plugins.

Usage:
    # Pipe directly from omi CLI
    omi --json action-item list | python action_items_to_todotxt.py -

    # Write / merge into an existing todo.txt (dedupes by omi id)
    omi --json action-item list | python action_items_to_todotxt.py - --output ~/todo/todo.txt --merge

    # Only open items, with a custom project tag
    omi --json action-item list --open | python action_items_to_todotxt.py - --status open --project Work
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

_TAG_SAFE = re.compile(r"[^\w-]")
_OMI_ID = re.compile(r"(?:^|\s)omi:([\w-]+)(?:\s|$)")
_DATE_PREFIX = re.compile(r"^\d{4}-\d{2}-\d{2} ")


def parse_datetime(value: Optional[str]) -> Optional[datetime]:
    """Parse an ISO-8601 string and normalise to UTC; return None when invalid."""
    if not value or not isinstance(value, str):
        return None
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def safe_tag(value: Any) -> str:
    """Make a value safe for a todo.txt key:value or +project token (no spaces/colons)."""
    return _TAG_SAFE.sub("", str(value or ""))


def clean_description(text: Any) -> str:
    """Collapse whitespace and neutralise tokens that todo.txt parsers would misread."""
    desc = " ".join(str(text or "").split())
    if not desc:
        desc = "Untitled action item"
    # A leading "x " marks completion and "(A) " marks priority in todo.txt;
    # a leading date would be read as the creation date. Escape them.
    if desc.startswith("x ") or re.match(r"^\([A-Z]\) ", desc) or _DATE_PREFIX.match(desc):
        desc = "- " + desc
    return desc


def format_item(item: Dict[str, Any], project: str = "omi") -> str:
    """Render one Omi action item as a single todo.txt line."""
    completed = bool(item.get("completed", False))
    created = parse_datetime(item.get("created_at"))
    completed_at = parse_datetime(item.get("completed_at")) or parse_datetime(item.get("updated_at"))
    due = parse_datetime(item.get("due_at"))

    parts: List[str] = []
    if completed:
        parts.append("x")
        # Spec: completion date must precede creation date, and is only valid if both exist.
        if completed_at and created:
            parts.append(completed_at.strftime("%Y-%m-%d"))
    if created:
        parts.append(created.strftime("%Y-%m-%d"))

    parts.append(clean_description(item.get("description")))

    proj = safe_tag(project)
    if proj:
        parts.append(f"+{proj}")
    if due:
        parts.append(f"due:{due.strftime('%Y-%m-%d')}")
    conv = safe_tag(item.get("conversation_id"))
    if conv:
        parts.append(f"conv:{conv}")
    item_id = safe_tag(item.get("id"))
    if item_id:
        parts.append(f"omi:{item_id}")
    return " ".join(parts)


def load_items(src: str) -> List[Dict[str, Any]]:
    """Load action items from a file path or '-' (stdin). Accepts list or {items|action_items: [...]}."""
    if src == "-":
        raw = sys.stdin.buffer.read().decode("utf-8-sig", errors="replace")
    else:
        path = Path(src)
        if not path.is_file():
            print(f"Error: file not found: {path}", file=sys.stderr)
            sys.exit(1)
        raw = path.read_text(encoding="utf-8-sig", errors="replace")
    raw = raw.strip().lstrip("﻿")
    if not raw:
        return []
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"Error: invalid JSON input: {exc}", file=sys.stderr)
        sys.exit(1)
    if isinstance(data, list):
        return [x for x in data if isinstance(x, dict)]
    if isinstance(data, dict):
        for key in ("items", "action_items"):
            if isinstance(data.get(key), list):
                return [x for x in data[key] if isinstance(x, dict)]
        return [data]
    return []


def existing_ids(lines: List[str]) -> Set[str]:
    """Collect omi:<id> tags already present in a todo.txt file."""
    found: Set[str] = set()
    for line in lines:
        m = _OMI_ID.search(line)
        if m:
            found.add(m.group(1))
    return found


def build_output(items: List[Dict[str, Any]], project: str, previous: Optional[List[str]] = None) -> List[str]:
    """Return the final list of lines; when merging, keep previous lines and append only new ids."""
    if previous is None:
        return [format_item(it, project) for it in items]
    seen = existing_ids(previous)
    out = [ln for ln in previous if ln.strip()]
    for it in items:
        iid = safe_tag(it.get("id"))
        if iid and iid in seen:
            continue
        out.append(format_item(it, project))
        if iid:
            seen.add(iid)
    return out


def main(argv: Optional[List[str]] = None) -> int:
    p = argparse.ArgumentParser(description="Convert Omi action items JSON to todo.txt lines.")
    p.add_argument("input", help="JSON file path, or '-' for stdin")
    p.add_argument("--output", "-o", type=Path, default=None, help="todo.txt path (default: stdout)")
    p.add_argument("--merge", action="store_true", help="Append only items whose omi:<id> is not already in --output")
    p.add_argument("--status", choices=["all", "open", "completed"], default="all")
    p.add_argument("--project", default="omi", help="+project tag added to every line (default: omi; '' to omit)")
    args = p.parse_args(argv)

    items = load_items(args.input)
    if args.status == "open":
        items = [i for i in items if not i.get("completed")]
    elif args.status == "completed":
        items = [i for i in items if i.get("completed")]

    previous: Optional[List[str]] = None
    if args.merge:
        if not args.output:
            print("Error: --merge requires --output", file=sys.stderr)
            return 2
        previous = args.output.read_text(encoding="utf-8").splitlines() if args.output.is_file() else []

    lines = build_output(items, args.project, previous)
    text = "\n".join(lines) + ("\n" if lines else "")

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
        print(f"Wrote {len(lines)} line(s) to {args.output}", file=sys.stderr)
    else:
        sys.stdout.buffer.write(text.encode("utf-8"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
