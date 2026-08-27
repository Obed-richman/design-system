import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Dropdown Item
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4055-35500
 *
 * A single selectable option in a dropdown menu. Optional slots: a leading
 * check-circle icon, a leading Checkbox (Selector style), and a trailing
 * chevron; State drives the background. Kept static — the slots are shown
 * inline rather than mapped to Figma component properties.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4055-35500",
  {
    example: () =>
      html`<button class="dropdown-item" type="button">
  <!-- optional leading: <span class="dropdown-item__icon">…</span> or a Checkbox for the Selector style -->
  <span class="dropdown-item__label">Item</span>
  <!-- optional trailing: <svg class="dropdown-item__chevron" viewBox="0 0 16 16">…</svg> -->
</button>`,
  }
);
