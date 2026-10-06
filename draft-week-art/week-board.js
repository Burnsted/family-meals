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
    if (FA && FA.shortMealName) return cleanCopy(FA.shortMealName(title, 3));
    return cleanCopy(String(title || "Meal").split(/\s+/).slice(0, 3).join(" "));
  }

  function noteForDay(d) {
    if (d.note) return cleanCopy(d.note);
    if (d.boardNote) return cleanCopy(d.boardNote);
    const enjoy = d.recipe && d.recipe.enjoy ? cleanCopy(d.recipe.enjoy) : "";
    if (enjoy && enjoy.length < 42) return enjoy;
    if (d.tedNote) {
      const t = cleanCopy(d.tedNote).replace(/^Ted:\s*/i, "Ted: ");
      if (/leftover/i.test(t)) return "Ted: leftovers";
      return t.length > 36 ? t.slice(0, 34) + "…" : t;
    }
    if (d.tag && /grab/i.test(d.tag)) return "Grab and go";
    if (d.kind === "leftover" || d.kind === "reuse") return "Leftovers";
    if (d.kind === "light") return "Light day";
    const title = String(d.title || d.dinner || "").toLowerCase();
    if (/rotisserie|easy/i.test(title)) return "Easy start";
    if (/taco/i.test(title)) return "Taco night";
    if (/steak|grill/i.test(title)) return "Ted grills";
    if (/pizza|takeout|take out|grab/i.test(title)) return "Takeout night";
    if (/salmon|fish|tilapia/i.test(title)) return "Ted: leftovers";
    if (/chili/i.test(title)) return "Football day";
    if (/alfredo|pasta/i.test(title)) return "Family cooks";
    return "On the board";
  }

  function tuckerArt(id) {
    const arts = {
      yogurt:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="14" y="12" width="20" height="26" rx="4" fill="#dbeafe"/><rect x="14" y="12" width="20" height="8" fill="#93c5fd"/><ellipse cx="24" cy="28" rx="7" ry="5" fill="#f8fafc"/><path d="M28 18c4 2 6 8 2 12" fill="none" stroke="#64748b" stroke-width="2"/></svg>',
      cheese:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="16" y="10" width="14" height="28" rx="3" fill="#fbbf24"/><rect x="18" y="12" width="10" height="24" rx="2" fill="#f59e0b"/><path d="M19 16h8M19 22h8M19 28h8" stroke="#d97706" stroke-width="1.5"/></svg>',
      chips:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="15" y="8" width="18" height="32" rx="4" fill="#dc2626"/><rect x="15" y="8" width="18" height="10" fill="#b91c1c"/><circle cx="24" cy="26" r="5" fill="#fef3c7"/><path d="M21 26c2-2 4-2 6 0" fill="none" stroke="#f59e0b" stroke-width="1.5"/></svg>',
      fruit:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 18h24l-3 22H15z" fill="#ef4444"/><path d="M14 18h20l-1.5 8H15.5z" fill="#fca5a5"/><circle cx="20" cy="30" r="3" fill="#fbbf24"/><circle cx="28" cy="32" r="2.5" fill="#22c55e"/></svg>',
      beef:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="20" y="8" width="8" height="32" rx="3" fill="#7c2d12"/><rect x="21" y="10" width="6" height="28" rx="2" fill="#9a3412"/><path d="M22 14h4M22 20h4M22 26h4" stroke="#431407" stroke-width="1.2"/></svg>',
      juice:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="14" y="12" width="18" height="26" rx="2" fill="#86efac"/><rect x="14" y="12" width="18" height="8" fill="#22c55e"/><circle cx="23" cy="28" r="5" fill="#ef4444"/><path d="M32 10v8" stroke="#94a3b8" stroke-width="2"/><path d="M32 10h4" stroke="#94a3b8" stroke-width="2"/></svg>',
    };
    return arts[id] || arts.yogurt;
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
