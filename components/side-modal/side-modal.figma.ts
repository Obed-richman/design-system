import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Side Modal
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60492-126483
 *
 * A slide-in side panel: a title bar (section title + Filter Select + Close),
 * a content area (heading + optional Alert + Info Field rows), and a footer with
 * a primary and tertiary Button. Composes Filter Select, Button, Alert and Info
 * Field; the close glyph is local. Kept static — the fields and toolbar are
 * content the consumer composes, not Figma component properties.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60492-126483",
  {
    example: () =>
      html`<div class="side-modal">
  <div class="side-modal__title-bar">
    <p class="side-modal__section-title">Section title</p>
    <div class="side-modal__actions">
      <div class="filter-select"><!-- Filter Select --></div>
      <button class="side-modal__close" type="button" aria-label="Close"><!-- icons/close.svg --></button>
    </div>
  </div>
  <div class="side-modal__content">
    <h2 class="side-modal__title">Title</h2>
    <!-- optional Alert (e.g. .alert--negative) -->
    <div class="alert alert--negative"><span class="alert__icon"><!-- icon --></span><div class="alert__content"><p class="alert__title">Negative</p><p class="alert__description">Description</p></div></div>
    <div class="side-modal__fields">
      <!-- Rows are Info Fields (see info-field.figma.ts) -->
      <div class="info-field">
        <div class="info-field__content">
          <div class="info-field__head">
            <span class="info-field__label">Title</span>
            <span class="info-field__add"><!-- icons/add.svg --></span>
          </div>
          <a class="info-field__action" href="#"><!-- add -->Information</a>
        </div>
      </div>
      <!-- …more .info-field rows… -->
    </div>
    <div class="side-modal__footer">
      <button class="btn btn--primary btn--rounded" type="button">Button</button>
      <button class="btn btn--tertiary btn--rounded" type="button">Button</button>
    </div>
  </div>
</div>`,
  }
);
