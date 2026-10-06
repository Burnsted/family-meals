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
    weekEdits: {},
    budget: { on: true, amt: null, days: 7 },
    store: "best",
    ratings: {},
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
    budgetCompare: document.getElementById("budget-compare"),
    calBtn: document.getElementById("cal-btn"),
    rcptBtn: document.getElementById("rcpt-btn"),
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

  function dayOverride(dayId, map) {
    const ov = (map || state.dayOverrides)[dayId];
    return ov && typeof ov === "object" ? ov : null;
  }

  function effectiveDay(templateDay, map) {
    const ov = dayOverride(templateDay.id, map);
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

/* ---- shared v3 helpers: sheet, week calendar, long-press, photo share ---- */
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
  /* Week calendar. opts: sel (Monday Date or null), onPick(monday, keepOpen) */
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
          return `<button class="cal-d${d.getMonth()!==view.getMonth()?" out":""}${sameDay(d,today)?" today":""}" data-day="${d.getFullYear()}-${d.getMonth()}-${d.getDate()}" aria-label="${MOFULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}${sameDay(d,today)?" (today)":""}">${d.getDate()}</button>`}).join("")}</div>`).join("")}
        <div class="cal-foot"><button data-cw="-1">‹ Prev week</button><button class="now" data-now="1">This week</button><button data-cw="1">Next week ›</button></div>`;
      inn.querySelectorAll("[data-cm]").forEach(b=>b.onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+(+b.dataset.cm),1);draw()});
      inn.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{const [y,m,d]=b.dataset.day.split("-").map(Number);sel=mondayOf(new Date(y,m,d));opts.onPick(sel);closeSheet()});
      inn.querySelectorAll("[data-cw]").forEach(b=>b.onclick=()=>{sel=addDays(sel||mondayOf(today),7*(+b.dataset.cw));view=new Date(sel.getFullYear(),sel.getMonth(),1);opts.onPick(sel,true);draw()});
      inn.querySelector("[data-now]").onclick=()=>{sel=mondayOf(today);opts.onPick(sel);closeSheet()};
    }
    draw();
  }
  /* Long-press (~500ms). Short tap keeps normal click. Cancels if finger moves. */
  function longPress(el,fn,ms){ms=ms||500;let t=null,x=0,y=0,fired=false;
    el.classList.add("lp");
    el.addEventListener("pointerdown",e=>{if(e.button>0)return;fired=false;x=e.clientX;y=e.clientY;clearTimeout(t);t=setTimeout(()=>{t=null;fired=true;try{navigator.vibrate&&navigator.vibrate(15)}catch(_){}fn()},ms)});
    const cancel=()=>{clearTimeout(t);t=null};
    el.addEventListener("pointermove",e=>{if(t&&Math.hypot(e.clientX-x,e.clientY-y)>10)cancel()});
    ["pointerup","pointerleave","pointercancel"].forEach(ev=>el.addEventListener(ev,cancel));
    el.addEventListener("contextmenu",e=>e.preventDefault());
    el.addEventListener("click",e=>{if(fired){e.preventDefault();e.stopImmediatePropagation();fired=false}},true)}
  /* Photo picker + Web Share. Nothing is uploaded anywhere. */
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
    return "est. · checked "+md(e.checked||"2026-10-05")}
  function isStale(e){if(!e||!e.checked)return false;const d=new Date(e.checked+"T12:00:00");return !isNaN(d)&&(Date.now()-d.getTime())>60*864e5}
  function fmtDateLong(s){const d=new Date(s+"T12:00:00");return isNaN(d)?s:`${MO3[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`}
  
  const FAM_PRICES = {"rotisserie": {"n": "Rotisserie chicken", "q": "1 whole", "a": 4.99, "p": 7.99, "note": "Publix deli price varies; Aldi when stocked"}, "chicken": {"n": "Chicken breasts, boneless skinless", "q": "~2.5 lb", "a": 5.73, "p": 13.83, "note": "Aldi ~$2.29/lb · Publix ~$5.53/lb (St. Pete listings, Oct 2026)"}, "beef": {"n": "Ground beef 80/20", "q": "~1.5 lb", "a": 7.94, "p": 13.28, "note": "Aldi ~$5.29/lb · Publix ~$8.85/lb (listings, Oct 2026)"}, "salmon": {"n": "Salmon fillets", "q": "~1 lb", "a": 9.99, "p": 12.99}, "tilapia": {"n": "Tilapia fillets", "q": "~1 lb", "a": 4.99, "p": 7.99}, "sausage": {"n": "Sausage (breakfast or smoked)", "q": "1 pack", "a": 2.79, "p": 4.99}, "eggs": {"n": "Large eggs", "q": "1 dozen", "a": 1.85, "p": 2.19, "note": "Aldi Goldhen · Publix 12 ct (listings, Oct 2026)"}, "potatoes": {"n": "Potatoes", "q": "5 lb bag", "a": 2.99, "p": 4.99}, "onion": {"n": "Yellow onions", "q": "3 lb bag", "a": 2.49, "p": 3.99}, "salad": {"n": "Salad bag", "q": "1 bag", "a": 1.99, "p": 3.49}, "fruit": {"n": "Fruit (bananas + apples)", "q": "~6 bananas + 3 lb apples", "a": 4.99, "p": 6.99}, "peppers": {"n": "Bell peppers", "q": "3 pk", "a": 2.99, "p": 4.49}, "broccoli": {"n": "Broccoli crowns", "q": "~1 lb", "a": 1.79, "p": 2.99}, "veg": {"n": "Veg for sides", "q": "1 bag / bunch", "a": 1.99, "p": 2.99}, "cheese": {"n": "Shredded cheese", "q": "8 oz", "a": 2.29, "p": 3.49}, "milk": {"n": "Milk", "q": "1 gallon", "a": 3.09, "p": 4.69}, "tortillas": {"n": "Flour tortillas", "q": "10 ct", "a": 1.99, "p": 3.29}, "alfredo": {"n": "Alfredo sauce + pasta", "q": "1 jar + 1 lb box", "a": 2.94, "p": 5.08}, "chili-cans": {"n": "Chili beans + diced tomatoes", "q": "2 + 2 cans", "a": 3.2, "p": 5.36}, "rice": {"n": "Long grain rice", "q": "2 lb bag", "a": 1.79, "p": 2.49}, "buns": {"n": "Hamburger buns", "q": "8 ct", "a": 1.55, "p": 4.41, "note": "Aldi L'oven Fresh · Publix Bakery (listings, Oct 2026)"}, "t-yogurt": {"n": "Chobani yogurt cups", "q": "multipack", "a": null, "p": 6.99, "brand": "Chobani", "al": 3.3, "note": "Aldi look-alike yogurt ~$3.30"}, "t-cheese": {"n": "Polly-O string cheese", "q": "12 ct", "a": null, "p": 5.99, "brand": "Polly-O", "al": 2.89, "note": "Aldi look-alike string cheese ~$2.89"}, "t-pretzels": {"n": "Pretzels / Pringles", "q": "1 bag or can", "a": 1.49, "p": 2.79}, "t-fruit-snack": {"n": "Fruit snacks", "q": "10 ct box", "a": 1.99, "p": 3.49}, "t-beef-stick": {"n": "Natural beef sticks", "q": "multipack", "a": 3.49, "p": 5.99}, "t-juice": {"n": "Apple & Eve apple juice boxes", "q": "8 pk", "a": null, "p": 3.99, "brand": "Apple & Eve", "al": 1.99, "note": "Aldi look-alike juice boxes ~$1.99"}};

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
  const PRICE_META = { updated: "2026-10-05", loaded: false };
  const LIVE_PRICES = {};
  Object.keys(FAM_PRICES).forEach((k) => {
    LIVE_PRICES[k] = { ...FAM_PRICES[k], sA: { source: "estimate", checked: "2026-10-05" }, sP: { source: "estimate", checked: "2026-10-05" } };
  });
  function loadPricesJson() {
    if (!window.fetch) return;
    fetch("prices.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        if (!j || !j.items) return;
        Object.keys(j.items).forEach((key) => {
          if (key.indexOf("fam-") !== 0) return;
          const k = key.slice(4);
          const it = j.items[key];
          const P = LIVE_PRICES[k] || (LIVE_PRICES[k] = { n: it.name, q: it.size || "", a: null, p: null });
          if (it.size) P.q = it.size;
          if (it.brand) { P.brand = it.brand; P.al = it.aldi_lookalike ?? null; }
          (it.prices || []).forEach((e) => {
            if (e.store === "aldi-vero" && e.price !== undefined) { P.a = e.price; P.sA = e; }
            if (e.store === "publix-vero" && e.price !== undefined) { P.p = e.price; P.sP = e; }
          });
        });
        if (j.updated) PRICE_META.updated = j.updated;
        PRICE_META.loaded = true;
        renderGrocery();
      })
      .catch(() => {});
  }
  function priceKeyFor(item) {
    if (!item || item.custom) return null;
    return String(item.id).replace(/^swap-[a-z]+-/, "").replace(/^w\d[ab]?-/, "");
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
    const aTxt = sp.a != null ? `Aldi est. ${formatMoney2(sp.a)}` : sp.al != null ? `Aldi n/a (look-alike est. ${formatMoney2(sp.al)})` : "Aldi n/a";
    const pTxt = sp.p != null ? `Publix est. ${formatMoney2(sp.p)}` : "Publix n/a";
    const la = srcLabel(sp.sA), lp = srcLabel(sp.sP);
    return `<div class="pr">${sp.q ? `<span class="qty-l">${escapeHtml(sp.q)}</span>` : ""}<span class="${aw ? "win" : ""}${isStale(sp.sA) ? " stale" : ""}">${escapeHtml(aTxt)}</span><span class="${pw ? "win" : ""}${isStale(sp.sP) ? " stale" : ""}">${escapeHtml(pTxt)}</span>${aw || pw ? `<span class="win">${aw ? "Aldi" : "Publix"} cheaper</span>` : ""}<span class="src-l">${escapeHtml(la === lp ? la : `Aldi ${la} · Publix ${lp}`)}</span></div>`;
  }
  function storePriceText(item) {
    const sp = storePriceFor(item);
    if (!sp) return "";
    const a = sp.a != null ? `Aldi est. ${formatMoney2(sp.a)}` : sp.al != null ? `Aldi look-alike est. ${formatMoney2(sp.al)}` : "Aldi n/a";
    const p = sp.p != null ? `Publix est. ${formatMoney2(sp.p)}` : "Publix n/a";
    return `${a} / ${p}`;
  }
  /* budget */
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
  function renderBudgetCompare(tots) {
    const el = els.budgetCompare;
    if (!el) return;
    const b = state.budget;
    if (!b.on || b.amt == null) { el.hidden = true; return; }
    const days = currentPlan().days.length || 7;
    const scaled = (b.amt * days) / b.days;
    const total = state.store === "aldi" ? tots.a : state.store === "publix" ? tots.p : tots.b;
    const lab = state.store === "aldi" ? "All Aldi" : state.store === "publix" ? "All Publix" : "Best split";
    const diff = scaled - total;
    el.hidden = false;
    el.className = `bcmp ${diff >= 0 ? "under" : "over"}`;
    el.innerHTML = `${diff >= 0 ? `✓ Under budget by ${formatMoney2(diff)}` : `✗ Over budget by ${formatMoney2(-diff)}`}<small>${lab} est. ${formatMoney2(total)} vs your ${formatMoney2(scaled)} for ${days} days (${formatMoney(b.amt)} / ${b.days} days)</small>`;
  }
  function openBudgetEditor() {
    const b = state.budget;
    const inn = openSheet(shTop("💵 Budget") + `
      <div class="sw" role="switch" tabindex="0" aria-checked="${b.on}" id="bSw"><span>Budget ${b.on ? "on" : "off"}<br><small style="font-weight:650">Off = no budget shown or compared</small></span><span class="tg"></span></div>
      <label class="fld" for="bAmt">Budget amount ($)</label><input class="inp" id="bAmt" type="text" inputmode="decimal" autocomplete="off" placeholder="e.g. 120" value="${b.amt == null ? "" : b.amt}">
      <label class="fld" for="bDays">How many days it covers</label><input class="inp" id="bDays" type="number" inputmode="numeric" min="1" max="366" value="${b.days}">
      <div class="dchips">${[3, 5, 7, 14].map((n) => `<button type="button" data-dd="${n}" class="${b.days === n ? "on" : ""}">${n} days</button>`).join("")}</div>
      <div class="sh-row2"><button type="button" class="sh-btn" id="bClr">Back to default band</button><button type="button" class="sh-btn p" id="bSave">Save</button></div>
      <p class="muted2">Compared with the grocery total (Best split unless you tap another store total), scaled to the 7-day plan: e.g. $120 / 14 days = $60 for 7 days. Saved on this phone and in the share link.</p>`, "Budget");
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
  /* per-week edits (long-press customizer) */
  function normalizeWeekEdits(src) {
    const out = {};
    if (!src || typeof src !== "object" || Array.isArray(src)) return out;
    Object.keys(src).forEach((key) => {
      if (!/^[12][AB]$/.test(key)) return;
      const m = normalizeDayOverrides(src[key]);
      if (Object.keys(m).length) out[key] = m;
    });
    return out;
  }
  function linkWeekEdits(st) {
    if (!st.weekEdits || typeof st.weekEdits !== "object") st.weekEdits = {};
    const key = `${st.week}${st.plan}`;
    if (!st.weekEdits[key]) st.weekEdits[key] = st.dayOverrides && Object.keys(st.dayOverrides).length ? st.dayOverrides : {};
    st.dayOverrides = st.weekEdits[key];
  }
  function compactOverrides(map) {
    const acc = {};
    Object.keys(map || {}).forEach((dayId) => {
      const ov = map[dayId];
      if (!ov) return;
      if (ov.type === "leftovers") acc[dayId] = { t: "l" };
      else if (ov.type === "eatout") acc[dayId] = { t: "e" };
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
        linkWeekEdits(state);
        persist(); closeSheet(); renderAll();
        showToast(`${week.label} ${planId} back to the template`);
      });
      inn.querySelector("#czS").addEventListener("click", () => {
        norm();
        state.weekEdits[key] = draft;
        if (key === `${state.week}${state.plan}`) state.dayOverrides = draft;
        persist(); closeSheet(); renderAll();
        showToast(key === `${state.week}${state.plan}` ? "Week saved — groceries updated" : `Saved ${week.label} ${planId} edits — tap that card to load it`);
      });
    };
    draw();
  }
  /* prep / cook badge beside the big emoji */
  function prepCookFor(day) {
    if (day.overrideType === "eatout") return null;
    if (day.overrideType === "leftovers") return [2, 5, true];
    const d = String(day.dinner || "").toLowerCase();
    const rules = [
      [/potato bar/, 10, 45], [/rotisserie/, 5, 10], [/taco rebuild/, 10, 10], [/taco/, 10, 15],
      [/alfredo|pasta bake/, 10, 25], [/salmon/, 5, 15], [/tilapia/, 5, 12], [/chili/, 15, 60],
      [/breakfast-for-dinner/, 5, 15], [/sheet-pan/, 15, 35], [/quesadilla/, 10, 10],
      [/oven chicken/, 10, 30], [/burger/, 10, 12],
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
  /* ratings: 👎 tried it, no · 👍 good · 👍👍 favorite (keyed by dinner name) */
  function rateKey(name) {
    return String(name || "").trim().toLowerCase().slice(0, 80);
  }
  function normalizeRatings(src) {
    const out = {};
    if (!src || typeof src !== "object" || Array.isArray(src)) return out;
    Object.keys(src).forEach((k) => {
      const v = src[k];
      const r = Number(v && v.r);
      if (r === -1 || r === 1 || r === 2) out[rateKey(k)] = { r, d: typeof v.d === "string" ? v.d.slice(0, 10) : "", n: typeof v.n === "string" ? v.n.slice(0, 80) : k };
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
  function setRating(name, r) {
    const k = rateKey(name);
    if (!state.ratings) state.ratings = {};
    if (!r || (state.ratings[k] && state.ratings[k].r === r)) delete state.ratings[k];
    else {
      const t = new Date();
      state.ratings[k] = { r, d: `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`, n: String(name).slice(0, 80) };
    }
    persist();
    renderAll();
  }
  function rateRowHTML(name) {
    const r = ratingOf(name);
    return `<div class="rate-row" role="group" aria-label="Rate this dinner after you make it"><span>Made it? Rate it:</span>
      <button type="button" data-rate="-1" aria-pressed="${r === -1}" title="Tried it, no">👎</button>
      <button type="button" data-rate="1" aria-pressed="${r === 1}" title="Good">👍</button>
      <button type="button" data-rate="2" aria-pressed="${r === 2}" title="Favorite">👍👍</button></div>`;
  }
  function bindRateRow(root, name) {
    root.querySelectorAll("[data-rate]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const r = Number(b.dataset.rate);
      setRating(name, r);
      showToast(ratingOf(name) === 0 ? "Rating cleared" : r === -1 ? "👎 Hidden from Swap picks (restore in My ratings)" : r === 2 ? "⭐ Favorite — suggested first" : "👍 Saved");
    }));
  }
  function renderRatings() {
    const box = document.getElementById("my-ratings");
    if (!box) return;
    const all = Object.keys(state.ratings || {}).map((k) => ({ k, ...state.ratings[k] }));
    const grp = (r) => all.filter((x) => x.r === r).sort((a, b) => (b.d || "").localeCompare(a.d || ""));
    const row = (x, restore) => `<li><span>${escapeHtml(x.n || x.k)}</span><small>${x.d ? escapeHtml(x.d) : ""}</small>${restore ? `<button type="button" class="chip-btn" data-restore="${escapeAttr(x.k)}">Restore</button>` : `<button type="button" class="chip-btn" data-clear="${escapeAttr(x.k)}">Clear</button>`}</li>`;
    const fav = grp(2), good = grp(1), down = grp(-1);
    box.innerHTML = all.length
      ? `${fav.length ? `<h3>⭐ Favorites (👍👍)</h3><ul>${fav.map((x) => row(x)).join("")}</ul>` : ""}
         ${good.length ? `<h3>👍 Good</h3><ul>${good.map((x) => row(x)).join("")}</ul>` : ""}
         ${down.length ? `<h3>👎 Removed meals</h3><p class="muted2" style="margin-top:0">Hidden from Swap picks and suggestions. Tap Restore to bring one back.</p><ul>${down.map((x) => row(x, true)).join("")}</ul>` : ""}`
      : `<p class="muted2">No ratings yet. After you make a dinner, tap 👎 / 👍 / 👍👍 on its day card.</p>`;
    box.querySelectorAll("[data-restore],[data-clear]").forEach((b) => b.addEventListener("click", () => {
      delete state.ratings[b.dataset.restore || b.dataset.clear];
      persist();
      renderAll();
      showToast(b.dataset.restore ? "Restored to Swap picks" : "Rating cleared");
    }));
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
    base.weekEdits = normalizeWeekEdits(parsed.weekEdits);
    base.budget = normalizeBudget(parsed.budget);
    base.store = normalizeStore(parsed.store);
    base.ratings = normalizeRatings(parsed.ratings);
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
      we: Object.keys(state.weekEdits || {}).reduce((acc, key) => {
        const c = compactOverrides(state.weekEdits[key]);
        if (Object.keys(c).length) acc[key] = c;
        return acc;
      }, {}),
      bg: state.budget && (state.budget.amt != null || !state.budget.on || state.budget.days !== 7)
        ? [state.budget.on ? 1 : 0, state.budget.amt, state.budget.days]
        : undefined,
      st: state.store !== "best" ? state.store : undefined,
      rt: Object.keys(state.ratings || {}).length
        ? Object.keys(state.ratings).reduce((acc, k) => { acc[k] = [state.ratings[k].r, state.ratings[k].d]; return acc; }, {})
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
      next.weekEdits = normalizeWeekEdits(payload.we);
      if (Array.isArray(payload.bg)) {
        next.budget = normalizeBudget({ on: payload.bg[0] !== 0, amt: payload.bg[1], days: payload.bg[2] });
      }
      next.store = normalizeStore(payload.st);
      if (payload.rt && typeof payload.rt === "object") {
        const r = {};
        Object.keys(payload.rt).forEach((k) => {
          const v = payload.rt[k];
          if (Array.isArray(v)) r[k] = { r: v[0], d: v[1] };
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
    const bud = state.budget || { on: true, amt: null, days: 7 };
    els.budgetBand.textContent = !bud.on
      ? "Budget off"
      : bud.amt == null
        ? `Budget band ${plan.budget}`
        : `Budget ${formatMoney(bud.amt)} / ${bud.days} day${bud.days === 1 ? "" : "s"}`;
    els.budgetBand.classList.toggle("is-off", !bud.on);
    els.budgetBand.classList.toggle("is-set", bud.on && bud.amt != null);
    els.templateBtns.forEach((btn) => {
      const key = `${btn.dataset.week}${btn.dataset.plan}`;
      const n = Object.keys((state.weekEdits || {})[key] || {}).length;
      let badge = btn.querySelector(".edited-badge");
      if (n && !badge) {
        badge = document.createElement("span");
        badge.className = "edited-badge";
        badge.textContent = "edited";
        btn.appendChild(badge);
      } else if (!n && badge) badge.remove();
    });
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
          <span class="emo-row"><span class="meal-emoji" aria-hidden="true">${day.mealEmoji}</span>${prepCookBadge(day)}</span>
          <p class="day-dinner">${isFav(day.dinner) ? '<span class="fav-badge">⭐ favorite</span> ' : ""}${escapeHtml(day.dinner)}</p>
          ${swapBadge}
          ${tedLine}
          ${adultLine}
          <p class="tap-hint">Day note · tap for recipe</p>
        </button>
        ${day.overrideType === "eatout" ? "" : rateRowHTML(day.dinner)}
      `;
      card.querySelector(".day-body-btn").addEventListener("click", () => openRecipe(day));
      bindRateRow(card, day.dinner);
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
    const dinners = sortBySuggest(allTemplateDinners().filter((d) => {
      // Skip the night already on this template day (same week/plan/day); hide 👎 meals
      return !(d.weekId === state.week && d.planId === state.plan && d.day.id === dayId) && !isDown(d.day.dinner);
    }));
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
    if (!els.estimateBand) return;
    const t = storeTotals(items);
    const left = state.store === "aldi" ? t.aLeft : state.store === "publix" ? t.pLeft : t.bLeft;
    const lab = state.store === "aldi" ? "All Aldi" : state.store === "publix" ? "All Publix" : "Best split";
    els.estimateBand.textContent = `Est. left ${formatMoney2(left)}`;
    els.estimateBand.title = `${lab} estimate for unchecked lines (Have-it lines excluded)`;
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

    const tots = storeTotals(items.filter((i) => !itemHaveIt(i.id)));
    const totalBar = document.createElement("div");
    totalBar.className = "store-totals";
    const col = (id, label, val, left) =>
      `<button type="button" class="${id === "best" ? "best" : ""}" data-store="${id}" aria-pressed="${state.store === id}">${state.store === id ? "⭐ " : ""}${label}<b>${formatMoney2(val)}</b><small>est. · ${formatMoney2(left)} left</small></button>`;
    totalBar.innerHTML = `
      <div class="tot" role="group" aria-label="Which store total to use">
        ${col("aldi", "All Aldi", tots.a, tots.aLeft)}${col("publix", "All Publix", tots.p, tots.pLeft)}${col("best", "Best split", tots.b, tots.bLeft)}
      </div>
      <p class="pchk">Prices last checked ${escapeHtml(fmtDateLong(PRICE_META.updated))}${PRICE_META.loaded ? "" : " (built-in estimates)"} · tap a total to use it · grey = older than 60 days</p>
      <p class="gnote">Best split = Aldi for ${tots.na} item${tots.na === 1 ? "" : "s"}, Publix for ${tots.np} (exact name brands like Chobani, Polly-O, Apple &amp; Eve that Aldi doesn’t carry). All Aldi swaps in Aldi look-alikes, so Best split can come out higher than All Aldi.${tots.cu ? ` ${tots.cu} custom item${tots.cu > 1 ? "s" : ""} without a price (add your $).` : ""}${tots.own ? ` ${tots.own} line${tots.own > 1 ? "s" : ""} use your own $.` : ""}</p>
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
    foot.innerHTML = `All prices are <b>estimates</b> for Vero Beach / Treasure Coast-area Aldi &amp; Publix as of Oct 2026 (from prices.json when it loads). Check in store; sales and BOGOs change weekly. A few per-lb numbers started from the stores’ online listings (Instacart-powered, can differ from the shelf).
      <details style="margin-top:4px"><summary>Price sources</summary>${PRICE_SOURCES.map(([l, u]) => `<a href="${escapeAttr(u)}" target="_blank" rel="noopener">${escapeHtml(l)}</a>`).join("<br>")}</details>`;
    els.groceryList.appendChild(foot);

    void checkedVisible;
    renderGroceryControls(items);
    renderEstimate(items.filter((i) => !itemHaveIt(i.id)));
    renderBudgetCompare(tots);
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
      budgetLine(plan),
      (() => {
        const t = storeTotals(items);
        return `Est. totals: All Aldi ${formatMoney2(t.a)} · All Publix ${formatMoney2(t.p)} · Best split ${formatMoney2(t.b)} (Vero-area estimates, Oct 2026)`;
      })(),
      totals.pricedAll ? `Your own $ entered: ${formatMoney(totals.all)} on ${totals.pricedAll} line(s)` : "",
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

  function renderAll() {
    els.weekLabel.value = state.weekTitle;
    renderTemplates();
    renderCalendar();
    renderGrocery();
    renderRatings();
  }

  function loadTemplate(weekId, planId, announce) {
    const nextWeek = weekId === "2" ? "2" : "1";
    const nextPlan = planId === "B" ? "B" : "A";
    const changed = state.week !== nextWeek || state.plan !== nextPlan;
    state.week = nextWeek;
    state.plan = nextPlan;
    state.weekTitle = WEEKS[nextWeek].title;
    if (changed) {
      linkWeekEdits(state);
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
    } else if (fromStorage) {
      state = fromStorage;
    } else {
      state = defaultState();
    }
    linkWeekEdits(state);
    // Migrate legacy localStorage keys / normalize shape into current STORAGE_KEY.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}

    els.templateBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        loadTemplate(btn.dataset.week, btn.dataset.plan, true);
      });
    });

    initSheet();
    if (els.rcptBtn) els.rcptBtn.addEventListener("click", openReceipt);
    if (els.calBtn) {
      els.calBtn.addEventListener("click", () => {
        openCal({
          sel: parseWeekLabel(state.weekTitle),
          onPick: (mon) => {
            state.weekTitle = fmtWeek(mon);
            els.weekLabel.value = state.weekTitle;
            persist();
            showToast(`Week set to ${state.weekTitle}`);
          },
        });
      });
    }
    els.budgetBand.addEventListener("click", openBudgetEditor);
    els.templateBtns.forEach((btn) => {
      longPress(btn, () => openWeekCustom(btn.dataset.week, btn.dataset.plan));
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
    loadPricesJson();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
