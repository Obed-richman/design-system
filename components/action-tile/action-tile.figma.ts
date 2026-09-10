import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Action Tile (Figma "Tiles" — Action)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59611-25610
 *
 * A compact tappable shortcut card: a centred Icon+ badge over a short label.
 * Swap the glyph and pick an Icon+ colour variant per tile. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59611-25610",
  {
    example: () =>
      html`<button class="action-tile" type="button">
  <span class="icon-plus icon-plus--32"><!-- swappable glyph, e.g. icons/documents.svg --></span>
  <span class="action-tile__label">View my documents</span>
</button>`,
  }
);
