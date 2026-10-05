(() => {
  "use strict";

  const STORAGE_KEY = "family-meals-state-v1";
  const CATEGORIES = ["Protein", "Produce", "Dairy", "Pantry"];

  const PLANS = {
    A: {
      id: "A",
      label: "Option A",
      blurb: "Cook once · lunch tomorrow",
      budget: "~$90–130",
      days: [
        {
          id: "mon",
          day: "Monday",
          short: "Mon",
          icon: "👨‍🍳",
          mealEmoji: "🍗",
          dinner: "Rotisserie chicken + rice/potatoes + salad",
          lunch: "lunch → chicken wrap / sandwich",
          recipe: {
            title: "Rotisserie plate (15 min)",
            have: "rotisserie, Fresh Express salad or veg, rice/potatoes, butter",
            steps: [
              "Warm chicken 10 min at 350°F.",
              "Microwave rice or roast leftover potatoes with oil + salt + garlic powder.",
              "Toss salad with Kraft dressing you already have.",
            ],
            enjoy: "Warm the meat (not cold fridge chicken), squeeze Sicilia lemon on salad, butter on potatoes.",
            buy: "none if rotisserie is home",
          },
        },
        {
          id: "tue",
          day: "Tuesday",
          short: "Tue",
          icon: "🌮",
          mealEmoji: "🌮",
          dinner: "Taco night (beef or leftover chicken)",
          lunch: "lunch → taco meat wrap / quesadilla",
          recipe: {
            title: "Taco night (25 min)",
            have: "tortillas, McCormick taco seasoning, Sargento taco cheese, salsa, Bush’s taco beans",
            steps: [
              "Brown 1 lb ground beef (or shred leftover rotisserie) → drain.",
              "Stir in taco packet + ⅔ cup water (or Swanson broth). Simmer 5 min.",
              "Warm tortillas and Bush’s beans. Top with cheese, salsa, optional lettuce/tomato.",
            ],
            enjoy: "Toast tortillas in a dry pan 20 sec/side; put beans in a bowl with cheese on top so they melt.",
            buy: "ground beef (if not using leftover chicken), onion, lettuce/tomato optional",
          },
        },
        {
          id: "wed",
          day: "Wednesday",
          short: "Wed",
          icon: "⭐",
          mealEmoji: "🧀",
          dinner: "Leftover taco rebuild (nachos / bowls / quesadillas)",
          lunch: "lunch → Alfredo thermos (if ready) or bagel + string cheese",
          recipe: {
            title: "Leftover taco rebuild (15 min)",
            have: "leftover taco meat, tortillas/chips, cheese, salsa, rice or Rice-A-Roni",
            steps: [
              "Nachos: chips → meat → cheese → 400°F 5 min → salsa.",
              "Taco bowls: rice + meat + cheese + salsa + beans.",
              "Quesadillas: tortilla + meat + cheese, skillet both sides.",
            ],
            enjoy: "Don’t just microwave a plate — rebuild into nachos or bowls so it feels new.",
            buy: "none",
          },
        },
        {
          id: "thu",
          day: "Thursday",
          short: "Thu",
          icon: "💛",
          mealEmoji: "🍝",
          dinner: "Chicken Alfredo + side salad",
          lunch: "lunch → thermos pasta",
          recipe: {
            title: "Chicken Alfredo (30 min)",
            have: "Bertolli Garlic Alfredo, Barilla/Mueller’s pasta, chicken or leftover rotisserie, Parmesan, butter/garlic",
            steps: [
              "Boil pasta. Meanwhile sauté diced chicken in butter + garlic powder + salt/pepper (or shred rotisserie).",
              "Warm Alfredo in pan (don’t boil hard). Toss pasta + chicken + sauce.",
              "Finish with Parmesan + black pepper. Side: Fresh Express salad.",
              "Cook double for Fri thermos lunches.",
            ],
            enjoy: "Undercook pasta 1 minute, finish in the sauce; extra black pepper and Parmesan on the table.",
            buy: "chicken breast if rotisserie is gone",
          },
        },
        {
          id: "fri",
          day: "Friday",
          short: "Fri",
          icon: "🌿",
          mealEmoji: "🥘",
          dinner: "Oven chicken breasts + potatoes + veg",
          lunch: "weekend → chicken sandwiches; pack Mon lunch Sun night",
          recipe: {
            title: "Oven chicken + potatoes (40 min, mostly hands-off)",
            have: "chicken breasts, potatoes, oil/butter, garlic powder, paprika, salad/veg",
            steps: [
              "Heat oven 425°F.",
              "Cube potatoes, toss oil + salt + garlic powder + paprika → sheet pan.",
              "Season chicken same spices + pepper → same pan or second pan.",
              "Roast 22–28 min until chicken hits 165°F.",
            ],
            enjoy: "Don’t crowd the pan (crispy potatoes); rest chicken 5 min before slicing; lemon squeeze optional.",
            buy: "chicken breasts, potatoes",
          },
        },
        {
          id: "sat",
          day: "Saturday",
          short: "Sat",
          icon: "🍲",
          mealEmoji: "🌶️",
          dinner: "Big pot chili",
          lunch: "Sat lunch → leftover chicken sandwiches; Sun → chili",
          recipe: {
            title: "One-pot chili (45 min)",
            have: "ground beef or leftover chicken, Muir Glen tomatoes, beans, McCormick stew packet or chili spices, Swanson broth",
            steps: [
              "Brown 1 lb beef with onion.",
              "Add 1 can tomatoes, 1–2 cans beans (drained), 1 cup broth, stew packet or 1 tbsp chili powder + 1 tsp cumin.",
              "Simmer 25–30 min. Taste salt.",
            ],
            enjoy: "Top bowls with taco cheese + crushed Doritos or Ritz.",
            buy: "ground beef if used up Tue; onion",
          },
        },
        {
          id: "sun",
          day: "Sunday",
          short: "Sun",
          icon: "☀️",
          mealEmoji: "🥞",
          dinner: "Breakfast-for-dinner (eggs, bagels, sausage/bacon, fruit)",
          lunch: "lunch → chili leftovers; pack Mon lunch from Fri chicken",
          recipe: {
            title: "Breakfast-for-dinner (20 min)",
            have: "eggs, butter, bagels/Dave’s, fruit, maple syrup or Lyle’s; pancake mix optional",
            steps: [
              "Cook sausage or bacon.",
              "Scramble or fry eggs in butter. Toast bagels.",
              "Fruit bowl. Optional: 1–2 pancakes if kids want diner night.",
              "Pack Mon school lunch from Fri chicken leftovers.",
            ],
            enjoy: "Everything hits the table hot together; syrup + butter on the side; let Tucker pick scrambled vs fried.",
            buy: "sausage or bacon",
          },
        },
      ],
      groceries: [
        { id: "a-rotisserie", category: "Protein", name: "1 rotisserie (if not already home)", price: "~$8", hint: "Grabbed / check fridge" },
        { id: "a-chicken", category: "Protein", name: "2–3 lb chicken breasts", price: "~$10–14", hint: "" },
        { id: "a-beef", category: "Protein", name: "1–1.5 lb ground beef (tacos + chili)", price: "~$8–12", hint: "Some ground meat may already be home" },
        { id: "a-eggs", category: "Protein", name: "Eggs (if carton low)", price: "~$4", hint: "Egg carton already in fridge — check count" },
        { id: "a-sausage", category: "Protein", name: "Breakfast sausage or bacon (Sun)", price: "~$5–7", hint: "" },
        { id: "a-potatoes", category: "Produce", name: "Potatoes (5 lb)", price: "~$4", hint: "" },
        { id: "a-salad", category: "Produce", name: "Salad kit refresh if Fresh Express low", price: "~$4", hint: "Fresh Express kits already stocked — skip if still good" },
        { id: "a-fruit", category: "Produce", name: "Bananas + apples (school fruit)", price: "~$6", hint: "" },
        { id: "a-grapes", category: "Produce", name: "Grapes or more berries", price: "~$5", hint: "Strawberries may still be good" },
        { id: "a-onion", category: "Produce", name: "Yellow onion + garlic (if low)", price: "~$3", hint: "" },
        { id: "a-taco-veg", category: "Produce", name: "Optional: shredded lettuce/tomato for tacos", price: "~$3", hint: "" },
        { id: "a-milk", category: "Dairy", name: "fairlife or Publix milk if running out midweek", price: "~$4–6", hint: "fairlife + Publix milk already on hand" },
        { id: "a-cheese", category: "Dairy", name: "Shredded cheese only if Sargento bag empty", price: "~$4", hint: "Sargento taco cheese already stocked — skip" },
        { id: "a-yogurt", category: "Dairy", name: "Yogurt cups for lunchboxes (Chobani)", price: "~$5", hint: "Chobani 4-pack already stocked — top up if low" },
        { id: "a-tortillas", category: "Pantry", name: "Tortillas if package almost done", price: "~$3", hint: "Old El Paso tortillas already in fridge — skip if enough" },
        { id: "a-rice", category: "Pantry", name: "Rice (if no leftover)", price: "~$3", hint: "Rice-A-Roni / Rico rice already stocked" },
        { id: "a-chili-cans", category: "Pantry", name: "Chili beans / diced tomatoes if not using pantry cans", price: "~$3", hint: "Muir Glen tomatoes + Bush’s beans already stocked — skip" },
        { id: "a-bread", category: "Pantry", name: "Bread or more bagels for sandwiches", price: "~$4", hint: "Dave’s / bagels already stocked — skip if enough" },
      ],
    },
    B: {
      id: "B",
      label: "Option B",
      blurb: "Alternate menu · same week",
      budget: "~$90–120",
      days: [
        {
          id: "mon",
          day: "Monday",
          short: "Mon",
          icon: "🌿",
          mealEmoji: "🌭",
          dinner: "Sheet-pan sausage + potatoes + peppers",
          lunch: "lunch → wrap or thermos leftovers",
          recipe: {
            title: "Sausage sheet-pan (~25 min)",
            have: "oil, salt, garlic powder, paprika; potatoes if buying",
            steps: [
              "Heat oven 425°F.",
              "Sheet-pan sausage + cubed potatoes + peppers with oil, salt, garlic powder, paprika.",
              "Roast about 25 min until sausage cooked and potatoes tender.",
            ],
            enjoy: "Don’t crowd the pan so peppers and potatoes get color.",
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
          lunch: "lunch → extra quesadilla + fruit + yogurt",
          recipe: {
            title: "Chicken quesadillas",
            have: "tortillas, cheese, leftover chicken/breast, salsa, Bush’s beans",
            steps: [
              "Fill tortilla with cheese + shredded chicken.",
              "Skillet both sides until golden and melty.",
              "Serve with salsa + Bush’s beans on the side. Make an extra for tomorrow’s lunch.",
            ],
            enjoy: "Extra cheese edges that crisp in the pan = diner vibes.",
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
          lunch: "lunch → chili thermos + crackers",
          recipe: {
            title: "Chili (same as Option A Sat)",
            have: "tomatoes, beans, broth, chili powder / stew packet",
            steps: [
              "Brown beef (or use chicken) with onion.",
              "Add tomatoes, beans, broth, chili seasoning.",
              "Simmer 25–30 min. Taste salt.",
            ],
            enjoy: "Cheese + crushed chips on top.",
            buy: "ground beef or sausage if needed; onion",
          },
        },
        {
          id: "thu",
          day: "Thursday",
          short: "Thu",
          icon: "💛",
          mealEmoji: "🌮",
          dinner: "Chili rebuild bowls / nachos / over rice",
          lunch: "lunch → bagel + string cheese OR chili again",
          recipe: {
            title: "Leftover chili rebuild",
            have: "leftover chili, chips or rice, cheese",
            steps: [
              "Nachos: chips → chili → cheese → broil/bake briefly.",
              "Or rice bowls with chili + cheese.",
              "Same chili, new shape — not sad scraps.",
            ],
            enjoy: "Lime squeeze if you have it.",
            buy: "none",
          },
        },
        {
          id: "fri",
          day: "Friday",
          short: "Fri",
          icon: "🍗",
          mealEmoji: "🍚",
          dinner: "Oven chicken breast + rice + salad",
          lunch: "lunch → chicken sandwich + fruit + Goldfish",
          recipe: {
            title: "Oven chicken + rice",
            have: "chicken breasts, rice, Fresh Express salad, lemon + Parmesan optional",
            steps: [
              "Roast chicken breasts at 425°F until 165°F.",
              "Microwave/stovetop rice.",
              "Serve with Fresh Express salad; lemon + Parmesan if you want fancy.",
            ],
            enjoy: "Rest chicken before slicing for sandwiches tomorrow.",
            buy: "chicken breasts",
          },
        },
        {
          id: "sat",
          day: "Saturday",
          short: "Sat",
          icon: "🥞",
          mealEmoji: "🍳",
          dinner: "Breakfast-for-dinner (eggs, bagels, sausage)",
          lunch: "Sat lunch → chicken leftovers",
          recipe: {
            title: "Breakfast-for-dinner",
            have: "eggs, bagels, butter, fruit, maple/Lyle’s",
            steps: [
              "Cook sausage. Eggs scrambled or fried in butter.",
              "Toast bagels. Fruit on the side.",
              "Optional pancakes from the fridge mix.",
            ],
            enjoy: "Hot plates together; syrup on the side.",
            buy: "sausage if not bought earlier",
          },
        },
        {
          id: "sun",
          day: "Sunday",
          short: "Sun",
          icon: "☀️",
          mealEmoji: "🥔",
          dinner: "Build-your-own baked potato bar",
          lunch: "lunch → soup + grilled cheese OR leftover chili; pack Mon lunch",
          recipe: {
            title: "Baked potato bar",
            have: "potatoes, chili leftover, cheese, butter; Campbell’s Chunky optional for lunch",
            steps: [
              "Microwave or oven-bake potatoes until fluffy.",
              "Set out toppings: chili leftover, cheese, butter.",
              "Pack Mon lunch from Fri chicken leftovers.",
            ],
            enjoy: "Let everyone build their own — Tucker picks toppings.",
            buy: "potatoes if not already bought",
          },
        },
      ],
      groceries: [
        { id: "b-sausage", category: "Protein", name: "Dinner sausage (sheet-pan) + breakfast sausage if wanted", price: "~$8–12", hint: "" },
        { id: "b-chicken", category: "Protein", name: "2–3 lb chicken breasts", price: "~$10–14", hint: "" },
        { id: "b-beef", category: "Protein", name: "Ground beef for chili (or use chicken)", price: "~$8–12", hint: "Some ground meat may already be home" },
        { id: "b-eggs", category: "Protein", name: "Eggs (if carton low)", price: "~$4", hint: "Egg carton already in fridge — check count" },
        { id: "b-potatoes", category: "Produce", name: "Potatoes (sheet-pan + potato bar)", price: "~$4", hint: "" },
        { id: "b-peppers", category: "Produce", name: "Bell peppers (sheet-pan)", price: "~$3–4", hint: "" },
        { id: "b-onion", category: "Produce", name: "Yellow onion (chili)", price: "~$2", hint: "" },
        { id: "b-fruit", category: "Produce", name: "Bananas + apples (school fruit)", price: "~$6", hint: "" },
        { id: "b-salad", category: "Produce", name: "Salad kit if Fresh Express low", price: "~$4", hint: "Fresh Express kits already stocked — skip if still good" },
        { id: "b-yogurt", category: "Dairy", name: "Yogurt cups for lunchboxes", price: "~$5", hint: "Chobani already stocked — top up if low" },
        { id: "b-cheese", category: "Dairy", name: "Shredded cheese if Sargento bag empty", price: "~$4", hint: "Sargento taco cheese already stocked — skip" },
        { id: "b-milk", category: "Dairy", name: "Milk top-up midweek if needed", price: "~$4–6", hint: "fairlife + Publix milk already on hand" },
        { id: "b-rice", category: "Pantry", name: "Rice if pantry thin", price: "~$3", hint: "Rice-A-Roni / Rico already stocked — skip" },
        { id: "b-chili-cans", category: "Pantry", name: "Chili beans / tomatoes only if pantry empty", price: "~$3", hint: "Muir Glen + Bush’s already stocked — skip" },
        { id: "b-tortillas", category: "Pantry", name: "Tortillas if almost done (quesadillas)", price: "~$3", hint: "Old El Paso already in fridge — skip if enough" },
        { id: "b-bread", category: "Pantry", name: "Bagels/bread if low", price: "~$4", hint: "Dave’s / bagels already stocked" },
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
      btn.innerHTML = `
        <div class="day-head">
          <span>${day.short}</span>
          <span class="emoji" aria-hidden="true">${day.icon}</span>
        </div>
        <div class="day-body">
          <span class="meal-emoji" aria-hidden="true">${day.mealEmoji}</span>
          <p class="day-dinner">${escapeHtml(day.dinner)}</p>
          <p class="day-lunch">${escapeHtml(day.lunch)}</p>
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
    byCat.forEach((group) => {
      const h = document.createElement("h3");
      h.className = "category";
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
    els.modalLunch.textContent = day.lunch;
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
    lines.push("Tucker lunchbox = last night’s dinner + fruit + snack");
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
