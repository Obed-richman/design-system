import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Tier Section
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58323-28325
 *
 * The full "choose your cover" section: title, billing Segment, a card of
 * standard included features, a row of Tier Cards (one colour per tier) and a
 * list of downloadable policy documents. "Breakpoint" maps to the responsive
 * layout — tiers sit side by side on desktop and stack below 768px.
 *
 * Reuses Segment, Tier Card, Display Row and Button (.btn--small); see the
 * showcase for the full markup and the per-tier header colour modifiers
 * (.tier-card--core / --max / --electric).
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58323-28325",
  {
    props: {
      title: figma.string("Title"),
    },
    example: ({ title }) =>
      html`<section class="tier-section">
  <p class="tier-section__title">${title}</p>

  <div class="segment segment--40" role="tablist" aria-label="Billing period">
    <button class="segment__item" role="tab" aria-selected="false">Pay annual</button>
    <button class="segment__item segment__item--active" role="tab" aria-selected="true">Pay monthly</button>
  </div>

  <div class="tier-section__body">
    <div class="tier-section__included">
      <p class="tier-section__included-title">All policies include these as standard</p>
      <div class="tier-section__included-grid">
        <!-- .tier-card__feature cells (tick + text + info) -->
      </div>
    </div>

    <div class="tier-section__tiers">
      <!-- .tier-card, .tier-card.tier-card--core, --max, --electric -->
    </div>

    <div class="tier-section__docs">
      <div class="display-row">
        <div class="display-row__main"><p class="display-row__label">Policy wording</p></div>
        <span class="display-row__trailing"><button class="btn btn--secondary btn--small btn--pill" type="button">Download</button></span>
      </div>
    </div>
  </div>
</section>`,
  }
);
