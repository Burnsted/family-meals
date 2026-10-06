/* Have it timed suppress (Steve bar). Durations easy to replace when table updates. */
(function (root) {
  "use strict";

  /** Steve-locked defaults. Scale with qty; cap 180 days. */
  const HAVE_IT_DURATION_DAYS = {
    produce: 5,
    "fresh meat": 5,
    meat: 5,
    bread: 7,
    milk: 7,
    eggs: 7,
    dairy: 7,
    snacks: 14,
    deli: 14,
    condiments: 45,
    sauces: 45,
    spices: 60,
    oils: 60,
    foil: 60,
    lids: 60,
    wrap: 60,
    bags: 60,
    rice: 90,
    pasta: 90,
    beans: 90,
    pantry: 45,
    unknown: 14,
  };

  const MAX_DAYS = 180;

  function inferKind(item) {
    const aisle = String(item.aisle || item.category || "").toLowerCase();
    const name = String(item.name || "").toLowerCase();
    const blob = aisle + " " + name;
    if (/foil|lid|wrap|ziploc|bag|parchment/.test(blob)) {
      if (/foil|lid/.test(blob)) return /lid/.test(blob) ? "lids" : "foil";
      if (/wrap/.test(blob)) return "wrap";
      return "bags";
    }
    if (/spice|paprika|oregano|cumin|salt|pepper|season/.test(blob)) return "spices";
    if (/oil|olive oil|vinegar/.test(blob)) return "oils";
    if (/sauce|ketchup|mustard|mayo|salsa|soy|teriyaki|bbq/.test(blob)) return "sauces";
    if (/condiment/.test(blob)) return "condiments";
    if (/rice|pasta|bean|lentil|oat|flour|dry/.test(blob)) {
      if (/rice/.test(blob)) return "rice";
      if (/pasta|noodle/.test(blob)) return "pasta";
      if (/bean|lentil/.test(blob)) return "beans";
      return "rice";
    }
    if (/chip|cracker|snack|cookie|pretzel/.test(blob)) return "snacks";
    if (/deli|lunch meat|ham|turkey slices/.test(blob)) return "deli";
    if (/bread|tortilla|bun|roll/.test(blob) || aisle === "bread") return "bread";
    if (/milk|cream|half/.test(name) || (/dairy/.test(aisle) && /milk/.test(name))) return "milk";
    if (/egg/.test(name)) return "eggs";
    if (/dairy|cheese|yogurt|butter/.test(aisle) || /yogurt|cheese|butter/.test(name)) return "dairy";
    if (/meat|chicken|beef|pork|turkey|fish|salmon|shrimp/.test(aisle + name) && !/bean/.test(name))
      return "fresh meat";
    if (/produce|fruit|veg|salad|lettuce|carrot|potato|onion|pepper|lemon|garlic|broccoli|spinach/.test(blob))
      return "produce";
    if (/pantry|canned|broth|stock/.test(aisle)) return "pantry";
    return "unknown";
  }

  function parseQtyFactor(qty) {
    if (qty == null || qty === "") return 1;
    const s = String(qty);
    const n = parseFloat(s.replace(/[^0-9.]/g, " ").trim().split(/\s+/)[0]);
    if (!isFinite(n) || n <= 1) return 1;
    // Mild scale: 2 units ~1.2x, 10+ ~2x
    return Math.min(2.5, 1 + Math.log10(n) * 0.85);
  }

  function daysForItem(item) {
    const kind = inferKind(item);
    const base = HAVE_IT_DURATION_DAYS[kind] != null ? HAVE_IT_DURATION_DAYS[kind] : HAVE_IT_DURATION_DAYS.unknown;
    const factor = parseQtyFactor(item.qty);
    return Math.min(MAX_DAYS, Math.max(1, Math.round(base * factor)));
  }

  function formatBackHint(untilMs, days) {
    const until = new Date(untilMs);
    if (days >= 14) {
      const weeks = Math.round(days / 7);
      if (weeks >= 1) {
        return weeks === 1 ? "Back in 1 week" : "Back in " + weeks + " weeks";
      }
    }
    const label = until.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return "Back " + label;
  }

  function markHaveIt(store, id, item, now) {
    now = now || Date.now();
    const days = daysForItem(item || {});
    const until = now + days * 86400000;
    if (!store || typeof store !== "object") return null;
    store[id] = {
      haveItUntil: until,
      haveItDays: days,
      haveItLabel: formatBackHint(until, days),
      kind: inferKind(item || {}),
    };
    return store[id];
  }

  function clearHaveIt(store, id) {
    if (store && id in store) delete store[id];
  }

  function isSuppressed(entry, now) {
    now = now || Date.now();
    if (!entry) return false;
    const until = typeof entry === "number" ? entry : entry.haveItUntil;
    return !!(until && until > now);
  }

  function entryHint(entry) {
    if (!entry) return "";
    if (entry.haveItLabel) return entry.haveItLabel;
    if (entry.haveItUntil && entry.haveItDays != null) {
      return formatBackHint(entry.haveItUntil, entry.haveItDays);
    }
    return "";
  }

  /** Migrate legacy boolean / Set style to timed entries (expired immediately → clear). */
  function normalizeStore(raw) {
    const out = {};
    if (!raw) return out;
    if (Array.isArray(raw)) {
      raw.forEach((id) => {
        out[id] = { haveItUntil: Date.now() - 1, haveItDays: 0, haveItLabel: "" };
      });
      return out;
    }
    Object.keys(raw).forEach((id) => {
      const v = raw[id];
      if (v === true) {
        // Legacy permanent → treat as 14d from now (unknown) so it can expire
        const days = HAVE_IT_DURATION_DAYS.unknown;
        const until = Date.now() + days * 86400000;
        out[id] = { haveItUntil: until, haveItDays: days, haveItLabel: formatBackHint(until, days), kind: "unknown" };
      } else if (v && typeof v === "object" && v.haveItUntil) {
        out[id] = {
          haveItUntil: Number(v.haveItUntil),
          haveItDays: Number(v.haveItDays) || 14,
          haveItLabel: v.haveItLabel || formatBackHint(Number(v.haveItUntil), Number(v.haveItDays) || 14),
          kind: v.kind || "unknown",
        };
      } else if (typeof v === "number") {
        out[id] = { haveItUntil: v, haveItDays: 14, haveItLabel: formatBackHint(v, 14) };
      }
    });
    return out;
  }

  function pruneExpired(store, now) {
    now = now || Date.now();
    Object.keys(store || {}).forEach((id) => {
      if (!isSuppressed(store[id], now)) delete store[id];
    });
    return store;
  }

  root.HaveItTimed = {
    HAVE_IT_DURATION_DAYS: HAVE_IT_DURATION_DAYS,
    MAX_DAYS: MAX_DAYS,
    inferKind: inferKind,
    daysForItem: daysForItem,
    formatBackHint: formatBackHint,
    markHaveIt: markHaveIt,
    clearHaveIt: clearHaveIt,
    isSuppressed: isSuppressed,
    entryHint: entryHint,
    normalizeStore: normalizeStore,
    pruneExpired: pruneExpired,
  };
})(typeof window !== "undefined" ? window : globalThis);
