import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Partner Logo (Figma "Work Providers")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=3719-3954
 *
 * The slot system for a work-provider / partner brand mark: Icon XS (--xs 24),
 * Icon S (--s 32), Tile (--tile 72) and a Wordmark. Each brand's official mark
 * ships under assets/partners/ (<brand>.svg tile, <brand>-wordmark.svg logotype),
 * exported verbatim from the Figma "Work Providers" set; an <img> drops into the
 * slot and fills the frame. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=3719-3954",
  {
    example: () =>
      html`<!-- Tile (72) — official brand tile (brand-coloured square + mark) -->
<span class="partner-logo partner-logo--tile"><img src="…/assets/partners/deliveroo.svg" alt="Deliveroo"></span>

<!-- Icon S (32) — same tile asset, scaled down -->
<span class="partner-logo partner-logo--s"><img src="…/assets/partners/uber.svg" alt="Uber"></span>

<!-- Wordmark — official logotype -->
<span class="partner-wordmark"><img src="…/assets/partners/deliveroo-wordmark.svg" alt="Deliveroo"></span>`,
  }
);
