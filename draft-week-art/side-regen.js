/* Per-slot side Regenerate (Ted locked bar). Burns + Kathy. Icon-only circular arrow. */
(function (root) {
  "use strict";

  const LABEL = "Regenerate";
  const ARROW_SVG =
    '<svg class="side-regen-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.6-6.2"/><polyline points="21 3 21 9 15 9"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Pick a pool id not in exclude. Prefer not equal to preferAvoid. */
  function pickReplacement(poolIds, excludeIds, preferAvoid) {
    const ex = new Set(excludeIds || []);
    let candidates = (poolIds || []).filter(function (id) {
      return id && !ex.has(id);
    });
    if (!candidates.length) {
      candidates = (poolIds || []).filter(function (id) {
        return id && id !== preferAvoid;
      });
    }
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  /**
   * Slot shell: offered side body + circular arrow regen (no text label).
   * @param {object} opts
   * @param {string} opts.bodyHtml
   * @param {string} opts.dayKey
   * @param {number} opts.slotIndex
   * @param {boolean} [opts.selected]
   * @param {boolean} [opts.large]
   * @param {boolean} [opts.locked]
   */
  function slotHTML(opts) {
    opts = opts || {};
    const selected = !!opts.selected;
    const large = !!opts.large;
    const locked = !!opts.locked;
    const day = esc(opts.dayKey);
    const slot = String(opts.slotIndex);
    return (
      '<div class="side-slot' +
      (selected ? " is-selected" : "") +
      (large ? " is-large" : "") +
      '" data-side-day="' +
      day +
      '" data-side-slot="' +
      esc(slot) +
      '">' +
      '<div class="side-slot-body">' +
      (opts.bodyHtml || "") +
      "</div>" +
      (locked
        ? ""
        : '<button type="button" class="side-regen-btn" data-regen-day="' +
          day +
          '" data-regen-slot="' +
          esc(slot) +
          '" aria-label="' +
          LABEL +
          ' side option">' +
          ARROW_SVG +
          "</button>") +
      "</div>"
    );
  }

  /** Standalone circular regen under a section (meal or sides row). */
  function sectionBtnHTML(opts) {
    opts = opts || {};
    const day = esc(opts.dayKey);
    const kind = esc(opts.kind || "meal");
    if (opts.locked) return "";
    return (
      '<div class="regen-under">' +
      '<button type="button" class="side-regen-btn meal-regen-btn" data-regen-section="' +
      kind +
      '" data-regen-day="' +
      day +
      '" aria-label="' +
      LABEL +
      " " +
      kind +
      '">' +
      ARROW_SVG +
      "</button>" +
      "</div>"
    );
  }

  root.SideRegen = {
    LABEL: LABEL,
    ARROW_SVG: ARROW_SVG,
    pickReplacement: pickReplacement,
    slotHTML: slotHTML,
    sectionBtnHTML: sectionBtnHTML,
    esc: esc,
  };
})(typeof window !== "undefined" ? window : globalThis);
