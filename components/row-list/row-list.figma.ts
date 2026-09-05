import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Row List
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4104-27101
 *
 * A stack of list rows in a white rounded card, with an optional heading and an
 * optional Edit action. Dividers are inset by default; add .row-list--full-divider
 * for edge-to-edge rules. Rows and the row count are content the consumer composes,
 * so the example is kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4104-27101",
  {
    example: () =>
      html`<div class="row-list">
  <h3 class="row-list__title">Title</h3>
  <div class="row-list__card">
    <div class="row-list__row"><span class="row-list__label">Delivery</span></div>
    <div class="row-list__row"><span class="row-list__label">Delivery</span></div>
    <!-- more row-list__row items (Figma List=1 to 10); add .row-list--full-divider for edge-to-edge rules -->
    <!-- optional bottom action: row-list__action with a helper text and a btn btn--tertiary btn--pill Edit button (icons/edit.svg) -->
  </div>
</div>`,
  }
);
