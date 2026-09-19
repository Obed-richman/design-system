import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Conditional Selector
 * Figma (Horizontal): https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59173-702832
 * Figma (Vertical):   https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59173-702922
 *
 * A Multiple Choice Selector that reveals a follow-up input when a particular
 * answer is chosen. Composes choice-selector (flat, inside) + a tinted panel;
 * the outer white card is .conditional-selector--surface (Figma's wrap
 * background). The revealing answer carries data-reveals; conditional-selector.js
 * toggles the panel's [hidden]. Kept static — the follow-up is any input.
 */

// Horizontal — white surface card wrapping a horizontal choice selector.
figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59173-702832",
  {
    example: () =>
      html`<div class="conditional-selector conditional-selector--surface">
  <fieldset class="choice-selector">
    <div class="choice-selector__header">
      <p class="choice-selector__title">Title</p>
    </div>
    <div class="choice-selector__options">
      <label class="text-icon-item text-icon-item--inactive"><span class="text-icon-item__text"><span class="text-icon-item__label">Yes</span></span><input class="radio__input" type="radio" name="q" /><span class="radio__control"></span></label>
      <label class="text-icon-item text-icon-item--inactive"><span class="text-icon-item__text"><span class="text-icon-item__label">No</span></span><input class="radio__input" type="radio" name="q" data-reveals /><span class="radio__control"></span></label>
    </div>
  </fieldset>
  <div class="conditional-selector__panel" hidden>
    <!-- any follow-up input (Text Input, Select, segmented date…) -->
  </div>
</div>`,
  }
);

// Vertical — same card, wrapping a vertical (stacked) choice selector.
figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59173-702922",
  {
    example: () =>
      html`<div class="conditional-selector conditional-selector--surface">
  <fieldset class="choice-selector choice-selector--vertical">
    <div class="choice-selector__header">
      <p class="choice-selector__title">Title</p>
    </div>
    <div class="choice-selector__options">
      <label class="text-icon-item text-icon-item--inactive"><span class="text-icon-item__text"><span class="text-icon-item__label">Yes</span></span><input class="radio__input" type="radio" name="q" /><span class="radio__control"></span></label>
      <label class="text-icon-item text-icon-item--inactive"><span class="text-icon-item__text"><span class="text-icon-item__label">No</span></span><input class="radio__input" type="radio" name="q" data-reveals /><span class="radio__control"></span></label>
    </div>
  </fieldset>
  <div class="conditional-selector__panel" hidden>
    <!-- any follow-up input (Text Input, Select, segmented date…) -->
  </div>
</div>`,
  }
);
