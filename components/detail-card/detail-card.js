/*
 * ============================================================
 * DETAIL CARD — Incident type select
 * ============================================================
 * Clicking the "Incident type" field (a DS Input styled as a trigger) opens
 * the Dropdown List component 4px below it. Choosing a Dropdown Item fills the
 * field and closes the menu. Click-outside and Escape close it too.
 *
 * Self-initialising via event delegation — just include the script:
 *   <script src="detail-card.js" defer></script>
 * ============================================================
 */
(function () {
  function closeAll(except) {
    document.querySelectorAll('.detail-card__select--open').forEach(function (sel) {
      if (sel === except) return;
      sel.classList.remove('detail-card__select--open');
      var trigger = sel.querySelector('.detail-card__select-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function setView(el, view) {
    var card = el.closest('.detail-card');
    if (card) card.setAttribute('data-view', view);
    closeAll(null);
  }

  document.addEventListener('click', function (event) {
    // Mode switching: Save / Cancel → view, pencil → edit
    var save = event.target.closest('[data-dc-save]');
    if (save) { setView(save, 'view'); return; }
    var cancel = event.target.closest('[data-dc-cancel]');
    if (cancel) { setView(cancel, 'view'); return; }
    var edit = event.target.closest('[data-dc-edit]');
    if (edit) { setView(edit, 'edit'); return; }

    // Pick an option
    var item = event.target.closest('.detail-card__select-menu .dropdown-item');
    if (item) {
      var selFromItem = item.closest('.detail-card__select');
      var input = selFromItem.querySelector('.input');
      var label = item.querySelector('.dropdown-item__label');
      if (input) input.value = label ? label.textContent.trim() : item.textContent.trim();
      closeAll(null);
      return;
    }

    // Toggle the menu
    var trigger = event.target.closest('.detail-card__select-trigger');
    if (trigger) {
      var sel = trigger.closest('.detail-card__select');
      var isOpen = sel.classList.contains('detail-card__select--open');
      closeAll(sel);
      sel.classList.toggle('detail-card__select--open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      return;
    }

    // Click outside
    closeAll(null);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAll(null);
  });
})();
