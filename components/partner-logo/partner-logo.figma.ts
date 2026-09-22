import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Partner Logo (Figma "Work Providers")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=3719-3954
 *
 * The slot system for a work-provider / partner brand mark: Icon XS (--xs 24),
 * Icon S (--s 32), Tile (--tile 72) and a Wordmark. The rendered mark is a
 * neutral typographic stand-in — third-party logos are not reproduced; drop the
 * brand's official SVG into the `.partner-logo` slot in production. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=3719-3954",
  {
    example: () =>
      html`<!-- Tile (72) — official SVG goes inside; monogram is the fallback stand-in -->
<span class="partner-logo partner-logo--tile" role="img" aria-label="Deliveroo">D</span>

<!-- Icon S (32) with an official mark dropped into the slot -->
<span class="partner-logo partner-logo--s" role="img" aria-label="Uber"><!-- <img src="…/uber.svg" alt="Uber"> --></span>

<!-- Wordmark (stand-in — replace with the official lockup SVG) -->
<span class="partner-wordmark" role="img" aria-label="Deliveroo">Deliveroo</span>`,
  }
);
