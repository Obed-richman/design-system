import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — List Item (Figma "_Base List Item")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=128-98700
 *
 * A ruled list row built from optional slots — a leading icon, a title with an
 * optional description, an optional trailing text block, and trailing controls
 * (Checkbox, Chevron). Kept static: the slots are content the consumer composes.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=128-98700",
  {
    example: () =>
      html`<div class="list-item">
  <div class="list-item__content">
    <span class="list-item__icon"><!-- icons/correct-outline.svg --></span>
    <div class="list-item__text">
      <span class="list-item__title">Delivery</span>
      <span class="list-item__description">Paragraph</span>
    </div>
    <div class="list-item__text list-item__text--trailing">
      <span class="list-item__title">Delivery</span>
      <span class="list-item__description">Paragraph</span>
    </div>
    <label class="checkbox"><input class="checkbox__input" type="checkbox" /><span class="checkbox__box"></span></label>
    <span class="list-item__chevron"><!-- icons/chevron-down.svg --></span>
  </div>
</div>`,
  }
);
