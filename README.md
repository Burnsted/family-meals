# Burns Family Meals

Fun, mobile-friendly week planner + grocery list for **Ted & Samantha Burns**.

Live site (GitHub Pages): **https://burnsted.github.io/family-meals/**

## What’s included

- **Week 1** (Oct 5–11) and **Week 2** (Oct 12–18), each with Option **A** / Option **B**
- Tap a day for a short pantry-first recipe
- Grocery list with checkboxes by category (Tucker lunchbox, Protein, Produce, Dairy, Pantry)
- Checks persist in `localStorage` on each phone
- **Copy share link** — encodes week + plan + checked items (+ custom items) in the URL hash
- **Copy grocery list as text** for iMessage/SMS
- Budget band (~$100–130), editable week title
- **Tucker lunchbox** = yogurt + cheese stick + pretzels/Pringles + fruit snack + beef stick + apple juice (fixed Mon–Fri kit — **not** dinner leftovers)
- **Chili** = weekend daytime cook only (football/company): Week 1 A Sat + Week 2 B Sat. Not midweek, not twice, not every week. Week 1 B and Week 2 A have no chili.
- **Fish nights** (salmon/tilapia for Samantha): labeled **Ted: leftover substitute**
- Adult leftover lunches from dinner stay optional for Ted/Samantha only
- Add custom grocery items

No login, no database, no paid services. Vanilla HTML / CSS / JS.

## Open locally

Open `index.html` in a browser, or serve the folder:

```bash
npx --yes serve .
# or: python3 -m http.server 8080
```

Clipboard “Copy share link” works best over `http://` or `https://` (or GitHub Pages). Opening as a raw `file://` still runs the app; use the share fallback or host locally if clipboard is blocked.

## Enable / refresh GitHub Pages

1. Repo **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` · folder **`/` (root)**
4. Save — site appears at https://burnsted.github.io/family-meals/

If Pages was just enabled, wait a minute for the first deploy.

## How Ted & Samantha share

1. One person sets Option A/B and checks groceries.
2. Tap **Copy share link** → text/email the link.
3. The other opens it → same plan + same checks load (and save to that phone’s localStorage).
4. For live simultaneous editing later, paste **Copy grocery list as text** into a shared note — v1 is share-link sync, not multiplayer.

## Data sources

Seeded from the Oct 5–11, 2026 week menus (Option A + Option B) and kitchen stock log hints. Meal content is not invented beyond those notes.
