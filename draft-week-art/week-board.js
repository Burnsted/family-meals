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
      .replace(/[—–]/g, " to ")
      .replace(/\s+to\s+to\s+/gi, " to ")
      .replace(/\s*\/\s*/g, " or ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Always: Week of Oct 5 to 11, 2026 (never "Oct 5 11", never en dash). */
  function weekOfLabel(weekTitle) {
    let raw = cleanCopy(weekTitle || "");
    raw = raw.replace(/^week of\s+/i, "");
    // Repair "Oct 5 11, 2026" left by old en-dash scrub
    raw = raw.replace(
      /\b([A-Za-z]{3,9})\s+(\d{1,2})\s+(\d{1,2}),\s*(\d{4})\b/,
      "$1 $2 to $3, $4"
    );
    // Repair "Oct 5 to Oct 11, 2026" → "Oct 5 to 11, 2026" when same month
    raw = raw.replace(
      /\b([A-Za-z]{3,9})\s+(\d{1,2})\s+to\s+\1\s+(\d{1,2}),\s*(\d{4})\b/i,
      "$1 $2 to $3, $4"
    );
    if (/\bto\b/.test(raw) && /\d{4}/.test(raw)) {
      return "Week of " + raw;
    }
    try {
      const now = new Date();
      const day = now.getDay();
      const mon = new Date(now);
      mon.setDate(now.getDate() - ((day + 6) % 7));
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      const mShort = (d) => d.toLocaleDateString("en-US", { month: "short" });
      if (mon.getMonth() === sun.getMonth() && mon.getFullYear() === sun.getFullYear()) {
        return "Week of " + mShort(mon) + " " + mon.getDate() + " to " + sun.getDate() + ", " + sun.getFullYear();
      }
      return (
        "Week of " +
        mShort(mon) +
        " " +
        mon.getDate() +
        " to " +
        mShort(sun) +
        " " +
        sun.getDate() +
        ", " +
        sun.getFullYear()
      );
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
    // Short board label: primary dish, ≤3 words
    if (FA && FA.shortMealName) return cleanCopy(FA.shortMealName(title, 3));
    return cleanCopy(String(title || "Meal"))
      .replace(/\s*\+\s*.*$/, "")
      .replace(/\s*\(.*$/, "")
      .split(/\s+/)
      .slice(0, 3)
      .join(" ") || "Meal";
  }

  function oneLineNote(raw, maxLen) {
    const t = cleanCopy(raw || "");
    if (!t) return "";
    const limit = maxLen || 22;
    if (t.length <= limit) return t;
    return t.slice(0, limit - 1).replace(/\s+\S*$/, "").trim() + "…";
  }

  function noteForDay(d) {
    if (d.boardNote) return oneLineNote(d.boardNote, 20);
    if (d.kind === "leftover" || d.kind === "reuse") return "Leftovers";
    if (d.kind === "light") return "Light day";
    if (d.note) return oneLineNote(d.note, 20);
    const enjoy = d.recipe && d.recipe.enjoy ? cleanCopy(d.recipe.enjoy) : "";
    if (enjoy && enjoy.length < 22) return enjoy;
    if (d.tedNote) {
      const t = cleanCopy(d.tedNote).replace(/^Ted:\s*/i, "Ted: ");
      if (/leftover/i.test(t)) return "Ted leftovers";
      return oneLineNote(t, 18);
    }
    if (d.tag && /grab/i.test(d.tag)) return "Grab and go";
    const title = String(d.title || d.dinner || "").toLowerCase();
    if (/rotisserie|easy/i.test(title)) return "Easy start";
    if (/taco rebuild/i.test(title)) return "Same meat new shape";
    if (/taco/i.test(title)) return "Taco night";
    if (/steak|grill/i.test(title)) return "Ted grills";
    if (/pizza|takeout|take out|grab/i.test(title)) return "Takeout night";
    if (/salmon|fish|tilapia/i.test(title)) return "Ted leftovers";
    if (/chili/i.test(title)) return "Football day";
    if (/alfredo|pasta/i.test(title)) return "Family cooks";
    if (/breakfast/i.test(title)) return "Hot plates together";
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
