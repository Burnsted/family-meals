/* Home hero: interactive photo-real week board (Ted home=JPG lock). */
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
    { short: "Mon", letter: "M", title: "Lemon chicken", art: "chicken", note: "Easy start" },
    { short: "Tue", letter: "T", title: "Chicken again", art: "leftover", note: "Chicken leftovers", kind: "leftover" },
    { short: "Wed", letter: "W", title: "Turkey chili", art: "chili", note: "Football day" },
    { short: "Thu", letter: "T", title: "Chili bowl", art: "leftover", note: "Chili leftovers", kind: "leftover" },
    { short: "Fri", letter: "F", title: "Baked salmon", art: "salmon", note: "Ted's chicken leftovers", tedNote: "Ted: leftover chicken (not fish)" },
    { short: "Sat", letter: "S", title: "Egg bake", art: "eggs", note: "Family cooks" },
    { short: "Sun", letter: "S", title: "Light plate", art: "light", note: "Light day", kind: "light" },
  ];

  function mockBoardDays() {
    const today = new Date().getDay();
    const jsToMockToday = today === 0 ? 6 : today - 1;
    return MOCK_MEALS.map(function (d, i) {
      return {
        index: i,
        short: d.short,
        name: d.short,
        title: d.title,
        dinner: d.title,
        boardNote: d.note,
        kind: d.kind || "cook",
        today: i === jsToMockToday,
        active: false,
        artKey: d.art,
      };
    });
  }

  function mockBoardHTML(mood) {
    const WB = root.WeekBoard;
    if (!WB || !WB.boardHTML) return "";
    return WB.boardHTML(mockBoardDays(), {
      mood: mood === "kathy" ? "kathy" : "burns",
      title: mood === "kathy" ? "Kathy's Table" : "Burns Family Dinners",
      weekTitle: "this week",
      id: mood === "kathy" ? "home-kathy-board" : "home-burns-board",
      tucker: mood !== "kathy",
    });
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
      mockBoardHTML(mood) +
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
    mockBoardHTML: mockBoardHTML,
    mockBoardDays: mockBoardDays,
    MOCK_MEALS: MOCK_MEALS,
  };
})(typeof window !== "undefined" ? window : globalThis);
