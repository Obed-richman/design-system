import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Data Table
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60438-9302
 *
 * The whole data table: a Control Set toolbar (search · date range · Filter
 * Select · Clear all), a grey header Table Row whose Title cells can carry a
 * sort control, a body of Table Rows, and a footer (summary + Load more Button).
 * Composes Control Set, Table Row, Table Item and Button.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60438-9302",
  {
    example: () =>
      html`<div class="data-table">
  <!-- Toolbar: a Control Set (search · date · Filter Select · Clear all) -->
  <div class="control-set data-table__toolbar"><!-- … --></div>

  <div class="data-table__body">
    <!-- Header row (grey); sortable Title cells wrap the label in .data-table__sort -->
    <div class="table-row table-row--grey data-table__head">
      <div class="table-item table-item--title"><span class="data-table__sort">Title<span class="data-table__sort-icon"><!-- ⇅ --></span></span></div>
      <!-- … more Title cells … -->
    </div>
    <!-- Body rows -->
    <div class="table-row"><div class="table-item table-item--text">Text</div><!-- … --></div>
  </div>

  <div class="data-table__footer">
    <span class="data-table__summary">Showing 6 of 14 transactions</span>
    <button class="btn btn--secondary btn--rounded data-table__more" type="button">Load more</button>
  </div>
</div>`,
  }
);
