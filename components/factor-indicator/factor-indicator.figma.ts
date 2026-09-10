import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Factor Indicator
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2112-891
 *
 * A three-zone red/amber/green telematics gauge with a vertical pointer in the
 * active zone (Poor = red, Average = amber, Good = green). Put the pointer markup
 * inside the active zone. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2112-891",
  {
    example: () =>
      html`<div class="factor-indicator" role="img" aria-label="Average">
  <span class="factor-indicator__zone factor-indicator__zone--red"></span>
  <span class="factor-indicator__zone factor-indicator__zone--orange factor-indicator__zone--active">
    <span class="factor-indicator__half"></span>
    <span class="factor-indicator__pointer"></span>
    <span class="factor-indicator__half"></span>
  </span>
  <span class="factor-indicator__zone factor-indicator__zone--green"></span>
</div>`,
  }
);
