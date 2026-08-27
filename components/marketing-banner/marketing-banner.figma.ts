import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Marketing Banner
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59030-76347
 *
 * Promotional banner for feature announcements and nudges. Add
 * .marketing-banner--vertical for the stacked layout; the trailing action
 * Button and the image are optional. Kept static — the layout and slots are
 * shown inline rather than mapped to Figma component properties. Reuses Button.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59030-76347",
  {
    example: () =>
      html`<div class="marketing-banner">
  <div class="marketing-banner__content">
    <div class="marketing-banner__text">
      <p class="marketing-banner__title">Title</p>
      <p class="marketing-banner__paragraph">Paragraph</p>
    </div>
    <button class="btn btn--secondary btn--pill btn--small" type="button">Button</button>
  </div>
  <div class="marketing-banner__image"><!-- <img src="..." alt=""> --></div>
</div>`,
  }
);
