import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Bottom Nav Item
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2265-10389
 *
 * One item of the mobile bottom navigation: a 24px icon above a 12px bold
 * label, wrapped in a .bottom-nav bar. The active tab uses .bottom-nav__item
 * --active + aria-current and swaps its icon to the FILLED variant; inactive
 * tabs use the OUTLINE icon. Tabs: Home, Insights, Policies, Documents,
 * Discover, Claims, Rewards, More.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2265-10389",
  {
    example: () =>
      html`<nav class="bottom-nav">
  <a class="bottom-nav__item bottom-nav__item--active" href="#" aria-current="page">
    <span class="bottom-nav__icon"><!-- filled icon --></span>
    <span class="bottom-nav__label">Home</span>
  </a>
  <a class="bottom-nav__item" href="#">
    <span class="bottom-nav__icon"><!-- outline icon --></span>
    <span class="bottom-nav__label">Insights</span>
  </a>
  <!-- more .bottom-nav__item tabs -->
</nav>`,
  }
);

/**
 * Code Connect — Bottom Navigation Bar (the full bar)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2275-9633
 *
 * Android (default) sits flush with a top border. iOS uses the "Liquid Glass"
 * variant: add .bottom-nav--ios and wrap the items in a .bottom-nav__glass pill
 * — the active tab then gets a soft pill highlight instead of Android's
 * icon-only fill.
 */
figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2275-9633",
  {
    example: () =>
      html`<nav class="bottom-nav bottom-nav--ios">
  <div class="bottom-nav__glass">
    <a class="bottom-nav__item bottom-nav__item--active" href="#" aria-current="page">
      <span class="bottom-nav__icon"><!-- filled icon --></span>
      <span class="bottom-nav__label">Home</span>
    </a>
    <a class="bottom-nav__item" href="#">
      <span class="bottom-nav__icon"><!-- outline icon --></span>
      <span class="bottom-nav__label">Rewards</span>
    </a>
    <!-- more .bottom-nav__item tabs -->
  </div>
</nav>`,
  }
);
