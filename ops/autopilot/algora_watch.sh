#!/usr/bin/env bash
# Prints Algora bounty issues not seen before (first run seeds the list). Read-only.
set -euo pipefail
cd "$(dirname "$0")"
seen=algora_seen.txt; touch "$seen"
orgs="tscircuit projectdiscovery golemcloud zio twentyhq cal permitio"
now=$(for o in $orgs; do curl -s -m 20 -A "Mozilla/5.0" "https://algora.io/$o/bounties" | grep -oE 'https://github.com/[^"/]+/[^"/]+/issues/[0-9]+' || true; done | sort -u)
new=$(comm -13 "$seen" <(echo "$now") | sed '/^$/d')
[ -n "$new" ] && [ -s "$seen" ] && echo "$new" | sed 's/^/NEW_BOUNTY /'
printf '%s\n' "$now" | cat - "$seen" | sed '/^$/d' | sort -u > "$seen.tmp" && mv "$seen.tmp" "$seen"
echo "$(date -u +%FT%TZ) tracked=$(wc -l < "$seen") new=$(printf '%s' "$new" | grep -c . || true)"
