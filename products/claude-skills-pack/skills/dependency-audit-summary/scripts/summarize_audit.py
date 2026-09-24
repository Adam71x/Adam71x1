#!/usr/bin/env python3
"""summarize_audit.py - normalize npm/pnpm audit and pip-audit JSON into one table.

Usage: summarize_audit.py [audit-out-dir] [--json]
Standard library only. Reads files written by run_audits.sh.
"""
import json
import os
import sys

SEV_ORDER = {"critical": 0, "high": 1, "moderate": 2, "medium": 2, "low": 3, "info": 4, "unknown": 5}


def load(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return None


def from_npm(data, tool):
    rows = []
    if not isinstance(data, dict):
        return rows
    vulns = data.get("vulnerabilities")
    if isinstance(vulns, dict):  # npm v7+
        for name, v in vulns.items():
            advisories = [x for x in v.get("via", []) if isinstance(x, dict)]
            fix = v.get("fixAvailable")
            if isinstance(fix, dict):
                fix_s = f"{fix.get('name')}@{fix.get('version')}" + (" (major)" if fix.get("isSemVerMajor") else "")
            else:
                fix_s = "yes" if fix else "no fix"
            ids = sorted({a.get("url", "").rsplit("/", 1)[-1] or str(a.get("source", "")) for a in advisories})
            rows.append({
                "tool": tool, "package": name, "installed": v.get("range", ""),
                "severity": v.get("severity", "unknown"),
                "direct": bool(v.get("isDirect")),
                "advisories": ", ".join(i for i in ids if i) or ("via " + ", ".join(x for x in v.get("via", []) if isinstance(x, str))),
                "title": advisories[0].get("title", "") if advisories else "",
                "fix": fix_s,
            })
    advisories = data.get("advisories")
    if isinstance(advisories, dict):  # npm v6 / pnpm
        for a in advisories.values():
            rows.append({
                "tool": tool, "package": a.get("module_name", ""),
                "installed": ", ".join(sorted({f.get("version", "") for f in a.get("findings", [])})),
                "severity": a.get("severity", "unknown"), "direct": None,
                "advisories": ", ".join(a.get("cves") or []) or a.get("github_advisory_id", "") or str(a.get("id", "")),
                "title": a.get("title", ""), "fix": a.get("patched_versions", ""),
            })
    return rows


def from_pip(data):
    rows = []
    deps = data.get("dependencies", data) if isinstance(data, dict) else data
    for d in deps or []:
        for v in d.get("vulns", []):
            rows.append({
                "tool": "pip-audit", "package": d.get("name"), "installed": d.get("version"),
                "severity": "unknown", "direct": None,
                "advisories": ", ".join([v.get("id", "")] + v.get("aliases", [])),
                "title": (v.get("description") or "")[:90].replace("\n", " "),
                "fix": ", ".join(v.get("fix_versions", [])) or "no fix",
            })
    return rows


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    as_json = "--json" in sys.argv
    d = args[0] if args else "audit-out"
    rows = []
    for fname, tool in (("npm-audit.json", "npm"), ("pnpm-audit.json", "pnpm"), ("yarn-audit.json", "yarn")):
        data = load(os.path.join(d, fname))
        if data:
            rows += from_npm(data, tool)
    data = load(os.path.join(d, "pip-audit.json"))
    if data:
        rows += from_pip(data)

    rows.sort(key=lambda r: (SEV_ORDER.get(str(r["severity"]).lower(), 5), r["direct"] is not True, r["package"]))
    if as_json:
        print(json.dumps(rows, indent=2))
        return
    if not rows:
        print(f"No vulnerabilities parsed from {d}/ (npm/pnpm/yarn-berry/pip-audit). Check other raw files directly.")
        return
    counts = {}
    for r in rows:
        counts[r["severity"]] = counts.get(r["severity"], 0) + 1
    print("Totals: " + ", ".join(f"{k}={v}" for k, v in sorted(counts.items(), key=lambda kv: SEV_ORDER.get(kv[0], 5))))
    print()
    print("| Severity | Package | Installed | Direct | Advisories | Fix | Title |")
    print("|---|---|---|---|---|---|---|")
    for r in rows:
        direct = {True: "yes", False: "transitive", None: "?"}[r["direct"]]
        print(f"| {r['severity']} | {r['package']} | {r['installed']} | {direct} | {r['advisories']} | {r['fix']} | {r['title']} |")


if __name__ == "__main__":
    main()
