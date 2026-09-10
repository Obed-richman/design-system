import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Policy Dash Card (Figma "Cards / Policy / Dash")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59608-25437
 *
 * A white policy dashboard card: registration + overflow menu, a coloured status
 * dot with a label, and one or two action buttons. Swap the dot modifier and
 * status text per state; Renew/Ending add a primary Renew button before Manage.
 * Composes Button; kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59608-25437",
  {
    example: () =>
      html`<div class="policy-dash">
  <div class="policy-dash__policy">
    <div class="policy-dash__cover">
      <h3 class="policy-dash__reg">ZZ24 EGO</h3>
      <button type="button" class="btn btn--secondary btn--fab policy-dash__menu" aria-label="Policy options"><span class="btn__icon"><!-- icons/horizontal-ellipsis.svg --></span></button>
    </div>
    <div class="policy-dash__status">
      <span class="policy-dash__dot policy-dash__dot--warning"></span>
      <span class="policy-dash__status-text">28 days left</span>
    </div>
  </div>
  <div class="policy-dash__actions">
    <button type="button" class="btn btn--primary btn--pill"><span class="btn__icon"><!-- icons/renew.svg --></span>Renew</button>
    <button type="button" class="btn btn--secondary btn--pill"><span class="btn__icon"><!-- icons/edit.svg --></span>Manage</button>
  </div>
</div>`,
  }
);
