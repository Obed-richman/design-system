/*
 * ============================================================
 * GLOBAL ALERT — raising, the cap, and the Success timer
 * ============================================================
 * Exposes one object:
 *
 *   GlobalAlert.show({ state, message, title, dismissible, timeout })  → element
 *   GlobalAlert.dismiss(element)
 *   GlobalAlert.clear()
 *   GlobalAlert.showing()                                             → array
 *
 *   state        'error' | 'warning' | 'success'   (default 'error')
 *   message      the sentence. Set as TEXT, never HTML — a message can carry a
 *                value someone typed, and that must not become markup.
 *   title        optional bold line above it
 *   dismissible  show the close (default true)
 *   timeout      ms before it retires itself. Defaults below.
 *
 * WHAT THIS FILE OWNS, and what it doesn't: the close button is Alert's own
 * behaviour (alert.js) and is deliberately not reimplemented here — load both.
 *
 * THE CAP IS TWO. A third message drops the OLDEST, because the newest is the one
 * that just happened and the stack has to stay readable. Two is a stack; a dozen
 * is a wall, and a wall gets dismissed unread.
 *
 * SUCCESS RETIRES ITSELF, ERROR AND WARNING PERSIST. A confirmation has been read
 * by the time it's understood, so leaving it there makes the reader tidy up after
 * good news. A fault has to be acted on, and a message that vanishes mid-read
 * takes the instruction with it. Warning sits with Error rather than with Success:
 * it is also something to act on. Override per call with `timeout`.
 * ============================================================
 */

(function () {
  var STATES = {
    error:   'alert--negative',
    warning: 'alert--warning',
    success: 'alert--positive'
  };

  /* 0 means never — see the note above */
  var TIMEOUTS = { error: 0, warning: 0, success: 5000 };

  var CAP = 2;

  /* icons/warning.svg — Error and Warning */
  var WARNING = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 12.5C11 12.7761 11.2239 13 11.5 13H12.5C12.7761 13 13 12.7761 13 12.5L13 7.5C13 7.22386 12.7761 7 12.5 7L11.5 7C11.2239 7 11 7.22386 11 7.5L11 12.5Z" fill="currentColor"/><path d="M12 17C12.6904 17 13.25 16.4404 13.25 15.75C13.25 15.0596 12.6904 14.5 12 14.5C11.3096 14.5 10.75 15.0596 10.75 15.75C10.75 16.4404 11.3096 17 12 17Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" fill="currentColor"/></svg>';

  /* icons/tick.svg — Success. Outline, not the filled disc: inside a coloured
     alert the disc would be a second surface competing with the panel. */
  var TICK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.4866 14.5576L15.9072 9.13697C16.1025 8.94171 16.4191 8.94171 16.6143 9.13697L17.3214 9.84408C17.5167 10.0393 17.5167 10.3559 17.3214 10.5512L10.8513 17.0213C10.656 17.2166 10.3394 17.2166 10.1442 17.0213L6.60355 13.4807C6.40829 13.2854 6.40829 12.9689 6.60355 12.7736L7.29953 12.0776C7.4948 11.8824 7.81138 11.8824 8.00664 12.0776L10.4866 14.5576Z" fill="currentColor"/></svg>';

  /* icons/close.svg */
  var CLOSE = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor" fill-opacity="0.3"/><path d="M14.7332 16.3392C14.9277 16.5389 15.2479 16.541 15.445 16.3439L16.1521 15.6369C16.3455 15.4435 16.3476 15.1305 16.1567 14.9345L13.3132 12.0141L16.2433 9.16117C16.443 8.96671 16.4452 8.64648 16.248 8.44937L15.541 7.74233C15.3476 7.54891 15.0346 7.54682 14.8386 7.73764L11.9181 10.5812L9.06528 7.6512C8.87082 7.45148 8.55059 7.44934 8.35349 7.64645L7.64644 8.35349C7.45302 8.54691 7.45093 8.85986 7.64175 9.05585L10.4853 11.9763L7.55531 14.8291C7.35559 15.0236 7.35345 15.3438 7.55056 15.5409L8.2576 16.2479C8.45103 16.4414 8.76397 16.4434 8.95996 16.2526L11.8804 13.4092L14.7332 16.3392Z" fill="currentColor"/></svg>';

  /* The stack, made on first use. Mounted on <body> so no ancestor with
     container-type / contain / a transform can capture the fixed positioning —
     that would pin it to a card instead of the viewport. */
  function stack() {
    var el = document.querySelector('[data-global-alert]');
    if (el) return el;
    el = document.createElement('div');
    el.className = 'global-alert';
    el.setAttribute('data-global-alert', '');
    /* polite, not assertive: it interrupts nothing, and an assertive region
       talks over whatever the reader is in the middle of */
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
    return el;
  }

  function remove(el) {
    if (el._gaTimer) clearTimeout(el._gaTimer);
    if (el.isConnected) el.remove();
  }

  /* Fade, then remove — with a timeout fallback, since transitionend never fires
     under reduced-motion or on a hidden element */
  function retire(el) {
    if (el.dataset.leaving !== undefined) return;      /* already on its way out */
    el.dataset.leaving = '';
    el.addEventListener('transitionend', function () { remove(el); }, { once: true });
    setTimeout(function () { remove(el); }, 250);
  }

  function show(options) {
    var o     = options || {};
    var state = STATES[o.state] ? o.state : 'error';
    var host  = stack();

    var alert = document.createElement('div');
    alert.className = 'alert alert--bordered ' + STATES[state];
    /* role on the message, not the region: each one announces itself as it
       arrives, which is what a reader needs when two are on screen */
    alert.setAttribute('role', state === 'success' ? 'status' : 'alert');

    var icon = document.createElement('span');
    icon.className = 'alert__icon';
    icon.innerHTML = state === 'success' ? TICK : WARNING;
    alert.appendChild(icon);

    var content = document.createElement('div');
    content.className = 'alert__content';
    if (o.title) {
      var title = document.createElement('p');
      title.className = 'alert__title';
      title.textContent = o.title;                     /* text, never HTML */
      content.appendChild(title);
    }
    var body = document.createElement('p');
    body.className = 'alert__description';
    body.textContent = o.message || '';                /* text, never HTML */
    content.appendChild(body);
    alert.appendChild(content);

    if (o.dismissible !== false) {
      var close = document.createElement('button');
      close.className = 'alert__close';
      close.type = 'button';
      close.setAttribute('aria-label', 'Dismiss');
      close.innerHTML = CLOSE;
      alert.appendChild(close);                        /* alert.js does the rest */
    }

    host.appendChild(alert);

    /* Cap at two, oldest first — the newest is the one that just happened */
    while (host.children.length > CAP) remove(host.firstElementChild);

    var ms = o.timeout === undefined ? TIMEOUTS[state] : o.timeout;
    if (ms > 0) alert._gaTimer = setTimeout(function () { retire(alert); }, ms);

    return alert;
  }

  function showing() {
    var host = document.querySelector('[data-global-alert]');
    return host ? Array.prototype.slice.call(host.children) : [];
  }

  window.GlobalAlert = {
    show:    show,
    dismiss: function (el) { if (el) retire(el); },
    clear:   function () { showing().forEach(remove); },
    showing: showing
  };
})();
