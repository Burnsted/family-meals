(() => {
  "use strict";

  const STORAGE_KEY = "family-meals-state-v3";
  const LEGACY_STORAGE_KEYS = ["family-meals-state-v2", "family-meals-state-v1"];
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
  };

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
    shopMode: false,
    hideChecked: false,
    showHiddenHave: false,
  });

  let state = defaultState();
  let wakeLock = null;
  let swapTargetDayId = null;

  const els = {
    weekLabel: document.getElementById("week-label"),
    budgetBand: document.getElementById("budget-band"),
    estimateBand: document.getElementById("estimate-band"),
    houseNote: document.getElementById("house-note"),
    templateBtns: Array.from(document.querySelectorAll(".template-btn")),
    tpl1a: document.getElementById("tpl-1a"),
    tpl1b: document.getElementById("tpl-1b"),
    tpl2a: document.getElementById("tpl-2a"),
    tpl2b: document.getElementById("tpl-2b"),
    weekGrid: document.getElementById("week-grid"),
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

  function dayOverride(dayId) {
    const ov = state.dayOverrides[dayId];
    return ov && typeof ov === "object" ? ov : null;
  }

  function effectiveDay(templateDay) {
    const ov = dayOverride(templateDay.id);
    if (!ov) {
      return { ...templateDay, overrideType: null, swapped: false };
    }
    if (ov.type === "leftovers") {
      const special = SPECIAL_DINNERS.leftovers;
      return {
        ...templateDay,
        dinner: special.dinner,
        icon: special.icon,
        mealEmoji: special.mealEmoji,
        adultLunch: special.adultLunch,
        tedNote: "",
        recipe: special.recipe,
        overrideType: "leftovers",
        swapped: true,
      };
    }
    if (ov.type === "eatout") {
      const special = SPECIAL_DINNERS.eatout;
      return {
        ...templateDay,
        dinner: special.dinner,
        icon: special.icon,
        mealEmoji: special.mealEmoji,
        adultLunch: special.adultLunch,
        tedNote: "",
        recipe: special.recipe,
        overrideType: "eatout",
        swapped: true,
      };
    }
    if (ov.type === "pick" && ov.key) {
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
        swapLabel: `${parsed.week.label} ${parsed.planId} · ${src.short}`,
      };
    }
    return { ...templateDay, overrideType: null, swapped: false };
  }

  function activeOriginalDayIds() {
    const plan = currentPlan();
    const active = new Set();
    plan.days.forEach((day) => {
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

  function persist() {
    try {
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
      } else if ((ov.type === "pick" || ov.t === "p") && (ov.key || ov.k)) {
        const key = ov.key || ov.k;
        if (parseDinnerKey(key)) out[dayId] = { type: "pick", key };
      }
    });
    return out;
  }

  function normalizeState(parsed) {
    const base = defaultState();
    if (!parsed || typeof parsed !== "object") return base;
    base.week = parsed.week === "2" || parsed.week === 2 ? "2" : "1";
    base.plan = parsed.plan === "B" ? "B" : "A";
    base.shopMode = Boolean(parsed.shopMode);
    base.hideChecked = Boolean(parsed.hideChecked);
    base.showHiddenHave = Boolean(parsed.showHiddenHave);
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
      sm: state.shopMode ? 1 : 0,
      hc: state.hideChecked ? 1 : 0,
      c: Object.keys(state.checked).filter((k) => state.checked[k]),
      h: Object.keys(state.haveIt).filter((k) => state.haveIt[k]),
      q: { ...state.qty },
      n: { ...state.notes },
      o: Object.keys(state.dayOverrides).reduce((acc, dayId) => {
        const ov = state.dayOverrides[dayId];
        if (!ov) return acc;
        if (ov.type === "leftovers") acc[dayId] = { t: "l" };
        else if (ov.type === "eatout") acc[dayId] = { t: "e" };
        else if (ov.type === "pick" && ov.key) acc[dayId] = { t: "p", k: ov.key };
        return acc;
      }, {}),
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
      next.week = payload.wk === "2" || payload.wk === 2 ? "2" : "1";
      next.plan = payload.p === "B" ? "B" : "A";
      next.shopMode = Boolean(payload.sm);
      next.hideChecked = Boolean(payload.hc);
      if (typeof payload.w === "string" && payload.w.trim()) {
        next.weekTitle = payload.w.trim().slice(0, 80);
      } else {
        next.weekTitle = WEEKS[next.week].title;
      }
      const checked = normalizeIdFlags(payload.c);
      next.haveIt = normalizeIdFlags(payload.h);
      next.qty = normalizeStringMap(payload.q, 40);
      next.notes = normalizeStringMap(payload.n, 80);
      next.dayOverrides = normalizeDayOverrides(payload.o);
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
        try {
          await wakeLock.release();
        } catch (_) {}
        wakeLock = null;
      }
      return;
    }
    if (!("wakeLock" in navigator) || typeof navigator.wakeLock.request !== "function") return;
    if (document.visibilityState !== "visible") return;
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        wakeLock = null;
      });
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

  function renderTemplates() {
    const week = currentWeek();
    if (els.tpl1a) els.tpl1a.textContent = WEEKS["1"].plans.A.blurb;
    if (els.tpl1b) els.tpl1b.textContent = WEEKS["1"].plans.B.blurb;
    if (els.tpl2a) els.tpl2a.textContent = WEEKS["2"].plans.A.blurb;
    if (els.tpl2b) els.tpl2b.textContent = WEEKS["2"].plans.B.blurb;

    els.templateBtns.forEach((btn) => {
      const on = btn.dataset.week === state.week && btn.dataset.plan === state.plan;
      btn.setAttribute("aria-pressed", String(on));
    });

    const plan = currentPlan();
    els.budgetBand.textContent = `Budget band ${plan.budget}`;
    if (els.houseNote) {
      els.houseNote.textContent = plan.houseNote || "";
      els.houseNote.hidden = !plan.houseNote;
    }
    document.body.classList.toggle("shop-mode", state.shopMode);
    if (els.shopMode) {
      els.shopMode.setAttribute("aria-pressed", String(state.shopMode));
      els.shopMode.textContent = state.shopMode ? "Shop mode: On" : "Shop mode: Off";
    }
  }

  function renderCalendar() {
    const plan = currentPlan();
    els.weekGrid.innerHTML = "";
    plan.days.forEach((templateDay) => {
      const day = effectiveDay(templateDay);
      const card = document.createElement("article");
      card.className =
        "day-card" +
        (day.tedNote ? " day-card-fish" : "") +
        (day.swapped ? " day-card-swapped" : "");
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
                : `Swapped → ${escapeHtml(day.swapLabel || "dinner")}`
          }</p>`
        : "";
      card.innerHTML = `
        <div class="day-head">
          <span>${day.short}</span>
          <div class="day-head-actions">
            <button type="button" class="swap-btn" data-swap-day="${escapeAttr(templateDay.id)}" aria-label="Swap ${escapeAttr(day.day)} dinner">Swap</button>
            <span class="emoji" aria-hidden="true">${day.icon}</span>
          </div>
        </div>
        <button type="button" class="day-body day-body-btn" aria-label="${escapeAttr(day.day)}: ${escapeAttr(day.dinner)}. Tap for recipe.">
          <span class="meal-emoji" aria-hidden="true">${day.mealEmoji}</span>
          <p class="day-dinner">${escapeHtml(day.dinner)}</p>
          ${swapBadge}
          ${tedLine}
          ${adultLine}
          <p class="tap-hint">Day note · tap for recipe</p>
        </button>
      `;
      card.querySelector(".day-body-btn").addEventListener("click", () => openRecipe(day));
      card.querySelector(".swap-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        openSwapPicker(templateDay.id);
      });
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
    const dinners = allTemplateDinners().filter((d) => {
      // Skip the night already on this template day (same week/plan/day)
      return !(d.weekId === state.week && d.planId === state.plan && d.day.id === dayId);
    });
    const currentKey = dinnerKey(state.week, state.plan, dayId);
    const ov = dayOverride(dayId);
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
      <h4 class="swap-section-title">Dinners from templates</h4>
      <div class="swap-options swap-options-scroll" role="list">
        ${dinners
          .map((d) => {
            const on = ov && ov.type === "pick" && ov.key === d.key;
            return `<button type="button" class="swap-option${on ? " is-on" : ""}" data-swap-type="pick" data-swap-key="${escapeAttr(d.key)}">
              <span class="swap-option-title">${escapeHtml(d.day.dinner)}</span>
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
    // silence unused
    void currentKey;
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
    } else if (type === "pick" && key && parseDinnerKey(key)) {
      state.dayOverrides[dayId] = { type: "pick", key };
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
      const ov = dayOverride(day.id);
      if (!ov || ov.type !== "pick" || !ov.key) return;
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

  function renderEstimate(items) {
    const { left, all, pricedLeft, pricedAll } = estimateTotals(items);
    if (!els.estimateBand) return;
    if (pricedAll === 0) {
      els.estimateBand.textContent = "Est. — add $";
      els.estimateBand.title = "Optional: type a $ estimate on any grocery line";
      return;
    }
    els.estimateBand.textContent = `Est. left ${formatMoney(left)}`;
    els.estimateBand.title = `${pricedLeft} unchecked priced · trip total if all priced ${formatMoney(all)} (${pricedAll} lines)`;
  }

  function renderGroceryControls(items) {
    if (!els.groceryControls) return;
    const hiddenHave = items.filter((i) => itemHaveIt(i.id)).length;
    const checked = items.filter((i) => itemChecked(i.id)).length;
    const left = items.length - checked;
    els.checkedCount.textContent = `${left} left · ${checked} checked`;
    els.groceryControls.innerHTML = `
      <button type="button" class="chip-btn${state.hideChecked ? " is-on" : ""}" id="hide-checked-btn" aria-pressed="${state.hideChecked}">
        ${state.hideChecked ? "Show checked" : "Hide checked"}
      </button>
      <button type="button" class="chip-btn${state.showHiddenHave ? " is-on" : ""}" id="hidden-have-btn" aria-pressed="${state.showHiddenHave}" ${hiddenHave === 0 ? "disabled" : ""}>
        Hidden: ${hiddenHave}
      </button>
    `;
    const hideBtn = document.getElementById("hide-checked-btn");
    const hiddenBtn = document.getElementById("hidden-have-btn");
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
  }

  function renderGrocery() {
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

    const totalBar = document.createElement("div");
    totalBar.className = "estimate-bar";
    const totals = estimateTotals(items.filter((i) => !itemHaveIt(i.id)));
    totalBar.innerHTML =
      totals.pricedAll === 0
        ? `<strong>Running $ estimate:</strong> optional — tap a line’s $ box while you shop.`
        : `<strong>Running $ estimate:</strong> ${formatMoney(totals.left)} still to buy` +
          ` <span>· ${formatMoney(totals.all)} if all priced lines counted</span>`;
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
        li.className = `item${isOn ? " checked" : ""}${have ? " have-it" : ""}`;
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
                placeholder=""
                value="${price === null ? "" : String(price)}"
                aria-label="Optional price for ${escapeAttr(item.name)}"
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

    void checkedVisible;
    renderGroceryControls(items);
    renderEstimate(items.filter((i) => !itemHaveIt(i.id)));
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
    els.modalBody.innerHTML = `
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
      `Budget band ${plan.budget}`,
      totals.pricedAll
        ? `Running $ estimate: ${formatMoney(totals.left)} left · ${formatMoney(totals.all)} all priced`
        : "",
      plan.houseNote || "",
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
        lines.push(`${mark} ${item.name}${qtyBit}${noteBit}${priceBit}${hint}`);
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
    renderTemplates();
    renderCalendar();
    renderGrocery();
  }

  function loadTemplate(weekId, planId, announce) {
    const nextWeek = weekId === "2" ? "2" : "1";
    const nextPlan = planId === "B" ? "B" : "A";
    const changed = state.week !== nextWeek || state.plan !== nextPlan;
    state.week = nextWeek;
    state.plan = nextPlan;
    state.weekTitle = WEEKS[nextWeek].title;
    if (changed) {
      state.dayOverrides = {};
    }
    persist();
    renderAll();
    if (announce && changed) {
      showToast(`Loaded ${WEEKS[nextWeek].label} Option ${nextPlan}`);
    }
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

    els.templateBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        loadTemplate(btn.dataset.week, btn.dataset.plan, true);
      });
    });

    els.weekLabel.addEventListener("change", () => {
      state.weekTitle = els.weekLabel.value.trim() || currentWeek().title;
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
      copyText(shareUrl(), "Share link copied — text it to Ted or Samantha");
    });
    els.copyGrocery.addEventListener("click", () => {
      copyText(groceryText(), "Grocery list copied for iMessage/SMS");
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
      if (els.swapModal && els.swapModal.classList.contains("open")) closeSwapPicker();
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
