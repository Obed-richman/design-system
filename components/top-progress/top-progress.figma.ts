import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Top Progress Indicators
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4826-1600
 *
 * A header progress bar — a centred row of Track Items (the first N lapsed) with
 * an optional Skip button. Composes Track Item; kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4826-1600",
  {
    example: () =>
      html`<div class="top-progress">
  <div class="top-progress__track">
    <span class="track-item track-item--lapsed"></span>
    <span class="track-item track-item--lapsed"></span>
    <span class="track-item track-item--lapsed"></span>
    <span class="track-item"></span>
    <span class="track-item"></span>
    <span class="track-item"></span>
  </div>
  <button class="top-progress__skip" type="button">Skip</button>
</div>`,
  }
);
