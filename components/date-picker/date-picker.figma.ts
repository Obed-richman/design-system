import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Date Picker
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-11422
 *
 * A calendar in a floating card. The grid is rendered from data attributes by
 * date-picker.js (data-year / data-month / data-selected / data-today).
 * Composes Button (nav FABs + Cancel/Confirm) and arrow icons.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-11422",
  {
    example: () =>
      html`<div class="date-picker" data-year="2026" data-month="0" data-today="2026-0-15" data-selected="2026-0-26">
  <div class="date-picker__header">
    <button class="btn btn--secondary btn--fab date-picker__nav date-picker__prev" type="button" aria-label="Previous month"><span class="btn__icon"><!-- arrow-left --></span></button>
    <p class="date-picker__title">January 2026</p>
    <button class="btn btn--secondary btn--fab date-picker__nav date-picker__next" type="button" aria-label="Next month"><span class="btn__icon"><!-- arrow-right --></span></button>
  </div>
  <div class="date-picker__weekdays">
    <span class="date-picker__weekday">M</span><span class="date-picker__weekday">T</span><span class="date-picker__weekday">W</span><span class="date-picker__weekday">T</span><span class="date-picker__weekday">F</span><span class="date-picker__weekday">S</span><span class="date-picker__weekday">S</span>
  </div>
  <div class="date-picker__grid"><!-- days rendered by date-picker.js --></div>
  <div class="date-picker__actions">
    <button class="btn btn--secondary btn--pill" type="button">Cancel</button>
    <button class="btn btn--primary btn--pill" type="button">Confirm</button>
  </div>
</div>`,
  }
);
