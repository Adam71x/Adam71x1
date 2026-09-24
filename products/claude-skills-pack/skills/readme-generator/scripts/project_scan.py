#!/usr/bin/env python3
"""project_scan.py - summarize a repository for README writing (read-only).

Usage: project_scan.py [path]
Standard library only. Never prints secret values, only variable names.
"""
import json
import os
import re
import sys

try:
    import tomllib  # Python 3.11+
except ImportError:  # pragma: no cover
    tomllib = None

SKIP_DIRS = {".git", "node_modules", "vendor", "dist", "build", ".venv", "venv", "__pycache__",
             "target", ".next", ".nuxt", "coverage", ".tox", ".mypy_cache", ".idea", ".vscode"}
EXT_LANG = {".py": "Python", ".js": "JavaScript", ".jsx": "JavaScript", ".ts": "TypeScript", ".tsx": "TypeScript",
            ".go": "Go", ".rs": "Rust", ".rb": "Ruby", ".php": "PHP", ".java": "Java", ".kt": "Kotlin",
            ".swift": "Swift", ".cs": "C#", ".cpp": "C++", ".c": "C", ".dart": "Dart", ".vue": "Vue",
            ".svelte": "Svelte", ".ex": "Elixir", ".scala": "Scala", ".sh": "Shell"}
ENV_PATTERNS = [
    re.compile(r"process\.env\.([A-Z][A-Z0-9_]+)"),
    re.compile(r"process\.env\[['\"]([A-Z][A-Z0-9_]+)['\"]\]"),
    re.compile(r"import\.meta\.env\.([A-Z][A-Z0-9_]+)"),
    re.compile(r"os\.environ(?:\.get)?\(?\[?['\"]([A-Z][A-Z0-9_]+)['\"]"),
    re.compile(r"os\.getenv\(['\"]([A-Z][A-Z0-9_]+)['\"]"),
    re.compile(r"os\.Getenv\(\"([A-Z][A-Z0-9_]+)\"\)"),
    re.compile(r"env::var\(\"([A-Z][A-Z0-9_]+)\"\)"),
    re.compile(r"ENV\[['\"]([A-Z][A-Z0-9_]+)['\"]\]"),
    re.compile(r"getenv\(['\"]([A-Z][A-Z0-9_]+)['\"]\)"),
]
MANIFESTS = ["package.json", "pyproject.toml", "requirements.txt", "setup.py", "setup.cfg", "Pipfile",
             "go.mod", "Cargo.toml", "Gemfile", "composer.json", "pom.xml", "build.gradle", "build.gradle.kts",
             "Dockerfile", "docker-compose.yml", "docker-compose.yaml", "compose.yaml", "Makefile",
             "Justfile", "Taskfile.yml", "Procfile", "vercel.json", "netlify.toml", "fly.toml", "render.yaml"]
VERSION_FILES = [".nvmrc", ".node-version", ".python-version", ".ruby-version", ".tool-versions", "runtime.txt"]


def read(path, limit=200_000):
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read(limit)
    except OSError:
        return ""


def walk(root, max_files=5000):
    count = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames
                       if d in (".github", ".circleci") or (d not in SKIP_DIRS and not d.startswith("."))]
        for fn in filenames:
            count += 1
            if count > max_files:
                return
            yield os.path.join(dirpath, fn)


def main():
    root = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
    out = {"root": root, "manifests": [], "languages": {}, "scripts": {}, "runtime_versions": {},
           "env_vars": {"from_example_files": [], "from_code": []}, "license": None, "ci": [],
           "tests": [], "existing_docs": [], "top_level": []}

    out["top_level"] = sorted(
        (e + "/" if os.path.isdir(os.path.join(root, e)) else e)
        for e in os.listdir(root) if e not in SKIP_DIRS and e != ".git")

    for m in MANIFESTS:
        if os.path.exists(os.path.join(root, m)):
            out["manifests"].append(m)
    for v in VERSION_FILES:
        p = os.path.join(root, v)
        if os.path.exists(p):
            out["runtime_versions"][v] = read(p, 500).strip()

    pj = os.path.join(root, "package.json")
    if os.path.exists(pj):
        try:
            data = json.loads(read(pj))
            out["scripts"]["npm"] = data.get("scripts", {})
            out["package"] = {k: data.get(k) for k in ("name", "description", "version", "license", "main", "bin", "engines") if data.get(k)}
            deps = list((data.get("dependencies") or {}).keys())
            out["key_dependencies"] = deps[:30]
            for lock, pm in (("pnpm-lock.yaml", "pnpm"), ("yarn.lock", "yarn"), ("bun.lockb", "bun"), ("package-lock.json", "npm")):
                if os.path.exists(os.path.join(root, lock)):
                    out["package_manager"] = pm
                    break
        except json.JSONDecodeError:
            out["scripts"]["npm"] = "package.json could not be parsed"

    pp = os.path.join(root, "pyproject.toml")
    if os.path.exists(pp) and tomllib:
        try:
            data = tomllib.loads(read(pp))
            proj = data.get("project", {}) or data.get("tool", {}).get("poetry", {})
            out["package"] = {k: proj.get(k) for k in ("name", "description", "version", "requires-python", "license") if proj.get(k)}
            if proj.get("scripts"):
                out["scripts"]["python_entry_points"] = proj["scripts"]
            tools = sorted(data.get("tool", {}).keys())
            if tools:
                out["python_tools"] = tools
        except Exception as e:  # noqa: BLE001
            out["pyproject_error"] = str(e)

    mk = os.path.join(root, "Makefile")
    if os.path.exists(mk):
        out["scripts"]["make"] = sorted(set(re.findall(r"^([a-zA-Z0-9_.-]+):(?!=)", read(mk), re.M)))

    for name in ("LICENSE", "LICENSE.md", "LICENSE.txt", "COPYING"):
        p = os.path.join(root, name)
        if os.path.exists(p):
            first = read(p, 400).strip().splitlines()
            out["license"] = {"file": name, "first_line": first[0] if first else ""}
            break

    env_example, env_code = set(), set()
    lang_count = {}
    for path in walk(root):
        rel = os.path.relpath(path, root)
        base = os.path.basename(path)
        ext = os.path.splitext(base)[1]
        if ext in EXT_LANG:
            lang_count[EXT_LANG[ext]] = lang_count.get(EXT_LANG[ext], 0) + 1
            for rx in ENV_PATTERNS:
                env_code.update(rx.findall(read(path, 100_000)))
        if base in (".env.example", ".env.sample", ".env.template", "env.example", ".env.dist"):
            for line in read(path).splitlines():
                m = re.match(r"\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=", line)
                if m:
                    env_example.add(m.group(1))
        if rel.startswith(".github/workflows/") or base in (".gitlab-ci.yml", "Jenkinsfile", "azure-pipelines.yml", "bitbucket-pipelines.yml") or rel.startswith(".circleci/"):
            out["ci"].append(rel)
        parts = rel.split(os.sep)
        if any(p in ("test", "tests", "__tests__", "spec") for p in parts[:-1]) or re.search(r"(_test\.go|\.test\.[jt]sx?|\.spec\.[jt]sx?|^test_.*\.py)$", base):
            top = parts[0] if len(parts) > 1 else rel
            if top not in out["tests"]:
                out["tests"].append(top)
        if base.lower() in ("readme.md", "contributing.md", "changelog.md") or rel.startswith("docs" + os.sep):
            out["existing_docs"].append(rel)

    out["languages"] = dict(sorted(lang_count.items(), key=lambda kv: -kv[1]))
    out["env_vars"]["from_example_files"] = sorted(env_example)
    out["env_vars"]["from_code"] = sorted(env_code - {"NODE_ENV", "PATH", "HOME"})
    out["existing_docs"] = out["existing_docs"][:30]
    print(json.dumps(out, indent=2, default=str))


if __name__ == "__main__":
    main()
