import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Control Set
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59985-62586
 *
 * A filter toolbar above a table or list. Filter set = a search field, a
 * date-range field, a Filter Select and a Clear-all button (search/date/status
 * each optional). Tabs control (.control-set--tabs) = a tab bar. Composes Text
 * Input, Filter Select, Button and Tab.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59985-62586",
  {
    example: () =>
      html`<div class="control-set">
  <div class="input-field control-set__search">
    <input class="input" type="search" placeholder="Search by name, email or ID">
    <span class="search__glyph"><!-- search icon --></span>
  </div>
  <div class="control-set__date-wrap">
    <button class="input-field control-set__date" type="button" aria-haspopup="dialog" aria-expanded="false">
      <span class="control-set__date-value" data-placeholder="Select dates">21 Jan 2026 → 30 Jan 2026</span>
      <span class="control-set__date-icon"><!-- calendar icon --></span>
    </button>
    <div class="control-set__datepicker"><!-- .date-picker (opens on click) --></div>
  </div>
  <div class="filter-select control-set__filter"><!-- Filter Select --></div>
  <button class="btn btn--secondary btn--rounded control-set__clear" type="button">Clear all</button>
</div>`,
  }
);
