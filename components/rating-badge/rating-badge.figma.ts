import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Rating Badge
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59087-61747
 *
 * A hexagonal driver-rating badge — a tier colour (rating/* tokens) with a white
 * tier glyph. Five tiers: --at-risk / --needs-improvement / --good / --great /
 * --excellent. Kept static; each tier has its own glyph path.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59087-61747",
  {
    example: () =>
      html`<span class="rating-badge rating-badge--excellent" role="img" aria-label="Excellent">
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M20.9334 4.25C22.83 3.15 25.17 3.15 27.07 4.25L39.57 11.47C41.47 12.57 42.64 14.59 42.64 16.78V31.22C42.64 33.41 41.47 35.44 39.57 36.53L27.07 43.75C25.17 44.85 22.83 44.85 20.93 43.75L8.43 36.53C6.53 35.44 5.36 33.41 5.36 31.22V16.78C5.36 14.59 6.53 12.57 8.43 11.47L20.93 4.25Z" fill="currentColor"/>
    <!-- tier glyph (white) — swap per tier; see rating-badge-demo.html -->
  </svg>
</span>`,
  }
);
