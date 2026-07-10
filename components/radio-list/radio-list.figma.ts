import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Multiple Choice Radio
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4734-30898
 *
 * A stacked radio list. Reuses the Radio for each row's control — link
 * radio.css + radio-list.css. The "Number" property (1–5) is just how many
 * rows you add; the example shows two.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4734-30898",
  {
    example: () =>
      html`<fieldset class="radio-list">
  <label class="radio-list__row">
    <span class="radio-list__label">Text</span>
    <input class="radio__input" type="radio" name="choice" checked />
    <span class="radio__control"></span>
  </label>
  <label class="radio-list__row">
    <span class="radio-list__label">Text</span>
    <input class="radio__input" type="radio" name="choice" />
    <span class="radio__control"></span>
  </label>
</fieldset>`,
  }
);
