import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Counter Ring
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59137-2480
 *
 * A circular progress ring (purple arc over a grey track) with a centre number.
 * Size via --large / --medium / --small; the arc fills to --counter-ring-value
 * (0–100). Optional white pad (--pad) and a "days" label. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59137-2480",
  {
    example: () =>
      html`<div class="counter-ring counter-ring--large" style="--counter-ring-value: 80" role="img" aria-label="80 percent">
  <svg class="counter-ring__svg" viewBox="0 0 36 36" aria-hidden="true">
    <circle class="counter-ring__track" cx="18" cy="18" r="15.5" pathLength="100"/>
    <circle class="counter-ring__arc" cx="18" cy="18" r="15.5" pathLength="100"/>
  </svg>
  <span class="counter-ring__text">
    <span class="counter-ring__number">1</span>
    <!-- optional: <span class="counter-ring__days">days</span> -->
  </span>
</div>`,
  }
);
