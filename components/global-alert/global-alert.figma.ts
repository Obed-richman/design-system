import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Global Alert (Figma "Global alert")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=61755-10365
 *
 * A floating stack of screen-level messages pinned to the top of the viewport.
 * Each message is a plain design-system Alert; the Global Alert adds elevation and
 * the Stacked collapse.
 *
 *   Type=Single   — one message.
 *   Type=Stacked  — multiple collapse: newest in full, the rest peek below
 *                   (.global-alert--stacked). Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=61755-10365",
  {
    props: {
      type: figma.enum("Type", { Single: "", Stacked: " global-alert--stacked" }),
    },
    example: ({ type }) =>
      html`<div class="global-alert${type}">
  <!-- one message per Alert; map Error→negative, Warning→warning, Success→positive -->
  <div class="alert alert--negative alert--bordered">
    <span class="alert__icon"><!-- state icon --></span>
    <div class="alert__content">
      <p class="alert__title">Negative</p>
      <p class="alert__description">Description</p>
    </div>
    <button class="alert__close" type="button" aria-label="Dismiss"><!-- close --></button>
  </div>
  <!-- Stacked: add more Alerts; they collapse behind the first, newest-first -->
</div>`,
  }
);
