/*
 * ============================================================
 * TEXT INPUT — clear button + segmented date entry
 * ============================================================
 * Wires up the clear (×) button shown in the focused / error states.
 * Clicking .input__clear empties the field's .input, re-focuses it and
 * fires an `input` event so any listeners (validation, etc.) update.
 *
 * Also drives the segmented MM / YYYY field — see the DATE ENTRY section below.
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


/*
 * ============================================================
 * SELECT — a field that opens a Dropdown List
 * ============================================================
 * Markup and the reasoning behind the readonly input are in the SELECT section
 * of input.css. Opt in with data-select on the group:
 *
 *   <div class="input-group input-select" data-select>
 *     <span class="input-label input-label--title" id="owner-label">…</span>
 *     <div class="input-field">
 *       <input class="input input-select__value" type="text" readonly placeholder="Select"
 *              role="combobox" aria-expanded="false" aria-controls="owner-list"
 *              aria-labelledby="owner-label">
 *       <span class="input-select__chevron">…UI / Chevron Small…</span>
 *     </div>
 *     <div class="dropdown-list input-select__list" id="owner-list" role="listbox" hidden>
 *       <button class="dropdown-item" type="button" role="option">
 *         <span class="dropdown-item__label">Option</span>
 *       </button>
 *     </div>
 *   </div>
 *
 * Picking a row writes its label into the field and fires input + change, so
 * listeners see it as an ordinary field edit. Clicking away or pressing Escape
 * closes it; Escape and a click on the field return focus to the field, since
 * losing your place after closing a menu is disorienting. Down/Up open the list
 * and step through the rows, which are real buttons, so Tab works too.
 * ============================================================
 */

(function () {
  function parts(root) {
    return {
      value: root.querySelector('.input-select__value'),
      list:  root.querySelector('.input-select__list')
    };
  }

  function open(root, yes) {
    var p = parts(root);
    if (!p.value || !p.list) return;
    root.setAttribute('data-open', yes ? 'true' : 'false');
    p.list.hidden = !yes;
    p.value.setAttribute('aria-expanded', yes ? 'true' : 'false');
  }

  function isOpen(root) { return root.getAttribute('data-open') === 'true'; }

  function closeAll(except) {
    document.querySelectorAll('[data-select][data-open="true"]').forEach(function (root) {
      if (root !== except) open(root, false);
    });
  }

  function rows(root) {
    return Array.prototype.slice.call(root.querySelectorAll('.input-select__list .dropdown-item'));
  }

  function choose(root, item) {
    var p = parts(root);
    var label = item.querySelector('.dropdown-item__label') || item;

    p.value.value = label.textContent.trim();
    rows(root).forEach(function (r) {
      r.setAttribute('aria-selected', String(r === item));
      r.hidden = false;              /* drop the filter — reopening shows them all */
    });

    open(root, false);
    p.value.focus();
    /* both, so validation listening for either kind of edit picks it up */
    p.value.dispatchEvent(new Event('input',  { bubbles: true }));
    p.value.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* --- FILTERING — data-select-filter ------------------------------------
     Turns the Select into a combo box: the field is typeable, and what is typed
     narrows the list instead of being the value. The value is still only ever
     chosen from the list, so nothing unrecognised can be submitted.

     Matching is on the row's whole label, so "SP30" and "speed" both find the
     same row — people search by the code they have OR the words they remember.
     ------------------------------------------------------------------------ */
  document.addEventListener('input', function (event) {
    var root = event.target.closest && event.target.closest('[data-select][data-select-filter]');
    if (!root) return;
    var p = parts(root);
    if (event.target !== p.value) return;

    var needle = p.value.value.trim().toLowerCase();
    var all = rows(root);

    /* The field now holds a whole row's label rather than a search term, so this
       is a CHOSEN value, not typing — choose() dispatches input so the gate and
       any other listener see the edit, and without this that echo would filter
       the list down to the one row just picked. Show everything and stand down. */
    var chosen = needle && all.some(function (r) { return r.textContent.trim().toLowerCase() === needle; });
    if (chosen) {
      all.forEach(function (r) { r.hidden = false; });
      return;
    }

    var shown = 0;
    all.forEach(function (r) {
      var hit = !needle || r.textContent.toLowerCase().indexOf(needle) !== -1;
      r.hidden = !hit;
      if (hit) shown++;
    });
    /* Nothing to choose from is worse than no menu at all */
    open(root, shown > 0);
  });

  document.addEventListener('click', function (event) {
    var root = event.target.closest && event.target.closest('[data-select]');
    if (!root) { closeAll(null); return; }     /* a click anywhere else closes */

    closeAll(root);

    var item = event.target.closest('.input-select__list .dropdown-item');
    if (item) { choose(root, item); return; }

    if (event.target.closest('.input-field')) {
      open(root, !isOpen(root));
      parts(root).value.focus();
    }
  });

  document.addEventListener('keydown', function (event) {
    var root = event.target.closest && event.target.closest('[data-select]');
    if (!root) return;
    var p = parts(root);
    var all = rows(root);

    if (event.key === 'Escape' && isOpen(root)) {
      open(root, false);
      p.value.focus();
      event.preventDefault();
      return;
    }

    if (event.target === p.value) {
      /* On a FILTERABLE select the field is a text box first: Space and Enter are
         typing and submitting, not "open the menu". Only the arrow moves focus
         into the list, and the list opens as you type (see the input handler). */
      var filtering = root.hasAttribute('data-select-filter');
      var opens = filtering ? ['ArrowDown'] : ['ArrowDown', 'Enter', ' '];
      if (opens.indexOf(event.key) !== -1) {
        if (!isOpen(root)) open(root, true);
        if (all.length) all[0].focus();
        event.preventDefault();          /* Space would scroll the page */
      }
      return;
    }

    var at = all.indexOf(event.target);
    if (at === -1) return;
    if (event.key === 'ArrowDown' && all[at + 1]) { all[at + 1].focus(); event.preventDefault(); }
    if (event.key === 'ArrowUp') {
      if (all[at - 1]) all[at - 1].focus();
      else p.value.focus();
      event.preventDefault();
    }
  });
})();


/*
 * ============================================================
 * COUNTER — data-counter
 * ============================================================
 * Keeps an .input-counter in step with what's typed:
 *
 *   <input class="input" maxlength="16" data-counter="licence-count">
 *   <p class="input-counter" id="licence-count">0 of 16</p>
 *
 * The total comes from maxlength, so there is one place to change it. Counts
 * characters as typed — no trimming — because that is what the field will hold.
 * ============================================================
 */

(function () {
  function sync(el) {
    var out = document.getElementById(el.dataset.counter);
    if (!out) return;
    var max = el.getAttribute('maxlength');
    out.textContent = el.value.length + (max ? ' of ' + max : '');
  }

  document.addEventListener('input', function (event) {
    if (event.target.dataset && event.target.dataset.counter) sync(event.target);
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-counter]').forEach(sync);
  });
})();


/*
 * ============================================================
 * PHONE — country-code prefix
 * ============================================================
 * Markup and layout are in the PHONE section of input.css. Opt in with
 * data-phone on the field:
 *
 *   <div class="input-field input-phone" data-phone>
 *     <button class="input-phone__prefix" type="button" aria-expanded="false"
 *             aria-controls="mobile-codes" aria-label="Dialling code">
 *       <span class="input-phone__code">+44</span>
 *       <span class="input-phone__chevron">…chevron…</span>
 *     </button>
 *     <input class="input" type="tel" …>
 *     <input type="hidden" data-phone-code value="+44">
 *     <div class="dropdown-list input-phone__list" id="mobile-codes" role="listbox" hidden>
 *       <button class="dropdown-item" type="button" role="option" data-code="+44">…</button>
 *     </div>
 *   </div>
 *
 * Only the prefix opens the list — clicking anywhere else in the field puts the
 * caret in the number, which is what the field is mostly for. Picking a country
 * writes its code into the panel and the hidden input, then returns focus to the
 * number so the flow carries on where it left off.
 * ============================================================
 */

(function () {
  function list(root)   { return root.querySelector('.input-phone__list'); }
  function number(root) { return root.querySelector('.input'); }

  function open(root, yes) {
    var menu = list(root);
    if (!menu) return;
    root.setAttribute('data-open', yes ? 'true' : 'false');
    menu.hidden = !yes;
    var prefix = root.querySelector('.input-phone__prefix');
    if (prefix) prefix.setAttribute('aria-expanded', yes ? 'true' : 'false');
  }

  function closeAll(except) {
    document.querySelectorAll('[data-phone][data-open="true"]').forEach(function (root) {
      if (root !== except) open(root, false);
    });
  }

  document.addEventListener('click', function (event) {
    var root = event.target.closest && event.target.closest('[data-phone]');
    if (!root) { closeAll(null); return; }
    closeAll(root);

    var picked = event.target.closest('.input-phone__list .dropdown-item');
    if (picked) {
      var code = picked.getAttribute('data-code') || '';
      var shown = root.querySelector('.input-phone__code');
      var store = root.querySelector('[data-phone-code]');
      if (shown) shown.textContent = code;
      if (store) store.value = code;

      root.querySelectorAll('.input-phone__list .dropdown-item').forEach(function (row) {
        row.setAttribute('aria-selected', String(row === picked));
      });

      open(root, false);
      var el = number(root);
      if (el) el.focus();
      return;
    }

    if (event.target.closest('.input-phone__prefix')) {
      open(root, root.getAttribute('data-open') !== 'true');
    }
  });

  document.addEventListener('keydown', function (event) {
    var root = event.target.closest && event.target.closest('[data-phone]');
    if (!root || event.key !== 'Escape') return;
    if (root.getAttribute('data-open') !== 'true') return;
    open(root, false);
    var prefix = root.querySelector('.input-phone__prefix');
    if (prefix) prefix.focus();
    event.preventDefault();
  });
})();


/*
 * ============================================================
 * EMAIL — data-validate="email"
 * ============================================================
 * A format check, not a required check: an empty field is left to whatever owns
 * "required" (in the prototype, the journey's Continue gate). Judged on blur and
 * cleared the moment the field is edited — the same "confirm live, complain
 * late" timing the rest of the journey uses, since complaining at someone
 * halfway through typing an address they haven't finished is noise.
 *
 * The test is deliberately loose: something before an @, something after it, and
 * a dot in the tail. Anything stricter starts rejecting addresses that work.
 * Copy comes from data-email-error.
 * ============================================================
 */

(function () {
  var LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var seq = 0;

  function group(el) { return el.closest('.input-group') || el.parentElement; }

  function show(el, text) {
    var host = group(el);
    var msg  = host.querySelector('.input-message--error');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'input-message input-message--error';
      msg.id = 'input-email-message-' + (++seq);
      msg.setAttribute('role', 'alert');
      host.appendChild(msg);
    }
    msg.textContent = text;
    el.closest('.input-field').classList.add('input-field--error');
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', msg.id);
  }

  function hide(el) {
    var msg = group(el).querySelector('.input-message--error');
    if (msg) msg.remove();
    el.closest('.input-field').classList.remove('input-field--error');
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  }

  document.addEventListener('blur', function (event) {
    var el = event.target;
    if (!el.dataset || el.dataset.validate !== 'email') return;
    var value = el.value.trim();
    if (!value || LOOKS_LIKE_EMAIL.test(value)) hide(el);
    else show(el, el.dataset.emailError || 'Please provide a valid email address.');
  }, true);

  document.addEventListener('input', function (event) {
    var el = event.target;
    if (el.dataset && el.dataset.validate === 'email') hide(el);
  });
})();


/*
 * ============================================================
 * DATE ENTRY — segmented, DD / MM / YYYY or MM / YYYY
 * ============================================================
 * Inputs either side of real "/" elements, so the separators are on screen
 * before anything is typed and never move. Markup and the reasoning behind the
 * segment widths are in the DATE ENTRY section of input.css.
 *
 * The segments are whatever the markup declares, in DOM order — a purchase date
 * is month + year, a date of birth is day + month + year. Each part names itself
 * with a modifier class and the ranges below come from that, so adding a part is
 * a markup change rather than a code one.
 *
 * TYPING
 *   - digits only; each segment is capped by its own maxlength
 *   - a first digit that could only be a padded value is padded: "5" in a month
 *     becomes "05", "4" in a day becomes "04", and focus moves on. A second
 *     digit that would push the part out of range is refused. So a month outside
 *     01–12 or a day outside 01–31 can't be typed at all, which is why there is
 *     no message for either.
 *   - a full segment hands over to the next one
 *   - Backspace in an empty segment steps back into the previous one, and the
 *     arrow keys cross between segments at their edges
 *
 * FUTURE DATES — data-date-max="today"
 * Judged once every segment is full, since a part-typed year says nothing. A
 * date after today shows an error below the field and marks the segments
 * aria-invalid; editing any segment clears it, and it comes back if the date is
 * still in the future. The keystrokes aren't swallowed — refusing them silently
 * reads as a broken field, where a message says what is actually wrong. Copy
 * comes from data-date-error, so it stays with the page.
 *
 * A WINDOW — data-date-within="3"
 * Both bounds at once: no later than today and no earlier than N years back.
 * For a question that asks about a period — claims in the last 3 years,
 * convictions in the last 5 — where a date outside the window isn't being asked
 * about at all. Implies data-date-max="today", so it replaces it rather than
 * joining it, and shares data-date-error.
 *
 * Day ranges are 01–31 regardless of month: a real calendar check would need
 * copy for "that date doesn't exist", which no design specifies yet.
 * ============================================================
 */

(function () {
  var seq = 0;                                  /* for unique message ids */

  /* max value, and the first-digit threshold above which the only possible
     value is a zero-padded one */
  var RANGES = {
    day:   { max: 31, pad: 3 },
    month: { max: 12, pad: 1 },
    year:  { max: null }
  };

  function digits(str) { return (String(str).match(/\d/g) || []).join(''); }

  /* Segments in DOM order */
  function segments(root) {
    return Array.prototype.slice.call(root.querySelectorAll('.input-date__part'));
  }

  function kindOf(part) {
    for (var name in RANGES) {
      if (part.classList.contains('input-date__part--' + name)) return name;
    }
    return 'year';                              /* unlabelled: treat as free digits */
  }

  function full(part) {
    return digits(part.value).length === (+part.getAttribute('maxlength') || 0);
  }

  function caretToEnd(el) {
    try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) {}
  }


  /* --- error message ---------------------------------------------------- */

  function show(root, text) {
    var group = root.closest('.input-group') || root.parentElement;
    var msg   = group.querySelector('.input-message--error');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'input-message input-message--error';
      msg.id        = 'input-date-message-' + (++seq);
      msg.setAttribute('role', 'alert');
      group.appendChild(msg);
    }
    msg.textContent = text;

    root.classList.add('input-field--error');
    segments(root).forEach(function (el) {
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', msg.id);
    });
  }

  function hide(root) {
    var group = root.closest('.input-group') || root.parentElement;
    var msg   = group.querySelector('.input-message--error');
    if (msg) msg.remove();

    root.classList.remove('input-field--error');
    segments(root).forEach(function (el) {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    });
  }


  /* --- validation ------------------------------------------------------- */

  function check(root) {
    var parts = segments(root);
    if (!parts.length || !parts.every(full)) { hide(root); return true; }

    var within = +root.dataset.dateWithin || 0;

    if (root.dataset.dateMax === 'today' || within) {
      var value = {};
      parts.forEach(function (p) { value[kindOf(p)] = +digits(p.value); });

      var now  = new Date();
      var year = value.year;
      /* Day is optional: a month/year date counts as in the past for the whole
         of that month, which is what a purchase date means. */
      var future = year > now.getFullYear()
        || (year === now.getFullYear() && value.month > now.getMonth() + 1)
        || (year === now.getFullYear() && value.month === now.getMonth() + 1
            && value.day !== undefined && value.day > now.getDate());

      /* The floor of the window, N years back to the same month. Compared the
         same way round as the ceiling above, so the two agree about a date that
         lands exactly on the boundary month: it is inside the window. */
      var floorYear = now.getFullYear() - within;
      var early = within && (year < floorYear
        || (year === floorYear && value.month < now.getMonth() + 1));

      if (future || early) {
        show(root, root.dataset.dateError || 'That date is in the future.');
        return false;
      }
    }

    hide(root);
    return true;
  }


  /* --- typing ----------------------------------------------------------- */

  function onType(root, part) {
    var parts = segments(root);
    var range = RANGES[kindOf(part)] || {};
    var typed = digits(part.value);
    var next  = parts[parts.indexOf(part) + 1];

    if (range.max) {
      if (typed.length === 1 && +typed > range.pad) {   /* can only be 0X */
        part.value = '0' + typed;
        if (next) next.focus();
        return;
      }
      if (full(part) && (+typed < 1 || +typed > range.max)) {
        part.value = typed.slice(0, -1);                /* refuse the last digit */
        return;
      }
    }

    part.value = typed;
    if (full(part) && next) next.focus();
  }

  document.addEventListener('input', function (event) {
    var el = event.target;
    if (!el.classList || !el.classList.contains('input-date__part')) return;

    var root = el.closest('.input-date');
    if (!root) return;

    onType(root, el);
    check(root);
  });

  document.addEventListener('keydown', function (event) {
    var el = event.target;
    if (!el.classList || !el.classList.contains('input-date__part')) return;

    var root = el.closest('.input-date');
    if (!root) return;
    var parts = segments(root);
    var at    = parts.indexOf(el);
    var prev  = parts[at - 1];
    var next  = parts[at + 1];

    /* Backspace in an empty segment steps back with the caret at the end, so
       the next press eats a digit rather than doing nothing */
    if (event.key === 'Backspace' && !el.value && prev) {
      prev.focus();
      caretToEnd(prev);
      return;
    }
    if (event.key === 'ArrowLeft' && prev && el.selectionStart === 0) {
      prev.focus();
      caretToEnd(prev);
      event.preventDefault();
    }
    if (event.key === 'ArrowRight' && next && el.selectionStart === el.value.length) {
      next.focus();
      try { next.setSelectionRange(0, 0); } catch (e) {}
      event.preventDefault();
    }
  });

  /* Judge anything pre-filled in the markup */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.input-date').forEach(check);
  });
})();
