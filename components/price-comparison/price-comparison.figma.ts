import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Price Comparison
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=7925-150877
 *
 * A titled container holding 1–2 Comparison Tiles (+ optional discount code).
 * Reuses comparison-tile + radio (and input + button for the discount row) —
 * link those stylesheets alongside price-comparison.css. "Cards" (1/2) is how
 * many tiles you add; tiles stack below 768px automatically. The example shows
 * two tiles with the first selected.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=7925-150877",
  {
    example: () =>
      html`<section class="price-comparison">
  <div class="price-comparison__header">
    <h2 class="price-comparison__title">Title</h2>
    <p class="price-comparison__sub">Sub text</p>
  </div>
  <div class="price-comparison__tiles">
    <label class="comparison-tile">
      <div class="comparison-tile__header">
        <input class="radio__input" type="radio" name="quote" checked />
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
    </label>
    <label class="comparison-tile">
      <div class="comparison-tile__header">
        <input class="radio__input" type="radio" name="quote" />
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
    </label>
  </div>
</section>`,
  }
);
