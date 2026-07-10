import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Display Row
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4097-22988
 *
 * A configurable list row. Each Figma boolean maps to an optional slot:
 * Icon → __icon, Support text → __support, 2 Columns → __value, and the
 * trailing slot holds a Chevron / Radio / Button. Reuses Radio + Button.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4097-22988",
  {
    props: {
      icon: figma.boolean("Icon"),
      support: figma.boolean("Support text"),
      value: figma.boolean("2 Columns"),
      chevron: figma.boolean("Chevron"),
      radio: figma.boolean("Radio"),
    },
    example: ({ icon, support, value, chevron, radio }) =>
      html`<div class="display-row">
  ${icon ? html`<span class="display-row__icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z" fill="currentColor"/></svg></span>` : ""}
  <div class="display-row__main">
    <p class="display-row__label">Delivery</p>
    ${support ? html`<p class="display-row__support">Paragraph</p>` : ""}
  </div>
  ${value ? html`<p class="display-row__value">Delivery</p>` : ""}
  ${radio ? html`<span class="display-row__trailing"><input class="radio__input" type="radio" name="row" /><span class="radio__control"></span></span>` : ""}
  ${chevron ? html`<span class="display-row__trailing"><svg class="display-row__chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4l7 8-7 8" stroke="currentColor" stroke-width="2" fill="none" /></svg></span>` : ""}
</div>`,
  }
);
