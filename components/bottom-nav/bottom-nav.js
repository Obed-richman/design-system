/*
 * ============================================================
 * BOTTOM NAV — interactivity
 * ============================================================
 * Single-select: clicking a tab makes it the active one (filled icon +
 * .bottom-nav__item--active + aria-current) and clears the others.
 *
 * Applies to every .bottom-nav on the page. Add data-static to a bar to
 * opt it out (e.g. a reference row that should show a fixed state).
 *
 * Each item must contain both glyphs so the icon can swap without JS
 * touching the markup:
 *   <span class="bottom-nav__icon">
 *     <span class="bottom-nav__glyph bottom-nav__glyph--line"><svg>…</svg></span>
 *     <span class="bottom-nav__glyph bottom-nav__glyph--fill"><svg>…</svg></span>
 *   </span>
 * ============================================================
 */
(function () {
  function activate(nav, item) {
    nav.querySelectorAll('.bottom-nav__item').forEach(function (it) {
      var on = it === item;
      it.classList.toggle('bottom-nav__item--active', on);
      if (on) it.setAttribute('aria-current', 'page');
      else it.removeAttribute('aria-current');
    });
  }

  function init(nav) {
    if (nav.dataset.bottomNavReady) return;      // guard against double-init
    nav.dataset.bottomNavReady = '1';
    nav.addEventListener('click', function (e) {
      var item = e.target.closest('.bottom-nav__item');
      if (!item || !nav.contains(item)) return;
      e.preventDefault();
      activate(nav, item);
    });
  }

  function boot() {
    document.querySelectorAll('.bottom-nav:not([data-static])').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
