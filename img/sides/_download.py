#!/usr/bin/env python3
"""Download free-licensed food photos for side tiles from Wikimedia Commons."""
import json, os, re, subprocess, urllib.parse, urllib.request
from pathlib import Path

OUT = Path("/workspace/img/sides")
OUT.mkdir(parents=True, exist_ok=True)

# slug -> (search query, emoji fallback)
SIDES = {
  "green-beans": ("steamed green beans plate", "🥦"),
  "broccoli": ("broccoli cooked florets", "🥦"),
  "corn-cob": ("corn on the cob cooked", "🌽"),
  "zucchini-peppers": ("grilled zucchini peppers", "🫑"),
  "caesar-salad": ("caesar salad bowl", "🥗"),
  "carrots-ranch": ("baby carrots", "🥕"),
  "asparagus": ("asparagus cooked plate", "🌿"),
  "baked-potato": ("baked potato with skin", "🥔"),
  "sweet-potato": ("baked sweet potato", "🍠"),
  "rice": ("cooked white rice bowl", "🍚"),
  "mac-cheese": ("macaroni and cheese", "🧀"),
  "garlic-bread": ("garlic bread toast", "🍞"),
  "baked-beans": ("baked beans bowl", "🫘"),
  "pasta-salad": ("pasta salad", "🍝"),
  "tortillas": ("flour tortillas stack", "🫓"),
  "potato-salad": ("potato salad bowl", "🥔"),
  "fries": ("french fries plate", "🍟"),
  "cottage-cheese": ("cottage cheese bowl", "🥛"),
  "coleslaw": ("coleslaw salad", "🥬"),
  "chips-salsa": ("tortilla chips salsa", "🧂"),
  "fruit-cup": ("fruit salad cup", "🍓"),
  "yogurt": ("yogurt bowl", "🥛"),
  "banana-fruit": ("banana fruit", "🍌"),
  "potato-chips": ("potato chips", "🥔"),
  "side-salad": ("garden green salad", "🥗"),
  "black-beans": ("black beans cooked", "🫘"),
  "corn": ("corn kernels bowl", "🌽"),
  "potatoes": ("boiled potatoes", "🥔"),
}

UA = "FamilyMealsBot/1.0 (https://github.com/Burnsted/family-meals; educational)"

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
        "srlimit": 8,
    })
    for hit in data.get("query", {}).get("search", []):
        title = hit["title"]
        # get imageinfo + extmetadata for license
        info = api({
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|size|extmetadata|mime",
            "iiurlwidth": 480,
        })
        pages = info.get("query", {}).get("pages", {})
        for p in pages.values():
            ii = (p.get("imageinfo") or [None])[0]
            if not ii:
                continue
            meta = ii.get("extmetadata") or {}
            lic = (meta.get("LicenseShortName", {}) or {}).get("value") or ""
            lic_ok = any(x in lic.lower() for x in ["cc0", "public domain", "cc by", "cc-by", "pd"])
            # also allow cc-by-sa
            if not lic_ok and "creative commons" in ((meta.get("UsageTerms", {}) or {}).get("value") or "").lower():
                lic_ok = True
            if not lic_ok:
                # still accept common food photos with Attribution in artist — check License
                if re.search(r"cc-?by|cc0|pd|public domain", lic, re.I):
                    lic_ok = True
            if not lic_ok:
                continue
            mime = ii.get("mime") or ""
            if not mime.startswith("image/"):
                continue
            url = ii.get("thumburl") or ii.get("url")
            artist = (meta.get("Artist", {}) or {}).get("value") or "Unknown"
            # strip html from artist
            artist = re.sub(r"<[^>]+>", "", artist).strip()[:120]
            page_url = f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
            return {
                "title": title,
                "url": url,
                "license": lic or "see Commons page",
                "artist": artist,
                "page": page_url,
            }
    return None

def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())

def resize_webp(src: Path, dest: Path):
    try:
        from PIL import Image
        im = Image.open(src).convert("RGB")
        im.thumbnail((240, 240))
        # pad to square
        canvas = Image.new("RGB", (240, 240), (245, 245, 245))
        x = (240 - im.size[0]) // 2
        y = (240 - im.size[1]) // 2
        canvas.paste(im, (x, y))
        canvas.save(dest, "WEBP", quality=72, method=4)
        return True
    except Exception as e:
        print("PIL fail", e)
        # ffmpeg fallback
        subprocess.run([
            "ffmpeg", "-y", "-i", str(src),
            "-vf", "scale=240:240:force_original_aspect_ratio=decrease,pad=240:240:(ow-iw)/2:(oh-ih)/2:white",
            "-q:v", "4", str(dest.with_suffix(".jpg")),
        ], check=False, capture_output=True)
        jpg = dest.with_suffix(".jpg")
        if jpg.exists():
            jpg.rename(dest.with_suffix(".jpg"))
            return "jpg"
        return False

credits = []
mapping = {}  # slug -> filename or emoji

for slug, (query, emoji) in SIDES.items():
    webp = OUT / f"{slug}.webp"
    jpg = OUT / f"{slug}.jpg"
    if webp.exists() or jpg.exists():
        mapping[slug] = webp.name if webp.exists() else jpg.name
        print("skip existing", slug)
        continue
    print("search", slug, query)
    try:
        hit = find_file(query)
    except Exception as e:
        print("  search err", e)
        hit = None
    if not hit:
        # try simpler query
        try:
            hit = find_file(slug.replace("-", " "))
        except Exception:
            hit = None
    if not hit:
        print("  FALLBACK emoji", emoji)
        mapping[slug] = {"emoji": emoji}
        credits.append({"slug": slug, "status": "emoji-fallback", "emoji": emoji})
        continue
    raw = OUT / f"_raw_{slug}"
    try:
        download(hit["url"], raw)
        ok = resize_webp(raw, webp)
        raw.unlink(missing_ok=True)
        if ok is True and webp.exists():
            mapping[slug] = webp.name
            # shrink if >30KB
            if webp.stat().st_size > 35000:
                from PIL import Image
                im = Image.open(webp).convert("RGB")
                im.save(webp, "WEBP", quality=55, method=6)
            credits.append({
                "slug": slug,
                "file": webp.name,
                "source": hit["page"],
                "author": hit["artist"],
                "license": hit["license"],
                "bytes": webp.stat().st_size,
            })
            print("  ok", webp.name, webp.stat().st_size)
        elif jpg.exists() or (OUT / f"{slug}.jpg").exists():
            fn = f"{slug}.jpg"
            mapping[slug] = fn
            credits.append({
                "slug": slug,
                "file": fn,
                "source": hit["page"],
                "author": hit["artist"],
                "license": hit["license"],
            })
            print("  ok jpg", fn)
        else:
            print("  resize failed, emoji")
            mapping[slug] = {"emoji": emoji}
            credits.append({"slug": slug, "status": "emoji-fallback", "emoji": emoji})
    except Exception as e:
        print("  dl err", e)
        mapping[slug] = {"emoji": emoji}
        credits.append({"slug": slug, "status": "emoji-fallback", "emoji": emoji, "error": str(e)})

# Write CREDITS.md
lines = [
    "# Side photo credits",
    "",
    "Photos downloaded into this folder for the Family Meals planner. Prefer Wikimedia Commons licenses (CC0, CC BY, CC BY-SA, Public Domain).",
    "Attribution is required where the license says so — see each row.",
    "",
    "| File / slug | Author | License | Source |",
    "|---|---|---|---|",
]
for c in credits:
    if c.get("status") == "emoji-fallback":
        lines.append(f"| `{c['slug']}` (emoji {c.get('emoji','')} fallback) | — | — | no suitable photo |")
    else:
        lines.append(f"| `{c.get('file', c['slug'])}` | {c.get('author','?')} | {c.get('license','?')} | {c.get('source','')} |")
(OUT / "CREDITS.md").write_text("\n".join(lines) + "\n")

(OUT / "manifest.json").write_text(json.dumps({"mapping": mapping, "credits": credits}, indent=2))
print("DONE", len(mapping), "entries")
