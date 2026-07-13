import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Aggregator Partners
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=5698-430872
 *
 * A navy panel of comparison / aggregator partner logos in white. Each .partner
 * slot loads its white SVG from /assets/partners via the modifier class —
 * replace those files with the official brand marks (same filenames).
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=5698-430872",
  {
    example: () =>
      html`<div class="partners">
  <span class="partner partner--ctm" role="img" aria-label="Compare the Market"></span>
  <span class="partner partner--gocompare" role="img" aria-label="GoCompare"></span>
  <span class="partner partner--confused" role="img" aria-label="Confused.com"></span>
  <span class="partner partner--quotezone" role="img" aria-label="Quotezone"></span>
  <span class="partner partner--msm" role="img" aria-label="MoneySuperMarket"></span>
  <span class="partner partner--insuremy" role="img" aria-label="InsureMy4Less"></span>
  <span class="partner partner--drivescore" role="img" aria-label="DriveScore"></span>
</div>`,
  }
);
