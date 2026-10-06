/* Shared scroll auto-expand (Steve soft bar). IntersectionObserver ~55% + 120ms debounce. */
(function (root) {
  "use strict";

  function isBlocked() {
    if (document.body.classList.contains("has-lock-sheet")) return true;
    if (document.querySelector(".lock-sheet-bg:not([hidden])")) return true;
    if (document.querySelector(".modal-backdrop.open")) return true;
    if (document.querySelector(".sheet-bg.open")) return true;
    if (document.getElementById("recipe-modal")?.classList.contains("open")) return true;
    if (document.getElementById("swap-modal")?.classList.contains("open")) return true;
    if (document.getElementById("settings-modal")?.classList.contains("open")) return true;
    return false;
  }

  /**
   * @param {object} opts
   * @param {string} opts.selector - day card selector
   * @param {function(string|number):void} opts.onOpen - called with data-key value
   * @param {string} [opts.keyAttr='data-day']
   * @param {function():boolean} [opts.canRun]
   * @returns {{ disconnect: function }}
   */
  function attachScrollExpand(opts) {
    const selector = opts.selector;
    const keyAttr = opts.keyAttr || "data-day";
    const onOpen = opts.onOpen;
    const canRun = opts.canRun || (() => true);
    let timer = null;
    let observer = null;
    let lastKey = null;

    function disconnect() {
      if (timer) clearTimeout(timer);
      timer = null;
      if (observer) observer.disconnect();
      observer = null;
    }

    if (typeof IntersectionObserver !== "function") {
      return { disconnect: disconnect };
    }

    const nodes = Array.from(document.querySelectorAll(selector));
    if (!nodes.length) return { disconnect: disconnect };

    observer = new IntersectionObserver(
      (entries) => {
        if (isBlocked() || !canRun()) return;
        // Prefer the intersecting entry closest to viewport center with high ratio
        const hits = entries.filter((e) => e.isIntersecting && e.intersectionRatio >= 0.5);
        if (!hits.length) return;
        hits.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const best = hits[0];
        const key = best.target.getAttribute(keyAttr);
        if (key == null || key === String(lastKey)) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          if (isBlocked() || !canRun()) return;
          // Re-check still intersecting enough
          const ratio = best.intersectionRatio;
          if (ratio < 0.5) return;
          lastKey = key;
          onOpen(key);
        }, 120);
      },
      {
        root: null,
        // ~50–60% of card in view near center band
        threshold: [0.5, 0.55, 0.6, 0.75],
        rootMargin: "-18% 0px -18% 0px",
      }
    );

    nodes.forEach((n) => observer.observe(n));
    return { disconnect: disconnect };
  }

  root.ScrollExpand = { attach: attachScrollExpand, isBlocked: isBlocked };
})(typeof window !== "undefined" ? window : globalThis);
