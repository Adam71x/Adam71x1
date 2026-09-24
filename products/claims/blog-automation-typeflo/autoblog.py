#!/usr/bin/env python3
"""
autoblog.py: monthly titles -> AI articles + images -> scheduled posts on Typeflo.

Once a month, put up to 8 titles in titles.txt (one per line) and run:
    python3 autoblog.py titles.txt              # generates + schedules 2 posts/week
    python3 autoblog.py titles.txt --dry-run    # no API calls, writes preview HTML to ./out

It uses only the Python standard library. Configure it with environment variables:
    OPENAI_API_KEY       text + image generation (the client already uses ChatGPT)
    OPENAI_TEXT_MODEL    default "gpt-4.1"
    OPENAI_IMAGE_MODEL   default "gpt-image-1"
    TYPEFLO_ADMIN_URL    e.g. https://<subdomain>.typeflo.io/api/headless/admin  (Settings > Apps > custom app)
    TYPEFLO_ADMIN_KEY    Admin API key (Bearer)
    IMGBB_API_KEY        free image host, used for the embedded image URLs (Typeflo's
                         documented Admin API takes HTML content, not image uploads)
    PROMPT_FILE          optional: path to the client's existing fixed prompt ({title} placeholder)
    POST_DAYS            default "1,4": weekdays to publish (Mon=0), i.e. Tue + Fri
    POST_TIME            default "09:00 AM"
    EXTRA_IMAGES         default 2 (plus 1 featured/hero image)
    TYPEFLO_CATEGORY     optional JSON, e.g. '[{"label":"General","value":"<uuid>"}]'

Scheduling uses Typeflo's documented `scheduled` field (DD/MM/YYYY HH:MM AM/PM), so a
single monthly run queues all 8 posts. No server or cron is needed. A GitHub Actions
workflow is included for full hands-off operation.
"""
import argparse, base64, datetime as dt, html, json, os, re, sys, time, urllib.parse, urllib.request

DEFAULT_PROMPT = """Write a complete, original, SEO-friendly blog article of about 1,500 words titled "{title}".
Output clean HTML only (no <html>/<body>): <h2>/<h3> subheadings, short paragraphs, at least one
bulleted list, and a brief conclusion. Do not include the title as an <h1>. After the article, on a
new line, write: META: <a 150-character meta description>"""

IMAGE_PROMPT = ("Editorial blog illustration for an article titled \"{title}\"{focus}. Clean, modern, "
                "no text or lettering in the image, landscape composition.")


def env(name, default=None, required=False):
    v = os.environ.get(name, default)
    if required and not v:
        sys.exit(f"Missing env var {name}")
    return v


def http_json(url, payload=None, headers=None, method=None, form=None, retries=3):
    data, hdrs = None, dict(headers or {})
    if payload is not None:
        data = json.dumps(payload).encode(); hdrs["Content-Type"] = "application/json"
    elif form is not None:
        data = urllib.parse.urlencode(form).encode()
    req = urllib.request.Request(url, data=data, headers=hdrs, method=method or ("POST" if data else "GET"))
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.loads(r.read().decode() or "{}")
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")
            if e.code in (429, 500, 502, 503) and attempt < retries - 1:
                time.sleep(5 * (attempt + 1)); continue
            raise RuntimeError(f"{url} -> HTTP {e.code}: {body[:500]}")


def openai_text(title, prompt_tpl):
    r = http_json("https://api.openai.com/v1/chat/completions",
                  {"model": env("OPENAI_TEXT_MODEL", "gpt-4.1"),
                   "messages": [{"role": "user", "content": prompt_tpl.format(title=title)}]},
                  {"Authorization": f"Bearer {env('OPENAI_API_KEY', required=True)}"})
    return r["choices"][0]["message"]["content"]


def openai_image_b64(prompt):
    r = http_json("https://api.openai.com/v1/images/generations",
                  {"model": env("OPENAI_IMAGE_MODEL", "gpt-image-1"), "prompt": prompt,
                   "size": "1536x1024", "n": 1},
                  {"Authorization": f"Bearer {env('OPENAI_API_KEY', required=True)}"})
    return r["data"][0]["b64_json"]


def host_image(b64, name):
    r = http_json("https://api.imgbb.com/1/upload?key=" + env("IMGBB_API_KEY", required=True),
                  form={"image": b64, "name": name})
    return r["data"]["url"]


def split_article(raw):
    raw = re.sub(r"^```(?:html)?|```$", "", raw.strip(), flags=re.M).strip()
    m = re.search(r"^\s*META:\s*(.+)$", raw, flags=re.M)
    meta = m.group(1).strip()[:160] if m else ""
    body = raw[:m.start()].strip() if m else raw
    return body, meta


def insert_images(body, imgs, title):
    """imgs[0] = hero at top; the rest go before evenly spaced <h2> sections."""
    tag = lambda u, i: (f'<figure><img src="{u}" alt="{html.escape(title)} illustration {i}" '
                        f'loading="lazy" /></figure>')
    parts = re.split(r"(?=<h2)", body)
    if len(imgs) > 1 and len(parts) > 2:
        step = max(1, (len(parts) - 1) // len(imgs[1:]) or 1)
        for k, u in enumerate(imgs[1:]):
            idx = min(len(parts) - 1, 1 + (k + 1) * step - 1 + 1)
            parts[idx] = tag(u, k + 2) + parts[idx]
    return (tag(imgs[0], 1) if imgs else "") + "".join(parts)


def schedule_slots(n, start=None):
    days = [int(d) for d in env("POST_DAYS", "1,4").split(",")]
    t = env("POST_TIME", "09:00 AM")
    d = (start or dt.date.today()) + dt.timedelta(days=1)
    out = []
    while len(out) < n:
        if d.weekday() in days:
            out.append(d.strftime("%d/%m/%Y") + " " + t)
        d += dt.timedelta(days=1)
    return out


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:80]


def create_post(title, content, meta, when):
    post = {"title": title, "slug": slugify(title), "content": content, "excerpt": meta,
            "metatitle": title, "metadescription": meta, "toc_status": True,
            "is_draft": False, "scheduled": when}
    if env("AS_DRAFT") == "1":  # first test run: create as draft for client approval
        post.update(is_draft=True, scheduled=None)
    cat = env("TYPEFLO_CATEGORY")
    if cat:
        post["categories"] = json.loads(cat)
    base = env("TYPEFLO_ADMIN_URL", required=True).rstrip("/")
    return http_json(base + "/posts", {"postData": post},
                     {"Authorization": f"Bearer {env('TYPEFLO_ADMIN_KEY', required=True)}"})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("titles"); ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--start", help="YYYY-MM-DD; first slot is the next POST_DAY after this")
    a = ap.parse_args()
    titles = [l.strip() for l in open(a.titles, encoding="utf-8") if l.strip() and not l.startswith("#")]
    prompt_tpl = open(env("PROMPT_FILE"), encoding="utf-8").read() if env("PROMPT_FILE") else DEFAULT_PROMPT
    start = dt.date.fromisoformat(a.start) if a.start else None
    slots = schedule_slots(len(titles), start)
    os.makedirs("out", exist_ok=True)
    log = []
    for title, when in zip(titles, slots):
        print(f"[{when}] {title}")
        if a.dry_run:
            body = (f"<h2>Introduction</h2><p>(article about {html.escape(title)})</p>"
                    "<h2>Section</h2><p>...</p><h2>Section</h2><p>...</p><h2>Conclusion</h2><p>...</p>")
            meta, imgs = f"Preview meta for {title}", ["https://placehold.co/1536x1024?text=hero"] + \
                ["https://placehold.co/1536x1024?text=img"] * int(env("EXTRA_IMAGES", "2"))
        else:
            body, meta = split_article(openai_text(title, prompt_tpl))
            imgs = []
            for i in range(1 + int(env("EXTRA_IMAGES", "2"))):
                focus = "" if i == 0 else f", illustrating section {i} of the article"
                imgs.append(host_image(openai_image_b64(IMAGE_PROMPT.format(title=title, focus=focus)),
                                       f"{slugify(title)}-{i}"))
        content = insert_images(body, imgs, title)
        with open(f"out/{slugify(title)}.html", "w", encoding="utf-8") as f:
            f.write(f"<h1>{html.escape(title)}</h1>\n<!-- scheduled {when} | meta: {html.escape(meta)} -->\n{content}")
        res = {"dry_run": True} if a.dry_run else create_post(title, content, meta, when)
        log.append({"title": title, "scheduled": when, "result": res})
    with open("out/run-log.json", "w") as f:
        json.dump(log, f, indent=2)
    print(f"Done: {len(log)} posts. Log: out/run-log.json")


if __name__ == "__main__":
    main()
