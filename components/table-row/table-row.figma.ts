import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Table Row
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=871-86863
 *
 * A row of Table Item cells. Background = White (default) or Grey
 * (.table-row--grey) for zebra striping. Columns (2–8) is the number of cells;
 * content cells share the width, .table-item--fit cells (checkbox + controls)
 * shrink to content. Breakpoint (Desktop/Mobile) is the row's own width.
 * Composes Table Item (and, through it, Checkbox / Toggle / Button / Status Label).
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=871-86863",
  {
    props: {
      background: figma.enum("Background", {
        White: "",
        Grey: "table-row--grey",
      }),
    },
    example: ({ background }) =>
      html`<div class="table-row ${background}">
  <div class="table-item table-item--fit"><label class="checkbox"><!-- select --></label></div>
  <div class="table-item table-item--title">Title</div>
  <div class="table-item table-item--text">Text</div>
  <div class="table-item table-item--action"><a class="table-item__link" href="#">Text</a></div>
  <div class="table-item table-item--fit table-item--center"><label class="toggle"><!-- … --></label></div>
  <div class="table-item table-item--fit table-item--center"><span class="table-item__badge table-item__badge--tick"><!-- tick --></span></div>
</div>`,
  }
);
