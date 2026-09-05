import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Tile List
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4080-20660
 *
 * An optional heading above a white card holding a gap-separated stack of
 * bordered tiles. Each tile is a tappable row — an optional leading icon, a
 * bold title (with an optional support line) and a trailing chevron. Kept
 * static: the tiles and their count (Figma "List=1…10") are consumer content.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4080-20660",
  {
    example: () =>
      html`<div class="tile-list">
  <h3 class="tile-list__title">Title</h3>
  <div class="tile-list__card">
    <div class="tile-list__tiles">
      <a class="display-tile" href="#">
        <span class="display-tile__icon"><!-- icons/correct-outline.svg --></span>
        <span class="display-tile__text"><span class="display-tile__title">Subtitle</span></span>
        <span class="display-tile__chevron"><!-- icons/chevron-small.svg --></span>
      </a>
      <!-- more .display-tile items (Figma List=1 to 10) -->
    </div>
  </div>
</div>`,
  }
);
