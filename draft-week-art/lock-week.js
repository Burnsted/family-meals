/* Lock-in labels (Steve bar). Change COPY only when Steve sends new wording. */
(function (root) {
  "use strict";
  root.WEEK_LOCK_COPY = {
    lock: "Lock in this week",
    locked: "Week locked",
    edit: "Edit week",
    confirm: "Confirm lock",
    keepEditing: "Keep editing",
    kathyHelper: "Saves your meals, swaps, sides, and list",
    sheetTitle: "Lock in this week",
    localOnly: "Saved on this phone only",
    shuffleMeals: "Shuffle meals",
    sharePlan: "Share this plan",
    randomMeal: "Random meal",
    randomToast: function (name) {
      return "Picked: " + name;
    },
    groceryLine: function (n) {
      return n === 1 ? "1 grocery item on this week list" : n + " grocery items on this week list";
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
