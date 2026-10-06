/* Add item sheet (Steve soft-bar). Name · Qty default 1 · Price user-only · Category · Add/Cancel. */
(function (root) {
  "use strict";

  const SECTIONS = ["Menu extras", "Stock produce", "Miscellaneous munchies"];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function closeSheet() {
    const bg = document.getElementById("add-item-sheet-bg");
    if (bg) bg.remove();
    document.body.classList.remove("has-add-item-sheet");
  }

  /**
   * @param {object} opts
   * @param {string} [opts.name]
   * @param {string} [opts.defaultSection] Menu extras | Stock produce | Miscellaneous munchies
   * @param {boolean} [opts.large] Kathy large targets
   * @param {(item:{name,qty,price,section})=>void} opts.onAdd
   * @param {()=>void} [opts.onCancel]
   */
  function openAddItemSheet(opts) {
    opts = opts || {};
    closeSheet();
    const defSec = SECTIONS.includes(opts.defaultSection) ? opts.defaultSection : "Miscellaneous munchies";
    const large = !!opts.large;
    const bg = document.createElement("div");
    bg.id = "add-item-sheet-bg";
    bg.className = "add-item-sheet-bg" + (large ? " is-large" : "");
    bg.innerHTML = `<div class="add-item-sheet" role="dialog" aria-modal="true" aria-labelledby="add-item-title">
      <h2 id="add-item-title">Add item</h2>
      <label class="add-item-lab" for="add-item-name">Name</label>
      <input id="add-item-name" class="add-item-inp" type="text" maxlength="80" value="${esc(opts.name || "")}" autocomplete="off" />
      <label class="add-item-lab" for="add-item-qty">Quantity</label>
      <input id="add-item-qty" class="add-item-inp" type="text" maxlength="40" value="1" inputmode="text" />
      <label class="add-item-lab" for="add-item-price">${esc(opts.priceLabel || "Price")}</label>
      <input id="add-item-price" class="add-item-inp" type="text" maxlength="12" inputmode="decimal" placeholder="${esc(opts.priceRequired ? "Required for total" : "Optional")}" />
      <p class="add-item-hint">${esc(opts.priceHint || (opts.priceRequired ? "Enter a dollar amount so it can count in your grocery total." : "Leave blank if you do not know. Never invent a price."))}</p>
      <label class="add-item-lab" for="add-item-section">Category</label>
      <select id="add-item-section" class="add-item-inp">
        ${SECTIONS.map((s) => `<option value="${esc(s)}"${s === defSec ? " selected" : ""}>${esc(s)}</option>`).join("")}
      </select>
      <div class="add-item-actions">
        <button type="button" class="add-item-btn primary" id="add-item-confirm">Add</button>
        <button type="button" class="add-item-btn" id="add-item-cancel">Cancel</button>
      </div>
    </div>`;
    document.body.appendChild(bg);
    document.body.classList.add("has-add-item-sheet");
    bg.addEventListener("click", (e) => {
      if (e.target === bg) {
        closeSheet();
        if (opts.onCancel) opts.onCancel();
      }
    });
    const nameEl = document.getElementById("add-item-name");
    const qtyEl = document.getElementById("add-item-qty");
    const priceEl = document.getElementById("add-item-price");
    const secEl = document.getElementById("add-item-section");
    const hintEl = bg.querySelector(".add-item-hint");
    function syncPriceRequirement() {
      const need = !!opts.priceRequired || (secEl && secEl.value === "Menu extras");
      priceEl.placeholder = need ? "Required for total" : "Optional";
      if (hintEl) {
        hintEl.textContent = need
          ? "Enter a dollar amount so customs count in your grocery total."
          : opts.priceHint || "Leave blank if you do not know. Never invent a price.";
      }
      return need;
    }
    if (secEl) secEl.addEventListener("change", syncPriceRequirement);
    syncPriceRequirement();
    document.getElementById("add-item-cancel").onclick = () => {
      closeSheet();
      if (opts.onCancel) opts.onCancel();
    };
    document.getElementById("add-item-confirm").onclick = () => {
      const name = (nameEl.value || "").trim().slice(0, 80);
      if (!name) {
        nameEl.focus();
        return;
      }
      let qty = (qtyEl.value || "").trim().slice(0, 40);
      if (!qty) qty = "1";
      const rawPrice = (priceEl.value || "").trim().replace(/[$,\s]/g, "");
      let price = null;
      if (rawPrice) {
        const n = Number(rawPrice);
        if (Number.isFinite(n) && n >= 0) price = Math.round(n * 100) / 100;
      }
      const needPrice = syncPriceRequirement();
      if (needPrice && (price == null || !Number.isFinite(price))) {
        priceEl.focus();
        priceEl.setAttribute("aria-invalid", "true");
        return;
      }
      // Never invent a price: null if blank or invalid
      const section = SECTIONS.includes(secEl.value) ? secEl.value : defSec;
      closeSheet();
      if (opts.onAdd) opts.onAdd({ name: name, qty: qty, price: price, section: section });
    };
    setTimeout(() => {
      if (nameEl && !nameEl.value) nameEl.focus();
      else if (qtyEl) qtyEl.focus();
    }, 50);
  }

  root.AddItemSheet = {
    SECTIONS: SECTIONS,
    open: openAddItemSheet,
    close: closeSheet,
  };
})(typeof window !== "undefined" ? window : globalThis);
