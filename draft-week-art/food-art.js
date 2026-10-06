/* Shared flat food illustrations + week-strip helpers for draft-week-art previews. */
(function (root) {
  "use strict";

  function svg(body, title) {
    return (
      '<svg class="food-art" viewBox="0 0 64 64" width="40" height="40" role="img" aria-label="' +
      (title || "Food") +
      '" xmlns="http://www.w3.org/2000/svg">' +
      body +
      "</svg>"
    );
  }

  const ARTS = {
    chicken: svg(
      '<ellipse cx="32" cy="38" rx="18" ry="12" fill="#e8a06a"/><ellipse cx="32" cy="36" rx="14" ry="9" fill="#f0b984"/><path d="M18 30c4-10 24-10 28 0" fill="#d4784a"/><circle cx="24" cy="34" r="2" fill="#8b4518"/><path d="M44 28c4-2 8 2 6 6" fill="#c45c2a"/>',
      "Chicken"
    ),
    chili: svg(
      '<ellipse cx="32" cy="40" rx="16" ry="10" fill="#c45c2a"/><path d="M16 36c4-14 28-14 32 0" fill="#8b2e16"/><ellipse cx="26" cy="36" rx="3" ry="2" fill="#f4d35e"/><ellipse cx="36" cy="38" rx="3" ry="2" fill="#f4d35e"/><circle cx="30" cy="42" r="2" fill="#2f6b3a"/>',
      "Chili"
    ),
    soup: svg(
      '<ellipse cx="32" cy="42" rx="18" ry="8" fill="#c9a06a"/><path d="M14 34h36v8c0 6-8 10-18 10s-18-4-18-10z" fill="#e8c99a"/><ellipse cx="32" cy="34" rx="18" ry="6" fill="#d4784a"/><path d="M22 28c2-4 6-4 8 0M34 26c2-4 6-4 8 0" fill="none" stroke="#b8c4cc" stroke-width="2"/>',
      "Soup"
    ),
    fish: svg(
      '<ellipse cx="34" cy="32" rx="16" ry="10" fill="#7eb8c9"/><path d="M18 32l-10-8v16z" fill="#5a9aab"/><circle cx="42" cy="30" r="2" fill="#173042"/><path d="M28 24c4 2 8 2 12 0M28 40c4-2 8-2 12 0" fill="none" stroke="#5a9aab" stroke-width="2"/>',
      "Fish"
    ),
    meat: svg(
      '<ellipse cx="32" cy="34" rx="16" ry="12" fill="#b5523a"/><ellipse cx="32" cy="34" rx="10" ry="7" fill="#d4784a"/><path d="M20 28c6-4 18-4 24 0" fill="none" stroke="#8b2e16" stroke-width="2"/>',
      "Meat"
    ),
    eggs: svg(
      '<ellipse cx="26" cy="36" rx="10" ry="12" fill="#f5f0e1"/><ellipse cx="40" cy="34" rx="9" ry="11" fill="#efe6c8"/><circle cx="26" cy="38" r="4" fill="#f0c14a"/><circle cx="40" cy="36" r="3.5" fill="#f0c14a"/>',
      "Eggs"
    ),
    pasta: svg(
      '<ellipse cx="32" cy="40" rx="18" ry="8" fill="#e8c99a"/><path d="M16 34c6 4 12-4 18 0s12-4 16 2" fill="none" stroke="#d4a05a" stroke-width="3"/><path d="M18 28c6 4 12-4 18 0s10-2 14 2" fill="none" stroke="#c45c2a" stroke-width="3"/>',
      "Pasta"
    ),
    salad: svg(
      '<ellipse cx="32" cy="40" rx="16" ry="8" fill="#e8c99a"/><path d="M20 34c4-10 20-10 24 0" fill="#5a9a4a"/><path d="M24 30c2-6 14-6 16 0" fill="#7bb85a"/><circle cx="28" cy="36" r="3" fill="#d4572a"/><circle cx="38" cy="34" r="2.5" fill="#f0c14a"/>',
      "Salad"
    ),
    pie: svg(
      '<path d="M12 36l20-16 20 16v6H12z" fill="#d4a05a"/><path d="M14 36h36v8c0 4-8 8-18 8s-18-4-18-8z" fill="#c45c2a"/><path d="M20 28l12-8 12 8" fill="none" stroke="#8b5a2b" stroke-width="2"/>',
      "Pie"
    ),
    rice: svg(
      '<ellipse cx="32" cy="40" rx="16" ry="8" fill="#e8c99a"/><ellipse cx="32" cy="34" rx="14" ry="8" fill="#f5f0e1"/><circle cx="26" cy="34" r="2" fill="#d4a05a"/><circle cx="34" cy="32" r="2" fill="#d4a05a"/><circle cx="38" cy="36" r="2" fill="#7bb85a"/>',
      "Rice bowl"
    ),
    burrito: svg(
      '<rect x="14" y="22" width="36" height="22" rx="10" fill="#e8c99a"/><path d="M18 28h28M18 34h28M18 40h20" stroke="#c45c2a" stroke-width="2"/><path d="M40 24c4 4 4 12 0 16" fill="none" stroke="#8b5a2b" stroke-width="2"/>',
      "Burrito"
    ),
    pepper: svg(
      '<path d="M24 20c0-4 6-6 8-2 2-4 8-2 8 2 8 2 12 14 4 24-6 8-18 8-24 0-8-10-4-22 4-24z" fill="#2f8f4e"/><path d="M30 18c2-6 6-6 8-2" fill="none" stroke="#2f6b3a" stroke-width="2"/>',
      "Pepper"
    ),
    cheese: svg(
      '<path d="M12 40L32 18l20 22v6H12z" fill="#f0c14a"/><circle cx="28" cy="34" r="3" fill="#e8a820"/><circle cx="38" cy="38" r="2.5" fill="#e8a820"/><circle cx="24" cy="42" r="2" fill="#e8a820"/>',
      "Cheese"
    ),
    shrimp: svg(
      '<path d="M18 36c4-12 20-16 28-8 4 4 2 12-4 14-8 2-16-2-20-8z" fill="#f0a070"/><circle cx="40" cy="28" r="2" fill="#173042"/><path d="M22 40c4 4 10 6 16 4" fill="none" stroke="#d4784a" stroke-width="2"/>',
      "Shrimp"
    ),
    light: svg(
      '<circle cx="32" cy="32" r="14" fill="#dfeee6"/><path d="M24 34c4-8 12-8 16 0" fill="#7bb85a"/><circle cx="28" cy="28" r="3" fill="#f0c14a"/><circle cx="38" cy="30" r="2.5" fill="#d4572a"/>',
      "Light meal"
    ),
    leftover: svg(
      '<rect x="18" y="20" width="28" height="28" rx="3" fill="#e8c99a"/><rect x="22" y="24" width="20" height="8" fill="#d4784a"/><rect x="22" y="36" width="20" height="8" fill="#7bb85a"/><path d="M20 18h24v4H20z" fill="#c9a06a"/>',
      "Leftovers"
    ),
    taco: svg(
      '<path d="M12 40c4-20 36-20 40 0" fill="#e8c99a"/><path d="M16 38c4-14 28-14 32 0" fill="#d4784a"/><path d="M22 34c2-4 6-4 8 0M34 34c2-4 6-4 8 0" fill="#7bb85a"/>',
      "Taco"
    ),
    burger: svg(
      '<ellipse cx="32" cy="28" rx="18" ry="8" fill="#e8c99a"/><rect x="14" y="30" width="36" height="8" fill="#8b2e16"/><rect x="16" y="38" width="32" height="6" fill="#7bb85a"/><ellipse cx="32" cy="46" rx="18" ry="6" fill="#d4a05a"/>',
      "Burger"
    ),
    steak: svg(
      '<ellipse cx="32" cy="34" rx="18" ry="12" fill="#8b2e16"/><ellipse cx="32" cy="34" rx="12" ry="8" fill="#b5523a"/><path d="M22 30c6 4 14 4 20 0" fill="none" stroke="#5a1a10" stroke-width="2"/>',
      "Steak"
    ),
    grill: svg(
      '<rect x="14" y="24" width="36" height="22" rx="2" fill="#4a5560"/><path d="M18 28h28M18 34h28M18 40h28" stroke="#2d3740" stroke-width="2"/><circle cx="24" cy="20" r="3" fill="#d4572a"/><circle cx="40" cy="18" r="2" fill="#f0c14a"/>',
      "Grill"
    ),
    default: svg(
      '<ellipse cx="32" cy="38" rx="16" ry="10" fill="#e8c99a"/><circle cx="32" cy="28" r="10" fill="#d4784a"/><path d="M26 24h12v4H26z" fill="#8b5a2b"/>',
      "Meal"
    ),
  };

  function keyFromText(text) {
    const t = String(text || "").toLowerCase();
    if (/leftover|again|from /.test(t)) return "leftover";
    if (/light day|yogurt|toast/.test(t)) return "light";
    if (/chicken|rotisserie|thigh/.test(t)) return "chicken";
    if (/chili/.test(t)) return "chili";
    if (/soup|stew|chowder/.test(t)) return "soup";
    if (/salmon|tilapia|fish|tuna/.test(t)) return "fish";
    if (/shrimp|scampi/.test(t)) return "shrimp";
    if (/egg/.test(t)) return "eggs";
    if (/pasta|alfredo|lasagna|noodle/.test(t)) return "pasta";
    if (/salad/.test(t)) return "salad";
    if (/pie|shepherd/.test(t)) return "pie";
    if (/rice|bowl/.test(t)) return "rice";
    if (/burrito|wrap/.test(t)) return "burrito";
    if (/pepper/.test(t)) return "pepper";
    if (/cheese|quesadilla/.test(t)) return "cheese";
    if (/taco/.test(t)) return "taco";
    if (/burger/.test(t)) return "burger";
    if (/steak|sirloin|ribeye/.test(t)) return "steak";
    if (/grill|bbq|brat|sausage|pork|meatloaf|roast|beef/.test(t)) return "meat";
    return "default";
  }

  function art(keyOrText, size) {
    const key = ARTS[keyOrText] ? keyOrText : keyFromText(keyOrText);
    let html = ARTS[key] || ARTS.default;
    if (size === "lg") {
      html = html.replace('width="40" height="40"', 'width="72" height="72"').replace('class="food-art"', 'class="food-art food-art-lg"');
    }
    return html;
  }

  function shortMealName(title, maxWords) {
    maxWords = maxWords || 4;
    let s = String(title || "Meal")
      .replace(/\s+again$/i, "")
      .replace(/[—–]/g, " ")
      .replace(/\s*\/\s*/g, " ")
      .trim();
    const words = s.split(/\s+/).filter(Boolean);
    if (!words.length) return "Meal";
    return words.slice(0, maxWords).join(" ");
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

  /** Mon-Sun order indices when source is Sunday-first (0=Sun). */
  const MON_SUN_FROM_SUN0 = [1, 2, 3, 4, 5, 6, 0];

  /**
   * days: array of { letter|short|name, title|dinner, kind?, today?, artKey? }
   */
  function weekStripHTML(days, opts) {
    opts = opts || {};
    const label = opts.label || "Week at a glance";
    const cells = (days || [])
      .map(function (d, i) {
        const letter = d.letter || dayLetter(d.short || d.name);
        const title = shortMealName(d.title || d.dinner || d.meal || "Meal", 4);
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
          title.replace(/&/g, "&amp;").replace(/</g, "&lt;") +
          "</span>" +
          "</button>"
        );
      })
      .join("");
    return (
      '<div class="week-strip" role="list" aria-label="' +
      label +
      '">' +
      cells +
      "</div>"
    );
  }

  root.FoodArt = {
    art: art,
    keyFromText: keyFromText,
    shortMealName: shortMealName,
    dayLetter: dayLetter,
    weekStripHTML: weekStripHTML,
    MON_SUN_FROM_SUN0: MON_SUN_FROM_SUN0,
  };
})(typeof window !== "undefined" ? window : globalThis);
