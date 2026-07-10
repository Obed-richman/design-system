/*
 * ============================================================
 * TAB (tab bar) — selection behaviour
 * ============================================================
 * Clicking a tab in a role="tablist" bar makes it active and deactivates the
 * previously-active tab (updating aria-selected). Disabled tabs are ignored.
 *
 * Self-initialising via event delegation — just include the script:
 *   <script src="tab-bar.js"></script>
 *
 * Scoped to .tabs[role="tablist"] so static state demos (a plain .tabs
 * without the role) aren't made interactive.
 * ============================================================
 */

(function () {
  document.addEventListener('click', function (event) {
    var tab = event.target.closest('.tab-item');
    if (!tab || tab.disabled) return;

    var bar = tab.closest('.tabs[role="tablist"]');
    if (!bar) return;

    bar.querySelectorAll('.tab-item').forEach(function (t) {
      var isActive = t === tab;
      t.classList.toggle('tab-item--active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  });
})();
