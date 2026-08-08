/*
 * ============================================================
 * ADDRESS LOOKUP — search, choose, edit
 * ============================================================
 * Drives the three stages described in address-lookup.css. Opt in with
 * data-address-lookup on the wrapper; the stages are marked with
 * data-stage="search|chosen|manual" and only one is ever shown.
 *
 * SEARCHING IS FAKED. There is no address service behind this, so a search
 * builds four plausible addresses from whatever postcode was typed — enough for
 * the flow to be exercised with any input, which is what a prototype needs. The
 * street and town come from data-sample-street / data-sample-town so the copy
 * stays in the markup. Swap `results()` for a fetch when there is a real service.
 *
 * FLOW
 *   type a postcode → search (button, Enter or the glyph) → results open
 *   pick a result                → CHOSEN, summary shows the address
 *   pick "Enter address manually" → MANUAL, empty fields
 *   Edit on the summary           → MANUAL, fields pre-filled from the address
 *   Save address                  → CHOSEN, summary shows what was typed
 *
 * The chosen address is written to a hidden input so everything that reads
 * `.input` values — form serialisation, the journey's required-field gate — sees
 * the address as one answered field rather than four, or none.
 *
 * Self-initialising via event delegation:
 *   <script src="address-lookup.js" defer></script>
 * ============================================================
 */

(function () {
  var POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

  function stage(root, name) { return root.querySelector('[data-stage="' + name + '"]'); }
  function show(root, name) {
    ['search', 'chosen', 'manual'].forEach(function (s) {
      var el = stage(root, s);
      if (el) el.hidden = s !== name;
    });
    var results = root.querySelector('.address-lookup__results');
    if (results) results.hidden = true;
  }

  function field(root, name) { return root.querySelector('[data-address="' + name + '"]'); }

  /* The value everything else reads: the whole address on one line. The parts
     are kept alongside it so Edit can open the form already filled in, which is
     what the design shows — being sent back to four empty fields after choosing
     an address would be worse than not offering Edit at all. */
  function commit(root, parts) {
    root.dataset.chosen = JSON.stringify(parts);

    var store = field(root, 'value');
    if (!store) return;
    store.value = lines(parts).join(', ');
    store.dispatchEvent(new Event('input',  { bubbles: true }));
    store.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* How an address reads: street, then anything else, then town + postcode */
  function lines(parts) {
    return [
      parts.line1,
      parts.line2,
      [parts.city, parts.postcode].filter(Boolean).join(', ')
    ].filter(Boolean);
  }

  function chosen(root) {
    try { return JSON.parse(root.dataset.chosen || '{}'); } catch (e) { return {}; }
  }

  var FIELDS = { line1: 'line1', line2: 'line2', city: 'city', postcode: 'postcode-manual' };

  function fill(root, parts) {
    Object.keys(FIELDS).forEach(function (key) {
      var el = field(root, FIELDS[key]);
      if (el) el.value = parts[key] || '';
    });
  }

  function read(root) {
    var parts = {};
    Object.keys(FIELDS).forEach(function (key) {
      var el = field(root, FIELDS[key]);
      parts[key] = el ? el.value.trim() : '';
    });
    return parts;
  }

  function summarise(root, parts) {
    var box = root.querySelector('.address-lookup__lines');
    if (box) box.innerHTML = lines(parts).map(function (l, i) {
      return i ? '<br>' + l : l;
    }).join('');
  }


  /* --- faked search ----------------------------------------------------- */

  function results(root, postcode) {
    var street = root.dataset.sampleStreet || 'Elaine Street';
    var town   = root.dataset.sampleTown   || 'Liverpool';
    var tidy   = postcode.toUpperCase().replace(/\s+/g, ' ').trim();
    var out = [];
    for (var n = 1; n <= 4; n++) {
      out.push({ line1: n + ' ' + street, line2: town + ', ' + tidy });
    }
    return out;
  }

  var CHEVRON = '<svg viewBox="0 0 7 12" fill="none" aria-hidden="true"><path d="M1.98792 0.169026C1.75193 -0.0595573 1.37599 -0.0558328 1.14457 0.177381L0.174098 1.1554C-0.061348 1.39267 -0.0574932 1.7766 0.18267 2.0091L3.77064 5.48258C3.93167 5.63848 3.9332 5.89626 3.77401 6.05405L0.285904 9.51164C0.0495571 9.74592 0.049031 10.1278 0.284731 10.3627L1.26078 11.3356C1.49447 11.5685 1.8724 11.569 2.10674 11.3367L6.29663 7.18351C7.09241 6.39469 7.08497 5.10608 6.28013 4.32651L1.98792 0.169026Z" fill="currentColor"/></svg>';

  function search(root) {
    var input = field(root, 'postcode');
    var list  = root.querySelector('.address-lookup__results');
    if (!input || !list) return;

    var postcode = input.value.trim();
    if (!postcode) return;

    var rows = results(root, postcode).map(function (a) {
      return '<button class="dropdown-item address-lookup__result" type="button" role="option"'
           + ' data-line1="' + a.line1 + '" data-line2="' + a.line2 + '">'
           + '<span class="address-lookup__result-text">'
           +   '<span class="dropdown-item__label">' + a.line1 + '</span>'
           +   '<span class="address-lookup__result-sub">' + a.line2 + '</span>'
           + '</span></button>';
    });

    rows.push('<button class="dropdown-item address-lookup__manual-link" type="button"'
      + ' data-address-manual>'
      + '<span class="dropdown-item__label">' + (root.dataset.manualLabel || 'Enter address manually') + '</span>'
      + '<span class="address-lookup__chevron">' + CHEVRON + '</span></button>');

    list.innerHTML = rows.join('');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }


  /* --- wiring ----------------------------------------------------------- */

  document.addEventListener('click', function (event) {
    var root = event.target.closest && event.target.closest('[data-address-lookup]');

    /* a click anywhere else closes an open result list */
    if (!root) {
      document.querySelectorAll('[data-address-lookup] .address-lookup__results')
        .forEach(function (l) { l.hidden = true; });
      return;
    }

    if (event.target.closest('[data-address-search]')) { search(root); return; }

    var picked = event.target.closest('.address-lookup__result');
    if (picked) {
      /* the second line of a result is "Town, POSTCODE" */
      var tail  = (picked.getAttribute('data-line2') || '').split(',');
      var parts = {
        line1:    picked.getAttribute('data-line1') || '',
        line2:    '',
        city:     (tail[0] || '').trim(),
        postcode: (tail[1] || '').trim()
      };
      summarise(root, parts);
      commit(root, parts);
      show(root, 'chosen');
      return;
    }

    if (event.target.closest('[data-address-manual]')) {
      fill(root, {});                       /* nothing chosen yet — start empty */
      show(root, 'manual');
      var first = field(root, 'line1');
      if (first) first.focus();
      return;
    }

    if (event.target.closest('[data-address-edit]')) {
      fill(root, chosen(root));             /* open on what was chosen */
      show(root, 'manual');
      var line1 = field(root, 'line1');
      if (line1) line1.focus();
      return;
    }

    if (event.target.closest('[data-address-save]')) {
      var typed = read(root);
      summarise(root, typed);
      commit(root, typed);
      show(root, 'chosen');
      return;
    }
  });

  /* Enter in the postcode field searches rather than submitting the page */
  document.addEventListener('keydown', function (event) {
    var el = event.target;
    if (!el.matches || !el.matches('[data-address="postcode"]')) return;
    if (event.key !== 'Enter') return;
    event.preventDefault();
    var root = el.closest('[data-address-lookup]');
    if (root) search(root);
  });

  /* Typing a complete postcode is enough to offer results without pressing
     anything — the glyph is still there for anyone who expects to click it. */
  document.addEventListener('input', function (event) {
    var el = event.target;
    if (!el.matches || !el.matches('[data-address="postcode"]')) return;
    var root = el.closest('[data-address-lookup]');
    if (!root) return;
    if (POSTCODE.test(el.value.trim())) search(root);
    else {
      var list = root.querySelector('.address-lookup__results');
      if (list) list.hidden = true;
    }
  });
})();
