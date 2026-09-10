import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Factor Control (Figma "Factors (Control)")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2686-73507
 *
 * A telematics-factor card — a labelled icon (with an optional help icon) above a
 * Factor Indicator bar. Swap the icon/title per factor and set the indicator mode.
 * Composes Factor Indicator; kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2686-73507",
  {
    example: () =>
      html`<div class="factor-control">
  <div class="factor-control__head">
    <span class="factor-control__icon"><!-- telematics icon, e.g. icons/brake.svg --></span>
    <span class="factor-control__title">Braking</span>
    <!-- optional help icon: span.factor-control__help holding icons/help.svg -->
  </div>
  <div class="factor-indicator" role="img" aria-label="Average">
    <span class="factor-indicator__zone factor-indicator__zone--red"></span>
    <span class="factor-indicator__zone factor-indicator__zone--orange factor-indicator__zone--active">
      <span class="factor-indicator__half"></span><span class="factor-indicator__pointer"></span><span class="factor-indicator__half"></span>
    </span>
    <span class="factor-indicator__zone factor-indicator__zone--green"></span>
  </div>
</div>`,
  }
);
