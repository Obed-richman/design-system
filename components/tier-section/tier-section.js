/*
 * Tier Section — billing period pricing
 * The prices in each Tier Card are stored as the MONTHLY amount on
 * `.tier-card__price[data-monthly]`. Clicking a billing Segment item that
 * carries data-period ("annual" | "monthly") reprices every tier in that
 * section: annual = monthly × 12.
 */
(function () {
  'use strict';

  function fmt(n) { return '£' + n.toFixed(2); }

  function reprice(section, period) {
    section.querySelectorAll('.tier-card__price[data-monthly]').forEach(function (el) {
      var monthly = parseFloat(el.getAttribute('data-monthly'));
      if (isNaN(monthly)) return;
      el.textContent = period === 'annual' ? fmt(monthly * 12) : fmt(monthly);
    });
  }

  document.addEventListener('click', function (e) {
    var item = e.target.closest('.tier-section .segment__item[data-period]');
    if (!item) return;
    var section = item.closest('.tier-section');
    if (section) reprice(section, item.getAttribute('data-period'));
  });


  /* --------------------------------------------------------
     Mobile carousel ↔ pagination
     On the horizontal tier scroller, keep the pagination dot in sync with the
     centred card, and let a dot click scroll its card to centre.
     -------------------------------------------------------- */

  function centredIndex(scroller, cards) {
    var box = scroller.getBoundingClientRect();
    var mid = box.left + box.width / 2;
    var best = 0, bestDist = Infinity;
    cards.forEach(function (c, i) {
      var r = c.getBoundingClientRect();
      var dist = Math.abs(r.left + r.width / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  function initCarousel(section) {
    var scroller = section.querySelector('.tier-section__tiers');
    var pager = section.querySelector('.tier-section__pagination');
    if (!scroller || !pager) return;
    var cards = Array.prototype.slice.call(scroller.querySelectorAll('.tier-card'));
    var dots = Array.prototype.slice.call(pager.querySelectorAll('.pagination__dot'));
    if (!cards.length || !dots.length) return;

    function sync() {
      var idx = centredIndex(scroller, cards);
      dots.forEach(function (d, i) {
        var on = i === idx;
        d.classList.toggle('pagination__dot--active', on);
        if (d.hasAttribute('aria-selected')) d.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    var ticking = false;
    scroller.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; sync(); });
    });

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        if (cards[i]) cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });

    sync();
  }

  function initAll() {
    document.querySelectorAll('.tier-section').forEach(initCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
