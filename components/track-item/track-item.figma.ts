import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Track Item
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60737-867583
 *
 * A single progress-track segment: .track-item--lapsed is filled (completed),
 * a plain .track-item is faint (pending). Compose several in a .track row.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=60737-867583",
  {
    example: () => html`<span class="track-item track-item--lapsed"></span>`,
  }
);
