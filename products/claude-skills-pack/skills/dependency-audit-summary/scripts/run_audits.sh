#!/usr/bin/env bash
# run_audits.sh - detect ecosystems and run installed audit tools (never installs or modifies deps).
# Usage: run_audits.sh [output-dir]   (default: ./audit-out)
set -uo pipefail

out="${1:-audit-out}"
mkdir -p "$out"
ran=(); missing=(); skipped=()

have() { command -v "$1" >/dev/null 2>&1; }
run() { # name, outfile, cmd...
  local name="$1" file="$2"; shift 2
  echo ">> $name: $*"
  "$@" >"$out/$file" 2>"$out/$file.stderr"
  local rc=$?
  # audit tools exit non-zero when vulnerabilities are found; that is not a failure
  if [ -s "$out/$file" ]; then ran+=("$name -> $out/$file (exit $rc)"); else skipped+=("$name produced no output (exit $rc), see $out/$file.stderr"); fi
}

# JavaScript / TypeScript
if [ -f pnpm-lock.yaml ]; then
  if have pnpm; then run "pnpm audit" pnpm-audit.json pnpm audit --json; else missing+=("pnpm (npm i -g pnpm)"); fi
elif [ -f yarn.lock ]; then
  if have yarn; then
    if yarn --version 2>/dev/null | grep -q '^1\.'; then run "yarn audit" yarn-audit.jsonl yarn audit --json
    else run "yarn npm audit" yarn-audit.json yarn npm audit --json --recursive; fi
  else missing+=("yarn (corepack enable)"); fi
elif [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
  if have npm; then run "npm audit" npm-audit.json npm audit --json; run "npm outdated" npm-outdated.json npm outdated --json
  else missing+=("npm (install Node.js)"); fi
elif [ -f package.json ]; then
  skipped+=("package.json found but no lockfile: audits need a lockfile (npm install --package-lock-only)")
fi

# Python
if ls requirements*.txt pyproject.toml Pipfile.lock poetry.lock uv.lock >/dev/null 2>&1; then
  if have pip-audit; then
    if ls requirements*.txt >/dev/null 2>&1; then
      args=(); for r in requirements*.txt; do args+=(-r "$r"); done
      run "pip-audit" pip-audit.json pip-audit "${args[@]}" -f json --progress-spinner off
    else
      run "pip-audit (current env)" pip-audit.json pip-audit -f json --progress-spinner off
    fi
  else missing+=("pip-audit (pipx install pip-audit)"); fi
fi

# Rust
if [ -f Cargo.lock ]; then
  if have cargo-audit || cargo audit --version >/dev/null 2>&1; then run "cargo audit" cargo-audit.json cargo audit --json
  else missing+=("cargo-audit (cargo install cargo-audit)"); fi
fi

# Go
if [ -f go.mod ]; then
  if have govulncheck; then run "govulncheck" govulncheck.json govulncheck -json ./...
  else missing+=("govulncheck (go install golang.org/x/vuln/cmd/govulncheck@latest)"); fi
fi

# Ruby
if [ -f Gemfile.lock ]; then
  if have bundle-audit; then run "bundle-audit" bundle-audit.json bundle-audit check --update --format json
  else missing+=("bundler-audit (gem install bundler-audit)"); fi
fi

# PHP
if [ -f composer.lock ]; then
  if have composer; then run "composer audit" composer-audit.json composer audit --format=json
  else missing+=("composer (getcomposer.org)"); fi
fi

echo
echo "== Ran"; for r in "${ran[@]:-}"; do [ -n "$r" ] && echo "- $r"; done
echo "== Missing tools (not installed, ecosystem present)"; for m in "${missing[@]:-}"; do [ -n "$m" ] && echo "- $m"; done
echo "== Skipped"; for s in "${skipped[@]:-}"; do [ -n "$s" ] && echo "- $s"; done
[ ${#ran[@]} -eq 0 ] && [ ${#missing[@]} -eq 0 ] && [ ${#skipped[@]} -eq 0 ] && echo "No supported lockfiles/manifests detected in $(pwd)."
exit 0
