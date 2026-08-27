import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Side Navigation
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59916-795961
 *
 * Console left sidebar. `.side-nav` is the expanded panel; add
 * `.side-nav--collapsed` for the icon-only rail (side-nav.js toggles it).
 * Top-level items are `.side-nav__item` (add `--active` for the current one);
 * expandable sections use a native <details class="side-nav__group">; the
 * Settings item is pinned in `.side-nav__footer`.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59916-795961",
  {
    example: () =>
      html`<nav class="side-nav" aria-label="Console">
  <div class="side-nav__header">
    <span class="side-nav__brand">
      <span class="side-nav__brand-logo"><!-- brand mark --></span>
      <span class="side-nav__brand-name">Console</span>
    </span>
    <button class="side-nav__toggle" type="button" aria-label="Collapse navigation">
      <span class="side-nav__toggle-icon"><!-- chevron --></span>
    </button>
  </div>
  <div class="side-nav__body">
    <div class="side-nav__list">
      <a class="side-nav__item side-nav__item--active" href="#" aria-current="page">
        <span class="side-nav__icon"><!-- icon --></span>
        <span class="side-nav__label">Customers</span>
      </a>
      <!-- more .side-nav__item rows -->
      <details class="side-nav__group" open>
        <summary class="side-nav__group-header">
          <span class="side-nav__group-title">Agents</span>
          <span class="side-nav__group-chevron"><!-- chevron --></span>
        </summary>
        <div class="side-nav__sublist"><!-- .side-nav__item rows --></div>
      </details>
    </div>
  </div>
  <div class="side-nav__footer">
    <a class="side-nav__item" href="#">
      <span class="side-nav__icon"><!-- settings icon --></span>
      <span class="side-nav__label">Settings</span>
    </a>
  </div>
</nav>`,
  }
);
