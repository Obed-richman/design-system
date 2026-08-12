import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Small Comparison Tile
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57968-9417
 *
 * NOT Comparison Tile (6477-174868), which is a coloured frame over a big price.
 * This one lays out the arithmetic of one payment plan, which is why its panel holds
 * lines and tags rather than an amount.
 *
 * "state" maps to the chosen modifier. Active is spelled "Avtive" in Figma; the enum
 * key has to match the variant name, so the typo is carried here on purpose — fix it
 * there and this line changes with it.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57968-9417",
  {
    props: {
      state: figma.enum("State", {
        Default: "",
        Hover: "small-comparison-tile--hover",
        Avtive: "small-comparison-tile--active",
      }),
    },
    example: ({ state }) =>
      html`<label class="small-comparison-tile ${state}">
  <div class="small-comparison-tile__top">
    <span class="small-comparison-tile__badge"><!-- product icon --></span>
    <span class="small-comparison-tile__control">
      <input class="radio__input" type="radio" name="payment">
      <span class="radio__control"></span>
    </span>
  </div>
  <p class="small-comparison-tile__title">Pay monthly</p>
  <div class="small-comparison-tile__panel">
    <ul class="small-comparison-tile__lines">
      <li class="small-comparison-tile__line"><span>Today</span><span>&pound;500</span></li>
      <li class="small-comparison-tile__line"><span>Then 11 monthly repayments</span><span>&pound;216</span></li>
      <li class="small-comparison-tile__line small-comparison-tile__line--total"><span>Total</span><span>&pound;2,876</span></li>
    </ul>
    <div class="small-comparison-tile__meta">
      <span class="small-comparison-tile__tag">Spread the cost</span>
      <span class="small-comparison-tile__tag small-comparison-tile__tag--note">19.9% APR</span>
    </div>
  </div>
</label>`,
  }
);
