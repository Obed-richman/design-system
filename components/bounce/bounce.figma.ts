import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Bounce
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6540-28634
 *
 * _Bounce is a two-frame scale animation (1px → 12px), driven in code by the
 * `bounce` keyframes. The Figma "Frame=1/2" keyframes have no code equivalent —
 * they are just the animation — so the connected snippet is the dots loader.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6540-28634",
  {
    example: () =>
      html`<span class="bounce-dots" role="status" aria-label="Loading">
  <span class="bounce-dots__dot"></span>
  <span class="bounce-dots__dot"></span>
  <span class="bounce-dots__dot"></span>
</span>`,
  }
);
