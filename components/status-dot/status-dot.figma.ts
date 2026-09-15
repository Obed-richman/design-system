import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Status Dot (Figma "Status Dots")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58151-4844
 *
 * A small solid status dot. Swap the status modifier (--positive / --warning /
 * --negative / --information / --rewards / --disabled) and the size modifier
 * (--8 / --12 / --16 / --20 / --24). Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58151-4844",
  {
    example: () =>
      html`<span class="status-dot status-dot--positive status-dot--12" role="img" aria-label="Active"></span>`,
  }
);
