import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Payment Details (Figma "Payment details")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59689-74225
 *
 * A card that collects card-payment details for lending / checkout: a payment-
 * method selector, card inputs with detected brand logos, country & postcode, a
 * disclosures panel and a consent acknowledgement. Composes Input, Payment Set,
 * Display Row and Acknowledge; kept static (the fields are consumer content).
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59689-74225",
  {
    example: () =>
      html`<div class="payment-details">
  <div class="payment-details__text">
    <p class="payment-details__title">Enter your card details</p>
    <p class="payment-details__support">We’ll use your card details to process your loan payments.</p>
  </div>

  <!-- Payment method — Card / Google Pay / Apple Pay -->
  <fieldset class="payment-details__methods">
    <label class="payment-details__method"><input class="payment-details__method-input" type="radio" name="pd-method" checked><span class="payment-details__method-icon"><!-- icons/payment.svg --></span></label>
    <label class="payment-details__method"><input class="payment-details__method-input" type="radio" name="pd-method"><span class="payment-details__method-label">Google Pay</span></label>
    <label class="payment-details__method"><input class="payment-details__method-input" type="radio" name="pd-method"><span class="payment-details__method-icon"><!-- icons/payment/applepay.svg --></span></label>
  </fieldset>

  <div class="input-group">
    <label class="input-label input-label--title" for="pd-card">Card number</label>
    <div class="input-field">
      <input class="input" id="pd-card" type="text" inputmode="numeric" placeholder="XXXX XXXX XXXX">
      <span class="payment-set payment-details__brands" aria-hidden="true"><!-- Payment Set: mastercard · amex · visa --></span>
    </div>
  </div>

  <div class="payment-details__row">
    <div class="input-group"><label class="input-label input-label--title" for="pd-exp">Expiry date</label><div class="input-field"><input class="input" id="pd-exp" placeholder="MM / YY"></div></div>
    <div class="input-group"><label class="input-label input-label--title" for="pd-cvc">Security code</label><div class="input-field"><input class="input" id="pd-cvc" placeholder="CVC"></div></div>
  </div>

  <!-- Country + Postcode: Text Input with a trailing .payment-details__chevron -->

  <div class="payment-details__disclosures">
    <div class="display-row"><span class="display-row__icon"><!-- bullet --></span><div class="display-row__main"><p class="display-row__support">We’ll place a temporary hold…</p></div></div>
    <div class="display-row"><span class="display-row__icon"><!-- bullet --></span><div class="display-row__main"><p class="display-row__support">You can cancel this payment authority…</p></div></div>
  </div>

  <div class="acknowledge">
    <label class="checkbox"><input class="checkbox__input" type="checkbox"><span class="checkbox__box"><!-- tick --></span><span class="checkbox__label acknowledge__text">I acknowledge the above and authorise…</span></label>
    <span class="acknowledge__info"><!-- info --></span>
  </div>
</div>`,
  }
);
