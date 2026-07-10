import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Comparison Tile
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6477-174868
 *
 * A selectable plan card. Reuses the Radio for the header control — link
 * radio.css + comparison-tile.css. The price uses the responsive Title 1
 * token, so Desktop/Mobile is handled automatically. Hover comes from the
 * real pseudo-class; the --hover / --active modifiers force states statically.
 * ("Dissabled" is a typo in the Figma component's State property.)
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6477-174868",
  {
    props: {
      box: figma.enum("State", {
        Inactive: "",
        Hover: "comparison-tile--hover",
        Active: "",
        Dissabled: "comparison-tile--disabled",
      }),
      checked: figma.enum("State", {
        Active: "checked",
        Inactive: "",
        Hover: "",
        Dissabled: "",
      }),
    },
    example: ({ box, checked }) =>
      html`<label class="comparison-tile ${box}">
  <div class="comparison-tile__header">
    <input class="radio__input" type="radio" name="plan" ${checked} />
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
