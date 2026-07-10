import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Segment Control
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=719-198571
 *
 * A single-select pill of segments. Size maps to a modifier; "Toggles" (2/3)
 * is just how many segments you add. Include segment.js for click selection.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=719-198571",
  {
    props: {
      size: figma.enum("Size", {
        Small: "",
        Medium: "segment--40",
        Large: "segment--56",
      }),
    },
    example: ({ size }) =>
      html`<div class="segment ${size}" role="tablist">
  <button class="segment__item segment__item--active" role="tab" aria-selected="true">On</button>
  <button class="segment__item" role="tab" aria-selected="false">Off</button>
</div>`,
  }
);
