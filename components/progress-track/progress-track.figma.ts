import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Progress Track
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2986-13284
 *
 * A progress bar showing position within a range — a translucent track with a
 * coloured fill (to --progress-track-value, 0–100) and a white position marker.
 * 0/100 hide the marker (empty / full). Made for a coloured surface. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2986-13284",
  {
    example: () =>
      html`<div class="progress-track" style="--progress-track-value: 50" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
  <div class="progress-track__fill"><span class="progress-track__indicator"></span></div>
</div>`,
  }
);
