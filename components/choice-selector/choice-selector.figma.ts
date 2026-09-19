import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Multiple Choice Selector
 * Figma (Horizontal, flat):    https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4225-22956
 * Figma (Horizontal, surface): https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60943-18452
 * Figma (Vertical, flat):      https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57596-34542
 * Figma (Vertical, surface):   https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60943-18718
 *
 * A titled radio group of Text + Icon Item options. Reuses text-icon-item +
 * radio — link radio.css + text-icon-item.css + choice-selector.css. The
 * "Items" property (2–6) is just how many options you add; the examples show
 * two. Horizontal shares the row width equally; Vertical (.choice-selector--vertical)
 * stacks full-width rows. Add .choice-selector--surface for the white card
 * wrapper (its own Figma variant); leave it off for the flat version.
 */

// Horizontal — flat (no card wrapper).
figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4225-22956",
  {
    example: () =>
      html`<fieldset class="choice-selector">
  <div class="choice-selector__header">
    <p class="choice-selector__title">Title</p>
    <p class="choice-selector__paragraph">Paragraph</p>
  </div>
  <div class="choice-selector__options">
    <label class="text-icon-item text-icon-item--inactive">
      <span class="text-icon-item__text"><span class="text-icon-item__label">Text</span></span>
      <input class="radio__input" type="radio" name="group" checked />
      <span class="radio__control"></span>
    </label>
    <label class="text-icon-item text-icon-item--inactive">
      <span class="text-icon-item__text"><span class="text-icon-item__label">Text</span></span>
      <input class="radio__input" type="radio" name="group" />
      <span class="radio__control"></span>
    </label>
  </div>
</fieldset>`,
  }
);

// Horizontal — with the white surface card wrapper.
figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60943-18452",
  {
    example: () =>
      html`<fieldset class="choice-selector choice-selector--surface">
  <div class="choice-selector__header">
    <p class="choice-selector__title">Title</p>
    <p class="choice-selector__paragraph">Paragraph</p>
  </div>
  <div class="choice-selector__options">
    <label class="text-icon-item text-icon-item--inactive">
      <span class="text-icon-item__text"><span class="text-icon-item__label">Text</span></span>
      <input class="radio__input" type="radio" name="group" checked />
      <span class="radio__control"></span>
    </label>
    <label class="text-icon-item text-icon-item--inactive">
      <span class="text-icon-item__text"><span class="text-icon-item__label">Text</span></span>
      <input class="radio__input" type="radio" name="group" />
      <span class="radio__control"></span>
    </label>
  </div>
</fieldset>`,
  }
);

// Vertical — full-width rows stacked (Figma "Multiple choice selector / Vertical"), flat.
figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57596-34542",
  {
    example: () =>
      html`<fieldset class="choice-selector choice-selector--vertical">
  <div class="choice-selector__header">
    <p class="choice-selector__title">Title</p>
    <p class="choice-selector__paragraph">Paragraph</p>
  </div>
  <div class="choice-selector__options">
    <label class="text-icon-item text-icon-item--inactive">
      <span class="text-icon-item__icon"><!-- icon --></span>
      <span class="text-icon-item__text"><span class="text-icon-item__label">Text</span></span>
      <input class="radio__input" type="radio" name="group" checked />
      <span class="radio__control"></span>
    </label>
    <label class="text-icon-item text-icon-item--inactive">
      <span class="text-icon-item__icon"><!-- icon --></span>
      <span class="text-icon-item__text"><span class="text-icon-item__label">Text</span></span>
      <input class="radio__input" type="radio" name="group" />
      <span class="radio__control"></span>
    </label>
  </div>
</fieldset>`,
  }
);

// Vertical — full-width rows stacked, with the white surface card wrapper.
figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60943-18718",
  {
    example: () =>
      html`<fieldset class="choice-selector choice-selector--surface choice-selector--vertical">
  <div class="choice-selector__header">
    <p class="choice-selector__title">Title</p>
    <p class="choice-selector__paragraph">Paragraph</p>
  </div>
  <div class="choice-selector__options">
    <label class="text-icon-item text-icon-item--inactive">
      <span class="text-icon-item__icon"><!-- icon --></span>
      <span class="text-icon-item__text"><span class="text-icon-item__label">Text</span></span>
      <input class="radio__input" type="radio" name="group" checked />
      <span class="radio__control"></span>
    </label>
    <label class="text-icon-item text-icon-item--inactive">
      <span class="text-icon-item__icon"><!-- icon --></span>
      <span class="text-icon-item__text"><span class="text-icon-item__label">Text</span></span>
      <input class="radio__input" type="radio" name="group" />
      <span class="radio__control"></span>
    </label>
  </div>
</fieldset>`,
  }
);
