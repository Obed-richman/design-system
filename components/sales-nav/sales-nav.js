/*
 * Sales Navigation — Help/Close toggle, and the sticky bar's scrolled state
 * Delegated click handler: pressing the toggle flips [data-expanded] on the
 * nearest .sales-nav, which shows/hides the Call-us dropdown and swaps the
 * pill between Help and Close (all styling handled in CSS).
 */
(function () {
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.sales-nav__toggle');
    if (toggle) {
      var nav = toggle.closest('.sales-nav');
      if (!nav) return;
      var open = nav.getAttribute('data-expanded') === 'true';
      nav.setAttribute('data-expanded', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      return;
    }
    // click outside an expanded nav closes it
    document.querySelectorAll('.sales-nav[data-expanded="true"]').forEach(function (nav) {
      if (!nav.contains(e.target)) {
        nav.setAttribute('data-expanded', 'false');
        var t = nav.querySelector('.sales-nav__toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();


/*
 * Sticky bar — the scrolled state
 * -----------------------------------------------------------------
 * Flags every .sales-nav--sticky with [data-scrolled] once the page has moved,
 * which is what reveals the hairline along its bottom edge (see sales-nav.css).
 * At rest the bar and the page share a background and want no seam; the line is
 * only true once there is content passing behind the bar.
 *
 * Read off the scrolling element rather than an IntersectionObserver sentinel:
 * the question is simply "has the page moved at all", and a sentinel would need
 * markup every consumer has to remember to add.
 *
 * The listener is passive and does nothing but toggle an attribute the browser
 * ignores when unchanged, so it stays cheap without throttling.
 */
(function () {
  function sync() {
    var scrolled = (window.scrollY || document.documentElement.scrollTop) > 0;
    document.querySelectorAll('.sales-nav--sticky').forEach(function (nav) {
      if (scrolled) nav.setAttribute('data-scrolled', '');
      else nav.removeAttribute('data-scrolled');
    });
  }

  window.addEventListener('scroll', sync, { passive: true });
  /* A page restored mid-scroll starts scrolled — don't wait for a first move */
  window.addEventListener('load', sync);
  document.addEventListener('DOMContentLoaded', sync);
})();
