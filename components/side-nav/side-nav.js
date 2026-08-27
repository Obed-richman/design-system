/*
 * ============================================================
 * SIDE NAV — interactivity
 * ============================================================
 * • The header toggle button switches Expanded ⇄ Collapsed
 *   (adds/removes .side-nav--collapsed). Collapsing force-opens the
 *   groups so their icons stay visible on the rail.
 * • Clicking an item makes it the active one (single-select).
 * Groups expand/collapse natively via <details> — no JS needed.
 * Applies to every .side-nav on the page.
 * ============================================================
 */
(function () {
  function init(nav) {
    if (nav.dataset.sideNavReady) return;
    nav.dataset.sideNavReady = "1";

    var toggle = nav.querySelector(".side-nav__toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var collapsed = nav.classList.toggle("side-nav--collapsed");
        toggle.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
        if (collapsed) {
          nav.querySelectorAll(".side-nav__group").forEach(function (g) { g.open = true; });
        }
      });
    }

    nav.addEventListener("click", function (e) {
      var item = e.target.closest(".side-nav__item");
      if (!item || !nav.contains(item)) return;
      e.preventDefault();
      nav.querySelectorAll(".side-nav__item--active").forEach(function (i) {
        i.classList.remove("side-nav__item--active");
        i.removeAttribute("aria-current");
      });
      item.classList.add("side-nav__item--active");
      item.setAttribute("aria-current", "page");
    });
  }

  function boot() {
    document.querySelectorAll(".side-nav").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
