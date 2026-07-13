import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Add-ons Section ("Optional extras")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58329-40421
 *
 * The quote-page section presenting optional extras: a title, an intro line
 * and a grid of Extra Cover add-on cards. "Breakpoint" maps to the responsive
 * layout (2-up desktop / 1-up mobile); the prop flags toggle each card.
 *
 * Reuses Extra Cover (and, through it, Button). See the showcase for the full
 * card markup and the per-card badge icons.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58329-40421",
  {
    example: () =>
      html`<section class="addons">
  <div class="addons__head">
    <h2 class="addons__title">Optional extras</h2>
    <p class="addons__subtitle">We offer extra protection for stress-free driving.</p>
  </div>
  <div class="addons__cards">
    <!-- one .extra-cover card per add-on (Breakdown, Vehicle replacement, NCD, Legal expenses) -->
    <div class="extra-cover">
      <div class="extra-cover__content">
        <div class="extra-cover__top">
          <span class="extra-cover__badge"><!-- add-on icon --></span>
          <span class="extra-cover__added">Added</span>
        </div>
        <h3 class="extra-cover__title">Breakdown cover</h3>
        <p class="extra-cover__desc">This includes combined roadside and recovery within the UK. <a class="extra-cover__link" href="#">Read more</a></p>
        <div class="extra-cover__tile">
          <span class="extra-cover__tile-icon"><!-- documents icon --></span>
          <span class="extra-cover__tile-label">Insurance information Document (IPID)</span>
          <button class="btn btn--secondary btn--pill btn--small" type="button">Download</button>
        </div>
      </div>
      <div class="extra-cover__footer">
        <p class="extra-cover__price">£59.99</p>
        <button class="btn btn--primary btn--pill btn--small extra-cover__add" type="button">
          <span class="btn__icon extra-cover__add-plus"><!-- + --></span>
          <span class="btn__icon extra-cover__add-minus"><!-- - --></span>
          <span class="extra-cover__add-label">Add</span>
        </button>
      </div>
    </div>
  </div>
</section>`,
  }
);
