(() => {
  "use strict";

  const STORAGE_KEY = "family-meals-state-v4";
  const LEGACY_STORAGE_KEYS = ["family-meals-state-v3", "family-meals-state-v2", "family-meals-state-v1"];
  /** Aisle order for grocery checklist */
  const CATEGORIES = [
    "Produce",
    "Dairy",
    "Meat",
    "Pantry",
    "Frozen",
    "Tucker lunchbox",
    "Other",
  ];
  const LEGACY_CATEGORY = { Protein: "Meat" };

  function tuckerGroceries(prefix) {
    return [
      {
        id: `${prefix}-t-yogurt`,
        category: "Tucker lunchbox",
        name: "Yogurt cups ×5+ (Chobani multipack)",
        price: "",
        hint: "Count packs Sun night; restock midweek if depleting",
        staple: true,
      },
      {
        id: `${prefix}-t-cheese`,
        category: "Tucker lunchbox",
        name: "Cheese sticks ×5+ (Polly-O / Cheese Heads)",
        price: "",
        hint: "Buy if not enough for 5 school days",
        staple: true,
      },
      {
        id: `${prefix}-t-pretzels`,
        category: "Tucker lunchbox",
        name: "Pretzels and/or Pringles (if low)",
        price: "",
        hint: "Portion for 5 days; restock midweek",
        staple: true,
      },
      {
        id: `${prefix}-t-fruit-snack`,
        category: "Tucker lunchbox",
        name: "Fruit snacks ×5+",
        price: "",
        hint: "Restock midweek as packs deplete",
        staple: true,
      },
      {
        id: `${prefix}-t-beef-stick`,
        category: "Tucker lunchbox",
        name: "Natural beef sticks (red/white pack) ×5+",
        price: "",
        hint: "Likely need — buy ahead for the week",
        staple: true,
      },
      {
        id: `${prefix}-t-juice`,
        category: "Tucker lunchbox",
        name: "Apple juice boxes if Apple & Eve running low",
        price: "",
        hint: "Top up for 5 school days",
        staple: true,
      },
    ];
  }

  const SPECIAL_DINNERS = {
    leftovers: {
      key: "leftovers",
      dinner: "Leftovers",
      icon: "♻️",
      mealEmoji: "📦",
      adultLunch: "adult lunch → leftovers (opt)",
      tedNote: "",
      recipe: {
        title: "Leftovers night",
        have: "whatever’s already cooked",
        steps: ["Pull leftovers from the fridge; reheat and plate.", "No new grocery run for this night."],
        enjoy: "Clear the fridge — one less cook.",
        buy: "none",
      },
    },
    eatout: {
      key: "eatout",
      dinner: "Eat out / takeout",
      icon: "🚗",
      mealEmoji: "🥡",
      adultLunch: "adult lunch → —",
      tedNote: "",
      recipe: {
        title: "Eat out / takeout",
        have: "appetite + a plan",
        steps: ["Pick a spot or order takeout.", "Skip cooking — grocery lines for this night come off the list."],
        enjoy: "Night off the kitchen.",
        buy: "none",
      },
    },
    pickmeal: {
      key: "pickmeal",
      dinner: "Pick a meal",
      icon: "❔",
      mealEmoji: "❔",
      adultLunch: "adult lunch → —",
      tedNote: "",
      recipe: {
        title: "Pick a meal",
        have: "an open night",
        steps: ["This night is open — tap Swap to choose a dinner.", "Nothing from this night is on the grocery list yet."],
        enjoy: "Your call.",
        buy: "none",
      },
    },
  };

  const GRAB_GO = {
    "gg-rotisserie-salad": {
      key: "gg-rotisserie-salad",
      dinner: "Grab & go: Publix rotisserie + bagged salad",
      icon: "🛒",
      mealEmoji: "🛍",
      tag: "🛍 Grab & go",
      adultLunch: "adult lunch → —",
      tedNote: "",
      calories: 650,
      mealCalories: 720,
      recipe: {
        title: "Publix rotisserie + bagged salad",
        have: "plates + dressing if home",
        steps: ["Pick up a Publix rotisserie and a bagged salad.", "Plate and eat — minimal dishes."],
        enjoy: "Busy night, still a real dinner.",
        buy: "Publix rotisserie + bagged salad",
      },
      groceries: [
        { id: "gg-rotisserie", category: "Meat", name: "Publix rotisserie", price: "7.99", hint: "🛍 Grab & go" },
        { id: "gg-salad", category: "Produce", name: "Bagged salad", price: "3.49", hint: "🛍 Grab & go" },
      ],
    },
    "gg-publix-subs": {
      key: "gg-publix-subs",
      dinner: "Grab & go: Publix subs",
      icon: "🛒",
      mealEmoji: "🛍",
      tag: "🛍 Grab & go",
      adultLunch: "adult lunch → —",
      tedNote: "",
      calories: 700,
      mealCalories: 780,
      recipe: {
        title: "Publix subs",
        have: "chips/fruit optional at home",
        steps: ["Grab Publix subs for the family.", "Skip the stove."],
        enjoy: "Deli night.",
        buy: "Publix subs for 4",
      },
      groceries: [
        { id: "gg-subs", category: "Meat", name: "Publix subs ×4", price: "28", hint: "🛍 Grab & go" },
      ],
    },
    "gg-hotbar-chicken": {
      key: "gg-hotbar-chicken",
      dinner: "Grab & go: Publix hot bar chicken",
      icon: "🛒",
      mealEmoji: "🛍",
      tag: "🛍 Grab & go",
      adultLunch: "adult lunch → —",
      tedNote: "",
      calories: 620,
      mealCalories: 740,
      recipe: {
        title: "Publix hot bar chicken",
        have: "sides if you want them from home",
        steps: ["Pick up hot bar chicken (and a side if you like).", "Plate at home."],
        enjoy: "Hot dinner, no prep.",
        buy: "Publix hot bar chicken for 4",
      },
      groceries: [
        { id: "gg-hotbar", category: "Meat", name: "Publix hot bar chicken (family)", price: "16", hint: "🛍 Grab & go" },
      ],
    },
    "gg-frozen-pizza": {
      key: "gg-frozen-pizza",
      dinner: "Grab & go: frozen pizza night",
      icon: "🛒",
      mealEmoji: "🛍",
      tag: "🛍 Grab & go",
      adultLunch: "adult lunch → —",
      tedNote: "",
      calories: 680,
      mealCalories: 750,
      recipe: {
        title: "Frozen pizza night",
        have: "oven + plates",
        steps: ["Bake frozen pizzas per box.", "Optional bagged salad."],
        enjoy: "Zero-fuss night.",
        buy: "frozen pizzas (family size or 2)",
      },
      groceries: [
        { id: "gg-pizza", category: "Frozen", name: "Frozen pizzas (2)", price: "10", hint: "🛍 Grab & go" },
      ],
    },
  };

  const DEFAULT_HOUSE_RULES = [
    "Family of 4 — cost-effective, low cook time.",
    "Chicken: oven breasts or rotisserie; Chicken Alfredo is a yes. No spaghetti / meat sauce right now.",
    "Chili: weekend daytime only, at most 1 of 4 weeks per option.",
    "Fish nights: salmon or tilapia for Samantha; Ted gets a leftover sub (not fish).",
    "Taco leftovers go to the next dinner (not lunch).",
    "Tucker school lunch Mon–Fri is a fixed kit (not leftovers): yogurt, cheese stick, pretzels/Pringles, fruit snack, beef stick, apple juice.",
    "Adults may use dinner leftovers for lunch.",
  ];

  /**
   * Chili = weekend daytime cook only (football/company).
   * Only Week 1 Option A Sat + Week 2 Option B Sat. Never midweek / twice / every week.
   * Fish nights: Samantha salmon/tilapia; Ted = leftover substitute.
   */
  const WEEKS = {
    1: {
      id: "1",
      label: "Week 1",
      title: "Oct 5–11, 2026",
      range: "Oct 5–11",
      plans: {
        A: {
          id: "A",
          label: "Option A",
          blurb: "Tacos · Alfredo · salmon · weekend chili",
          budget: "~$100–130",
          houseNote: "Weekend chili Sat (daytime / football). One chili cook — leftover Sun lunch optional.",
          days: [
            {
              id: "mon",
              day: "Monday",
              short: "Mon",
              icon: "👨‍🍳",
              mealEmoji: "🍗",
              dinner: "Rotisserie + rice/potatoes + salad",
              adultLunch: "adult lunch → chicken (opt)",
              recipe: {
                title: "Rotisserie plate",
                have: "rotisserie, rice/potatoes, salad, dressing",
                steps: ["Warm rotisserie; rice/potatoes; salad."],
                enjoy: "Easy Monday start.",
                buy: "rotisserie if not home",
              },
            },
            {
              id: "tue",
              day: "Tuesday",
              short: "Tue",
              icon: "🌮",
              mealEmoji: "🌮",
              dinner: "Taco night",
              adultLunch: "adult lunch → leftover taco meat Wed (opt)",
              recipe: {
                title: "Taco night",
                have: "tortillas, taco packet, cheese, salsa, beans",
                steps: [
                  "Beef or shredded chicken + taco packet; tortillas; cheese, salsa, beans.",
                ],
                enjoy: "Warm tortillas; leftover meat → Wed rebuild.",
                buy: "ground beef if not using chicken; tortillas/cheese/salsa if low",
              },
            },
            {
              id: "wed",
              day: "Wednesday",
              short: "Wed",
              icon: "⭐",
              mealEmoji: "🧀",
              dinner: "Taco rebuild (nachos / bowls / quesadillas)",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Taco rebuild",
                have: "leftover taco meat, chips/tortillas/rice, cheese, salsa",
                steps: ["Rebuild from taco meat — nachos, bowls, or quesadillas."],
                enjoy: "New shape, same taco night.",
                buy: "none",
              },
            },
            {
              id: "thu",
              day: "Thursday",
              short: "Thu",
              icon: "💛",
              mealEmoji: "🍝",
              dinner: "Chicken Alfredo (double batch)",
              adultLunch: "adult lunch → thermos Fri OK (opt)",
              recipe: {
                title: "Chicken Alfredo",
                have: "Bertolli Garlic Alfredo, pasta, chicken, Parmesan",
                steps: [
                  "Pasta + Bertolli Garlic Alfredo + chicken; double batch.",
                  "Extra helps Fri if Ted wants leftover Alfredo instead of fish.",
                ],
                enjoy: "Finish pasta in the sauce.",
                buy: "chicken breasts ~2 lb; Alfredo + pasta if low",
              },
            },
            {
              id: "fri",
              day: "Friday",
              short: "Fri",
              icon: "🐟",
              mealEmoji: "🐟",
              dinner: "Salmon (Samantha) + rice + veg",
              adultLunch: "adult lunch → —",
              tedNote: "Ted: leftover Alfredo or rotisserie/chicken (not fish)",
              recipe: {
                title: "Salmon night (Samantha)",
                have: "rice, veg; leftover Alfredo/chicken for Ted",
                steps: [
                  "Bake/pan salmon for Samantha (+ kids who want it); rice + veg.",
                  "Ted pulls leftover Alfredo or rotisserie/chicken — no fish.",
                ],
                enjoy: "Two plates, one kitchen — Sam’s fish + Ted’s leftover sub.",
                buy: "salmon fillets (Fri — Sam)",
              },
            },
            {
              id: "sat",
              day: "Saturday",
              short: "Sat",
              icon: "🏈",
              mealEmoji: "🌶️",
              dinner: "Chili pot (daytime / football / company)",
              adultLunch: "Sun lunch → chili leftover optional (not a second cook)",
              recipe: {
                title: "Weekend chili (daytime pot)",
                have: "tomatoes, beans, broth, chili powder/cumin",
                steps: [
                  "Daytime cook: beef, onion, tomatoes, beans, broth, chili powder/cumin.",
                  "Cheese + Doritos on top. Company-friendly.",
                  "Leftover Sun lunch for who wants it — do NOT cook chili twice.",
                ],
                enjoy: "Football / company energy — one weekend pot only.",
                buy: "ground beef ~1–1.5 lb (chili +/or tacos); onion",
              },
            },
            {
              id: "sun",
              day: "Sunday",
              short: "Sun",
              icon: "☀️",
              mealEmoji: "🥞",
              dinner: "Breakfast-for-dinner",
              adultLunch: "Sun lunch → chili leftover (optional); pack Tucker Mon kit",
              recipe: {
                title: "Breakfast-for-dinner",
                have: "eggs, bagels, fruit",
                steps: [
                  "Eggs, bagels, sausage; fruit.",
                  "Pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
                ],
                enjoy: "Hot plates together.",
                buy: "breakfast sausage",
              },
            },
          ],
          groceries: [
            ...tuckerGroceries("w1"),
            { id: "w1a-rotisserie", category: "Meat", name: "Rotisserie", price: "", hint: "", days: ["mon"] },
            { id: "w1a-chicken", category: "Meat", name: "Chicken breasts ~2 lb (Alfredo)", price: "", hint: "", days: ["thu"] },
            { id: "w1a-beef", category: "Meat", name: "Ground beef ~1–1.5 lb (chili +/or tacos)", price: "", hint: "", days: ["tue", "sat"] },
            { id: "w1a-salmon", category: "Meat", name: "Salmon fillets (Fri — Samantha)", price: "", hint: "Ted skips fish — leftover sub that night", days: ["fri"] },
            { id: "w1a-sausage", category: "Meat", name: "Breakfast sausage (Sun)", price: "", hint: "", days: ["sun"] },
            { id: "w1a-eggs", category: "Meat", name: "Eggs (if low)", price: "", hint: "", days: ["sun"], staple: true },
            { id: "w1a-potatoes", category: "Produce", name: "Potatoes / rice sides", price: "", hint: "", days: ["mon", "fri"], staple: true },
            { id: "w1a-onion", category: "Produce", name: "Onion", price: "", hint: "", days: ["sat"] },
            { id: "w1a-salad", category: "Produce", name: "Salad / veg", price: "", hint: "", days: ["mon", "fri"] },
            { id: "w1a-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w1a-cheese", category: "Dairy", name: "Taco cheese if low", price: "", hint: "Skip if stocked", days: ["tue"], staple: true },
            { id: "w1a-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "", staple: true },
            { id: "w1a-tortillas", category: "Pantry", name: "Tortillas / salsa if low", price: "", hint: "Skip if stocked", days: ["tue", "wed"], staple: true },
            { id: "w1a-alfredo", category: "Pantry", name: "Alfredo + pasta if low", price: "", hint: "Often already stocked — skip", days: ["thu"], staple: true },
            { id: "w1a-chili-cans", category: "Pantry", name: "Chili beans/tomatoes if pantry empty", price: "", hint: "Weekend chili only this plan", days: ["sat"], staple: true },
          ],
        },
        B: {
          id: "B",
          label: "Option B",
          blurb: "Chicken-heavy · tilapia · burgers · no chili",
          budget: "~$100–130",
          houseNote: "No chili this week (Week 1 A has the weekend chili). Skip chili ingredients.",
          days: [
            {
              id: "mon",
              day: "Monday",
              short: "Mon",
              icon: "🥘",
              mealEmoji: "🍗",
              dinner: "Sheet-pan oven chicken + potatoes + peppers",
              adultLunch: "adult lunch → leftovers (opt)",
              recipe: {
                title: "Sheet-pan oven chicken",
                have: "oil, salt, garlic powder, paprika",
                steps: ["425°F chicken + potatoes + peppers; oil, salt, garlic, paprika."],
                enjoy: "Spread out for browning.",
                buy: "chicken breasts; peppers; potatoes",
              },
            },
            {
              id: "tue",
              day: "Tuesday",
              short: "Tue",
              icon: "⭐",
              mealEmoji: "🫓",
              dinner: "Quesadilla night (chicken/cheese)",
              adultLunch: "adult lunch → extra quesadilla (opt)",
              recipe: {
                title: "Quesadilla night",
                have: "tortillas, cheese, chicken, salsa/beans",
                steps: ["Tortillas + cheese + chicken; salsa/beans side."],
                enjoy: "Crispy cheese edges.",
                buy: "tortillas/cheese if low",
              },
            },
            {
              id: "wed",
              day: "Wednesday",
              short: "Wed",
              icon: "🍗",
              mealEmoji: "🍚",
              dinner: "Oven chicken thighs/breasts + rice + salad",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Oven chicken + rice",
                have: "chicken, rice, salad",
                steps: ["Oven chicken + rice + salad — extra chicken variety."],
                enjoy: "Rest chicken before slicing.",
                buy: "enough chicken for Mon + Wed",
              },
            },
            {
              id: "thu",
              day: "Thursday",
              short: "Thu",
              icon: "🐟",
              mealEmoji: "🐟",
              dinner: "Tilapia (Samantha) + rice + veg",
              adultLunch: "adult lunch → —",
              tedNote: "Ted: leftover chicken/quesadilla (not fish)",
              recipe: {
                title: "Tilapia night (Samantha)",
                have: "rice, veg; leftover chicken/quesadilla for Ted",
                steps: [
                  "Seasoned tilapia bake/pan for Samantha; rice + veg.",
                  "Ted eats leftover chicken/quesadilla — no fish.",
                ],
                enjoy: "Sam’s fish night; Ted’s leftover sub ready from earlier in the week.",
                buy: "tilapia Thu",
              },
            },
            {
              id: "fri",
              day: "Friday",
              short: "Fri",
              icon: "🛒",
              mealEmoji: "🥪",
              dinner: "Rotisserie or leftover chicken sandwiches + salad",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Busy-night chicken sandwiches",
                have: "bread/bagels, salad; rotisserie or leftover chicken",
                steps: ["Rotisserie or leftover chicken sandwiches + salad."],
                enjoy: "Keep Friday light and fast.",
                buy: "rotisserie if no leftovers",
              },
            },
            {
              id: "sat",
              day: "Saturday",
              short: "Sat",
              icon: "🍔",
              mealEmoji: "🍔",
              dinner: "Burger night + simple sides",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Burger night",
                have: "ground beef; chips/pickles optional",
                steps: ["Burger patties; buns optional; chips/pickles."],
                enjoy: "Simple sides are enough — no chili this week.",
                buy: "burger beef Sat; buns optional",
              },
            },
            {
              id: "sun",
              day: "Sunday",
              short: "Sun",
              icon: "☀️",
              mealEmoji: "🥞",
              dinner: "Breakfast-for-dinner",
              adultLunch: "pack Tucker Mon kit Sun night",
              recipe: {
                title: "Breakfast-for-dinner",
                have: "eggs, bagels, fruit",
                steps: [
                  "Eggs, bagels, sausage.",
                  "Pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
                ],
                enjoy: "Hot plates together.",
                buy: "breakfast sausage",
              },
            },
          ],
          groceries: [
            ...tuckerGroceries("w1"),
            { id: "w1b-chicken", category: "Meat", name: "Chicken breasts (enough Mon + Wed)", price: "", hint: "", days: ["mon", "wed"] },
            { id: "w1b-tilapia", category: "Meat", name: "Tilapia (Thu — Samantha)", price: "", hint: "Ted skips fish — leftover chicken/quesadilla", days: ["thu"] },
            { id: "w1b-rotisserie", category: "Meat", name: "Rotisserie if no leftover chicken (Fri)", price: "", hint: "", days: ["fri"] },
            { id: "w1b-beef", category: "Meat", name: "Burger beef (Sat)", price: "", hint: "Skip chili ingredients this week", days: ["sat"] },
            { id: "w1b-sausage", category: "Meat", name: "Breakfast sausage (Sun)", price: "", hint: "", days: ["sun"] },
            { id: "w1b-eggs", category: "Meat", name: "Eggs (if low)", price: "", hint: "", days: ["sun"], staple: true },
            { id: "w1b-potatoes", category: "Produce", name: "Potatoes", price: "", hint: "", days: ["mon"] },
            { id: "w1b-peppers", category: "Produce", name: "Peppers", price: "", hint: "", days: ["mon"] },
            { id: "w1b-salad", category: "Produce", name: "Salad refresh", price: "", hint: "", days: ["wed", "fri"] },
            { id: "w1b-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w1b-cheese", category: "Dairy", name: "Cheese for quesadillas if low", price: "", hint: "Skip if stocked", days: ["tue"], staple: true },
            { id: "w1b-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "", staple: true },
            { id: "w1b-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Skip if stocked", days: ["wed", "thu"], staple: true },
            { id: "w1b-tortillas", category: "Pantry", name: "Tortillas if low", price: "", hint: "Skip if stocked", days: ["tue"], staple: true },
            { id: "w1b-buns", category: "Pantry", name: "Burger buns (optional)", price: "", hint: "", days: ["sat"] },
          ],
        },
      },
    },
    2: {
      id: "2",
      label: "Week 2",
      title: "Oct 12–18, 2026",
      range: "Oct 12–18",
      plans: {
        A: {
          id: "A",
          label: "Option A",
          blurb: "Tacos · Alfredo · salmon · sausage · no chili",
          budget: "~$100–130",
          houseNote: "No chili this week (Week 1 A already had weekend chili). Potato bar without chili.",
          days: [
            {
              id: "mon",
              day: "Monday",
              short: "Mon",
              icon: "🥘",
              mealEmoji: "🍗",
              dinner: "Sheet-pan chicken + potatoes + broccoli",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Sheet-pan chicken",
                have: "oil, salt, garlic powder, paprika",
                steps: ["425°F chicken breasts + potatoes + broccoli."],
                enjoy: "Don’t crowd the pan.",
                buy: "chicken breasts; potatoes; broccoli",
              },
            },
            {
              id: "tue",
              day: "Tuesday",
              short: "Tue",
              icon: "🌮",
              mealEmoji: "🌮",
              dinner: "Taco night",
              adultLunch: "adult lunch → meat → Wed rebuild (opt)",
              recipe: {
                title: "Taco night",
                have: "tortillas, taco packet, cheese, salsa, beans",
                steps: ["Taco night; save meat for Wed rebuild."],
                enjoy: "Warm tortillas.",
                buy: "taco beef/chicken if needed",
              },
            },
            {
              id: "wed",
              day: "Wednesday",
              short: "Wed",
              icon: "⭐",
              mealEmoji: "🧀",
              dinner: "Taco rebuild",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Taco rebuild",
                have: "leftover taco meat, chips/rice/tortillas, cheese",
                steps: ["Rebuild from taco meat."],
                enjoy: "New shape.",
                buy: "none",
              },
            },
            {
              id: "thu",
              day: "Thursday",
              short: "Thu",
              icon: "💛",
              mealEmoji: "🍝",
              dinner: "Chicken Alfredo (double batch)",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Chicken Alfredo",
                have: "Alfredo, pasta, chicken, Parmesan",
                steps: [
                  "Pasta + Alfredo + chicken; double batch.",
                  "Extra covers Ted on Fri fish night.",
                ],
                enjoy: "Finish in the sauce.",
                buy: "Alfredo/pasta if low; chicken",
              },
            },
            {
              id: "fri",
              day: "Friday",
              short: "Fri",
              icon: "🐟",
              mealEmoji: "🐟",
              dinner: "Salmon (Samantha) + rice + salad",
              adultLunch: "adult lunch → —",
              tedNote: "Ted: leftover Alfredo (not fish)",
              recipe: {
                title: "Salmon night (Samantha)",
                have: "rice, salad; leftover Alfredo for Ted",
                steps: [
                  "Salmon for Samantha; rice + salad.",
                  "Ted = Alfredo leftover — no fish.",
                ],
                enjoy: "Two plates, one night.",
                buy: "salmon Fri",
              },
            },
            {
              id: "sat",
              day: "Saturday",
              short: "Sat",
              icon: "🌭",
              mealEmoji: "🌭",
              dinner: "Sausage sheet-pan + potatoes + peppers",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Sausage sheet-pan",
                have: "oil, salt, garlic powder, paprika",
                steps: ["Sausage + potatoes + peppers — daytime-friendly sheet pan."],
                enjoy: "No chili this week — sheet pan is the weekend cook.",
                buy: "sausage Sat; peppers",
              },
            },
            {
              id: "sun",
              day: "Sunday",
              short: "Sun",
              icon: "☀️",
              mealEmoji: "🥔",
              dinner: "Baked potato bar (cheese, butter, leftover chicken/sausage)",
              adultLunch: "pack Tucker Mon kit Sun night",
              recipe: {
                title: "Baked potato bar",
                have: "potatoes, butter, cheese, leftover chicken/sausage",
                steps: [
                  "Baked potatoes + toppings (no chili).",
                  "Pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
                ],
                enjoy: "Everyone builds their own — no chili toppings this week.",
                buy: "potatoes if not bought Mon",
              },
            },
          ],
          groceries: [
            ...tuckerGroceries("w2"),
            { id: "w2a-chicken", category: "Meat", name: "Chicken breasts", price: "", hint: "", days: ["mon", "thu"] },
            { id: "w2a-beef", category: "Meat", name: "Taco beef/chicken if needed", price: "", hint: "", days: ["tue"] },
            { id: "w2a-salmon", category: "Meat", name: "Salmon (Fri — Samantha)", price: "", hint: "Ted = Alfredo leftover", days: ["fri"] },
            { id: "w2a-sausage", category: "Meat", name: "Sausage (Sat sheet-pan)", price: "", hint: "", days: ["sat"] },
            { id: "w2a-potatoes", category: "Produce", name: "Potatoes (Mon + Sun bar)", price: "", hint: "", days: ["mon", "sun"] },
            { id: "w2a-broccoli", category: "Produce", name: "Broccoli", price: "", hint: "", days: ["mon"] },
            { id: "w2a-peppers", category: "Produce", name: "Peppers (Sat)", price: "", hint: "", days: ["sat"] },
            { id: "w2a-salad", category: "Produce", name: "Salad if needed", price: "", hint: "", days: ["fri"] },
            { id: "w2a-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w2a-cheese", category: "Dairy", name: "Cheese if low", price: "", hint: "Skip if stocked", days: ["tue", "sun"], staple: true },
            { id: "w2a-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "", staple: true },
            { id: "w2a-tortillas", category: "Pantry", name: "Tortillas if low", price: "", hint: "Skip if stocked", days: ["tue", "wed"], staple: true },
            { id: "w2a-alfredo", category: "Pantry", name: "Alfredo + pasta if low", price: "", hint: "Skip if stocked", days: ["thu"], staple: true },
            { id: "w2a-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Skip if stocked", days: ["fri"], staple: true },
          ],
        },
        B: {
          id: "B",
          label: "Option B",
          blurb: "Chicken · quesadillas · tilapia · weekend chili",
          budget: "~$100–130",
          houseNote: "Weekend chili Sat only this week (not Week 1 B). One daytime pot — leftover Sun lunch optional.",
          days: [
            {
              id: "mon",
              day: "Monday",
              short: "Mon",
              icon: "🍗",
              mealEmoji: "🍚",
              dinner: "Oven chicken + rice + salad",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Oven chicken + rice",
                have: "chicken breasts, rice, salad",
                steps: ["Oven breasts + rice + salad."],
                enjoy: "Simple chicken start.",
                buy: "chicken breasts",
              },
            },
            {
              id: "tue",
              day: "Tuesday",
              short: "Tue",
              icon: "⭐",
              mealEmoji: "🫓",
              dinner: "Quesadilla night",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Quesadilla night",
                have: "tortillas, cheese, chicken",
                steps: ["Quesadillas with chicken/cheese."],
                enjoy: "Save leftover for Ted on Wed if needed.",
                buy: "tortillas/cheese if low",
              },
            },
            {
              id: "wed",
              day: "Wednesday",
              short: "Wed",
              icon: "🐟",
              mealEmoji: "🐟",
              dinner: "Tilapia (Samantha) + rice + veg",
              adultLunch: "adult lunch → —",
              tedNote: "Ted: leftover chicken/quesadilla (not fish)",
              recipe: {
                title: "Tilapia night (Samantha)",
                have: "rice, veg; leftover chicken/quesadilla for Ted",
                steps: [
                  "Tilapia for Samantha; rice + veg.",
                  "Ted leftover chicken/quesadilla — no fish.",
                ],
                enjoy: "Sam’s fish; Ted’s leftover sub.",
                buy: "tilapia",
              },
            },
            {
              id: "thu",
              day: "Thursday",
              short: "Thu",
              icon: "💛",
              mealEmoji: "🍝",
              dinner: "Chicken Alfredo or chicken + pasta bake",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Chicken pasta night",
                have: "pasta, Alfredo or bake ingredients, chicken",
                steps: ["Alfredo or simple chicken pasta bake — keep chicken heavy."],
                enjoy: "Comfort pasta midweek.",
                buy: "Alfredo if doing pasta; chicken",
              },
            },
            {
              id: "fri",
              day: "Friday",
              short: "Fri",
              icon: "🛒",
              mealEmoji: "🍗",
              dinner: "Rotisserie + salad (busy)",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Rotisserie busy night",
                have: "salad, dressing",
                steps: ["Rotisserie + salad."],
                enjoy: "Keep Friday easy.",
                buy: "rotisserie",
              },
            },
            {
              id: "sat",
              day: "Saturday",
              short: "Sat",
              icon: "🏈",
              mealEmoji: "🌶️",
              dinner: "Chili pot (daytime / football / company)",
              adultLunch: "Sun lunch → chili leftover optional (not a second cook)",
              recipe: {
                title: "Weekend chili (daytime pot)",
                have: "beans, tomatoes, broth, chili spices",
                steps: [
                  "Chili daytime pot — one cook for the weekend.",
                  "Leftover Sun lunch for who wants it — not a second cook.",
                ],
                enjoy: "Football / company — this week’s only chili.",
                buy: "chili beef + beans/tomatoes",
              },
            },
            {
              id: "sun",
              day: "Sunday",
              short: "Sun",
              icon: "☀️",
              mealEmoji: "🥞",
              dinner: "Breakfast-for-dinner",
              adultLunch: "Sun lunch → chili leftover (optional); pack Tucker Mon kit",
              recipe: {
                title: "Breakfast-for-dinner",
                have: "eggs, bagels, fruit",
                steps: [
                  "Eggs, bagels, sausage.",
                  "Pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
                ],
                enjoy: "Hot plates together.",
                buy: "breakfast sausage",
              },
            },
          ],
          groceries: [
            ...tuckerGroceries("w2"),
            { id: "w2b-chicken", category: "Meat", name: "Chicken (Mon/Thu pasta)", price: "", hint: "", days: ["mon", "thu"] },
            { id: "w2b-tilapia", category: "Meat", name: "Tilapia (Wed — Samantha)", price: "", hint: "Ted = leftover chicken/quesadilla", days: ["wed"] },
            { id: "w2b-rotisserie", category: "Meat", name: "Rotisserie (Fri)", price: "", hint: "", days: ["fri"] },
            { id: "w2b-beef", category: "Meat", name: "Chili beef (Sat weekend pot)", price: "", hint: "Weekend chili only — not midweek", days: ["sat"] },
            { id: "w2b-sausage", category: "Meat", name: "Breakfast sausage (Sun)", price: "", hint: "", days: ["sun"] },
            { id: "w2b-eggs", category: "Meat", name: "Eggs (if low)", price: "", hint: "", days: ["sun"], staple: true },
            { id: "w2b-salad", category: "Produce", name: "Salad", price: "", hint: "", days: ["mon"] },
            { id: "w2b-veg", category: "Produce", name: "Veg for fish night / sides", price: "", hint: "", days: ["wed"] },
            { id: "w2b-onion", category: "Produce", name: "Onion (chili)", price: "", hint: "", days: ["sat"] },
            { id: "w2b-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w2b-cheese", category: "Dairy", name: "Cheese if low", price: "", hint: "Skip if stocked", days: ["tue"], staple: true },
            { id: "w2b-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "", staple: true },
            { id: "w2b-alfredo", category: "Pantry", name: "Alfredo if doing Thu pasta", price: "", hint: "Skip if stocked", days: ["thu"], staple: true },
            { id: "w2b-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Skip if stocked", days: ["mon", "wed"], staple: true },
            { id: "w2b-chili-cans", category: "Pantry", name: "Chili beans/tomatoes if pantry empty", price: "", hint: "Sat daytime chili only", days: ["sat"], staple: true },
          ],
        },
      },
    },
    3: {
      id: "3",
      label: "Week 3",
      title: "Oct 19–25, 2026",
      range: "Oct 19–25",
      plans: {
        A: {
          id: "A",
          label: "Option A",
          blurb: "Pork · tacos · tilapia · grab & go · no chili",
          budget: "~$100–130",
          houseNote: "No chili this week. Grab-and-go Fri. Taco leftovers → Wed dinner.",
          days: [
            {
              id: "mon",
              day: "Monday",
              short: "Mon",
              icon: "👨‍🍳",
              mealEmoji: "🍗",
              dinner: "Oven chicken breast + rice + green beans",
              adultLunch: "adult lunch → chicken (opt)",
              recipe: {
                title: "Oven chicken breast",
                have: "oil, salt, garlic powder, paprika, rice",
                steps: ["425°F chicken breasts; rice + green beans."],
                enjoy: "Rest chicken before slicing.",
                buy: "chicken breasts; green beans",
              },
            },
            {
              id: "tue",
              day: "Tuesday",
              short: "Tue",
              icon: "🌮",
              mealEmoji: "🌮",
              dinner: "Taco night",
              adultLunch: "adult lunch → leftover taco meat Wed dinner (opt)",
              recipe: {
                title: "Taco night",
                have: "tortillas, taco packet, cheese, salsa, beans",
                steps: ["Beef or shredded chicken + taco packet; save meat for Wed dinner rebuild."],
                enjoy: "Warm tortillas; leftover meat → next dinner.",
                buy: "ground beef if needed; tortillas/cheese/salsa if low",
              },
            },
            {
              id: "wed",
              day: "Wednesday",
              short: "Wed",
              icon: "⭐",
              mealEmoji: "🧀",
              dinner: "Taco rebuild (nachos / bowls / quesadillas)",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Taco rebuild",
                have: "leftover taco meat, chips/tortillas/rice, cheese, salsa",
                steps: ["Rebuild from taco meat — nachos, bowls, or quesadillas."],
                enjoy: "Taco leftovers become tonight’s dinner.",
                buy: "none",
              },
            },
            {
              id: "thu",
              day: "Thursday",
              short: "Thu",
              icon: "🐷",
              mealEmoji: "🐷",
              dinner: "Pork chops + potatoes + salad",
              adultLunch: "adult lunch → leftover pork (opt)",
              recipe: {
                title: "Pork chop night",
                have: "oil, salt, garlic, potatoes, salad",
                steps: ["Pan or oven pork chops; potatoes + salad."],
                enjoy: "Pork variety week — not chicken every night.",
                buy: "pork chops; potatoes if low",
              },
            },
            {
              id: "fri",
              day: "Friday",
              short: "Fri",
              icon: "🐟",
              mealEmoji: "🐟",
              dinner: "Tilapia (Samantha) + rice + veg",
              adultLunch: "adult lunch → —",
              tedNote: "Ted: leftover pork or chicken (not fish)",
              recipe: {
                title: "Tilapia night (Samantha)",
                have: "rice, veg; leftover pork/chicken for Ted",
                steps: [
                  "Seasoned tilapia for Samantha; rice + veg.",
                  "Ted pulls leftover pork or chicken — no fish.",
                ],
                enjoy: "Sam’s fish + Ted’s leftover sub.",
                buy: "tilapia Fri",
              },
            },
            {
              id: "sat",
              day: "Saturday",
              short: "Sat",
              icon: "🛒",
              mealEmoji: "🛍",
              dinner: "Grab & go: Publix rotisserie + bagged salad",
              adultLunch: "adult lunch → —",
              grabGo: true,
              recipe: {
                title: "Grab & go rotisserie night",
                have: "plates + dressing if home",
                steps: ["Pick up Publix rotisserie + bagged salad.", "Plate and eat — minimal dishes."],
                enjoy: "Busy Saturday off the stove.",
                buy: "Publix rotisserie + bagged salad",
              },
            },
            {
              id: "sun",
              day: "Sunday",
              short: "Sun",
              icon: "☀️",
              mealEmoji: "🥞",
              dinner: "Breakfast-for-dinner",
              adultLunch: "pack Tucker Mon kit Sun night",
              recipe: {
                title: "Breakfast-for-dinner",
                have: "eggs, bagels, fruit",
                steps: [
                  "Eggs, bagels, sausage; fruit.",
                  "Pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
                ],
                enjoy: "Hot plates together.",
                buy: "breakfast sausage",
              },
            },
          ],
          groceries: [
            ...tuckerGroceries("w3"),
            { id: "w3a-chicken", category: "Meat", name: "Chicken breasts (Mon)", price: "", hint: "", days: ["mon"] },
            { id: "w3a-beef", category: "Meat", name: "Taco beef if needed", price: "", hint: "", days: ["tue"] },
            { id: "w3a-pork", category: "Meat", name: "Pork chops (Thu)", price: "", hint: "", days: ["thu"] },
            { id: "w3a-tilapia", category: "Meat", name: "Tilapia (Fri — Samantha)", price: "", hint: "Ted skips fish — leftover pork/chicken", days: ["fri"] },
            { id: "w3a-rotisserie", category: "Meat", name: "Publix rotisserie (Sat grab & go)", price: "", hint: "🛍 Grab & go", days: ["sat"] },
            { id: "w3a-sausage", category: "Meat", name: "Breakfast sausage (Sun)", price: "", hint: "", days: ["sun"] },
            { id: "w3a-eggs", category: "Meat", name: "Eggs (if low)", price: "", hint: "", days: ["sun"], staple: true },
            { id: "w3a-potatoes", category: "Produce", name: "Potatoes", price: "", hint: "", days: ["thu"] },
            { id: "w3a-beans", category: "Produce", name: "Green beans", price: "", hint: "", days: ["mon"] },
            { id: "w3a-salad", category: "Produce", name: "Bagged salad (Thu + Sat grab & go)", price: "", hint: "", days: ["thu", "sat"] },
            { id: "w3a-veg", category: "Produce", name: "Veg for fish night", price: "", hint: "", days: ["fri"] },
            { id: "w3a-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w3a-cheese", category: "Dairy", name: "Taco cheese if low", price: "", hint: "Skip if stocked", days: ["tue"], staple: true },
            { id: "w3a-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "", staple: true },
            { id: "w3a-tortillas", category: "Pantry", name: "Tortillas / salsa if low", price: "", hint: "Skip if stocked", days: ["tue", "wed"], staple: true },
            { id: "w3a-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Skip if stocked", days: ["mon", "fri"], staple: true },
          ],
        },
        B: {
          id: "B",
          label: "Option B",
          blurb: "Alfredo · burgers · salmon · weekend chili",
          budget: "~$100–130",
          houseNote: "Weekend chili Sat only this week for Option B new weeks. One daytime pot.",
          days: [
            {
              id: "mon",
              day: "Monday",
              short: "Mon",
              icon: "💛",
              mealEmoji: "🍝",
              dinner: "Chicken Alfredo (double batch)",
              adultLunch: "adult lunch → thermos OK (opt)",
              recipe: {
                title: "Chicken Alfredo",
                have: "Bertolli Garlic Alfredo, pasta, chicken, Parmesan",
                steps: [
                  "Pasta + Alfredo + chicken breasts; double batch.",
                  "Extra helps Ted on fish night.",
                ],
                enjoy: "Finish pasta in the sauce.",
                buy: "chicken breasts; Alfredo + pasta if low",
              },
            },
            {
              id: "tue",
              day: "Tuesday",
              short: "Tue",
              icon: "🍔",
              mealEmoji: "🍔",
              dinner: "Burger night + simple sides",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Burger night",
                have: "ground beef; chips/pickles optional",
                steps: ["Burger patties; buns optional; chips/pickles."],
                enjoy: "Simple midweek burgers.",
                buy: "burger beef; buns optional",
              },
            },
            {
              id: "wed",
              day: "Wednesday",
              short: "Wed",
              icon: "🥘",
              mealEmoji: "🍗",
              dinner: "Sheet-pan oven chicken + potatoes + broccoli",
              adultLunch: "adult lunch → leftovers (opt)",
              recipe: {
                title: "Sheet-pan oven chicken",
                have: "oil, salt, garlic powder, paprika",
                steps: ["425°F chicken breasts + potatoes + broccoli."],
                enjoy: "Don’t crowd the pan.",
                buy: "chicken breasts; potatoes; broccoli",
              },
            },
            {
              id: "thu",
              day: "Thursday",
              short: "Thu",
              icon: "🐟",
              mealEmoji: "🐟",
              dinner: "Salmon (Samantha) + rice + salad",
              adultLunch: "adult lunch → —",
              tedNote: "Ted: leftover Alfredo or chicken (not fish)",
              recipe: {
                title: "Salmon night (Samantha)",
                have: "rice, salad; leftover Alfredo/chicken for Ted",
                steps: [
                  "Bake/pan salmon for Samantha; rice + salad.",
                  "Ted = leftover Alfredo or chicken — no fish.",
                ],
                enjoy: "Two plates, one night.",
                buy: "salmon Thu",
              },
            },
            {
              id: "fri",
              day: "Friday",
              short: "Fri",
              icon: "🛒",
              mealEmoji: "🥪",
              dinner: "Rotisserie or leftover chicken sandwiches + salad",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Busy-night chicken sandwiches",
                have: "bread/bagels, salad; rotisserie or leftover chicken",
                steps: ["Rotisserie or leftover chicken sandwiches + salad."],
                enjoy: "Keep Friday light and fast.",
                buy: "rotisserie if no leftovers",
              },
            },
            {
              id: "sat",
              day: "Saturday",
              short: "Sat",
              icon: "🏈",
              mealEmoji: "🌶️",
              dinner: "Chili pot (daytime / football / company)",
              adultLunch: "Sun lunch → chili leftover optional (not a second cook)",
              recipe: {
                title: "Weekend chili (daytime pot)",
                have: "tomatoes, beans, broth, chili powder/cumin",
                steps: [
                  "Daytime cook: beef, onion, tomatoes, beans, broth, chili powder/cumin.",
                  "Cheese + Doritos on top. Company-friendly.",
                  "Leftover Sun lunch for who wants it — do NOT cook chili twice.",
                ],
                enjoy: "This week’s only chili for Option B new weeks.",
                buy: "ground beef ~1–1.5 lb; onion",
              },
            },
            {
              id: "sun",
              day: "Sunday",
              short: "Sun",
              icon: "☀️",
              mealEmoji: "🥞",
              dinner: "Breakfast-for-dinner",
              adultLunch: "Sun lunch → chili leftover (optional); pack Tucker Mon kit",
              recipe: {
                title: "Breakfast-for-dinner",
                have: "eggs, bagels, fruit",
                steps: [
                  "Eggs, bagels, sausage.",
                  "Pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
                ],
                enjoy: "Hot plates together.",
                buy: "breakfast sausage",
              },
            },
          ],
          groceries: [
            ...tuckerGroceries("w3"),
            { id: "w3b-chicken", category: "Meat", name: "Chicken breasts (Mon Alfredo + Wed sheet-pan)", price: "", hint: "", days: ["mon", "wed"] },
            { id: "w3b-beef", category: "Meat", name: "Burger beef + chili beef", price: "", hint: "", days: ["tue", "sat"] },
            { id: "w3b-salmon", category: "Meat", name: "Salmon (Thu — Samantha)", price: "", hint: "Ted = Alfredo/chicken leftover", days: ["thu"] },
            { id: "w3b-rotisserie", category: "Meat", name: "Rotisserie if no leftovers (Fri)", price: "", hint: "", days: ["fri"] },
            { id: "w3b-sausage", category: "Meat", name: "Breakfast sausage (Sun)", price: "", hint: "", days: ["sun"] },
            { id: "w3b-eggs", category: "Meat", name: "Eggs (if low)", price: "", hint: "", days: ["sun"], staple: true },
            { id: "w3b-potatoes", category: "Produce", name: "Potatoes", price: "", hint: "", days: ["wed"] },
            { id: "w3b-broccoli", category: "Produce", name: "Broccoli", price: "", hint: "", days: ["wed"] },
            { id: "w3b-salad", category: "Produce", name: "Salad", price: "", hint: "", days: ["thu", "fri"] },
            { id: "w3b-onion", category: "Produce", name: "Onion (chili)", price: "", hint: "", days: ["sat"] },
            { id: "w3b-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w3b-cheese", category: "Dairy", name: "Cheese if low", price: "", hint: "Skip if stocked", days: ["sat"], staple: true },
            { id: "w3b-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "", staple: true },
            { id: "w3b-alfredo", category: "Pantry", name: "Alfredo + pasta if low", price: "", hint: "Skip if stocked", days: ["mon"], staple: true },
            { id: "w3b-buns", category: "Pantry", name: "Burger buns (optional)", price: "", hint: "", days: ["tue"] },
            { id: "w3b-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Skip if stocked", days: ["thu"], staple: true },
            { id: "w3b-chili-cans", category: "Pantry", name: "Chili beans/tomatoes if pantry empty", price: "", hint: "Sat daytime chili only", days: ["sat"], staple: true },
          ],
        },
      },
    },
    4: {
      id: "4",
      label: "Week 4",
      title: "Oct 26–Nov 1, 2026",
      range: "Oct 26–Nov 1",
      plans: {
        A: {
          id: "A",
          label: "Option A",
          blurb: "Sausage · quesadillas · chicken · tilapia · pizza night",
          budget: "~$100–130",
          houseNote: "No chili this week. Frozen pizza grab-and-go Fri.",
          days: [
            {
              id: "mon",
              day: "Monday",
              short: "Mon",
              icon: "🌭",
              mealEmoji: "🌭",
              dinner: "Sausage sheet-pan + potatoes + peppers",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Sausage sheet-pan",
                have: "oil, salt, garlic powder, paprika",
                steps: ["Sausage + potatoes + peppers sheet pan."],
                enjoy: "Easy Monday sheet pan.",
                buy: "smoked sausage; peppers; potatoes",
              },
            },
            {
              id: "tue",
              day: "Tuesday",
              short: "Tue",
              icon: "⭐",
              mealEmoji: "🫓",
              dinner: "Quesadilla night (chicken/cheese)",
              adultLunch: "adult lunch → extra quesadilla (opt)",
              recipe: {
                title: "Quesadilla night",
                have: "tortillas, cheese, chicken, salsa/beans",
                steps: ["Tortillas + cheese + chicken; salsa/beans side."],
                enjoy: "Crispy cheese edges.",
                buy: "tortillas/cheese if low",
              },
            },
            {
              id: "wed",
              day: "Wednesday",
              short: "Wed",
              icon: "🍗",
              mealEmoji: "🍚",
              dinner: "Oven chicken breast + rice + salad",
              adultLunch: "adult lunch → leftovers (opt)",
              recipe: {
                title: "Oven chicken + rice",
                have: "chicken breasts, rice, salad",
                steps: ["Oven chicken breasts + rice + salad."],
                enjoy: "Rest chicken before slicing.",
                buy: "chicken breasts",
              },
            },
            {
              id: "thu",
              day: "Thursday",
              short: "Thu",
              icon: "🐟",
              mealEmoji: "🐟",
              dinner: "Tilapia (Samantha) + rice + veg",
              adultLunch: "adult lunch → —",
              tedNote: "Ted: leftover chicken/quesadilla (not fish)",
              recipe: {
                title: "Tilapia night (Samantha)",
                have: "rice, veg; leftover chicken/quesadilla for Ted",
                steps: [
                  "Tilapia for Samantha; rice + veg.",
                  "Ted leftover chicken/quesadilla — no fish.",
                ],
                enjoy: "Sam’s fish; Ted’s leftover sub.",
                buy: "tilapia Thu",
              },
            },
            {
              id: "fri",
              day: "Friday",
              short: "Fri",
              icon: "🛒",
              mealEmoji: "🛍",
              dinner: "Grab & go: frozen pizza night",
              adultLunch: "adult lunch → —",
              grabGo: true,
              recipe: {
                title: "Frozen pizza night",
                have: "oven + plates",
                steps: ["Bake frozen pizzas per box.", "Salad bag optional."],
                enjoy: "Zero-fuss Friday.",
                buy: "frozen pizzas (family size or 2)",
              },
            },
            {
              id: "sat",
              day: "Saturday",
              short: "Sat",
              icon: "🍔",
              mealEmoji: "🍔",
              dinner: "Burger night + simple sides",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Burger night",
                have: "ground beef; chips/pickles optional",
                steps: ["Burger patties; buns optional; chips/pickles."],
                enjoy: "Weekend burgers — no chili this week.",
                buy: "burger beef Sat; buns optional",
              },
            },
            {
              id: "sun",
              day: "Sunday",
              short: "Sun",
              icon: "☀️",
              mealEmoji: "🥞",
              dinner: "Breakfast-for-dinner",
              adultLunch: "pack Tucker Mon kit Sun night",
              recipe: {
                title: "Breakfast-for-dinner",
                have: "eggs, bagels, fruit",
                steps: [
                  "Eggs, bagels, sausage.",
                  "Pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
                ],
                enjoy: "Hot plates together.",
                buy: "breakfast sausage",
              },
            },
          ],
          groceries: [
            ...tuckerGroceries("w4"),
            { id: "w4a-sausage-sheet", category: "Meat", name: "Smoked sausage (Mon sheet-pan)", price: "", hint: "", days: ["mon"] },
            { id: "w4a-chicken", category: "Meat", name: "Chicken breasts (Tue quesadilla + Wed)", price: "", hint: "", days: ["tue", "wed"] },
            { id: "w4a-tilapia", category: "Meat", name: "Tilapia (Thu — Samantha)", price: "", hint: "Ted skips fish", days: ["thu"] },
            { id: "w4a-beef", category: "Meat", name: "Burger beef (Sat)", price: "", hint: "", days: ["sat"] },
            { id: "w4a-sausage", category: "Meat", name: "Breakfast sausage (Sun)", price: "", hint: "", days: ["sun"] },
            { id: "w4a-eggs", category: "Meat", name: "Eggs (if low)", price: "", hint: "", days: ["sun"], staple: true },
            { id: "w4a-pizza", category: "Frozen", name: "Frozen pizzas (Fri grab & go)", price: "", hint: "🛍 Grab & go", days: ["fri"] },
            { id: "w4a-potatoes", category: "Produce", name: "Potatoes", price: "", hint: "", days: ["mon"] },
            { id: "w4a-peppers", category: "Produce", name: "Peppers", price: "", hint: "", days: ["mon"] },
            { id: "w4a-salad", category: "Produce", name: "Salad", price: "", hint: "", days: ["wed"] },
            { id: "w4a-veg", category: "Produce", name: "Veg for fish night", price: "", hint: "", days: ["thu"] },
            { id: "w4a-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w4a-cheese", category: "Dairy", name: "Cheese for quesadillas if low", price: "", hint: "Skip if stocked", days: ["tue"], staple: true },
            { id: "w4a-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "", staple: true },
            { id: "w4a-tortillas", category: "Pantry", name: "Tortillas if low", price: "", hint: "Skip if stocked", days: ["tue"], staple: true },
            { id: "w4a-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Skip if stocked", days: ["wed", "thu"], staple: true },
            { id: "w4a-buns", category: "Pantry", name: "Burger buns (optional)", price: "", hint: "", days: ["sat"] },
          ],
        },
        B: {
          id: "B",
          label: "Option B",
          blurb: "Rotisserie · tacos · Alfredo · salmon · no chili",
          budget: "~$100–130",
          houseNote: "No chili this week (Week 3 B has the weekend chili). Taco leftovers → Wed dinner.",
          days: [
            {
              id: "mon",
              day: "Monday",
              short: "Mon",
              icon: "👨‍🍳",
              mealEmoji: "🍗",
              dinner: "Rotisserie + rice/potatoes + salad",
              adultLunch: "adult lunch → chicken (opt)",
              recipe: {
                title: "Rotisserie plate",
                have: "rotisserie, rice/potatoes, salad, dressing",
                steps: ["Warm rotisserie; rice/potatoes; salad."],
                enjoy: "Easy Monday start.",
                buy: "rotisserie if not home",
              },
            },
            {
              id: "tue",
              day: "Tuesday",
              short: "Tue",
              icon: "🌮",
              mealEmoji: "🌮",
              dinner: "Taco night",
              adultLunch: "adult lunch → leftover taco meat Wed dinner (opt)",
              recipe: {
                title: "Taco night",
                have: "tortillas, taco packet, cheese, salsa, beans",
                steps: ["Taco night; save meat for Wed dinner rebuild."],
                enjoy: "Leftover meat → next dinner.",
                buy: "taco beef/chicken if needed",
              },
            },
            {
              id: "wed",
              day: "Wednesday",
              short: "Wed",
              icon: "⭐",
              mealEmoji: "🧀",
              dinner: "Taco rebuild",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Taco rebuild",
                have: "leftover taco meat, chips/rice/tortillas, cheese",
                steps: ["Rebuild from taco meat."],
                enjoy: "New shape, same taco night.",
                buy: "none",
              },
            },
            {
              id: "thu",
              day: "Thursday",
              short: "Thu",
              icon: "💛",
              mealEmoji: "🍝",
              dinner: "Chicken Alfredo (double batch)",
              adultLunch: "adult lunch → —",
              recipe: {
                title: "Chicken Alfredo",
                have: "Alfredo, pasta, chicken, Parmesan",
                steps: [
                  "Pasta + Alfredo + chicken; double batch.",
                  "Extra covers Ted on Fri fish night.",
                ],
                enjoy: "Finish in the sauce.",
                buy: "Alfredo/pasta if low; chicken breasts",
              },
            },
            {
              id: "fri",
              day: "Friday",
              short: "Fri",
              icon: "🐟",
              mealEmoji: "🐟",
              dinner: "Salmon (Samantha) + rice + salad",
              adultLunch: "adult lunch → —",
              tedNote: "Ted: leftover Alfredo (not fish)",
              recipe: {
                title: "Salmon night (Samantha)",
                have: "rice, salad; leftover Alfredo for Ted",
                steps: [
                  "Salmon for Samantha; rice + salad.",
                  "Ted = Alfredo leftover — no fish.",
                ],
                enjoy: "Two plates, one night.",
                buy: "salmon Fri",
              },
            },
            {
              id: "sat",
              day: "Saturday",
              short: "Sat",
              icon: "🛒",
              mealEmoji: "🛍",
              dinner: "Grab & go: Publix subs",
              adultLunch: "adult lunch → —",
              grabGo: true,
              recipe: {
                title: "Publix subs night",
                have: "chips/fruit optional at home",
                steps: ["Order or grab Publix subs for the family.", "Skip the stove."],
                enjoy: "Busy Saturday grab & go.",
                buy: "Publix subs for 4",
              },
            },
            {
              id: "sun",
              day: "Sunday",
              short: "Sun",
              icon: "☀️",
              mealEmoji: "🥔",
              dinner: "Baked potato bar (cheese, butter, leftover chicken)",
              adultLunch: "pack Tucker Mon kit Sun night",
              recipe: {
                title: "Baked potato bar",
                have: "potatoes, butter, cheese, leftover chicken",
                steps: [
                  "Baked potatoes + toppings (no chili).",
                  "Pack Tucker’s fixed Mon lunchbox kit (not dinner leftovers).",
                ],
                enjoy: "Everyone builds their own.",
                buy: "potatoes if low",
              },
            },
          ],
          groceries: [
            ...tuckerGroceries("w4"),
            { id: "w4b-rotisserie", category: "Meat", name: "Rotisserie (Mon)", price: "", hint: "", days: ["mon"] },
            { id: "w4b-beef", category: "Meat", name: "Taco beef/chicken if needed", price: "", hint: "", days: ["tue"] },
            { id: "w4b-chicken", category: "Meat", name: "Chicken breasts (Alfredo)", price: "", hint: "", days: ["thu"] },
            { id: "w4b-salmon", category: "Meat", name: "Salmon (Fri — Samantha)", price: "", hint: "Ted = Alfredo leftover", days: ["fri"] },
            { id: "w4b-subs", category: "Meat", name: "Publix subs ×4 (Sat grab & go)", price: "", hint: "🛍 Grab & go", days: ["sat"] },
            { id: "w4b-potatoes", category: "Produce", name: "Potatoes (Mon sides + Sun bar)", price: "", hint: "", days: ["mon", "sun"] },
            { id: "w4b-salad", category: "Produce", name: "Salad if needed", price: "", hint: "", days: ["mon", "fri"] },
            { id: "w4b-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w4b-cheese", category: "Dairy", name: "Cheese if low", price: "", hint: "Skip if stocked", days: ["tue", "sun"], staple: true },
            { id: "w4b-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "", staple: true },
            { id: "w4b-tortillas", category: "Pantry", name: "Tortillas if low", price: "", hint: "Skip if stocked", days: ["tue", "wed"], staple: true },
            { id: "w4b-alfredo", category: "Pantry", name: "Alfredo + pasta if low", price: "", hint: "Skip if stocked", days: ["thu"], staple: true },
            { id: "w4b-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Skip if stocked", days: ["fri"], staple: true },
          ],
        },
      },
    },
  };

  const defaultState = () => ({
    week: "1",
    plan: "A",
    weekTitle: WEEKS["1"].title,
    checked: {},
    prices: {},
    qty: {},
    notes: {},
    haveIt: {},
    custom: [],
    dayOverrides: {},
    weekEdits: {},
    budget: { on: true, amt: null, days: 7 },
    store: "best",
    storeName: "Aldi",
    location: "Vero Beach",
    customStores: [],
    ratings: {},
    mealLog: {},
    houseRules: DEFAULT_HOUSE_RULES.slice(),
    holidays: defaultHolidays(),
    months: {},
    monthKey: currentMonthKey(),
    shopMode: false,
    hideChecked: false,
    showHiddenHave: false,
    groceryDayFilter: "all",
    lastGentleAt: null,
  });

  let state;
  let wakeLock = null;
  let swapTargetDayId = null;
  let highlightDayId = null;

  const els = {
    weekLabel: document.getElementById("week-label"),
    budgetBand: document.getElementById("budget-band"),
    budgetCompare: document.getElementById("budget-compare"),
    budgetChip: document.getElementById("budget-chip"),
    storeChip: document.getElementById("store-chip"),
    listStoreChip: document.getElementById("list-store-chip"),
    budgetProgress: document.getElementById("budget-progress"),
    budgetProgressFill: document.getElementById("budget-progress-fill"),
    calBtn: document.getElementById("cal-btn"),
    rcptBtn: document.getElementById("rcpt-btn"),
    settingsBtn: document.getElementById("settings-btn"),
    settingsModal: document.getElementById("settings-modal"),
    settingsClose: document.getElementById("settings-close"),
    settingsBody: document.getElementById("settings-body"),
    estimateBand: document.getElementById("estimate-band"),
    houseNote: document.getElementById("house-note"),
    heroCard: document.getElementById("hero-card"),
    monthGrid: document.getElementById("month-grid"),
    monthPrev: document.getElementById("month-prev"),
    monthNext: document.getElementById("month-next"),
    monthName: document.getElementById("month-name"),
    monthMenu: document.getElementById("month-menu"),
    monthDup: document.getElementById("month-dup"),
    weekGrid: document.getElementById("week-grid"),
    weekReviewPanel: document.getElementById("week-review-panel"),
    weekReviewBody: document.getElementById("week-review-body"),
    gentleBanner: document.getElementById("gentle-banner"),
    groceryList: document.getElementById("grocery-list"),
    checkedCount: document.getElementById("checked-count"),
    groceryControls: document.getElementById("grocery-controls"),
    customName: document.getElementById("custom-name"),
    customCategory: document.getElementById("custom-category"),
    customPrice: document.getElementById("custom-price"),
    addCustom: document.getElementById("add-custom"),
    copyShare: document.getElementById("copy-share"),
    copyGrocery: document.getElementById("copy-grocery"),
    shopMode: document.getElementById("shop-mode"),
    resetChecks: document.getElementById("reset-checks"),
    toast: document.getElementById("toast"),
    modal: document.getElementById("recipe-modal"),
    modalClose: document.getElementById("modal-close"),
    modalTitle: document.getElementById("modal-title"),
    modalLunch: document.getElementById("modal-lunch"),
    modalBody: document.getElementById("modal-body"),
    swapModal: document.getElementById("swap-modal"),
    swapClose: document.getElementById("swap-close"),
    swapTitle: document.getElementById("swap-title"),
    swapBody: document.getElementById("swap-body"),
  };

  function currentMonthKey(d) {
    const x = d || new Date();
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
  }

  function monthLabel(key) {
    const [y, m] = String(key || "").split("-").map(Number);
    if (!y || !m) return "Month";
    return `${MOFULL[m - 1]} ${y}`;
  }

  function shiftMonthKey(key, delta) {
    const [y, m] = String(key).split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return currentMonthKey(d);
  }

  function easterSunday(y) {
    const a = y % 19;
    const b = Math.floor(y / 100);
    const c = y % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }

  function nthWeekday(y, monthIndex, weekday, n) {
    let count = 0;
    for (let d = 1; d <= 31; d++) {
      const dt = new Date(y, monthIndex, d);
      if (dt.getMonth() !== monthIndex) break;
      if (dt.getDay() === weekday) {
        count += 1;
        if (count === n) return dt;
      }
    }
    return null;
  }

  function lastWeekday(y, monthIndex, weekday) {
    const last = new Date(y, monthIndex + 1, 0);
    for (let d = last.getDate(); d >= 1; d--) {
      const dt = new Date(y, monthIndex, d);
      if (dt.getDay() === weekday) return dt;
    }
    return last;
  }

  function isoDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function defaultHolidays() {
    return [
      { id: "thanksgiving", name: "Thanksgiving", emoji: "🦃", kind: "thanksgiving", cook: false },
      { id: "xmas-eve", name: "Christmas Eve", emoji: "🎄", kind: "fixed", month: 12, day: 24, cook: false },
      { id: "xmas", name: "Christmas Day", emoji: "🎄", kind: "fixed", month: 12, day: 25, cook: false },
      { id: "easter", name: "Easter Sunday", emoji: "🐣", kind: "easter", cook: false },
      { id: "newyear", name: "New Year's Day", emoji: "🎆", kind: "fixed", month: 1, day: 1, cook: false },
      { id: "july4", name: "July 4", emoji: "🇺🇸", kind: "fixed", month: 7, day: 4, cook: false },
      { id: "memorial", name: "Memorial Day", emoji: "🫡", kind: "memorial", cook: false },
      { id: "labor", name: "Labor Day", emoji: "🛠️", kind: "labor", cook: false },
    ];
  }

  state = defaultState();

  function holidayDateForYear(h, year) {
    if (!h || h.cook) return null;
    if (h.kind === "fixed") return new Date(year, h.month - 1, h.day);
    if (h.kind === "easter") return easterSunday(year);
    if (h.kind === "thanksgiving") return nthWeekday(year, 10, 4, 4);
    if (h.kind === "memorial") return lastWeekday(year, 4, 1);
    if (h.kind === "labor") return nthWeekday(year, 8, 1, 1);
    if (h.kind === "custom" && h.date) {
      const [y, m, d] = h.date.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return null;
  }

  function holidayOnDate(d) {
    if (!d) return null;
    const list = state.holidays || [];
    const y = d.getFullYear();
    for (const h of list) {
      if (h.cook) continue;
      const hd = holidayDateForYear(h, y);
      if (hd && sameDay(hd, d)) return h;
      if (h.kind === "custom" && h.date === isoDate(d) && !h.cook) return h;
    }
    return null;
  }

  function weekMonday() {
    return parseWeekLabel(state.weekTitle) || mondayOf(new Date());
  }

  function dateForDayId(dayId) {
    const mon = weekMonday();
    const idx = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].indexOf(dayId);
    if (idx < 0) return null;
    return addDays(mon, idx);
  }

  function ensureMonth(key, st) {
    const root = st || state;
    if (!root.months) root.months = {};
    if (!root.months[key]) {
      root.months[key] = {
        picks: {},
        weekEdits: {},
        deletedWeeks: {},
        duplicated: false,
      };
    }
    const m = root.months[key];
    if (!m.picks) m.picks = {};
    if (!m.weekEdits) m.weekEdits = {};
    if (!m.deletedWeeks) m.deletedWeeks = {};
    return m;
  }

  function activeMonth() {
    return ensureMonth(state.monthKey || currentMonthKey(), state);
  }

  function isDupMonth() {
    return Boolean(activeMonth().duplicated);
  }

  function currentWeek() {
    return WEEKS[state.week] || WEEKS["1"];
  }

  function currentPlan() {
    const week = currentWeek();
    return week.plans[state.plan] || week.plans.A;
  }

  function dinnerKey(weekId, planId, dayId) {
    return `${weekId}-${planId}-${dayId}`;
  }

  function parseDinnerKey(key) {
    if (!key || typeof key !== "string") return null;
    if (GRAB_GO[key]) return null;
    const parts = key.split("-");
    if (parts.length < 3) return null;
    const [weekId, planId, dayId] = parts;
    const week = WEEKS[weekId];
    if (!week || !week.plans[planId]) return null;
    const day = week.plans[planId].days.find((d) => d.id === dayId);
    if (!day) return null;
    return { weekId, planId, dayId, week, plan: week.plans[planId], day };
  }

  function allTemplateDinners() {
    const list = [];
    Object.keys(WEEKS).forEach((weekId) => {
      const week = WEEKS[weekId];
      Object.keys(week.plans).forEach((planId) => {
        const plan = week.plans[planId];
        plan.days.forEach((day) => {
          list.push({
            key: dinnerKey(weekId, planId, day.id),
            weekId,
            planId,
            label: `${week.label} ${planId} · ${day.short}`,
            day,
          });
        });
      });
    });
    return list;
  }

  function groceriesForDinnerKey(key) {
    if (GRAB_GO[key]) {
      return GRAB_GO[key].groceries.map((g) => ({
        ...g,
        category: normalizeCategory(g.category),
        custom: false,
        fromSwap: true,
        sourceKey: key,
        days: [],
      }));
    }
    const parsed = parseDinnerKey(key);
    if (!parsed) return [];
    return parsed.plan.groceries
      .filter((g) => Array.isArray(g.days) && g.days.includes(parsed.dayId))
      .map((g) => ({
        ...g,
        category: normalizeCategory(g.category),
        custom: false,
        fromSwap: true,
        sourceKey: key,
      }));
  }

  function dayOverride(dayId, map) {
    const ov = (map || state.dayOverrides)[dayId];
    return ov && typeof ov === "object" ? ov : null;
  }

  function blankHolidayDay(templateDay, holiday) {
    const label = `${holiday.emoji || "🎉"} ${holiday.name}, no plan`;
    return {
      ...templateDay,
      dinner: label,
      icon: holiday.emoji || "🎉",
      mealEmoji: holiday.emoji || "🎉",
      adultLunch: "adult lunch → —",
      tedNote: "",
      recipe: {
        title: label,
        have: "a holiday off the plan",
        steps: ["Big cooking holiday — left blank on purpose.", "Nothing from this night is on the shopping list or in the budget."],
        enjoy: "Enjoy the holiday.",
        buy: "none",
      },
      overrideType: "holiday",
      swapped: false,
      holiday: true,
      holidayName: holiday.name,
      blank: true,
      calories: 0,
      mealCalories: 0,
    };
  }

  function applySpecialShape(templateDay, special, overrideType, extra) {
    return {
      ...templateDay,
      dinner: special.dinner,
      icon: special.icon,
      mealEmoji: special.mealEmoji,
      adultLunch: special.adultLunch,
      tedNote: special.tedNote || "",
      recipe: special.recipe,
      overrideType,
      swapped: true,
      tag: special.tag || "",
      calories: special.calories,
      mealCalories: special.mealCalories,
      ...(extra || {}),
    };
  }

  function effectiveDay(templateDay, map) {
    const date = dateForDayId(templateDay.id);
    const hol = date ? holidayOnDate(date) : null;
    if (hol) return blankHolidayDay(templateDay, hol);

    const ov = dayOverride(templateDay.id, map);
    if (!ov) {
      return { ...templateDay, overrideType: null, swapped: false, blank: false };
    }
    if (ov.type === "holiday") {
      const h = (state.holidays || []).find((x) => x.id === ov.id) || { name: "Holiday", emoji: "🎉", cook: false };
      return blankHolidayDay(templateDay, h);
    }
    if (ov.type === "leftovers") {
      return applySpecialShape(templateDay, SPECIAL_DINNERS.leftovers, "leftovers", { blank: false, calories: 450, mealCalories: 450 });
    }
    if (ov.type === "eatout") {
      return applySpecialShape(templateDay, SPECIAL_DINNERS.eatout, "eatout", { blank: true, calories: 750, mealCalories: 750 });
    }
    if (ov.type === "removed" || ov.type === "pickmeal") {
      const special = ov.type === "pickmeal" ? SPECIAL_DINNERS.pickmeal : {
        dinner: "Removed from this week",
        icon: "🚫",
        mealEmoji: "🚫",
        adultLunch: "adult lunch → —",
        tedNote: "",
        recipe: { title: "Removed from this week", have: "a free night", steps: ["This night was removed from the week.", "Its grocery lines are off the list. Tap Swap to pick something."], enjoy: "Night off.", buy: "none" },
      };
      return {
        ...templateDay,
        dinner: special.dinner,
        icon: special.icon,
        mealEmoji: special.mealEmoji,
        adultLunch: special.adultLunch,
        tedNote: "",
        recipe: special.recipe,
        overrideType: ov.type === "pickmeal" ? "pickmeal" : "removed",
        swapped: true,
        blank: true,
        calories: 0,
        mealCalories: 0,
      };
    }
    if (ov.type === "grabgo" && ov.key && GRAB_GO[ov.key]) {
      return applySpecialShape(templateDay, GRAB_GO[ov.key], "grabgo", { swapKey: ov.key, blank: false, grabGo: true });
    }
    if (ov.type === "pick" && ov.key) {
      if (GRAB_GO[ov.key]) {
        return applySpecialShape(templateDay, GRAB_GO[ov.key], "grabgo", { swapKey: ov.key, blank: false, grabGo: true });
      }
      const parsed = parseDinnerKey(ov.key);
      if (!parsed) return { ...templateDay, overrideType: null, swapped: false };
      const src = parsed.day;
      return {
        ...templateDay,
        dinner: src.dinner,
        icon: src.icon,
        mealEmoji: src.mealEmoji,
        adultLunch: src.adultLunch,
        tedNote: src.tedNote || "",
        recipe: src.recipe,
        overrideType: "pick",
        swapKey: ov.key,
        swapped: true,
        blank: false,
        swapLabel: `${parsed.week.label} ${parsed.planId} · ${src.short}`,
        grabGo: Boolean(src.grabGo),
      };
    }
    return { ...templateDay, overrideType: null, swapped: false };
  }

  function skipsGrocery(day) {
    return (
      day.blank ||
      day.holiday ||
      day.overrideType === "holiday" ||
      day.overrideType === "removed" ||
      day.overrideType === "pickmeal" ||
      day.overrideType === "eatout" ||
      day.overrideType === "leftovers"
    );
  }

  function activeOriginalDayIds() {
    const plan = currentPlan();
    const active = new Set();
    plan.days.forEach((day) => {
      const eff = effectiveDay(day);
      if (skipsGrocery(eff)) return;
      const ov = dayOverride(day.id);
      if (!ov) active.add(day.id);
    });
    return active;
  }

  function normalizeCategory(cat) {
    if (!cat || typeof cat !== "string") return "Other";
    if (LEGACY_CATEGORY[cat]) return LEGACY_CATEGORY[cat];
    return CATEGORIES.includes(cat) ? cat : "Other";
  }

  function itemChecked(id) {
    return Boolean(state.checked[id]);
  }

  function setChecked(id, value) {
    if (value) state.checked[id] = true;
    else delete state.checked[id];
  }

  function itemHaveIt(id) {
    return Boolean(state.haveIt[id]);
  }

  function setHaveIt(id, value) {
    if (value) state.haveIt[id] = true;
    else delete state.haveIt[id];
  }

  function itemQty(id) {
    const v = state.qty[id];
    return typeof v === "string" ? v : "";
  }

  function itemNote(id) {
    const v = state.notes[id];
    return typeof v === "string" ? v : "";
  }

  function setQty(id, raw) {
    const trimmed = String(raw ?? "").trim().slice(0, 40);
    if (!trimmed) delete state.qty[id];
    else state.qty[id] = trimmed;
  }

  function setNote(id, raw) {
    const trimmed = String(raw ?? "").trim().slice(0, 80);
    if (!trimmed) delete state.notes[id];
    else state.notes[id] = trimmed;
  }

  function itemPrice(id, fallback) {
    if (Object.prototype.hasOwnProperty.call(state.prices, id)) {
      const n = Number(state.prices[id]);
      return Number.isFinite(n) && n >= 0 ? n : null;
    }
    if (fallback !== undefined && fallback !== "" && fallback !== null) {
      const n = Number(fallback);
      return Number.isFinite(n) && n >= 0 ? n : null;
    }
    return null;
  }

  function setPrice(id, raw) {
    const trimmed = String(raw ?? "").trim();
    if (!trimmed) {
      delete state.prices[id];
      return;
    }
    const n = Number(trimmed);
    if (!Number.isFinite(n) || n < 0) return;
    state.prices[id] = Math.round(n * 100) / 100;
  }

  function formatMoney(n) {
    return `$${n.toFixed(2).replace(/\.00$/, "")}`;
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

/* ---- shared helpers: sheet, week calendar, long-press, photo share ---- */
  const MO3=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const MOFULL=["January","February","March","April","May","June","July","August","September","October","November","December"];
  function mondayOf(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
  function addDays(d,n){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x}
  function sameDay(a,b){return a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
  function fmtWeek(mon){const e=addDays(mon,6);return `${MO3[mon.getMonth()]} ${mon.getDate()}–${mon.getMonth()===e.getMonth()?"":MO3[e.getMonth()]+" "}${e.getDate()}, ${e.getFullYear()}`}
  function parseWeekLabel(str){
    const m=/^\s*([A-Z][a-z]{2})[a-z]*\.?\s+(\d{1,2})\s*[–-]\s*(?:([A-Z][a-z]{2})[a-z]*\.?\s+)?(\d{1,2}),?\s+(\d{4})\s*$/.exec(String(str||""));
    if(!m)return null;const sm=MO3.indexOf(m[1]);const em=m[3]?MO3.indexOf(m[3]):sm;if(sm<0||em<0)return null;
    let y=+m[5];const sy=em<sm?y-1:y;const d=new Date(sy,sm,+m[2]);return isNaN(d)?null:mondayOf(d)}
  function shEl(){return document.getElementById("sheet")}
  function openSheet(html,label){const bg=shEl(),inn=document.getElementById("sheetIn");inn.innerHTML=html;if(label)inn.setAttribute("aria-label",label);bg.classList.add("open");bg.setAttribute("aria-hidden","false");const x=inn.querySelector("[data-x]");if(x)x.focus();return inn}
  function closeSheet(){const bg=shEl();if(!bg)return;bg.classList.remove("open");bg.setAttribute("aria-hidden","true");const inn=document.getElementById("sheetIn");if(inn)inn.innerHTML=""}
  function sheetOpen(){const bg=shEl();return bg&&bg.classList.contains("open")}
  function initSheet(){const bg=shEl();if(!bg||bg._init)return;bg._init=1;
    bg.addEventListener("click",e=>{if(e.target===bg||e.target.closest("[data-x]"))closeSheet()});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&sheetOpen()){e.stopPropagation();closeSheet()}},true)}
  const shTop=(t)=>`<div class="sh-top"><h3>${t}</h3><button class="sh-x" data-x="1" aria-label="Close">✕</button></div>`;
  function openCal(opts){
    const today=new Date();today.setHours(0,0,0,0);
    let sel=opts.sel?mondayOf(opts.sel):null;
    let view=new Date((sel||today).getFullYear(),(sel||today).getMonth(),1);
    const inn=openSheet("", "Pick a week");
    function draw(){
      const first=view, gs=mondayOf(first);
      const rows=[];for(let r=0;r<6;r++){const rm=addDays(gs,r*7);if(r>=4&&rm.getMonth()!==view.getMonth()&&rm>first)break;rows.push(rm)}
      inn.innerHTML=shTop("📅 Pick a week")+`
        <p class="cal-sel">${sel?"Selected: "+fmtWeek(sel):"Tap any day to pick its Mon–Sun week"}</p>
        <div class="cal-nav"><button data-cm="-1" aria-label="Previous month">‹</button><b>${MOFULL[view.getMonth()]} ${view.getFullYear()}</b><button data-cm="1" aria-label="Next month">›</button></div>
        <div class="cal-dow"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div>
        ${rows.map(rm=>`<div class="cal-row${sel&&sameDay(rm,sel)?" sel":""}">${[0,1,2,3,4,5,6].map(i=>{const d=addDays(rm,i);
          const hol=holidayOnDate(d);
          return `<button class="cal-d${d.getMonth()!==view.getMonth()?" out":""}${sameDay(d,today)?" today":""}${hol?" hol":""}" data-day="${d.getFullYear()}-${d.getMonth()}-${d.getDate()}" aria-label="${MOFULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}${sameDay(d,today)?" (today)":""}${hol?" · "+hol.name:""}">${hol?hol.emoji+" ":""}${d.getDate()}</button>`}).join("")}</div>`).join("")}
        <div class="cal-foot"><button data-cw="-1">‹ Prev week</button><button class="now" data-now="1">This week</button><button data-cw="1">Next week ›</button></div>`;
      inn.querySelectorAll("[data-cm]").forEach(b=>b.onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+(+b.dataset.cm),1);draw()});
      inn.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{const [y,m,d]=b.dataset.day.split("-").map(Number);sel=mondayOf(new Date(y,m,d));opts.onPick(sel);if(typeof opts.onPick==="function"){/* caller handles */}closeSheet()});
      inn.querySelectorAll("[data-cw]").forEach(b=>b.onclick=()=>{sel=addDays(sel||mondayOf(today),7*(+b.dataset.cw));view=new Date(sel.getFullYear(),sel.getMonth(),1);opts.onPick(sel,true);draw()});
      inn.querySelector("[data-now]").onclick=()=>{sel=mondayOf(today);opts.onPick(sel);closeSheet()};
    }
    draw();
  }
  function longPress(el,fn,ms){ms=ms||500;let t=null,x=0,y=0,fired=false;
    el.classList.add("lp");
    el.addEventListener("pointerdown",e=>{if(e.button>0)return;fired=false;x=e.clientX;y=e.clientY;clearTimeout(t);t=setTimeout(()=>{t=null;fired=true;try{navigator.vibrate&&navigator.vibrate(15)}catch(_){}fn()},ms)});
    const cancel=()=>{clearTimeout(t);t=null};
    el.addEventListener("pointermove",e=>{if(t&&Math.hypot(e.clientX-x,e.clientY-y)>10)cancel()});
    ["pointerup","pointerleave","pointercancel"].forEach(ev=>el.addEventListener(ev,cancel));
    el.addEventListener("contextmenu",e=>e.preventDefault());
    el.addEventListener("click",e=>{if(fired){e.preventDefault();e.stopImmediatePropagation();fired=false}},true)}
  function attachShare(o){
    const files=o.files;
    const draw=()=>{
      o.thumbs.innerHTML=files.map(f=>`<img alt="photo" src="${f._url}">`).join("");
      if(!files.length){o.act.innerHTML="";return}
      const can=!!(navigator.canShare&&navigator.share&&navigator.canShare({files}));
      o.act.innerHTML=can?`<button class="${o.btnClass||"sbtn"}" data-share="1">${o.shareLabel}</button><p class="shr-msg" data-msg></p>`
        :`<p class="shr-msg">${o.fallback}</p>`;
      const sb=o.act.querySelector("[data-share]");
      if(sb)sb.onclick=async()=>{const msg=o.act.querySelector("[data-msg]");
        try{await navigator.share({files,title:o.title,text:o.text});msg.textContent="Shared. "+(o.after||"")}
        catch(err){msg.textContent=err&&err.name==="AbortError"?"Share cancelled. Tap again when ready.":o.fallback}};
    };
    o.inputs.forEach(inp=>inp.addEventListener("change",()=>{[...inp.files].forEach(f=>{f._url=URL.createObjectURL(f);files.push(f)});inp.value="";draw()}));
    draw();
  }
  function openReceipt(){
    const inn=openSheet(shTop("📷 Upload receipt")+`
      <p style="margin:0 0 10px;font-weight:700;font-size:15px">Snap your receipt (or a Publix app Purchases screenshot), then send it to Jarvis.</p>
      <div class="sh-row2" style="margin-top:0"><button class="sh-btn p" data-pick="cam">📷 Take photo</button><button class="sh-btn" data-pick="lib">🖼 Choose photos</button></div>
      <input type="file" accept="image/*" capture="environment" hidden data-in="cam"><input type="file" accept="image/*" multiple hidden data-in="lib">
      <div class="thumbs" data-th></div><div data-act></div>
      <p class="muted2"><b>Prices update after Jarvis reads it.</b> This page is a static site: nothing is uploaded from here. "Send to Jarvis" just opens your phone's share sheet so you can send the photo into the chat.</p>`,"Upload receipt");
    inn.querySelector('[data-pick="cam"]').onclick=()=>inn.querySelector('[data-in="cam"]').click();
    inn.querySelector('[data-pick="lib"]').onclick=()=>inn.querySelector('[data-in="lib"]').click();
    attachShare({inputs:[...inn.querySelectorAll("[data-in]")],thumbs:inn.querySelector("[data-th]"),act:inn.querySelector("[data-act]"),files:[],
      btnClass:"sh-btn p wide",shareLabel:"Send to Jarvis",title:"Receipt",text:"Receipt for the meal-planner prices",
      after:"Prices update after Jarvis reads it.",fallback:"Your browser can't open the share sheet from here. Save the photo (long-press → Save) and send it to Jarvis in chat."});
  }
  function srcLabel(e){if(!e)return "est.";const md=s=>{const d=new Date(s+"T12:00:00");return isNaN(d)?"":MO3[d.getMonth()]+" "+d.getDate()};
    if(e.source==="receipt")return "receipt "+md(e.checked);
    if(e.source==="ad"||e.source==="weekly-ad")return "ad"+(e.sale_ends?" thru "+md(e.sale_ends):"");
    if(e.source==="online-listing")return "online "+md(e.checked);
    if(e.source==="shelf-photo")return "shelf "+md(e.checked);
    if(e.general || e.fallbackGeneral) return "est. (not this store yet)";
    return "est. · checked "+md(e.checked||"2026-10-05")}
  function isStale(e){if(!e||!e.checked)return false;const d=new Date(e.checked+"T12:00:00");return !isNaN(d)&&(Date.now()-d.getTime())>60*864e5}
  function fmtDateLong(s){const d=new Date(s+"T12:00:00");return isNaN(d)?s:`${MO3[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`}

  const FAM_PRICES = {"rotisserie": {"n": "Rotisserie chicken", "q": "1 whole", "a": 4.99, "p": 7.99, "note": "Publix deli price varies; Aldi when stocked"}, "chicken": {"n": "Chicken breasts, boneless skinless", "q": "~2.5 lb", "a": 5.73, "p": 13.83, "note": "Aldi ~$2.29/lb · Publix ~$5.53/lb"}, "beef": {"n": "Ground beef 80/20", "q": "~1.5 lb", "a": 7.94, "p": 13.28}, "salmon": {"n": "Salmon fillets", "q": "~1 lb", "a": 9.99, "p": 12.99}, "tilapia": {"n": "Tilapia fillets", "q": "~1 lb", "a": 4.99, "p": 7.99}, "sausage": {"n": "Sausage (breakfast or smoked)", "q": "1 pack", "a": 2.79, "p": 4.99}, "eggs": {"n": "Large eggs", "q": "1 dozen", "a": 1.85, "p": 2.19}, "potatoes": {"n": "Potatoes", "q": "5 lb bag", "a": 2.99, "p": 4.99}, "onion": {"n": "Yellow onions", "q": "3 lb bag", "a": 2.49, "p": 3.99}, "salad": {"n": "Salad bag", "q": "1 bag", "a": 1.99, "p": 3.49}, "fruit": {"n": "Fruit (bananas + apples)", "q": "~6 bananas + 3 lb apples", "a": 4.99, "p": 6.99}, "peppers": {"n": "Bell peppers", "q": "3 pk", "a": 2.99, "p": 4.49}, "broccoli": {"n": "Broccoli crowns", "q": "~1 lb", "a": 1.79, "p": 2.99}, "veg": {"n": "Veg for sides", "q": "1 bag / bunch", "a": 1.99, "p": 2.99}, "beans": {"n": "Green beans", "q": "~1 lb", "a": 1.79, "p": 2.49}, "pork": {"n": "Pork chops", "q": "~1.5 lb", "a": 6.99, "p": 9.99}, "cheese": {"n": "Shredded cheese", "q": "8 oz", "a": 2.29, "p": 3.49}, "milk": {"n": "Milk", "q": "1 gallon", "a": 3.09, "p": 4.69}, "tortillas": {"n": "Flour tortillas", "q": "10 ct", "a": 1.99, "p": 3.29}, "alfredo": {"n": "Alfredo sauce + pasta", "q": "1 jar + 1 lb box", "a": 2.94, "p": 5.08}, "chili-cans": {"n": "Chili beans + diced tomatoes", "q": "2 + 2 cans", "a": 3.2, "p": 5.36}, "rice": {"n": "Long grain rice", "q": "2 lb bag", "a": 1.79, "p": 2.49}, "buns": {"n": "Hamburger buns", "q": "8 ct", "a": 1.55, "p": 4.41}, "pizza": {"n": "Frozen pizza", "q": "2 pizzas", "a": 6.98, "p": 9.98}, "subs": {"n": "Subs", "q": "4 subs", "a": null, "p": 28}, "sausage-sheet": {"n": "Smoked sausage", "q": "1 pack", "a": 2.79, "p": 4.99}, "t-yogurt": {"n": "Yogurt cups", "q": "multipack", "a": null, "p": 6.99, "brand": "Chobani", "al": 3.3}, "t-cheese": {"n": "String cheese", "q": "12 ct", "a": null, "p": 5.99, "brand": "Polly-O", "al": 2.89}, "t-pretzels": {"n": "Pretzels / Pringles", "q": "1 bag or can", "a": 1.49, "p": 2.79}, "t-fruit-snack": {"n": "Fruit snacks", "q": "10 ct box", "a": 1.99, "p": 3.49}, "t-beef-stick": {"n": "Natural beef sticks", "q": "multipack", "a": 3.49, "p": 5.99}, "t-juice": {"n": "Apple juice boxes", "q": "8 pk", "a": null, "p": 3.99, "brand": "Apple & Eve", "al": 1.99}};

  const PRICE_SOURCES = [
    ["Aldi chicken breast family pack $2.29/lb (online listing)", "https://www.aldi.us/store/aldi/products/19554637-fresh-family-pack-chicken-breasts-per-lb"],
    ["Aldi ground beef 80/20 $5.29/lb (online listing)", "https://www.aldi.us/store/aldi/products/17771077-ground-beef-80-20-1-per-lb"],
    ["Aldi eggs $1.85/dozen (online listing)", "https://www.aldi.us/store/aldi/products/115095-goldhen-grade-a-large-eggs-12-ct"],
    ["Aldi hamburger buns $1.55 (online listing)", "https://www.aldi.us/store/aldi/products/20873280-l-oven-fresh-hamburger-buns-12-oz"],
    ["Publix chicken breast 4 lb+ $5.53/lb (online listing)", "https://delivery.publix.com/store/publix/products/387470-publix-chicken-all-natural-boneless-skinless-chicken-breast-per-lb"],
    ["Publix ground beef $8.85/lb (online listing)", "https://delivery.publix.com/store/publix/products/380937-publix-market-ground-beef-1-15-lb"],
    ["Publix eggs 12 ct $2.19 (online listing)", "https://delivery.publix.com/store/publix/products/324877-publix-eggs-large-12-ct"],
    ["Publix bakery buns 8 ct $4.41 (online listing)", "https://delivery.publix.com/store/publix/products/321487-publix-original-hamburger-buns-8-ct"],
  ];
  const PRICE_META = { updated: "2026-10-05", loaded: false, stores: {} };
  const LIVE_PRICES = {};
  Object.keys(FAM_PRICES).forEach((k) => {
    LIVE_PRICES[k] = { ...FAM_PRICES[k], sA: { source: "estimate", checked: "2026-10-05" }, sP: { source: "estimate", checked: "2026-10-05" }, locA: false, locP: false };
  });

  function slugLoc(loc) {
    return String(loc || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function storeLocId(chain, loc) {
    const c = String(chain || "aldi").toLowerCase();
    const l = slugLoc(loc);
    return l ? `${c}:${l}` : c;
  }

  function activeStoreIds() {
    const chain = (state.storeName || "Aldi").toLowerCase().includes("publix") ? "publix" : (state.storeName || "Aldi").toLowerCase().includes("aldi") ? "aldi" : slugLoc(state.storeName) || "aldi";
    const loc = state.location || "Vero Beach";
    return { chain, loc, specific: storeLocId(chain, loc), general: chain };
  }

  function loadPricesJson() {
    if (!window.fetch) return;
    fetch("prices.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        if (!j || !j.items) return;
        if (j.stores) PRICE_META.stores = j.stores;
        Object.keys(j.items).forEach((key) => {
          if (key.indexOf("fam-") !== 0) return;
          const k = key.slice(4);
          const it = j.items[key];
          const P = LIVE_PRICES[k] || (LIVE_PRICES[k] = { n: it.name, q: it.size || "", a: null, p: null, byStore: {} });
          if (!P.byStore) P.byStore = {};
          if (it.size) P.q = it.size;
          if (it.brand) { P.brand = it.brand; P.al = it.aldi_lookalike ?? null; }
          (it.prices || []).forEach((e) => {
            if (!e || e.price === undefined || e.price === null) return;
            const sid = e.store;
            P.byStore[sid] = e;
            // legacy keys
            if (sid === "aldi-vero" || sid === "aldi:vero-beach" || sid === "aldi") {
              if (sid === "aldi" || sid === "aldi:vero-beach" || sid === "aldi-vero") {
                if (sid !== "aldi" || P.a == null) {
                  if (sid === "aldi:vero-beach" || sid === "aldi-vero") { P.a = e.price; P.sA = e; P.locA = true; }
                  else if (!P.locA) { P.a = e.price; P.sA = { ...e, fallbackGeneral: true }; }
                }
              }
            }
            if (sid === "publix-vero" || sid === "publix:vero-beach" || sid === "publix") {
              if (sid === "publix:vero-beach" || sid === "publix-vero") { P.p = e.price; P.sP = e; P.locP = true; }
              else if (!P.locP) { P.p = e.price; P.sP = { ...e, fallbackGeneral: true }; }
            }
          });
        });
        if (j.updated) PRICE_META.updated = j.updated;
        PRICE_META.loaded = true;
        refreshLiveForLocation();
        renderGrocery();
        renderStoreChips();
      })
      .catch(() => {});
  }

  function refreshLiveForLocation() {
    const { specific, general } = activeStoreIds();
    Object.keys(LIVE_PRICES).forEach((k) => {
      const P = LIVE_PRICES[k];
      if (!P.byStore) return;
      const pick = (chain) => {
        const spec = P.byStore[`${chain}:${slugLoc(state.location)}`] || P.byStore[storeLocId(chain, state.location)];
        const gen = P.byStore[chain];
        if (spec && spec.price != null) return { entry: spec, loc: true, price: spec.price };
        if (gen && gen.price != null) return { entry: { ...gen, fallbackGeneral: true, general: true }, loc: false, price: gen.price };
        return null;
      };
      const a = pick("aldi");
      const p = pick("publix");
      if (a) { P.a = a.price; P.sA = a.entry; P.locA = a.loc; }
      if (p) { P.p = p.price; P.sP = p.entry; P.locP = p.loc; }
      // preferred store for single-store display
      const pref = specific.startsWith("publix") ? p : a;
      P.pref = pref;
      P.prefGeneral = pref && !pref.loc;
      void general;
    });
  }

  function priceKeyFor(item) {
    if (!item || item.custom) return null;
    return String(item.id)
      .replace(/^swap-[a-z]+-/, "")
      .replace(/^gg-/, "")
      .replace(/^w\d[ab]?-/, "");
  }
  function storePriceFor(item) {
    const k = priceKeyFor(item);
    return k && LIVE_PRICES[k] ? LIVE_PRICES[k] : null;
  }
  function formatMoney2(n) {
    return `$${(Number(n) || 0).toFixed(2)}`;
  }
  function storeTotals(items) {
    const t = { a: 0, p: 0, b: 0, aLeft: 0, pLeft: 0, bLeft: 0, na: 0, np: 0, cu: 0, own: 0 };
    items.forEach((item) => {
      const own = itemPrice(item.id, item.price);
      const left = !itemChecked(item.id);
      let a, p, b;
      if (own !== null) {
        a = p = b = own;
        t.own += 1;
      } else {
        const sp = storePriceFor(item);
        if (!sp || (sp.a == null && sp.p == null && sp.al == null)) { t.cu += 1; return; }
        a = sp.a != null ? sp.a : sp.al != null ? sp.al : sp.p;
        p = sp.p != null ? sp.p : sp.a;
        const aldiWins = sp.a != null && (sp.p == null || sp.a <= sp.p);
        b = aldiWins ? sp.a : sp.p;
        if (aldiWins) t.na += 1; else t.np += 1;
      }
      t.a += a; t.p += p; t.b += b;
      if (left) { t.aLeft += a; t.pLeft += p; t.bLeft += b; }
    });
    return t;
  }
  function storePriceRow(item) {
    const sp = storePriceFor(item);
    if (!sp) return item.custom && itemPrice(item.id) === null ? `<div class="pr"><span>Store est. ? · add your $</span></div>` : "";
    const aw = sp.a != null && (sp.p == null || sp.a <= sp.p);
    const pw = sp.p != null && !aw;
    const aLab = sp.locA === false && sp.a != null ? "est. (not this store yet)" : srcLabel(sp.sA);
    const pLab = sp.locP === false && sp.p != null ? "est. (not this store yet)" : srcLabel(sp.sP);
    const aTxt = sp.a != null ? `Aldi ${sp.locA === false ? "est. (not this store yet) " : "est. "}${formatMoney2(sp.a)}` : sp.al != null ? `Aldi n/a (look-alike est. ${formatMoney2(sp.al)})` : "Aldi n/a";
    const pTxt = sp.p != null ? `Publix ${sp.locP === false ? "est. (not this store yet) " : "est. "}${formatMoney2(sp.p)}` : "Publix n/a";
    return `<div class="pr">${sp.q ? `<span class="qty-l">${escapeHtml(sp.q)}</span>` : ""}<span class="${aw ? "win" : ""}${isStale(sp.sA) ? " stale" : ""}">${escapeHtml(aTxt)}</span><span class="${pw ? "win" : ""}${isStale(sp.sP) ? " stale" : ""}">${escapeHtml(pTxt)}</span>${aw || pw ? `<span class="win">${aw ? "Aldi" : "Publix"} cheaper</span>` : ""}<span class="src-l">${escapeHtml(aLab === pLab ? aLab : `Aldi ${aLab} · Publix ${pLab}`)}</span></div>`;
  }
  function storePriceText(item) {
    const sp = storePriceFor(item);
    if (!sp) return "";
    const a = sp.a != null ? `Aldi ${sp.locA === false ? "est. (not this store yet) " : "est. "}${formatMoney2(sp.a)}` : sp.al != null ? `Aldi look-alike est. ${formatMoney2(sp.al)}` : "Aldi n/a";
    const p = sp.p != null ? `Publix ${sp.locP === false ? "est. (not this store yet) " : "est. "}${formatMoney2(sp.p)}` : "Publix n/a";
    return `${a} / ${p}`;
  }

  function normalizeBudget(b) {
    const out = { on: true, amt: null, days: 7 };
    if (!b || typeof b !== "object") return out;
    out.on = b.on !== false && b.on !== 0;
    const a = Number(b.amt);
    out.amt = b.amt === null || b.amt === undefined || b.amt === "" || !Number.isFinite(a) || a <= 0 ? null : Math.round(a * 100) / 100;
    const d = Math.round(Number(b.days));
    out.days = Number.isFinite(d) && d >= 1 && d <= 366 ? d : 7;
    return out;
  }
  function normalizeStore(v) {
    return v === "aldi" || v === "publix" ? v : "best";
  }
  function budgetLine(plan) {
    const b = state.budget;
    if (!b.on) return "Budget: off";
    if (b.amt == null) return `Budget band ${plan.budget}`;
    return `Budget ${formatMoney(b.amt)} / ${b.days} days`;
  }

  function scaledBudgetAmount() {
    const b = state.budget;
    if (!b.on || b.amt == null) return null;
    const days = currentPlan().days.filter((d) => !effectiveDay(d).holiday).length || 7;
    return (b.amt * days) / b.days;
  }

  function renderBudgetCompare(tots) {
    const el = els.budgetCompare;
    if (!el) return;
    // Kept for compatibility but hidden — hero sentence + bar replace Est. left / compare.
    el.hidden = true;
    void tots;
  }

  function renderEstimate(items) {
    if (!els.estimateBand) return;
    const t = storeTotals(items);
    const total = state.store === "aldi" ? t.a : state.store === "publix" ? t.p : t.b;
    const b = state.budget;
    const y = scaledBudgetAmount();
    let sentence;
    if (!b.on) {
      sentence = `Groceries this week: about ${formatMoney2(total)}`;
    } else if (y == null) {
      sentence = `Groceries this week: about ${formatMoney2(total)} (${budgetLine(currentPlan())})`;
    } else {
      const z = y - total;
      if (z >= 0) sentence = `Groceries this week: about ${formatMoney2(total)} of your ${formatMoney2(y)} budget, ${formatMoney2(z)} to spare`;
      else sentence = `Groceries this week: about ${formatMoney2(total)} of your ${formatMoney2(y)} budget, <span class="over-amt">${formatMoney2(-z)} over</span>`;
    }
    els.estimateBand.innerHTML = sentence;

    if (els.budgetChip) els.budgetChip.textContent = budgetLine(currentPlan());
    if (els.budgetBand) {
      els.budgetBand.classList.toggle("is-off", !b.on);
      els.budgetBand.classList.toggle("is-set", b.on && b.amt != null);
    }
    if (els.budgetProgressFill && els.budgetProgress) {
      if (!b.on || y == null || y <= 0) {
        els.budgetProgress.hidden = true;
      } else {
        els.budgetProgress.hidden = false;
        const pct = Math.min(100, Math.round((total / y) * 100));
        els.budgetProgressFill.style.width = `${pct}%`;
        const tone = total / y <= 0.85 ? "ok" : total / y <= 1 ? "warn" : "bad";
        els.budgetProgressFill.dataset.tone = tone;
        els.budgetProgressFill.className = `budget-progress-fill tone-${tone}`;
      }
    }
  }

  function renderStoreChips() {
    const name = state.storeName || "Aldi";
    const loc = state.location || "Vero Beach";
    if (els.storeChip) els.storeChip.textContent = `${name} · ${loc}`;
    if (els.listStoreChip) els.listStoreChip.textContent = `${name} · ${loc}`;
  }

  function openBudgetEditor() {
    const b = state.budget;
    const inn = openSheet(shTop("💵 Budget") + `
      <div class="sw" role="switch" tabindex="0" aria-checked="${b.on}" id="bSw"><span>Budget ${b.on ? "on" : "off"}<br><small style="font-weight:650">Off = no budget shown or compared</small></span><span class="tg"></span></div>
      <label class="fld" for="bAmt">Budget amount ($)</label><input class="inp" id="bAmt" type="text" inputmode="decimal" autocomplete="off" placeholder="e.g. 120" value="${b.amt == null ? "" : b.amt}">
      <label class="fld" for="bDays">How many days it covers</label><input class="inp" id="bDays" type="number" inputmode="numeric" min="1" max="366" value="${b.days}">
      <div class="dchips">${[3, 5, 7, 14].map((n) => `<button type="button" data-dd="${n}" class="${b.days === n ? "on" : ""}">${n} days</button>`).join("")}</div>
      <div class="sh-row2"><button type="button" class="sh-btn" id="bClr">Back to default band</button><button type="button" class="sh-btn p" id="bSave">Save</button></div>
      <p class="muted2">Compared with the grocery total (Best split unless you tap another store total), scaled to the plan days (holidays skipped). Saved on this phone and in the share link.</p>`, "Budget");
    const sw = inn.querySelector("#bSw");
    const flip = () => {
      state.budget.on = !state.budget.on;
      sw.setAttribute("aria-checked", String(state.budget.on));
      sw.firstElementChild.firstChild.textContent = "Budget " + (state.budget.on ? "on" : "off");
      persist();
      renderAll();
    };
    sw.addEventListener("click", flip);
    sw.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } });
    inn.querySelectorAll("[data-dd]").forEach((x) => x.addEventListener("click", () => {
      inn.querySelector("#bDays").value = x.dataset.dd;
      inn.querySelectorAll("[data-dd]").forEach((y) => y.classList.toggle("on", y === x));
    }));
    inn.querySelector("#bSave").addEventListener("click", () => {
      const a = parseFloat(String(inn.querySelector("#bAmt").value).replace(/[$,\s]/g, ""));
      state.budget = normalizeBudget({ on: true, amt: Number.isFinite(a) && a > 0 ? a : null, days: inn.querySelector("#bDays").value });
      persist(); closeSheet(); renderAll();
      showToast(state.budget.amt == null ? "Budget band back to default" : `Budget ${formatMoney(state.budget.amt)} / ${state.budget.days} days saved`);
    });
    inn.querySelector("#bClr").addEventListener("click", () => {
      state.budget = { on: true, amt: null, days: 7 };
      persist(); closeSheet(); renderAll();
    });
  }

  function normalizeWeekEdits(src) {
    const out = {};
    if (!src || typeof src !== "object" || Array.isArray(src)) return out;
    Object.keys(src).forEach((key) => {
      if (!/^[1-4][AB]$/.test(key)) return;
      const m = normalizeDayOverrides(src[key]);
      if (Object.keys(m).length) out[key] = m;
    });
    return out;
  }
  function linkWeekEdits(st) {
    if (!st.weekEdits || typeof st.weekEdits !== "object") st.weekEdits = {};
    const key = `${st.week}${st.plan}`;
    const month = ensureMonth(st.monthKey || currentMonthKey(), st);
    if (month.weekEdits[key]) st.weekEdits[key] = month.weekEdits[key];
    if (!st.weekEdits[key]) st.weekEdits[key] = st.dayOverrides && Object.keys(st.dayOverrides).length ? st.dayOverrides : {};
    month.weekEdits[key] = st.weekEdits[key];
    st.dayOverrides = st.weekEdits[key];
  }
  function compactOverrides(map) {
    const acc = {};
    Object.keys(map || {}).forEach((dayId) => {
      const ov = map[dayId];
      if (!ov) return;
      if (ov.type === "leftovers") acc[dayId] = { t: "l" };
      else if (ov.type === "eatout") acc[dayId] = { t: "e" };
      else if (ov.type === "removed") acc[dayId] = { t: "r" };
      else if (ov.type === "pickmeal") acc[dayId] = { t: "m" };
      else if (ov.type === "grabgo" && ov.key) acc[dayId] = { t: "g", k: ov.key };
      else if (ov.type === "pick" && ov.key) acc[dayId] = { t: "p", k: ov.key };
    });
    return acc;
  }
  function openWeekCustom(weekId, planId) {
    const week = WEEKS[weekId];
    const plan = week && week.plans[planId];
    if (!plan) return;
    const key = `${weekId}${planId}`;
    let draft = JSON.parse(JSON.stringify((state.weekEdits || {})[key] || {}));
    let moveFrom = null;
    let swapOpen = null;
    const ownKey = (dayId) => dinnerKey(weekId, planId, dayId);
    const desc = (dayId) => draft[dayId] || { type: "pick", key: ownKey(dayId) };
    const norm = () => Object.keys(draft).forEach((d) => { if (draft[d].type === "pick" && draft[d].key === ownKey(d)) delete draft[d]; });
    const options = sortBySuggest(allTemplateDinners().filter((d) => !isDown(d.day.dinner)));
    const inn = openSheet("", `Customize ${week.label} ${planId}`);
    const draw = () => {
      inn.innerHTML = shTop(`Customize ${escapeHtml(week.label)} · ${planId}`) + `
        <p class="muted2" style="margin:0 0 0.5rem">Only changes this week. Keep, swap, leftovers or eat out, or tap <b>⇅ Move</b> on two days to trade their dinners. Groceries update when you save.</p>
        ${plan.days.map((td) => {
          const o = draft[td.id];
          const day = effectiveDay(td, draft);
          const t = o ? o.type : "keep";
          const lunch = day.adultLunch && day.adultLunch !== "—" && !/adult lunch → —/.test(day.adultLunch) ? day.adultLunch : "";
          return `<div class="cz${o ? " ch" : ""}${moveFrom === td.id ? " mv" : ""}">
            <div class="cz-h"><span>${escapeHtml(td.day)}</span><span>${o ? "changed" : ""}</span></div>
            <div class="cz-d">${day.mealEmoji} ${isFav(day.dinner) ? "⭐ " : ""}${escapeHtml(day.dinner)}</div>
            ${lunch ? `<div class="cz-l">${escapeHtml(lunch)}</div>` : ""}
            <div class="cz-o">
              <button type="button" data-a="keep" data-d="${td.id}" class="${!o ? "on" : ""}">Keep</button>
              <button type="button" data-a="swap" data-d="${td.id}" class="${(t === "pick" && !(o && o.key && parseDinnerKey(o.key) && parseDinnerKey(o.key).weekId === weekId && parseDinnerKey(o.key).planId === planId)) || swapOpen === td.id ? "on" : ""}">Swap ▾</button>
              <button type="button" data-a="leftovers" data-d="${td.id}" class="${t === "leftovers" ? "on" : ""}">Leftovers</button>
              <button type="button" data-a="eatout" data-d="${td.id}" class="${t === "eatout" ? "on" : ""}">Eat out</button>
              <button type="button" data-a="move" data-d="${td.id}" class="mvb${moveFrom === td.id ? " on" : ""}">${moveFrom === null ? "⇅ Move" : moveFrom === td.id ? "Cancel" : "⇅ Swap w/ " + escapeHtml(plan.days.find((x) => x.id === moveFrom).short)}</button>
            </div>
            ${swapOpen === td.id ? `<div class="cz-list">${options.map((d) => `<button type="button" data-pick="${escapeAttr(d.key)}" data-d="${td.id}">${isFav(d.day.dinner) ? "⭐ " : ""}${escapeHtml(d.day.dinner)}<small>${escapeHtml(d.label)}</small></button>`).join("")}</div>` : ""}
          </div>`;
        }).join("")}
        <div class="sh-row2"><button type="button" class="sh-btn" id="czR">Reset this week</button><button type="button" class="sh-btn p" id="czS">Save</button></div>`;
      inn.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
        const d = b.dataset.d;
        const a = b.dataset.a;
        if (a === "keep") { delete draft[d]; swapOpen = null; }
        else if (a === "leftovers") draft[d] = { type: "leftovers" };
        else if (a === "eatout") draft[d] = { type: "eatout" };
        else if (a === "swap") swapOpen = swapOpen === d ? null : d;
        else if (a === "move") {
          if (moveFrom === null) moveFrom = d;
          else if (moveFrom === d) moveFrom = null;
          else { const x = desc(moveFrom); const y = desc(d); draft[moveFrom] = y; draft[d] = x; moveFrom = null; }
        }
        norm();
        draw();
      }));
      inn.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => {
        draft[b.dataset.d] = { type: "pick", key: b.dataset.pick };
        swapOpen = null;
        norm();
        draw();
      }));
      inn.querySelector("#czR").addEventListener("click", () => {
        state.weekEdits[key] = {};
        activeMonth().weekEdits[key] = {};
        linkWeekEdits(state);
        persist(); closeSheet(); renderAll();
        showToast(`${week.label} ${planId} back to the template`);
      });
      inn.querySelector("#czS").addEventListener("click", () => {
        norm();
        state.weekEdits[key] = draft;
        activeMonth().weekEdits[key] = draft;
        if (key === `${state.week}${state.plan}`) state.dayOverrides = draft;
        persist(); closeSheet(); renderAll();
        showToast(key === `${state.week}${state.plan}` ? "Week saved — groceries updated" : `Saved ${week.label} ${planId} edits — tap that card to load it`);
      });
    };
    draw();
  }

  /* calories — USDA FoodData Central typical-serving rough values, ~est */
  function round10(n) {
    return Math.round(Number(n) / 10) * 10;
  }
  function caloriesForDay(day) {
    if (day.overrideType === "holiday" || day.overrideType === "removed" || day.overrideType === "pickmeal") {
      return { main: 0, meal: 0 };
    }
    if (typeof day.calories === "number" && typeof day.mealCalories === "number") {
      return { main: round10(day.calories), meal: round10(day.mealCalories) };
    }
    if (day.overrideType === "leftovers") return { main: 450, meal: 450 };
    if (day.overrideType === "eatout") return { main: 750, meal: 750 };
    if (day.overrideType === "grabgo" || day.grabGo) {
      const g = day.swapKey && GRAB_GO[day.swapKey];
      if (g) return { main: round10(g.calories), meal: round10(g.mealCalories) };
      return { main: 650, meal: 720 };
    }
    const d = String(day.dinner || "").toLowerCase();
    const rules = [
      [/chili/, 480, 620],
      [/alfredo|pasta bake/, 620, 780],
      [/taco rebuild/, 520, 680],
      [/taco/, 540, 720],
      [/salmon/, 380, 560],
      [/tilapia/, 320, 500],
      [/rotisserie/, 400, 620],
      [/sheet-pan oven chicken|oven chicken/, 420, 640],
      [/quesadilla/, 500, 660],
      [/burger/, 560, 740],
      [/sausage sheet|smoked sausage/, 480, 680],
      [/pork chop/, 450, 650],
      [/breakfast-for-dinner/, 420, 580],
      [/potato bar|baked potato/, 400, 600],
      [/sandwich/, 480, 640],
      [/pizza/, 680, 750],
      [/sub/, 700, 780],
      [/grab/, 650, 720],
    ];
    for (const [re, main, meal] of rules) {
      if (re.test(d)) return { main: round10(main), meal: round10(meal) };
    }
    return { main: 500, meal: 650 };
  }
  function calorieBadges(day) {
    const c = caloriesForDay(day);
    if (!c.main && !c.meal) return "";
    return `<span class="cal-badges"><span class="cal-main" title="USDA FoodData Central typical-serving rough estimate">🔥 ~${c.main} cal per serving</span><span class="cal-meal" title="Main + sides estimate">This meal: ~${c.meal} cal per serving</span></span>`;
  }

  function prepCookFor(day) {
    if (day.overrideType === "eatout" || day.overrideType === "removed" || day.overrideType === "holiday" || day.overrideType === "pickmeal") return null;
    if (day.overrideType === "leftovers") return [2, 5, true];
    if (day.overrideType === "grabgo" || day.grabGo) return [5, 10, false];
    const d = String(day.dinner || "").toLowerCase();
    const rules = [
      [/potato bar/, 10, 45], [/rotisserie/, 5, 10], [/taco rebuild/, 10, 10], [/taco/, 10, 15],
      [/alfredo|pasta bake/, 10, 25], [/salmon/, 5, 15], [/tilapia/, 5, 12], [/chili/, 15, 60],
      [/breakfast-for-dinner/, 5, 15], [/sheet-pan/, 15, 35], [/quesadilla/, 10, 10],
      [/oven chicken/, 10, 30], [/burger/, 10, 12], [/pork/, 10, 20], [/pizza/, 5, 18], [/sub/, 5, 5],
    ];
    for (const [re, p, c] of rules) if (re.test(d)) return [p, c, false];
    return [10, 20, false];
  }
  function prepCookBadge(day) {
    const pc = prepCookFor(day);
    if (!pc) return "";
    const mins = (n) => (n >= 60 ? `~${Math.round(n / 60)} hr` : `~${n} min`);
    return `<span class="pc" aria-label="Prep ${pc[0]} minutes, ${pc[2] ? "reheat" : "cook"} ${pc[1]} minutes"><span>🔪 Prep ${mins(pc[0])}</span><span>🔥 ${pc[2] ? "Reheat" : "Cook"} ${mins(pc[1])}</span></span>`;
  }

  function rateKey(name) {
    return String(name || "").trim().toLowerCase().slice(0, 80);
  }
  function normalizeRatings(src) {
    const out = {};
    if (!src || typeof src !== "object" || Array.isArray(src)) return out;
    Object.keys(src).forEach((k) => {
      const v = src[k];
      const r = Number(v && v.r);
      if (r === -1 || r === 1 || r === 2) { out[rateKey(k)] = { r, d: typeof v.d === "string" ? v.d.slice(0, 10) : "", n: typeof v.n === "string" ? v.n.slice(0, 80) : k }; if (r === -1 && v.x) out[rateKey(k)].x = 1; }
    });
    return out;
  }
  function ratingOf(name) {
    const v = (state.ratings || {})[rateKey(name)];
    return v ? v.r : 0;
  }
  function isFav(name) { return ratingOf(name) === 2; }
  function isDown(name) { return ratingOf(name) === -1; }
  function sortBySuggest(list) {
    return list.map((d, i) => [d, i]).sort((x, y) => (ratingOf(y[0].day.dinner) - ratingOf(x[0].day.dinner)) || x[1] - y[1]).map((x) => x[0]);
  }
  function setRating(name, r, forGood) {
    const k = rateKey(name);
    if (!state.ratings) state.ratings = {};
    if (!r || (state.ratings[k] && state.ratings[k].r === r && !forGood)) delete state.ratings[k];
    else {
      const t = new Date();
      state.ratings[k] = { r, d: `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`, n: String(name).slice(0, 80) };
      if (forGood) state.ratings[k].x = 1;
    }
    persist();
    renderAll();
  }
  function rateRowHTML(name, dayId, opts) {
    const r = ratingOf(name);
    const showRates = !(opts && opts.hideRates);
    const del = `<button type="button" class="rate-del icon-btn" data-del-day="${escapeAttr(dayId)}" aria-label="Remove this dinner from this week">${typeof ICO !== "undefined" ? ICO.del : "🗑"}</button>`;
    if (!showRates) {
      return `<div class="rate-row rate-row-del-only" role="group" aria-label="Remove dinner">${del}</div>`;
    }
    return `<div class="rate-row" role="group" aria-label="Rate this dinner after you make it"><span>Made it? Rate it:</span>
      <button type="button" data-rate="-1" aria-pressed="${r === -1}" title="Tried it, no">👎</button>
      <button type="button" data-rate="1" aria-pressed="${r === 1}" title="Good">👍</button>
      <button type="button" data-rate="2" aria-pressed="${r === 2}" title="Favorite">❤️</button>
      ${del}</div>`;
  }
  function bindRateRow(root, name) {
    root.querySelectorAll("[data-rate]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const r = Number(b.dataset.rate);
      setRating(name, r);
      showToast(ratingOf(name) === 0 ? "Rating cleared" : r === -1 ? "👎 Never suggest again — Restore anytime in Removed meals" : r === 2 ? "❤️ Favorite — suggested first" : "👍 Saved");
    }));
  }
  function renderRatings() {
    const box = document.getElementById("my-ratings");
    if (!box) return;
    const all = Object.keys(state.ratings || {}).map((k) => ({ k, ...state.ratings[k] }));
    const grp = (r) => all.filter((x) => x.r === r).sort((a, b) => (b.d || "").localeCompare(a.d || ""));
    const row = (x, restore) => `<li><span>${escapeHtml(x.n || x.k)}${restore ? ` <small>${x.x ? "🗑 removed for good" : "👎 tried it, no"}</small>` : ""}</span><small>${x.d ? escapeHtml(x.d) : ""}</small>${restore ? `<button type="button" class="chip-btn" data-restore="${escapeAttr(x.k)}">Restore</button>` : `<button type="button" class="chip-btn" data-clear="${escapeAttr(x.k)}">Clear</button>`}</li>`;
    const fav = grp(2), good = grp(1), down = grp(-1);
    box.innerHTML = all.length
      ? `${fav.length ? `<h3>⭐ Favorites (❤️)</h3><ul>${fav.map((x) => row(x)).join("")}</ul>` : ""}
         ${good.length ? `<h3>👍 Good</h3><ul>${good.map((x) => row(x)).join("")}</ul>` : ""}
         ${down.length ? `<h3>🗑 Removed meals</h3><p class="muted2" style="margin-top:0">Rated 👎 or removed from the menu for good. Hidden from suggestions and Swap. Tap Restore to bring one back.</p><ul>${down.map((x) => row(x, true)).join("")}</ul>` : ""}`
      : `<p class="muted2">No ratings yet. After you make a dinner, tap 👎 / 👍 / ❤️ on its day card. ❤️ = ⭐ favorite, suggested first.</p>`;
    box.querySelectorAll("[data-restore],[data-clear]").forEach((b) => b.addEventListener("click", () => {
      delete state.ratings[b.dataset.restore || b.dataset.clear];
      persist();
      renderAll();
      showToast(b.dataset.restore ? "Restored to Swap picks" : "Rating cleared");
    }));
  }

  /* meal log */
  function logKey(dayId) {
    const d = dateForDayId(dayId);
    return d ? isoDate(d) : `${state.monthKey}-${state.week}${state.plan}-${dayId}`;
  }
  function getLog(dayId) {
    const k = logKey(dayId);
    const v = (state.mealLog || {})[k];
    return v && typeof v === "object"
      ? {
          status: v.status || "",
          leftovers: Number.isFinite(Number(v.leftovers)) ? Math.max(0, Math.min(3, Number(v.leftovers))) : 0,
          wentBad: v.wentBad === true ? true : v.wentBad === false ? false : null,
        }
      : { status: "", leftovers: 0, wentBad: null };
  }
  function setLog(dayId, patch) {
    if (!state.mealLog) state.mealLog = {};
    const k = logKey(dayId);
    const cur = getLog(dayId);
    const next = { ...cur, ...patch };
    if (!next.status && !next.leftovers && next.wentBad == null) delete state.mealLog[k];
    else state.mealLog[k] = next;
  }
  function mealLogHTML(dayId, day) {
    if (day.overrideType === "holiday") return "";
    const log = getLog(dayId);
    return `<div class="meal-log" data-log-day="${escapeAttr(dayId)}">
      <div class="log-status" role="group" aria-label="How did dinner go">
        ${[["made","Made"],["skipped","Skipped"],["ateout","Ate out"]].map(([v,l]) =>
          `<button type="button" class="log-chip${log.status===v?" on":""}" data-log-status="${v}" aria-pressed="${log.status===v}">${l}</button>`).join("")}
      </div>
      <label class="log-left">Leftovers
        <select data-log-left>${[0,1,2,3].map((n)=>`<option value="${n}" ${log.leftovers===n?"selected":""}>${n}</option>`).join("")}</select>
      </label>
      <div class="log-bad" role="group" aria-label="Did leftovers go bad">
        <span>Went bad?</span>
        <button type="button" class="log-chip${log.wentBad===true?" on":""}" data-log-bad="1" aria-pressed="${log.wentBad===true}">Yes</button>
        <button type="button" class="log-chip${log.wentBad===false?" on":""}" data-log-bad="0" aria-pressed="${log.wentBad===false}">No</button>
      </div>
    </div>`;
  }
  function bindMealLog(card, dayId) {
    const root = card.querySelector(`[data-log-day="${dayId}"]`);
    if (!root) return;
    root.querySelectorAll("[data-log-status]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const v = b.dataset.logStatus;
      const cur = getLog(dayId).status;
      setLog(dayId, { status: cur === v ? "" : v });
      if (v === "made" && cur !== "made") {
        const dinner = effectiveDay(currentPlan().days.find((d) => d.id === dayId)).dinner;
        const k = rateKey(dinner);
        if (!state.ratings[k]) {
          /* nudge only via gentle banner / review — don't auto-rate */
        }
      }
      persist();
      renderAll();
    }));
    root.querySelector("[data-log-left]")?.addEventListener("change", (e) => {
      e.stopPropagation();
      setLog(dayId, { leftovers: Number(e.target.value) });
      persist();
      renderWeekReview();
    });
    root.querySelectorAll("[data-log-bad]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const val = b.dataset.logBad === "1";
      const cur = getLog(dayId).wentBad;
      setLog(dayId, { wentBad: cur === val ? null : val });
      persist();
      renderAll();
    }));
  }

  function timesMadeMap() {
    const counts = {};
    Object.keys(state.ratings || {}).forEach((k) => {
      const r = state.ratings[k];
      if (!r) return;
      const name = r.n || k;
      counts[name] = (counts[name] || 0) + 1;
    });
    // Also count "made" logs for current week dinners
    currentPlan().days.forEach((td) => {
      const day = effectiveDay(td);
      if (getLog(td.id).status === "made") {
        counts[day.dinner] = (counts[day.dinner] || 0) + 1;
      }
    });
    return counts;
  }

  function renderWeekReview() {
    const panel = els.weekReviewPanel;
    const body = els.weekReviewBody;
    if (!panel || !body) return;
    const plan = currentPlan();
    let made = 0, planned = 0, skipped = 0, wasted = 0;
    const skipNames = [];
    plan.days.forEach((td) => {
      const day = effectiveDay(td);
      if (day.overrideType === "holiday" || day.overrideType === "pickmeal" || day.overrideType === "removed") return;
      planned += 1;
      const log = getLog(td.id);
      if (log.status === "made") made += 1;
      if (log.status === "skipped") { skipped += 1; skipNames.push(day.dinner); }
      if (log.wentBad === true) wasted += Math.max(1, log.leftovers || 1);
    });
    const times = timesMadeMap();
    const topRated = Object.keys(state.ratings || {})
      .map((k) => state.ratings[k])
      .filter((r) => r && (r.r === 2 || r.r === 1))
      .sort((a, b) => b.r - a.r || String(b.d).localeCompare(String(a.d)))
      .slice(0, 5);
    const skipCounts = {};
    skipNames.forEach((n) => { skipCounts[n] = (skipCounts[n] || 0) + 1; });
    Object.keys(state.mealLog || {}).forEach((k) => {
      if (state.mealLog[k]?.status === "skipped") {
        /* keep week-local suggestions primarily */
      }
    });
    const suggestions = [];
    Object.keys(skipCounts).forEach((n) => {
      if (skipCounts[n] >= 1) suggestions.push(`Skipped: ${n} — swap it?`);
    });
    // Across mealLog, if same dinner skipped twice historically via ratings down
    Object.keys(state.ratings || {}).forEach((k) => {
      const r = state.ratings[k];
      if (r && r.r === -1) suggestions.push(`Skipped / disliked: ${r.n || k} — swap it?`);
    });
    const uniqSug = [...new Set(suggestions)].slice(0, 4);
    const hasAny = made + skipped + wasted + topRated.length > 0;
    panel.hidden = !hasAny && planned === 0;
    if (!hasAny && planned > 0) panel.hidden = false;
    body.innerHTML = `
      <div class="wr-stats">
        <p><strong>${made}</strong> made · <strong>${planned}</strong> planned · <strong>${skipped}</strong> skipped</p>
        <p>Leftovers wasted (went bad): <strong>${wasted}</strong></p>
      </div>
      ${topRated.length ? `<div class="wr-block"><h3>Top-rated</h3><ul>${topRated.map((r) => `<li>${r.r === 2 ? "❤️" : "👍"} ${escapeHtml(r.n || "")}</li>`).join("")}</ul></div>` : ""}
      <div class="wr-block"><h3>All-time times made (from ratings + this week)</h3>
        <ul>${Object.keys(times).length ? Object.keys(times).sort((a,b)=>times[b]-times[a]).slice(0,8).map((n)=>`<li>${escapeHtml(n)} · ${times[n]}×</li>`).join("") : "<li>No made dinners logged yet</li>"}</ul>
      </div>
      ${uniqSug.length ? `<div class="wr-block"><h3>Suggestions</h3><ul>${uniqSug.map((s)=>`<li>${escapeHtml(s)}</li>`).join("")}</ul></div>` : `<p class="muted2">Log Made / Skipped on day cards for tips.</p>`}
    `;
  }

  function maybeGentleBanner() {
    const el = els.gentleBanner;
    if (!el) return;
    const today = todayIso();
    const last = state.lastGentleAt;
    let show = false;
    if (!last) show = true;
    else {
      const a = new Date(last + "T12:00:00");
      const b = new Date(today + "T12:00:00");
      const days = Math.round((b - a) / 864e5);
      if (days >= 3) show = true;
    }
    // Only if there are unlogged dinners this week
    const unlogged = currentPlan().days.some((td) => {
      const day = effectiveDay(td);
      if (day.overrideType === "holiday" || day.overrideType === "removed" || day.overrideType === "pickmeal") return false;
      return !getLog(td.id).status;
    });
    if (show && unlogged) {
      el.hidden = false;
      el.innerHTML = `Gentle nudge: log a few dinners (Made / Skipped / Ate out) — helps the week review. <button type="button" class="chip-btn" id="gentle-dismiss">Got it</button>`;
      const btn = document.getElementById("gentle-dismiss");
      if (btn) btn.onclick = () => {
        state.lastGentleAt = today;
        el.hidden = true;
        persist();
      };
    } else {
      el.hidden = true;
    }
  }

  function persist() {
    try {
      // sync active week edits into month
      const key = `${state.week}${state.plan}`;
      const month = activeMonth();
      month.weekEdits[key] = state.dayOverrides;
      state.weekEdits[key] = state.dayOverrides;
      if (state.plan) month.picks[state.week] = state.plan;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
    writeShareToUrl(false);
  }

  function loadFromStorage() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        for (const key of LEGACY_STORAGE_KEYS) {
          raw = localStorage.getItem(key);
          if (raw) break;
        }
      }
      if (!raw) return null;
      return normalizeState(JSON.parse(raw));
    } catch (_) {
      return null;
    }
  }

  function normalizeStringMap(src, maxLen) {
    const out = {};
    if (!src || typeof src !== "object" || Array.isArray(src)) return out;
    Object.keys(src).forEach((id) => {
      if (typeof id !== "string") return;
      const v = src[id];
      if (typeof v === "string" && v.trim()) out[id] = v.trim().slice(0, maxLen);
    });
    return out;
  }

  function normalizeIdFlags(src) {
    const out = {};
    if (!src) return out;
    if (Array.isArray(src)) {
      src.forEach((id) => {
        if (typeof id === "string") out[id] = true;
      });
      return out;
    }
    if (typeof src === "object") {
      Object.keys(src).forEach((id) => {
        if (src[id]) out[id] = true;
      });
    }
    return out;
  }

  function normalizeDayOverrides(src) {
    const out = {};
    if (!src || typeof src !== "object" || Array.isArray(src)) return out;
    Object.keys(src).forEach((dayId) => {
      const ov = src[dayId];
      if (!ov || typeof ov !== "object") return;
      if (ov.type === "leftovers" || ov.t === "l") {
        out[dayId] = { type: "leftovers" };
      } else if (ov.type === "eatout" || ov.t === "e") {
        out[dayId] = { type: "eatout" };
      } else if (ov.type === "removed" || ov.t === "r") {
        out[dayId] = { type: "removed" };
      } else if (ov.type === "pickmeal" || ov.t === "m") {
        out[dayId] = { type: "pickmeal" };
      } else if ((ov.type === "grabgo" || ov.t === "g") && (ov.key || ov.k) && GRAB_GO[ov.key || ov.k]) {
        out[dayId] = { type: "grabgo", key: ov.key || ov.k };
      } else if ((ov.type === "pick" || ov.t === "p") && (ov.key || ov.k)) {
        const key = ov.key || ov.k;
        if (GRAB_GO[key]) out[dayId] = { type: "grabgo", key };
        else if (parseDinnerKey(key)) out[dayId] = { type: "pick", key };
      }
    });
    return out;
  }

  function normalizeHolidays(src) {
    const base = defaultHolidays();
    if (!Array.isArray(src)) return base;
    const out = [];
    src.forEach((h, i) => {
      if (!h || typeof h !== "object") return;
      out.push({
        id: typeof h.id === "string" ? h.id : `h-${i}`,
        name: String(h.name || "Holiday").slice(0, 40),
        emoji: String(h.emoji || "🎉").slice(0, 4),
        kind: h.kind || "custom",
        month: h.month,
        day: h.day,
        date: typeof h.date === "string" ? h.date.slice(0, 10) : undefined,
        cook: Boolean(h.cook),
      });
    });
    return out.length ? out : base;
  }

  function normalizeMonths(src) {
    const out = {};
    if (!src || typeof src !== "object" || Array.isArray(src)) return out;
    Object.keys(src).forEach((mk) => {
      if (!/^\d{4}-\d{2}$/.test(mk)) return;
      const m = src[mk] || {};
      const picks = {};
      Object.keys(m.picks || {}).forEach((w) => {
        if (["1", "2", "3", "4"].includes(String(w)) && (m.picks[w] === "A" || m.picks[w] === "B")) {
          picks[String(w)] = m.picks[w];
        }
      });
      out[mk] = {
        picks,
        weekEdits: normalizeWeekEdits(m.weekEdits),
        deletedWeeks: normalizeIdFlags(m.deletedWeeks),
        duplicated: Boolean(m.duplicated),
      };
    });
    return out;
  }

  function normalizeMealLog(src) {
    const out = {};
    if (!src || typeof src !== "object" || Array.isArray(src)) return out;
    Object.keys(src).forEach((k) => {
      const v = src[k];
      if (!v || typeof v !== "object") return;
      const status = v.status === "made" || v.status === "skipped" || v.status === "ateout" ? v.status : "";
      const leftovers = Math.max(0, Math.min(3, Number(v.leftovers) || 0));
      const wentBad = v.wentBad === true ? true : v.wentBad === false ? false : null;
      if (status || leftovers || wentBad != null) out[k] = { status, leftovers, wentBad };
    });
    return out;
  }

  function normalizeState(parsed) {
    const base = defaultState();
    if (!parsed || typeof parsed !== "object") return base;
    const wk = String(parsed.week || "1");
    base.week = ["1", "2", "3", "4"].includes(wk) ? wk : "1";
    base.plan = parsed.plan === "B" ? "B" : "A";
    base.shopMode = Boolean(parsed.shopMode);
    base.hideChecked = Boolean(parsed.hideChecked);
    base.showHiddenHave = Boolean(parsed.showHiddenHave);
    base.groceryDayFilter = typeof parsed.groceryDayFilter === "string" ? parsed.groceryDayFilter : "all";
    if (typeof parsed.weekTitle === "string" && parsed.weekTitle.trim()) {
      base.weekTitle = parsed.weekTitle.trim().slice(0, 80);
    } else {
      base.weekTitle = WEEKS[base.week].title;
    }
    base.checked = normalizeIdFlags(parsed.checked);
    base.haveIt = normalizeIdFlags(parsed.haveIt);
    base.qty = normalizeStringMap(parsed.qty, 40);
    base.notes = normalizeStringMap(parsed.notes, 80);
    base.dayOverrides = normalizeDayOverrides(parsed.dayOverrides);
    base.weekEdits = normalizeWeekEdits(parsed.weekEdits);
    base.budget = normalizeBudget(parsed.budget);
    base.store = normalizeStore(parsed.store);
    base.storeName = typeof parsed.storeName === "string" && parsed.storeName.trim() ? parsed.storeName.trim().slice(0, 40) : "Aldi";
    base.location = typeof parsed.location === "string" && parsed.location.trim() ? parsed.location.trim().slice(0, 60) : "Vero Beach";
    base.customStores = Array.isArray(parsed.customStores)
      ? parsed.customStores.filter((s) => typeof s === "string" && s.trim()).map((s) => s.trim().slice(0, 40)).slice(0, 12)
      : [];
    base.ratings = normalizeRatings(parsed.ratings);
    base.mealLog = normalizeMealLog(parsed.mealLog);
    base.houseRules = Array.isArray(parsed.houseRules) && parsed.houseRules.length
      ? parsed.houseRules.map((r) => String(r).slice(0, 160)).filter(Boolean).slice(0, 20)
      : DEFAULT_HOUSE_RULES.slice();
    base.holidays = normalizeHolidays(parsed.holidays);
    base.months = normalizeMonths(parsed.months);
    base.monthKey = typeof parsed.monthKey === "string" && /^\d{4}-\d{2}$/.test(parsed.monthKey) ? parsed.monthKey : currentMonthKey();
    base.lastGentleAt = typeof parsed.lastGentleAt === "string" ? parsed.lastGentleAt.slice(0, 10) : null;
    linkWeekEdits(base);
    if (parsed.prices && typeof parsed.prices === "object" && !Array.isArray(parsed.prices)) {
      Object.keys(parsed.prices).forEach((id) => {
        const n = Number(parsed.prices[id]);
        if (Number.isFinite(n) && n >= 0) base.prices[id] = Math.round(n * 100) / 100;
      });
    }
    if (Array.isArray(parsed.custom)) {
      base.custom = parsed.custom
        .filter((c) => c && typeof c.name === "string" && c.name.trim())
        .map((c, i) => {
          const id = typeof c.id === "string" ? c.id : `custom-${i}-${Date.now()}`;
          const price = itemPriceFromAny(c.price);
          if (price !== null) base.prices[id] = price;
          if (typeof c.qty === "string" && c.qty.trim()) base.qty[id] = c.qty.trim().slice(0, 40);
          if (typeof c.note === "string" && c.note.trim()) base.notes[id] = c.note.trim().slice(0, 80);
          return {
            id,
            name: c.name.trim().slice(0, 80),
            category: normalizeCategory(c.category),
          };
        });
    }
    return base;
  }

  function itemPriceFromAny(v) {
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
  }

  function encodeState() {
    const payload = {
      wk: state.week,
      p: state.plan,
      w: state.weekTitle,
      mk: state.monthKey,
      sm: state.shopMode ? 1 : 0,
      hc: state.hideChecked ? 1 : 0,
      c: Object.keys(state.checked).filter((k) => state.checked[k]),
      h: Object.keys(state.haveIt).filter((k) => state.haveIt[k]),
      q: { ...state.qty },
      n: { ...state.notes },
      o: compactOverrides(state.dayOverrides),
      we: Object.keys(state.weekEdits || {}).reduce((acc, key) => {
        const c = compactOverrides(state.weekEdits[key]);
        if (Object.keys(c).length) acc[key] = c;
        return acc;
      }, {}),
      mo: Object.keys(state.months || {}).reduce((acc, mk) => {
        const m = state.months[mk];
        acc[mk] = {
          pk: m.picks,
          we: Object.keys(m.weekEdits || {}).reduce((a, k) => {
            const c = compactOverrides(m.weekEdits[k]);
            if (Object.keys(c).length) a[k] = c;
            return a;
          }, {}),
          dw: Object.keys(m.deletedWeeks || {}).filter((k) => m.deletedWeeks[k]),
          d: m.duplicated ? 1 : 0,
        };
        return acc;
      }, {}),
      bg: state.budget && (state.budget.amt != null || !state.budget.on || state.budget.days !== 7)
        ? [state.budget.on ? 1 : 0, state.budget.amt, state.budget.days]
        : undefined,
      st: state.store !== "best" ? state.store : undefined,
      sn: state.storeName !== "Aldi" ? state.storeName : undefined,
      loc: state.location !== "Vero Beach" ? state.location : undefined,
      cs: state.customStores && state.customStores.length ? state.customStores : undefined,
      hr: JSON.stringify(state.houseRules) !== JSON.stringify(DEFAULT_HOUSE_RULES) ? state.houseRules : undefined,
      hol: state.holidays,
      ml: state.mealLog && Object.keys(state.mealLog).length ? state.mealLog : undefined,
      lg: state.lastGentleAt || undefined,
      rt: Object.keys(state.ratings || {}).length
        ? Object.keys(state.ratings).reduce((acc, k) => { acc[k] = state.ratings[k].x ? [state.ratings[k].r, state.ratings[k].d, 1] : [state.ratings[k].r, state.ratings[k].d]; return acc; }, {})
        : undefined,
      $: Object.keys(state.prices).reduce((acc, id) => {
        const n = Number(state.prices[id]);
        if (Number.isFinite(n) && n >= 0) acc[id] = n;
        return acc;
      }, {}),
      x: state.custom.map((item) => ({
        i: item.id,
        n: item.name,
        k: item.category,
        d: itemChecked(item.id) ? 1 : 0,
        $: itemPrice(item.id),
        q: itemQty(item.id) || undefined,
        note: itemNote(item.id) || undefined,
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
      const wk = String(payload.wk || "1");
      next.week = ["1", "2", "3", "4"].includes(wk) ? wk : "1";
      next.plan = payload.p === "B" ? "B" : "A";
      next.shopMode = Boolean(payload.sm);
      next.hideChecked = Boolean(payload.hc);
      if (typeof payload.w === "string" && payload.w.trim()) {
        next.weekTitle = payload.w.trim().slice(0, 80);
      } else {
        next.weekTitle = WEEKS[next.week].title;
      }
      if (typeof payload.mk === "string" && /^\d{4}-\d{2}$/.test(payload.mk)) next.monthKey = payload.mk;
      const checked = normalizeIdFlags(payload.c);
      next.haveIt = normalizeIdFlags(payload.h);
      next.qty = normalizeStringMap(payload.q, 40);
      next.notes = normalizeStringMap(payload.n, 80);
      next.dayOverrides = normalizeDayOverrides(payload.o);
      next.weekEdits = normalizeWeekEdits(payload.we);
      if (payload.mo && typeof payload.mo === "object") {
        const months = {};
        Object.keys(payload.mo).forEach((mk) => {
          const m = payload.mo[mk];
          months[mk] = {
            picks: m.pk || {},
            weekEdits: normalizeWeekEdits(m.we),
            deletedWeeks: normalizeIdFlags(m.dw),
            duplicated: Boolean(m.d),
          };
        });
        next.months = normalizeMonths(months);
      }
      if (Array.isArray(payload.bg)) {
        next.budget = normalizeBudget({ on: payload.bg[0] !== 0, amt: payload.bg[1], days: payload.bg[2] });
      }
      next.store = normalizeStore(payload.st);
      if (typeof payload.sn === "string") next.storeName = payload.sn.slice(0, 40);
      if (typeof payload.loc === "string") next.location = payload.loc.slice(0, 60);
      if (Array.isArray(payload.cs)) next.customStores = payload.cs.map((s) => String(s).slice(0, 40)).slice(0, 12);
      if (Array.isArray(payload.hr)) next.houseRules = payload.hr.map((r) => String(r).slice(0, 160)).filter(Boolean).slice(0, 20);
      if (payload.hol) next.holidays = normalizeHolidays(payload.hol);
      if (payload.ml) next.mealLog = normalizeMealLog(payload.ml);
      if (typeof payload.lg === "string") next.lastGentleAt = payload.lg.slice(0, 10);
      if (payload.rt && typeof payload.rt === "object") {
        const r = {};
        Object.keys(payload.rt).forEach((k) => {
          const v = payload.rt[k];
          if (Array.isArray(v)) r[k] = { r: v[0], d: v[1], x: v[2] };
        });
        next.ratings = normalizeRatings(r);
      }
      linkWeekEdits(next);
      if (payload.$ && typeof payload.$ === "object") {
        Object.keys(payload.$).forEach((id) => {
          const n = Number(payload.$[id]);
          if (Number.isFinite(n) && n >= 0) next.prices[id] = Math.round(n * 100) / 100;
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
            category: normalizeCategory(item.k),
          });
          if (item.d) checked[id] = true;
          const price = itemPriceFromAny(item.$);
          if (price !== null) next.prices[id] = price;
          if (typeof item.q === "string" && item.q.trim()) next.qty[id] = item.q.trim().slice(0, 40);
          if (typeof item.note === "string" && item.note.trim()) next.notes[id] = item.note.trim().slice(0, 80);
        });
      }
      next.checked = checked;
      return next;
    } catch (_) {
      return null;
    }
  }

  async function updateWakeLock() {
    if (!state.shopMode) {
      if (wakeLock) {
        try { await wakeLock.release(); } catch (_) {}
        wakeLock = null;
      }
      return;
    }
    if (!("wakeLock" in navigator) || typeof navigator.wakeLock.request !== "function") return;
    if (document.visibilityState !== "visible") return;
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => { wakeLock = null; });
    } catch (_) {
      wakeLock = null;
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
    const next = `#s=${encodeState()}`;
    if (push) history.pushState(null, "", next);
    else if (window.location.hash !== next) history.replaceState(null, "", next);
  }

  function shareUrl() {
    writeShareToUrl(false);
    const url = new URL(window.location.href);
    url.hash = `s=${encodeState()}`;
    return url.toString();
  }

  function holidaysInMonthKey(key) {
    const [y, m] = String(key || "").split("-").map(Number);
    if (!y || !m) return [];
    const out = [];
    (state.holidays || []).forEach((h) => {
      if (h.cook) return;
      const d = holidayDateForYear(h, y);
      if (d && d.getMonth() + 1 === m) out.push(h);
      else if (h.kind === "custom" && h.date && h.date.startsWith(key)) out.push(h);
    });
    return out;
  }

  function renderMonthControls() {
    if (els.monthName) els.monthName.textContent = monthLabel(state.monthKey);
    if (els.monthMenu) els.monthMenu.hidden = true;
    const grid = els.monthGrid;
    if (grid) {
      let strip = document.getElementById("month-hol-strip");
      if (!strip) {
        strip = document.createElement("p");
        strip.id = "month-hol-strip";
        strip.className = "month-hol-strip muted2";
        grid.parentNode.insertBefore(strip, grid);
      }
      const hols = holidaysInMonthKey(state.monthKey);
      strip.textContent = hols.length
        ? `Holidays this month (blank nights): ${hols.map((h) => `${h.emoji || ""} ${h.name}`.trim()).join(" · ")}`
        : "";
      strip.hidden = !hols.length;
    }
  }

  function renderMonthGrid() {
    const grid = els.monthGrid;
    if (!grid) return;
    const month = activeMonth();
    const dup = Boolean(month.duplicated);
    grid.innerHTML = "";
    for (let w = 1; w <= 4; w++) {
      const weekId = String(w);
      const week = WEEKS[weekId];
      const deleted = Boolean(month.deletedWeeks[weekId]);
      const row = document.createElement("div");
      row.className = "month-row" + (deleted ? " month-row-empty" : "");
      row.dataset.week = weekId;

      const label = document.createElement("div");
      label.className = "month-week-label";
      label.innerHTML = `<span>Week ${w}</span>${dup ? `<button type="button" class="month-week-del" data-del-week="${weekId}" aria-label="Delete week ${w}">🗑</button>` : ""}`;
      row.appendChild(label);

      if (deleted) {
        const empty = document.createElement("div");
        empty.className = "month-empty-slot";
        empty.innerHTML = `<button type="button" data-restore-week="${weekId}">Empty — tap A or B below to fill</button>
          <div class="month-ab">
            <button type="button" class="month-opt" data-week="${weekId}" data-plan="A">A · ${escapeHtml(week.plans.A.blurb)}</button>
            <button type="button" class="month-opt" data-week="${weekId}" data-plan="B">B · ${escapeHtml(week.plans.B.blurb)}</button>
          </div>`;
        row.appendChild(empty);
      } else {
        const ab = document.createElement("div");
        ab.className = "month-ab";
        ["A", "B"].forEach((planId) => {
          const plan = week.plans[planId];
          const key = `${weekId}${planId}`;
          const on = state.week === weekId && state.plan === planId;
          const picked = month.picks[weekId] === planId;
          const edits = Object.keys((month.weekEdits[key] || state.weekEdits[key] || {})).length;
          // holiday marks in blurb strip
          const holBits = plan.days.map((td) => {
            // approximate holidays using current weekTitle only when this week is loaded; else skip
            return null;
          }).filter(Boolean);
          void holBits;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "month-opt" + (on || picked ? " is-on" : "");
          btn.dataset.week = weekId;
          btn.dataset.plan = planId;
          btn.setAttribute("aria-pressed", String(on));
          btn.innerHTML = `<span class="month-opt-id">${planId}</span>
            <span class="month-opt-blurb">${escapeHtml(plan.blurb)}</span>
            ${edits ? `<span class="edited-badge">edited</span>` : ""}
            ${plan.days.some((d) => /chili/i.test(d.dinner)) ? `<span class="month-tag">chili</span>` : ""}
            ${plan.days.some((d) => d.grabGo || /grab/i.test(d.dinner)) ? `<span class="month-tag">grab&amp;go</span>` : ""}`;
          longPress(btn, () => openWeekCustom(weekId, planId));
          ab.appendChild(btn);
        });
        row.appendChild(ab);
      }
      grid.appendChild(row);
    }

    grid.querySelectorAll(".month-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const weekId = btn.dataset.week;
        const planId = btn.dataset.plan;
        const monthNow = activeMonth();
        if (monthNow.deletedWeeks[weekId]) delete monthNow.deletedWeeks[weekId];
        loadTemplate(weekId, planId, true);
      });
    });
    grid.querySelectorAll("[data-del-week]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!isDupMonth()) return;
        const weekId = btn.dataset.delWeek;
        const monthNow = activeMonth();
        const prev = { deleted: monthNow.deletedWeeks[weekId], pick: monthNow.picks[weekId] };
        monthNow.deletedWeeks[weekId] = true;
        delete monthNow.picks[weekId];
        persist();
        renderAll();
        showUndoToast(`Week ${weekId} cleared`, () => {
          if (prev.deleted) monthNow.deletedWeeks[weekId] = true;
          else delete monthNow.deletedWeeks[weekId];
          if (prev.pick) monthNow.picks[weekId] = prev.pick;
          persist();
          renderAll();
          showToast("Undone");
        });
      });
    });
  }

  function duplicateMonth() {
    const fromKey = state.monthKey;
    const toKey = shiftMonthKey(fromKey, 1);
    const from = ensureMonth(fromKey);
    const copy = {
      picks: { ...from.picks },
      weekEdits: JSON.parse(JSON.stringify(from.weekEdits || {})),
      deletedWeeks: {},
      duplicated: true,
    };
    // also copy top-level weekEdits keys into month
    Object.keys(state.weekEdits || {}).forEach((k) => {
      if (!copy.weekEdits[k]) copy.weekEdits[k] = JSON.parse(JSON.stringify(state.weekEdits[k]));
    });
    state.months[toKey] = copy;
    state.monthKey = toKey;
    linkWeekEdits(state);
    persist();
    renderAll();
    showToast(`Duplicated into ${monthLabel(toKey)} — original ${monthLabel(fromKey)} untouched`);
  }

  function renderTemplates() {
    renderMonthControls();
    renderMonthGrid();
    renderStoreChips();
    if (els.budgetChip) els.budgetChip.textContent = budgetLine(currentPlan());
    if (els.houseNote) {
      els.houseNote.textContent = "";
      els.houseNote.hidden = true;
    }
    document.body.classList.toggle("shop-mode", state.shopMode);
    if (els.shopMode) {
      els.shopMode.setAttribute("aria-pressed", String(state.shopMode));
      els.shopMode.textContent = state.shopMode ? "Shop mode: On" : "Shop mode: Off";
    }
  }

  function jumpToGroceryDay(dayId) {
    state.groceryDayFilter = dayId;
    highlightDayId = dayId;
    persist();
    renderGrocery();
    const panel = document.getElementById("grocery-list");
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
      panel.classList.add("jump-flash");
      setTimeout(() => panel.classList.remove("jump-flash"), 1200);
    }
    showToast(`Showing groceries for ${dayId}`);
  }

  function renderCalendar() {
    const plan = currentPlan();
    els.weekGrid.innerHTML = "";
    const month = activeMonth();
    if (month.deletedWeeks[state.week]) {
      els.weekGrid.innerHTML = `<p class="muted2">This week slot is empty. Pick Option A or B in the month plan.</p>`;
      return;
    }
    plan.days.forEach((templateDay) => {
      const day = effectiveDay(templateDay);
      const card = document.createElement("article");
      card.className =
        "day-card" +
        (day.tedNote ? " day-card-fish" : "") +
        (day.swapped ? " day-card-swapped" : "") +
        (day.holiday || day.overrideType === "holiday" ? " day-card-holiday" : "") +
        (day.overrideType === "pickmeal" ? " day-card-pickmeal" : "");
      const adultLine =
        day.adultLunch && day.adultLunch !== "—" && !/adult lunch → —/.test(day.adultLunch)
          ? `<p class="day-lunch">${escapeHtml(day.adultLunch)}</p>`
          : `<p class="day-lunch day-lunch-muted">adult lunch → —</p>`;
      const tedLine = day.tedNote
        ? `<p class="day-ted">${escapeHtml(day.tedNote)}</p>`
        : "";
      const swapBadge = day.swapped
        ? `<p class="day-swap-badge">${
            day.overrideType === "leftovers"
              ? "Swapped → Leftovers"
              : day.overrideType === "eatout"
                ? "Swapped → Eat out"
                : day.overrideType === "removed"
                ? "🗑 Removed from this week"
                : day.overrideType === "pickmeal"
                ? "Pick a meal"
                : day.overrideType === "grabgo"
                ? `🛍 Grab & go`
                : `Swapped → ${escapeHtml(day.swapLabel || "dinner")}`
          }</p>`
        : "";
      const holClass = day.holiday || day.overrideType === "holiday";
      const showDel = isDupMonth() || !holClass;
      card.innerHTML = `
        <div class="day-head">
          <span>${day.short}</span>
          <div class="day-head-actions">
            ${holClass ? "" : `<button type="button" class="swap-btn" data-swap-day="${escapeAttr(templateDay.id)}" aria-label="Swap ${escapeAttr(day.day)} dinner">Swap</button>`}
            ${holClass ? "" : `<button type="button" class="swap-btn del-btn" data-del-day="${escapeAttr(templateDay.id)}" aria-label="Delete ${escapeAttr(day.day)} dinner">🗑</button>`}
            ${holClass ? "" : `<button type="button" class="swap-btn jump-btn" data-jump-day="${escapeAttr(templateDay.id)}" aria-label="Jump to groceries for ${escapeAttr(day.day)}">🛒</button>`}
            <span class="emoji" aria-hidden="true">${day.icon}</span>
          </div>
        </div>
        <button type="button" class="day-body day-body-btn${holClass ? " is-holiday" : ""}" aria-label="${escapeAttr(day.day)}: ${escapeAttr(day.dinner)}. Tap for recipe.">
          <span class="emo-row"><span class="meal-emoji" aria-hidden="true">${day.mealEmoji}</span>${prepCookBadge(day)}</span>
          ${calorieBadges(day)}
          <p class="day-dinner">${isFav(day.dinner) ? '<span class="fav-badge">⭐ favorite</span> ' : ""}${escapeHtml(day.dinner)}</p>
          ${day.tag ? `<p class="day-tag">${escapeHtml(day.tag)}</p>` : ""}
          ${swapBadge}
          ${tedLine}
          ${adultLine}
          <p class="tap-hint">${holClass ? "Holiday · no plan" : "Day note · tap for recipe"}</p>
        </button>
        ${holClass || day.overrideType === "eatout" || day.overrideType === "removed" || day.overrideType === "pickmeal" ? "" : rateRowHTML(day.dinner)}
        ${mealLogHTML(templateDay.id, day)}
      `;
      card.querySelector(".day-body-btn").addEventListener("click", () => openRecipe(day));
      if (!holClass && day.overrideType !== "eatout" && day.overrideType !== "removed" && day.overrideType !== "pickmeal") {
        bindRateRow(card, day.dinner);
      }
      bindMealLog(card, templateDay.id);
      const swapBtn = card.querySelector("[data-swap-day]");
      if (swapBtn) swapBtn.addEventListener("click", (e) => { e.stopPropagation(); openSwapPicker(templateDay.id); });
      const delBtn = card.querySelector("[data-del-day]");
      if (delBtn) delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isDupMonth()) {
          const prev = state.dayOverrides[templateDay.id];
          state.dayOverrides[templateDay.id] = { type: "pickmeal" };
          persist(); renderAll();
          showUndoToast(`${templateDay.short}: Pick a meal`, () => {
            if (prev) state.dayOverrides[templateDay.id] = prev; else delete state.dayOverrides[templateDay.id];
            persist(); renderAll(); showToast("Undone");
          });
        } else {
          openDeleteDay(templateDay.id);
        }
      });
      const jumpBtn = card.querySelector("[data-jump-day]");
      if (jumpBtn) jumpBtn.addEventListener("click", (e) => { e.stopPropagation(); jumpToGroceryDay(templateDay.id); });
      void showDel;
      els.weekGrid.appendChild(card);
    });
  }

  function openSwapPicker(dayId) {
    const plan = currentPlan();
    const templateDay = plan.days.find((d) => d.id === dayId);
    if (!templateDay || !els.swapModal) return;
    swapTargetDayId = dayId;
    const current = effectiveDay(templateDay);
    els.swapTitle.textContent = `Swap ${templateDay.day}`;
    const dinners = sortBySuggest(allTemplateDinners().filter((d) => {
      return !(d.weekId === state.week && d.planId === state.plan && d.day.id === dayId) && !isDown(d.day.dinner);
    }));
    const ov = dayOverride(dayId);
    const ggButtons = Object.keys(GRAB_GO).map((key) => {
      const g = GRAB_GO[key];
      const on = ov && (ov.type === "grabgo" || ov.type === "pick") && ov.key === key;
      return `<button type="button" class="swap-option${on ? " is-on" : ""}" data-swap-type="grabgo" data-swap-key="${escapeAttr(key)}">
        <span class="swap-option-title">${escapeHtml(g.tag)} · ${escapeHtml(g.dinner.replace(/^Grab & go:\s*/, ""))}</span>
        <span class="swap-option-sub">Adds grocery lines · est. prices</span>
      </button>`;
    }).join("");
    els.swapBody.innerHTML = `
      <p class="swap-current">Now: <strong>${escapeHtml(current.dinner)}</strong></p>
      <div class="swap-options" role="list">
        <button type="button" class="swap-option" data-swap-type="reset" ${!ov ? "disabled" : ""}>
          <span class="swap-option-title">Restore template</span>
          <span class="swap-option-sub">${escapeHtml(templateDay.dinner)}</span>
        </button>
        <button type="button" class="swap-option${ov && ov.type === "leftovers" ? " is-on" : ""}" data-swap-type="leftovers">
          <span class="swap-option-title">Leftovers</span>
          <span class="swap-option-sub">Clears this night’s grocery lines</span>
        </button>
        <button type="button" class="swap-option${ov && ov.type === "eatout" ? " is-on" : ""}" data-swap-type="eatout">
          <span class="swap-option-title">Eat out / takeout</span>
          <span class="swap-option-sub">Clears this night’s grocery lines</span>
        </button>
      </div>
      <h4 class="swap-section-title">🛍 Grab & go</h4>
      <div class="swap-options" role="list">${ggButtons}</div>
      <h4 class="swap-section-title">Dinners from templates</h4>
      <div class="swap-options swap-options-scroll" role="list">
        ${dinners
          .map((d) => {
            const on = ov && ov.type === "pick" && ov.key === d.key;
            return `<button type="button" class="swap-option${on ? " is-on" : ""}" data-swap-type="pick" data-swap-key="${escapeAttr(d.key)}">
              <span class="swap-option-title">${isFav(d.day.dinner) ? "⭐ " : ""}${escapeHtml(d.day.dinner)}</span>
              <span class="swap-option-sub">${escapeHtml(d.label)}${d.day.tedNote ? " · Ted leftover sub" : ""}</span>
            </button>`;
          })
          .join("")}
      </div>
      <p class="swap-footnote">Grocery lines for this night update automatically. Share link + this phone save the swap.</p>
    `;
    els.swapBody.querySelectorAll("[data-swap-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyDaySwap(dayId, btn.dataset.swapType, btn.dataset.swapKey || null);
      });
    });
    els.swapModal.classList.add("open");
    els.swapModal.setAttribute("aria-hidden", "false");
    if (els.swapClose) els.swapClose.focus();
  }

  function closeSwapPicker() {
    if (!els.swapModal) return;
    els.swapModal.classList.remove("open");
    els.swapModal.setAttribute("aria-hidden", "true");
    swapTargetDayId = null;
  }

  function applyDaySwap(dayId, type, key) {
    if (type === "reset") {
      delete state.dayOverrides[dayId];
      showToast("Restored template dinner");
    } else if (type === "leftovers") {
      state.dayOverrides[dayId] = { type: "leftovers" };
      showToast("Swapped to Leftovers — groceries updated");
    } else if (type === "eatout") {
      state.dayOverrides[dayId] = { type: "eatout" };
      showToast("Swapped to Eat out — groceries updated");
    } else if (type === "grabgo" && key && GRAB_GO[key]) {
      state.dayOverrides[dayId] = { type: "grabgo", key };
      showToast("Grab & go — groceries updated");
    } else if (type === "pick" && key && (parseDinnerKey(key) || GRAB_GO[key])) {
      if (GRAB_GO[key]) state.dayOverrides[dayId] = { type: "grabgo", key };
      else state.dayOverrides[dayId] = { type: "pick", key };
      showToast("Dinner swapped — groceries updated");
    } else {
      return;
    }
    persist();
    closeSwapPicker();
    renderAll();
  }

  function isStapleItem(item) {
    if (item.staple) return true;
    if (item.category === "Tucker lunchbox") return true;
    const name = String(item.name || "").toLowerCase();
    return (
      /\brice\b/.test(name) ||
      /tortilla/.test(name) ||
      /alfredo/.test(name) ||
      /\bpasta\b/.test(name) ||
      /chili beans|chili cans|tomatoes if pantry/.test(name)
    );
  }

  function allGroceryItems() {
    const plan = currentPlan();
    const activeDays = activeOriginalDayIds();
    const seeded = plan.groceries
      .filter((g) => {
        if (!Array.isArray(g.days) || g.days.length === 0) return true;
        return g.days.some((d) => activeDays.has(d));
      })
      .map((g) => ({
        ...g,
        category: normalizeCategory(g.category),
        custom: false,
        staple: Boolean(g.staple) || g.category === "Tucker lunchbox",
      }));

    const seenNames = new Set(seeded.map((g) => `${g.category}::${g.name.toLowerCase()}`));
    const injected = [];
    plan.days.forEach((day) => {
      const eff = effectiveDay(day);
      if (skipsGrocery(eff) && eff.overrideType !== "grabgo") return;
      const ov = dayOverride(day.id);
      if (!ov) return;
      if (ov.type === "grabgo" && ov.key) {
        groceriesForDinnerKey(ov.key).forEach((g) => {
          const dedupe = `${g.category}::${g.name.toLowerCase()}`;
          if (seenNames.has(dedupe)) return;
          seenNames.add(dedupe);
          injected.push({
            ...g,
            id: `swap-${day.id}-${g.id}`,
            category: normalizeCategory(g.category),
            custom: false,
            staple: false,
            hint: g.hint || `🛍 ${day.short}`,
            fromSwap: true,
            days: [day.id],
          });
        });
        return;
      }
      if (ov.type !== "pick" || !ov.key) return;
      groceriesForDinnerKey(ov.key).forEach((g) => {
        const dedupe = `${g.category}::${g.name.toLowerCase()}`;
        if (seenNames.has(dedupe)) return;
        seenNames.add(dedupe);
        injected.push({
          ...g,
          id: `swap-${day.id}-${g.id}`,
          category: normalizeCategory(g.category),
          custom: false,
          staple: Boolean(g.staple) || isStapleItem(g),
          hint: g.hint || `for ${day.short} swap`,
          fromSwap: true,
          days: [day.id],
        });
      });
    });

    const custom = state.custom.map((c) => ({
      id: c.id,
      category: normalizeCategory(c.category),
      name: c.name,
      price: "",
      hint: "custom item",
      custom: true,
      staple: false,
    }));
    return [...seeded, ...injected, ...custom];
  }

  function visibleGroceryItems(items) {
    return items.filter((item) => {
      if (itemHaveIt(item.id) && !state.showHiddenHave) return false;
      if (state.hideChecked && itemChecked(item.id)) return false;
      const filt = state.groceryDayFilter || "all";
      if (filt !== "all") {
        if (item.custom) return true;
        if (!Array.isArray(item.days) || item.days.length === 0) return filt === "all";
        if (!item.days.includes(filt)) return false;
      }
      return true;
    });
  }

  function estimateTotals(items) {
    let left = 0;
    let all = 0;
    let pricedLeft = 0;
    let pricedAll = 0;
    items.forEach((item) => {
      const price = itemPrice(item.id, item.price);
      if (price === null) return;
      all += price;
      pricedAll += 1;
      if (!itemChecked(item.id)) {
        left += price;
        pricedLeft += 1;
      }
    });
    return { left, all, pricedLeft, pricedAll };
  }

  function renderGroceryControls(items) {
    if (!els.groceryControls) return;
    const hiddenHave = items.filter((i) => itemHaveIt(i.id)).length;
    const checked = items.filter((i) => itemChecked(i.id)).length;
    const left = items.length - checked;
    els.checkedCount.textContent = `${left} left · ${checked} checked`;
    const days = ["all", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const labels = { all: "All days", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
    els.groceryControls.innerHTML = `
      <button type="button" class="chip-btn${state.hideChecked ? " is-on" : ""}" id="hide-checked-btn" aria-pressed="${state.hideChecked}">
        ${state.hideChecked ? "Show checked" : "Hide checked"}
      </button>
      <button type="button" class="chip-btn${state.showHiddenHave ? " is-on" : ""}" id="hidden-have-btn" aria-pressed="${state.showHiddenHave}" ${hiddenHave === 0 ? "disabled" : ""}>
        Hidden: ${hiddenHave}
      </button>
      <label class="day-filter-label">By day
        <select id="day-filter">${days.map((d) => `<option value="${d}" ${state.groceryDayFilter === d ? "selected" : ""}>${labels[d]}</option>`).join("")}</select>
      </label>
    `;
    const hideBtn = document.getElementById("hide-checked-btn");
    const hiddenBtn = document.getElementById("hidden-have-btn");
    const dayFilter = document.getElementById("day-filter");
    if (hideBtn) {
      hideBtn.addEventListener("click", () => {
        state.hideChecked = !state.hideChecked;
        persist();
        renderGrocery();
        showToast(state.hideChecked ? "Checked items hidden" : "Checked items shown");
      });
    }
    if (hiddenBtn) {
      hiddenBtn.addEventListener("click", () => {
        if (hiddenHave === 0) return;
        state.showHiddenHave = !state.showHiddenHave;
        persist();
        renderGrocery();
        showToast(state.showHiddenHave ? "Showing Have-it items" : "Have-it items hidden again");
      });
    }
    if (dayFilter) {
      dayFilter.addEventListener("change", () => {
        state.groceryDayFilter = dayFilter.value;
        persist();
        renderGrocery();
      });
    }
  }

  function renderGrocery() {
    refreshLiveForLocation();
    const items = allGroceryItems();
    const visible = visibleGroceryItems(items);
    let checkedVisible = 0;
    const byCat = CATEGORIES.map((cat) => {
      let groupItems = visible.filter((i) => i.category === cat);
      if (state.shopMode && !state.hideChecked) {
        groupItems = [...groupItems].sort((a, b) => Number(itemChecked(a.id)) - Number(itemChecked(b.id)));
      }
      return { cat, items: groupItems };
    }).filter((group) => group.items.length);

    els.groceryList.innerHTML = "";

    const tuckerNote = document.createElement("p");
    tuckerNote.className = "tucker-note";
    tuckerNote.textContent =
      "Tucker lunchbox: same kit every school day (Mon–Fri). Count packs Sun night; restock midweek. Not dinner leftovers. Tap Have it if stocked.";
    els.groceryList.appendChild(tuckerNote);

    const tots = storeTotals(items.filter((i) => !itemHaveIt(i.id)));
    const totalBar = document.createElement("div");
    totalBar.className = "store-totals";
    const loc = state.location || "Vero Beach";
    const col = (id, label, val, left) =>
      `<button type="button" class="${id === "best" ? "best" : ""}" data-store="${id}" aria-pressed="${state.store === id}">${state.store === id ? "⭐ " : ""}${label}<b>${formatMoney2(val)}</b><small>est. · ${formatMoney2(left)} left</small></button>`;
    totalBar.innerHTML = `
      <div class="tot" role="group" aria-label="Which store total to use">
        ${col("aldi", "All Aldi", tots.a, tots.aLeft)}${col("publix", "All Publix", tots.p, tots.pLeft)}${col("best", "Best split", tots.b, tots.bLeft)}
      </div>
      <p class="pchk">${escapeHtml(state.storeName || "Aldi")} · ${escapeHtml(loc)} · Prices last checked ${escapeHtml(fmtDateLong(PRICE_META.updated))}${PRICE_META.loaded ? "" : " (built-in estimates)"} · tap a total to use it · grey = older than 60 days</p>
      <p class="gnote">Best split = Aldi for ${tots.na} item${tots.na === 1 ? "" : "s"}, Publix for ${tots.np}. When this location has no price, we show the store’s general estimate labeled est. (not this store yet).${tots.cu ? ` ${tots.cu} custom item${tots.cu > 1 ? "s" : ""} without a price (add your $).` : ""}${tots.own ? ` ${tots.own} line${tots.own > 1 ? "s" : ""} use your own $.` : ""}</p>
      <p class="gnote rc">🧾 Send a receipt photo or Publix app Purchases screenshot to update prices.</p>`;
    totalBar.querySelectorAll("[data-store]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.store = normalizeStore(btn.dataset.store);
        persist();
        renderGrocery();
      });
    });
    els.groceryList.appendChild(totalBar);

    byCat.forEach((group) => {
      const h = document.createElement("h3");
      h.className = "category" + (group.cat === "Tucker lunchbox" ? " category-tucker" : "");
      h.textContent = group.cat;
      els.groceryList.appendChild(h);

      const ul = document.createElement("ul");
      ul.className = "item-list";
      group.items.forEach((item) => {
        const isOn = itemChecked(item.id);
        if (isOn) checkedVisible += 1;
        const price = itemPrice(item.id, item.price);
        const qty = itemQty(item.id);
        const note = itemNote(item.id);
        const have = itemHaveIt(item.id);
        const staple = isStapleItem(item);
        const li = document.createElement("li");
        const dayHit = highlightDayId && Array.isArray(item.days) && item.days.includes(highlightDayId);
        li.className = `item${isOn ? " checked" : ""}${have ? " have-it" : ""}${dayHit ? " day-hit" : ""}`;
        const inputId = `g-${item.id}`;
        const priceId = `p-${item.id}`;
        const qtyId = `q-${item.id}`;
        const noteId = `n-${item.id}`;
        li.innerHTML = `
          <input type="checkbox" id="${escapeAttr(inputId)}" ${isOn ? "checked" : ""} />
          <div class="item-main">
            <div class="item-copy">
              <label for="${escapeAttr(inputId)}">
                ${escapeHtml(item.name)}
                ${item.hint ? `<span class="hint">${escapeHtml(item.hint)}</span>` : ""}
              </label>
              <div class="item-meta-row">
                <button type="button" class="meta-chip qty-chip" data-edit="qty" aria-label="Quantity for ${escapeAttr(item.name)}">
                  ${qty ? escapeHtml(qty) : "Qty"}
                </button>
                <button type="button" class="meta-chip note-chip" data-edit="note" aria-label="Note for ${escapeAttr(item.name)}">
                  ${note ? escapeHtml(note) : "Note"}
                </button>
                ${
                  staple
                    ? `<button type="button" class="meta-chip have-chip${have ? " is-on" : ""}" data-edit="have" aria-pressed="${have}">
                        ${have ? "Have it ✓" : "Have it"}
                      </button>`
                    : ""
                }
              </div>
              ${storePriceRow(item)}
              <div class="meta-edit" hidden>
                <label class="visually-hidden" for="${escapeAttr(qtyId)}">Quantity</label>
                <input id="${escapeAttr(qtyId)}" class="meta-input qty-input" type="text" maxlength="40" placeholder="e.g. 2 lb" value="${escapeAttr(qty)}" />
                <label class="visually-hidden" for="${escapeAttr(noteId)}">Note</label>
                <input id="${escapeAttr(noteId)}" class="meta-input note-input" type="text" maxlength="80" placeholder="e.g. family pack" value="${escapeAttr(note)}" />
                <button type="button" class="btn btn-secondary meta-save">Save</button>
              </div>
            </div>
            <label class="price-field" for="${escapeAttr(priceId)}">
              <span>$</span>
              <input
                type="number"
                id="${escapeAttr(priceId)}"
                class="price-input"
                min="0"
                step="0.01"
                inputmode="decimal"
                placeholder="your"
                value="${price === null ? "" : String(price)}"
                aria-label="Your own price for ${escapeAttr(item.name)} (overrides store estimates)"
              />
            </label>
          </div>
        `;
        li.querySelector('input[type="checkbox"]').addEventListener("change", (e) => {
          setChecked(item.id, e.target.checked);
          persist();
          renderGrocery();
        });
        const priceInput = li.querySelector(".price-input");
        priceInput.addEventListener("change", (e) => {
          setPrice(item.id, e.target.value);
          persist();
          renderGrocery();
        });
        priceInput.addEventListener("click", (e) => e.stopPropagation());

        const metaEdit = li.querySelector(".meta-edit");
        const openMeta = (focusSel) => {
          metaEdit.hidden = false;
          const focusEl = li.querySelector(focusSel);
          if (focusEl) focusEl.focus();
        };
        li.querySelector('.meta-chip[data-edit="qty"]').addEventListener("click", (e) => {
          e.preventDefault();
          openMeta(".qty-input");
        });
        li.querySelector('.meta-chip[data-edit="note"]').addEventListener("click", (e) => {
          e.preventDefault();
          openMeta(".note-input");
        });
        const haveBtn = li.querySelector('.meta-chip[data-edit="have"]');
        if (haveBtn) {
          haveBtn.addEventListener("click", (e) => {
            e.preventDefault();
            setHaveIt(item.id, !itemHaveIt(item.id));
            if (!Object.keys(state.haveIt).length) state.showHiddenHave = false;
            persist();
            renderGrocery();
            showToast(itemHaveIt(item.id) ? "Marked Have it — hidden from list" : "Back on the list");
          });
        }
        li.querySelector(".meta-save").addEventListener("click", () => {
          setQty(item.id, li.querySelector(".qty-input").value);
          setNote(item.id, li.querySelector(".note-input").value);
          persist();
          renderGrocery();
          showToast("Saved qty / note");
        });
        ul.appendChild(li);
      });
      els.groceryList.appendChild(ul);
    });

    if (!byCat.length) {
      const empty = document.createElement("p");
      empty.className = "grocery-empty";
      empty.textContent = state.hideChecked
        ? "All visible items are checked (or Have-it hidden). Toggle Show checked / Hidden to review."
        : "No grocery lines for this view.";
      els.groceryList.appendChild(empty);
    }

    const foot = document.createElement("p");
    foot.className = "price-foot";
    foot.innerHTML = `All prices are <b>estimates</b> for ${escapeHtml(state.location || "Vero Beach")} Aldi &amp; Publix (from prices.json when it loads). Check in store; sales and BOGOs change weekly.
      <details style="margin-top:4px"><summary>Price sources</summary>${PRICE_SOURCES.map(([l, u]) => `<a href="${escapeAttr(u)}" target="_blank" rel="noopener">${escapeHtml(l)}</a>`).join("<br>")}</details>`;
    els.groceryList.appendChild(foot);

    void checkedVisible;
    renderGroceryControls(items);
    renderEstimate(items.filter((i) => !itemHaveIt(i.id)));
    renderBudgetCompare(tots);
    if (highlightDayId) {
      setTimeout(() => { highlightDayId = null; }, 1500);
    }
  }

  function openRecipe(day) {
    const r = day.recipe;
    els.modalTitle.textContent = `${day.day} — ${r.title}`;
    els.modalLunch.textContent = day.tedNote
      ? day.tedNote
      : day.adultLunch && day.adultLunch !== "—" && !/adult lunch → —/.test(day.adultLunch)
        ? day.adultLunch
        : "Tucker: fixed school lunchbox (not dinner leftovers)";
    const tedBlock = day.tedNote
      ? `<div class="recipe-block recipe-ted"><h4>Ted (no fish)</h4><p>${escapeHtml(day.tedNote)}</p></div>`
      : "";
    const cal = caloriesForDay(day);
    els.modalBody.innerHTML = `
      ${cal.main ? `<p class="muted2">🔥 ~${cal.main} cal per serving · This meal: ~${cal.meal} cal per serving <small>(USDA typical-serving rough est.)</small></p>` : ""}
      <div class="recipe-block">
        <h4>Have (pantry first)</h4>
        <p>${escapeHtml(r.have)}</p>
      </div>
      <div class="recipe-block">
        <h4>Do</h4>
        <ul>${r.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      </div>
      ${tedBlock}
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
        <p>Fixed kit Mon–Fri: yogurt + cheese stick + pretzels/Pringles + fruit snack + beef stick + apple juice. Not dinner leftovers.</p>
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
    const week = currentWeek();
    const plan = currentPlan();
    const items = allGroceryItems().filter((i) => !itemHaveIt(i.id));
    const totals = estimateTotals(items);
    const dinnerLines = plan.days.map((d) => {
      const day = effectiveDay(d);
      return `${day.short}: ${day.dinner}${day.tedNote ? ` (${day.tedNote})` : ""}`;
    });
    const lines = [
      `Burns Family grocery — ${state.weekTitle} (${week.label} · ${plan.label})`,
      `${state.storeName || "Aldi"} · ${state.location || "Vero Beach"}`,
      budgetLine(plan),
      (() => {
        const t = storeTotals(items);
        return `Est. totals: All Aldi ${formatMoney2(t.a)} · All Publix ${formatMoney2(t.p)} · Best split ${formatMoney2(t.b)}`;
      })(),
      totals.pricedAll ? `Your own $ entered: ${formatMoney(totals.all)} on ${totals.pricedAll} line(s)` : "",
      "Dinners: " + dinnerLines.join(" · "),
      "Tucker lunchbox = yogurt + cheese stick + pretzels/Pringles + fruit snack + beef stick + apple juice",
      "Restock midweek as packs deplete. Tucker does NOT eat dinner leftovers for school lunch.",
      "Chili = weekend daytime only when on the plan (not midweek, not twice, not every week).",
      "",
    ].filter((line, i, arr) => line !== "" || (i > 0 && arr[i - 1] !== ""));
    CATEGORIES.forEach((cat) => {
      let catItems = items.filter((i) => i.category === cat);
      if (state.shopMode && !state.hideChecked) {
        catItems = [...catItems].sort((a, b) => Number(itemChecked(a.id)) - Number(itemChecked(b.id)));
      }
      if (!catItems.length) return;
      lines.push(cat.toUpperCase());
      catItems.forEach((item) => {
        const mark = itemChecked(item.id) ? "[x]" : "[ ]";
        const price = itemPrice(item.id, item.price);
        const priceBit = price === null ? "" : ` ${formatMoney(price)}`;
        const qty = itemQty(item.id);
        const note = itemNote(item.id);
        const qtyBit = qty ? ` — ${qty}` : "";
        const noteBit = note ? ` (${note})` : "";
        const hint = item.hint ? ` [${item.hint}]` : "";
        const sp = storePriceText(item);
        lines.push(`${mark} ${item.name}${qtyBit}${noteBit}${priceBit ? ` (your$${priceBit.trim().slice(1)})` : ""}${sp ? ` — ${sp}` : ""}${hint}`);
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

  function showUndoToast(message, undo) {
    els.toast.innerHTML = `<span>${escapeHtml(message)}</span><button type="button" class="toast-undo">Undo</button>`;
    els.toast.classList.add("show");
    clearTimeout(showToast._t);
    els.toast.querySelector(".toast-undo").addEventListener("click", () => {
      clearTimeout(showToast._t);
      els.toast.classList.remove("show");
      undo();
    });
    showToast._t = setTimeout(() => els.toast.classList.remove("show"), 5000);
  }
  function todayIso() {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }
  function openDeleteDay(dayId) {
    const td = currentPlan().days.find((d) => d.id === dayId);
    if (!td) return;
    const day = effectiveDay(td);
    const special = ["leftovers", "eatout", "removed", "pickmeal", "holiday", "grabgo"].includes(day.overrideType);
    const inn = openSheet(shTop(`🗑 Delete ${td.day} dinner`) + `
      <p style="margin:0 0 10px;font-weight:800">${day.mealEmoji} ${escapeHtml(day.dinner)}</p>
      <button type="button" class="sh-btn wide" data-rm="week" ${day.overrideType === "removed" ? "disabled" : ""}>Remove from this week</button>
      <p class="muted2" style="margin:4px 0 12px">Frees up this night and takes its grocery lines off the list. You get 5 seconds to Undo.</p>
      <button type="button" class="sh-btn wide danger" data-rm="good" ${special ? "disabled" : ""}>Remove from menu for good</button>
      <p class="muted2" style="margin:4px 0 0">${special ? "Only real dinners can be removed for good (this night isn't one)." : `Moves “${escapeHtml(day.dinner)}” to Removed meals. It won't be suggested or offered in Swap. Tap Restore there anytime.`}</p>`, "Delete dinner");
    inn.querySelector('[data-rm="week"]').addEventListener("click", () => {
      const prev = state.dayOverrides[dayId];
      state.dayOverrides[dayId] = { type: "removed" };
      persist(); closeSheet(); renderAll();
      showUndoToast(`Removed from this week: ${td.short}`, () => {
        if (prev) state.dayOverrides[dayId] = prev; else delete state.dayOverrides[dayId];
        persist(); renderAll(); showToast("Undone — it's back on the week");
      });
    });
    if (!special) inn.querySelector('[data-rm="good"]').addEventListener("click", () => confirmRemoveForGood(day.dinner));
  }
  function confirmRemoveForGood(name) {
    const inn = openSheet(shTop("Remove for good?") + `
      <p style="margin:0 0 8px;font-weight:800">Remove “${escapeHtml(name)}” from your menu for good?</p>
      <p class="muted2" style="margin:0 0 10px">It moves to <b>Removed meals</b> and won't be suggested or offered in Swap. You can tap Restore there anytime.</p>
      <div class="sh-row2"><button type="button" class="sh-btn" data-c="no">Cancel</button><button type="button" class="sh-btn danger" data-c="yes">Remove for good</button></div>`, "Confirm remove from menu for good");
    inn.querySelector('[data-c="no"]').addEventListener("click", closeSheet);
    inn.querySelector('[data-c="yes"]').addEventListener("click", () => {
      const k = rateKey(name);
      if (!state.ratings) state.ratings = {};
      state.ratings[k] = { r: -1, d: todayIso(), n: String(name).slice(0, 80), x: 1 };
      currentPlan().days.forEach((td) => {
        if (rateKey(effectiveDay(td).dinner) === k) state.dayOverrides[td.id] = { type: "removed" };
      });
      persist(); closeSheet(); renderAll();
      showToast("Removed from menu for good — Restore it in Removed meals");
    });
  }

  const copyPhotoFiles = [];
  let copyPhotoOpts = null;
  function showCopyPhoto(text, label) {
    const box = document.getElementById("copy-photo");
    if (!box) return;
    box.hidden = false;
    if (!copyPhotoOpts) {
      box.innerHTML = `<p class="cph-t" data-cpl></p>
        <button type="button" class="btn btn-secondary cph-btn" data-cpb>📷 Take a photo</button>
        <input type="file" accept="image/*" capture="environment" hidden data-cpin>
        <div class="thumbs cph-th" data-cpth></div><div data-cpact></div>
        <p class="muted2">Opens your camera. Snap the fridge, pantry or a receipt, then tap Share to send it with what you copied. Nothing is uploaded; Share just opens your phone's share sheet.</p>`;
      box.querySelector("[data-cpb]").addEventListener("click", () => box.querySelector("[data-cpin]").click());
      copyPhotoOpts = {
        inputs: [box.querySelector("[data-cpin]")], thumbs: box.querySelector("[data-cpth]"), act: box.querySelector("[data-cpact]"),
        files: copyPhotoFiles, btnClass: "sh-btn p wide", shareLabel: "Share", title: "Burns Family Meals", text: text, after: "",
        fallback: "Your browser can't open the share sheet here. Save the photo (long-press → Save) and send it with your message.",
      };
      attachShare(copyPhotoOpts);
    }
    copyPhotoOpts.text = text;
    box.querySelector("[data-cpl]").textContent = `✓ ${label} Want to send a photo with it?`;
  }

  function openSettings() {
    if (!els.settingsModal || !els.settingsBody) return;
    const draw = () => {
      const rules = state.houseRules || DEFAULT_HOUSE_RULES.slice();
      const hol = state.holidays || defaultHolidays();
      const stores = ["Aldi", "Publix", ...(state.customStores || [])];
      els.settingsBody.innerHTML = `
        <section class="set-block">
          <h4>House rules</h4>
          <p class="muted2">Saved on this phone and in the share link. Not shown on the main page.</p>
          <textarea id="set-rules" rows="8">${escapeHtml(rules.join("\n"))}</textarea>
        </section>
        <section class="set-block">
          <h4>Store & location</h4>
          <label class="fld">Store</label>
          <select id="set-store">${stores.map((s) => `<option value="${escapeAttr(s)}" ${state.storeName === s ? "selected" : ""}>${escapeHtml(s)}</option>`).join("")}</select>
          <label class="fld">Add custom store</label>
          <div class="sh-row2"><input class="inp" id="set-store-new" placeholder="e.g. Walmart" /><button type="button" class="sh-btn" id="set-store-add">Add</button></div>
          <label class="fld">Location</label>
          <input class="inp" id="set-loc" value="${escapeAttr(state.location || "Vero Beach")}" placeholder="Vero Beach" />
        </section>
        <section class="set-block">
          <h4>Big cooking holidays</h4>
          <p class="muted2">Left blank — no meal, nothing on the list, not in the budget. Toggle “cook normally” to treat as a regular day.</p>
          <ul class="hol-list">${hol.map((h, i) => `<li>
            <span>${h.emoji || "🎉"} ${escapeHtml(h.name)}</span>
            <label><input type="checkbox" data-hol-cook="${i}" ${h.cook ? "checked" : ""}/> cook normally</label>
            <button type="button" class="chip-btn" data-hol-del="${i}">Remove</button>
          </li>`).join("")}</ul>
          <div class="sh-row2">
            <input class="inp" id="set-hol-name" placeholder="Holiday name" />
            <input class="inp" id="set-hol-date" type="date" />
          </div>
          <button type="button" class="sh-btn" id="set-hol-add" style="margin-top:0.5rem">Add holiday</button>
        </section>
        <button type="button" class="sh-btn p wide" id="set-save">Save settings</button>
      `;
      els.settingsBody.querySelector("#set-store-add").onclick = () => {
        const v = els.settingsBody.querySelector("#set-store-new").value.trim();
        if (!v) return;
        if (!state.customStores) state.customStores = [];
        if (!state.customStores.includes(v)) state.customStores.push(v.slice(0, 40));
        state.storeName = v.slice(0, 40);
        persist();
        draw();
      };
      els.settingsBody.querySelectorAll("[data-hol-cook]").forEach((cb) => {
        cb.onchange = () => {
          const i = Number(cb.dataset.holCook);
          state.holidays[i].cook = cb.checked;
        };
      });
      els.settingsBody.querySelectorAll("[data-hol-del]").forEach((b) => {
        b.onclick = () => {
          const i = Number(b.dataset.holDel);
          state.holidays.splice(i, 1);
          draw();
        };
      });
      els.settingsBody.querySelector("#set-hol-add").onclick = () => {
        const name = els.settingsBody.querySelector("#set-hol-name").value.trim();
        const date = els.settingsBody.querySelector("#set-hol-date").value;
        if (!name || !date) { showToast("Need a name and date"); return; }
        state.holidays.push({ id: `custom-${Date.now()}`, name: name.slice(0, 40), emoji: "🎉", kind: "custom", date, cook: false });
        draw();
      };
      els.settingsBody.querySelector("#set-save").onclick = () => {
        const raw = els.settingsBody.querySelector("#set-rules").value;
        state.houseRules = raw.split(/\n+/).map((s) => s.trim()).filter(Boolean).slice(0, 20);
        state.storeName = els.settingsBody.querySelector("#set-store").value || "Aldi";
        state.location = els.settingsBody.querySelector("#set-loc").value.trim() || "Vero Beach";
        persist();
        refreshLiveForLocation();
        closeSettings();
        renderAll();
        showToast("Settings saved");
      };
    };
    draw();
    els.settingsModal.classList.add("open");
    els.settingsModal.setAttribute("aria-hidden", "false");
  }

  function closeSettings() {
    if (!els.settingsModal) return;
    els.settingsModal.classList.remove("open");
    els.settingsModal.setAttribute("aria-hidden", "true");
  }

  function injectUpgradeStyles() {
    if (document.getElementById("burns-v4-styles")) return;
    const s = document.createElement("style");
    s.id = "burns-v4-styles";
    s.textContent = [
      ".hero-card{background:linear-gradient(165deg,#fffaf4 0%,#e7f4ef 55%,#f8efe4 100%);border-radius:22px;padding:1.1rem 1rem 1.15rem;box-shadow:var(--shadow);margin-bottom:1rem;text-align:center}",
      ".gear-btn{margin-left:.5rem;min-width:44px;min-height:44px;border-radius:12px;border:2px solid rgba(15,110,110,.25);background:var(--white);font-size:1.1rem;cursor:pointer}",
      ".rcpt-top{display:flex;justify-content:center;align-items:center;gap:.35rem}",
      ".hero-budget{margin:.85rem auto 0;max-width:28rem;padding:.75rem .9rem;border-radius:16px;background:rgba(255,255,255,.72);border:2px solid rgba(15,110,110,.2);cursor:pointer;text-align:left}",
      ".hero-budget-top{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;justify-content:space-between;margin-bottom:.35rem}",
      ".budget-chip,.store-chip{font:inherit;font-weight:800;font-size:.78rem;border-radius:999px;padding:.28rem .65rem;border:0;background:var(--teal-soft);color:var(--teal-deep)}",
      ".store-chip{background:#fff3e4;color:var(--coral-deep)}",
      ".hero-sentence{margin:0;font-weight:800;font-size:.95rem;color:var(--ink)}",
      ".hero-sentence .over-amt{color:#b91c1c}",
      ".budget-progress{height:10px;border-radius:999px;background:#e5e7eb;overflow:hidden;margin-top:.55rem}",
      ".budget-progress-fill{height:100%;width:0;border-radius:999px;transition:width .35s ease}",
      ".budget-progress-fill.tone-ok{background:#16a34a}",
      ".budget-progress-fill.tone-warn{background:#d97706}",
      ".budget-progress-fill.tone-bad{background:#dc2626}",
      ".month-title-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem}",
      ".month-ctrl{display:flex;align-items:center;gap:.25rem;position:relative}",
      ".month-arrow,.month-name-btn{min-height:40px;border:2px solid rgba(15,110,110,.25);background:var(--white);border-radius:12px;font:inherit;font-weight:800;cursor:pointer;padding:.35rem .65rem}",
      ".month-menu{position:absolute;right:0;top:110%;background:var(--white);border:2px solid rgba(15,110,110,.2);border-radius:12px;box-shadow:var(--shadow);z-index:5;min-width:12rem}",
      ".month-menu button{display:block;width:100%;text-align:left;border:0;background:transparent;padding:.7rem .85rem;font:inherit;font-weight:800;cursor:pointer}",
      ".month-grid{display:flex;flex-direction:column;gap:.65rem}",
      ".month-row{background:var(--white);border-radius:16px;padding:.65rem;box-shadow:var(--shadow)}",
      ".month-week-label{display:flex;justify-content:space-between;align-items:center;font-weight:800;margin-bottom:.4rem}",
      ".month-ab{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}",
      ".month-opt{appearance:none;border:3px solid transparent;border-radius:14px;min-height:64px;padding:.7rem;font:inherit;text-align:left;cursor:pointer;background:#f7fbf9;position:relative}",
      ".month-opt.is-on,.month-opt[aria-pressed=true]{background:linear-gradient(160deg,var(--teal),var(--teal-deep));color:#fff;border-color:var(--gold)}",
      ".month-opt-id{display:block;font-weight:900;font-size:1.05rem}",
      ".month-opt-blurb{display:block;font-size:.78rem;font-weight:650;opacity:.92;margin-top:.15rem}",
      ".month-tag{display:inline-block;margin-top:.25rem;font-size:.68rem;font-weight:800;background:rgba(255,255,255,.2);border-radius:999px;padding:.1rem .4rem}",
      ".month-opt:not(.is-on) .month-tag{background:var(--teal-soft);color:var(--teal-deep)}",
      ".month-empty-slot{padding:.35rem}",
      ".day-card-holiday{opacity:.78;filter:grayscale(.15)}",
      ".day-card-holiday .day-body{background:#eef1f3}",
      ".cal-badges{display:flex;flex-direction:column;gap:.15rem;margin:.25rem 0;font-size:.72rem;font-weight:800;color:var(--ink-soft)}",
      ".meal-log{padding:.55rem .85rem .8rem;display:flex;flex-direction:column;gap:.35rem;border-top:1px dashed rgba(23,48,66,.12)}",
      ".log-chip{min-height:36px;border-radius:999px;border:2px solid rgba(15,110,110,.22);background:var(--bg);font:inherit;font-weight:800;font-size:.78rem;padding:.25rem .65rem;cursor:pointer}",
      ".log-chip.on{background:var(--teal-soft);border-color:var(--teal)}",
      ".log-status,.log-bad{display:flex;flex-wrap:wrap;gap:.3rem;align-items:center}",
      ".log-left{font-weight:800;font-size:.78rem;display:flex;gap:.35rem;align-items:center}",
      ".week-review-panel{background:var(--white);border-radius:20px;box-shadow:var(--shadow);padding:.9rem 1rem;margin:1rem 0}",
      ".gentle-banner{position:fixed;left:50%;transform:translateX(-50%);bottom:1rem;z-index:40;max-width:min(92vw,26rem);background:#124f4f;color:#fff;padding:.75rem 1rem;border-radius:14px;font-weight:750;box-shadow:var(--shadow)}",
      ".gentle-banner .chip-btn{margin-left:.5rem;background:#fff;color:var(--teal-deep)}",
      ".settings-backdrop.open,.modal-backdrop.open{display:flex}",
      ".modal-settings{max-width:32rem;width:min(96vw,32rem);max-height:85vh;overflow:auto}",
      ".set-block{margin:0 0 1rem;padding-bottom:.75rem;border-bottom:1px dashed rgba(23,48,66,.15)}",
      ".set-block h4{margin:0 0 .35rem}",
      ".set-block textarea,.set-block .inp, .set-block select{width:100%;font:inherit;font-weight:700;border:2px solid rgba(15,110,110,.25);border-radius:12px;padding:.55rem .7rem;box-sizing:border-box}",
      ".hol-list{list-style:none;margin:0;padding:0}",
      ".hol-list li{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;padding:.35rem 0;font-weight:750}",
      ".day-filter-label{display:inline-flex;align-items:center;gap:.35rem;font-weight:800;font-size:.8rem}",
      ".day-filter-label select{font:inherit;font-weight:800;border-radius:10px;border:2px solid rgba(15,110,110,.25);padding:.3rem}",
      ".item.day-hit{outline:3px solid var(--coral);background:#fff7f0}",
      "#grocery-list.jump-flash{animation:jumpflash .9s ease}",
      "@keyframes jumpflash{0%,100%{box-shadow:none}40%{box-shadow:0 0 0 4px rgba(212,87,42,.35)}}",
      ".day-tag{margin:.15rem 0;font-weight:800;font-size:.75rem;color:var(--coral-deep)}",
      ".edited-badge{position:absolute;top:.35rem;right:.35rem;font-size:.65rem;font-weight:900;background:var(--gold);color:#3a2a00;border-radius:999px;padding:.1rem .4rem}",
    ].join("");
    document.head.appendChild(s);
  }

  function renderAll() {
    els.weekLabel.value = state.weekTitle;
    renderTemplates();
    renderCalendar();
    renderGrocery();
    renderRatings();
    renderWeekReview();
    maybeGentleBanner();
    renderStoreChips();
  }

  function loadTemplate(weekId, planId, announce) {
    const nextWeek = ["1", "2", "3", "4"].includes(String(weekId)) ? String(weekId) : "1";
    const nextPlan = planId === "B" ? "B" : "A";
    const changed = state.week !== nextWeek || state.plan !== nextPlan;
    state.week = nextWeek;
    state.plan = nextPlan;
    state.weekTitle = WEEKS[nextWeek].title;
    const month = activeMonth();
    month.picks[nextWeek] = nextPlan;
    delete month.deletedWeeks[nextWeek];
    linkWeekEdits(state);
    persist();
    renderAll();
    if (announce && changed) {
      showToast(`Loaded ${WEEKS[nextWeek].label} Option ${nextPlan}`);
    }
  }

  function boot() {
    injectUpgradeStyles();
    const fromUrl = readShareFromUrl();
    const fromStorage = loadFromStorage();
    if (fromUrl) {
      state = fromUrl;
    } else if (fromStorage) {
      state = fromStorage;
    } else {
      state = defaultState();
    }
    if (!state.monthKey) state.monthKey = currentMonthKey();
    ensureMonth(state.monthKey);
    linkWeekEdits(state);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}

    initSheet();
    if (els.rcptBtn) els.rcptBtn.addEventListener("click", openReceipt);
    if (els.settingsBtn) els.settingsBtn.addEventListener("click", openSettings);
    if (els.settingsClose) els.settingsClose.addEventListener("click", closeSettings);
    if (els.settingsModal) {
      els.settingsModal.addEventListener("click", (e) => {
        if (e.target === els.settingsModal) closeSettings();
      });
    }
    if (els.calBtn) {
      els.calBtn.addEventListener("click", () => {
        openCal({
          sel: parseWeekLabel(state.weekTitle),
          onPick: (mon) => {
            state.weekTitle = fmtWeek(mon);
            els.weekLabel.value = state.weekTitle;
            persist();
            renderAll();
            showToast(`Week set to ${state.weekTitle}`);
          },
        });
      });
    }
    if (els.budgetBand) {
      els.budgetBand.addEventListener("click", openBudgetEditor);
      els.budgetBand.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBudgetEditor(); }
      });
    }
    if (els.monthPrev) els.monthPrev.addEventListener("click", () => {
      state.monthKey = shiftMonthKey(state.monthKey, -1);
      ensureMonth(state.monthKey);
      linkWeekEdits(state);
      persist();
      renderAll();
    });
    if (els.monthNext) els.monthNext.addEventListener("click", () => {
      state.monthKey = shiftMonthKey(state.monthKey, 1);
      ensureMonth(state.monthKey);
      linkWeekEdits(state);
      persist();
      renderAll();
    });
    if (els.monthName) els.monthName.addEventListener("click", () => {
      if (!els.monthMenu) return;
      els.monthMenu.hidden = !els.monthMenu.hidden;
    });
    if (els.monthDup) els.monthDup.addEventListener("click", () => {
      if (els.monthMenu) els.monthMenu.hidden = true;
      duplicateMonth();
    });
    document.addEventListener("click", (e) => {
      if (!els.monthMenu || els.monthMenu.hidden) return;
      if (els.monthName && els.monthName.contains(e.target)) return;
      if (els.monthMenu.contains(e.target)) return;
      els.monthMenu.hidden = true;
    });

    els.weekLabel.addEventListener("change", () => {
      state.weekTitle = els.weekLabel.value.trim() || currentWeek().title;
      persist();
      renderAll();
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
        category: normalizeCategory(els.customCategory.value),
      });
      if (els.customPrice && els.customPrice.value.trim()) {
        setPrice(id, els.customPrice.value);
        els.customPrice.value = "";
      }
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
      const t = shareUrl();
      copyText(t, "Share link copied — text it to Ted or Samantha");
      showCopyPhoto(t, "Share link copied.");
    });
    els.copyGrocery.addEventListener("click", () => {
      const t = groceryText();
      copyText(t, "Grocery list copied for iMessage/SMS");
      showCopyPhoto(t, "Grocery list copied.");
    });
    els.shopMode.addEventListener("click", () => {
      state.shopMode = !state.shopMode;
      persist();
      renderAll();
      updateWakeLock();
      showToast(
        state.shopMode
          ? "Shop mode on — big taps, checked sink to bottom, screen stays awake"
          : "Shop mode off"
      );
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
    if (els.swapClose) els.swapClose.addEventListener("click", closeSwapPicker);
    if (els.swapModal) {
      els.swapModal.addEventListener("click", (e) => {
        if (e.target === els.swapModal) closeSwapPicker();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (els.settingsModal && els.settingsModal.classList.contains("open")) closeSettings();
      else if (els.swapModal && els.swapModal.classList.contains("open")) closeSwapPicker();
      else if (els.modal.classList.contains("open")) closeRecipe();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && state.shopMode) updateWakeLock();
    });

    window.addEventListener("hashchange", () => {
      const shared = readShareFromUrl();
      if (shared) {
        state = shared;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (_) {}
        renderAll();
        updateWakeLock();
        showToast("Loaded shared plan from link");
      }
    });

    renderAll();
    writeShareToUrl(false);
    updateWakeLock();
    loadPricesJson();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
