import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Warning
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58151-4988
 *
 * A pulsing dot: the Figma "Frame=16/24/32/40" keyframes grow the ring, which
 * is driven in code by the `warning-ping` animation — so there's no code
 * equivalent for the frames; the connected snippet is the dot + ring markup.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58151-4988",
  {
    example: () =>
      html`<span class="warning" role="status" aria-label="Warning">
  <span class="warning__ring"></span>
  <span class="warning__dot"></span>
</span>`,
  }
);
