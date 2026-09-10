import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Thumbnail (Challenge Image)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=8432-28363
 *
 * A fixed-ratio image tile with a centred, swappable badge. Active is an
 * information-blue field; .thumbnail--disabled greys the field and badge. The
 * badge glyph is a slot (e.g. icons/launch.svg). Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=8432-28363",
  {
    example: () =>
      html`<div class="thumbnail">
  <span class="thumbnail__badge"><!-- swappable glyph, e.g. icons/launch.svg --></span>
</div>`,
  }
);
