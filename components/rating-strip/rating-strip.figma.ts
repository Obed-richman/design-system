import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Rating Strip
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6224-2097
 *
 * A navy rating banner — the tier label + an optional rewards-points line, with
 * the matching Rating Badge on the right. Set the tier via the title + badge;
 * omit .rating-strip__points to hide the points line. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6224-2097",
  {
    example: () =>
      html`<div class="rating-strip">
  <div class="rating-strip__status">
    <p class="rating-strip__title">Excellent</p>
    <p class="rating-strip__points">+8 rewards points</p>
  </div>
  <span class="rating-badge rating-badge--excellent" aria-hidden="true"><!-- tier badge SVG --></span>
</div>`,
  }
);
