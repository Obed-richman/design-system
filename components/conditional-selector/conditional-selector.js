/*
 * ============================================================
 * CONDITIONAL SELECTOR — reveal the follow-up
 * ============================================================
 * Shows .conditional-selector__panel while the answer marked data-reveals is
 * the one selected, and hides it again otherwise. Marking the triggering radio
 * rather than naming a value in a data attribute keeps the two from drifting
 * apart when the option copy changes.
 *
 * More than one answer can carry data-reveals — the panel opens for any of
 * them, which covers "tell us more" following several options.
 *
 * Closing the panel **clears the follow-up**, so coming back to it means
 * answering again. A hidden answer that quietly persists is the wrong default:
 * it can still be read at submit, and on a screen that routes off an answer it
 * can send someone somewhere they didn't choose. Any error the follow-up was
 * showing goes too, since a hidden field complaining about itself is nonsense.
 *
 * Self-initialising via event delegation, and it syncs markup that starts out
 * answered — just include the script:
 *   <script src="conditional-selector.js" defer></script>
 * ============================================================
 */

(function () {
  function sync(root) {
    var panel = root.querySelector('.conditional-selector__panel');
    if (!panel) return;

    var triggers = root.querySelectorAll('[data-reveals]');
    var open = Array.prototype.some.call(triggers, function (el) { return el.checked; });

    if (panel.hidden === !open) return;            /* already in the right state */
    panel.hidden = !open;

    if (!open) {
      /* Clear the answers, so reopening asks again rather than remembering */
      panel.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (el.type === 'radio' || el.type === 'checkbox') el.checked = false;
        else el.value = '';
      });

      /* Drop any error the follow-up was showing — it can't be answered now */
      panel.querySelectorAll('[data-journey-invalid]').forEach(function (el) {
        el.removeAttribute('data-journey-invalid');
      });
      panel.querySelectorAll('.journey-error').forEach(function (msg) { msg.remove(); });
      panel.querySelectorAll('.input-field--error').forEach(function (field) {
        field.classList.remove('input-field--error');
      });
      panel.querySelectorAll('[aria-invalid]').forEach(function (el) {
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');
      });
    }
  }

  document.addEventListener('change', function (event) {
    var root = event.target.closest && event.target.closest('.conditional-selector');
    if (root) sync(root);
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.conditional-selector').forEach(sync);
  });
})();
