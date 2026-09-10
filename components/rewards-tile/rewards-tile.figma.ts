import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Rewards Tile
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59611-25583
 *
 * A dashboard rewards card with two states — Progress (a Counter Ring with a
 * points total + conversion line) and Discover (a catalogue preview image +
 * label). Composes Counter Ring; kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59611-25583",
  {
    example: () =>
      html`<div class="rewards-tile rewards-tile--progress">
  <p class="rewards-tile__title">Progress</p>
  <div class="rewards-tile__media">
    <div class="counter-ring counter-ring--large rewards-tile__ring" style="--counter-ring-value: 60" role="img" aria-label="60 percent">
      <svg class="counter-ring__svg" viewBox="0 0 36 36" aria-hidden="true">
        <circle class="counter-ring__track" cx="18" cy="18" r="15.5" pathLength="100"/>
        <circle class="counter-ring__arc" cx="18" cy="18" r="15.5" pathLength="100"/>
      </svg>
      <span class="counter-ring__text"><span class="counter-ring__number">300</span></span>
    </div>
  </div>
  <p class="rewards-tile__caption">500 points = £5</p>
</div>`,
  }
);
