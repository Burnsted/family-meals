/* Item alt maps (Steve lock). Chevron only when mapped. Single-select. */
(function (root) {
  "use strict";

  /** Meat groups — locked. Keys are canonical labels; values exclude self when resolving. */
  const MEAT_GROUPS = {
    Bacon: ["Turkey bacon", "Ham", "Breakfast sausage", "Canadian bacon", "Skip meat"],
    "Beef patty": ["Turkey patty", "Chicken patty", "Plant patty", "Sirloin tips", "Skip meat"],
    Sirloin: ["Filet", "Ribeye", "NY strip", "Flank", "Ground beef", "Skip meat"],
    "Chicken breast": ["Chicken thighs", "Rotisserie chicken", "Turkey breast", "Pork tenderloin", "Skip meat"],
    "Chicken thighs": ["Chicken breast", "Rotisserie chicken", "Turkey thighs", "Skip meat"],
    "Ground beef": ["Ground turkey", "Ground chicken", "Beef patty", "Skip meat"],
    Salmon: ["Tilapia", "Cod", "Shrimp"],
    Tilapia: ["Salmon", "Cod", "Shrimp"],
    Cod: ["Salmon", "Tilapia", "Shrimp"],
    Shrimp: ["Salmon", "Tilapia", "Cod"],
    // Steak cuts (Steve)
    Filet: ["Sirloin", "Ribeye", "NY strip", "Flat iron", "Chuck eye", "Skip meat"],
    Ribeye: ["Sirloin", "Filet", "NY strip", "Flat iron", "Chuck eye", "Skip meat"],
    "NY strip": ["Sirloin", "Filet", "Ribeye", "Flat iron", "Chuck eye", "Skip meat"],
    "Flat iron": ["Sirloin", "Filet", "Ribeye", "NY strip", "Chuck eye", "Skip meat"],
    "Chuck eye": ["Sirloin", "Filet", "Ribeye", "NY strip", "Flat iron", "Skip meat"],
  };

  /** Non-meat scaffold — Steve locked lists. */
  const NON_MEAT_GROUPS = {
    Milk: ["Whole milk", "2% milk", "Skim milk", "Oat milk", "Almond milk", "Lactose-free milk"],
    Eggs: ["Large eggs", "Egg whites", "Liquid egg"],
    Butter: ["Butter", "Plant butter", "Olive oil"],
    Cheese: ["Cheddar", "Mozzarella", "Swiss", "Pepper jack", "Dairy-free shreds"],
    Yogurt: ["Greek plain", "Vanilla yogurt", "Dairy-free yogurt"],
    Bread: ["Sandwich bread", "Tortillas", "Bagels", "English muffins", "Lettuce wraps"],
    Rice: ["White rice", "Brown rice", "Microwave rice cup", "Cauliflower rice", "Quinoa"],
    Pasta: ["Spaghetti", "Penne", "Gluten-free pasta", "Zucchini noodles"],
    "Salad greens": ["Salad mix", "Spinach", "Romaine", "Kale"],
    Tomato: ["Tomatoes", "Cherry tomatoes", "Diced canned (no salt added)"],
    Onion: ["Yellow onion", "Red onion", "Green onion", "Shallot"],
    Potato: ["Russet", "Baby potatoes", "Sweet potato", "Steam-bag potatoes"],
    Chips: ["Potato chips", "Tortilla chips", "Pretzels", "Popcorn"],
    Chocolate: ["Chocolate bar", "Chocolate chips", "Cookies"],
  };

  const FISH_KEYS = new Set(["Salmon", "Tilapia", "Cod", "Shrimp"]);

  const ALIAS = [
    [/bacon/i, "Bacon"],
    [/beef patty|hamburger|burger patty|80\/20/i, "Beef patty"],
    [/sirloin/i, "Sirloin"],
    [/filet|fillet mignon/i, "Filet"],
    [/ribeye|rib eye/i, "Ribeye"],
    [/ny strip|new york strip|strip steak/i, "NY strip"],
    [/flat iron/i, "Flat iron"],
    [/chuck eye/i, "Chuck eye"],
    [/chicken breast|chicken breasts/i, "Chicken breast"],
    [/chicken thigh/i, "Chicken thighs"],
    [/ground beef|burger beef/i, "Ground beef"],
    [/salmon/i, "Salmon"],
    [/tilapia/i, "Tilapia"],
    [/\bcod\b/i, "Cod"],
    [/shrimp/i, "Shrimp"],
    [/almond milk|oat milk|lactose|2%\s*milk|skim milk|whole milk|\bmilk\b/i, "Milk"],
    [/egg white|liquid egg|\beggs?\b/i, "Eggs"],
    [/plant butter|\bbutter\b|olive oil/i, "Butter"],
    [/cheddar|mozzarella|swiss|pepper jack|dairy-free shred|\bcheese\b/i, "Cheese"],
    [/yogurt|greek plain/i, "Yogurt"],
    [/sandwich bread|english muffin|bagel|tortilla|lettuce wrap|\bbread\b/i, "Bread"],
    [/cauliflower rice|microwave rice|brown rice|white rice|quinoa|\brice\b/i, "Rice"],
    [/zucchini noodle|gluten-free pasta|spaghetti|penne|\bpasta\b/i, "Pasta"],
    [/salad mix|salad green|romaine|\bkale\b|\bspinach\b/i, "Salad greens"],
    [/cherry tomato|diced canned|\btomatoes?\b/i, "Tomato"],
    [/yellow onion|red onion|green onion|shallot|\bonions?\b/i, "Onion"],
    [/sweet potato|baby potato|russet|steam-bag|\bpotatoes?\b/i, "Potato"],
    [/potato chip|tortilla chip|pretzel|popcorn|\bchips?\b/i, "Chips"],
    [/chocolate chip|chocolate bar|\bcookies?\b|\bchocolate\b/i, "Chocolate"],
  ];

  function resolveGroupKey(name) {
    const s = String(name || "").trim();
    if (!s) return null;
    if (MEAT_GROUPS[s] || NON_MEAT_GROUPS[s]) return s;
    for (let i = 0; i < ALIAS.length; i++) {
      if (ALIAS[i][0].test(s)) return ALIAS[i][1];
    }
    return null;
  }

  function isFishNight(nameOrKey) {
    const k = resolveGroupKey(nameOrKey) || nameOrKey;
    return FISH_KEYS.has(k);
  }

  function altsFor(name, opts) {
    opts = opts || {};
    const key = resolveGroupKey(name);
    if (!key) return [];
    const meat = MEAT_GROUPS[key];
    const non = NON_MEAT_GROUPS[key];
    let list = meat || non || [];
    if (!list.length) return [];
    // Fish nights: never push beef into fish
    if (opts.fishOnly || isFishNight(key)) {
      if (!FISH_KEYS.has(key)) return [];
      list = list.filter((x) => FISH_KEYS.has(resolveGroupKey(x) || x) || /salmon|tilapia|cod|shrimp/i.test(x));
    }
    const cur = String(name || "").trim().toLowerCase();
    const keyLower = key.toLowerCase();
    return list.filter((x) => {
      const xl = x.toLowerCase();
      return xl !== cur && xl !== keyLower;
    });
  }

  function hasAlts(name, opts) {
    return altsFor(name, opts).length > 0;
  }

  /** Nearest meat for unknown day-card proteins. */
  function nearestMeatKey(name) {
    const k = resolveGroupKey(name);
    if (k && MEAT_GROUPS[k]) return k;
    const s = String(name || "").toLowerCase();
    if (/fish|salmon|tilapia|cod|shrimp|tuna/.test(s)) return "Salmon";
    if (/beef|steak|sirloin|burger|ground/.test(s)) return "Ground beef";
    if (/pork|chop|bacon|ham|sausage/.test(s)) return "Bacon";
    if (/turkey/.test(s)) return "Chicken breast";
    if (/chicken|poultry/.test(s)) return "Chicken breast";
    return "Chicken breast";
  }

  function meatAltsForDay(proteinName, dinnerName) {
    const blob = (proteinName || "") + " " + (dinnerName || "");
    if (/fish|salmon|tilapia|cod|shrimp/i.test(blob) && !/chicken|beef|pork|steak/i.test(proteinName || "")) {
      const k = resolveGroupKey(proteinName) || (/tilapia/i.test(blob) ? "Tilapia" : /cod/i.test(blob) ? "Cod" : /shrimp/i.test(blob) ? "Shrimp" : "Salmon");
      return { key: k, current: proteinName || k, alts: altsFor(k, { fishOnly: true }), fish: true };
    }
    const key = nearestMeatKey(proteinName || dinnerName || "");
    const current = proteinName || key;
    return { key: key, current: current, alts: altsFor(current), fish: false };
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Cameron-style bubble HTML (single-select). */
  function bubbleHTML(title, opts, current, large) {
    const cls = large ? "item-alt-pop is-large" : "item-alt-pop";
    return `<div class="${cls}" role="listbox" aria-label="${esc(title)}">
      <p class="item-alt-ph2">${esc(title)}</p>
      <div class="item-alt-opts">${(opts || [])
        .map(
          (v) =>
            `<button type="button" class="item-alt-popt${v === current ? " sel" : ""}" data-alt="${esc(v)}" role="option">${esc(v)}</button>`
        )
        .join("")}
      </div>
    </div>`;
  }

  function chevronHTML(label, large) {
    const cls = large ? "item-alt-chip is-large" : "item-alt-chip";
    return `<button type="button" class="${cls}" data-alt-open="1" aria-haspopup="listbox" aria-expanded="false">
      <span class="item-alt-lab">${esc(label)}</span><span class="item-alt-chev" aria-hidden="true">▾</span>
    </button>`;
  }

  root.ItemAlts = {
    MEAT_GROUPS: MEAT_GROUPS,
    NON_MEAT_GROUPS: NON_MEAT_GROUPS,
    resolveGroupKey: resolveGroupKey,
    isFishNight: isFishNight,
    altsFor: altsFor,
    hasAlts: hasAlts,
    nearestMeatKey: nearestMeatKey,
    meatAltsForDay: meatAltsForDay,
    bubbleHTML: bubbleHTML,
    chevronHTML: chevronHTML,
  };
})(typeof window !== "undefined" ? window : globalThis);
