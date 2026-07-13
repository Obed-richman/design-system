/*
 * Extra Cover — add / remove toggle
 * Clicking .extra-cover__add toggles the card's added state: it reveals the
 * "Added" badge, flips the button from primary "Add" to secondary "Added"
 * (with a tick) and back.
 */
(function () {
  'use strict';

  function setState(card, added) {
    card.classList.toggle('extra-cover--added', added);
    var btn = card.querySelector('.extra-cover__add');
    if (!btn) return;
    btn.classList.toggle('btn--primary', !added);
    btn.classList.toggle('btn--secondary', added);
    btn.setAttribute('aria-pressed', added ? 'true' : 'false');
    var label = btn.querySelector('.extra-cover__add-label');
    if (label) label.textContent = added ? 'Remove' : 'Add';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.extra-cover__add');
    if (!btn) return;
    var card = btn.closest('.extra-cover');
    if (card) setState(card, !card.classList.contains('extra-cover--added'));
  });
})();
