/*
 * ============================================================
 * COMPARISON TILE — selection behaviour
 * ============================================================
 * Keeps the .comparison-tile--active class in sync with the selected radio
 * across a group (tiles sharing the same radio `name`). Selecting one tile
 * activates it and deactivates the previously-active one.
 *
 * (The frame colour also updates on its own via :has(.radio__input:checked);
 * this handler additionally clears any stale --active force class so the
 * previously-active tile fully resets.)
 *
 * Self-initialising via event delegation — just include the script:
 *   <script src="comparison-tile.js"></script>
 * ============================================================
 */

(function () {
  document.addEventListener('change', function (event) {
    var input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'radio') return;
    if (!input.closest('.comparison-tile') || !input.name) return;

    var group = document.querySelectorAll(
      '.comparison-tile .radio__input[name="' + (window.CSS && CSS.escape ? CSS.escape(input.name) : input.name) + '"]'
    );
    if (group.length < 2) return; // only manage real multi-option groups

    group.forEach(function (radio) {
      var tile = radio.closest('.comparison-tile');
      if (tile) tile.classList.toggle('comparison-tile--active', radio.checked);
    });
  });
})();
