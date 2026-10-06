#!/usr/bin/env python3
"""Download free-licensed meal + Tucker product photos for week-board (Ted photo-real bar)."""
import json, re, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path("/workspace/draft-week-art/img")
MEALS = ROOT / "meals"
TUCKER = ROOT / "tucker"
MEALS.mkdir(parents=True, exist_ok=True)
TUCKER.mkdir(parents=True, exist_ok=True)

UA = "FamilyMealsBot/1.0 (https://github.com/Burnsted/family-meals; educational)"

MEAL_QUERIES = {
    "chicken": "rotisserie chicken plated",
    "rotisserie": "rotisserie chicken whole",
    "taco": "beef tacos plate",
    "chili": "bowl of chili with cheese",
    "fish": "baked salmon fillet plate",
    "salmon": "grilled salmon dinner plate",
    "pasta": "chicken alfredo pasta plate",
    "alfredo": "fettuccine alfredo plate",
    "eggs": "breakfast eggs plate",
    "breakfast": "pancakes breakfast plate",
    "burger": "cheeseburger plate",
    "steak": "grilled steak plate",
    "meat": "grilled steak dinner",
    "soup": "chicken soup bowl",
    "salad": "dinner salad bowl",
    "rice": "chicken rice bowl",
    "burrito": "burrito plate",
    "quesadilla": "cheese quesadilla plate",
    "cheese": "cheese quesadilla",
    "pizza": "pepperoni pizza",
    "sandwich": "chicken sandwich plate",
    "sausage": "sausage sheet pan dinner",
    "potato": "baked potato dinner",
    "pie": "shepherd pie plate",
    "shrimp": "shrimp scampi plate",
    "leftover": "leftover meal containers",
    "light": "yogurt fruit breakfast bowl",
    "default": "home cooked dinner plate",
    "grill": "barbecue grilled meat plate",
    "pepper": "stuffed peppers plate",
}

TUCKER_QUERIES = {
    "yogurt": "yogurt cup grocery",
    "cheese": "string cheese stick package",
    "chips": "pringles can",
    "fruit": "fruit snacks pouch",
    "beef": "beef jerky stick",
    "juice": "apple juice box",
}

def api(params):
    q = urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(
        f"https://commons.wikimedia.org/w/api.php?{q}",
        headers={"User-Agent": UA},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def find_file(query):
    data = api({
        "action": "query",
        "list": "search",
        "srsearch": f"{query} filetype:bitmap",
        "srnamespace": 6,
        "srlimit": 10,
    })
    for hit in data.get("query", {}).get("search", []):
        title = hit["title"]
        info = api({
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|size|extmetadata|mime",
            "iiurlwidth": 640,
        })
        for p in (info.get("query", {}).get("pages") or {}).values():
            ii = (p.get("imageinfo") or [None])[0]
            if not ii:
                continue
            meta = ii.get("extmetadata") or {}
            lic = (meta.get("LicenseShortName", {}) or {}).get("value") or ""
            usage = (meta.get("UsageTerms", {}) or {}).get("value") or ""
            lic_l = lic.lower()
            ok = any(x in lic_l for x in ["cc0", "public domain", "cc by", "cc-by", "pd"])
            if not ok and "creative commons" in usage.lower():
                ok = True
            if not ok and re.search(r"cc-?by|cc0|pd|public domain", lic, re.I):
                ok = True
            if not ok:
                continue
            mime = ii.get("mime") or ""
            if not mime.startswith("image/"):
                continue
            url = ii.get("thumburl") or ii.get("url")
            artist = re.sub(r"<[^>]+>", "", (meta.get("Artist", {}) or {}).get("value") or "Unknown").strip()[:120]
            page = f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
            return {"title": title, "url": url, "license": lic or "see Commons", "artist": artist, "page": page}
    return None

def download(url, dest: Path):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())

def to_square_webp(src: Path, dest: Path, size=480):
    im = Image.open(src).convert("RGB")
    # center-crop to square then resize (appetizing consistent crop)
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    im = im.crop((left, top, left + side, top + side)).resize((size, size), Image.LANCZOS)
    im.save(dest, "WEBP", quality=70, method=4)
    if dest.stat().st_size > 90000:
        im.save(dest, "WEBP", quality=55, method=6)

def fetch_set(queries, out_dir: Path, label: str):
    credits = []
    mapping = {}
    for slug, query in queries.items():
        dest = out_dir / f"{slug}.webp"
        if dest.exists() and dest.stat().st_size > 2000:
            mapping[slug] = dest.name
            print("skip", label, slug)
            continue
        print("search", label, slug, query)
        hit = None
        try:
            hit = find_file(query)
        except Exception as e:
            print("  err", e)
        if not hit:
            try:
                hit = find_file(slug.replace("-", " "))
            except Exception:
                hit = None
        if not hit:
            print("  MISS", slug)
            credits.append({"slug": slug, "status": "miss"})
            continue
        raw = out_dir / f"_raw_{slug}"
        try:
            download(hit["url"], raw)
            to_square_webp(raw, dest)
            raw.unlink(missing_ok=True)
            mapping[slug] = dest.name
            credits.append({
                "slug": slug,
                "file": dest.name,
                "source": hit["page"],
                "author": hit["artist"],
                "license": hit["license"],
                "bytes": dest.stat().st_size,
            })
            print("  ok", dest.name, dest.stat().st_size)
        except Exception as e:
            print("  dl fail", e)
            raw.unlink(missing_ok=True)
            credits.append({"slug": slug, "status": "fail", "error": str(e)})
    (out_dir / "manifest.json").write_text(json.dumps({"mapping": mapping, "credits": credits}, indent=2))
    lines = [
        f"# {label} photo credits",
        "",
        "Wikimedia Commons photos for draft-week-art week board (photo-real craft).",
        "",
        "| File | Author | License | Source |",
        "|---|---|---|---|",
    ]
    for c in credits:
        if c.get("status"):
            lines.append(f"| `{c['slug']}` | — | — | {c.get('status')} |")
        else:
            lines.append(f"| `{c.get('file')}` | {c.get('author','?')} | {c.get('license','?')} | {c.get('source','')} |")
    (out_dir / "CREDITS.md").write_text("\n".join(lines) + "\n")
    return mapping

m = fetch_set(MEAL_QUERIES, MEALS, "Meal")
t = fetch_set(TUCKER_QUERIES, TUCKER, "Tucker")
print("MEALS", len(m), "TUCKER", len(t))
