import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Table Item
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=871-86400
 *
 * One data-table cell. Type picks the content (Title / Text / Action link /
 * Tick / Cross / Checkbox / Toggle / Button / Label / Icon); Size is the row
 * height — Large (56px, default) or Small (.table-item--small, 40px). Composes
 * Checkbox, Toggle, Button and Status Label; badges and icons come from /icons.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=871-86400",
  {
    props: {
      size: figma.enum("Size", {
        Large: "",
        Small: "table-item--small",
      }),
    },
    example: ({ size }) =>
      html`<!-- Type = Title -->
<div class="table-item ${size} table-item--title">Title</div>

<!-- Type = Action (link) -->
<div class="table-item ${size} table-item--action"><a class="table-item__link" href="#">Text</a></div>

<!-- Type = Tick -->
<div class="table-item ${size} table-item--tick">
  <span class="table-item__badge table-item__badge--tick"><!-- tick --></span>
</div>

<!-- Type = Checkbox / Toggle / Button / Label / Icon — the cell holds the DS component -->
<div class="table-item ${size}"><label class="checkbox"><!-- … --></label></div>`,
  }
);
