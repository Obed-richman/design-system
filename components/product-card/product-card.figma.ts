import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Product Card
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57761-3983
 *
 * Presents an insurance product option: badge (or a Zego Product lockup), optional
 * "Best value" tag + radio, headline, benefit bullets and an optional rewards
 * banner. "state" maps to the chosen modifier — Active adds .product-card--active
 * (2px aqua border + checked radio, and the banner on surface/focus).
 *
 * Reuses Radio, the DS tick-small icon, and MARKETING BANNER: the rewards banner is
 * a Marketing Banner instance whose image slot holds the reward gift cards, so its
 * markup below is the banner's own.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57761-3983",
  {
    example: () =>
      html`<div class="product-card">
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
  <div class="product-card__banner"><div class="marketing-banner">
    <div class="marketing-banner__content"><div class="marketing-banner__text">
      <p class="marketing-banner__title">Drive well. Get rewards.</p>
    </div></div>
    <div class="marketing-banner__image">
      <div class="product-card__rewards">
        <span class="product-card__reward"><img src="assets/rewards/amazon.jpg" alt=""></span>
        <span class="product-card__reward"><img src="assets/rewards/just-eat.jpg" alt=""></span>
        <span class="product-card__reward"><img src="assets/rewards/starbucks.jpg" alt=""></span>
      </div>
    </div>
  </div></div>
</div>`,
  }
);
