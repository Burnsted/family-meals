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
    };
  }

  let state = loadState();
  let speakTimer = null;
  let recog = null;

  function loadState() {
    try {
      const j = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (!j || typeof j !== "object") return defaultState();
      return { ...defaultState(), ...j, skip: j.skip || [], comfort: j.comfort || [], mind: j.mind || [], stores: j.stores || ["Aldi"], favorites: j.favorites || {}, shelf: j.shelf || {}, checked: j.checked || {}, ratings: j.ratings || {}, log: j.log || {} };
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
      toast("Listening…");
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

  function sidePhotosFor(dish) {
    // Optional side photo ideas from the shared sides folder (bare captions, no pill frames).
    const map = {
      lemon_chicken: [{ src: "img/sides/potatoes.webp", alt: "Potatoes" }, { src: "img/sides/carrots-ranch.webp", alt: "Carrots" }],
      turkey_chili: [{ src: "img/sides/black-beans.webp", alt: "Beans" }, { src: "img/sides/side-salad.webp", alt: "Side salad" }],
      herb_salmon: [{ src: "img/sides/broccoli.webp", alt: "Broccoli" }, { src: "img/sides/sweet-potato.webp", alt: "Sweet potato" }],
      chicken_soup: [{ src: "img/sides/green-beans.webp", alt: "Green beans" }, { src: "img/sides/rice.webp", alt: "Rice" }],
      white_fish: [{ src: "img/sides/green-beans.webp", alt: "Green beans" }, { src: "img/sides/rice.webp", alt: "Rice" }],
      chicken_rice: [{ src: "img/sides/rice.webp", alt: "Rice" }, { src: "img/sides/broccoli.webp", alt: "Broccoli" }],
      shepherd_pie: [{ src: "img/sides/potatoes.webp", alt: "Potatoes" }, { src: "img/sides/side-salad.webp", alt: "Side salad" }],
    };
    return map[dish && dish.id] || [{ src: "img/sides/side-salad.webp", alt: "Side salad" }];
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
    // Prefer sample pair when 2 cook days and both available
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
          note: "Batch cook day. Follow the prep plan and pack labeled containers.",
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
    const pool = filterPool().sort(() => Math.random() - 0.5);
    if (pool.length < 2) { toast("Not enough dishes after your skip list."); return; }
    const cookIdx = pickCookDays(state.cookDays || 2);
    const cookDishes = cookIdx.map((_, i) => pool[i % pool.length]);
    const days = DN.map((name, i) => {
      const cookAt = cookIdx.indexOf(i);
      if (cookAt >= 0) {
        const d = cookDishes[cookAt];
        return { i, name, kind: "cook", dishId: d.id, title: d.name, emoji: d.emoji, note: "Batch cook day. Follow the prep plan and pack labeled containers.", light: false };
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
      map.set(key, { id: "g-" + key.replace(/[^a-z0-9]+/g, "-"), name: g.name, qty: g.qty || "", aisle: g.aisle || "Other", why: why ? [why] : [], estimate: true });
    };
    // Starter pantry week 1 items if fresh start incomplete notes
    (K.STARTER_PANTRY || []).filter((x) => x.week === 1).forEach((x) => add({ name: x.name, aisle: x.aisle, qty: "" }, "Starter pantry"));
    state.week.days.forEach((day) => {
      if (day.kind !== "cook" || !day.dishId) return;
      const d = dishById(day.dishId);
      if (!d) return;
      (d.grocery || []).forEach((g) => add(g, day.name));
    });
    // Light staples
    add({ name: "Plain yogurt", aisle: "Dairy", qty: "1 quart" }, "Light breakfasts");
    add({ name: "Fruit in season", aisle: "Produce", qty: "" }, "Light breakfasts");
    add({ name: "Whole grain bread", aisle: "Bread", qty: "1 loaf" }, "Light lunches");
    return [...map.values()];
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
    return `<div class="topbar">
      ${showBack ? `<button type="button" class="ico-btn" id="back-btn" aria-label="Back">${ico.back}</button>` : `<span></span>`}
      <div style="flex:1;text-align:center"><p class="brand">Kathy's Table</p></div>
      <button type="button" class="ico-btn" id="theme-btn" aria-label="Toggle theme">${ico.gear}</button>
    </div>`;
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

  function renderFirst() {
    const q = "Cooking for how many people? How much prep time per cook day? How many cook days a week?";
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
      <p class="field-label">Prep time per cook day</p>
      <div class="choice-grid cols-3" id="prep">
        ${choiceBtn(10, "10 minutes", state.prepMinutes)}
        ${choiceBtn(20, "20 minutes", state.prepMinutes)}
        ${choiceBtn(30, "30 minutes", state.prepMinutes)}
      </div>
      <p class="field-label">Cook days a week</p>
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
      <p class="muted">Grocery totals are a rough estimate until you upload receipts.</p>
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
    const dish = day.dishId ? dishById(day.dishId) : null;
    const open = state.openDay === day.i;
    const rate = dish ? rateOf(dish.id) : 0;
    let body = `<p class="meta-line">${esc(day.note || "")}</p>`;
    if (day.from) body += `<p class="meta-line">From ${esc(day.from)}.</p>`;
    if (dish && day.kind === "cook") {
      body += `<p class="meta-line">About ${dish.prepMinutes} minutes prep${dish.cookMinutes ? `, then about ${dish.cookMinutes} minutes in the ${dish.oven ? "oven" : "pot"}` : ""}.</p>`;
      body += `<p class="meta-line">Seasoning: ${esc(dish.season)}. ${esc(dish.fiber)}.</p>`;
      if (dish.twist) body += `<div class="block"><h4>New twist on a classic</h4><p>${esc(dish.twist)}</p></div>`;
      if (dish.quickSwap) body += `<div class="block"><h4>Quick swap</h4><p>${esc(dish.quickSwap)}</p></div>`;
      const sides = sidePhotosFor(dish);
      if (sides.length) {
        body += `<div class="side-photos" aria-label="Side ideas">${sides.map((s) => `<figure><img src="${esc(s.src)}" alt="${esc(s.alt)}" loading="lazy"><figcaption>${esc(s.alt)}</figcaption></figure>`).join("")}</div>`;
      }
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
    if (dish) {
      body += `<div class="rates" data-rate="${esc(dish.id)}">
        <button type="button" class="${rate === -1 ? "on" : ""}" data-r="-1" aria-label="Thumbs down">👎</button>
        <button type="button" class="${rate === 1 ? "on" : ""}" data-r="1" aria-label="Thumbs up">👍</button>
        <button type="button" class="${rate === 2 ? "on" : ""}" data-r="2" aria-label="Favorite">❤️</button>
      </div>`;
    }
    const log = state.log[day.i] || "";
    body += `<p class="field-label">Log it</p><div class="log-row" data-log="${day.i}">
      ${["Made", "Skipped", "Ate out"].map((x) => `<button type="button" class="choice${log === x ? " on" : ""}" data-val="${esc(x)}">${esc(x)}</button>`).join("")}
    </div>`;

    return `<div class="card" data-day="${day.i}">
      <div class="card-head">
        <span class="day-tag">${esc(day.name)}</span>
        ${day.kind === "cook" ? `<span class="cook-badge">Cook day</span>` : ""}
        <button type="button" class="linkish" data-swap="${day.i}">Swap</button>
      </div>
      <p class="dish-title">${day.emoji ? `<span class="food-emoji">${day.emoji}</span>` : ""}${esc(day.title)}</p>
      ${body}
      <button type="button" class="linkish" data-toggle="${day.i}">${open ? "Hide details" : "Show details"}</button>
    </div>`;
  }

  function renderWeek() {
    if (!state.week) buildDefaultWeek();
    const items = groceryFromWeek();
    const checkedN = items.filter((it) => state.checked[it.id]).length;
    const byAisle = {};
    items.forEach((it) => { (byAisle[it.aisle] = byAisle[it.aisle] || []).push(it); });
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(false)}
      <p class="kicker">Cooking for ${state.people} · ${state.cookDays} cook day${state.cookDays === 1 ? "" : "s"} · ${state.prepMinutes} minutes prep</p>
      <div class="week-actions">
        <button type="button" class="linkish" id="shuffle">${ico.shuffle} Shuffle</button>
        <button type="button" class="linkish" id="share-app">${ico.share} Share plan link</button>
        <button type="button" class="linkish" id="redo-setup">Change setup</button>
      </div>
      <h2>This week</h2>
      ${state.week.days.map(renderDayCard).join("")}
      <h2>Grocery list</h2>
      <div class="est-note">Rough estimate only until you upload receipts. Store prices are not invented here.</div>
      ${state.budgetOn && state.budgetAmt != null ? `<p class="muted">Your weekly budget target is about $${Number(state.budgetAmt).toFixed(0)}.</p>` : ""}
      <div class="btn-row two" style="margin-bottom:12px">
        <button type="button" class="btn btn-ghost" id="share-list">${ico.share}<span>Share list</span></button>
        <button type="button" class="btn btn-ghost" id="clear-checks" ${checkedN ? "" : "hidden"}>Uncheck all grocery items</button>
      </div>
      <p class="muted">${checkedN} checked · ${items.length - checkedN} left</p>
      ${Object.keys(byAisle).map((aisle) => `
        <p class="g-aisle">${esc(aisle)}</p>
        ${byAisle[aisle].map((it) => `
          <label class="g-item${state.checked[it.id] ? " checked" : ""}">
            <input type="checkbox" data-gid="${esc(it.id)}" ${state.checked[it.id] ? "checked" : ""}>
            <span><span class="g-name">${esc(it.name)}</span>${it.qty ? `<span class="muted"> · ${esc(it.qty)}</span>` : ""}</span>
          </label>
        `).join("")}
      `).join("")}
    `;
    wireTop();
    document.getElementById("shuffle").onclick = () => shuffleWeek();
    document.getElementById("redo-setup").onclick = () => {
      state.doneSetup = false;
      state.setupStep = "first";
      state._greeted = false;
      save(); render();
    };
    document.getElementById("share-app").onclick = () => sharePlanLink();
    document.getElementById("share-list").onclick = () => shareGrocery(items);
    const clr = document.getElementById("clear-checks");
    if (clr) clr.onclick = () => { state.checked = {}; save(); render(); toast("Unchecked all grocery items"); };
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
        state.hearStep = 0;
        save(); render();
      };
    });
    document.querySelectorAll("[data-swap]").forEach((b) => {
      b.onclick = () => openSwap(+b.dataset.swap);
    });
    document.querySelectorAll("[data-rate]").forEach((row) => {
      row.querySelectorAll("button").forEach((btn) => {
        btn.onclick = () => {
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

  function openSwap(dayIndex) {
    const pool = filterPool();
    const app = document.getElementById("app");
    app.innerHTML = `
      ${topbar(true)}
      <h1>Swap ${esc(DN[dayIndex])}</h1>
      <p class="muted">Pick a batch dish from your pool.</p>
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
          note: "Batch cook day. Follow the prep plan and pack labeled containers.", light: false,
        };
        save(); toast("Dinner swapped."); render();
      };
    });
  }

  async function shareGrocery(items) {
    const lines = ["Kathy's Table grocery list", "Rough estimate only until receipts are uploaded.", ""];
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
    const payload = {
      n: state.name, p: state.people, prep: state.prepMinutes, c: state.cookDays,
      comfort: state.comfort, heat: state.heat, flavor: state.flavor,
      skip: state.skip, fav: state.favorites, newness: state.newness,
      portion: state.portion, freezer: state.freezer, stores: state.stores, mind: state.mind,
      week: state.week,
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

  // boot
  tryLoadShare();
  if ((K.DISHES || []).length < 16) {
    console.error("[kathy] need at least 16 dishes, have", (K.DISHES || []).length);
  } else {
    console.log("[kathy] dish pool", K.DISHES.length);
  }
  render();
})();
