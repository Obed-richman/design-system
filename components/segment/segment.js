/*
 * ============================================================
 * SEGMENT CONTROL — selection behaviour
 * ============================================================
 * Clicking a segment selects it and deselects the others in the same control
 * (updating aria-selected). Disabled segments are ignored.
 *
 * Self-initialising via event delegation — just include the script:
 *   <script src="segment.js"></script>
 * ============================================================
 */

(function () {
  document.addEventListener('click', function (event) {
    var item = event.target.closest('.segment__item');
    if (!item || item.disabled) return;

    var control = item.closest('.segment');
    if (!control) return;

    control.querySelectorAll('.segment__item').forEach(function (seg) {
      var selected = seg === item;
      seg.classList.toggle('segment__item--active', selected);
      seg.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  });
})();
