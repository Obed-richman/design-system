import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Mobile Top Nav
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2646-7040
 *
 * In-app mobile chrome: an OS status bar, a nav bar with left/right toolbar
 * slots (e.g. profile avatar + rewards pill) and an optional page title. The
 * "stacked" variant is the modal / web-view header (grabber + close). Not the
 * desktop platform header — that's top-nav.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2646-7040",
  {
    example: () =>
      html`<div class="mobile-nav">
  <div class="mobile-nav__status">
    <span class="mobile-nav__time">9:41</span>
    <span class="mobile-nav__glyphs"><!-- signal · wifi · battery --></span>
  </div>
  <div class="mobile-nav__bar">
    <div class="mobile-nav__slot">
      <button class="mobile-nav__avatar" type="button" aria-label="Profile"><!-- profile icon --></button>
    </div>
    <div class="mobile-nav__slot mobile-nav__slot--right">
      <button class="mobile-nav__rewards" type="button"><!-- hexagon -->0,000</button>
    </div>
  </div>
  <div class="mobile-nav__title"><h1>Page title</h1></div>
</div>`,
  }
);
