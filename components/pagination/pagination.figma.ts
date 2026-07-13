import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Pagination Indicator
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=844-19892
 *
 * A row of dots showing progress; the current dot is aqua, the rest grey.
 * "Indicators" is the dot count (2 / 3 / 4). The example shows the first dot
 * active; add/remove .pagination__dot spans to change the count.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=844-19892",
  {
    props: {
      indicators: figma.enum("Indicators", { "2": "2", "3": "3", "4": "4" }),
    },
    example: () =>
      html`<div class="pagination" role="tablist" aria-label="Progress">
  <span class="pagination__dot pagination__dot--active" role="tab" aria-selected="true"></span>
  <span class="pagination__dot" role="tab" aria-selected="false"></span>
  <span class="pagination__dot" role="tab" aria-selected="false"></span>
  <span class="pagination__dot" role="tab" aria-selected="false"></span>
</div>`,
  }
);
