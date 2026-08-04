import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Driving Licence
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58083-6752
 *
 * A reference illustration of a UK driving licence. Purely illustrative — used
 * to show a customer where their licence number sits (field 5 is highlighted in
 * yellow). Reuses the UK flag asset.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58083-6752",
  {
    example: () =>
      html`<div class="driving-licence">
  <div class="driving-licence__header">
    <span class="driving-licence__country">UK</span>
    <span class="driving-licence__title">DRIVING LICENCE</span>
    <span class="driving-licence__flag"><img src="assets/flags/uk.svg" width="16" height="16" alt="UK flag"></span>
  </div>
  <div class="driving-licence__body">
    <div class="driving-licence__photo"><!-- profile illustration --></div>
    <div class="driving-licence__details">
      <div class="dl-field"><span class="dl-field__num">1.</span><span class="dl-field__label">SURNAME</span></div>
      <div class="dl-field"><span class="dl-field__num">2.</span><span class="dl-field__label">FIRST NAME(S)</span></div>
      <div class="dl-field"><span class="dl-field__num">3.</span><span class="dl-field__label">DATE OF BIRTH</span></div>
      <div class="dl-field dl-field--muted"><span class="dl-field__num">4a.</span><span class="dl-field__label">##.##.##</span><span class="dl-field__label">4c. DVLA</span></div>
      <div class="dl-field dl-field--muted"><span class="dl-field__num">4b.</span><span class="dl-field__label">##.##.##</span></div>
      <div class="dl-field"><span class="dl-field__num">5.</span><span class="dl-field__number"><span class="dl-field__chip">SURNA123456A34BT</span><span class="dl-field__label">##</span></span></div>
    </div>
  </div>
</div>`,
  }
);
