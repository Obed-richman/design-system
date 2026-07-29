import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Total Cost (checkout footer button)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6501-18244
 *
 * The purchase-journey footer. "property" selects the variant: Total shows the
 * price row; Default is the confirm variant (optional Alert, Acknowledge box
 * and fair-notice line). Reuses Button, Alert and Acknowledge.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6501-18244",
  {
    example: () =>
      html`<div class="total-cost" data-variant="total">
  <div class="total-cost__content">
    <!-- Total variant -->
    <div class="total-cost__total">
      <span class="total-cost__label">Total cost</span>
      <div class="total-cost__price-group">
        <p class="total-cost__price">£1,606/year</p>
        <p class="total-cost__sub">or pay £00.00 /month</p>
      </div>
    </div>
    <!-- Default variant may instead include:
         .alert.alert--information  ·  .acknowledge  ·  .total-cost__notice -->
    <button class="btn btn--primary btn--pill total-cost__cta" type="button">Continue</button>
  </div>
</div>`,
  }
);
