import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Comparison Tile
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=7925-200961
 *
 * A selectable plan card. Reuses the Radio for the header control — link
 * radio.css + comparison-tile.css. The price uses the responsive Title 1
 * token, so Desktop/Mobile is handled automatically. Hover / active come from
 * the real pseudo-class and the --hover / --active modifiers at runtime.
 * Mapped to the "Comparison tile/Desktop" component set.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=7925-200961",
  {
    example: () =>
      html`<label class="comparison-tile">
  <div class="comparison-tile__header">
    <input class="radio__input" type="radio" name="plan" />
    <span class="radio__control"></span>
    <span class="comparison-tile__title">Title</span>
  </div>
  <div class="comparison-tile__body">
    <div class="comparison-tile__price-group">
      <p class="comparison-tile__price"><span class="comparison-tile__amount">£XXX</span><span class="comparison-tile__period">/year</span></p>
      <p class="comparison-tile__sub">Sub text</p>
    </div>
    <p class="comparison-tile__support">Support text</p>
  </div>
</label>`,
  }
);
