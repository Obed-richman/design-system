import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Progress Card (Figma "Progress card")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60763-870410
 *
 * A white progress card: an Icon+ badge, an amount block (tag · title · support),
 * a Divider, and a progress stepper — a row of step icons where a green filled
 * tick (.progress-card__step--done) marks a completed step and a grey ring marks
 * a remaining one. Composes Icon+ and Divider; kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60763-870410",
  {
    example: () =>
      html`<div class="progress-card">
  <span class="icon-plus"><!-- icon-plus glyph, e.g. a document icon --></span>
  <div class="progress-card__amount">
    <p class="progress-card__tag">Rewards</p>
    <div class="progress-card__row">
      <p class="progress-card__title">£5 reward</p>
      <p class="progress-card__support">2 of 11</p>
    </div>
  </div>
  <hr class="divider">
  <div class="progress-card__stepper" role="img" aria-label="2 of 11 complete">
    <span class="progress-card__step progress-card__step--done"><!-- green circle + white tick --></span>
    <span class="progress-card__step progress-card__step--done"><!-- green circle + white tick --></span>
    <span class="progress-card__step"><!-- grey ring --></span>
    <!-- …remaining steps… -->
  </div>
</div>`,
  }
);
