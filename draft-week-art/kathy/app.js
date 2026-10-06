(() => {
  "use strict";

  const K = window.KATHY;
  const STORE_KEY = "kathy-table-state-v1";
  const THEME_KEY = "kt-theme";

  const ico = {
    speaker: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>`,
    mic: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    share: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    gear: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
    back: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>`,
    shuffle: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>`,
    camera: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h3l2-2h6l2 2h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
  };

  const DN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const SETUP_STEPS = [
    "first", "comfort", "heat", "skip", "favorites", "newness",
    "portion", "freezer", "budget", "stores", "mind", "fresh", "starter", "week"
  ];

  function defaultState() {
    return {
      name: "Kathy",
      people: 2,
      prepMinutes: 20,
      cookDays: 2,
      muted: false,
      comfort: [],
      heat: 1,
      flavor: 3,
      skip: [],
      favorites: {},
      newness: "some",
      portion: "regular",
      freezer: "some",
      budgetOn: false,
      budgetAmt: null,
      stores: ["Aldi", "Publix"],
      mind: [],
      shelf: {},
      shelfNotes: {},
      photos: {},
      setupStep: "first",
      doneSetup: false,
      week: null,
      checked: {},
      ratings: {},
      log: {},
      openDay: null,
      hearStep: 0,
      weekLocked: false,
      lockedWeek: null,
      focusDay: null,
      customGrocery: [],
      showHome: false,
      haveIt: {},
      showHiddenHave: false,
      stockProduce: [],
      munchies: [],
      itemAlts: {},
      meatAlts: {},
      openAltId: null,
      daySides: {},
      sideOffers: {},
    };
  }

  let state = loadState();
  let speakTimer = null;
  let recog = null;

  function loadState() {
    try {
      const j = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (!j || typeof j !== "object") return defaultState();
      const base = { ...defaultState(), ...j };
      base.skip = j.skip || [];
      base.comfort = j.comfort || [];
      base.mind = j.mind || [];
      base.stores = j.stores || ["Aldi"];
      base.favorites = j.favorites || {};
      base.shelf = j.shelf || {};
      base.checked = j.checked || {};
      base.ratings = j.ratings || {};
      base.log = j.log || {};
      base.customGrocery = Array.isArray(j.customGrocery) ? j.customGrocery : [];
      base.stockProduce = Array.isArray(j.stockProduce) ? j.stockProduce : [];
      base.munchies = Array.isArray(j.munchies) ? j.munchies : [];
      base.itemAlts = j.itemAlts && typeof j.itemAlts === "object" ? j.itemAlts : {};
      base.meatAlts = j.meatAlts && typeof j.meatAlts === "object" ? j.meatAlts : {};
      base.daySides = j.daySides && typeof j.daySides === "object" ? j.daySides : {};
      base.sideOffers = j.sideOffers && typeof j.sideOffers === "object" ? j.sideOffers : {};
      base.haveIt = window.HaveItTimed
        ? window.HaveItTimed.normalizeStore(j.haveIt)
        : (j.haveIt && typeof j.haveIt === "object" ? j.haveIt : {});
      // Never force home on load. Mid-flow draft wins (Steve soft-bar)
      base.showHome = false;
      return base;
    } catch (_) {
      return defaultState();
    }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2400);
  }

  function greeting() {
    const n = (state.name || "").trim();
    if (n) return `Hi ${n}. I'll read each question out loud. Tap or just say your answer.`;
    return `Hi. I'll read each question out loud. Tap or just say your answer.`;
  }

  function stopSpeak() {
    try { speechSynthesis.cancel(); } catch (_) {}
    clearTimeout(speakTimer);
  }

  function speak(text, onEnd) {
    stopSpeak();
    if (state.muted || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }
    const u = new SpeechSynthesisUtterance(String(text));
    u.rate = 0.95;
    if (onEnd) u.onend = onEnd;
    try { speechSynthesis.speak(u); } catch (_) { if (onEnd) onEnd(); }
  }

  function hasSpeechRec() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function listenOnce(onResult) {
    if (!hasSpeechRec()) { toast("Voice answers are not available on this phone."); return; }
    try {
      if (recog) { try { recog.abort(); } catch (_) {} }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recog = new SR();
      recog.lang = "en-US";
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      recog.onresult = (e) => {
        const said = (e.results[0] && e.results[0][0] && e.results[0][0].transcript) || "";
        onResult(said.trim());
      };
      recog.onerror = () => toast("Could not hear that. Try again or tap an answer.");
      recog.start();
      toast("Listening...");
    } catch (_) {
      toast("Could not start the microphone.");
    }
  }

  function themeToggle() {
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    const meta = document.getElementById("theme-color-meta");
    if (meta) meta.content = next === "dark" ? "#1a120c" : "#fff4e6";
  }

  function dishById(id) {
    return (K.DISHES || []).find((d) => d.id === id) || null;
  }

  const SIDE_CATALOG = [
    { id: "potatoes", src: "img/sides/potatoes.webp", alt: "Potatoes" },
    { id: "carrots", src: "img/sides/carrots-ranch.webp", alt: "Carrots" },
    { id: "beans", src: "img/sides/black-beans.webp", alt: "Beans" },
    { id: "salad", src: "img/sides/side-salad.webp", alt: "Side salad" },
    { id: "broccoli", src: "img/sides/broccoli.webp", alt: "Broccoli" },
    { id: "sweet-potato", src: "img/sides/sweet-potato.webp", alt: "Sweet potato" },
    { id: "green-beans", src: "img/sides/green-beans.webp", alt: "Green beans" },
    { id: "rice", src: "img/sides/rice.webp", alt: "Rice" },
    { id: "corn", src: "img/sides/corn.webp", alt: "Corn" },
    { id: "asparagus", src: "img/sides/asparagus.webp", alt: "Asparagus" },
    { id: "garlic-bread", src: "img/sides/garlic-bread.webp", alt: "Garlic bread" },
    { id: "fruit", src: "img/sides/fruit-cup.webp", alt: "Fruit" },
  ];
  const SIDE_BY_ID = Object.fromEntries(SIDE_CATALOG.map((s) => [s.id, s]));
  const SIDE_SEED = {
    lemon_chicken: ["potatoes", "carrots"],
    turkey_chili: ["beans", "salad"],
    herb_salmon: ["broccoli", "sweet-potato"],
    chicken_soup: ["green-beans", "rice"],
    white_fish: ["green-beans", "rice"],
    chicken_rice: ["rice", "broccoli"],
    shepherd_pie: ["potatoes", "salad"],
  };

  function sideSeedIds(dish) {
    return (dish && SIDE_SEED[dish.id]) || ["salad"];
  }

  function getDaySideSel(dayKey) {
    const arr = (state.daySides || {})[dayKey];
    return Array.isArray(arr) ? arr.map(String) : [];
  }

  function setDaySideSel(dayKey, ids) {
    if (!state.daySides) state.daySides = {};
    const clean = [...new Set(ids)].filter((id) => SIDE_BY_ID[id]).slice(0, 6);
    if (!clean.length) delete state.daySides[dayKey];
    else state.daySides[dayKey] = clean;
  }

  function ensureKathySideOffers(dayKey, dish) {
    if (!state.sideOffers) state.sideOffers = {};
    const seed = sideSeedIds(dish).filter((id) => SIDE_BY_ID[id]);
    if (!seed.length) {
      delete state.sideOffers[dayKey];
      return [];
    }
    let cur = Array.isArray(state.sideOffers[dayKey])
      ? state.sideOffers[dayKey].filter((id) => SIDE_BY_ID[id])
      : [];
    if (!cur.length) cur = seed.slice();
    while (cur.length < seed.length) {
      const SR = window.SideRegen;
      const pool = SIDE_CATALOG.map((s) => s.id);
      const next = SR ? SR.pickReplacement(pool, cur) : pool.find((id) => !cur.includes(id));
      if (!next) break;
      cur.push(next);
    }
    state.sideOffers[dayKey] = cur.slice(0, 6);
    return state.sideOffers[dayKey];
  }

  function regenerateKathySideSlot(dayKey, slotIndex) {
    if (state.weekLocked) {
      toast("Unlock the week to change sides.");
      return;
    }
    const offers = ((state.sideOffers || {})[dayKey] || []).slice();
    const i = Number(slotIndex);
    if (!Number.isFinite(i) || i < 0 || i >= offers.length) return;
    const old = offers[i];
    const pool = SIDE_CATALOG.map((s) => s.id);
    const SR = window.SideRegen;
    const next = SR ? SR.pickReplacement(pool, offers, old) : pool.find((id) => id !== old && !offers.includes(id));
    if (!next || next === old) {
      toast("No other side right now");
      return;
    }
    offers[i] = next;
    if (!state.sideOffers) state.sideOffers = {};
    state.sideOffers[dayKey] = offers;
    const sel = getDaySideSel(dayKey);
    if (sel.includes(old)) setDaySideSel(dayKey, sel.filter((x) => x !== old));
    save();
    render();
    toast("New side: " + ((SIDE_BY_ID[next] && SIDE_BY_ID[next].alt) || next));
  }

  function kathySidesBlockHTML(day, dish) {
    if (!dish || day.kind !== "cook") return "";
    const dayKey = String(day.i);
    const offers = ensureKathySideOffers(dayKey, dish);
    if (!offers.length) return "";
    const sel = new Set(getDaySideSel(dayKey));
    const SR = window.SideRegen;
    const locked = !!state.weekLocked;
    const slots = offers
      .map((id, slot) => {
        const meta = SIDE_BY_ID[id];
        if (!meta) return "";
        const on = sel.has(id);
        const pick =
          `<button type="button" class="side-pick" data-side-pick="${esc(dayKey)}" data-side-id="${esc(id)}" aria-pressed="${on}">` +
          `<img src="${esc(meta.src)}" alt="" loading="lazy"><span class="sn">${esc(meta.alt)}</span></button>`;
        if (SR) {
          return SR.slotHTML({
            bodyHtml: pick,
            dayKey,
            slotIndex: slot,
            selected: on,
            large: true,
            locked,
          });
        }
        return pick;
      })
      .join("");
    return `<div class="block kathy-sides"><h4>Suggested sides</h4><div class="kathy-side-slots" data-sides-day="${esc(dayKey)}">${slots}</div></div>`;
  }

  function filterPool() {
    const skip = new Set((state.skip || []).map((s) => s.toLowerCase()));
    const prep = state.prepMinutes || 20;
    return (K.DISHES || []).filter((d) => {
      if (d.prepMinutes > prep + 5) return false;
      const protein = (d.protein || "").toLowerCase();
      for (const s of skip) {
        if (protein.includes(s) || (d.name || "").toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }

  function pickCookDays(n) {
    if (n === 1) return [0];
    if (n === 2) return [0, 3];
    return [0, 2, 4];
  }

  function buildDefaultWeek() {
    const cookIdx = pickCookDays(state.cookDays || 2);
    const pool = filterPool();
    const byId = Object.fromEntries((K.DISHES || []).map((d) => [d.id, d]));
    // Prefer sample pair when 2 batch nights and both available
    let cookDishes = [];
    if (cookIdx.length === 2 && byId.lemon_chicken && byId.turkey_chili && pool.some((d) => d.id === "lemon_chicken") && pool.some((d) => d.id === "turkey_chili")) {
      cookDishes = [byId.lemon_chicken, byId.turkey_chili];
    } else {
      const shuffled = pool.slice().sort(() => Math.random() - 0.5);
      cookDishes = cookIdx.map((_, i) => shuffled[i % Math.max(shuffled.length, 1)] || K.DISHES[i % K.DISHES.length]);
    }

    const days = DN.map((name, i) => {
      const cookAt = cookIdx.indexOf(i);
      if (cookAt >= 0) {
        const d = cookDishes[cookAt];
        return {
          i, name, kind: "cook", dishId: d.id, title: d.name, emoji: d.emoji,
          note: "Batch night. Follow the prep plan and pack labeled containers.",
          light: false,
        };
      }
      return null;
    });

    // Fill leftover and light days from the sample narrative when using the default pair
    if (cookDishes[0] && cookDishes[0].id === "lemon_chicken" && cookDishes[1] && cookDishes[1].id === "turkey_chili") {
      days[1] = { i: 1, name: DN[1], kind: "leftover", dishId: "lemon_chicken", title: "Chicken dinner from Sunday", emoji: "🍗", note: "From Container A. Fridge meals stay within three days.", light: false, from: "Sunday" };
      days[2] = { i: 2, name: DN[2], kind: "reuse", dishId: "chicken_salad", title: "Pulled chicken wrap", emoji: "🥗", note: "Pulled chicken from Sunday Container B in a soft wrap with greens.", light: false, from: "Sunday" };
      days[4] = { i: 4, name: DN[4], kind: "leftover", dishId: "turkey_chili", title: "Chili dinner and chicken salad lunch", emoji: "🍲", note: "Chili from Wednesday Container B. Lunch: chicken salad from Sunday pulled chicken.", light: false, from: "Wednesday" };
      days[5] = { i: 5, name: DN[5], kind: "reuse", dishId: "stuffed_peppers", title: "Turkey stuffed pepper bowls", emoji: "🫑", note: "Cooked turkey from Wednesday Container D with peppers and rice.", light: false, from: "Wednesday" };
      days[6] = { i: 6, name: DN[6], kind: "light", dishId: null, title: "Eggs with saved onion and pepper", emoji: "🍳", note: "Use Container A onion and pepper from Wednesday. Breakfast and lunch stay light with no cooking beyond eggs.", light: true, from: "Wednesday" };
    } else {
      // Generic leftover pattern: next two days after each cook
      cookIdx.forEach((ci, idx) => {
        const d = cookDishes[idx];
        for (let offset = 1; offset <= 2; offset++) {
          const di = (ci + offset) % 7;
          if (cookIdx.includes(di)) continue;
          if (days[di]) continue;
          days[di] = {
            i: di, name: DN[di], kind: offset === 1 ? "leftover" : "reuse",
            dishId: d.id, title: `${d.name} again`, emoji: d.emoji,
            note: offset === 1
              ? `From ${DN[ci]} containers. Fridge meals stay within three days.`
              : `A second use from ${DN[ci]} batch cooking.`,
            light: false, from: DN[ci],
          };
        }
      });
    }

    for (let i = 0; i < 7; i++) {
      if (!days[i]) {
        days[i] = {
          i, name: DN[i], kind: "light", dishId: null,
          title: "Light day", emoji: "🥗",
          note: "Breakfast and lunch stay light with no cooking. Use yogurt, toast, fruit, or leftovers within three days.",
          light: true,
        };
      }
    }

    state.week = { days, cookIdx, builtAt: Date.now() };
    state.checked = {};
    save();
  }

  function shuffleWeek() {
    if (state.weekLocked) { toast("Unlock the week to shuffle meals."); return; }
    const pool = filterPool().sort(() => Math.random() - 0.5);
    if (pool.length < 2) { toast("Not enough dishes after your skip list."); return; }
    const cookIdx = pickCookDays(state.cookDays || 2);
    const cookDishes = cookIdx.map((_, i) => pool[i % pool.length]);
    const days = DN.map((name, i) => {
      const cookAt = cookIdx.indexOf(i);
      if (cookAt >= 0) {
        const d = cookDishes[cookAt];
        return { i, name, kind: "cook", dishId: d.id, title: d.name, emoji: d.emoji, note: "Batch night. Follow the prep plan and pack labeled containers.", light: false };
      }
      return null;
    });
    cookIdx.forEach((ci, idx) => {
      const d = cookDishes[idx];
      for (let offset = 1; offset <= 2; offset++) {
        const di = (ci + offset) % 7;
        if (cookIdx.includes(di) || days[di]) continue;
        days[di] = {
          i: di, name: DN[di], kind: offset === 1 ? "leftover" : "reuse",
          dishId: d.id, title: `${d.name} again`, emoji: d.emoji,
          note: `From ${DN[ci]}. Fridge meals stay within three days.`,
          light: false, from: DN[ci],
        };
      }
    });
    for (let i = 0; i < 7; i++) {
      if (!days[i]) {
        days[i] = { i, name: DN[i], kind: "light", dishId: null, title: "Light day", emoji: "🥗", note: "Breakfast and lunch stay light with no cooking.", light: true };
      }
    }
    state.week = { days, cookIdx, builtAt: Date.now() };
    state.checked = {};
    state.openDay = null;
    save();
    toast("Week shuffled.");
    render();
  }

  function groceryFromWeek() {
    /* Ted pick A: week-only. Meals + swaps + sides on the week. No starter pantry, no light hard-adds. */
    if (!state.week) return [];
    const map = new Map();
    const add = (g, why) => {
      const key = (g.name || "").toLowerCase();
      if (!key) return;
      if (map.has(key)) {
        const cur = map.get(key);
        if (why && !cur.why.includes(why)) cur.why.push(why);
        return;
      }
      const id = "g-" + key.replace(/[^a-z0-9]+/g, "-");
      const display = (state.itemAlts && state.itemAlts[id]) || g.name;
      map.set(key, {
        id,
        name: display,
        baseName: g.name,
        qty: g.qty || "",
        aisle: g.aisle || "Other",
        why: why ? [why] : [],
        estimate: true,
        price: g.price != null && isFinite(Number(g.price)) ? Number(g.price) : null,
        section: "Menu for this week",
      });
    };
    state.week.days.forEach((day) => {
      if (!day || day.light || !day.dishId) return;
      const d = dishById(day.dishId);
      if (!d) return;
      if (day.kind === "cook") {
        (d.grocery || []).forEach((g) => add(g, day.name));
      }
    });
    return [...map.values()];
  }

  function itemHaveIt(id) {
    const HIT = window.HaveItTimed;
    if (!HIT) return Boolean(state.haveIt && state.haveIt[id]);
    if (!state.haveIt) state.haveIt = {};
    HIT.pruneExpired(state.haveIt);
    return HIT.isSuppressed(state.haveIt[id]);
  }
  function setHaveIt(id, value, item) {
    const HIT = window.HaveItTimed;
    if (!state.haveIt) state.haveIt = {};
    if (!value) {
      if (HIT) HIT.clearHaveIt(state.haveIt, id);
      else delete state.haveIt[id];
      return;
    }
    if (HIT) HIT.markHaveIt(state.haveIt, id, item || { id }, Date.now());
    else state.haveIt[id] = true;
  }
  function haveItHint(id) {
    const HIT = window.HaveItTimed;
    if (!HIT || !state.haveIt) return "";
    return HIT.entryHint(state.haveIt[id]) || "";
  }

  function groceryEstTotalHTML(items) {
    /* Kathy: user-entered prices only. No estimate wording. */
    const list = (items || []).filter((it) => !itemHaveIt(it.id));
    const priced = list.filter((it) => it.price != null && isFinite(Number(it.price)));
    if (!priced.length) {
      return `<div class="est-store-total" id="est-store-total" hidden></div>`;
    }
    const store = (state.stores && state.stores[0]) || "";
    const sum = priced.reduce((s, it) => s + Number(it.price), 0);
    const main = store ? `$${sum.toFixed(2)} at ${esc(store)}` : `$${sum.toFixed(2)}`;
    return `<div class="est-store-total" id="est-store-total"><p>${main}</p></div>`;
  }

  function grocerySectionsHTML(items) {
    const IA = window.ItemAlts;
    const SL = window.StandingLists;
    const order = (SL && SL.SECTION_ORDER) || [
      "Menu for this week", "Stock produce", "Miscellaneous munchies", "Menu extras",
    ];
    const visible = items.filter((it) => !(itemHaveIt(it.id) && !state.showHiddenHave));
    const pickerHtml = (kind) => {
      const catalog = kind === "stock" ? (SL && SL.STOCK_PRODUCE) || [] : (SL && SL.MUNCHIES) || [];
      const list = kind === "stock" ? state.stockProduce || [] : state.munchies || [];
      const on = new Set(list.map((x) => (x.name || "").toLowerCase()));
      return `<div class="g-picker kathy-large">${catalog.map((name) => {
        const isOn = on.has(name.toLowerCase());
        return `<button type="button" class="${isOn ? "is-on" : ""}" data-stand-toggle="${esc(kind)}" data-stand-name="${esc(name)}" aria-pressed="${isOn}">${esc(name)}</button>`;
      }).join("")}</div>
      <div class="g-section-actions"><button type="button" class="btn btn-ghost" data-add-section="${esc(kind === "stock" ? "Stock produce" : "Miscellaneous munchies")}">+ Add item</button></div>`;
    };
    return order.map((sec) => {
      const group = visible.filter((it) => (it.section || "Menu for this week") === sec);
      const rows = group.map((it) => {
        const have = itemHaveIt(it.id);
        const alts = IA && IA.hasAlts(it.baseName || it.name) ? IA.altsFor(it.baseName || it.name) : [];
        const chev = alts.length ? `<button type="button" class="item-alt-chip is-large" data-alt-item="${esc(it.id)}" aria-haspopup="listbox">${esc(it.name)} <span aria-hidden="true">▾</span></button>` : "";
        return `<label class="g-item${state.checked[it.id] ? " checked" : ""}${it.custom ? " is-custom" : ""}${have ? " is-have-hidden" : ""}">
          <input type="checkbox" data-gid="${esc(it.id)}" ${state.checked[it.id] ? "checked" : ""}>
          <span>
            <span class="g-name">${esc(it.name)}</span>${it.qty ? `<span class="muted"> · ${esc(it.qty)}</span>` : ""}${it.price != null ? `<span class="muted"> · $${Number(it.price).toFixed(2)}</span>` : ""}
            ${chev}
            <button type="button" class="linkish have-chip${have ? " is-on" : ""}" data-have="${esc(it.id)}">${have ? "Still need it" : "Have it"}</button>
            ${have ? `<span class="have-back-hint">${esc(haveItHint(it.id))}</span>` : ""}
            ${it.custom || it.standing ? ` <button type="button" class="linkish" data-del-custom="${esc(it.id)}" data-del-section="${esc(it.section || "")}">Remove</button>` : ""}
            ${state.openAltId === it.id && alts.length ? IA.bubbleHTML("Swap for", alts, it.name, true) : ""}
          </span>
        </label>`;
      }).join("");
      return `<div class="g-section-block kathy-large" data-section="${esc(sec)}">
        <h3 class="g-section-title">${esc(sec)}</h3>
        ${sec === "Stock produce" ? pickerHtml("stock") : ""}
        ${sec === "Miscellaneous munchies" ? pickerHtml("munch") : ""}
        ${rows || (sec === "Menu for this week" ? `<p class="muted">Menu lines come from this week's meals.</p>` : "")}
      </div>`;
    }).join("");
  }

  function voiceBar(questionText) {
    return `<div class="voice-bar" data-voice="${esc(questionText)}">
      <p>${esc(greeting())}</p>
      <div class="voice-actions">
        <button type="button" class="btn btn-soft" id="hear-again">${ico.speaker}<span>Hear it again</span></button>
        <button type="button" class="btn btn-soft" id="answer-voice">${ico.mic}<span>Answer by voice</span></button>
      </div>
      <div class="voice-links">
        <button type="button" id="mute-link">${state.muted ? "Unmute" : "Mute"}</button>
        <button type="button" id="skip-link">Skip</button>
      </div>
    </div>`;
  }

  function bindVoice(onVoiceAnswer, onSkip) {
    const bar = document.querySelector(".voice-bar");
    const text = bar ? bar.getAttribute("data-voice") : greeting();
    const hear = document.getElementById("hear-again");
    const ans = document.getElementById("answer-voice");
    const mute = document.getElementById("mute-link");
    const skip = document.getElementById("skip-link");
    if (hear) hear.onclick = () => speak(text);
    if (ans) ans.onclick = () => listenOnce((said) => onVoiceAnswer && onVoiceAnswer(said));
    if (mute) mute.onclick = () => { state.muted = !state.muted; save(); stopSpeak(); render(); };
    if (skip) skip.onclick = () => onSkip && onSkip();
    // Auto read once when entering first screen
    if (!state.muted && state.setupStep === "first" && !state._greeted) {
      state._greeted = true;
      setTimeout(() => speak(text), 400);
    }
  }

  function choiceBtn(val, label, cur, cols) {
    return `<button type="button" class="choice${cur === val ? " on" : ""}" data-val="${esc(val)}">${esc(label)}</button>`;
  }

  function topbar(showBack) {
    const shell = `<svg class="kathy-accent-shell" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6c6 2 10 8 10 14 0 4-4 8-10 8S6 24 6 20C6 14 10 8 16 6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 10v14" stroke="currentColor" stroke-width="1.5"/></svg>`;
    const star = `<svg class="kathy-accent-star" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" fill="currentColor" opacity=".55"/></svg>`;
    return `<div class="kathy-header-band">
      ${shell}${star}
      <div class="topbar" style="margin:0;border:0;padding:0;background:transparent">
        ${showBack ? `<button type="button" class="ico-btn" id="back-btn" aria-label="Back">${ico.back}</button>` : `<span></span>`}
        <div style="flex:1;text-align:center"><p class="brand">Kathy's Table</p>
          <p class="band-sub">Quiet meals by the water</p></div>
        <button type="button" class="ico-btn" id="theme-btn" aria-label="Toggle theme">${ico.gear}</button>
      </div>
    </div>`;
  }

  function weekDatesLabel() {
    // Empty → WeekBoard.weekOfLabel builds "Week of Oct 5 to 11, 2026"
    return "";
  }

  function buildLockPackage(groceryItems) {
    const FA = window.FoodArt;
    const days = (state.week && state.week.days) || [];
    const order = (FA && FA.MON_SUN_FROM_SUN0) || [1, 2, 3, 4, 5, 6, 0];
    return {
      lockedAt: Date.now(),
      datesLabel: weekDatesLabel(),
      people: state.people,
      prepMinutes: state.prepMinutes,
      cookDays: state.cookDays,
      week: JSON.parse(JSON.stringify(state.week)),
      checked: Object.assign({}, state.checked),
      grocery: (groceryItems || []).filter((it) => !it.custom && !it.standing).map((it) => ({ id: it.id, name: it.name, qty: it.qty, aisle: it.aisle, price: it.price })),
      customGrocery: JSON.parse(JSON.stringify(state.customGrocery || [])),
      daySides: JSON.parse(JSON.stringify(state.daySides || {})),
      sideOffers: JSON.parse(JSON.stringify(state.sideOffers || {})),
      stockProduce: JSON.parse(JSON.stringify(state.stockProduce || [])),
      munchies: JSON.parse(JSON.stringify(state.munchies || [])),
      haveIt: JSON.parse(JSON.stringify(state.haveIt || {})),
      meatAlts: JSON.parse(JSON.stringify(state.meatAlts || {})),
      itemAlts: JSON.parse(JSON.stringify(state.itemAlts || {})),
      daysSummary: order.map((i) => {
        const d = days[i];
        if (!d) return null;
        return {
          i: d.i,
          name: d.name,
          title: d.title,
          kind: d.kind,
          note: d.note || "",
          dishId: d.dishId,
        };
      }).filter(Boolean),
    };
  }

  function closeLockSheet() {
    const bg = document.getElementById("lock-sheet-bg");
    if (bg) bg.remove();
    document.body.classList.remove("has-lock-sheet");
  }

  function openLockSheet(groceryItems) {
    const C = window.WEEK_LOCK_COPY || {};
    const FA = window.FoodArt;
    closeLockSheet();
    const pkg = buildLockPackage(groceryItems);
    const order = (FA && FA.MON_SUN_FROM_SUN0) || [1, 2, 3, 4, 5, 6, 0];
    const days = (state.week && state.week.days) || [];
    const rows = order.map((i) => {
      const d = days[i];
      if (!d) return "";
      const letter = FA ? FA.dayLetter(d.name) : d.name.charAt(0);
      const short = FA ? FA.shortMealName(d.title, 4) : d.title;
      const dish = d.dishId ? dishById(d.dishId) : null;
      const artKey =
        (dish && dish.name) ||
        d.dishId ||
        (d.kind === "light" ? (/egg/i.test(d.title || "") ? "eggs" : "light") : d.title);
      const art = FA ? FA.art(artKey) : "";
      return `<div class="lock-sheet-day"><span class="lsd-letter">${letter}</span><span aria-hidden="true">${art}</span><span class="lsd-name">${esc(short)}</span></div>`;
    }).join("");
    const bg = document.createElement("div");
    bg.id = "lock-sheet-bg";
    bg.className = "lock-sheet-bg";
    const datesLabel =
      (window.WeekBoard && window.WeekBoard.weekOfLabel
        ? window.WeekBoard.weekOfLabel(pkg.datesLabel || "")
        : pkg.datesLabel) || "This week";
    bg.innerHTML = `<div class="lock-sheet" role="dialog" aria-modal="true" aria-labelledby="lock-sheet-title">
      <h2 id="lock-sheet-title">${esc(C.sheetTitle || "Lock in this week")}</h2>
      <p class="lock-dates">${esc(datesLabel)}</p>
      ${rows}
      <p class="lock-grocery-count">${esc((C.groceryLine || ((n) => n + " grocery items"))(pkg.grocery.length))}</p>
      <p class="muted">${esc(C.localOnly || "Saved on this phone only")}</p>
      <div class="lock-sheet-actions">
        <button type="button" class="btn" id="lock-confirm">${esc(C.confirm || "Confirm lock")}</button>
        <button type="button" class="btn btn-ghost" id="lock-cancel">${esc(C.keepEditing || "Keep editing")}</button>
      </div>
    </div>`;
    document.body.appendChild(bg);
    document.body.classList.add("has-lock-sheet");
    bg.addEventListener("click", (e) => { if (e.target === bg) closeLockSheet(); });
    document.getElementById("lock-cancel").onclick = () => closeLockSheet();
    document.getElementById("lock-confirm").onclick = () => {
      state.weekLocked = true;
      state.lockedWeek = pkg;
      save();
      closeLockSheet();
      toast("Week locked on this phone");
      render();
    };
  }

  function unlockWeek() {
    state.weekLocked = false;
    save();
    toast("Week unlocked. You can edit again.");
    render();
  }

  function stripDaysForWeek() {
    const FA = window.FoodArt;
    const days = (state.week && state.week.days) || [];
    const today = new Date().getDay();
    const order = (FA && FA.MON_SUN_FROM_SUN0) || [1, 2, 3, 4, 5, 6, 0];
    const focus = state.focusDay != null ? state.focusDay : (state.openDay != null ? state.openDay : today);
    return order.map((i) => {
      const d = days[i];
      const dish = d.dishId ? dishById(d.dishId) : null;
      const artKey =
        (dish && dish.name) ||
        d.dishId ||
        (d.kind === "light" ? "light" : d.title);
      return {
        index: i,
        name: d.name,
        title: d.title,
        kind: d.kind,
        today: i === today,
        active: i === focus,
        artKey: artKey,
        boardNote:
          d.kind === "leftover" || d.kind === "reuse"
            ? "Leftovers"
            : d.kind === "light"
              ? "Light day"
              : d.kind === "cook"
                ? "Batch night"
                : "",
      };
    });
  }

  function randomMealForFocus() {
    if (state.weekLocked) { toast("Unlock the week to change meals."); return; }
    const pool = filterPool();
    if (!pool.length) { toast("No meals available after your skip list."); return; }
    const today = new Date().getDay();
    let i = state.focusDay != null ? state.focusDay : (state.openDay != null ? state.openDay : today);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const day = state.week.days[i];
    const wasCook = day.kind === "cook";
    state.week.days[i] = {
      i,
      name: DN[i],
      kind: wasCook ? "cook" : (day.kind === "light" ? "cook" : day.kind),
      dishId: pick.id,
      title: pick.name,
      emoji: pick.emoji,
      note: wasCook || day.kind === "light"
        ? "Batch night. Follow the prep plan and pack labeled containers."
        : (day.note || "From your random pick."),
      light: false,
      from: day.from || null,
    };
    if (state.week.days[i].kind !== "cook" && state.week.days[i].kind !== "leftover" && state.week.days[i].kind !== "reuse") {
      state.week.days[i].kind = "cook";
    }
    state.focusDay = i;
    state.openDay = i;
    state.checked = {};
    save();
    const C = window.WEEK_LOCK_COPY || {};
    toast((C.randomToast || ((n) => "Picked: " + n))(pick.name));
    render();
  }

  function wireTop() {
    const th = document.getElementById("theme-btn");
    if (th) th.onclick = () => { themeToggle(); render(); };
    const back = document.getElementById("back-btn");
    if (back) back.onclick = () => {
      const i = SETUP_STEPS.indexOf(state.setupStep);
      if (i > 0) { state.setupStep = SETUP_STEPS[i - 1]; save(); render(); }
    };
  }

  function nextStep() {
    const i = SETUP_STEPS.indexOf(state.setupStep);
    if (i < SETUP_STEPS.length - 1) {
      state.setupStep = SETUP_STEPS[i + 1];
      save();
      render();
      window.scrollTo(0, 0);
    }
  }

  /* ---------- Screens ---------- */


  function isReturningUser() {
    return !!(state.doneSetup || (state.week && state.week.days && state.week.days.length) ||
      (state.customGrocery && state.customGrocery.length) ||
      (state.stockProduce && state.stockProduce.length) ||
      (state.munchies && state.munchies.length) ||
      (state.setupStep && state.setupStep !== "first"));
  }

  function renderHome() {
    const app = document.getElementById("app");
    app.classList.remove("has-week", "week-is-locked");
    const HH = window.HomeHero;
    if (!HH) {
      state.showHome = false;
      save();
      render();
      return;
    }
    app.innerHTML = HH.html({ mood: "kathy", returning: isReturningUser(), primaryId: "home-primary-cta" });
    wireTop();
    const goWeek = () => {
      state.showHome = false;
      if (isReturningUser()) {
        if (state.week || state.doneSetup) {
          state.doneSetup = true;
          state.setupStep = "week";
          if (!state.week) buildDefaultWeek();
        }
      } else {
        if (!state.setupStep || state.setupStep === "first") {
          state.setupStep = "first";
          state.doneSetup = false;
        }
      }
      save();
      render();
      window.scrollTo(0, 0);
    };
    const primary = document.getElementById("home-primary-cta");
    if (primary) primary.onclick = goWeek;
    document.querySelectorAll("#home-kathy-board [data-strip-day]").forEach((b) => {
      b.addEventListener("click", goWeek);
    });
    const photos = document.getElementById("home-setup-photos");
    if (photos) photos.onclick = () => {
      state.showHome = false;
      state.setupStep = "fresh";
      save();
      render();
      window.scrollTo(0, 0);
    };
    const qs = document.getElementById("home-setup-questions");
    if (qs) qs.onclick = () => {
      state.showHome = false;
      // Only jump to first if no mid-flow progress
      if (!state.setupStep || state.setupStep === "week" || state.doneSetup) {
        state.setupStep = "first";
        state.doneSetup = false;
      }
      save();
      render();
      window.scrollTo(0, 0);
    };
  }

  function renderFirst() {
    const q = "Cooking for how many people? How much prep time when you cook? How many nights do you cook each week?";
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(false)}
      ${voiceBar(q)}
      <label class="field-label" for="name-field">Your name (optional)</label>
      <input class="field" id="name-field" maxlength="40" value="${esc(state.name || "")}" placeholder="Leave blank if you prefer">
      <p class="field-label">Cooking for</p>
      <div class="choice-grid cols-2" id="people">
        ${choiceBtn(1, "1", state.people)}${choiceBtn(2, "2", state.people)}
      </div>
      <p class="field-label">Prep time when you cook</p>
      <div class="choice-grid cols-3" id="prep">
        ${choiceBtn(10, "10 minutes", state.prepMinutes)}
        ${choiceBtn(20, "20 minutes", state.prepMinutes)}
        ${choiceBtn(30, "30 minutes", state.prepMinutes)}
      </div>
      <p class="field-label">Nights you cook each week</p>
      <div class="choice-grid cols-3" id="cooks">
        ${choiceBtn(1, "1", state.cookDays)}
        ${choiceBtn(2, "2", state.cookDays)}
        ${choiceBtn(3, "3", state.cookDays)}
      </div>
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.getElementById("name-field").onchange = (e) => { state.name = e.target.value.slice(0, 40); save(); };
    document.getElementById("name-field").onblur = (e) => { state.name = e.target.value.slice(0, 40); save(); };
    const bindGroup = (id, key, cast) => {
      document.querySelectorAll("#" + id + " .choice").forEach((b) => {
        b.onclick = () => { state[key] = cast(b.dataset.val); save(); render(); };
      });
    };
    bindGroup("people", "people", (v) => +v);
    bindGroup("prep", "prepMinutes", (v) => +v);
    bindGroup("cooks", "cookDays", (v) => +v);
    document.getElementById("next").onclick = () => nextStep();
    bindVoice((said) => {
      const s = said.toLowerCase();
      if (/\bone\b|\b1\b/.test(s) && /cook|day|week/.test(s)) state.cookDays = 1;
      else if (/\btwo\b|\b2\b/.test(s) && /cook|day|week/.test(s)) state.cookDays = 2;
      else if (/\bthree\b|\b3\b/.test(s) && /cook|day|week/.test(s)) state.cookDays = 3;
      else if (/\bone\b|\b1\b/.test(s)) state.people = 1;
      else if (/\btwo\b|\b2\b/.test(s)) state.people = 2;
      else if (/10|ten/.test(s)) state.prepMinutes = 10;
      else if (/20|twenty/.test(s)) state.prepMinutes = 20;
      else if (/30|thirty/.test(s)) state.prepMinutes = 30;
      save(); render();
    }, () => nextStep());
  }

  function multiToggleScreen(title, options, key, disclaimer) {
    const selected = new Set(state[key] || []);
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Setup</p>
      <h1>${esc(title)}</h1>
      <div class="choice-grid" id="opts">
        ${options.map((o) => {
          const id = typeof o === "string" ? o : o.id;
          const lab = typeof o === "string" ? o : o.name;
          return `<button type="button" class="choice${selected.has(id) ? " on" : ""}" data-val="${esc(id)}">${esc(lab)}</button>`;
        }).join("")}
      </div>
      ${disclaimer ? `<p class="disclaimer">${esc(disclaimer)}</p>` : ""}
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.querySelectorAll("#opts .choice").forEach((b) => {
      b.onclick = () => {
        const v = b.dataset.val;
        const arr = state[key] || [];
        const i = arr.indexOf(v);
        if (i >= 0) arr.splice(i, 1); else arr.push(v);
        state[key] = arr;
        save(); render();
      };
    });
    document.getElementById("next").onclick = () => nextStep();
  }

  function renderComfort() {
    multiToggleScreen("Stomach comfort", ["Mild", "Low acid", "Low spice", "Not greasy"], "comfort");
  }

  function renderHeat() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Setup</p>
      <h1>Heat and flavor</h1>
      <p class="muted">Mild never means bland. Set heat and flavor on their own.</p>
      <p class="field-label">Heat level</p>
      <div class="slider-wrap">
        <input type="range" id="heat" min="0" max="4" step="1" value="${state.heat}">
        <div class="slider-labels"><span>None</span><span>Gentle</span><span>Warm</span></div>
      </div>
      <p class="field-label">Flavor level</p>
      <div class="slider-wrap">
        <input type="range" id="flavor" min="0" max="4" step="1" value="${state.flavor}">
        <div class="slider-labels"><span>Soft</span><span>Bright</span><span>Bold</span></div>
      </div>
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.getElementById("heat").oninput = (e) => { state.heat = +e.target.value; save(); };
    document.getElementById("flavor").oninput = (e) => { state.flavor = +e.target.value; save(); };
    document.getElementById("next").onclick = () => nextStep();
  }

  function renderSkip() {
    multiToggleScreen("Foods to skip", K.SKIP_FOODS, "skip");
  }

  function renderFavorites() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Setup</p>
      <h1>Old favorites</h1>
      <p class="muted">For each one, choose Keep, Rest, or New twist.</p>
      ${(K.FAVORITES || []).map((f) => {
        const cur = state.favorites[f.id] || "";
        return `<div class="card">
          <p class="dish-title"><span class="food-emoji">${f.emoji}</span>${esc(f.name)}</p>
          <div class="choice-grid cols-3" data-fav="${esc(f.id)}">
            ${["Keep", "Rest", "New twist"].map((x) => `<button type="button" class="choice${cur === x ? " on" : ""}" data-val="${esc(x)}">${esc(x)}</button>`).join("")}
          </div>
        </div>`;
      }).join("")}
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.querySelectorAll("[data-fav]").forEach((row) => {
      row.querySelectorAll(".choice").forEach((b) => {
        b.onclick = () => {
          state.favorites[row.dataset.fav] = b.dataset.val;
          save(); render();
        };
      });
    });
    document.getElementById("next").onclick = () => nextStep();
  }

  function renderNewness() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Setup</p>
      <h1>Try something new</h1>
      <div class="choice-grid" id="opts">
        ${["a little", "some", "a lot"].map((x) => choiceBtn(x, x.charAt(0).toUpperCase() + x.slice(1), state.newness)).join("")}
      </div>
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.querySelectorAll("#opts .choice").forEach((b) => {
      b.onclick = () => { state.newness = b.dataset.val; save(); render(); };
    });
    document.getElementById("next").onclick = () => nextStep();
  }

  function renderPortion() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Setup</p>
      <h1>Portion size</h1>
      <div class="choice-grid" id="opts">
        ${["smaller", "regular", "hearty"].map((x) => choiceBtn(x, x.charAt(0).toUpperCase() + x.slice(1), state.portion)).join("")}
      </div>
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.querySelectorAll("#opts .choice").forEach((b) => {
      b.onclick = () => { state.portion = b.dataset.val; save(); render(); };
    });
    document.getElementById("next").onclick = () => nextStep();
  }

  function renderFreezer() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Setup</p>
      <h1>Freezer use</h1>
      <p class="muted">Extra food freezes in single portions.</p>
      <div class="choice-grid" id="opts">
        ${["little", "some", "a lot"].map((x) => choiceBtn(x, x.charAt(0).toUpperCase() + x.slice(1), state.freezer)).join("")}
      </div>
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.querySelectorAll("#opts .choice").forEach((b) => {
      b.onclick = () => { state.freezer = b.dataset.val; save(); render(); };
    });
    document.getElementById("next").onclick = () => nextStep();
  }

  function renderBudget() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Setup</p>
      <h1>Budget</h1>
      
      <div class="choice-grid cols-2" id="on">
        ${choiceBtn("off", "Off", state.budgetOn ? "on" : "off")}
        ${choiceBtn("on", "On", state.budgetOn ? "on" : "off")}
      </div>
      <label class="field-label" for="bamt">Weekly budget amount in dollars</label>
      <input class="field" id="bamt" inputmode="decimal" value="${state.budgetAmt != null ? esc(state.budgetAmt) : ""}" placeholder="For example 80">
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.querySelectorAll("#on .choice").forEach((b) => {
      b.onclick = () => { state.budgetOn = b.dataset.val === "on"; save(); render(); };
    });
    document.getElementById("bamt").onchange = (e) => {
      const n = parseFloat(String(e.target.value).replace(/[^0-9.]/g, ""));
      state.budgetAmt = isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
      if (state.budgetAmt != null) state.budgetOn = true;
      save();
    };
    document.getElementById("next").onclick = () => nextStep();
  }

  function renderStores() {
    const selected = new Set(state.stores || []);
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Setup</p>
      <h1>Where you shop</h1>
      <div class="choice-grid" id="opts">
        ${(K.STORES || []).map((s) => `<button type="button" class="choice${selected.has(s) ? " on" : ""}" data-val="${esc(s)}">${esc(s)}</button>`).join("")}
      </div>
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.querySelectorAll("#opts .choice").forEach((b) => {
      b.onclick = () => {
        const v = b.dataset.val;
        const arr = state.stores || [];
        const i = arr.indexOf(v);
        if (i >= 0) arr.splice(i, 1); else arr.push(v);
        state.stores = arr;
        save(); render();
      };
    });
    document.getElementById("next").onclick = () => nextStep();
  }

  function renderMind() {
    multiToggleScreen(
      "Anything to keep in mind?",
      ["Less salt", "Steady carbs", "Heart healthy", "Softer foods", "Blood thinners", "Grapefruit"],
      "mind",
      "Not medical advice. Ask your doctor or pharmacist."
    );
  }

  function renderFresh() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Fresh start</p>
      <h1>Shelf by shelf</h1>
      <p class="muted">This stays on your phone. Choose Keep, Use first, or Toss. No counts are shown.</p>
      ${(K.SHELVES || []).map((sh) => {
        const note = state.shelfNotes[sh.id] || "";
        const choice = state.shelf[sh.id] || "";
        return `<div class="shelf">
          <h3>${esc(sh.label)}</h3>
          <label class="visually-hidden" for="note-${esc(sh.id)}">What is on this shelf</label>
          <input class="field" id="note-${esc(sh.id)}" data-shelf-note="${esc(sh.id)}" placeholder="What is here (optional)" value="${esc(note)}">
          <div class="shelf-actions" data-shelf="${esc(sh.id)}">
            ${["Keep", "Use first", "Toss"].map((x) => `<button type="button" class="choice${choice === x ? " on" : ""}" data-val="${esc(x)}">${esc(x)}</button>`).join("")}
          </div>
        </div>`;
      }).join("")}
      <div class="photo-opt">
        <p class="muted">Photos are optional only.</p>
        <button type="button" class="btn btn-ghost" id="opt-photo">${ico.camera}<span>Add an optional photo</span></button>
        <input type="file" accept="image/*" capture="environment" hidden id="photo-in">
      </div>
      <div class="btn-row"><button type="button" class="btn" id="next">Next</button></div>
    `;
    wireTop();
    document.querySelectorAll("[data-shelf-note]").forEach((inp) => {
      inp.onchange = () => { state.shelfNotes[inp.dataset.shelfNote] = inp.value.slice(0, 120); save(); };
    });
    document.querySelectorAll("[data-shelf]").forEach((row) => {
      row.querySelectorAll(".choice").forEach((b) => {
        b.onclick = () => { state.shelf[row.dataset.shelf] = b.dataset.val; save(); render(); };
      });
    });
    const pin = document.getElementById("photo-in");
    document.getElementById("opt-photo").onclick = () => pin.click();
    pin.onchange = () => { toast("Photo saved on this phone only."); pin.value = ""; };
    document.getElementById("next").onclick = () => nextStep();
  }

  function renderStarter() {
    const byWeek = [1, 2, 3].map((w) => ({
      w,
      items: (K.STARTER_PANTRY || []).filter((x) => x.week === w),
    }));
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <p class="steps-dot">Fresh start</p>
      <h1>Small starter pantry</h1>
      <p class="muted">Spread over two to three weeks. Add what you need when you shop.</p>
      ${byWeek.map(({ w, items }) => `
        <div class="card">
          <h3>Week ${w}</h3>
          <ul>${items.map((it) => `<li>${esc(it.name)}</li>`).join("")}</ul>
        </div>
      `).join("")}
      <div class="btn-row"><button type="button" class="btn" id="next">Build my week</button></div>
    `;
    wireTop();
    document.getElementById("next").onclick = () => {
      buildDefaultWeek();
      state.doneSetup = true;
      state.setupStep = "week";
      save();
      render();
    };
  }

  function rateOf(id) {
    return state.ratings[id] || 0;
  }

  function renderDayCard(day) {
    const FA = window.FoodArt;
    const dish = day.dishId ? dishById(day.dishId) : null;
    const open = state.openDay === day.i;
    const rate = dish ? rateOf(dish.id) : 0;
    const locked = !!state.weekLocked;
    let body = `<p class="meta-line">${esc(day.note || "")}</p>`;
    if (day.from) body += `<p class="meta-line">From ${esc(day.from)}.</p>`;
    if (dish && day.kind === "cook") {
      body += `<p class="meta-line">Seasoning: ${esc(dish.season)}. ${esc(dish.fiber)}.</p>`;
      if (dish.twist) body += `<div class="block"><h4>New twist on a classic</h4><p>${esc(dish.twist)}</p></div>`;
      if (dish.quickSwap) body += `<div class="block"><h4>Quick swap</h4><p>${esc(dish.quickSwap)}</p></div>`;
      body += kathySidesBlockHTML(day, dish);
    }
    if (open && dish) {
      body += `<div class="block"><h4>Parts</h4><ul>${(dish.parts || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`;
      body += `<div class="block"><h4>Steps</h4><ol id="steps-list">${(dish.steps || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
        <button type="button" class="btn btn-soft" id="hear-steps" style="margin-top:10px">${ico.speaker}<span>Hear it again</span></button></div>`;
      if (day.kind === "cook" && dish.prepPlan) {
        body += `<div class="block"><h4>Prep plan</h4>
          ${(dish.prepPlan || []).map((c) => `<div class="container-row"><strong>Container ${esc(c.container)} · ${esc(c.label)}</strong><span>${esc(c.note)}</span></div>`).join("")}
        </div>`;
        body += `<div class="block"><h4>Used again this week</h4>
          ${(dish.usedAgain || []).map((u) => `<div class="map-row"><span>${esc(u.item)}</span><span>${esc((u.days || []).join(", "))}</span></div>`).join("")}
        </div>`;
        if (dish.freeze) body += `<p class="muted">${esc(dish.freeze)}</p>`;
      }
    }
    if (open && dish && !locked) {
      body += `<div class="rates" data-rate="${esc(dish.id)}">
        <button type="button" class="${rate === -1 ? "on" : ""}" data-r="-1" aria-label="Thumbs down">👎</button>
        <button type="button" class="${rate === 1 ? "on" : ""}" data-r="1" aria-label="Thumbs up">👍</button>
        <button type="button" class="${rate === 2 ? "on" : ""}" data-r="2" aria-label="Favorite">⭐</button>
      </div>`;
    }
    if (open && !locked) {
      const log = state.log[day.i] || "";
      body += `<p class="field-label">Log it</p><div class="log-row" data-log="${day.i}">
        ${["Made", "Skipped", "Ate out"].map((x) => `<button type="button" class="choice${log === x ? " on" : ""}" data-val="${esc(x)}">${esc(x)}</button>`).join("")}
      </div>`;
    }
    const artKey =
      (dish && dish.name) ||
      day.dishId ||
      (day.kind === "light" && /egg/i.test(day.title || "") ? "eggs" : day.title);
    const art = FA ? FA.art(artKey || "default", "lg") : (day.emoji ? `<span class="food-emoji">${day.emoji}</span>` : "");
    const quietTitle = FA && FA.shortMealName ? FA.shortMealName(day.title, 4) : day.title;
    const quiet = day.kind === "leftover" || day.kind === "reuse" || day.kind === "light";
    const IA = window.ItemAlts;
    let meatRow = "";
    if (IA && dish && dish.protein && !locked) {
      const saved = state.meatAlts && state.meatAlts[day.i];
      const info = IA.meatAltsForDay(saved || dish.protein, day.title || dish.name);
      if (info.alts && info.alts.length) {
        const cur = saved || info.current || dish.protein;
        meatRow = `<div class="day-meat-row kathy-large" data-day-meat="${day.i}">
          <span class="meat-label">${esc(cur)}</span>${IA.chevronHTML(cur, true)}
          ${state.openAltId === "meat:" + day.i ? IA.bubbleHTML("Swap meat for", info.alts, cur, true) : ""}
        </div>`;
      }
    }
    return `<div class="card${day.kind === "cook" ? " is-cook-day" : ""}${quiet ? " is-quiet-day" : ""}" data-day="${day.i}" id="day-card-${day.i}">
      <div class="card-head">
        <span class="day-tag">${esc(day.name)}</span>
        ${locked ? "" : `<button type="button" class="linkish" data-swap="${day.i}">Swap</button>`}
      </div>
      <div class="day-art-row">
        <span aria-hidden="true">${art}</span>
        <p class="dish-title">${esc(quietTitle)}</p>
      </div>
      ${meatRow}
      ${body}
      <button type="button" class="linkish" data-toggle="${day.i}">${open ? "Hide details" : "Show details"}</button>
    </div>`;
  }

  function renderWeek() {
    if (!state.week) buildDefaultWeek();
    const C = window.WEEK_LOCK_COPY || {};
    const FA = window.FoodArt;
    const locked = !!state.weekLocked;
    // Source of truth: locked package when locked, else live week; always merge custom items
    const items = mergeGroceryWithCustoms(
      locked && state.lockedWeek && Array.isArray(state.lockedWeek.grocery)
        ? state.lockedWeek.grocery.map((g) => ({ id: g.id, name: g.name, qty: g.qty, aisle: g.aisle || "Other", why: [], custom: !!g.custom, section: "Menu for this week", price: g.price != null ? Number(g.price) : null }))
        : groceryFromWeek()
    );
    const checkedN = items.filter((it) => state.checked[it.id]).length;
    const hiddenHave = items.filter((it) => itemHaveIt(it.id)).length;
    const stripHtml = (() => {
      const WB = window.WeekBoard;
      const FA = window.FoodArt;
      if (!WB || !state.week) return "";
      const today = new Date().getDay();
      const focus = state.focusDay != null ? state.focusDay : state.openDay;
      const order = (FA && FA.MON_SUN_FROM_SUN0) || [1, 2, 3, 4, 5, 6, 0];
      const days = order.map((i) => {
        const d = state.week.days[i];
        const dish = d.dishId ? dishById(d.dishId) : null;
        // Diversify photos: prefer dish name / id over leftover "from Sunday" titles
        const artKey =
          (dish && dish.name) ||
          d.dishId ||
          (d.kind === "light" ? "light" : d.title);
        const boardNote =
          d.kind === "leftover" || d.kind === "reuse"
            ? "Leftovers"
            : d.kind === "light"
              ? "Light day"
              : d.kind === "cook"
                ? "Batch night"
                : "";
        return {
          index: i,
          short: d.name,
          name: d.name,
          title: d.title,
          note: boardNote || d.note,
          boardNote: boardNote,
          kind: d.kind,
          today: i === today,
          active: focus === i,
          artKey: artKey,
        };
      });
      return WB.boardHTML(days, {
        mood: "kathy",
        title: "Kathy's Table",
        weekTitle: weekDatesLabel(),
        id: "kathy-week-board",
        tucker: false,
      });
    })();
    const lockBlock = locked
      ? `<div class="week-lock-block" id="week-lock-block">
          <button type="button" class="btn-lock-week is-locked" id="lock-week-btn" disabled>${esc(C.locked || "Week locked")}</button>
          <button type="button" class="btn-edit-week" id="edit-week-btn">${esc(C.edit || "Edit week")}</button>
        </div>`
      : `<div class="week-lock-block" id="week-lock-block">
          <button type="button" class="btn-lock-week" id="lock-week-btn">${esc(C.lock || "Lock in this week")}</button>
          <p class="lock-helper">${esc(C.kathyHelper || "Saves your meals, swaps, sides, and list")}</p>
        </div>`;
    const app = document.getElementById("app");
    app.classList.add("has-week");
    app.classList.toggle("week-is-locked", locked);
    app.innerHTML = `
      ${topbar(false)}
      ${stripHtml}
      <div class="week-board-utils">
      <div class="week-actions" id="week-actions-row">
        ${locked ? "" : `<button type="button" class="linkish week-util" id="shuffle">${esc(C.shuffleMeals || "Shuffle meals")}</button>`}
        ${locked ? "" : `<button type="button" class="linkish week-util" id="random-meal">${esc(C.randomMeal || "Random meal")}</button>`}
        <button type="button" class="linkish week-util" id="redo-setup">Change setup</button>
      </div>
      ${lockBlock}
      <div class="week-utils-block" id="week-utils-block">
        <div class="btn-row" style="margin-bottom:10px">
          <button type="button" class="btn btn-ghost" id="jump-grocery">Grocery list</button>
        </div>
        <div class="btn-row two" style="margin-bottom:12px">
          <button type="button" class="btn btn-ghost" id="share-list">${ico.share}<span>Share list</span></button>
          <button type="button" class="btn btn-ghost" id="share-app">${esc(C.sharePlan || "Share this plan")}</button>
        </div>
      </div>
      </div>
      <div class="days-stack">
        ${((FA && FA.MON_SUN_FROM_SUN0) || [1,2,3,4,5,6,0]).map((i) => renderDayCard(state.week.days[i])).join("")}
      </div>
      <h2 id="grocery-title">Grocery list</h2>
      <div class="grocery-add-sticky" id="grocery-add-sticky">
        <button type="button" class="btn" id="add-custom-g">+ Add item</button>
        <button type="button" class="btn btn-ghost" id="hidden-have-btn-top" aria-pressed="${state.showHiddenHave ? "true" : "false"}">${state.showHiddenHave ? "Hide suppressed" : "Show hidden"}</button>
      </div>
      ${state.budgetOn && state.budgetAmt != null ? `<p class="muted">Your weekly budget target is about $${Number(state.budgetAmt).toFixed(0)}.</p>` : ""}
      <p class="muted" id="grocery-count">${checkedN} checked · ${items.length - checkedN} left${hiddenHave ? ` · ${hiddenHave} Have it` : ""}</p>
      <div id="grocery-list-body" class="kathy-large">
      ${grocerySectionsHTML(items)}
      </div>
      ${groceryEstTotalHTML(items)}
      <div class="grocery-footer-row" role="group" aria-label="Grocery list actions">
        <button type="button" class="btn btn-ghost" id="clear-checks">Uncheck all grocery items</button>
        <button type="button" class="btn btn-ghost" id="footer-share-list">Share list</button>
        <button type="button" class="btn btn-ghost" id="generate-list">Generate list</button>
      </div>
    `;
    wireTop();
    const sh = document.getElementById("shuffle");
    if (sh) sh.onclick = () => { if (!state.weekLocked) shuffleWeek(); };
    const rm = document.getElementById("random-meal");
    if (rm) rm.onclick = () => randomMealForFocus();
    const redo = document.getElementById("redo-setup");
    if (redo) redo.onclick = () => {
      if (state.weekLocked) { toast("Unlock the week before changing setup."); return; }
      state.doneSetup = false;
      state.setupStep = "first";
      state._greeted = false;
      save(); render();
    };
    const lockBtn = document.getElementById("lock-week-btn");
    if (lockBtn && !locked) lockBtn.onclick = () => openLockSheet(groceryFromWeek());
    const editBtn = document.getElementById("edit-week-btn");
    if (editBtn) editBtn.onclick = () => unlockWeek();
    const jumpG = document.getElementById("jump-grocery");
    if (jumpG) jumpG.onclick = () => {
      regenerateGrocery(false);
      const el = document.getElementById("grocery-title");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.getElementById("share-app").onclick = () => sharePlanLink();
    document.getElementById("share-list").onclick = () => shareGrocery(currentGroceryItems());
    document.getElementById("footer-share-list").onclick = () => shareGrocery(currentGroceryItems());
    document.getElementById("clear-checks").onclick = () => { state.checked = {}; save(); render(); toast("Unchecked all grocery items"); };
    document.getElementById("generate-list").onclick = () => regenerateGrocery(true);
    const hideTop = document.getElementById("hidden-have-btn-top");
    if (hideTop) hideTop.onclick = () => {
      state.showHiddenHave = !state.showHiddenHave;
      save(); render();
      toast(state.showHiddenHave ? "Showing Have it items" : "Have it items hidden again");
    };
    const addG = document.getElementById("add-custom-g");
    if (addG) addG.onclick = () => openKathyAddItem("Menu extras");
    document.querySelectorAll("[data-add-section]").forEach((b) => {
      b.onclick = () => openKathyAddItem(b.dataset.addSection);
    });
    document.querySelectorAll("[data-stand-toggle]").forEach((b) => {
      b.onclick = () => {
        const kind = b.dataset.standToggle;
        const name = b.dataset.standName;
        const SL = window.StandingLists;
        const listKey = kind === "stock" ? "stockProduce" : "munchies";
        const arr = state[listKey] || [];
        const exists = arr.some((x) => (x.name || "").toLowerCase() === name.toLowerCase());
        if (exists) {
          state[listKey] = arr.filter((x) => (x.name || "").toLowerCase() !== name.toLowerCase());
        } else {
          const id = kind === "stock" ? (SL && SL.stockId(name)) : (SL && SL.munchId(name));
          state[listKey] = arr.concat([{ id: id || kind + "-" + Date.now(), name, qty: "1", price: null, standing: true, kind }]);
        }
        save(); render();
      };
    });
    document.querySelectorAll("[data-have]").forEach((b) => {
      b.onclick = (e) => {
        e.preventDefault();
        const id = b.dataset.have;
        const item = items.find((x) => x.id === id) || { id, name: id };
        if (itemHaveIt(id)) {
          setHaveIt(id, false);
          toast("Still need it. Back on the list");
        } else {
          setHaveIt(id, true, item);
          const hint = haveItHint(id);
          toast(hint ? ("Have it. " + hint) : "Have it. Hidden for a while");
        }
        save(); render();
      };
    });
    document.querySelectorAll("[data-alt-item]").forEach((b) => {
      b.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = b.dataset.altItem;
        state.openAltId = state.openAltId === id ? null : id;
        save(); render();
      };
    });
    document.querySelectorAll(".item-alt-popt[data-alt]").forEach((b) => {
      b.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pop = b.closest(".g-item, .day-meat-row");
        const itemBtn = pop && pop.querySelector("[data-alt-item]");
        const meatHost = b.closest("[data-day-meat]");
        if (meatHost) {
          const dayI = +meatHost.dataset.dayMeat;
          if (!state.meatAlts) state.meatAlts = {};
          state.meatAlts[dayI] = b.dataset.alt;
          // Update matching grocery protein lines
          const dish = state.week && state.week.days[dayI] && dishById(state.week.days[dayI].dishId);
          if (dish && dish.grocery) {
            if (!state.itemAlts) state.itemAlts = {};
            dish.grocery.forEach((g) => {
              if (/meat|chicken|beef|pork|fish|salmon|turkey|bacon|steak|shrimp|protein/i.test((g.aisle || "") + " " + (g.name || "")) ||
                  (dish.protein && (g.name || "").toLowerCase().includes(String(dish.protein).toLowerCase().split(" ")[0]))) {
                const gid = "g-" + (g.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
                state.itemAlts[gid] = b.dataset.alt;
              }
            });
          }
          state.openAltId = null;
          save(); render();
          toast("Meat swapped");
          return;
        }
        const id = itemBtn ? itemBtn.dataset.altItem : state.openAltId;
        if (!id) return;
        if (!state.itemAlts) state.itemAlts = {};
        state.itemAlts[id] = b.dataset.alt;
        state.openAltId = null;
        save(); render();
        toast("Swapped to " + b.dataset.alt);
      };
    });
    document.querySelectorAll("[data-day-meat] [data-alt-open]").forEach((chip) => {
      chip.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const host = chip.closest("[data-day-meat]");
        const dayI = host && host.dataset.dayMeat;
        const key = "meat:" + dayI;
        state.openAltId = state.openAltId === key ? null : key;
        save(); render();
      };
    });
    document.querySelectorAll("[data-del-custom]").forEach((b) => {
      b.onclick = (e) => {
        e.preventDefault();
        const id = b.dataset.delCustom;
        const sec = b.dataset.delSection || "";
        if (sec === "Stock produce") state.stockProduce = (state.stockProduce || []).filter((x) => x.id !== id);
        else if (sec === "Miscellaneous munchies") state.munchies = (state.munchies || []).filter((x) => x.id !== id);
        else state.customGrocery = (state.customGrocery || []).filter((x) => x.id !== id);
        delete state.checked[id];
        if (state.haveIt) delete state.haveIt[id];
        if (state.weekLocked && state.lockedWeek) {
          state.lockedWeek.customGrocery = JSON.parse(JSON.stringify(state.customGrocery || []));
          state.lockedWeek.stockProduce = JSON.parse(JSON.stringify(state.stockProduce || []));
          state.lockedWeek.munchies = JSON.parse(JSON.stringify(state.munchies || []));
        }
        save(); render();
      };
    });
    document.querySelectorAll("[data-strip-day]").forEach((b) => {
      b.onclick = () => {
        const i = +b.dataset.stripDay;
        state.focusDay = i;
        state.openDay = i;
        save();
        render();
        const el = document.getElementById("day-card-" + i);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });
    document.querySelectorAll("[data-gid]").forEach((cb) => {
      cb.onchange = () => {
        if (cb.checked) state.checked[cb.dataset.gid] = true;
        else delete state.checked[cb.dataset.gid];
        save(); render();
      };
    });
    document.querySelectorAll("[data-toggle]").forEach((b) => {
      b.onclick = () => {
        const i = +b.dataset.toggle;
        state.openDay = state.openDay === i ? null : i;
        state.focusDay = i;
        state.hearStep = 0;
        save(); render();
      };
    });
    document.querySelectorAll("[data-swap]").forEach((b) => {
      b.onclick = () => { if (!state.weekLocked) openSwap(+b.dataset.swap); };
    });
    document.querySelectorAll("[data-side-pick]").forEach((b) => {
      b.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (state.weekLocked) return;
        const dayKey = b.dataset.sidePick;
        const id = b.dataset.sideId;
        const cur = getDaySideSel(dayKey);
        if (cur.includes(id)) setDaySideSel(dayKey, cur.filter((x) => x !== id));
        else setDaySideSel(dayKey, [...cur, id]);
        save();
        render();
      };
    });
    document.querySelectorAll("[data-regen-day]").forEach((b) => {
      b.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        regenerateKathySideSlot(b.dataset.regenDay, b.dataset.regenSlot);
      };
    });
    document.querySelectorAll("[data-rate]").forEach((row) => {
      row.querySelectorAll("button").forEach((btn) => {
        btn.onclick = () => {
          if (state.weekLocked) return;
          const id = row.dataset.rate;
          const r = +btn.dataset.r;
          state.ratings[id] = state.ratings[id] === r ? 0 : r;
          save(); render();
        };
      });
    });
    document.querySelectorAll("[data-log]").forEach((row) => {
      row.querySelectorAll(".choice").forEach((btn) => {
        btn.onclick = () => {
          if (state.weekLocked) return;
          const i = +row.dataset.log;
          state.log[i] = state.log[i] === btn.dataset.val ? "" : btn.dataset.val;
          save(); render();
        };
      });
    });
    const hear = document.getElementById("hear-steps");
    if (hear) {
      hear.onclick = () => {
        const day = state.week.days[state.openDay];
        const dish = day && day.dishId ? dishById(day.dishId) : null;
        if (!dish || !dish.steps || !dish.steps.length) return;
        const steps = dish.steps;
        let i = 0;
        const next = () => {
          if (i >= steps.length) { toast("Those were all the steps."); return; }
          speak(`Step ${i + 1}. ${steps[i]}`, () => { i += 1; next(); });
        };
        next();
      };
    }
  }

  function openKathyAddItem(defaultSection) {
    const AIS = window.AddItemSheet;
    const SL = window.StandingLists;
    if (!AIS) { toast("Add item sheet unavailable"); return; }
    AIS.open({
      defaultSection: defaultSection || "Miscellaneous munchies",
      large: true,
      priceLabel: "Price",
      priceRequired: (defaultSection || "Miscellaneous munchies") === "Menu extras",
      priceHint: (defaultSection || "") === "Menu extras"
        ? "Enter a dollar amount so it counts in your grocery total."
        : "Leave blank if you do not know.",
      onAdd: (item) => {
        const section = item.section;
        if (section === "Stock produce") {
          const id = (SL && SL.stockId(item.name)) || "stock-" + Date.now().toString(36);
          if (!state.stockProduce) state.stockProduce = [];
          state.stockProduce.push({ id, name: item.name, qty: item.qty || "1", price: item.price, standing: true, kind: "stock" });
        } else if (section === "Miscellaneous munchies") {
          const id = (SL && SL.munchId(item.name)) || "munch-" + Date.now().toString(36);
          if (!state.munchies) state.munchies = [];
          state.munchies.push({ id, name: item.name, qty: item.qty || "1", price: item.price, standing: true, kind: "munch" });
        } else {
          const id = "cg:" + Date.now().toString(36);
          if (!state.customGrocery) state.customGrocery = [];
          state.customGrocery.push({
            id, name: item.name, qty: item.qty || "1", aisle: "Other", custom: true,
            price: item.price, section: "Menu extras",
          });
        }
        if (state.weekLocked && state.lockedWeek) {
          state.lockedWeek.customGrocery = JSON.parse(JSON.stringify(state.customGrocery || []));
          state.lockedWeek.stockProduce = JSON.parse(JSON.stringify(state.stockProduce || []));
          state.lockedWeek.munchies = JSON.parse(JSON.stringify(state.munchies || []));
        }
        save();
        toast("Added " + item.name);
        render();
      },
    });
  }

  function mergeGroceryWithCustoms(base) {
    const SL = window.StandingLists;
    const stock = (state.stockProduce || []).map((c) => ({
      id: c.id,
      name: (state.itemAlts && state.itemAlts[c.id]) || c.name,
      baseName: c.name,
      qty: c.qty || "1",
      aisle: "Produce",
      why: [],
      custom: false,
      standing: true,
      section: "Stock produce",
      price: c.price != null ? Number(c.price) : null,
    }));
    const munch = (state.munchies || []).map((c) => ({
      id: c.id,
      name: (state.itemAlts && state.itemAlts[c.id]) || c.name,
      baseName: c.name,
      qty: c.qty || "1",
      aisle: "Other",
      why: [],
      custom: false,
      standing: true,
      section: "Miscellaneous munchies",
      price: c.price != null ? Number(c.price) : null,
    }));
    const customs = (state.customGrocery || []).map((c) => ({
      id: c.id,
      name: (state.itemAlts && state.itemAlts[c.id]) || c.name,
      baseName: c.name,
      qty: c.qty || "1",
      aisle: c.aisle || "Other",
      why: [],
      custom: true,
      section: "Menu extras",
      price: c.price != null ? Number(c.price) : null,
    }));
    const seen = new Set();
    const out = [];
    (base || []).forEach((x) => {
      if (seen.has(x.id)) return;
      seen.add(x.id);
      out.push({ ...x, custom: !!x.custom, section: x.section || "Menu for this week" });
    });
    stock.concat(munch).concat(customs).forEach((c) => {
      if (seen.has(c.id)) return;
      seen.add(c.id);
      out.push(c);
    });
    void SL;
    return out;
  }

  function currentGroceryItems() {
    let base;
    if (state.weekLocked && state.lockedWeek && Array.isArray(state.lockedWeek.grocery)) {
      base = state.lockedWeek.grocery.map((g) => ({
        id: g.id, name: g.name, qty: g.qty, aisle: g.aisle || "Other", why: [], custom: !!g.custom,
        section: "Menu for this week",
        price: g.price != null ? Number(g.price) : null,
      })).filter((g) => !g.custom);
    } else {
      base = groceryFromWeek();
    }
    return mergeGroceryWithCustoms(base);
  }

  function regenerateGrocery(showToastMsg) {
    // Rebuild Menu for this week only; keep stock, munchies, customs, Have-it
    const generated = groceryFromWeek();
    if (state.weekLocked && state.lockedWeek) {
      state.lockedWeek.grocery = generated.map((it) => ({ id: it.id, name: it.name, qty: it.qty, aisle: it.aisle, price: it.price }));
      state.lockedWeek.week = JSON.parse(JSON.stringify(state.week));
      state.lockedWeek.customGrocery = JSON.parse(JSON.stringify(state.customGrocery || []));
      state.lockedWeek.stockProduce = JSON.parse(JSON.stringify(state.stockProduce || []));
      state.lockedWeek.munchies = JSON.parse(JSON.stringify(state.munchies || []));
    }
    save();
    if (showToastMsg) toast("Menu for this week refreshed. Stock and munchies kept");
    render();
  }

  function openSwap(dayIndex) {
    if (state.weekLocked) { toast("Unlock the week to swap meals."); return; }
    const DAY_MEAL_MAX = 7;
    const pool = filterPool().slice(0, DAY_MEAL_MAX);
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <h1>Swap ${esc(DN[dayIndex])}</h1>
      <p class="muted">Up to ${DAY_MEAL_MAX} dinners from your pool.</p>
      <div class="btn-row">
        <button type="button" class="btn btn-ghost" data-light="1">Make it a light day</button>
      </div>
      ${pool.map((d) => `
        <button type="button" class="btn btn-soft" style="margin-bottom:8px;justify-content:flex-start" data-pick="${esc(d.id)}">
          <span class="food-emoji">${d.emoji}</span><span>${esc(d.name)}</span>
        </button>
      `).join("")}
    `;
    wireTop();
    document.getElementById("back-btn").onclick = () => render();
    document.querySelector("[data-light]").onclick = () => {
      state.week.days[dayIndex] = { i: dayIndex, name: DN[dayIndex], kind: "light", dishId: null, title: "Light day", emoji: "🥗", note: "Breakfast and lunch stay light with no cooking.", light: true };
      save(); toast("Swapped to a light day."); render();
    };
    document.querySelectorAll("[data-pick]").forEach((b) => {
      b.onclick = () => {
        const d = dishById(b.dataset.pick);
        state.week.days[dayIndex] = {
          i: dayIndex, name: DN[dayIndex], kind: "cook", dishId: d.id, title: d.name, emoji: d.emoji,
          note: "Batch night. Follow the prep plan and pack labeled containers.", light: false,
        };
        save(); toast("Dinner swapped."); render();
      };
    });
  }

  async function shareGrocery(items) {
    const lines = ["Kathy's Table grocery list", ""];
    items.forEach((it) => {
      lines.push(`${state.checked[it.id] ? "[x]" : "[ ]"} ${it.name}${it.qty ? " (" + it.qty + ")" : ""}`);
    });
    const text = lines.join("\n");
    try {
      if (navigator.share) { await navigator.share({ title: "Grocery list", text }); return; }
    } catch (err) { if (err && err.name === "AbortError") return; }
    try {
      await navigator.clipboard.writeText(text);
      toast("List copied.");
    } catch (_) {
      toast("Could not share. Copy is unavailable.");
    }
  }

  async function sharePlanLink() {
    const weekPayload = state.weekLocked && state.lockedWeek ? state.lockedWeek.week : state.week;
    const payload = {
      n: state.name, p: state.people, prep: state.prepMinutes, c: state.cookDays,
      comfort: state.comfort, heat: state.heat, flavor: state.flavor,
      skip: state.skip, fav: state.favorites, newness: state.newness,
      portion: state.portion, freezer: state.freezer, stores: state.stores, mind: state.mind,
      week: weekPayload,
      locked: !!state.weekLocked,
    };
    let url = location.href.split("#")[0];
    try {
      const enc = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      url = url + "#k=" + enc;
    } catch (_) {}
    const text = "Kathy's Table week plan";
    try {
      if (navigator.share) { await navigator.share({ title: "Kathy's Table", text, url }); return; }
    } catch (err) { if (err && err.name === "AbortError") return; }
    try {
      await navigator.clipboard.writeText(text + "\n" + url);
      toast("Share link copied.");
    } catch (_) {
      toast("Could not copy the share link.");
    }
  }

  function tryLoadShare() {
    const hash = location.hash.replace(/^#/, "");
    if (!hash.startsWith("k=")) return;
    try {
      const raw = decodeURIComponent(escape(atob(hash.slice(2))));
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return;
      if (data.n != null) state.name = String(data.n).slice(0, 40);
      if (data.p) state.people = data.p;
      if (data.prep) state.prepMinutes = data.prep;
      if (data.c) state.cookDays = data.c;
      if (data.week) { state.week = data.week; state.doneSetup = true; state.setupStep = "week"; }
      save();
      history.replaceState(null, "", location.pathname + location.search);
      toast("Shared week loaded.");
    } catch (_) {}
  }

  function render() {
    // Home only when explicitly requested — never force remount on reload
    if (state.showHome === true) {
      renderHome();
      return;
    }
    if (state.doneSetup || state.setupStep === "week") {
      renderWeek();
      return;
    }
    const map = {
      first: renderFirst,
      comfort: renderComfort,
      heat: renderHeat,
      skip: renderSkip,
      favorites: renderFavorites,
      newness: renderNewness,
      portion: renderPortion,
      freezer: renderFreezer,
      budget: renderBudget,
      stores: renderStores,
      mind: renderMind,
      fresh: renderFresh,
      starter: renderStarter,
    };
    (map[state.setupStep] || renderFirst)();
  }

  // boot — restore mid-flow from localStorage; home only for true first visit
  tryLoadShare();
  if (!state.doneSetup && !state.week && (!state.setupStep || state.setupStep === "first") &&
      !(state.customGrocery && state.customGrocery.length) &&
      !(state.stockProduce && state.stockProduce.length)) {
    // True first visit: show home hero once
    state.showHome = true;
  } else {
    state.showHome = false;
  }
  if ((K.DISHES || []).length < 16) {
    console.error("[kathy] need at least 16 dishes, have", (K.DISHES || []).length);
  } else {
    console.log("[kathy] dish pool", K.DISHES.length);
  }
  render();
})();
