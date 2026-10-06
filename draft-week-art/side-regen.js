/* Per-slot side Regenerate (Ted locked bar). Burns + Kathy. Label text required. */
(function (root) {
  "use strict";

  const LABEL = "Regenerate";

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
   * Slot shell: offered side body + Regenerate label button.
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
          LABEL +
          "</button>") +
      "</div>"
    );
  }

  root.SideRegen = {
    LABEL: LABEL,
    pickReplacement: pickReplacement,
    slotHTML: slotHTML,
    esc: esc,
  };
})(typeof window !== "undefined" ? window : globalThis);
