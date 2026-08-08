/*
 * ============================================================
 * VEHICLE REGISTRATION — length validation
 * ============================================================
 * Opt in per instance by putting data-veh-reg on the wrapper:
 *
 *   <div class="veh-reg" data-veh-reg
 *        data-length="7"
 *        data-error-required="Vehicle registration is required."
 *        data-error-invalid="We couldn't find your vehicle…">
 *     <div class="veh-reg__field">
 *       …country badge…
 *       <input class="veh-reg__input" type="text" aria-label="Registration">
 *       <span class="veh-reg__status" role="img" aria-label="Registration complete">
 *         <svg viewBox="0 0 24 24" fill="none">
 *           <path class="veh-reg__status-disc"  d="…"/>
 *           <path class="veh-reg__status-glyph" d="…"/>
 *         </svg>
 *       </span>
 *     </div>
 *   </div>
 *
 * RULES
 *   - Length counts letters and digits only, so the space in "SH48 HSA" is
 *     free and "SH48HSA" and "sh48 hsa" all count as 7.
 *   - Hitting exactly data-length (default 7 — the UK plate format) marks the
 *     field valid and reveals the trailing tick. This is live, per keystroke.
 *   - A wrong length only surfaces an error once the field is left, or a gated
 *     control is pressed. Validating live would put "check the registration"
 *     on screen from the first letter typed. Editing clears the error again.
 *   - Empty and submitted → data-error-required.
 *     Wrong length, on blur or submit → data-error-invalid.
 *   - Typing is upper-cased in the value, not just by text-transform, so what
 *     is read back off the field matches what's on the plate.
 *
 * GATING A CONTROL
 *   <button data-veh-reg-submit>Find vehicle</button>
 * While the field is invalid the click is cancelled in the capture phase, so
 * handlers bound to the button itself — page navigation, form submit — never
 * run. Give the attribute a selector (data-veh-reg-submit="#reg") to name the
 * field; without one the nearest [data-veh-reg] is used.
 *
 * The error row is built here rather than sitting in the markup, since the copy
 * changes with the failure. It uses the component's own .veh-reg__message and
 * .veh-reg--error, so it looks the same as an error authored by hand.
 *
 * Self-initialising via event delegation — just include the script:
 *   <script src="vehicle-registration.js" defer></script>
 * ============================================================
 */

(function () {
  var DEFAULT_LENGTH = 7;                     /* 2 letters + 2 digits + 3 letters */

  /* icons/warning.svg — the circled "!" Figma shows on the Error state */
  var WARNING = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">'
    + '<path d="M11 12.5C11 12.7761 11.2239 13 11.5 13H12.5C12.7761 13 13 12.7761 13 12.5L13 7.5C13 7.22386 12.7761 7 12.5 7L11.5 7C11.2239 7 11 7.22386 11 7.5L11 12.5Z" fill="currentColor"/>'
    + '<path d="M12 17C12.6904 17 13.25 16.4404 13.25 15.75C13.25 15.0596 12.6904 14.5 12 14.5C11.3096 14.5 10.75 15.0596 10.75 15.75C10.75 16.4404 11.3096 17 12 17Z" fill="currentColor"/>'
    + '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" fill="currentColor"/>'
    + '</svg>';

  var seq = 0;                                /* for unique aria-describedby ids */

  function chars(value) { return (String(value).match(/[a-z0-9]/gi) || []).join(''); }

  function field(reg)  { return reg.querySelector('.veh-reg__field'); }
  function input(reg)  { return reg.querySelector('.veh-reg__input'); }
  function target(reg) { return parseInt(reg.dataset.length, 10) || DEFAULT_LENGTH; }

  function complete(reg) {
    var el = input(reg);
    return !!el && chars(el.value).length === target(reg);
  }


  /* --- error row ------------------------------------------------------- */

  function show(reg, text) {
    var row = reg.querySelector('.veh-reg__message');
    if (!row) {
      row = document.createElement('div');
      row.className = 'veh-reg__message';
      row.id        = 'veh-reg-message-' + (++seq);
      row.setAttribute('role', 'alert');      /* announce it when it appears */
      row.innerHTML = '<span class="veh-reg__message-icon">' + WARNING + '</span>'
                    + '<p class="veh-reg__message-text"></p>';
      reg.appendChild(row);
    }
    row.querySelector('.veh-reg__message-text').textContent = text;

    reg.classList.add('veh-reg--error');
    field(reg).classList.add('veh-reg__field--error');
    field(reg).classList.remove('veh-reg__field--valid');
    input(reg).setAttribute('aria-invalid', 'true');
    input(reg).setAttribute('aria-describedby', row.id);
  }

  function hide(reg) {
    var row = reg.querySelector('.veh-reg__message');
    if (row) row.remove();

    reg.classList.remove('veh-reg--error');
    field(reg).classList.remove('veh-reg__field--error');
    input(reg).removeAttribute('aria-invalid');
    input(reg).removeAttribute('aria-describedby');
  }


  /* --- state ----------------------------------------------------------- */

  /* Live pass: upper-case the value, flip the tick, and drop any standing
     error as soon as the field is touched. */
  function refresh(reg) {
    var el = input(reg);
    if (!el) return;

    var upper = el.value.toUpperCase();
    if (upper !== el.value) {
      var at = el.selectionStart;             /* same length, so the caret holds */
      el.value = upper;
      try { el.setSelectionRange(at, at); } catch (e) { /* not a text field */ }
    }

    field(reg).classList.toggle('veh-reg__field--valid', complete(reg));
    if (reg.classList.contains('veh-reg--error')) hide(reg);
  }

  /* Returns whether the field passes. `submitting` distinguishes leaving an
     empty field (say nothing — it hasn't been filled in yet) from trying to
     continue without one (say it's required). */
  function validate(reg, submitting) {
    if (complete(reg)) { hide(reg); return true; }

    var empty = chars(input(reg).value).length === 0;
    if (empty && !submitting) { hide(reg); return false; }

    show(reg, empty
      ? (reg.dataset.errorRequired || 'Vehicle registration is required.')
      : (reg.dataset.errorInvalid  || 'Check the registration number and try again.'));
    return false;
  }

  /* The [data-veh-reg] a gated control belongs to: the first one found in an
     ancestor, walking outwards, so a page with two fields gates the right one. */
  function fieldFor(control) {
    var selector = control.getAttribute('data-veh-reg-submit');
    if (selector) return document.querySelector(selector);

    for (var node = control.parentElement; node; node = node.parentElement) {
      var found = node.querySelector('[data-veh-reg]');
      if (found) return found;
    }
    return null;
  }


  /* --- wiring ---------------------------------------------------------- */

  document.addEventListener('input', function (event) {
    var el = event.target;
    if (!el.classList || !el.classList.contains('veh-reg__input')) return;
    var reg = el.closest('[data-veh-reg]');
    if (reg) refresh(reg);
  });

  /* blur doesn't bubble, so listen in the capture phase */
  document.addEventListener('blur', function (event) {
    var el = event.target;
    if (!el.classList || !el.classList.contains('veh-reg__input')) return;
    var reg = el.closest('[data-veh-reg]');
    if (reg) validate(reg, false);
  }, true);

  /* Capture, so this runs before any click handler on the control itself */
  document.addEventListener('click', function (event) {
    var control = event.target.closest && event.target.closest('[data-veh-reg-submit]');
    if (!control) return;

    var reg = fieldFor(control);
    if (!reg || validate(reg, true)) return;

    event.preventDefault();
    event.stopPropagation();
    input(reg).focus();
  }, true);

  /* Anything pre-filled in the markup starts in the right state */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-veh-reg]').forEach(refresh);
  });
})();
