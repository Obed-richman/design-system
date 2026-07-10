/*
 * Sales Navigation — Help/Close toggle
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
