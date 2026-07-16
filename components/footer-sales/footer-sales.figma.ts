import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Sales Footer (footer / Sales)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57975-13692
 *
 * Navy marketing footer: brand accent strip, a Trustpilot lockup, a grid of
 * trust/service points and the legal small-print. Reuses Trustpilot,
 * Trustpilot Lockup and Divider (tinted white on the navy surface).
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57975-13692",
  {
    example: () =>
      html`<div class="footer-sales">
  <div class="footer-sales__brand"></div>
  <div class="footer-sales__container">
    <div class="trustpilot-lockup">
      <span class="trustpilot-lockup__label">Excellent</span>
      <div class="trustpilot trustpilot--green trustpilot--24"><!-- 4 full + 1 half star --></div>
      <span class="trustpilot-lockup__text">Trustpilot</span>
    </div>

    <hr class="divider">

    <div class="footer-sales__points">
      <div class="footer-sales__point"><span class="footer-sales__point-icon"><!-- customer-service --></span><span class="footer-sales__point-text">UK based call centres</span></div>
      <div class="footer-sales__point"><span class="footer-sales__point-icon"><!-- ncd --></span><span class="footer-sales__point-text">FCA regulated</span></div>
      <div class="footer-sales__point"><span class="footer-sales__point-icon"><!-- replace-refresh --></span><span class="footer-sales__point-text">24/7 claims support</span></div>
      <div class="footer-sales__point"><span class="footer-sales__point-icon"><!-- lock --></span><span class="footer-sales__point-text">Secure checkout</span></div>
    </div>

    <hr class="divider">

    <p class="footer-sales__legal">Zego is a trading name of Extracover Limited, which is authorised and regulated by the Financial Conduct Authority. (FRN: 757871). Extracover Limited is registered in England and Wales, No 10128841. Registered address: Second Floor, 30-40 Eastcheap, London EC3M 1HD.</p>
  </div>
</div>`,
  }
);
