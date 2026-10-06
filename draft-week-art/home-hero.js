/* Home hero mock strip + CTAs (Steve bar). Labels easy to change. */
(function (root) {
  "use strict";

  root.HOME_HERO_COPY = {
    burnsKicker: "Kitchen HQ",
    burnsBrand: "Burns Family Meals",
    burnsSub: "Your week of dinners, ready to cook and share.",
    kathyKicker: "Shelzen",
    kathyBrand: "Kathy's Table",
    kathySub: "Quiet meals by the water. One calm week at a glance.",
    mockLabel: "Your week",
    seeMyWeek: "See my week",
    buildMyWeek: "Build my week",
    setupPhotos: "Set up with photos",
    setupQuestions: "Answer a few questions",
  };

  const MOCK_MEALS = [
    { short: "Mon", letter: "M", title: "Lemon chicken", art: "chicken" },
    { short: "Tue", letter: "T", title: "Chicken again", art: "leftover" },
    { short: "Wed", letter: "W", title: "Turkey chili", art: "chili" },
    { short: "Thu", letter: "T", title: "Chili bowl", art: "leftover" },
    { short: "Fri", letter: "F", title: "Baked salmon", art: "fish" },
    { short: "Sat", letter: "S", title: "Egg bake", art: "eggs" },
    { short: "Sun", letter: "S", title: "Light plate", art: "light" },
  ];

  function mockStripHTML() {
    const FA = root.FoodArt;
    const today = new Date().getDay(); // 0 Sun
    // Mon-Sun order for mock: Mon=1 ... Sun=0 → indices 0..6 in MOCK_MEALS are already Mon-Sun
    const jsToMockToday = today === 0 ? 6 : today - 1;
    return (
      '<div class="home-mock-strip-wrap">' +
      '<p class="home-mock-label">' +
      (root.HOME_HERO_COPY.mockLabel || "Your week") +
      "</p>" +
      '<div class="home-mock-strip" aria-hidden="true">' +
      MOCK_MEALS.map(function (d, i) {
        const art = FA ? FA.art(d.art) : "";
        const name = FA ? FA.shortMealName(d.title, 3) : d.title;
        return (
          '<div class="home-mock-chip' +
          (i === jsToMockToday ? " is-today" : "") +
          '">' +
          '<span class="wsc-day">' +
          d.letter +
          "</span>" +
          '<span class="wsc-art">' +
          art +
          "</span>" +
          '<span class="wsc-name">' +
          name +
          "</span>" +
          "</div>"
        );
      }).join("") +
      "</div></div>"
    );
  }

  function homeHeroHTML(opts) {
    opts = opts || {};
    const C = root.HOME_HERO_COPY;
    const returning = !!opts.returning;
    const mood = opts.mood === "kathy" ? "kathy" : "burns";
    const primary = returning ? C.seeMyWeek : C.buildMyWeek;
    const primaryId = opts.primaryId || "home-primary-cta";
    const shell =
      mood === "kathy"
        ? '<svg class="shelzen-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6c6 2 10 8 10 14 0 4-4 8-10 8S6 24 6 20C6 14 10 8 16 6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 10v14" stroke="currentColor" stroke-width="1.5"/></svg>'
        : "";
    return (
      '<header class="home-hero ' +
      (mood === "kathy" ? "kathy-home" : "burns-home") +
      '" id="home-hero">' +
      shell +
      '<p class="brand-kicker">' +
      (mood === "kathy" ? C.kathyKicker : C.burnsKicker) +
      "</p>" +
      '<h1 class="brand">' +
      (mood === "kathy" ? C.kathyBrand : C.burnsBrand) +
      "</h1>" +
      '<p class="hero-sub">' +
      (mood === "kathy" ? C.kathySub : C.burnsSub) +
      "</p>" +
      mockStripHTML() +
      '<button type="button" class="home-cta-primary" id="' +
      primaryId +
      '">' +
      primary +
      "</button>" +
      '<div class="home-cta-secondary">' +
      '<button type="button" id="home-setup-photos">' +
      C.setupPhotos +
      "</button>" +
      '<button type="button" id="home-setup-questions">' +
      C.setupQuestions +
      "</button>" +
      "</div></header>"
    );
  }

  root.HomeHero = {
    html: homeHeroHTML,
    mockStripHTML: mockStripHTML,
    MOCK_MEALS: MOCK_MEALS,
  };
})(typeof window !== "undefined" ? window : globalThis);
