import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Sales Navigation
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57538-15188
 *
 * The onboarding top bar (Zego logo + Trustpilot + Help pill + Onboarding
 * Steps). The "Expanded" variant opens the Help dropdown; the initial
 * [data-expanded] state is set here and toggled at runtime by sales-nav.js.
 *
 * The "Breakpoint" variant is deliberately not mapped: one set of markup
 * covers both, and sales-nav.css switches between the stacked mobile layout
 * and the single-row desktop layout with a container query at 1024px.
 *
 * Reuses Trustpilot stars, Onboarding Steps and Button.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57538-15188",
  {
    props: {
      expanded: figma.boolean("Expanded"),
      border: figma.boolean("Border", { true: " sales-nav--border", false: "" }),
      trustpilot: figma.boolean("Trustpilot", {
        true: html`<span class="sales-nav__lockup">
          <span class="trustpilot trustpilot--green trustpilot--16"><!-- 5 star tiles --></span>
          <span class="sales-nav__lockup-text">Trustpilot</span>
        </span>`,
        false: "",
      }),
      chat: figma.boolean("Chat", {
        true: html`<div class="sales-nav__row">
        <div class="sales-nav__row-main">
          <span class="sales-nav__row-icon"><!-- icons/live-chat.svg --></span>
          <div class="sales-nav__row-text">
            <p class="sales-nav__row-title">Chat with us</p>
            <p class="sales-nav__row-subtitle">Get instant answers</p>
          </div>
        </div>
      </div>`,
        false: "",
      }),
      customerId: figma.boolean("Customer ID", {
        true: html`<div class="sales-nav__action">
        <p class="sales-nav__action-label">Your quote reference is:</p>
        <button class="btn btn--secondary btn--rounded" type="button">
          54673646
          <span class="btn__icon"><!-- icons/copy.svg --></span>
        </button>
      </div>`,
        false: "",
      }),
      logout: figma.boolean("Logout", {
        true: html`<div class="sales-nav__row sales-nav__row--button">
        <button class="btn btn--secondary btn--pill btn--small" type="button">Log out</button>
      </div>`,
        false: "",
      }),
      steps: figma.boolean("Steps", {
        true: html`<div class="sales-nav__steps">
    <div class="onboarding-steps"><!-- Vehicle · Driver · Quote · Payment --></div>
  </div>`,
        false: "",
      }),
    },
    example: ({ expanded, border, trustpilot, chat, customerId, logout, steps }) =>
      html`<div class="sales-nav${border}" data-expanded="${expanded}">
  <div class="sales-nav__header">
    <div class="sales-nav__brand">
      <span class="sales-nav__logo"><!-- Zego logo svg --></span>
      ${trustpilot}
    </div>
    <button class="btn btn--tertiary btn--pill btn--small sales-nav__toggle" type="button" aria-expanded="${expanded}">
      <span class="sales-nav__help-label">Help</span><span class="sales-nav__close-label">Close</span>
      <span class="btn__icon sales-nav__toggle-icon sales-nav__help-icon"><!-- icons/customer-service.svg --></span>
      <span class="btn__icon sales-nav__toggle-icon sales-nav__close-icon"><!-- icons/cross.svg --></span>
    </button>
    <div class="sales-nav__panel">
      <div class="sales-nav__row sales-nav__row--hours">
        <div class="sales-nav__row-main">
          <span class="sales-nav__row-icon"><!-- icons/phone.svg --></span>
          <div class="sales-nav__row-text">
            <p class="sales-nav__row-title">Call us</p>
            <p class="sales-nav__row-subtitle">+44 20 3308 9800</p>
          </div>
        </div>
        <div class="sales-nav__hours">
          <p class="sales-nav__hours-title">Opening hours</p>
          <p class="sales-nav__hours-times">Mon–Wed &amp; Fri 9am–5pm · Thu 10am–5pm</p>
        </div>
      </div>
      ${chat}
      ${customerId}
      ${logout}
    </div>
  </div>
  ${steps}
</div>`,
  }
);
