import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Spinner (Loading-wheel)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=9639-436
 *
 * Pointed at the Light / Large loading-wheel. The wheel is a single
 * CSS-animated element (conic-gradient ring), so the Figma "Frame=1…4"
 * animation keyframes have no code equivalent — they're just the spin.
 * Size is a class modifier (.spinner--16); colour adapts to the theme
 * automatically, with .spinner--inverse to force white on a dark surface.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=9639-436",
  {
    example: () =>
      html`<span class="spinner" role="status" aria-label="Loading"></span>`,
  }
);
