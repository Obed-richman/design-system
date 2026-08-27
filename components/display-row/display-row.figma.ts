import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Display Row
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4097-22988
 *
 * A configurable list row: an optional leading icon, a label with optional
 * support text, an optional second-column value, and a trailing slot (Chevron /
 * Radio / Button). Kept static — the optional slots are shown inline rather
 * than mapped to Figma component properties.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4097-22988",
  {
    example: () =>
      html`<div class="display-row">
  <!-- optional leading: <span class="display-row__icon">…</span> -->
  <div class="display-row__main">
    <p class="display-row__label">Delivery</p>
    <!-- optional: <p class="display-row__support">Paragraph</p> -->
  </div>
  <!-- optional value column: <p class="display-row__value">Delivery</p> -->
  <!-- trailing slot: a Chevron, Radio or Button -->
  <span class="display-row__trailing"><svg class="display-row__chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4l7 8-7 8" stroke="currentColor" stroke-width="2" fill="none" /></svg></span>
</div>`,
  }
);
