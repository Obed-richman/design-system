/*
 * ============================================================
 * TEXT INPUT — clear button behaviour
 * ============================================================
 * Wires up the clear (×) button shown in the focused / error states.
 * Clicking .input__clear empties the field's .input, re-focuses it and
 * fires an `input` event so any listeners (validation, etc.) update.
 *
 * Self-initialising via event delegation — just include the script:
 *   <script src="input.js"></script>
 * ============================================================
 */

(function () {
  // Keep focus on the field while the clear button is pressed. Without this,
  // the mousedown blurs the input, and clear buttons that are only revealed on
  // :focus-within (e.g. Search) get display:none before the click fires — so
  // the click is lost and the field never clears.
  document.addEventListener('mousedown', function (event) {
    if (event.target.closest('.input__clear')) event.preventDefault();
  });

  document.addEventListener('click', function (event) {
    var clearBtn = event.target.closest('.input__clear');
    if (!clearBtn) return;

    var field = clearBtn.closest('.input-field');
    var input = field && field.querySelector('.input');
    if (!input || input.disabled) return;

    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  });
})();
