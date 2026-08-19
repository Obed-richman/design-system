/*
 * ============================================================
 * DATE PICKER — render + navigation + selection
 * ============================================================
 * Renders each .date-picker from its data attributes and wires the prev/next
 * month buttons and day selection.
 *
 *   data-year, data-month (0–11) — the visible month
 *   data-selected  "YYYY-M-D"    — the chosen day (M is 0–11)
 *   data-today     "YYYY-M-D"    — the day drawn with the "today" outline
 *   data-min, data-max "YYYY-M-D" — optional bounds. Days outside them render
 *                                   disabled, and the month arrows stop rather
 *                                   than walking into a month with nothing in it.
 *                                   For a question that only accepts a window —
 *                                   "cover must start within 30 days".
 *
 * Weeks start on Monday. Selecting a day updates data-selected and re-renders.
 * Self-init via event delegation:  <script src="date-picker.js" defer></script>
 * ============================================================
 */
(function () {
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  function key(y, m, d) { return y + '-' + m + '-' + d; }

  /* "YYYY-M-D" as a number that sorts, so bounds can be compared without Date */
  function ord(k) {
    if (!k) return null;
    var p = k.split('-');
    return (+p[0]) * 10000 + (+p[1]) * 100 + (+p[2]);
  }

  function bounds(dp) {
    return { min: ord(dp.getAttribute('data-min')), max: ord(dp.getAttribute('data-max')) };
  }

  function outside(b, y, m, d) {
    var v = ord(key(y, m, d));
    return (b.min !== null && v < b.min) || (b.max !== null && v > b.max);
  }

  function render(dp) {
    var year = parseInt(dp.getAttribute('data-year'), 10);
    var month = parseInt(dp.getAttribute('data-month'), 10);
    var selected = dp.getAttribute('data-selected') || '';
    var today = dp.getAttribute('data-today') || '';

    var title = dp.querySelector('.date-picker__title');
    if (title) title.textContent = MONTHS[month] + ' ' + year;

    var grid = dp.querySelector('.date-picker__grid');
    if (!grid) return;

    var firstDow = (new Date(year, month, 1).getDay() + 6) % 7;   // Mon = 0
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var cells = '';
    for (var i = 0; i < firstDow; i++) {
      cells += '<span class="date-picker__day date-picker__day--empty" aria-hidden="true"></span>';
    }
    var b = bounds(dp);
    for (var d = 1; d <= daysInMonth; d++) {
      var k = key(year, month, d);
      var cls = 'date-picker__day';
      if (k === selected) cls += ' date-picker__day--selected';
      if (k === today) cls += ' date-picker__day--today';
      var pressed = k === selected ? ' aria-pressed="true"' : '';
      /* Out of bounds days are shown and disabled rather than hidden: the shape
         of the month stays readable, and it is clear the day exists but can't be
         chosen. */
      var off = outside(b, year, month, d) ? ' disabled' : '';
      cells += '<button type="button" class="' + cls + '" data-day="' + d + '"' + pressed + off + '>' + d + '</button>';
    }
    grid.innerHTML = cells;

    /* Stop the arrows at the edge of the window — a month with every day greyed
       out is a dead end you have to find your own way back from. */
    var prev = dp.querySelector('.date-picker__prev');
    var next = dp.querySelector('.date-picker__next');
    if (prev) prev.disabled = b.min !== null && ord(key(year, month, 1)) <= b.min;
    if (next) next.disabled = b.max !== null && ord(key(year, month, daysInMonth)) >= b.max;
  }

  function shiftMonth(dp, delta) {
    var year = parseInt(dp.getAttribute('data-year'), 10);
    var month = parseInt(dp.getAttribute('data-month'), 10) + delta;
    if (month < 0) { month = 11; year--; }
    else if (month > 11) { month = 0; year++; }
    dp.setAttribute('data-year', year);
    dp.setAttribute('data-month', month);
    render(dp);
  }

  document.addEventListener('click', function (event) {
    var prev = event.target.closest('.date-picker__prev');
    if (prev) { shiftMonth(prev.closest('.date-picker'), -1); return; }

    var next = event.target.closest('.date-picker__next');
    if (next) { shiftMonth(next.closest('.date-picker'), 1); return; }

    var day = event.target.closest('.date-picker__day[data-day]');
    if (day) {
      var dp = day.closest('.date-picker');
      dp.setAttribute('data-selected', key(
        parseInt(dp.getAttribute('data-year'), 10),
        parseInt(dp.getAttribute('data-month'), 10),
        parseInt(day.getAttribute('data-day'), 10)
      ));
      render(dp);
      return;
    }
  });

  /* Re-render when the data attributes change, so a picker can be DRIVEN: set
     data-year and data-month from script and the calendar follows. Without this
     a consumer that decides the month at runtime — "start from today" — renders
     once against whatever the markup happened to say and then never again.

     watch() skips the render it caused itself, or setting data-selected inside
     render would loop. */
  var rendering = false;

  function watch(dp) {
    if (dp._dpWatched) return;
    dp._dpWatched = true;
    new MutationObserver(function () {
      if (rendering) return;
      rendering = true;
      render(dp);
      rendering = false;
    }).observe(dp, { attributes: true,
      attributeFilter: ['data-year', 'data-month', 'data-selected', 'data-today',
                        'data-min', 'data-max'] });
  }

  function initAll() {
    document.querySelectorAll('.date-picker').forEach(function (dp) {
      render(dp);
      watch(dp);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
