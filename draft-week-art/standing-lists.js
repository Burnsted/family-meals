/* Standing grocery catalogs (Steve lock). Opt-in only — never Generate-injected. */
(function (root) {
  "use strict";

  const STOCK_PRODUCE = [
    "Bananas",
    "Apples",
    "Grapes",
    "Berries",
    "Salad mix",
    "Spinach",
    "Broccoli",
    "Carrots",
    "Celery",
    "Cucumbers",
    "Tomatoes",
    "Onions",
    "Garlic",
    "Potatoes",
    "Sweet potatoes",
    "Avocados",
    "Lemons",
    "Limes",
    "Jalapeños",
  ];

  const MUNCHIES = [
    "Potato chips",
    "Tortilla chips",
    "Pretzels",
    "Popcorn",
    "Chocolate bar",
    "Cookies",
    "Crackers",
    "Trail mix",
    "Gummies",
    "Ice cream bars",
    "Protein bar",
    "Salsa and chips",
  ];

  const SECTION = {
    MENU: "Menu for this week",
    MENU_EXTRAS: "Menu extras",
    STOCK: "Stock produce",
    MUNCHIES: "Miscellaneous munchies",
  };

  const SECTION_ORDER = [SECTION.MENU, SECTION.STOCK, SECTION.MUNCHIES, SECTION.MENU_EXTRAS];

  function slug(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48);
  }

  function stockId(name) {
    return "stock:" + slug(name);
  }
  function munchId(name) {
    return "munch:" + slug(name);
  }

  function normalizeStandingItems(arr, kind) {
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.name === "string" && x.name.trim())
      .map((x, i) => ({
        id: typeof x.id === "string" ? x.id : (kind === "munch" ? munchId(x.name) : stockId(x.name)) + "-" + i,
        name: String(x.name).trim().slice(0, 80),
        qty: typeof x.qty === "string" ? x.qty.slice(0, 40) : x.qty != null ? String(x.qty).slice(0, 40) : "1",
        price: x.price != null && isFinite(Number(x.price)) ? Math.round(Number(x.price) * 100) / 100 : null,
        section: kind === "munch" ? SECTION.MUNCHIES : SECTION.STOCK,
        standing: true,
        kind: kind,
      }))
      .slice(0, 80);
  }

  root.StandingLists = {
    STOCK_PRODUCE: STOCK_PRODUCE,
    MUNCHIES: MUNCHIES,
    SECTION: SECTION,
    SECTION_ORDER: SECTION_ORDER,
    slug: slug,
    stockId: stockId,
    munchId: munchId,
    normalizeStandingItems: normalizeStandingItems,
  };
})(typeof window !== "undefined" ? window : globalThis);
