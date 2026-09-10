import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Driver Rating Progress
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6222-12810
 *
 * A five-segment rating bar from At risk to Excellent. The tier modifier sets the
 * fill colour; fill the matching number of Progress Track segments (100), leave the
 * rest empty (0). At risk adds .progress-track--marker to its segment. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6222-12810",
  {
    example: () =>
      html`<div class="driver-rating driver-rating--great" role="img" aria-label="Driver rating: Great">
  <div class="driver-rating__bars">
    <div class="progress-track" style="--progress-track-value: 100"><div class="progress-track__fill"></div></div>
    <div class="progress-track" style="--progress-track-value: 100"><div class="progress-track__fill"></div></div>
    <div class="progress-track" style="--progress-track-value: 100"><div class="progress-track__fill"></div></div>
    <div class="progress-track" style="--progress-track-value: 100"><div class="progress-track__fill"></div></div>
    <div class="progress-track" style="--progress-track-value: 0"><div class="progress-track__fill"></div></div>
  </div>
  <div class="driver-rating__labels"><span>At risk</span><span>Excellent</span></div>
</div>`,
  }
);
