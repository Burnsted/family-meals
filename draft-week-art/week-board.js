/* Illustrated week board (Ted north star). Burns + Kathy moods. */
(function (root) {
  "use strict";

  const TUCKER_ITEMS = [
    { id: "yogurt", label: "yogurt" },
    { id: "cheese", label: "cheese stick" },
    { id: "chips", label: "pretzels or Pringles" },
    { id: "fruit", label: "fruit snack" },
    { id: "beef", label: "beef stick" },
    { id: "juice", label: "apple juice" },
  ];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cleanCopy(s) {
    return String(s == null ? "" : s)
      .replace(/[—–]/g, " ")
      .replace(/\s*\/\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function weekOfLabel(weekTitle) {
    const raw = cleanCopy(weekTitle || "");
    if (/^week of /i.test(raw)) return raw.replace(/^week of /i, "Week of ");
    if (raw) return "Week of " + raw;
    try {
      const now = new Date();
      const day = now.getDay();
      const mon = new Date(now);
      mon.setDate(now.getDate() - ((day + 6) % 7));
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      const fmt = (d) => d.toLocaleDateString(undefined, { month: "long", day: "numeric" });
      return "Week of " + fmt(mon) + " to " + fmt(sun);
    } catch (_) {
      return "Week of this week";
    }
  }

  function pillLetter(d) {
    const s = String(d.short || d.name || d.letter || "");
    if (/^mon/i.test(s) || s === "M") return "MON";
    if (/^tue/i.test(s)) return "TUE";
    if (/^wed/i.test(s) || s === "W") return "WED";
    if (/^thu/i.test(s)) return "THU";
    if (/^fri/i.test(s) || s === "F") return "FRI";
    if (/^sat/i.test(s)) return "SAT";
    if (/^sun/i.test(s)) return "SUN";
    return (s.slice(0, 3) || "DAY").toUpperCase();
  }

  function shortName(title) {
    const FA = root.FoodArt;
    // Full primary dish name (sides stripped). No word-count truncate.
    if (FA && FA.shortMealName) return cleanCopy(FA.shortMealName(title));
    return cleanCopy(String(title || "Meal"))
      .replace(/\s*\+\s*.*$/, "")
      .replace(/\s*\(.*$/, "")
      .trim() || "Meal";
  }

  function oneLineNote(raw, maxLen) {
    const t = cleanCopy(raw || "");
    if (!t) return "";
    const limit = maxLen || 28;
    if (t.length <= limit) return t;
    return t.slice(0, limit - 1).replace(/\s+\S*$/, "").trim() + "…";
  }

  function noteForDay(d) {
    if (d.boardNote) return oneLineNote(d.boardNote, 26);
    if (d.note) return oneLineNote(d.note, 26);
    const enjoy = d.recipe && d.recipe.enjoy ? cleanCopy(d.recipe.enjoy) : "";
    if (enjoy && enjoy.length < 28) return enjoy;
    if (d.tedNote) {
      const t = cleanCopy(d.tedNote).replace(/^Ted:\s*/i, "Ted: ");
      if (/leftover/i.test(t)) return "Ted leftovers";
      return oneLineNote(t, 24);
    }
    if (d.tag && /grab/i.test(d.tag)) return "Grab and go";
    if (d.kind === "leftover" || d.kind === "reuse") return "Leftovers";
    if (d.kind === "light") return "Light day";
    const title = String(d.title || d.dinner || "").toLowerCase();
    if (/rotisserie|easy/i.test(title)) return "Easy start";
    if (/taco/i.test(title)) return "Taco night";
    if (/steak|grill/i.test(title)) return "Ted grills";
    if (/pizza|takeout|take out|grab/i.test(title)) return "Takeout night";
    if (/salmon|fish|tilapia/i.test(title)) return "Ted leftovers";
    if (/chili/i.test(title)) return "Football day";
    if (/alfredo|pasta/i.test(title)) return "Family cooks";
    return "On the board";
  }

  function tuckerArt(id) {
    const FA = root.FoodArt;
    if (FA && typeof FA.tuckerPhoto === "function") return FA.tuckerPhoto(id);
    return "";
  }

  function boardHTML(days, opts) {
    opts = opts || {};
    const mood = opts.mood === "kathy" ? "kathy" : "burns";
    const title =
      mood === "kathy"
        ? opts.title || "Kathy's Table"
        : opts.title || "Burns Family Dinners";
    const dates = weekOfLabel(opts.weekTitle || opts.datesLabel || "");
    const FA = root.FoodArt;
    const cols = (days || [])
      .map(function (d, i) {
        const letter = pillLetter(d);
        const meal = shortName(d.title || d.dinner || d.meal || "Meal");
        const note = noteForDay(d);
        const artHtml = FA
          ? FA.art(d.artKey || d.title || d.dinner || "default", "board")
          : "";
        const alt = i % 2 === 1;
        const cls =
          "wb-col" +
          (alt ? " is-alt" : "") +
          (d.today ? " is-today" : "") +
          (d.active ? " is-active" : "");
        return (
          '<button type="button" class="' +
          cls +
          '" data-strip-day="' +
          esc(d.index != null ? d.index : i) +
          '" aria-label="' +
          esc(letter + ": " + meal + ". " + note) +
          '">' +
          '<span class="wb-pill">' +
          esc(letter) +
          "</span>" +
          '<span class="wb-art-frame" aria-hidden="true">' +
          artHtml +
          "</span>" +
          '<p class="wb-meal">' +
          esc(meal) +
          "</p>" +
          '<p class="wb-note">' +
          esc(note) +
          "</p>" +
          "</button>"
        );
      })
      .join("");

    let tucker = "";
    if (mood === "burns" && opts.tucker !== false) {
      tucker =
        '<div class="wb-tucker" aria-label="Tucker lunch every school day">' +
        '<p class="wb-tucker-label">Tucker\'s lunch every school day:</p>' +
        '<div class="wb-tucker-items">' +
        TUCKER_ITEMS.map(function (it) {
          return (
            '<div class="wb-tucker-item">' +
            '<span class="wb-tucker-art">' +
            tuckerArt(it.id) +
            "</span>" +
            '<span class="wb-tucker-name">' +
            esc(it.label) +
            "</span></div>"
          );
        }).join("") +
        "</div></div>";
    }

    return (
      '<div class="week-board ' +
      (mood === "kathy" ? "kathy-board" : "burns-board") +
      '" id="' +
      esc(opts.id || "week-board") +
      '">' +
      '<header class="week-board-head">' +
      '<h2 class="week-board-title">' +
      esc(title) +
      "</h2>" +
      '<p class="week-board-dates">' +
      esc(dates) +
      "</p></header>" +
      '<div class="week-board-cols" role="list" aria-label="Week dinners">' +
      cols +
      "</div>" +
      tucker +
      "</div>"
    );
  }

  root.WeekBoard = {
    boardHTML: boardHTML,
    weekOfLabel: weekOfLabel,
    cleanCopy: cleanCopy,
    noteForDay: noteForDay,
    TUCKER_ITEMS: TUCKER_ITEMS,
  };
})(typeof window !== "undefined" ? window : globalThis);
