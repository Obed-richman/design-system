import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Highlight Card
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60453-34130
 *
 * A tinted card highlighting one figure: an Info Field (tag label + large value
 * + icon chip) over an accent surface, with an optional sub-content row. Accent
 * = Error (default) / Success / Warning / Information via .highlight-card--*.
 * Composes Info Field. Kept static — the value, icon and sub-content are content
 * the consumer composes.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60453-34130",
  {
    example: () =>
      html`<div class="highlight-card">
  <div class="info-field">
    <div class="info-field__content">
      <div class="info-field__head"><span class="info-field__label">Tag</span></div>
      <span class="info-field__action">&pound;113.00</span>
    </div>
    <span class="info-field__icon"><!-- icon --></span>
  </div>
  <div class="highlight-card__sub">Sub content</div>
</div>`,
  }
);
