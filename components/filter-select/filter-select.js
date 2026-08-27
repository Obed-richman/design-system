/*
 * ============================================================
 * FILTER SELECT — interactivity
 * ============================================================
 * • Clicking the trigger opens / closes the dropdown (rotates the chevron).
 * • Ticking an option adds its badge to the trigger as a removable chip;
 *   unticking (or clicking a chip's ✕) removes it. The chips are always
 *   derived from the checked options, so the two stay in sync.
 * • The trigger reverts to its Default (placeholder) look when nothing is
 *   selected. Clicking outside closes the dropdown.
 * Applies to every .filter-select on the page.
 * ============================================================
 */
(function () {
  // Design-system close icon (icons/close.svg) — a filled circle + X, currentColor
  var CLOSE =
    '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">' +
    '<circle cx="16" cy="16" r="14" fill="currentColor" fill-opacity="0.2"/>' +
    '<path d="M19.6433 21.7856C19.9026 22.0519 20.3296 22.0547 20.5924 21.7919L21.5351 20.8492C21.793 20.5913 21.7958 20.174 21.5413 19.9127L17.7498 16.0186L21.6567 12.2147C21.923 11.9554 21.9258 11.5285 21.663 11.2657L20.7203 10.3229C20.4624 10.065 20.0451 10.0623 19.7838 10.3167L15.8897 14.1082L12.0861 10.2016C11.8268 9.9353 11.3998 9.93245 11.137 10.1953L10.1943 11.138C9.93638 11.3959 9.9336 11.8131 10.188 12.0745L13.9793 15.9683L10.0727 19.772C9.8064 20.0312 9.80355 20.4582 10.0664 20.721L11.0091 21.6638C11.267 21.9216 11.6842 21.9244 11.9456 21.67L15.8394 17.8787L19.6433 21.7856Z" fill="currentColor"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Rebuild the trigger chips from the currently-checked options.
  function sync(fs) {
    var chips = fs.querySelector(".filter-select__chips");
    var checked = fs.querySelectorAll('.filter-select__option input[type="checkbox"]:checked');
    if (chips) {
      chips.innerHTML = Array.prototype.map.call(checked, function (inp) {
        var label = inp.getAttribute("data-fs-label") || inp.value;
        var variant = inp.getAttribute("data-fs-variant") || "information";
        return (
          '<span class="status-label status-label--rounded status-label--' + variant +
          ' filter-select__chip">' + esc(label) +
          '<button class="filter-select__chip-remove" type="button" aria-label="Remove ' +
          esc(label) + '" data-fs-value="' + esc(inp.value) + '">' + CLOSE + "</button></span>"
        );
      }).join("");
    }
    fs.classList.toggle("filter-select--filtered", checked.length > 0);
  }

  function setOpen(fs, open) {
    fs.setAttribute("data-open", String(open));
    var trigger = fs.querySelector(".filter-select__trigger");
    if (trigger) trigger.setAttribute("aria-expanded", String(open));
  }

  function init(fs) {
    if (fs.dataset.fsReady) return;
    fs.dataset.fsReady = "1";
    var trigger = fs.querySelector(".filter-select__trigger");

    if (trigger) {
      trigger.addEventListener("click", function (e) {
        if (e.target.closest(".filter-select__chip-remove")) return; // let the removal handler run
        setOpen(fs, fs.getAttribute("data-open") !== "true");
      });
      trigger.addEventListener("keydown", function (e) {
        if ((e.key === "Enter" || e.key === " ") && e.target === trigger) {
          e.preventDefault();
          setOpen(fs, fs.getAttribute("data-open") !== "true");
        }
      });
    }

    // Remove a chip → uncheck its option → re-sync
    fs.addEventListener("click", function (e) {
      var remove = e.target.closest(".filter-select__chip-remove");
      if (!remove) return;
      e.preventDefault();
      e.stopPropagation();
      var val = remove.getAttribute("data-fs-value");
      var input = fs.querySelector('.filter-select__option input[value="' + val + '"]');
      if (input) {
        input.checked = false;
        sync(fs);
      }
    });

    // Tick / untick an option → re-sync the chips
    fs.addEventListener("change", function (e) {
      if (e.target.matches('.filter-select__option input[type="checkbox"]')) sync(fs);
    });

    // Click outside → close
    document.addEventListener("click", function (e) {
      if (!fs.contains(e.target)) setOpen(fs, false);
    });

    sync(fs); // reflect any options that start checked
  }

  function boot() {
    document.querySelectorAll(".filter-select").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
