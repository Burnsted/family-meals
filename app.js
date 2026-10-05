(() => {
  "use strict";

  const STORAGE_KEY = "family-meals-state-v1";
  const CATEGORIES = ["Tucker lunchbox", "Protein", "Produce", "Dairy", "Pantry"];

  /** Same Mon–Fri kit for Option A and Option B — not dinner leftovers */
  const TUCKER_GROCERIES = [
    {
      id: "t-yogurt",
      category: "Tucker lunchbox",
      name: "Yogurt cups ×5+ (Chobani multipack)",
      price: "",
      hint: "Count packs Sun night; restock midweek if depleting",
    },
    {
      id: "t-cheese",
      category: "Tucker lunchbox",
      name: "Cheese sticks ×5+ (Polly-O / Cheese Heads)",
      price: "",
      hint: "Already stocked — buy if not enough for 5 days",
    },
    {
      id: "t-pretzels",
      category: "Tucker lunchbox",
      name: "Pretzels and/or Pringles (if low)",
      price: "",
      hint: "Snyder’s / Pringles already in pantry — portion for 5 days",
    },
    {
      id: "t-fruit-snack",
      category: "Tucker lunchbox",
      name: "Fruit snacks ×5+",
      price: "",
      hint: "Restock midweek as packs deplete",
    },
    {
      id: "t-beef-stick",
      category: "Tucker lunchbox",
      name: "Natural beef sticks (red/white pack) ×5+",
      price: "",
      hint: "Likely need — check pantry; buy ahead for the week",
    },
    {
      id: "t-juice",
      category: "Tucker lunchbox",
      name: "Apple juice boxes if Apple & Eve running low",
      price: "",
      hint: "Apple & Eve boxes already on hand — top up for 5 days",
    },
  ];

  const PLANS = {
    A: {
      id: "A",
      label: "Option A",
      blurb: "Rotisserie · tacos · Alfredo · chili",
      budget: "~$100–130",
      days: [
        {
          id: "mon",
          day: "Monday",
          short: "Mon",
          icon: "👨‍🍳",
          mealEmoji: "🍗",
          dinner: "Rotisserie + rice/potatoes + salad",
          adultLunch: "adult lunch → chicken wrap/sandwich (opt)",
          recipe: {
            title: "Rotisserie plate",
            have: "rotisserie, Fresh Express salad or veg, rice/potatoes, dressing, butter",
            steps: [
              "Warm rotisserie (about 10 min at 350°F).",
              "Rice or potatoes on the side.",
              "Salad + dressing; lemon optional.",
            ],
            enjoy: "Warm the meat; butter on potatoes; lemon on salad if you like.",
            buy: "rotisserie if not already home",
          },
        },
        {
          id: "tue",
          day: "Tuesday",
          short: "Tue",
          icon: "🌮",
          mealEmoji: "🌮",
          dinner: "Taco night",
          adultLunch: "adult lunch → leftover taco meat quesadilla (opt)",
          recipe: {
            title: "Taco night",
            have: "tortillas, McCormick taco seasoning, Sargento taco cheese, salsa, Bush’s taco beans",
            steps: [
              "Brown beef or shred leftover chicken + taco packet + water/broth.",
              "Warm tortillas; cheese, salsa, Bush’s beans on the side.",
            ],
            enjoy: "Toast tortillas in a dry pan; melt cheese over warm beans.",
            buy: "ground beef if not using leftover chicken; onion optional",
          },
        },
        {
          id: "wed",
          day: "Wednesday",
          short: "Wed",
          icon: "⭐",
          mealEmoji: "🧀",
          dinner: "Taco rebuild (nachos / bowls / quesadillas)",
          adultLunch: "adult lunch → optional leftover plate",
          recipe: {
            title: "Taco rebuild",
            have: "leftover taco meat, tortillas/chips, cheese, salsa, rice",
            steps: [
              "Nachos, taco bowls, or quesadillas from leftover taco meat.",
              "Same flavors, new shape — not sad scraps.",
            ],
            enjoy: "Rebuild into nachos or bowls so dinner feels new.",
            buy: "none",
          },
        },
        {
          id: "thu",
          day: "Thursday",
          short: "Thu",
          icon: "💛",
          mealEmoji: "🍝",
          dinner: "Chicken Alfredo (cook double)",
          adultLunch: "adult lunch → thermos Alfredo (opt)",
          recipe: {
            title: "Chicken Alfredo",
            have: "Bertolli Garlic Alfredo, pasta, chicken or leftover rotisserie, Parmesan",
            steps: [
              "Boil pasta; cook or shred chicken.",
              "Warm Alfredo; toss pasta + chicken + sauce.",
              "Parmesan + pepper. Cook double for adult leftover lunches.",
            ],
            enjoy: "Finish pasta in the sauce; extra black pepper on the table.",
            buy: "chicken breast if rotisserie is gone",
          },
        },
        {
          id: "fri",
          day: "Friday",
          short: "Fri",
          icon: "🌿",
          mealEmoji: "🥘",
          dinner: "Sheet-pan oven chicken + potatoes + veg",
          adultLunch: "adult lunch → chicken sandwich Sat (opt)",
          recipe: {
            title: "Sheet-pan oven chicken",
            have: "chicken breasts, potatoes, oil, salt, garlic powder, paprika, salad/veg",
            steps: [
              "Heat oven 425°F.",
              "Chicken breasts + potatoes with oil, salt, garlic powder, paprika.",
              "Roast until chicken hits 165°F.",
            ],
            enjoy: "Don’t crowd the pan; rest chicken before slicing.",
            buy: "chicken breasts, potatoes",
          },
        },
        {
          id: "sat",
          day: "Saturday",
          short: "Sat",
          icon: "🍲",
          mealEmoji: "🌶️",
          dinner: "Big chili pot",
          adultLunch: "Sat lunch → chicken leftovers; Sun → chili (adults)",
          recipe: {
            title: "Big chili pot",
            have: "beef or leftover chicken, onion, tomatoes, beans, broth, chili powder/cumin",
            steps: [
              "Brown beef + onion; add tomatoes, beans, broth, chili powder/cumin.",
              "Simmer; top with cheese + crushed Doritos.",
            ],
            enjoy: "One pot feeds Sat dinner + adult Sun lunch.",
            buy: "ground beef if used up earlier; onion",
          },
        },
        {
          id: "sun",
          day: "Sunday",
          short: "Sun",
          icon: "☀️",
          mealEmoji: "🥞",
          dinner: "Breakfast-for-dinner",
          adultLunch: "Sun lunch → chili over rice (adults); pack Tucker Mon kit Sun night",
          recipe: {
            title: "Breakfast-for-dinner",
            have: "eggs, bagels, butter, fruit, maple optional",
            steps: [
              "Eggs, bagels, sausage; fruit; maple optional.",
              "Sun night: pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
            ],
            enjoy: "Everything hot together; let Tucker pick scrambled vs fried eggs at dinner.",
            buy: "sausage",
          },
        },
      ],
      groceries: [
        ...TUCKER_GROCERIES,
        { id: "a-rotisserie", category: "Protein", name: "1 rotisserie (if not already home)", price: "", hint: "Check fridge / store grab" },
        { id: "a-chicken", category: "Protein", name: "2–3 lb chicken breasts", price: "", hint: "" },
        { id: "a-beef", category: "Protein", name: "1–1.5 lb ground beef (tacos + chili)", price: "", hint: "Some ground meat may already be home" },
        { id: "a-eggs", category: "Protein", name: "Eggs (if carton low)", price: "", hint: "Egg carton in fridge — check count" },
        { id: "a-sausage", category: "Protein", name: "Breakfast sausage (Sun)", price: "", hint: "" },
        { id: "a-potatoes", category: "Produce", name: "Potatoes", price: "", hint: "" },
        { id: "a-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
        { id: "a-onion", category: "Produce", name: "Yellow onion (if low)", price: "", hint: "" },
        { id: "a-salad", category: "Produce", name: "Salad refresh if Fresh Express low", price: "", hint: "Fresh Express already stocked — skip if still good" },
        { id: "a-milk", category: "Dairy", name: "Milk top-up midweek if needed", price: "", hint: "fairlife / Publix already on hand" },
        { id: "a-shredded", category: "Dairy", name: "Shredded cheese only if Sargento bag empty", price: "", hint: "Taco cheese already stocked — skip" },
        { id: "a-tortillas", category: "Pantry", name: "Tortillas only if almost done", price: "", hint: "Old El Paso already in fridge — skip if enough" },
        { id: "a-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Rice-A-Roni / Rico already stocked" },
        { id: "a-chili-cans", category: "Pantry", name: "Chili beans/tomatoes only if not using pantry cans", price: "", hint: "Muir Glen + Bush’s already stocked — skip" },
      ],
    },
    B: {
      id: "B",
      label: "Option B",
      blurb: "Sausage sheet-pan · quesadillas · potato bar",
      budget: "~$100–130",
      days: [
        {
          id: "mon",
          day: "Monday",
          short: "Mon",
          icon: "🌿",
          mealEmoji: "🌭",
          dinner: "Sausage sheet-pan + potatoes + peppers",
          adultLunch: "adult lunch → wrap from leftovers (opt)",
          recipe: {
            title: "Sausage sheet-pan",
            have: "oil, salt, garlic powder, paprika",
            steps: [
              "425°F sausage + cubed potatoes + peppers.",
              "Toss with oil, salt, garlic powder, paprika; roast ~25 min.",
            ],
            enjoy: "Don’t crowd the pan so peppers and potatoes brown.",
            buy: "sausage, potatoes, peppers",
          },
        },
        {
          id: "tue",
          day: "Tuesday",
          short: "Tue",
          icon: "⭐",
          mealEmoji: "🫓",
          dinner: "Quesadilla night",
          adultLunch: "adult lunch → extra quesadilla (opt)",
          recipe: {
            title: "Quesadilla night",
            have: "tortillas, cheese, chicken, salsa, Bush’s beans",
            steps: [
              "Tortilla + cheese + shredded chicken; skillet both sides.",
              "Salsa + beans on the side. Make an extra for adult lunch if you want.",
            ],
            enjoy: "Crispy cheese edges = diner vibes.",
            buy: "chicken if none leftover",
          },
        },
        {
          id: "wed",
          day: "Wednesday",
          short: "Wed",
          icon: "☁️",
          mealEmoji: "🍲",
          dinner: "Big chili pot",
          adultLunch: "adult lunch → chili thermos (opt)",
          recipe: {
            title: "Big chili pot",
            have: "beef or chicken, onion, tomatoes, beans, broth, chili seasoning",
            steps: [
              "Same chili as Option A: brown meat + onion, add tomatoes/beans/broth/spices.",
              "Simmer; cheese on top.",
            ],
            enjoy: "Big pot → dinner tonight + adult lunches tomorrow.",
            buy: "ground beef or sausage if needed; onion",
          },
        },
        {
          id: "thu",
          day: "Thursday",
          short: "Thu",
          icon: "💛",
          mealEmoji: "🌮",
          dinner: "Chili rebuild bowls / nachos",
          adultLunch: "adult lunch → optional chili again",
          recipe: {
            title: "Chili rebuild",
            have: "leftover chili, chips or rice, cheese",
            steps: [
              "Nachos or rice bowls from leftover chili.",
              "Same chili, new shape.",
            ],
            enjoy: "Lime + cheese if you have them.",
            buy: "none",
          },
        },
        {
          id: "fri",
          day: "Friday",
          short: "Fri",
          icon: "🍗",
          mealEmoji: "🍚",
          dinner: "Oven chicken + rice + salad",
          adultLunch: "adult lunch → sandwich Sat (opt)",
          recipe: {
            title: "Oven chicken + rice",
            have: "chicken breasts, rice, Fresh Express salad",
            steps: [
              "Roast chicken breasts; cook rice; salad on the side.",
            ],
            enjoy: "Rest chicken before slicing for adult sandwiches.",
            buy: "chicken breasts",
          },
        },
        {
          id: "sat",
          day: "Saturday",
          short: "Sat",
          icon: "🥞",
          mealEmoji: "🍳",
          dinner: "Breakfast-for-dinner",
          adultLunch: "—",
          recipe: {
            title: "Breakfast-for-dinner",
            have: "eggs, bagels, butter, fruit, maple optional",
            steps: [
              "Eggs, bagels, sausage; fruit; maple optional.",
            ],
            enjoy: "Hot plates together.",
            buy: "sausage if not bought earlier",
          },
        },
        {
          id: "sun",
          day: "Sunday",
          short: "Sun",
          icon: "☀️",
          mealEmoji: "🥔",
          dinner: "Baked potato bar (chili/cheese/butter)",
          adultLunch: "Sun lunch → Campbell’s Chunky or chili (adults); pack Tucker Mon kit",
          recipe: {
            title: "Baked potato bar",
            have: "potatoes, chili leftover, cheese, butter; Campbell’s Chunky optional for adult lunch",
            steps: [
              "Bake or microwave potatoes; toppings from chili/cheese/butter.",
              "Sun night: pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
            ],
            enjoy: "Everyone builds their own potato.",
            buy: "potatoes if not already bought",
          },
        },
      ],
      groceries: [
        ...TUCKER_GROCERIES,
        { id: "b-sausage", category: "Protein", name: "Dinner sausage (sheet-pan) + breakfast sausage if wanted", price: "", hint: "" },
        { id: "b-chicken", category: "Protein", name: "2–3 lb chicken breasts", price: "", hint: "" },
        { id: "b-beef", category: "Protein", name: "Ground beef for chili (or use chicken)", price: "", hint: "Some ground meat may already be home" },
        { id: "b-eggs", category: "Protein", name: "Eggs (if carton low)", price: "", hint: "Egg carton in fridge — check count" },
        { id: "b-potatoes", category: "Produce", name: "Potatoes (sheet-pan + potato bar)", price: "", hint: "" },
        { id: "b-peppers", category: "Produce", name: "Bell peppers (sheet-pan)", price: "", hint: "" },
        { id: "b-onion", category: "Produce", name: "Yellow onion (chili)", price: "", hint: "" },
        { id: "b-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
        { id: "b-salad", category: "Produce", name: "Salad kit if Fresh Express low", price: "", hint: "Fresh Express already stocked — skip if still good" },
        { id: "b-milk", category: "Dairy", name: "Milk top-up midweek if needed", price: "", hint: "fairlife / Publix already on hand" },
        { id: "b-cheese", category: "Dairy", name: "Shredded cheese if Sargento bag empty", price: "", hint: "Already stocked — skip" },
        { id: "b-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Already stocked — skip" },
        { id: "b-chili-cans", category: "Pantry", name: "Chili beans/tomatoes only if pantry empty", price: "", hint: "Muir Glen + Bush’s already stocked — skip" },
        { id: "b-tortillas", category: "Pantry", name: "Tortillas if almost done (quesadillas)", price: "", hint: "Old El Paso already in fridge — skip if enough" },
      ],
    },
  };

  const defaultState = () => ({
    plan: "A",
    weekTitle: "Oct 5–11, 2026",
    checked: {},
    custom: [],
  });

  let state = defaultState();

  const els = {
    weekLabel: document.getElementById("week-label"),
    budgetBand: document.getElementById("budget-band"),
    planA: document.getElementById("plan-a"),
    planB: document.getElementById("plan-b"),
    weekGrid: document.getElementById("week-grid"),
    groceryList: document.getElementById("grocery-list"),
    checkedCount: document.getElementById("checked-count"),
    customName: document.getElementById("custom-name"),
    customCategory: document.getElementById("custom-category"),
    addCustom: document.getElementById("add-custom"),
    copyShare: document.getElementById("copy-share"),
    copyGrocery: document.getElementById("copy-grocery"),
    resetChecks: document.getElementById("reset-checks"),
    toast: document.getElementById("toast"),
    modal: document.getElementById("recipe-modal"),
    modalClose: document.getElementById("modal-close"),
    modalTitle: document.getElementById("modal-title"),
    modalLunch: document.getElementById("modal-lunch"),
    modalBody: document.getElementById("modal-body"),
  };

  function currentPlan() {
    return PLANS[state.plan] || PLANS.A;
  }

  function itemChecked(id) {
    return Boolean(state.checked[id]);
  }

  function setChecked(id, value) {
    if (value) state.checked[id] = true;
    else delete state.checked[id];
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      /* ignore quota / private mode */
    }
    writeShareToUrl(false);
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return normalizeState(JSON.parse(raw));
    } catch (_) {
      return null;
    }
  }

  function normalizeState(parsed) {
    const base = defaultState();
    if (!parsed || typeof parsed !== "object") return base;
    base.plan = parsed.plan === "B" ? "B" : "A";
    if (typeof parsed.weekTitle === "string" && parsed.weekTitle.trim()) {
      base.weekTitle = parsed.weekTitle.trim().slice(0, 80);
    }
    if (parsed.checked && typeof parsed.checked === "object") {
      if (Array.isArray(parsed.checked)) {
        parsed.checked.forEach((id) => {
          if (typeof id === "string") base.checked[id] = true;
        });
      } else {
        Object.keys(parsed.checked).forEach((id) => {
          if (parsed.checked[id]) base.checked[id] = true;
        });
      }
    }
    if (Array.isArray(parsed.custom)) {
      base.custom = parsed.custom
        .filter((c) => c && typeof c.name === "string" && c.name.trim())
        .map((c, i) => ({
          id: typeof c.id === "string" ? c.id : `custom-${i}-${Date.now()}`,
          name: c.name.trim().slice(0, 80),
          category: CATEGORIES.includes(c.category) ? c.category : "Pantry",
        }));
    }
    return base;
  }

  function encodeState() {
    const payload = {
      p: state.plan,
      w: state.weekTitle,
      c: Object.keys(state.checked).filter((k) => state.checked[k]),
      x: state.custom.map((item) => ({
        i: item.id,
        n: item.name,
        k: item.category,
        d: itemChecked(item.id) ? 1 : 0,
      })),
    };
    const json = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function decodeState(encoded) {
    try {
      let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      const json = decodeURIComponent(escape(atob(b64)));
      const payload = JSON.parse(json);
      const next = defaultState();
      next.plan = payload.p === "B" ? "B" : "A";
      if (typeof payload.w === "string" && payload.w.trim()) {
        next.weekTitle = payload.w.trim().slice(0, 80);
      }
      const checked = {};
      if (Array.isArray(payload.c)) {
        payload.c.forEach((id) => {
          if (typeof id === "string") checked[id] = true;
        });
      }
      next.custom = [];
      if (Array.isArray(payload.x)) {
        payload.x.forEach((item, i) => {
          if (!item || typeof item.n !== "string") return;
          const id = typeof item.i === "string" ? item.i : `custom-${i}`;
          next.custom.push({
            id,
            name: String(item.n).trim().slice(0, 80),
            category: CATEGORIES.includes(item.k) ? item.k : "Pantry",
          });
          if (item.d) checked[id] = true;
        });
      }
      next.checked = checked;
      return next;
    } catch (_) {
      return null;
    }
  }

  function readShareFromUrl() {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return null;
    const params = new URLSearchParams(hash.includes("=") ? hash : `s=${hash}`);
    const encoded = params.get("s");
    if (!encoded) return null;
    return decodeState(encoded);
  }

  function writeShareToUrl(push) {
    const encoded = encodeState();
    const next = `#s=${encoded}`;
    if (push) {
      history.pushState(null, "", next);
    } else if (window.location.hash !== next) {
      history.replaceState(null, "", next);
    }
  }

  function shareUrl() {
    writeShareToUrl(false);
    const url = new URL(window.location.href);
    url.hash = `s=${encodeState()}`;
    return url.toString();
  }

  function renderPlanToggle() {
    const isA = state.plan === "A";
    els.planA.setAttribute("aria-pressed", String(isA));
    els.planB.setAttribute("aria-pressed", String(!isA));
    els.budgetBand.textContent = `Budget band ${currentPlan().budget}`;
  }

  function renderWeek() {
    const plan = currentPlan();
    els.weekGrid.innerHTML = "";
    plan.days.forEach((day) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-card";
      btn.setAttribute("aria-label", `${day.day}: ${day.dinner}. Tap for recipe.`);
      const adultLine =
        day.adultLunch && day.adultLunch !== "—"
          ? `<p class="day-lunch">${escapeHtml(day.adultLunch)}</p>`
          : `<p class="day-lunch day-lunch-muted">adult lunch → —</p>`;
      btn.innerHTML = `
        <div class="day-head">
          <span>${day.short}</span>
          <span class="emoji" aria-hidden="true">${day.icon}</span>
        </div>
        <div class="day-body">
          <span class="meal-emoji" aria-hidden="true">${day.mealEmoji}</span>
          <p class="day-dinner">${escapeHtml(day.dinner)}</p>
          ${adultLine}
          <p class="tap-hint">Tap for short recipe →</p>
        </div>
      `;
      btn.addEventListener("click", () => openRecipe(day));
      els.weekGrid.appendChild(btn);
    });
  }

  function allGroceryItems() {
    const plan = currentPlan();
    const seeded = plan.groceries.map((g) => ({ ...g, custom: false }));
    const custom = state.custom.map((c) => ({
      id: c.id,
      category: c.category,
      name: c.name,
      price: "",
      hint: "custom item",
      custom: true,
    }));
    return [...seeded, ...custom];
  }

  function renderGrocery() {
    const items = allGroceryItems();
    let checked = 0;
    const byCat = CATEGORIES.map((cat) => ({
      cat,
      items: items.filter((i) => i.category === cat),
    })).filter((group) => group.items.length);

    els.groceryList.innerHTML = "";

    const tuckerNote = document.createElement("p");
    tuckerNote.className = "tucker-note";
    tuckerNote.textContent =
      "Tucker lunchbox: same kit every school day (Mon–Fri). Count packs Sun night; restock midweek as yogurt, sticks, juice, and snacks deplete. Not dinner leftovers.";
    els.groceryList.appendChild(tuckerNote);

    byCat.forEach((group) => {
      const h = document.createElement("h3");
      h.className = "category" + (group.cat === "Tucker lunchbox" ? " category-tucker" : "");
      h.textContent = group.cat;
      els.groceryList.appendChild(h);

      const ul = document.createElement("ul");
      ul.className = "item-list";
      group.items.forEach((item) => {
        const isOn = itemChecked(item.id);
        if (isOn) checked += 1;
        const li = document.createElement("li");
        li.className = `item${isOn ? " checked" : ""}`;
        const inputId = `g-${item.id}`;
        li.innerHTML = `
          <input type="checkbox" id="${escapeAttr(inputId)}" ${isOn ? "checked" : ""} />
          <label for="${escapeAttr(inputId)}">
            ${escapeHtml(item.name)}
            ${item.price ? `<span class="price">${escapeHtml(item.price)}</span>` : ""}
            ${item.hint ? `<span class="hint">${escapeHtml(item.hint)}</span>` : ""}
          </label>
        `;
        const input = li.querySelector("input");
        input.addEventListener("change", () => {
          setChecked(item.id, input.checked);
          persist();
          renderGrocery();
        });
        ul.appendChild(li);
      });
      els.groceryList.appendChild(ul);
    });

    els.checkedCount.textContent = `${checked} checked · ${items.length} items`;
  }

  function openRecipe(day) {
    const r = day.recipe;
    els.modalTitle.textContent = `${day.day} — ${r.title}`;
    els.modalLunch.textContent =
      day.adultLunch && day.adultLunch !== "—"
        ? day.adultLunch
        : "Tucker: fixed school lunchbox (not dinner leftovers)";
    els.modalBody.innerHTML = `
      <div class="recipe-block">
        <h4>Have (pantry first)</h4>
        <p>${escapeHtml(r.have)}</p>
      </div>
      <div class="recipe-block">
        <h4>Do</h4>
        <ul>${r.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      </div>
      <div class="recipe-block">
        <h4>Make it enjoyable</h4>
        <p>${escapeHtml(r.enjoy)}</p>
      </div>
      <div class="recipe-block">
        <h4>Buy if missing</h4>
        <p>${escapeHtml(r.buy)}</p>
      </div>
      <div class="recipe-block">
        <h4>Tucker school lunch</h4>
        <p>Fixed kit Mon–Fri: yogurt + cheese stick + pretzels/Pringles + fruit snack + beef stick + apple juice. Adults only for dinner leftovers.</p>
      </div>
    `;
    els.modal.classList.add("open");
    els.modal.setAttribute("aria-hidden", "false");
    els.modalClose.focus();
  }

  function closeRecipe() {
    els.modal.classList.remove("open");
    els.modal.setAttribute("aria-hidden", "true");
  }

  function groceryText() {
    const plan = currentPlan();
    const lines = [
      `Burns Family grocery — ${state.weekTitle} (${plan.label})`,
      `Budget band ${plan.budget}`,
      "Tucker lunchbox = yogurt + cheese stick + pretzels/Pringles + fruit snack + beef stick + apple juice",
      "Restock midweek as packs deplete. Tucker does NOT eat dinner leftovers for school lunch.",
      "",
    ];
    CATEGORIES.forEach((cat) => {
      const items = allGroceryItems().filter((i) => i.category === cat);
      if (!items.length) return;
      lines.push(cat.toUpperCase());
      items.forEach((item) => {
        const mark = itemChecked(item.id) ? "[x]" : "[ ]";
        const price = item.price ? ` ${item.price}` : "";
        const hint = item.hint ? ` (${item.hint})` : "";
        lines.push(`${mark} ${item.name}${price}${hint}`);
      });
      lines.push("");
    });
    return lines.join("\n").trim();
  }

  async function copyText(text, okMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      showToast(okMessage);
    } catch (_) {
      showToast("Couldn’t copy — long-press and copy manually");
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function renderAll() {
    els.weekLabel.value = state.weekTitle;
    renderPlanToggle();
    renderWeek();
    renderGrocery();
  }

  function setPlan(planId) {
    state.plan = planId === "B" ? "B" : "A";
    persist();
    renderAll();
  }

  function boot() {
    const fromUrl = readShareFromUrl();
    const fromStorage = loadFromStorage();
    if (fromUrl) {
      state = fromUrl;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (_) {}
    } else if (fromStorage) {
      state = fromStorage;
    } else {
      state = defaultState();
    }

    els.planA.addEventListener("click", () => setPlan("A"));
    els.planB.addEventListener("click", () => setPlan("B"));

    els.weekLabel.addEventListener("change", () => {
      state.weekTitle = els.weekLabel.value.trim() || "Oct 5–11, 2026";
      persist();
    });
    els.weekLabel.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        els.weekLabel.blur();
      }
    });

    els.addCustom.addEventListener("click", () => {
      const name = els.customName.value.trim();
      if (!name) {
        showToast("Type a grocery item first");
        els.customName.focus();
        return;
      }
      const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      state.custom.push({
        id,
        name: name.slice(0, 80),
        category: els.customCategory.value,
      });
      els.customName.value = "";
      persist();
      renderGrocery();
      showToast("Added to grocery list");
    });

    els.customName.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        els.addCustom.click();
      }
    });

    els.copyShare.addEventListener("click", () => {
      copyText(shareUrl(), "Share link copied — text it to Ted or Samantha");
    });

    els.copyGrocery.addEventListener("click", () => {
      copyText(groceryText(), "Grocery list copied for iMessage/SMS");
    });

    els.resetChecks.addEventListener("click", () => {
      state.checked = {};
      persist();
      renderGrocery();
      showToast("Cleared checkmarks on this device");
    });

    els.modalClose.addEventListener("click", closeRecipe);
    els.modal.addEventListener("click", (e) => {
      if (e.target === els.modal) closeRecipe();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.modal.classList.contains("open")) closeRecipe();
    });

    window.addEventListener("hashchange", () => {
      const shared = readShareFromUrl();
      if (shared) {
        state = shared;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (_) {}
        renderAll();
        showToast("Loaded shared plan from link");
      }
    });

    renderAll();
    writeShareToUrl(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
