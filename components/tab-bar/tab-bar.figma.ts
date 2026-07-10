import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Tab (tab bar)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4224-21570
 *
 * A full-width bar of equal-width Tab Items. Reuses the Tab Item — link
 * tab.css + tab-bar.css. The Tab Item is responsive, so Breakpoint is
 * handled automatically (< 768px = compact); the "Tabs" property (2–5) is
 * just how many items you add. The example shows three.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4224-21570",
  {
    example: () =>
      html`<div class="tabs" role="tablist">
  <button class="tab-item tab-item--active" role="tab" aria-selected="true">Item</button>
  <button class="tab-item" role="tab" aria-selected="false">Item</button>
  <button class="tab-item" role="tab" aria-selected="false">Item</button>
</div>`,
  }
);
