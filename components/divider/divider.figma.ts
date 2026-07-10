import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Divider
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=19-2157
 *
 * Separates content within a layout. The "Type" property maps to markup:
 * Simple / Thick are an <hr>, Text is a labelled flex row.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=19-2157",
  {
    variant: { Type: "Simple" },
    example: () => html`<hr class="divider" />`,
  }
);

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=19-2157",
  {
    variant: { Type: "Thick" },
    example: () => html`<hr class="divider divider--thick" />`,
  }
);

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=19-2157",
  {
    variant: { Type: "Text" },
    example: () =>
      html`<div class="divider-text"><span class="divider-text__label">Text</span></div>`,
  }
);
