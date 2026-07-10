import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Sales Navigation
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57538-15188
 *
 * The onboarding top bar (Zego logo + Trustpilot + Help pill + Onboarding
 * Steps). The "Expanded" boolean opens the Call-us dropdown; the initial
 * [data-expanded] state is set here and toggled at runtime by sales-nav.js.
 * Reuses Trustpilot stars and Onboarding Steps.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57538-15188",
  {
    props: {
      expanded: figma.boolean("Expanded"),
    },
    example: ({ expanded }) =>
      html`<div class="sales-nav" data-expanded="${expanded}">
  <div class="sales-nav__header">
    <div class="sales-nav__brand">
      <span class="sales-nav__logo"><!-- Zego logo svg --></span>
      <span class="sales-nav__lockup">
        <span class="trustpilot trustpilot--green trustpilot--16"><!-- 5 star tiles --></span>
        <span class="sales-nav__lockup-text">Trustpilot</span>
      </span>
    </div>
    <button class="sales-nav__toggle" type="button" aria-expanded="${expanded}">
      <span class="sales-nav__help-label">Help</span><span class="sales-nav__close-label">Close</span>
      <span class="sales-nav__toggle-icon sales-nav__help-icon"><!-- headset --></span>
      <span class="sales-nav__toggle-icon sales-nav__close-icon"><!-- close --></span>
    </button>
    <div class="sales-nav__panel">
      <div class="sales-nav__callus">
        <span class="sales-nav__callus-icon"><!-- phone --></span>
        <div><p class="sales-nav__callus-title">Call us</p><p class="sales-nav__callus-number">+44 20 3308 9800</p></div>
      </div>
      <div class="sales-nav__hours">
        <p class="sales-nav__hours-title">Opening hours</p>
        <p class="sales-nav__hours-times">Mon–Wed &amp; Fri 9am–5pm · Thu 10am–5pm</p>
      </div>
    </div>
  </div>
  <div class="sales-nav__steps">
    <div class="onboarding-steps onboarding-steps--compact"><!-- Vehicle · Driver · Quote · Payment --></div>
  </div>
</div>`,
  }
);
