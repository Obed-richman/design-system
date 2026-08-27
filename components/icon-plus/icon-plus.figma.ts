import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Icon+
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60234-75426
 *
 * A rounded tinted shell that holds any icon from /icons. Size = 72 / 48
 * (default) / 32 via .icon-plus--72 / --32; Colour = Brand (default) / Light /
 * Dark / Negative / Warning / Success via .icon-plus--*. The glyph inherits the
 * shell colour through currentColor.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60234-75426",
  {
    props: {
      size: figma.enum("Size", {
        "72": "icon-plus--72",
        "48": "",
        "32": "icon-plus--32",
      }),
      colour: figma.enum("Colour", {
        Brand: "",
        Light: "icon-plus--light",
        Dark: "icon-plus--dark",
        Negative: "icon-plus--negative",
        Warning: "icon-plus--warning",
        Success: "icon-plus--success",
      }),
    },
    example: ({ size, colour }) =>
      html`<span class="icon-plus ${size} ${colour}"><!-- any /icons svg (currentColor) --></span>`,
  }
);
