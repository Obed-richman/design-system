import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Registration Plate
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-17518
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-17518",
  {
    props: {
      size: figma.enum("Size", {
        Large: "",
        Medium: "plate--16",
        Small: "plate--12",
      }),
    },
    example: ({ size }) =>
      html`<span class="plate ${size}">SH48 HSA</span>`,
  }
);
