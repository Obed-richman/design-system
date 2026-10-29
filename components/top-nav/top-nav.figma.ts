import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Top Navigation (maps to Figma "Sales navigation")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57538-15188
 *
 * The sales/quote-journey header. The old node (57546-7734) was deleted in the
 * Design-System-003 reorganisation; the current equivalent is the "Sales
 * navigation" component set, whose variant properties line up with this markup:
 * "Expanded" (Yes/No) opens the support dropdown, and "Breakpoint"
 * (Desktop/Mobile) is handled here by CSS (media query, or html[data-viewport]
 * in the showcase). Composes Button + icons; behaviour in top-nav.js.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57538-15188",
  {
    props: {
      expanded: figma.boolean("Expanded"),
    },
    example: ({ expanded }) =>
      html`<header class="top-nav" data-expanded="${expanded}">
  <div class="top-nav__bar">
    <span class="top-nav__logo"><!-- Zego logo --></span>
    <div class="top-nav__actions">
      <button class="btn btn--tertiary btn--pill top-nav__help" type="button" aria-expanded="${expanded}">
        <span class="btn__icon top-nav__help-icon"><!-- headset --></span>
        <span class="btn__icon top-nav__close-icon"><!-- close --></span>
        <span class="top-nav__help-label">Help</span><span class="top-nav__close-label">Close</span>
      </button>
      <button class="btn btn--tertiary btn--pill" type="button">Log out</button>
    </div>
    <button class="top-nav__menu" type="button" aria-label="Menu"><!-- hamburger / close --></button>
  </div>
  <div class="top-nav__panel">
    <div class="top-nav__row"><span class="top-nav__row-icon"><!-- phone --></span><div><p class="top-nav__row-title">Call us</p><p class="top-nav__row-sub">+44 2030 539 815</p></div></div>
    <div class="top-nav__row"><span class="top-nav__row-icon"><!-- chat --></span><div><p class="top-nav__row-title">Chat with us</p><p class="top-nav__row-sub">Get instant answers</p></div></div>
    <div class="top-nav__ref">
      <p class="top-nav__ref-label">Your quote reference is:</p>
      <div class="top-nav__copy"><span class="top-nav__copy-value">54673646</span><button class="top-nav__copy-btn" type="button" aria-label="Copy"><!-- copy --></button></div>
    </div>
    <div class="top-nav__logout-row"><button class="btn btn--secondary btn--pill" type="button">Log out</button></div>
  </div>
</header>`,
  }
);
