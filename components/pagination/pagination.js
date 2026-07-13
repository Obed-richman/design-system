/*
 * Pagination Indicator — click to activate
 * Clicking a dot makes it the single active dot within its .pagination.
 * (Optional helper; the component is purely presentational without it.)
 */
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var dot = e.target.closest('.pagination__dot');
    if (!dot) return;
    var group = dot.closest('.pagination');
    if (!group) return;
    group.querySelectorAll('.pagination__dot').forEach(function (d) {
      var active = d === dot;
      d.classList.toggle('pagination__dot--active', active);
      if (d.hasAttribute('aria-selected')) d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  });
})();
