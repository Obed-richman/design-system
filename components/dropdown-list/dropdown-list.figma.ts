import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Dropdown List
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4049-53004
 *
 * A floating menu card that stacks Dropdown Items. Style = plain text rows
 * (Default) or checkbox rows (Selector); an optional decorative scrollbar shows
 * on long lists. Kept static — the row style and scrollbar are content the
 * consumer composes, not validated Figma component properties.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4049-53004",
  {
    example: () =>
      html`<div class="dropdown-list">
  <button class="dropdown-item" type="button"><span class="dropdown-item__label">Item</span></button>
  <button class="dropdown-item" type="button"><span class="dropdown-item__label">Item</span></button>
  <!-- …one Dropdown Item per option (Selector style swaps the button for a checkbox row)… -->
  <!-- Long lists add: <div class="dropdown-list__scrollbar"><div class="dropdown-list__scroller"></div></div> -->
</div>`,
  }
);
