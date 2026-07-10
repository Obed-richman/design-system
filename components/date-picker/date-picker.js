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
    for (var d = 1; d <= daysInMonth; d++) {
      var k = key(year, month, d);
      var cls = 'date-picker__day';
      if (k === selected) cls += ' date-picker__day--selected';
      if (k === today) cls += ' date-picker__day--today';
      var pressed = k === selected ? ' aria-pressed="true"' : '';
      cells += '<button type="button" class="' + cls + '" data-day="' + d + '"' + pressed + '>' + d + '</button>';
    }
    grid.innerHTML = cells;
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

  function initAll() {
    document.querySelectorAll('.date-picker').forEach(render);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
