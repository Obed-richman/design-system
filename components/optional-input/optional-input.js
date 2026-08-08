/*
 * ============================================================
 * OPTIONAL INPUT — dismissal checkbox behaviour
 * ============================================================
 * Ticking the checkbox marks the value as not applicable, so the field is
 * disabled (Figma "Box ticked = Yes"); unticking re-enables it.
 *
 * The typed value is left alone rather than cleared — unticking by accident
 * shouldn't destroy what someone entered. Read the checkbox when submitting to
 * decide whether the field counts.
 *
 * Self-initialising via event delegation, and it syncs any markup that starts
 * out checked — just include the script:
 *   <script src="optional-input.js" defer></script>
 * ============================================================
 */

(function () {
  function sync(box) {
    var root  = box.closest('.optional-input');
    if (!root) return;
    var field  = root.querySelector('.input-field');
    /* querySelectorAll, not querySelector — a segmented date field has an input
       per segment and every one of them has to go disabled */
    var inputs = root.querySelectorAll('.input');
    if (!field || !inputs.length) return;

    inputs.forEach(function (input) { input.disabled = box.checked; });
    field.classList.toggle('input-field--disabled', box.checked);
  }

  document.addEventListener('change', function (event) {
    var box = event.target;
    if (box && box.classList && box.classList.contains('checkbox__input')) sync(box);
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.optional-input .checkbox__input').forEach(sync);
  });
})();
