import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Bullet Points
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57577-22634
 *
 * A vertical list of green-tick bullet rows. "title", "supportText" and
 * "rightIcon" toggle the optional pieces. Add a .bullet-point per item; give a
 * row .bullet-point--support when it has a support line.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57577-22634",
  {
    example: () =>
      html`<div class="bullet-points">
  <p class="bullet-points__title">Title</p>
  <div class="bullet-point">
    <span class="bullet-point__icon"><svg viewBox="0 0 24 24" fill="none"><path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1Z" fill="#00E660"/><path d="M10.49 13.56l4.62-4.62a.4.4 0 0 1 .57 0l.71.71a.4.4 0 0 1 0 .57l-5.67 5.67a.4.4 0 0 1-.57 0l-2.54-2.54a.4.4 0 0 1 0-.57l.7-.7a.4.4 0 0 1 .57 0l1.61 1.48Z" fill="currentColor"/></svg></span>
    <span class="bullet-point__main">
      <span class="bullet-point__row"><span class="bullet-point__text">Bullet point</span></span>
    </span>
  </div>
  <!-- more .bullet-point rows -->
</div>`,
  }
);
