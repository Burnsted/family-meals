/* Photo-real food art for draft-week-art week boards (Ted photo-real lock). */
(function (root) {
  "use strict";

  function detectBase() {
    try {
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src || "";
        if (/food-art\.js/.test(src)) {
          return src.replace(/food-art\.js(\?.*)?$/, "");
        }
      }
    } catch (_) {}
    try {
      // Pages + local: always resolve to …/draft-week-art/
      const path = String(location.pathname || "");
      const m = path.match(/^(.*\/draft-week-art\/)/);
      if (m) return location.origin + m[1];
      if (/\/kathy\/?$/.test(path)) {
        return location.origin + path.replace(/\/kathy\/?$/, "/");
      }
      const dir = path.replace(/\/[^/]*$/, "/");
      return location.origin + dir;
    } catch (_) {}
    return "";
  }

  const BASE = detectBase();
  const MEAL_DIR = BASE + "img/meals/";
  const TUCKER_DIR = BASE + "img/tucker/";
  const SIDE_DIR = BASE + "img/sides/";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Map meal text → photo key. Dish cues first so leftovers stay diverse. */
  function keyFromText(text) {
    const t = String(text || "").toLowerCase();
    if (/rotisserie/.test(t)) return "rotisserie";
    if (/taco/.test(t)) return "taco";
    if (/chili/.test(t)) return "chili";
    if (/alfredo/.test(t)) return "alfredo";
    if (/salmon/.test(t)) return "salmon";
    if (/tilapia|white fish|fish|tuna/.test(t)) return "fish";
    if (/shrimp|scampi/.test(t)) return "shrimp";
    if (/breakfast|pancake/.test(t)) return "breakfast";
    if (/egg\b|egg bake|scrambled/.test(t)) return "eggs";
    if (/pasta|lasagna|noodle/.test(t)) return "pasta";
    if (/salad/.test(t)) return "salad";
    if (/pie|shepherd/.test(t)) return "pie";
    if (/burrito|wrap/.test(t)) return "burrito";
    if (/quesadilla/.test(t)) return "quesadilla";
    if (/pepper/.test(t)) return "pepper";
    if (/chicken|thigh|pulled chicken/.test(t)) return "chicken";
    if (/soup|stew|chowder/.test(t)) return "soup";
    if (/cheese/.test(t)) return "cheese";
    if (/burger/.test(t)) return "burger";
    if (/steak|sirloin|ribeye/.test(t)) return "steak";
    if (/pizza|takeout|take out|grab/.test(t)) return "pizza";
    if (/sandwich/.test(t)) return "sandwich";
    if (/sausage|brat/.test(t)) return "sausage";
    if (/potato/.test(t)) return "potato";
    if (/grill|bbq|pork|meatloaf|roast|beef|turkey/.test(t)) return "meat";
    if (/rice|bowl/.test(t)) return "rice";
    if (/light day|yogurt|toast/.test(t)) return "light";
    if (/^leftovers?\b|\bleftover\b|\bagain\b/.test(t)) return "leftover";
    return "default";
  }

  /** Main meal name only: strip side stacks. Slash → "or". */
  function shortMealName(title, maxWords) {
    let s = String(title || "Meal")
      .replace(/\s+again$/i, "")
      .replace(/[—–]/g, " ")
      .replace(/\s*\/\s*/g, " or ")
      .replace(/\s*\+\s*.*$/, "")
      .replace(/\s*\(.*$/, "")
      .replace(/\s+from\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday).*$/i, "")
      .replace(/\s+/g, " ")
      .trim();
    if (/\swith\s/i.test(s) && s.length > 22) {
      s = s.split(/\swith\s/i)[0].trim();
    }
    if (!s) return "Meal";
    const limit = maxWords || 4;
    const words = s.split(/\s+/);
    if (words.length > limit) s = words.slice(0, limit).join(" ");
    return s;
  }

  function photoHTML(src, title, sizeClass) {
    const cls = "food-photo" + (sizeClass ? " " + sizeClass : "");
    return (
      '<img class="' +
      cls +
      '" src="' +
      esc(src) +
      '" alt="' +
      esc(title || "Meal") +
      '" loading="eager" decoding="async" width="240" height="240" />'
    );
  }

  function art(keyOrText, size) {
    const raw = String(keyOrText || "");
    const known = {
      rotisserie: 1, chicken: 1, chili: 1, soup: 1, salmon: 1, fish: 1, shrimp: 1,
      breakfast: 1, eggs: 1, alfredo: 1, pasta: 1, salad: 1, pie: 1, burrito: 1,
      quesadilla: 1, pepper: 1, cheese: 1, taco: 1, burger: 1, steak: 1, pizza: 1,
      sandwich: 1, sausage: 1, potato: 1, meat: 1, rice: 1, soup: 1, grill: 1,
      light: 1, leftover: 1, default: 1,
    };
    const low = raw.toLowerCase().trim();
    const key = known[low] ? low : keyFromText(raw);
    const mealSrc = MEAL_DIR + key + ".webp";
    const sizeClass =
      size === "board" ? "food-photo-board" : size === "lg" ? "food-photo-lg" : "food-photo-sm";
    const title = shortMealName(keyOrText);
    const fallback = MEAL_DIR + "chicken.webp";
    return (
      '<img class="food-photo ' +
      sizeClass +
      '" src="' +
      esc(mealSrc) +
      '" alt="' +
      esc(title) +
      '" loading="eager" decoding="async" width="240" height="240" onerror="this.onerror=null;this.src=\'' +
      esc(fallback) +
      "';\" />"
    );
  }

  function tuckerPhoto(id) {
    const map = {
      yogurt: TUCKER_DIR + "yogurt.webp",
      cheese: TUCKER_DIR + "cheese.webp",
      chips: TUCKER_DIR + "chips.webp",
      fruit: TUCKER_DIR + "fruit.webp",
      beef: TUCKER_DIR + "beef.webp",
      juice: TUCKER_DIR + "juice.webp",
    };
    const src = map[id] || MEAL_DIR + "default.webp";
    const sideFallback =
      id === "yogurt"
        ? SIDE_DIR + "yogurt.webp"
        : id === "fruit"
          ? SIDE_DIR + "fruit-cup.webp"
          : id === "chips"
            ? SIDE_DIR + "potato-chips.webp"
            : MEAL_DIR + "default.webp";
    return (
      '<img class="food-photo food-photo-tucker" src="' +
      esc(src) +
      '" alt="" loading="eager" decoding="async" width="96" height="96" onerror="this.onerror=null;this.src=\'' +
      esc(sideFallback) +
      "';\" />"
    );
  }

  function dayLetter(nameOrShort) {
    const s = String(nameOrShort || "");
    if (/^mon/i.test(s)) return "M";
    if (/^tue/i.test(s)) return "T";
    if (/^wed/i.test(s)) return "W";
    if (/^thu/i.test(s)) return "T";
    if (/^fri/i.test(s)) return "F";
    if (/^sat/i.test(s)) return "S";
    if (/^sun/i.test(s)) return "S";
    return (s.charAt(0) || "?").toUpperCase();
  }

  const MON_SUN_FROM_SUN0 = [1, 2, 3, 4, 5, 6, 0];

  function weekStripHTML(days, opts) {
    opts = opts || {};
    const label = opts.label || "Week at a glance";
    const cells = (days || [])
      .map(function (d, i) {
        const letter = d.letter || dayLetter(d.short || d.name);
        const title = shortMealName(d.title || d.dinner || d.meal || "Meal", 3);
        const artHtml = art(d.artKey || d.title || d.dinner || d.meal || "default");
        const kind = d.kind || "";
        const cls =
          "week-strip-chip" +
          (d.today ? " is-today" : "") +
          (kind === "cook" ? " is-cook" : "") +
          (kind === "leftover" || kind === "reuse" ? " is-quiet" : "") +
          (kind === "light" || kind === "hol" ? " is-quiet" : "") +
          (d.active ? " is-active" : "");
        return (
          '<button type="button" class="' +
          cls +
          '" data-strip-day="' +
          (d.index != null ? d.index : i) +
          '" aria-label="' +
          letter +
          ": " +
          title.replace(/"/g, "") +
          '">' +
          '<span class="wsc-day">' +
          letter +
          "</span>" +
          '<span class="wsc-art" aria-hidden="true">' +
          artHtml +
          "</span>" +
          '<span class="wsc-name">' +
          esc(title) +
          "</span>" +
          "</button>"
        );
      })
      .join("");
    return (
      '<div class="week-strip" role="list" aria-label="' +
      esc(label) +
      '">' +
      cells +
      "</div>"
    );
  }

  root.FoodArt = {
    art: art,
    tuckerPhoto: tuckerPhoto,
    shortMealName: shortMealName,
    keyFromText: keyFromText,
    dayLetter: dayLetter,
    weekStripHTML: weekStripHTML,
    MON_SUN_FROM_SUN0: MON_SUN_FROM_SUN0,
    photoHTML: photoHTML,
    BASE: BASE,
    MEAL_DIR: MEAL_DIR,
  };
})(typeof window !== "undefined" ? window : globalThis);
