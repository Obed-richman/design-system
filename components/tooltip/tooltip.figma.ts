import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Tooltip
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2731-5253
 *
 * A dark bubble with a directional arrow. Direction modifiers set which edge the
 * arrow sits on (.tooltip--up / --down / --left / --right); position modifiers
 * move it along that edge (.tooltip--start / centre / .tooltip--end). Add a
 * .tooltip__partner element above the text for a partner-attributed tooltip.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2731-5253",
  {
    example: () =>
      html`<div class="tooltip tooltip--down">
  <p class="tooltip__text">Text</p>
</div>`,
  }
);
