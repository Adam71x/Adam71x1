#!/usr/bin/env python3
"""git_changelog.py - group git commits into changelog sections (read-only).

Usage:
  git_changelog.py [--from REF] [--to REF] [--since DATE] [--max N] [--json]

Defaults: --from = latest tag (if any), --to = HEAD.
Standard library only.
"""
import argparse
import json
import re
import subprocess
import sys

SECTIONS = ["Breaking", "Added", "Changed", "Fixed", "Removed", "Security", "Performance", "Docs", "Internal"]

CC_RE = re.compile(r"^(?P<type>[a-zA-Z]+)(?:\((?P<scope>[^)]*)\))?(?P<bang>!)?:\s*(?P<desc>.+)$")
PR_RE = re.compile(r"(?:\(#|\s#|^#|pull request #)(\d+)")

CC_MAP = {
    "feat": "Added", "feature": "Added", "add": "Added",
    "fix": "Fixed", "bugfix": "Fixed", "hotfix": "Fixed",
    "perf": "Performance",
    "refactor": "Changed", "style": "Internal", "change": "Changed",
    "docs": "Docs", "doc": "Docs",
    "test": "Internal", "tests": "Internal", "chore": "Internal", "ci": "Internal", "build": "Internal",
    "revert": "Changed", "remove": "Removed", "security": "Security", "deps": "Internal",
}

KEYWORDS = [
    (re.compile(r"\b(cve-\d{4}-\d+|security|vulnerab|xss|csrf|injection)\b", re.I), "Security"),
    (re.compile(r"^(fix|fixes|fixed|resolve|resolves|correct|patch)\b", re.I), "Fixed"),
    (re.compile(r"\bbug\b", re.I), "Fixed"),
    (re.compile(r"^(add|adds|added|introduce|implement|new|support)\b", re.I), "Added"),
    (re.compile(r"^(remove|removes|removed|delete|drop|deprecate)\b", re.I), "Removed"),
    (re.compile(r"^(speed|optimi[sz]e|faster|perf)\b", re.I), "Performance"),
    (re.compile(r"^(doc|docs|readme)\b", re.I), "Docs"),
    (re.compile(r"^(bump|update dependency|chore|ci|lint|format|typo|wip|merge)\b", re.I), "Internal"),
    (re.compile(r"^(update|change|improve|refactor|rename|move|use)\b", re.I), "Changed"),
]

NOISE = re.compile(r"^(merge (branch|pull request|remote)|wip\b|typo|fixup!|squash!)", re.I)


def git(*args):
    return subprocess.run(["git", *args], check=True, capture_output=True, text=True).stdout


def latest_tag():
    try:
        return git("describe", "--tags", "--abbrev=0").strip() or None
    except subprocess.CalledProcessError:
        return None


def classify(subject, body):
    breaking = "BREAKING CHANGE" in body or "BREAKING-CHANGE" in body
    m = CC_RE.match(subject)
    if m:
        section = CC_MAP.get(m.group("type").lower(), "Changed")
        if m.group("bang"):
            breaking = True
        desc = m.group("desc")
        scope = m.group("scope")
    else:
        section, desc, scope = "Changed", subject, None
        for rx, sec in KEYWORDS:
            if rx.search(subject):
                section = sec
                break
    if re.search(r"\b(cve-\d{4}-\d+|security)\b", subject + " " + body, re.I):
        section = "Security"
    return ("Breaking" if breaking else section), desc, scope


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="frm")
    ap.add_argument("--to", default="HEAD")
    ap.add_argument("--since")
    ap.add_argument("--max", type=int, default=500)
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--keep-noise", action="store_true")
    a = ap.parse_args()

    try:
        git("rev-parse", "--is-inside-work-tree")
    except (subprocess.CalledProcessError, FileNotFoundError):
        sys.exit("error: not inside a git repository")

    frm = a.frm if a.frm is not None else (None if a.since else latest_tag())
    rng = f"{frm}..{a.to}" if frm else a.to
    args = ["log", "--no-merges", f"--max-count={a.max}", "--format=%H%x1f%h%x1f%an%x1f%as%x1f%s%x1f%b%x1e", rng]
    if a.since:
        args.insert(1, f"--since={a.since}")
    raw = git(*args)

    groups = {s: [] for s in SECTIONS}
    skipped = 0
    for rec in raw.split("\x1e"):
        rec = rec.strip("\n")
        if not rec:
            continue
        parts = rec.split("\x1f")
        if len(parts) < 6:
            continue
        full, short, author, date, subject, body = parts[:6]
        if NOISE.search(subject) and not a.keep_noise:
            skipped += 1
            continue
        section, desc, scope = classify(subject, body)
        prs = sorted(set(PR_RE.findall(subject + " " + body)), key=int)
        groups[section].append({
            "sha": short, "date": date, "author": author, "scope": scope,
            "description": desc[0].upper() + desc[1:] if desc else desc,
            "prs": prs, "subject": subject,
        })

    meta = {"range": rng, "since": a.since, "skipped_noise": skipped,
            "total": sum(len(v) for v in groups.values())}

    if a.json:
        print(json.dumps({"meta": meta, "groups": {k: v for k, v in groups.items() if v}}, indent=2))
        return

    print(f"# Draft changelog for {rng}" + (f" since {a.since}" if a.since else ""))
    print(f"# {meta['total']} commits grouped, {skipped} noise commits skipped. Edit before publishing.\n")
    for sec in SECTIONS:
        items = groups[sec]
        if not items:
            continue
        print(f"### {sec}")
        for it in items:
            scope = f"**{it['scope']}**: " if it["scope"] else ""
            prs = " " + " ".join(f"(#{p})" for p in it["prs"]) if it["prs"] else ""
            print(f"- {scope}{it['description']}{prs}  <!-- {it['sha']} {it['author']} {it['date']} -->")
        print()


if __name__ == "__main__":
    main()
