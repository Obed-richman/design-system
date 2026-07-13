/*
 * Tier Card — group selection
 * Cards sharing a [data-tier-group] behave as a single-select set: clicking a
 * card's .tier-card__select makes it the active card and clears the others.
 * The button shows its data-label when unselected. When selected it shows
 * data-selected-label if present, otherwise "{data-label} selected".
 */
(function () {
  'use strict';

  function labelFor(btn) {
    return btn.getAttribute('data-label') || btn.textContent.trim().replace(/\s+selected$/i, '');
  }

  function selectedLabelFor(btn) {
    return btn.getAttribute('data-selected-label') || labelFor(btn) + ' selected';
  }

  function setLabel(btn, active) {
    if (btn) btn.textContent = active ? selectedLabelFor(btn) : labelFor(btn);
  }

  function selectCard(card) {
    var group = card.getAttribute('data-tier-group');
    var scope = card.parentElement || document;

    if (group) {
      scope.querySelectorAll('.tier-card[data-tier-group="' + group + '"]').forEach(function (c) {
        var active = c === card;
        c.classList.toggle('tier-card--active', active);
        setLabel(c.querySelector('.tier-card__select'), active);
      });
    } else {
      card.classList.toggle('tier-card--active');
      setLabel(card.querySelector('.tier-card__select'), card.classList.contains('tier-card--active'));
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.tier-card__select');
    if (!btn) return;
    var card = btn.closest('.tier-card');
    if (card) selectCard(card);
  });
})();
