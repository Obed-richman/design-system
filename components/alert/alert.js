/*
 * ============================================================
 * ALERT — dismiss behaviour
 * ============================================================
 * Clicking .alert__close fades the parent .alert out and removes it.
 *
 * Self-initialising via event delegation — just include the script:
 *   <script src="alert.js"></script>
 * ============================================================
 */

(function () {
  document.addEventListener('click', function (event) {
    var closeBtn = event.target.closest('.alert__close');
    if (!closeBtn) return;

    var alert = closeBtn.closest('.alert');
    if (!alert) return;

    var remove = function () { if (alert.isConnected) alert.remove(); };

    // Graceful fade, then remove (with a timeout fallback if the
    // transition doesn't fire, e.g. reduced-motion / display quirks).
    alert.style.transition = 'opacity 150ms ease';
    alert.style.opacity = '0';
    alert.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 250);
  });
})();
