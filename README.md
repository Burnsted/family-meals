# Burns Family Meals

Fun, mobile-first week planner + aisle grocery checklist for **Ted & Samantha Burns**.

Live site (GitHub Pages): **https://burnsted.github.io/family-meals/**

## What’s included

- **7-day week calendar** with day notes (Ted leftover substitute on fish nights)
- **One-tap templates:** Week 1A / 1B / 2A / 2B
- **Swap a night:** Leftovers, Eat out / takeout, or another dinner from the four templates — groceries update automatically
- **Grocery checklist by aisle:** Produce, Dairy, Meat, Pantry, Frozen, Tucker lunchbox, Other
- **Have it** on staples (rice, tortillas, pasta/Alfredo, chili cans, Tucker kit) + **Hidden: N** to bring them back
- **Qty + note** on each grocery line (in copy-as-text and share link)
- **X items left** counter + hide-checked toggle (shop mode still sinks checked to the bottom when shown)
- **Shop mode:** larger taps; checked items sort to the bottom; Screen Wake Lock keeps the phone awake when supported
- **Optional $ estimates** per line + running “est. left” total
- Checks, prices, qty/notes, Have it, day swaps, custom items, and shop mode persist in `localStorage`
- **Copy share link** encodes the full state in the URL hash (old links still load)
- **Copy grocery list as text** for iMessage/SMS
- **House rules banner** always visible (sticky)
- Budget band (~$100–130), editable week title
- Add custom grocery items (with optional $)

### House rules (seeded into the app)

- **Tucker lunchbox** = yogurt + cheese stick + pretzels/Pringles + fruit snack + beef stick + apple juice (fixed Mon–Fri kit — **not** dinner leftovers). Restock midweek.
- **Adults** may leftover-lunch from dinner.
- **Chili** = weekend daytime only (football/company): Week 1 A Sat + Week 2 B Sat. Not midweek, not twice, not every week.
- **Fish nights** (salmon/tilapia for Samantha): labeled **Ted: leftover substitute**

No login, no database, no paid APIs/accounts. Vanilla HTML / CSS / JS. Original Burns UI — not a clone of any commercial meal planner.

## Open locally

```bash
npx --yes serve .
# or: python3 -m http.server 8080
```

Clipboard “Copy share link” works best over `http://` or `https://` (or GitHub Pages).

## Enable / refresh GitHub Pages

1. Repo **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` · folder **`/` (root)**
4. Save — site appears at https://burnsted.github.io/family-meals/

## How Ted & Samantha share

1. One person loads a Week template and checks groceries (optional $).
2. Tap **Copy share link** → text/email the link.
3. The other opens it → same plan + checks + prices load (and save to that phone’s localStorage).
4. In the store, turn on **Shop mode** for big taps and checked-to-bottom sorting.

## Data sources

Seeded from the Oct 5–11 / Oct 12–18, 2026 week menus (Options A + B) and kitchen stock log hints. Meal content is not invented beyond those notes.
