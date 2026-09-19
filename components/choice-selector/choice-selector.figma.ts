import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Multiple Choice Selector
 * Figma (Horizontal): https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4225-22956
 * Figma (Vertical):   https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57596-34542
 *
 * A titled radio group of Text + Icon Item options. Reuses text-icon-item +
 * radio — link radio.css + text-icon-item.css + choice-selector.css. The
 * "Items" property (2–6) is just how many options you add; the examples show
 * two. Horizontal shares the row width equally; Vertical (.choice-selector--vertical)
 * stacks full-width rows.
 */

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

// Vertical — full-width rows stacked (Figma "Multiple choice selector / Vertical").
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
