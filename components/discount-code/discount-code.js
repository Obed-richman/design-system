/*
 * ============================================================
 * DISCOUNT CODE — apply / error / remove behaviour
 * ============================================================
 * Each .discount-code holds a form and a hidden applied banner, switched via a
 * data-state attribute ("default" | "error" | "applied").
 *
 *   - Apply: if the entered code matches the valid code (data-code, default
 *     "ZEGO22", case-insensitive) → applied; otherwise → error.
 *   - Remove: clears the field and returns to default.
 *   - Editing the field after an error clears the error.
 *
 * Pair with input.js so the clear (×) button empties the field. Self-init via
 * event delegation:  <script src="discount-code.js" defer></script>
 * ============================================================
 */
(function () {
  function setState(dc, state) {
    dc.setAttribute('data-state', state);
    var field = dc.querySelector('.input-field');
    if (field) field.classList.toggle('input-field--error', state === 'error');
  }

  document.addEventListener('click', function (event) {
    var apply = event.target.closest('.discount-code__apply');
    if (apply) {
      var dc = apply.closest('.discount-code');
      if (!dc) return;
      var input = dc.querySelector('.input');
      var value = (input && input.value || '').trim();
      if (!value) { if (input) input.focus(); return; }
      var valid = (dc.getAttribute('data-code') || 'ZEGO22').toUpperCase();
      setState(dc, value.toUpperCase() === valid ? 'applied' : 'error');
      return;
    }

    var remove = event.target.closest('.discount-code__remove');
    if (remove) {
      var card = remove.closest('.discount-code');
      if (!card) return;
      var field = card.querySelector('.input');
      if (field) field.value = '';
      setState(card, 'default');
      return;
    }
  });

  // Editing after an error clears the error (also catches input.js clears)
  document.addEventListener('input', function (event) {
    var input = event.target.closest('.discount-code .input');
    if (!input) return;
    var dc = input.closest('.discount-code');
    if (dc && dc.getAttribute('data-state') === 'error') setState(dc, 'default');
  });
})();
