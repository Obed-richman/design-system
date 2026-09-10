import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Driver Ratings Card (Figma "Driver Ratings Card")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59087-61847
 *
 * A navy card with a status title + Rating Badge over a Driver Rating Progress bar,
 * plus actions. Swap the tier modifiers (rating-badge--*, driver-rating--*) and the
 * status title per tier; the in-progress states use a Status Label + message instead.
 * Composes Rating Badge, Driver Rating Progress and Status Label; kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59087-61847",
  {
    example: () =>
      html`<div class="driver-ratings-card">
  <div class="driver-ratings-card__rating">
    <span class="driver-ratings-card__status">Great</span>
    <span class="rating-badge rating-badge--great"><!-- 48px hexagon badge, icons via rating-badge --></span>
  </div>
  <div class="driver-rating driver-rating--great">
    <div class="driver-rating__bars">
      <!-- five .progress-track segments; fill 4 for Great -->
    </div>
    <div class="driver-rating__labels"><span>At risk</span><span>Excellent</span></div>
  </div>
  <div class="driver-ratings-card__actions">
    <button type="button" class="driver-ratings-card__insights">View insights</button>
    <button type="button" class="driver-ratings-card__more" aria-label="More options"><!-- icons/horizontal-ellipsis.svg --></button>
  </div>
</div>`,
  }
);
