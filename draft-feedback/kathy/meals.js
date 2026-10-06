/* Kathy's Table — batch dishes for 1–2 older adults.
   Each dish: 3–4 parts, 3–5 steps, prep plan with labeled containers, quick swap, gentle seasoning. */
window.KATHY = {
STORES: ["Aldi", "Publix", "Walmart", "Target", "Winn-Dixie", "Costco", "Sam's Club"],

SKIP_FOODS: [
  "Shellfish", "Pork", "Beef", "Dairy", "Eggs", "Tomatoes", "Onions",
  "Peppers", "Mushrooms", "Beans", "Fish", "Chicken", "Turkey", "Rice", "Pasta"
],

FAVORITES: [
  { id: "roast_chix", name: "Roast chicken", emoji: "🍗" },
  { id: "meatloaf", name: "Meatloaf", emoji: "🍖" },
  { id: "pot_roast", name: "Pot roast", emoji: "🥩" },
  { id: "chili", name: "Chili", emoji: "🍲" },
  { id: "soup", name: "Chicken soup", emoji: "🥣" },
  { id: "casserole", name: "Tuna casserole", emoji: "🐟" },
  { id: "shepherd", name: "Shepherd pie", emoji: "🥧" },
  { id: "salmon", name: "Baked salmon", emoji: "🐟" },
  { id: "stir", name: "Simple stir fry", emoji: "🥦" },
  { id: "eggs", name: "Eggs and toast", emoji: "🍳" },
  { id: "pasta", name: "Pasta with sauce", emoji: "🍝" },
  { id: "salad", name: "Big salad with protein", emoji: "🥗" }
],

SHELVES: [
  { id: "pantry_top", label: "Pantry top shelf" },
  { id: "pantry_mid", label: "Pantry middle shelf" },
  { id: "pantry_low", label: "Pantry lower shelf" },
  { id: "fridge_door", label: "Fridge door" },
  { id: "fridge_top", label: "Fridge top shelf" },
  { id: "fridge_mid", label: "Fridge middle shelf" },
  { id: "fridge_draw", label: "Fridge drawers" },
  { id: "freezer", label: "Freezer" },
  { id: "counter", label: "Counter fruit and bread" }
],

STARTER_PANTRY: [
  { id: "oats", name: "Rolled oats", week: 1, aisle: "Pantry" },
  { id: "rice", name: "Brown rice", week: 1, aisle: "Pantry" },
  { id: "beans", name: "Canned white beans", week: 1, aisle: "Pantry" },
  { id: "broth", name: "Low sodium chicken broth", week: 1, aisle: "Pantry" },
  { id: "olive", name: "Olive oil", week: 1, aisle: "Pantry" },
  { id: "garlic", name: "Garlic", week: 1, aisle: "Produce" },
  { id: "lemon", name: "Lemons", week: 1, aisle: "Produce" },
  { id: "eggs", name: "Eggs", week: 1, aisle: "Dairy" },
  { id: "yogurt", name: "Plain yogurt", week: 1, aisle: "Dairy" },
  { id: "bread", name: "Whole grain bread", week: 2, aisle: "Bread" },
  { id: "tuna", name: "Canned tuna in water", week: 2, aisle: "Pantry" },
  { id: "tom_can", name: "Canned diced tomatoes", week: 2, aisle: "Pantry" },
  { id: "paprika", name: "Smoked paprika", week: 2, aisle: "Pantry" },
  { id: "oregano", name: "Dried oregano", week: 2, aisle: "Pantry" },
  { id: "frozen_veg", name: "Frozen mixed vegetables", week: 2, aisle: "Frozen" },
  { id: "chicken", name: "Chicken thighs", week: 3, aisle: "Meat" },
  { id: "turkey", name: "Ground turkey", week: 3, aisle: "Meat" },
  { id: "potatoes", name: "Baby potatoes", week: 3, aisle: "Produce" },
  { id: "carrots", name: "Carrots", week: 3, aisle: "Produce" },
  { id: "greens", name: "Bagged salad greens", week: 3, aisle: "Produce" }
],

/* At least 16 batch dishes. prepMinutes = active prep; cookMinutes = oven or simmer. */
DISHES: [
  {
    id: "lemon_chicken",
    name: "Lemon garlic oregano chicken thighs",
    emoji: "🍗",
    protein: "Chicken",
    fiber: "Carrots and potatoes with skin on",
    prepMinutes: 20,
    cookMinutes: 35,
    oven: true,
    twist: "A new twist on roast chicken: bright lemon and oregano instead of heavy gravy.",
    season: "Lemon, garlic, oregano, smoked paprika",
    parts: ["Chicken thighs", "Baby potatoes", "Carrots", "Lemon garlic oil"],
    steps: [
      "Pat the chicken dry. Toss with olive oil, minced garlic, oregano, a pinch of smoked paprika, salt, and lemon zest.",
      "Halve the baby potatoes and cut the carrots into thick sticks. Toss with a little oil and salt on the same pan.",
      "Nestle the chicken among the vegetables. Squeeze half a lemon over the top.",
      "Bake at 400 degrees for about 35 minutes until the chicken is cooked through and the potatoes are tender.",
      "Cool slightly. Portion into labeled containers as the prep plan shows."
    ],
    quickSwap: "Steam bag potatoes and baby carrots",
    grocery: [
      { name: "Chicken thighs", qty: "2 pounds", aisle: "Meat" },
      { name: "Baby potatoes", qty: "1.5 pounds", aisle: "Produce" },
      { name: "Carrots", qty: "1 pound", aisle: "Produce" },
      { name: "Lemons", qty: "2", aisle: "Produce" },
      { name: "Garlic", qty: "1 head", aisle: "Produce" },
      { name: "Olive oil", qty: "small bottle if needed", aisle: "Pantry" },
      { name: "Dried oregano", qty: "jar if needed", aisle: "Pantry" },
      { name: "Smoked paprika", qty: "jar if needed", aisle: "Pantry" }
    ],
    prepPlan: [
      { container: "A", label: "Monday dinner plate", note: "Chicken thigh, potatoes, and carrots for one meal." },
      { container: "B", label: "Pulled chicken for wraps", note: "Shredded chicken for Tuesday wrap and Thursday chicken salad." },
      { container: "C", label: "Extra potatoes and carrots", note: "Side for Wednesday lunch if you want warm leftovers within three days." }
    ],
    usedAgain: [
      { item: "Cooked chicken", days: ["Tuesday wrap", "Thursday chicken salad"] },
      { item: "Roasted potatoes", days: ["Monday dinner", "optional Wednesday lunch"] }
    ],
    freeze: "One single portion of chicken with vegetables if you have extra past day three."
  },
  {
    id: "turkey_chili",
    name: "Turkey and white bean chili",
    emoji: "🍲",
    protein: "Turkey",
    fiber: "White beans and peppers",
    prepMinutes: 20,
    cookMinutes: 15,
    oven: false,
    twist: "A new twist on classic chili: white beans and mild turkey with cumin and smoked paprika, not chili heat.",
    season: "Cumin, smoked paprika, garlic, oregano",
    parts: ["Ground turkey", "White beans", "Onion and pepper", "Broth and tomatoes"],
    steps: [
      "Chop the onion and pepper. Set half aside in a labeled container for Saturday eggs.",
      "Brown the turkey in a pot with a little oil. Add garlic, cumin, smoked paprika, and oregano.",
      "Stir in diced tomatoes, drained white beans, and low sodium broth. Simmer about 15 minutes.",
      "Taste and add lemon juice or a pinch of salt if needed. Cool before packing.",
      "Pack chili for Thursday dinner, one frozen single portion, and save cooked turkey for Friday bowls."
    ],
    quickSwap: "Frozen pepper and onion strips",
    grocery: [
      { name: "Ground turkey", qty: "1.5 pounds", aisle: "Meat" },
      { name: "Canned white beans", qty: "2 cans", aisle: "Pantry" },
      { name: "Onion", qty: "2", aisle: "Produce" },
      { name: "Bell pepper", qty: "2", aisle: "Produce" },
      { name: "Canned diced tomatoes", qty: "1 can", aisle: "Pantry" },
      { name: "Low sodium chicken broth", qty: "1 carton", aisle: "Pantry" },
      { name: "Garlic", qty: "1 head", aisle: "Produce" },
      { name: "Ground cumin", qty: "jar if needed", aisle: "Pantry" }
    ],
    prepPlan: [
      { container: "A", label: "Raw onion and pepper half", note: "Saved for Saturday scrambled eggs." },
      { container: "B", label: "Thursday chili dinner", note: "Chili for one or two plates within three days." },
      { container: "C", label: "Frozen chili portion", note: "One single portion for a later week." },
      { container: "D", label: "Cooked turkey for bowls", note: "Friday stuffed pepper bowls." }
    ],
    usedAgain: [
      { item: "Onion and pepper", days: ["Wednesday chili", "Saturday eggs"] },
      { item: "Chili", days: ["Thursday dinner", "freezer"] },
      { item: "Turkey", days: ["Friday stuffed pepper bowls"] }
    ],
    freeze: "One single chili portion in a flat container."
  },
  {
    id: "herb_salmon",
    name: "Herb lemon salmon sheet pan",
    emoji: "🐟",
    protein: "Salmon",
    fiber: "Broccoli and sweet potato",
    prepMinutes: 15,
    cookMinutes: 18,
    oven: true,
    twist: "A new twist on baked fish night: lemon herb instead of heavy breading.",
    season: "Lemon, dill, garlic, olive oil",
    parts: ["Salmon fillets", "Sweet potato cubes", "Broccoli florets", "Lemon dill oil"],
    steps: [
      "Cube the sweet potato small so it cooks with the fish. Toss with oil and salt.",
      "Spread potato on a sheet. Add broccoli tossed with oil.",
      "Lay salmon on top. Brush with oil, garlic, dill, and lemon.",
      "Bake at 400 degrees about 18 minutes until the fish flakes and potatoes are soft.",
      "Portion: dinner tonight, lunch within two days, and freeze one fish portion if needed."
    ],
    quickSwap: "Frozen broccoli florets and microwave sweet potato",
    grocery: [
      { name: "Salmon fillets", qty: "1.25 pounds", aisle: "Meat" },
      { name: "Sweet potatoes", qty: "2", aisle: "Produce" },
      { name: "Broccoli", qty: "1 head", aisle: "Produce" },
      { name: "Lemons", qty: "2", aisle: "Produce" },
      { name: "Fresh dill or dried dill", qty: "small bunch or jar", aisle: "Produce" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Salmon, potato, broccoli for tonight." },
      { container: "B", label: "Next day lunch", note: "Cold or gently warmed within two days." },
      { container: "C", label: "Frozen salmon portion", note: "If you cooked extra." }
    ],
    usedAgain: [{ item: "Cooked salmon", days: ["Cook day dinner", "next day lunch"] }],
    freeze: "One salmon fillet portion without vegetables."
  },
  {
    id: "gentle_meatloaf",
    name: "Gentle turkey meatloaf",
    emoji: "🍖",
    protein: "Turkey",
    fiber: "Oats and grated carrot in the loaf",
    prepMinutes: 20,
    cookMinutes: 40,
    oven: true,
    twist: "A new twist on meatloaf: turkey, oats, and grated carrot with a mild tomato glaze.",
    season: "Onion powder, garlic, oregano, smoked paprika",
    parts: ["Ground turkey", "Oats and egg", "Grated carrot", "Mild tomato glaze"],
    steps: [
      "Mix turkey with oats, one egg, grated carrot, onion powder, garlic, and oregano.",
      "Shape into a loaf on a lined pan. Brush with a thin mild tomato glaze.",
      "Bake at 350 degrees about 40 minutes until cooked through.",
      "Rest ten minutes. Slice for tonight and pack slices for later meals.",
      "Freeze two single slices flat for another week."
    ],
    quickSwap: "Pre grated carrots from the produce case",
    grocery: [
      { name: "Ground turkey", qty: "1.5 pounds", aisle: "Meat" },
      { name: "Rolled oats", qty: "1 cup needed", aisle: "Pantry" },
      { name: "Eggs", qty: "1", aisle: "Dairy" },
      { name: "Carrots", qty: "2", aisle: "Produce" },
      { name: "Mild tomato sauce", qty: "1 small can", aisle: "Pantry" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Two slices with a simple side." },
      { container: "B", label: "Second dinner within three days", note: "Meatloaf sandwiches or plated slices." },
      { container: "C", label: "Frozen slices", note: "Two single portions." }
    ],
    usedAgain: [{ item: "Meatloaf slices", days: ["cook day", "day two or three", "freezer"] }],
    freeze: "Two single slices wrapped flat."
  },
  {
    id: "chicken_soup",
    name: "Soft chicken and vegetable soup",
    emoji: "🥣",
    protein: "Chicken",
    fiber: "Carrots, celery, and optional beans",
    prepMinutes: 20,
    cookMinutes: 30,
    oven: false,
    twist: "A new twist on chicken soup: soft vegetables and lemon at the end instead of heavy noodles.",
    season: "Bay, thyme, garlic, lemon",
    parts: ["Chicken pieces", "Carrot and celery", "Broth", "Optional white beans"],
    steps: [
      "Simmer chicken pieces in low sodium broth with garlic, bay, and thyme.",
      "Add diced carrot and celery. Cook until soft.",
      "Shred the chicken back into the pot. Add drained white beans if you like.",
      "Finish with lemon juice. Cool and pack.",
      "Fridge portions for two more days. Freeze two cups as a single meal."
    ],
    quickSwap: "Bagged frozen soup vegetables",
    grocery: [
      { name: "Bone in chicken thighs", qty: "1.5 pounds", aisle: "Meat" },
      { name: "Carrots", qty: "3", aisle: "Produce" },
      { name: "Celery", qty: "3 stalks", aisle: "Produce" },
      { name: "Low sodium chicken broth", qty: "1 carton", aisle: "Pantry" },
      { name: "Canned white beans", qty: "1 can optional", aisle: "Pantry" },
      { name: "Lemons", qty: "1", aisle: "Produce" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Bowl of soup." },
      { container: "B", label: "Next day lunch", note: "Within two days." },
      { container: "C", label: "Frozen soup cup", note: "One single meal." }
    ],
    usedAgain: [{ item: "Soup", days: ["cook day", "next day", "freezer"] }],
    freeze: "One or two single cups."
  },
  {
    id: "white_fish",
    name: "Baked white fish with mild herbs",
    emoji: "🐟",
    protein: "White fish",
    fiber: "Green beans and rice",
    prepMinutes: 15,
    cookMinutes: 20,
    oven: true,
    twist: "A new twist on fish fry night: oven baked with herbs, not batter.",
    season: "Parsley, lemon, garlic, olive oil",
    parts: ["White fish fillets", "Green beans", "Rice", "Herb oil"],
    steps: [
      "Start a pot of rice if you are cooking grains today.",
      "Trim green beans and toss with oil and salt on a sheet pan.",
      "Lay fish on the pan. Brush with oil, garlic, parsley, and lemon.",
      "Bake at 400 degrees about 15 to 20 minutes until the fish flakes.",
      "Pack fish and beans for tonight and one lunch. Freeze extra fish alone."
    ],
    quickSwap: "Frozen green beans and microwave rice cups",
    grocery: [
      { name: "White fish fillets", qty: "1.25 pounds", aisle: "Meat" },
      { name: "Green beans", qty: "1 pound", aisle: "Produce" },
      { name: "Brown rice", qty: "1 cup dry", aisle: "Pantry" },
      { name: "Parsley", qty: "small bunch", aisle: "Produce" },
      { name: "Lemons", qty: "1", aisle: "Produce" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Fish, beans, rice." },
      { container: "B", label: "Next day lunch", note: "Within two days." },
      { container: "C", label: "Extra rice", note: "For a later breakfast scramble or bowl." }
    ],
    usedAgain: [{ item: "Rice", days: ["cook day", "next lunch", "optional breakfast bowl"] }],
    freeze: "One fish fillet portion."
  },
  {
    id: "beef_stew",
    name: "Soft beef and root stew",
    emoji: "🥩",
    protein: "Beef",
    fiber: "Carrots, potato, and celery",
    prepMinutes: 25,
    cookMinutes: 90,
    oven: false,
    twist: "A new twist on pot roast: smaller cubes and gentle herbs for easier chewing.",
    season: "Thyme, bay, garlic, black pepper",
    parts: ["Stew beef", "Root vegetables", "Broth", "Tomato paste"],
    steps: [
      "Pat beef dry and brown in a little oil in batches.",
      "Add onion, carrot, celery, potato, garlic, thyme, and bay.",
      "Stir in a spoon of tomato paste and low sodium broth to cover.",
      "Simmer covered until the beef is soft, about 90 minutes, or use a slow cooker on low.",
      "Cool. Pack two fridge meals within three days and freeze one single bowl."
    ],
    quickSwap: "Bagged stew vegetable mix",
    grocery: [
      { name: "Stew beef", qty: "1.5 pounds", aisle: "Meat" },
      { name: "Carrots", qty: "4", aisle: "Produce" },
      { name: "Potatoes", qty: "3", aisle: "Produce" },
      { name: "Celery", qty: "3 stalks", aisle: "Produce" },
      { name: "Onion", qty: "1", aisle: "Produce" },
      { name: "Low sodium beef broth", qty: "1 carton", aisle: "Pantry" },
      { name: "Tomato paste", qty: "1 small can", aisle: "Pantry" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Stew bowl." },
      { container: "B", label: "Second dinner within three days", note: "Stew warmed gently." },
      { container: "C", label: "Frozen stew", note: "One single bowl." }
    ],
    usedAgain: [{ item: "Stew", days: ["cook day", "day two or three", "freezer"] }],
    freeze: "One single bowl."
  },
  {
    id: "egg_bake",
    name: "Vegetable egg bake",
    emoji: "🍳",
    protein: "Eggs",
    fiber: "Spinach and peppers",
    prepMinutes: 15,
    cookMinutes: 30,
    oven: true,
    twist: "A new twist on scrambled eggs: a soft bake you can slice for several days.",
    season: "Herbs, garlic powder, black pepper",
    parts: ["Eggs", "Spinach", "Peppers", "Optional cheese"],
    steps: [
      "Whisk eggs with a splash of milk, herbs, and pepper.",
      "Scatter chopped spinach and soft peppers in a greased dish.",
      "Pour eggs over. Add a light sprinkle of cheese if you use dairy.",
      "Bake at 350 degrees about 30 minutes until set.",
      "Cool and cut squares for breakfasts and light dinners within three days."
    ],
    quickSwap: "Frozen spinach and frozen pepper strips",
    grocery: [
      { name: "Eggs", qty: "8", aisle: "Dairy" },
      { name: "Spinach", qty: "1 bag", aisle: "Produce" },
      { name: "Bell pepper", qty: "1", aisle: "Produce" },
      { name: "Milk", qty: "splash", aisle: "Dairy" },
      { name: "Shredded cheese optional", qty: "small bag", aisle: "Dairy" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day breakfast or dinner", note: "Two squares." },
      { container: "B", label: "Next day breakfast", note: "Within two days." },
      { container: "C", label: "Third day lunch", note: "Within three days. Do not keep longer in the fridge." }
    ],
    usedAgain: [{ item: "Egg bake squares", days: ["cook day", "day two", "day three"] }],
    freeze: "Usually fridge only. Freeze only if wrapped very well."
  },
  {
    id: "bean_stew",
    name: "Tomato white bean stew",
    emoji: "🍅",
    protein: "Beans",
    fiber: "Beans and greens",
    prepMinutes: 15,
    cookMinutes: 20,
    oven: false,
    twist: "A new twist on pasta night: beans and greens in a mild tomato pot.",
    season: "Oregano, garlic, smoked paprika, basil",
    parts: ["White beans", "Tomatoes", "Greens", "Onion"],
    steps: [
      "Soft cook onion and garlic in oil.",
      "Add tomatoes, beans, oregano, and smoked paprika. Simmer 15 minutes.",
      "Stir in chopped greens until wilted. Finish with lemon.",
      "Serve with toast if you like. Pack leftovers for two more days.",
      "Freeze one single bowl if you made a large pot."
    ],
    quickSwap: "Canned tomatoes and bagged baby spinach",
    grocery: [
      { name: "Canned white beans", qty: "2 cans", aisle: "Pantry" },
      { name: "Canned diced tomatoes", qty: "1 can", aisle: "Pantry" },
      { name: "Onion", qty: "1", aisle: "Produce" },
      { name: "Bagged greens", qty: "1 bag", aisle: "Produce" },
      { name: "Whole grain bread", qty: "1 loaf if needed", aisle: "Bread" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Stew bowl." },
      { container: "B", label: "Next day lunch", note: "Within two days." },
      { container: "C", label: "Frozen bowl", note: "Optional." }
    ],
    usedAgain: [{ item: "Bean stew", days: ["cook day", "next day"] }],
    freeze: "One single bowl."
  },
  {
    id: "pork_loin",
    name: "Herb roasted pork tenderloin",
    emoji: "🐖",
    protein: "Pork",
    fiber: "Apples and cabbage",
    prepMinutes: 20,
    cookMinutes: 30,
    oven: true,
    twist: "A new twist on Sunday roast: small tenderloin with apples instead of heavy gravy.",
    season: "Sage, garlic, black pepper, olive oil",
    parts: ["Pork tenderloin", "Apple slices", "Cabbage", "Herb rub"],
    steps: [
      "Rub pork with oil, sage, garlic, and pepper.",
      "Slice apples and shred cabbage. Toss with a little oil.",
      "Roast pork and vegetables at 400 degrees about 25 to 30 minutes.",
      "Rest the pork, then slice. Pack dinner and next day plates.",
      "Freeze two thin slice packs if you have extra past day three."
    ],
    quickSwap: "Bagged coleslaw mix without dressing",
    grocery: [
      { name: "Pork tenderloin", qty: "1.25 pounds", aisle: "Meat" },
      { name: "Apples", qty: "2", aisle: "Produce" },
      { name: "Cabbage or coleslaw mix", qty: "1", aisle: "Produce" },
      { name: "Garlic", qty: "1 head", aisle: "Produce" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Sliced pork with apple cabbage." },
      { container: "B", label: "Second dinner within three days", note: "Cold or gently warmed." },
      { container: "C", label: "Frozen pork slices", note: "If needed." }
    ],
    usedAgain: [{ item: "Pork slices", days: ["cook day", "day two or three"] }],
    freeze: "Two single slice packs."
  },
  {
    id: "shrimp_scampi",
    name: "Gentle lemon garlic shrimp",
    emoji: "🦐",
    protein: "Shrimp",
    fiber: "Zucchini noodles or soft zucchini",
    prepMinutes: 15,
    cookMinutes: 10,
    oven: false,
    twist: "A new twist on shrimp scampi: lemon and garlic without heavy butter and wine.",
    season: "Lemon, garlic, parsley, olive oil",
    parts: ["Shrimp", "Zucchini", "Garlic lemon sauce", "Optional rice"],
    steps: [
      "Pat shrimp dry. Soft cook zucchini ribbons or coins in a little oil.",
      "Push zucchini aside. Cook shrimp with garlic until just pink.",
      "Add lemon juice and parsley. Toss gently.",
      "Serve over zucchini or a small scoop of rice.",
      "Eat within two days. Shrimp does not freeze as well once cooked."
    ],
    quickSwap: "Frozen peeled shrimp thawed under cold water",
    grocery: [
      { name: "Shrimp peeled", qty: "1 pound", aisle: "Meat" },
      { name: "Zucchini", qty: "3", aisle: "Produce" },
      { name: "Lemons", qty: "2", aisle: "Produce" },
      { name: "Parsley", qty: "small bunch", aisle: "Produce" },
      { name: "Garlic", qty: "1 head", aisle: "Produce" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Shrimp and zucchini." },
      { container: "B", label: "Next day lunch", note: "Within two days only." }
    ],
    usedAgain: [{ item: "Shrimp", days: ["cook day", "next day"] }],
    freeze: "Prefer fresh cook. Freeze raw shrimp only before cooking."
  },
  {
    id: "chicken_rice",
    name: "One pan chicken and rice",
    emoji: "🍚",
    protein: "Chicken",
    fiber: "Peas and brown rice",
    prepMinutes: 15,
    cookMinutes: 35,
    oven: true,
    twist: "A new twist on chicken and rice casserole: lemon and herbs, not cream soup.",
    season: "Lemon, thyme, garlic, olive oil",
    parts: ["Chicken pieces", "Brown rice", "Peas", "Broth"],
    steps: [
      "Rinse rice. Place in a baking dish with broth, garlic, and thyme.",
      "Nestle chicken on top. Drizzle with oil and lemon.",
      "Cover and bake at 375 degrees about 35 minutes until rice is tender.",
      "Stir in peas for the last five minutes.",
      "Pack two fridge meals and freeze one single bowl."
    ],
    quickSwap: "Frozen peas and microwave rice cups with skillet chicken",
    grocery: [
      { name: "Chicken thighs boneless", qty: "1.5 pounds", aisle: "Meat" },
      { name: "Brown rice", qty: "1 cup dry", aisle: "Pantry" },
      { name: "Frozen peas", qty: "1 bag", aisle: "Frozen" },
      { name: "Low sodium chicken broth", qty: "2 cups needed", aisle: "Pantry" },
      { name: "Lemons", qty: "1", aisle: "Produce" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Chicken and rice." },
      { container: "B", label: "Second dinner within three days", note: "Same dish." },
      { container: "C", label: "Frozen bowl", note: "One single portion." }
    ],
    usedAgain: [{ item: "Chicken and rice", days: ["cook day", "day two or three", "freezer"] }],
    freeze: "One single bowl."
  },
  {
    id: "tuna_pasta",
    name: "Soft tuna pasta bake",
    emoji: "🍝",
    protein: "Tuna",
    fiber: "Peas and whole grain pasta",
    prepMinutes: 20,
    cookMinutes: 25,
    oven: true,
    twist: "A new twist on tuna casserole: olive oil and lemon instead of heavy cream soup.",
    season: "Lemon, parsley, garlic, black pepper",
    parts: ["Whole grain pasta", "Tuna", "Peas", "Light sauce"],
    steps: [
      "Cook pasta until just soft. Drain and save a little pasta water.",
      "Toss pasta with tuna, peas, olive oil, garlic, lemon, and parsley.",
      "Spread in a dish. Add a light sprinkle of cheese if you use dairy.",
      "Bake at 350 degrees about 20 minutes until warm and lightly golden.",
      "Pack two fridge portions within three days."
    ],
    quickSwap: "Microwave pasta cups and frozen peas",
    grocery: [
      { name: "Whole grain pasta", qty: "12 ounces", aisle: "Pantry" },
      { name: "Canned tuna in water", qty: "2 cans", aisle: "Pantry" },
      { name: "Frozen peas", qty: "1 bag", aisle: "Frozen" },
      { name: "Lemons", qty: "1", aisle: "Produce" },
      { name: "Parsley", qty: "small bunch", aisle: "Produce" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Pasta bake plate." },
      { container: "B", label: "Next day lunch", note: "Within two days." },
      { container: "C", label: "Third day dinner", note: "Within three days." }
    ],
    usedAgain: [{ item: "Tuna pasta", days: ["cook day", "day two", "day three"] }],
    freeze: "Fridge preferred. Freeze only if needed."
  },
  {
    id: "stuffed_peppers",
    name: "Turkey stuffed pepper bowls",
    emoji: "🫑",
    protein: "Turkey",
    fiber: "Peppers, rice, and beans",
    prepMinutes: 20,
    cookMinutes: 25,
    oven: true,
    twist: "A new twist on stuffed peppers: bowl style so cutting is easier.",
    season: "Cumin, oregano, garlic, smoked paprika",
    parts: ["Ground turkey or leftover turkey", "Peppers", "Rice", "Beans"],
    steps: [
      "Soft cook turkey with garlic, cumin, oregano, and smoked paprika.",
      "Stir in cooked rice and drained beans.",
      "Spoon into pepper halves or into bowls with chopped soft peppers.",
      "Bake at 375 degrees about 20 minutes if using pepper halves, or warm bowls on the stove.",
      "Pack one more fridge meal and freeze one bowl."
    ],
    quickSwap: "Jarred roasted peppers and microwave rice",
    grocery: [
      { name: "Ground turkey or leftover turkey", qty: "1 pound", aisle: "Meat" },
      { name: "Bell peppers", qty: "4", aisle: "Produce" },
      { name: "Cooked rice", qty: "2 cups", aisle: "Pantry" },
      { name: "Canned black or white beans", qty: "1 can", aisle: "Pantry" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Pepper bowl." },
      { container: "B", label: "Next day lunch", note: "Within two days." },
      { container: "C", label: "Frozen bowl", note: "One single portion." }
    ],
    usedAgain: [{ item: "Turkey filling", days: ["cook day", "next day", "freezer"] }],
    freeze: "One single bowl of filling."
  },
  {
    id: "veggie_lasagna",
    name: "Soft vegetable lasagna cups",
    emoji: "🧀",
    protein: "Ricotta or cottage cheese and optional egg",
    fiber: "Zucchini and spinach",
    prepMinutes: 25,
    cookMinutes: 35,
    oven: true,
    twist: "A new twist on lasagna: muffin cup portions for easy freezer singles.",
    season: "Basil, oregano, garlic, mild tomato",
    parts: ["Zucchini ribbons", "Cheese layer", "Mild tomato", "Spinach"],
    steps: [
      "Slice zucchini thin. Soft wilt spinach.",
      "Layer zucchini, cheese mix, tomato, and spinach in muffin cups or a small dish.",
      "Bake at 375 degrees about 30 to 35 minutes until set.",
      "Cool. Pack fridge cups for three days max.",
      "Freeze remaining cups as single portions."
    ],
    quickSwap: "No boil lasagna noodles cut small instead of zucchini",
    grocery: [
      { name: "Zucchini", qty: "3", aisle: "Produce" },
      { name: "Ricotta or cottage cheese", qty: "15 ounces", aisle: "Dairy" },
      { name: "Mild tomato sauce", qty: "1 jar", aisle: "Pantry" },
      { name: "Spinach", qty: "1 bag", aisle: "Produce" },
      { name: "Egg", qty: "1 optional", aisle: "Dairy" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Two cups." },
      { container: "B", label: "Second dinner within three days", note: "Two cups." },
      { container: "C", label: "Frozen cups", note: "Remaining singles." }
    ],
    usedAgain: [{ item: "Lasagna cups", days: ["cook day", "day two or three", "freezer"] }],
    freeze: "Individual cups wrapped well."
  },
  {
    id: "chicken_salad",
    name: "Lemon herb chicken salad",
    emoji: "🥗",
    protein: "Chicken",
    fiber: "Celery, apple, and greens",
    prepMinutes: 15,
    cookMinutes: 0,
    oven: false,
    twist: "A new twist on deli chicken salad: yogurt and lemon instead of heavy mayo.",
    season: "Lemon, dill, black pepper, mustard",
    parts: ["Cooked chicken", "Celery and apple", "Yogurt dressing", "Greens"],
    steps: [
      "Chop leftover cooked chicken into soft bite size pieces.",
      "Dice celery and apple small.",
      "Stir yogurt with lemon, dill, mustard, and pepper. Fold in chicken and vegetables.",
      "Serve over greens or in a wrap.",
      "Keep only two days in the fridge. Do not freeze."
    ],
    quickSwap: "Rotisserie chicken pulled and cooled",
    grocery: [
      { name: "Cooked chicken", qty: "2 cups", aisle: "Meat" },
      { name: "Celery", qty: "2 stalks", aisle: "Produce" },
      { name: "Apple", qty: "1", aisle: "Produce" },
      { name: "Plain yogurt", qty: "1 cup", aisle: "Dairy" },
      { name: "Salad greens", qty: "1 bag", aisle: "Produce" },
      { name: "Wraps optional", qty: "pack", aisle: "Bread" }
    ],
    prepPlan: [
      { container: "A", label: "Same day lunch or dinner", note: "Chicken salad plate." },
      { container: "B", label: "Next day lunch", note: "Within two days only." }
    ],
    usedAgain: [{ item: "Chicken salad", days: ["day one", "day two"] }],
    freeze: "Do not freeze."
  },
  {
    id: "breakfast_burritos",
    name: "Make ahead egg wraps",
    emoji: "🌯",
    protein: "Eggs",
    fiber: "Beans and spinach",
    prepMinutes: 20,
    cookMinutes: 10,
    oven: false,
    twist: "A new twist on diner breakfast: soft wraps you can warm gently later.",
    season: "Mild salsa, cumin, black pepper",
    parts: ["Eggs", "Spinach", "Beans", "Tortillas"],
    steps: [
      "Scramble eggs softly with spinach.",
      "Warm beans with a pinch of cumin.",
      "Fill tortillas with eggs and beans. Roll and wrap each one.",
      "Fridge for up to three days. Warm gently in a skillet or microwave.",
      "Freeze extras wrapped in foil for later weeks."
    ],
    quickSwap: "Microwave egg cups and canned beans",
    grocery: [
      { name: "Eggs", qty: "6", aisle: "Dairy" },
      { name: "Spinach", qty: "1 bag", aisle: "Produce" },
      { name: "Canned black beans", qty: "1 can", aisle: "Pantry" },
      { name: "Soft tortillas", qty: "6", aisle: "Bread" },
      { name: "Mild salsa", qty: "1 jar", aisle: "Pantry" }
    ],
    prepPlan: [
      { container: "A", label: "Next morning breakfast", note: "One wrap." },
      { container: "B", label: "Second breakfast", note: "Within three days." },
      { container: "C", label: "Frozen wraps", note: "Remaining." }
    ],
    usedAgain: [{ item: "Egg wraps", days: ["day one", "day two", "day three", "freezer"] }],
    freeze: "Wrapped singles."
  },
  {
    id: "shepherd_pie",
    name: "Turkey shepherd pie",
    emoji: "🥧",
    protein: "Turkey",
    fiber: "Peas, carrots, and potato topping",
    prepMinutes: 25,
    cookMinutes: 30,
    oven: true,
    twist: "A new twist on shepherd pie: turkey and a thin potato top, not a heavy crust.",
    season: "Thyme, garlic, black pepper, parsley",
    parts: ["Ground turkey", "Peas and carrots", "Mashed potato top", "Broth"],
    steps: [
      "Soft cook turkey with garlic and thyme. Add peas, carrots, and a splash of broth.",
      "Spread in a dish. Top with a thin layer of mashed potato.",
      "Bake at 375 degrees about 25 to 30 minutes until the top is lightly golden.",
      "Cool. Pack two fridge meals within three days.",
      "Freeze one single square."
    ],
    quickSwap: "Frozen peas and carrots and instant mashed potato",
    grocery: [
      { name: "Ground turkey", qty: "1.25 pounds", aisle: "Meat" },
      { name: "Frozen peas and carrots", qty: "1 bag", aisle: "Frozen" },
      { name: "Potatoes", qty: "3", aisle: "Produce" },
      { name: "Low sodium broth", qty: "1 cup needed", aisle: "Pantry" }
    ],
    prepPlan: [
      { container: "A", label: "Cook day dinner", note: "Pie square." },
      { container: "B", label: "Second dinner within three days", note: "Pie square." },
      { container: "C", label: "Frozen square", note: "One single portion." }
    ],
    usedAgain: [{ item: "Shepherd pie", days: ["cook day", "day two or three", "freezer"] }],
    freeze: "One single square."
  }
]
};
