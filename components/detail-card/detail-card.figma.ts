import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Detail Card
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57915-6058
 *
 * A card that manages related fields, switching between an editable form and
 * a read-only summary. "View" maps to the card modifier. Composes Input,
 * Radio, Button, Display Row and Divider — field content is authored inline.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57915-6058",
  {
    variant: { View: "View" },
    example: () =>
      html`<div class="detail-card detail-card--view">
  <div class="detail-card__top">
    <p class="detail-card__title">Claim #1</p>
    <div class="detail-card__actions">
      <button class="detail-card__icon-btn" type="button" aria-label="Delete"><!-- trash --></button>
      <span class="detail-card__divider-v"></span>
      <button class="detail-card__icon-btn" type="button" aria-label="Edit"><!-- pencil --></button>
    </div>
  </div>
  <div class="detail-card__view">
    <div class="display-row"><div class="display-row__main"><p class="display-row__label">Incident date</p></div><p class="display-row__value">13/06/2026</p></div>
    <div class="display-row"><div class="display-row__main"><p class="display-row__label">Claim value</p></div><p class="display-row__value">£1,436.00</p></div>
  </div>
</div>`,
  }
);

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57915-6058",
  {
    variant: { View: "Edit" },
    example: () =>
      html`<div class="detail-card detail-card--edit">
  <div class="detail-card__top">
    <p class="detail-card__title">Claim #1</p>
    <div class="detail-card__actions">
      <button class="detail-card__icon-btn" type="button" aria-label="Delete"><!-- trash --></button>
    </div>
  </div>
  <div class="detail-card__content">
    <div class="detail-card__field">
      <p class="detail-card__label">Incident date?</p>
      <div class="input-field"><input class="input" type="text" placeholder="MM / YYYY" /></div>
    </div>
    <fieldset class="choice-selector">
      <div class="choice-selector__header"><p class="choice-selector__title">Your fault?</p></div>
      <div class="choice-selector__options">
        <label class="text-icon-item text-icon-item--inactive"><span class="text-icon-item__text"><span class="text-icon-item__label">Yes</span></span><input class="radio__input" type="radio" name="fault" /><span class="radio__control"></span></label>
        <label class="text-icon-item text-icon-item--inactive"><span class="text-icon-item__text"><span class="text-icon-item__label">No</span></span><input class="radio__input" type="radio" name="fault" /><span class="radio__control"></span></label>
      </div>
    </fieldset>
  </div>
  <hr class="divider" />
  <div class="detail-card__buttons">
    <button class="btn btn--secondary btn--pill" type="button">Cancel</button>
    <button class="btn btn--tertiary btn--pill" type="button">Save</button>
  </div>
</div>`,
  }
);
