import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Payment Set (Figma "Payment Set")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=5221-43348
 *
 * A row of accepted payment-method logos (24px tall, 16px apart) in a fixed
 * order: Mastercard · Amex · Visa · PayPal · Apple Pay · Premium Credit · Klarna.
 * Show 2–7 by including that many in order. Each logo is the official brand mark
 * from icons/payment; kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=5221-43348",
  {
    example: () =>
      html`<div class="payment-set">
  <span class="payment-set__item" role="img" aria-label="Mastercard"><!-- icons/payment/mastercard.svg --></span>
  <span class="payment-set__item" role="img" aria-label="American Express"><!-- icons/payment/amex.svg --></span>
  <span class="payment-set__item" role="img" aria-label="Visa"><!-- icons/payment/visa.svg --></span>
  <span class="payment-set__item" role="img" aria-label="PayPal"><!-- icons/payment/paypal.svg --></span>
  <span class="payment-set__item" role="img" aria-label="Apple Pay"><!-- icons/payment/applepay.svg --></span>
  <span class="payment-set__item" role="img" aria-label="Premium Credit"><!-- icons/payment/premium.svg --></span>
  <span class="payment-set__item" role="img" aria-label="Klarna"><!-- icons/payment/klarna.svg --></span>
</div>`,
  }
);
