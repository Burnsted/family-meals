(() => {
  "use strict";

  const STORAGE_KEY = "family-meals-state-v1";
  const CATEGORIES = ["Tucker lunchbox", "Protein", "Produce", "Dairy", "Pantry"];

  function tuckerGroceries(prefix) {
    return [
      {
        id: `${prefix}-t-yogurt`,
        category: "Tucker lunchbox",
        name: "Yogurt cups ×5+ (Chobani multipack)",
        price: "",
        hint: "Count packs Sun night; restock midweek if depleting",
      },
      {
        id: `${prefix}-t-cheese`,
        category: "Tucker lunchbox",
        name: "Cheese sticks ×5+ (Polly-O / Cheese Heads)",
        price: "",
        hint: "Buy if not enough for 5 school days",
      },
      {
        id: `${prefix}-t-pretzels`,
        category: "Tucker lunchbox",
        name: "Pretzels and/or Pringles (if low)",
        price: "",
        hint: "Portion for 5 days; restock midweek",
      },
      {
        id: `${prefix}-t-fruit-snack`,
        category: "Tucker lunchbox",
        name: "Fruit snacks ×5+",
        price: "",
        hint: "Restock midweek as packs deplete",
      },
      {
        id: `${prefix}-t-beef-stick`,
        category: "Tucker lunchbox",
        name: "Natural beef sticks (red/white pack) ×5+",
        price: "",
        hint: "Likely need — buy ahead for the week",
      },
      {
        id: `${prefix}-t-juice`,
        category: "Tucker lunchbox",
        name: "Apple juice boxes if Apple & Eve running low",
        price: "",
        hint: "Top up for 5 school days",
      },
    ];
  }

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
            { id: "w1a-rotisserie", category: "Protein", name: "Rotisserie", price: "", hint: "" },
            { id: "w1a-chicken", category: "Protein", name: "Chicken breasts ~2 lb (Alfredo)", price: "", hint: "" },
            { id: "w1a-beef", category: "Protein", name: "Ground beef ~1–1.5 lb (chili +/or tacos)", price: "", hint: "" },
            { id: "w1a-salmon", category: "Protein", name: "Salmon fillets (Fri — Samantha)", price: "", hint: "Ted skips fish — leftover sub that night" },
            { id: "w1a-sausage", category: "Protein", name: "Breakfast sausage (Sun)", price: "", hint: "" },
            { id: "w1a-eggs", category: "Protein", name: "Eggs (if low)", price: "", hint: "" },
            { id: "w1a-potatoes", category: "Produce", name: "Potatoes / rice sides", price: "", hint: "" },
            { id: "w1a-onion", category: "Produce", name: "Onion", price: "", hint: "" },
            { id: "w1a-salad", category: "Produce", name: "Salad / veg", price: "", hint: "" },
            { id: "w1a-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w1a-cheese", category: "Dairy", name: "Taco cheese if low", price: "", hint: "Skip if stocked" },
            { id: "w1a-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "" },
            { id: "w1a-tortillas", category: "Pantry", name: "Tortillas / salsa if low", price: "", hint: "Skip if stocked" },
            { id: "w1a-alfredo", category: "Pantry", name: "Alfredo + pasta if low", price: "", hint: "Often already stocked — skip" },
            { id: "w1a-chili-cans", category: "Pantry", name: "Chili beans/tomatoes if pantry empty", price: "", hint: "Weekend chili only this plan" },
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
            { id: "w1b-chicken", category: "Protein", name: "Chicken breasts (enough Mon + Wed)", price: "", hint: "" },
            { id: "w1b-tilapia", category: "Protein", name: "Tilapia (Thu — Samantha)", price: "", hint: "Ted skips fish — leftover chicken/quesadilla" },
            { id: "w1b-rotisserie", category: "Protein", name: "Rotisserie if no leftover chicken (Fri)", price: "", hint: "" },
            { id: "w1b-beef", category: "Protein", name: "Burger beef (Sat)", price: "", hint: "Skip chili ingredients this week" },
            { id: "w1b-sausage", category: "Protein", name: "Breakfast sausage (Sun)", price: "", hint: "" },
            { id: "w1b-eggs", category: "Protein", name: "Eggs (if low)", price: "", hint: "" },
            { id: "w1b-potatoes", category: "Produce", name: "Potatoes", price: "", hint: "" },
            { id: "w1b-peppers", category: "Produce", name: "Peppers", price: "", hint: "" },
            { id: "w1b-salad", category: "Produce", name: "Salad refresh", price: "", hint: "" },
            { id: "w1b-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w1b-cheese", category: "Dairy", name: "Cheese for quesadillas if low", price: "", hint: "" },
            { id: "w1b-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "" },
            { id: "w1b-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Skip if stocked" },
            { id: "w1b-tortillas", category: "Pantry", name: "Tortillas if low", price: "", hint: "" },
            { id: "w1b-buns", category: "Pantry", name: "Burger buns (optional)", price: "", hint: "" },
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
            { id: "w2a-chicken", category: "Protein", name: "Chicken breasts", price: "", hint: "" },
            { id: "w2a-beef", category: "Protein", name: "Taco beef/chicken if needed", price: "", hint: "" },
            { id: "w2a-salmon", category: "Protein", name: "Salmon (Fri — Samantha)", price: "", hint: "Ted = Alfredo leftover" },
            { id: "w2a-sausage", category: "Protein", name: "Sausage (Sat sheet-pan)", price: "", hint: "" },
            { id: "w2a-potatoes", category: "Produce", name: "Potatoes (Mon + Sun bar)", price: "", hint: "" },
            { id: "w2a-broccoli", category: "Produce", name: "Broccoli", price: "", hint: "" },
            { id: "w2a-peppers", category: "Produce", name: "Peppers (Sat)", price: "", hint: "" },
            { id: "w2a-salad", category: "Produce", name: "Salad if needed", price: "", hint: "" },
            { id: "w2a-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w2a-cheese", category: "Dairy", name: "Cheese if low", price: "", hint: "" },
            { id: "w2a-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "" },
            { id: "w2a-tortillas", category: "Pantry", name: "Tortillas if low", price: "", hint: "" },
            { id: "w2a-alfredo", category: "Pantry", name: "Alfredo + pasta if low", price: "", hint: "Skip if stocked" },
            { id: "w2a-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "Skip chili ingredients this week" },
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
            { id: "w2b-chicken", category: "Protein", name: "Chicken (Mon/Thu pasta)", price: "", hint: "" },
            { id: "w2b-tilapia", category: "Protein", name: "Tilapia (Wed — Samantha)", price: "", hint: "Ted = leftover chicken/quesadilla" },
            { id: "w2b-rotisserie", category: "Protein", name: "Rotisserie (Fri)", price: "", hint: "" },
            { id: "w2b-beef", category: "Protein", name: "Chili beef (Sat weekend pot)", price: "", hint: "Weekend chili only — not midweek" },
            { id: "w2b-sausage", category: "Protein", name: "Breakfast sausage (Sun)", price: "", hint: "" },
            { id: "w2b-eggs", category: "Protein", name: "Eggs (if low)", price: "", hint: "" },
            { id: "w2b-salad", category: "Produce", name: "Salad", price: "", hint: "" },
            { id: "w2b-veg", category: "Produce", name: "Veg for fish night / sides", price: "", hint: "" },
            { id: "w2b-onion", category: "Produce", name: "Onion (chili)", price: "", hint: "" },
            { id: "w2b-fruit", category: "Produce", name: "Fruit for adults/snacks", price: "", hint: "" },
            { id: "w2b-cheese", category: "Dairy", name: "Cheese if low", price: "", hint: "" },
            { id: "w2b-milk", category: "Dairy", name: "Milk top-up if needed", price: "", hint: "" },
            { id: "w2b-alfredo", category: "Pantry", name: "Alfredo if doing Thu pasta", price: "", hint: "" },
            { id: "w2b-rice", category: "Pantry", name: "Rice if pantry thin", price: "", hint: "" },
            { id: "w2b-chili-cans", category: "Pantry", name: "Chili beans/tomatoes if pantry empty", price: "", hint: "Sat daytime chili only" },
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
    custom: [],
  });

  let state = defaultState();

  const els = {
    weekLabel: document.getElementById("week-label"),
    budgetBand: document.getElementById("budget-band"),
    houseNote: document.getElementById("house-note"),
    week1: document.getElementById("week-1"),
    week2: document.getElementById("week-2"),
    planA: document.getElementById("plan-a"),
    planB: document.getElementById("plan-b"),
    planABlurb: document.getElementById("plan-a-blurb"),
    planBBlurb: document.getElementById("plan-b-blurb"),
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

  function currentWeek() {
    return WEEKS[state.week] || WEEKS["1"];
  }

  function currentPlan() {
    const week = currentWeek();
    return week.plans[state.plan] || week.plans.A;
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
    } catch (_) {}
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
    base.week = parsed.week === "2" || parsed.week === 2 ? "2" : "1";
    base.plan = parsed.plan === "B" ? "B" : "A";
    if (typeof parsed.weekTitle === "string" && parsed.weekTitle.trim()) {
      base.weekTitle = parsed.weekTitle.trim().slice(0, 80);
    } else {
      base.weekTitle = WEEKS[base.week].title;
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
      wk: state.week,
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
      next.week = payload.wk === "2" || payload.wk === 2 ? "2" : "1";
      next.plan = payload.p === "B" ? "B" : "A";
      if (typeof payload.w === "string" && payload.w.trim()) {
        next.weekTitle = payload.w.trim().slice(0, 80);
      } else {
        next.weekTitle = WEEKS[next.week].title;
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

  function renderToggles() {
    const week = currentWeek();
    const plan = currentPlan();
    const isWeek1 = state.week === "1";
    const isA = state.plan === "A";

    els.week1.setAttribute("aria-pressed", String(isWeek1));
    els.week2.setAttribute("aria-pressed", String(!isWeek1));
    els.planA.setAttribute("aria-pressed", String(isA));
    els.planB.setAttribute("aria-pressed", String(!isA));
    els.planABlurb.textContent = week.plans.A.blurb;
    els.planBBlurb.textContent = week.plans.B.blurb;
    els.budgetBand.textContent = `Budget band ${plan.budget}`;
    if (els.houseNote) {
      els.houseNote.textContent = plan.houseNote || "";
      els.houseNote.hidden = !plan.houseNote;
    }
  }

  function renderCalendar() {
    const plan = currentPlan();
    els.weekGrid.innerHTML = "";
    plan.days.forEach((day) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-card" + (day.tedNote ? " day-card-fish" : "");
      btn.setAttribute("aria-label", `${day.day}: ${day.dinner}. Tap for recipe.`);
      const adultLine =
        day.adultLunch && day.adultLunch !== "—" && !/adult lunch → —/.test(day.adultLunch)
          ? `<p class="day-lunch">${escapeHtml(day.adultLunch)}</p>`
          : `<p class="day-lunch day-lunch-muted">adult lunch → —</p>`;
      const tedLine = day.tedNote
        ? `<p class="day-ted">${escapeHtml(day.tedNote)}</p>`
        : "";
      btn.innerHTML = `
        <div class="day-head">
          <span>${day.short}</span>
          <span class="emoji" aria-hidden="true">${day.icon}</span>
        </div>
        <div class="day-body">
          <span class="meal-emoji" aria-hidden="true">${day.mealEmoji}</span>
          <p class="day-dinner">${escapeHtml(day.dinner)}</p>
          ${tedLine}
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
        li.querySelector("input").addEventListener("change", (e) => {
          setChecked(item.id, e.target.checked);
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
    const lines = [
      `Burns Family grocery — ${state.weekTitle} (${week.label} · ${plan.label})`,
      `Budget band ${plan.budget}`,
      plan.houseNote || "",
      "Tucker lunchbox = yogurt + cheese stick + pretzels/Pringles + fruit snack + beef stick + apple juice",
      "Restock midweek as packs deplete. Tucker does NOT eat dinner leftovers for school lunch.",
      "Chili = weekend daytime only when on the plan (not midweek, not twice, not every week).",
      "",
    ].filter(Boolean);
    CATEGORIES.forEach((cat) => {
      const items = allGroceryItems().filter((i) => i.category === cat);
      if (!items.length) return;
      lines.push(cat.toUpperCase());
      items.forEach((item) => {
        const mark = itemChecked(item.id) ? "[x]" : "[ ]";
        const hint = item.hint ? ` (${item.hint})` : "";
        lines.push(`${mark} ${item.name}${hint}`);
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
    renderToggles();
    renderCalendar();
    renderGrocery();
  }

  function setWeek(weekId) {
    const next = weekId === "2" ? "2" : "1";
    state.week = next;
    state.weekTitle = WEEKS[next].title;
    persist();
    renderAll();
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

    els.week1.addEventListener("click", () => setWeek("1"));
    els.week2.addEventListener("click", () => setWeek("2"));
    els.planA.addEventListener("click", () => setPlan("A"));
    els.planB.addEventListener("click", () => setPlan("B"));

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
      state.custom.push({
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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
