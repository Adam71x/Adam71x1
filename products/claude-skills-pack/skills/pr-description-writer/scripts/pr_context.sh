#!/usr/bin/env bash
# pr_context.sh - print read-only context for writing a PR description.
# Usage: pr_context.sh [base-branch]
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "error: not inside a git repository" >&2
  exit 1
fi

base="${1:-}"
if [ -z "$base" ]; then
  if ref=$(git symbolic-ref -q --short refs/remotes/origin/HEAD 2>/dev/null); then
    base="$ref"
  else
    for cand in origin/main main origin/master master origin/develop develop; do
      if git rev-parse --verify -q "$cand" >/dev/null; then base="$cand"; break; fi
    done
  fi
fi
if [ -z "$base" ]; then
  echo "error: could not determine base branch; pass it as the first argument" >&2
  exit 1
fi

branch=$(git rev-parse --abbrev-ref HEAD)
mb=$(git merge-base "$base" HEAD)

echo "# Branch: $branch"
echo "# Base:   $base (merge-base ${mb:0:10})"
echo
echo "## Commits ($(git rev-list --count "$mb"..HEAD))"
git log --no-merges --format='- %h %s' "$mb"..HEAD
echo
echo "## Commit bodies (non-empty only)"
git log --no-merges --format='%h%n%b' "$mb"..HEAD | awk 'NF' | head -80
echo
echo "## Diffstat"
git diff --stat=120 "$mb"...HEAD | tail -n 60
echo
echo "## Changed files by top-level directory"
git diff --name-status "$mb"...HEAD | awk '{
  path=$NF; split(path, p, "/"); top=(length(p)>1)?p[1]"/":"(root)";
  print top "\t" $1 "\t" path
}' | sort
echo
echo "## Uncommitted changes (not part of the PR unless committed)"
git status --short | head -30
echo
echo "## PR templates found"
for t in .github/pull_request_template.md .github/PULL_REQUEST_TEMPLATE.md docs/pull_request_template.md pull_request_template.md; do
  [ -f "$t" ] && echo "- $t"
done
ls .github/PULL_REQUEST_TEMPLATE/*.md 2>/dev/null | sed 's/^/- /' || true
echo "(end)"
