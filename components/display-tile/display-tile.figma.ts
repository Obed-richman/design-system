import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Display Tile
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4077-26307
 *
 * A single tappable tile — a bordered rounded row with optional slots: a leading
 * icon, a bold title with an optional support line, an optional right-hand column
 * (Style=Column) and a trailing control (Chevron, Radio or Checkbox). The atom
 * the Tile List stacks. Kept static — the slots are consumer content.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4077-26307",
  {
    example: () =>
      html`<a class="display-tile" href="#">
  <span class="display-tile__icon"><!-- icons/correct-outline.svg --></span>
  <span class="display-tile__text">
    <span class="display-tile__title">Subtitle</span>
    <!-- optional: <span class="display-tile__support">Support</span> -->
  </span>
  <!-- optional right column: <span class="display-tile__text display-tile__text--right">…</span> -->
  <!-- trailing: a Chevron, a Radio or a Checkbox -->
  <span class="display-tile__chevron"><!-- icons/chevron-small.svg --></span>
</a>`,
  }
);
