/*
 * ============================================================
 * MODAL — open, close, and the things that should close it
 * ============================================================
 * Declarative:  <button data-modal-open="discard">   <button data-modal-close>
 * From script:  Modal.open('discard' | element)  ·  Modal.close(...)  ·  Modal.isOpen()
 *
 * Closing is deliberately generous — backdrop, Escape, and any [data-modal-close]
 * — because a dialogue you cannot dismiss is a trap. The exception is opt-out:
 * data-modal-locked keeps a modal up until one of its own actions is taken, for
 * the rare case where dismissing IS an answer and shouldn't be given by accident.
 *
 * Mounted on <body> when opened. A modal is fixed, and an ancestor carrying
 * container-type, contain or a transform becomes the containing block for fixed
 * descendants — inside a card it would be pinned to the card. Moving it is the
 * only reliable fix, so it happens here rather than being left to remember.
 *
 * Focus: the panel takes focus on open and the opener gets it back on close, so
 * keyboard and screen-reader users aren't dropped at the top of the page. Focus
 * is not trapped — that wants a full implementation, see KNOWN-ISSUES.
 * ============================================================
 */

(function () {
  var openers = [];        /* stack: what to hand focus back to, per open modal */

  function find(target) {
    if (!target) return null;
    return typeof target === 'string' ? document.getElementById(target) : target;
  }

  function open(target, opener) {
    var modal = find(target);
    if (!modal || !modal.hidden) return null;

    if (modal.parentElement !== document.body) document.body.appendChild(modal);
    modal.hidden = false;
    /* Stop the page behind from scrolling under the scrim */
    document.documentElement.style.overflow = 'hidden';

    openers.push(opener || document.activeElement);

    var panel = modal.querySelector('.modal__panel');
    if (panel) {
      if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1');
      panel.focus();
    }
    return modal;
  }

  function close(target) {
    var modal = find(target) || document.querySelector('.modal:not([hidden])');
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    if (!document.querySelector('.modal:not([hidden])')) {
      document.documentElement.style.overflow = '';
    }

    var opener = openers.pop();
    if (opener && opener.isConnected && typeof opener.focus === 'function') opener.focus();
  }

  function isOpen(target) {
    var modal = find(target);
    return modal ? !modal.hidden : !!document.querySelector('.modal:not([hidden])');
  }

  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-modal-open]');
    if (opener) { open(opener.getAttribute('data-modal-open'), opener); return; }

    var closer = event.target.closest('[data-modal-close]');
    if (closer) { close(closer.closest('.modal')); return; }

    /* Backdrop — the scrim itself, not anything inside the panel */
    var modal = event.target.closest('.modal');
    if (modal && event.target === modal && !modal.hasAttribute('data-modal-locked')) close(modal);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var modal = document.querySelector('.modal:not([hidden])');
    if (modal && !modal.hasAttribute('data-modal-locked')) close(modal);
  });

  window.Modal = { open: open, close: close, isOpen: isOpen };
})();
