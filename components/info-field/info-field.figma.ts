import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Info Field
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60300-5894
 *
 * A ruled list row. Type = Full (leading icon, content, trailing icon) or
 * Wrapped (.info-field--wrapped, no trailing icon; content fills). Both icon
 * chips are optional slots. Kept static — the icons and action are content the
 * consumer composes, not Figma component properties.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60300-5894",
  {
    example: () =>
      html`<div class="info-field">
  <span class="info-field__icon"><!-- leading icon (optional) --></span>
  <div class="info-field__content">
    <div class="info-field__head">
      <span class="info-field__label">Title</span>
      <span class="info-field__add"><!-- icons/add.svg --></span>
    </div>
    <a class="info-field__action" href="#"><!-- add -->Information</a>
    <!-- optional: <p class="info-field__support">Support text</p> -->
  </div>
  <span class="info-field__icon"><!-- trailing icon (Full only; drop for .info-field--wrapped) --></span>
</div>`,
  }
);
