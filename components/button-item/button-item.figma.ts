import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Button Item (Figma "Button Item")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57596-3968
 *
 * A tappable navigation / selection row: an Icon+ badge, a bold label (with an
 * optional support line) and a trailing chevron. States are interaction-driven
 * (hover / active / focus / disabled) — see button-item.css. Composes Icon+;
 * kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57596-3968",
  {
    example: () =>
      html`<a class="button-item" href="#">
  <span class="icon-plus button-item__badge"><!-- icons/new-driver.svg --></span>
  <span class="button-item__text">
    <span class="button-item__label">New drivers</span>
    <!-- optional: <span class="button-item__support">Recently passed your test</span> -->
  </span>
  <span class="button-item__chevron"><!-- icons/chevron-small.svg --></span>
</a>`,
  }
);
