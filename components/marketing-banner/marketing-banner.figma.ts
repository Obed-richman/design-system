import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Marketing Banner
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59030-76347
 *
 * Promotional banner for feature announcements and nudges. "Layout" maps to the
 * horizontal (default) / vertical modifier; "button" toggles the trailing
 * action. Swap the image by dropping an <img> inside .marketing-banner__image.
 * Reuses Button (.btn).
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59030-76347",
  {
    props: {
      layout: figma.enum("Layout", {
        Horizontal: "",
        Vertical: " marketing-banner--vertical",
      }),
      button: figma.boolean("Button"),
    },
    example: ({ layout, button }) =>
      html`<div class="marketing-banner${layout}">
  <div class="marketing-banner__content">
    <div class="marketing-banner__text">
      <p class="marketing-banner__title">Title</p>
      <p class="marketing-banner__paragraph">Paragraph</p>
    </div>
    ${button ? html`<button class="btn btn--secondary btn--pill btn--small" type="button">Button</button>` : ""}
  </div>
  <div class="marketing-banner__image"><!-- <img src="..." alt=""> --></div>
</div>`,
  }
);
