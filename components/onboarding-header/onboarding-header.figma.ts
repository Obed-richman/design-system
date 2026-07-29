import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Onboarding Header (Onboarding steps / v1)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-14386
 *
 * A navy page-header banner shown at the top of each onboarding stage: the
 * numbered step indicator, then a large title (+ optional subtitle). The first
 * stage also shows the aggregator logo and reg plate.
 *
 * Composes the Onboarding Steps (--numbered) stepper, the aggregator .partner
 * logo and the .plate. "Stage" selects which step is current; "Breakpoint"
 * maps to the desktop/mobile layout (handled by the component's media query).
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-14386",
  {
    example: () =>
      html`<div class="onboarding-header">
  <div class="onboarding-header__steps">
    <div class="onboarding-steps onboarding-steps--numbered">
      <div class="onboarding-steps__step onboarding-steps__step--current">
        <span class="onboarding-steps__badge"><span class="onboarding-steps__badge-num">1</span><span class="onboarding-steps__badge-tick"><svg viewBox="0 0 24 24" fill="none"><path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="2.5" fill="none" /></svg></span></span>
        <span class="onboarding-steps__label">Quote</span>
        <span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>
      </div>
      <div class="onboarding-steps__step">
        <span class="onboarding-steps__badge"><span class="onboarding-steps__badge-num">2</span><span class="onboarding-steps__badge-tick"></span></span>
        <span class="onboarding-steps__label">Details</span>
        <span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>
      </div>
      <div class="onboarding-steps__step">
        <span class="onboarding-steps__badge"><span class="onboarding-steps__badge-num">3</span><span class="onboarding-steps__badge-tick"></span></span>
        <span class="onboarding-steps__label">Review</span>
        <span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>
      </div>
      <div class="onboarding-steps__step">
        <span class="onboarding-steps__badge"><span class="onboarding-steps__badge-num">4</span><span class="onboarding-steps__badge-tick"></span></span>
        <span class="onboarding-steps__label">Payment</span>
        <span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>
      </div>
    </div>
  </div>
  <div class="onboarding-header__body">
    <h2 class="onboarding-header__title">Let's find your best price</h2>
    <div class="onboarding-header__meta">
      <span class="partner partner--gocompare" role="img" aria-label="GoCompare"></span>
      <span class="plate">SH48 HSA</span>
    </div>
  </div>
</div>`,
  }
);
