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

  function keyFromText(text) {
    const t = String(text || "").toLowerCase();
    if (/leftover|\bagain\b|from (sun|mon|tue|wed|thu|fri|sat|yesterday|container)/.test(t)) return "leftover";
    if (/light day|yogurt|toast/.test(t)) return "light";
    if (/rotisserie/.test(t)) return "rotisserie";
    if (/chicken|thigh/.test(t)) return "chicken";
    if (/chili/.test(t)) return "chili";
    if (/soup|stew|chowder/.test(t)) return "soup";
    if (/salmon/.test(t)) return "salmon";
    if (/tilapia|fish|tuna|white fish/.test(t)) return "fish";
    if (/shrimp|scampi/.test(t)) return "shrimp";
    if (/breakfast|pancake/.test(t)) return "breakfast";
    if (/egg/.test(t)) return "eggs";
    if (/alfredo/.test(t)) return "alfredo";
    if (/pasta|lasagna|noodle/.test(t)) return "pasta";
    if (/salad/.test(t)) return "salad";
    if (/pie|shepherd/.test(t)) return "pie";
    if (/burrito|wrap/.test(t)) return "burrito";
    if (/quesadilla/.test(t)) return "quesadilla";
    if (/pepper/.test(t)) return "pepper";
    if (/cheese/.test(t)) return "cheese";
    if (/taco/.test(t)) return "taco";
    if (/burger/.test(t)) return "burger";
    if (/steak|sirloin|ribeye/.test(t)) return "steak";
    if (/pizza|takeout|take out|grab/.test(t)) return "pizza";
    if (/sandwich/.test(t)) return "sandwich";
    if (/sausage|brat/.test(t)) return "sausage";
    if (/potato/.test(t)) return "potato";
    if (/grill|bbq|pork|meatloaf|roast|beef/.test(t)) return "meat";
    if (/rice|bowl/.test(t)) return "rice";
    return "default";
  }

  /** Main meal name only: strip side stacks (+ rice, and salad, etc.). Full words, no truncate. */
  function shortMealName(title) {
    let s = String(title || "Meal")
      .replace(/\s+again$/i, "")
      .replace(/[—–]/g, " ")
      .replace(/\s*\/\s*/g, " or ")
      .replace(/\s*\+\s*.*$/, "")
      .replace(/\s*\(.*$/, "")
      .replace(/\s+/g, " ")
      .trim();
    // Prefer primary dish phrase before "with"
    if (/\swith\s/i.test(s) && s.length > 28) {
      s = s.split(/\swith\s/i)[0].trim();
    }
    if (!s) return "Meal";
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
      '" loading="lazy" decoding="async" width="240" height="240" />'
    );
  }

  function art(keyOrText, size) {
    const key = keyFromText(keyOrText);
    // Prefer meals/, then sides/ for leftovers/light fallbacks
    const mealSrc = MEAL_DIR + key + ".webp";
    const fallbacks = {
      leftover: SIDE_DIR + "rice.webp",
      light: SIDE_DIR + "yogurt.webp",
      pie: SIDE_DIR + "potatoes.webp",
      shrimp: MEAL_DIR + "fish.webp",
      sandwich: MEAL_DIR + "chicken.webp",
      sausage: MEAL_DIR + "meat.webp",
      potato: SIDE_DIR + "baked-potato.webp",
      pepper: SIDE_DIR + "zucchini-peppers.webp",
      default: MEAL_DIR + "chicken.webp",
    };
    let src = mealSrc;
    // Fallback only when meal key is known to be side-only in older trees
    if (key === "potato" && !src) src = SIDE_DIR + "baked-potato.webp";
    if (fallbacks[key] && key === "pepper") src = fallbacks.pepper;
    const sizeClass =
      size === "board" ? "food-photo-board" : size === "lg" ? "food-photo-lg" : "food-photo-sm";
    const title = shortMealName(keyOrText);
    return (
      '<img class="food-photo ' +
      sizeClass +
      '" src="' +
      esc(src) +
      '" alt="' +
      esc(title) +
      '" loading="lazy" decoding="async" width="240" height="240" onerror="this.onerror=null;this.src=\'' +
      esc(MEAL_DIR + "chicken.webp") +
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
    const src = map[id] || SIDE_DIR + "yogurt.webp";
    const sideFallback =
      id === "yogurt"
        ? SIDE_DIR + "yogurt.webp"
        : id === "fruit"
          ? SIDE_DIR + "fruit-cup.webp"
          : id === "chips"
            ? SIDE_DIR + "potato-chips.webp"
            : SIDE_DIR + "yogurt.webp";
    return (
      '<img class="food-photo food-photo-tucker" src="' +
      esc(src) +
      '" alt="" loading="lazy" decoding="async" width="96" height="96" onerror="this.onerror=null;this.src=\'' +
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
        const title = shortMealName(d.title || d.dinner || d.meal || "Meal");
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
  };
})(typeof window !== "undefined" ? window : globalThis);
