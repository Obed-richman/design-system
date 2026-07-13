/*
 * Trustpilot Reviews — carousel controls
 * Desktop prev/next arrows scroll the review track by a page; on mobile the
 * pagination dot follows the centred card and a dot click scrolls to it.
 */
(function () {
  'use strict';

  function centredIndex(track, cards) {
    var box = track.getBoundingClientRect();
    var mid = box.left + box.width / 2;
    var best = 0, bestDist = Infinity;
    cards.forEach(function (c, i) {
      var r = c.getBoundingClientRect();
      var dist = Math.abs(r.left + r.width / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  function init(widget) {
    var track = widget.querySelector('.tp-reviews__track');
    if (!track) return;
    var cards = Array.prototype.slice.call(track.querySelectorAll('.tp-review'));
    var dots = Array.prototype.slice.call(widget.querySelectorAll('.tp-reviews__pagination .pagination__dot'));

    function syncDots() {
      if (!dots.length) return;
      var idx = centredIndex(track, cards);
      dots.forEach(function (d, i) {
        var on = i === idx;
        d.classList.toggle('pagination__dot--active', on);
        if (d.hasAttribute('aria-selected')) d.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; syncDots(); });
    });

    widget.querySelectorAll('.tp-reviews__nav').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = btn.getAttribute('data-dir') === 'prev' ? -1 : 1;
        track.scrollBy({ left: dir * Math.round(track.clientWidth * 0.9), behavior: 'smooth' });
      });
    });

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        if (cards[i]) cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });

    syncDots();
  }

  function initAll() { document.querySelectorAll('.tp-reviews').forEach(init); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
