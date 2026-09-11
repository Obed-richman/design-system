import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Policy Card / Large (Figma "Policy Cards / Large")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59025-26078
 *
 * A white policy card: registration + type (optional Telematics tag), a status
 * band that changes per state, and Documents / Policy details actions.
 *   Active / Pending → .policy-card__progress (green fill via --policy-progress)
 *   Renewing → .policy-card__status--renewing + Renew now
 *   Expiring → .policy-card__status--expiring + Renew now
 * Composes Button and Status Label; kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59025-26078",
  {
    example: () =>
      html`<div class="policy-card">
  <div class="policy-card__info">
    <div class="policy-card__cover">
      <h3 class="policy-card__reg">ZZ24 EGO</h3>
      <!-- optional: <span class="status-label status-label--information status-label--rounded policy-card__telematics">Telematics</span> -->
    </div>
    <p class="policy-card__type">Business Van</p>
  </div>

  <!-- Active / Pending: cover-period progress (set --policy-progress 0–100) -->
  <div class="policy-card__progress">
    <div class="policy-card__dates">
      <span class="policy-card__date">Starts: <strong>04/10/2025</strong></span>
      <span class="policy-card__date policy-card__date--end">End: <strong>03/10/2026</strong></span>
    </div>
    <div class="policy-card__bar"><span class="policy-card__bar-fill" style="--policy-progress: 24"></span></div>
  </div>

  <!-- Renewing / Expiring instead swap in a status band:
  <div class="policy-card__status policy-card__status--renewing">
    <span class="policy-card__dot"></span>
    <span class="policy-card__status-text"><strong>21 days</strong> to renew</span>
    <button class="btn btn--secondary btn--pill btn--small">Renew now</button>
  </div> -->

  <div class="policy-card__actions">
    <button class="btn btn--secondary btn--pill btn--medium">Documents</button>
    <button class="btn btn--secondary btn--pill btn--medium">Policy details</button>
  </div>
</div>`,
  }
);
