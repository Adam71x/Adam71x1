"""Link checker for BasedAgents task task_wc7WkksHaWUTIykiVUSeH (Quillforge Studio, AI-assisted).
First hops only, GET, <=1 req/s per host, retry once after pause before calling broken."""
import json, re, time, urllib.request, urllib.error, ssl, html, datetime as dt
from urllib.parse import urljoin, urlparse
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36"
SOURCES = {"llms.txt": "https://basedagents.ai/llms.txt",
           "docs/agents": "https://basedagents.ai/docs/agents",
           "agent.json": "https://basedagents.ai/.well-known/agent.json"}
last = {}
def get(url):
    h = urlparse(url).netloc
    w = 1.05 - (time.time() - last.get(h, 0))
    if w > 0: time.sleep(w)
    last[h] = time.time()
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        r = urllib.request.urlopen(req, timeout=20)
        return r.status, r.geturl(), r.read(), None
    except urllib.error.HTTPError as e:
        return e.code, e.geturl() or url, b"", f"HTTP {e.code}"
    except Exception as e:
        return None, url, b"", f"{type(e).__name__}: {e}"
found, skipped = {}, []
def add(u, src):
    if u.startswith("mailto:") or u.startswith("#"):
        skipped.append({"value": u, "found_in": src}); return
    found.setdefault(u, set()).add(src)
for name, url in SOURCES.items():
    st, fu, body, err = get(url)
    txt = body.decode("utf-8", "replace")
    if name == "llms.txt":
        for u in re.findall(r"https?://[^\s)\]>\"'`]+", txt): add(u.rstrip(".,;"), name)
    elif name == "docs/agents":
        for u in re.findall(r'href="([^"]+)"', txt):
            u = html.unescape(u)
            if u.startswith("#") or u.startswith("mailto:"): add(u, name); continue
            add(urljoin(url, u), name)
    else:
        def walk(o):
            if isinstance(o, dict): [walk(v) for v in o.values()]
            elif isinstance(o, list): [walk(v) for v in o]
            elif isinstance(o, str) and re.match(r"https?://", o): add(o, name)
        walk(json.loads(txt))
TEMPLATE = re.compile(r"(/:[a-z_]+|<[^>]+>|%3C|\{[^}]+\})", re.I)
BLOCKY = ("x.com", "twitter.com", "linkedin.com")
results = []
for u in sorted(found):
    rec = {"url": u, "found_in": sorted(found[u])}
    if TEMPLATE.search(u):
        rec.update(status=None, final_url=None, result="template", note="placeholder, not requested"); results.append(rec); continue
    st, fu, _, err = get(u)
    ok = st is not None and st < 400
    if not ok:
        time.sleep(3); st2, fu2, _, err2 = get(u)
        if st2 is not None and st2 < 400: st, fu, err, ok = st2, fu2, None, True
        else: rec["note"] = f"try1: {err or st}; try2: {err2 or st2}"; st, fu = st2, fu2
    rec.update(status=st, final_url=fu)
    if ok: rec["result"] = "ok"
    elif st in (401, 403, 429) and any(b in urlparse(u).netloc for b in BLOCKY) or st in (401, 403, 429): rec["result"] = "blocked"
    else: rec["result"] = "broken"
    results.append(rec)
out = {"checked_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
       "sources": SOURCES, "results": results, "skipped": skipped,
       "summary": {k: sum(r["result"] == k for r in results) for k in ("ok", "broken", "blocked", "template")},
       "commands_run": ["python3 linkcheck.py (GET only, first hop, 1 req/s/host, 1 retry after 3s)"],
       "prepared_by": "Quillforge Studio (AI-assisted): generated and run by an AI agent, reviewed before delivery"}
json.dump(out, open("linkcheck-report.json", "w"), indent=2)
print(json.dumps(out["summary"]))
for r in results:
    if r["result"] != "ok": print(r)
