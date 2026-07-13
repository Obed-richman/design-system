/*
 * ============================================================
 * TOP NAVIGATION / PLATFORM — expand + copy
 * ============================================================
 * Pressing Help (desktop) or the menu button (mobile) toggles [data-expanded]
 * on the nearest .top-nav, opening the dropdown and swapping Help⇄Close /
 * menu⇄close. The copy button copies the quote reference to the clipboard.
 * Click-outside and Escape close the panel.
 *
 * Self-init via event delegation:  <script src="top-nav.js" defer></script>
 * ============================================================
 */
(function () {
  function closeAll(except) {
    document.querySelectorAll('.top-nav[data-expanded="true"]').forEach(function (nav) {
      if (nav === except) return;
      nav.setAttribute('data-expanded', 'false');
      nav.querySelectorAll('[aria-expanded]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
    });
  }

  document.addEventListener('click', function (event) {
    // Copy the quote reference
    var copyBtn = event.target.closest('.top-nav__copy-btn');
    if (copyBtn) {
      var value = copyBtn.closest('.top-nav__copy').querySelector('.top-nav__copy-value');
      var text = value ? value.textContent.trim() : '';
      if (navigator.clipboard && text) navigator.clipboard.writeText(text).catch(function () {});
      copyBtn.classList.add('is-copied');
      copyBtn.setAttribute('aria-label', 'Copied');
      setTimeout(function () { copyBtn.classList.remove('is-copied'); copyBtn.setAttribute('aria-label', 'Copy'); }, 1500);
      return;
    }

    // Toggle the dropdown (Help pill or mobile menu button)
    var toggle = event.target.closest('.top-nav__help, .top-nav__menu');
    if (toggle) {
      var nav = toggle.closest('.top-nav');
      if (!nav) return;
      var open = nav.getAttribute('data-expanded') === 'true';
      closeAll(nav);
      nav.setAttribute('data-expanded', open ? 'false' : 'true');
      nav.querySelectorAll('[aria-expanded]').forEach(function (t) { t.setAttribute('aria-expanded', open ? 'false' : 'true'); });
      return;
    }

    // Click outside an open nav closes it
    document.querySelectorAll('.top-nav[data-expanded="true"]').forEach(function (nav) {
      if (!nav.contains(event.target)) {
        nav.setAttribute('data-expanded', 'false');
        nav.querySelectorAll('[aria-expanded]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAll(null);
  });
})();
