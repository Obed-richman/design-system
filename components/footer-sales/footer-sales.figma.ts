import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Sales Footer (footer / Sales)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59381-8290
 *
 * Navy marketing footer: brand accent strip, a Trustpilot lockup, a row of
 * trust/service points and the legal small-print. Reuses Trustpilot,
 * Trustpilot Lockup and Divider (tinted white on the navy surface).
 *
 * The "Breakpoint" variant is deliberately not mapped: one set of markup covers
 * both, and footer-sales.css switches the service points from 2 across to 4
 * across with a container query at 768px.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59381-8290",
  {
    example: () =>
      html`<div class="footer-sales">
  <div class="footer-sales__brand"><!-- brand strip svg (1440×12, pinned right) --></div>
  <div class="footer-sales__container">
    <div class="trustpilot-lockup">
      <span class="trustpilot-lockup__label">Excellent</span>
      <div class="trustpilot trustpilot--green trustpilot--24"><!-- 4 full + 1 half star --></div>
      <span class="trustpilot-lockup__text">Trustpilot</span>
    </div>

    <hr class="divider">

    <div class="footer-sales__points">
      <div class="footer-sales__point"><span class="footer-sales__point-icon"><!-- icons/customer-service.svg --></span><span class="footer-sales__point-text">UK based call centres</span></div>
      <div class="footer-sales__point"><span class="footer-sales__point-icon"><!-- icons/ncd.svg --></span><span class="footer-sales__point-text">FCA regulated</span></div>
      <div class="footer-sales__point"><span class="footer-sales__point-icon"><!-- icons/replace-refresh.svg --></span><span class="footer-sales__point-text">24/7 claims support</span></div>
      <div class="footer-sales__point"><span class="footer-sales__point-icon"><!-- icons/lock.svg --></span><span class="footer-sales__point-text">Secure checkout</span></div>
    </div>

    <hr class="divider">

    <p class="footer-sales__legal">Zego is a trading name of Extracover Limited, which is authorised and regulated by the Financial Conduct Authority. (FRN: 757871). Extracover Limited is registered in England and Wales, No 10128841. Registered address: Second Floor, 30-40 Eastcheap, London EC3M 1HD.</p>
  </div>
</div>`,
  }
);
