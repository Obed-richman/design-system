import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Product Card
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57761-3983
 *
 * Presents an insurance product option: badge, optional "Best value" tag +
 * radio, headline, benefit bullets and an optional rewards banner. "state"
 * maps to the chosen modifier — Active adds .product-card--active (3px aqua
 * border + checked radio). Reuses Radio and the DS tick-small icon.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57761-3983",
  {
    props: {
      active: figma.enum("state", { Resting: "", Active: " product-card--active" }),
    },
    example: ({ active }) =>
      html`<div class="product-card${active}">
  <div class="product-card__header">
    <div class="product-card__top">
      <span class="product-card__badge"><!-- annual/calendar icon --></span>
      <div class="product-card__meta">
        <span class="product-card__tag">Best value</span>
        <label class="radio"><input class="radio__input" type="radio" name="product"><span class="radio__control"></span></label>
      </div>
    </div>
    <div>
      <h3 class="product-card__title">Telematics</h3>
      <p class="product-card__subtitle">Get up to £60 a year in rewards</p>
    </div>
    <div class="product-card__benefits">
      <div class="product-card__benefit"><span class="product-card__benefit-icon"><!-- tick --></span><span class="product-card__benefit-text">Up to 25% off for good driving</span></div>
      <div class="product-card__benefit"><span class="product-card__benefit-icon"><!-- tick --></span><span class="product-card__benefit-text">Earn up to £60 in rewards</span></div>
      <div class="product-card__benefit"><span class="product-card__benefit-icon"><!-- tick --></span><span class="product-card__benefit-text">Privacy-first — your location stays yours</span></div>
    </div>
  </div>
  <div class="product-card__banner"><div class="product-card__banner-inner">
    <p class="product-card__banner-text">Drive well. Pay less. Get rewards.</p>
    <div class="product-card__rewards"><span class="product-card__reward"></span><span class="product-card__reward"></span><span class="product-card__reward"></span></div>
  </div></div>
</div>`,
  }
);
