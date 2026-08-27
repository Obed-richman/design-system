import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Dropdown List
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4049-53004
 *
 * A floating menu card that stacks Dropdown Items. The "Style" property
 * switches between plain text rows (Default) and checkbox rows (Selector);
 * "Scroll Bar" toggles the decorative scrollbar shown on long lists.
 * The number of rows (List = 1–10) is content, so it's authored inline.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4049-53004",
  {
    props: {
      row: figma.enum("Style", {
        Default: html`<button class="dropdown-item" type="button"><span class="dropdown-item__label">Item</span></button>`,
        Selector: html`<label class="dropdown-item"><input class="checkbox__input" type="checkbox" /><span class="checkbox__box"></span><span class="dropdown-item__label">Item</span></label>`,
      }),
      scrollBar: figma.boolean("Scroll Bar", {
        true: html`<div class="dropdown-list__scrollbar"><div class="dropdown-list__scroller"></div></div>`,
        false: "",
      }),
    },
    example: ({ row, scrollBar }) =>
      html`<div class="dropdown-list">
  ${row}
  <!-- …repeat one Dropdown Item per option (1–10)… -->
  ${scrollBar}
</div>`,
  }
);
