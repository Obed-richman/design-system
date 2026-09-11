import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Call Out Card (Figma "Call out Card")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=3093-42012
 *
 * A compact feature/add-on card: an Icon+ badge with an optional status label,
 * a title + description, and an optional "More details" footer link. Badge,
 * label and button each show/hide independently. Composes Icon+ and Status
 * Label; the footer uses the DS arrow-right icon. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=3093-42012",
  {
    example: () =>
      html`<div class="callout-card">
  <div class="callout-card__content">
    <div class="callout-card__top">
      <span class="icon-plus"><!-- icon-plus glyph, e.g. icons/breakdown.svg --></span>
      <span class="status-label status-label--success status-label--rounded">Added</span>
    </div>
    <div class="callout-card__text">
      <h3 class="callout-card__title">Breakdown cover</h3>
      <p class="callout-card__desc">24/7 roadside assistance and recovery.</p>
    </div>
  </div>
  <a class="callout-card__button" href="#">More details<span class="callout-card__arrow"><!-- icons/arrow-right.svg --></span></a>
</div>`,
  }
);
