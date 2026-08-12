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
 * A .discount-code--collapsible also opens and closes from its __toggle row,
 * tracked on data-open so the CSS can hide the form and turn the chevron.
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

    /* A collapsible one loses its collapse while a code is applied — the CSS hides
       the toggle, and this keeps data-open honest so nothing is left half-shut
       underneath it. Removing the code leaves it open with the field ready for
       another try, and the toggle comes back with it. */
    if (dc.classList.contains('discount-code--collapsible')) {
      dc.setAttribute('data-open', 'true');
      var t = dc.querySelector('.discount-code__toggle');
      if (t) t.setAttribute('aria-expanded', 'true');
    }
  }

  document.addEventListener('click', function (event) {
    /* Open / close a collapsible one. aria-expanded is set alongside data-open so
       the row announces its state rather than only looking like it has one. */
    var toggle = event.target.closest('.discount-code__toggle');
    if (toggle) {
      var host = toggle.closest('.discount-code');
      /* Nothing to fold while a code is applied; the toggle is hidden then, but a
         keyboard or a script could still reach it. */
      if (host && host.getAttribute('data-state') !== 'applied') {
        var open = host.getAttribute('data-open') !== 'true';
        host.setAttribute('data-open', open ? 'true' : 'false');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          var f = host.querySelector('.input');
          if (f) f.focus();
        }
      }
      return;
    }

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
