/* October dinners brochure (Burns scaffold). Stacked week-board craft for remaining Oct weeks. */
(function (root) {
  "use strict";

  const MO3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function addDays(d, n) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + n);
    return x;
  }

  function mondayOf(d) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }

  function fmtWeek(mon) {
    const e = addDays(mon, 6);
    const sameMo = mon.getMonth() === e.getMonth();
    return (
      MO3[mon.getMonth()] +
      " " +
      mon.getDate() +
      " to " +
      (sameMo ? "" : MO3[e.getMonth()] + " ") +
      e.getDate() +
      ", " +
      e.getFullYear()
    );
  }

  /**
   * Remaining October weeks starting Oct 5 (inclusive). Skips weeks before Oct 5.
   * Includes a week if Monday is in October, or the Mon to Sun span still covers October days.
   */
  function remainingOctoberWeeks(year, startDay) {
    year = year || 2026;
    startDay = startDay == null ? 5 : startDay;
    const floor = new Date(year, 9, startDay);
    let mon = mondayOf(floor);
    if (mon < floor) mon = addDays(mon, 7);
    const out = [];
    for (let i = 0; i < 6; i++) {
      const sun = addDays(mon, 6);
      const touchesOct =
        (mon.getFullYear() === year && mon.getMonth() === 9) ||
        (sun.getFullYear() === year && sun.getMonth() === 9);
      if (!touchesOct) break;
      if (mon >= floor || (mon < floor && sun >= floor)) {
        out.push({
          mon: new Date(mon),
          sun: new Date(sun),
          label: fmtWeek(mon),
          weekIndex: out.length + 1,
        });
      }
      mon = addDays(mon, 7);
      if (mon.getMonth() > 9 && mon.getFullYear() >= year) break;
    }
    return out;
  }

  function close() {
    const el = document.getElementById("october-brochure");
    if (el) el.remove();
    document.body.classList.remove("brochure-open");
  }

  /**
   * @param {object} opts
   * @param {Array<{datesLabel:string, days:object[], weekId?:string, planId?:string}>} opts.boards
   * @param {object} opts.WeekBoard
   * @param {string} [opts.title]
   * @param {string} [opts.mood]
   */
  function open(opts) {
    opts = opts || {};
    const WB = opts.WeekBoard || root.WeekBoard;
    if (!WB || typeof WB.boardHTML !== "function") return;
    close();
    const boards = opts.boards || [];
    const mood = opts.mood || "burns";
    const title = opts.title || "October dinners brochure";
    const host = document.createElement("div");
    host.id = "october-brochure";
    host.className = "october-brochure";
    host.setAttribute("role", "dialog");
    host.setAttribute("aria-modal", "true");
    host.setAttribute("aria-label", title);
    const stack = boards
      .map(function (b, i) {
        return (
          '<section class="brochure-week" data-brochure-week="' +
          String(b.weekId || i + 1) +
          '">' +
          WB.boardHTML(b.days || [], {
            mood: mood,
            title: mood === "kathy" ? "Kathy's Table" : "Burns Family Dinners",
            weekTitle: b.datesLabel || "",
            id: "brochure-board-" + (b.weekId || i + 1),
            tucker: mood === "burns",
          }) +
          "</section>"
        );
      })
      .join("");
    host.innerHTML =
      '<div class="brochure-shell">' +
      '<header class="brochure-head">' +
      '<button type="button" class="brochure-back" id="brochure-close" aria-label="Back to week">Back to week</button>' +
      "<div>" +
      '<p class="brochure-kicker">Burns Family Dinners</p>' +
      '<h2 class="brochure-title">' +
      title +
      "</h2>" +
      '<p class="brochure-sub">Remaining October weeks from Oct 5. Stacked week boards.</p>' +
      "</div></header>" +
      '<div class="brochure-stack">' +
      (stack || '<p class="brochure-empty">No remaining October weeks on the plan.</p>') +
      "</div></div>";
    document.body.appendChild(host);
    document.body.classList.add("brochure-open");
    const closeBtn = document.getElementById("brochure-close");
    if (closeBtn) closeBtn.onclick = close;
    host.addEventListener("click", function (e) {
      if (e.target === host) close();
    });
    document.addEventListener(
      "keydown",
      function onKey(e) {
        if (e.key === "Escape") {
          close();
          document.removeEventListener("keydown", onKey, true);
        }
      },
      true
    );
    if (closeBtn) closeBtn.focus();
  }

  root.OctoberBrochure = {
    remainingOctoberWeeks: remainingOctoberWeeks,
    fmtWeek: fmtWeek,
    open: open,
    close: close,
  };
})(typeof window !== "undefined" ? window : globalThis);
