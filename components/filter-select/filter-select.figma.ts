import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Filter Select
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60055-15049
 *
 * A select-style filter. The trigger looks like a Text Input field; it opens a
 * dropdown of options, each a Checkbox paired with a Status-label badge. Ticking
 * options adds them to the trigger as removable chips (filter-select.js keeps
 * the chips and checkboxes in sync). Reuses Checkbox and Status label.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60055-15049",
  {
    example: () =>
      html`<div class="filter-select" data-open="false">
  <div class="filter-select__trigger" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">
    <span class="filter-select__value">
      <span class="filter-select__label">Status</span>
      <span class="filter-select__chips"><!-- chips are built from the checked options --></span>
    </span>
    <span class="filter-select__chevron"><!-- chevron --></span>
  </div>
  <div class="filter-select__dropdown" role="listbox">
    <label class="checkbox filter-select__option">
      <input class="checkbox__input" type="checkbox" value="active" data-fs-label="Active" data-fs-variant="success" checked>
      <span class="checkbox__box"><!-- tick --></span>
      <span class="status-label status-label--rounded status-label--success">Active</span>
    </label>
    <!-- more .filter-select__option rows -->
  </div>
</div>`,
  }
);
