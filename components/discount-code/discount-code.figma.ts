import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Discount Code
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=7861-485803
 *
 * Enter / apply / remove a promo code. "State" chooses the rendering:
 * Default & Error are a labelled Input + Apply button (Error adds the clear ×
 * and a message); Applied is an information Alert with a Remove button.
 * Composes Input, Button and Alert.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=7861-485803",
  {
    variant: { State: "Default" },
    example: () =>
      html`<div class="discount-code">
  <p class="discount-code__label">Add a discount code</p>
  <div class="discount-code__row">
    <div class="input-field"><input class="input" type="text" placeholder="Enter discount code" /></div>
    <button class="btn btn--secondary btn--rounded discount-code__apply" type="button">Apply code</button>
  </div>
</div>`,
  }
);

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=7861-485803",
  {
    variant: { State: "Error" },
    example: () =>
      html`<div class="discount-code">
  <p class="discount-code__label">Add a discount code</p>
  <div class="discount-code__row">
    <div class="input-field input-field--error">
      <input class="input" type="text" value="ZEG/22" />
      <button class="input__clear" type="button" aria-label="Clear"><!-- close × --></button>
    </div>
    <button class="btn btn--secondary btn--rounded discount-code__apply" type="button">Apply code</button>
  </div>
  <div class="discount-code__message">
    <span class="discount-code__message-icon"><!-- warning --></span>
    <p class="discount-code__message-text">Invalid code, please check and try again</p>
  </div>
</div>`,
  }
);

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=7861-485803",
  {
    variant: { State: "Applied" },
    example: () =>
      html`<div class="alert alert--information alert--bordered discount-code__applied">
  <span class="alert__icon"><!-- voucher --></span>
  <div class="alert__content">
    <p class="alert__title">Code ZEGO22 applied!</p>
    <p class="alert__description">You're saving £60.00</p>
  </div>
  <button class="btn btn--tertiary btn--pill discount-code__remove" type="button">
    <span class="btn__icon"><!-- minus --></span>Remove<span class="btn__icon discount-code__remove-arrow"><!-- arrow-right --></span>
  </button>
</div>`,
  }
);
