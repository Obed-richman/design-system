/*
 * ============================================================
 * CONTROL SET — interactivity
 * ============================================================
 * • The date field opens the Date Picker as a popover. Confirm writes the
 *   chosen date/range into the field; Clear wipes the field (and, via
 *   date-picker.js, the picker's selection) then closes. (Date Picker rendering /
 *   day selection / month nav come from date-picker.js.)
 * • "Clear all" resets everything: empties the search input, unticks every
 *   Filter Select option (which clears its chips), and clears the date field.
 * • Clicking outside closes the date popover.
 * Applies to every .control-set on the page.
 * ============================================================
 */
(function () {
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // "YYYY-M-D" (M is 0–11) → "D Mon YYYY"
  function format(sel) {
    if (!sel) return "";
    var p = sel.split("-");
    return (+p[2]) + " " + MON[+p[1]] + " " + p[0];
  }

  function closePicker(cs) {
    var wrap = cs.querySelector(".control-set__date-wrap");
    if (!wrap) return;
    wrap.setAttribute("data-open", "false");
    var btn = wrap.querySelector(".control-set__date");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function clearAll(cs) {
    // search
    var search = cs.querySelector(".control-set__search .input");
    if (search) search.value = "";

    // filter select — untick every option, then let filter-select.js re-sync its chips
    var inputs = cs.querySelectorAll('.filter-select__option input[type="checkbox"]');
    inputs.forEach(function (i) { i.checked = false; });
    if (inputs.length) inputs[0].dispatchEvent(new Event("change", { bubbles: true }));

    // date field → placeholder, and wipe the picker's selection so it reopens fresh
    var value = cs.querySelector(".control-set__date-value");
    var dateBtn = cs.querySelector(".control-set__date");
    if (value) value.textContent = value.getAttribute("data-placeholder") || "Select dates";
    if (dateBtn) dateBtn.classList.add("control-set__date--empty");
    var dp = cs.querySelector(".control-set__datepicker .date-picker");
    if (dp) {
      dp.removeAttribute("data-selected");
      dp.removeAttribute("data-range-start");
      dp.removeAttribute("data-range-end");
    }

    closePicker(cs);
  }

  function init(cs) {
    if (cs.dataset.csReady) return;
    cs.dataset.csReady = "1";

    var wrap = cs.querySelector(".control-set__date-wrap");
    var dateBtn = cs.querySelector(".control-set__date");

    if (dateBtn && wrap) {
      dateBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = wrap.getAttribute("data-open") === "true";
        wrap.setAttribute("data-open", String(!open));
        dateBtn.setAttribute("aria-expanded", String(!open));
      });
    }

    cs.addEventListener("click", function (e) {
      if (e.target.closest(".date-picker__clear")) {
        // date-picker.js wipes the picker's range; here we clear the field too, then close.
        var v = cs.querySelector(".control-set__date-value");
        if (v) v.textContent = v.getAttribute("data-placeholder") || "Select dates";
        if (dateBtn) dateBtn.classList.add("control-set__date--empty");
        closePicker(cs);
        return;
      }

      if (e.target.closest(".date-picker__confirm")) {
        var dp = cs.querySelector(".control-set__datepicker .date-picker");
        var value = cs.querySelector(".control-set__date-value");
        if (dp && value) {
          var text = "";
          if (dp.getAttribute("data-mode") === "range") {
            // Range field — "start → end", or just the start if no end was picked.
            var start = dp.getAttribute("data-range-start");
            var end = dp.getAttribute("data-range-end");
            if (start && end) text = format(start) + " → " + format(end);
            else if (start) text = format(start);
          } else {
            var sel = dp.getAttribute("data-selected");
            if (sel) text = format(sel);
          }
          if (text) {
            value.textContent = text;
            if (dateBtn) dateBtn.classList.remove("control-set__date--empty");
          }
        }
        closePicker(cs);
        return;
      }

      if (e.target.closest(".control-set__clear")) { clearAll(cs); return; }
    });

    document.addEventListener("click", function (e) {
      /* Use the event's composed path, not cs.contains(e.target): a day click makes
         date-picker.js re-render the grid, which detaches the clicked node before
         this runs, so contains() would wrongly report "outside" and close on every
         in-calendar click. The path is captured at dispatch and survives the mutation. */
      var path = e.composedPath ? e.composedPath() : null;
      var inside = path ? path.indexOf(cs) !== -1 : cs.contains(e.target);
      if (!inside) closePicker(cs);
    });
  }

  function boot() {
    document.querySelectorAll(".control-set").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
