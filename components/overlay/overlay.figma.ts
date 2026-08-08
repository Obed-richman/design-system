import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Overlay
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2482-5095
 *
 * The Breakpoint variant is only the frame the overlay is drawn at — it covers
 * the viewport at every size — so it maps to nothing in code.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2482-5095",
  {
    props: {
      colour: figma.enum("Colour", {
        "Light Overlay": "overlay--light",
        "Dark Overlay": "overlay--dark",
        "Darker Overlay": "overlay--darker",
      }),
    },
    example: ({ colour }) => html`<div class="overlay ${colour}" hidden></div>`,
  }
);
