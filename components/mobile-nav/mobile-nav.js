/*
 * ============================================================
 * MOBILE TOP NAV — collapsing title on scroll
 * ============================================================
 * As the page scrolls away from the top, the large page title collapses to
 * free space and the centred title in the nav bar fades in to keep the page
 * name visible. Scrolling back to the top reverses it.
 *
 * Applies to every .mobile-nav that has a .mobile-nav__center-title. The nav
 * watches its nearest scrollable ancestor (e.g. the phone frame) — or the
 * window if there isn't one — and toggles .mobile-nav--scrolled past a small
 * threshold. Add data-static to opt a nav out.
 *
 * Markup:
 *   <div class="mobile-nav">
 *     …status bar…
 *     <div class="mobile-nav__bar">
 *       …left slot…
 *       <p class="mobile-nav__center-title">Page title</p>
 *       …right slot…
 *     </div>
 *     <div class="mobile-nav__title"><h1>Page title</h1></div>
 *   </div>
 * ============================================================
 */
(function () {
  var THRESHOLD = 8; // px scrolled before the title collapses

  function scrollParent(el) {
    var p = el.parentElement;
    while (p && p !== document.body && p !== document.documentElement) {
      var oy = getComputedStyle(p).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight) return p;
      p = p.parentElement;
    }
    return null; // fall back to the window
  }

  function init(nav) {
    if (nav.dataset.mobileNavReady) return;          // guard against double-init
    nav.dataset.mobileNavReady = '1';
    if (!nav.querySelector('.mobile-nav__center-title')) return;  // nothing to collapse

    var container = scrollParent(nav);
    var target = container || window;

    function update() {
      var top = container
        ? container.scrollTop
        : (window.pageYOffset || document.documentElement.scrollTop || 0);
      nav.classList.toggle('mobile-nav--scrolled', top > THRESHOLD);
    }

    target.addEventListener('scroll', update, { passive: true });
    update();
  }

  function boot() {
    document.querySelectorAll('.mobile-nav:not([data-static])').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
