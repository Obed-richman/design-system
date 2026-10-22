import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — App Download (Figma "App Download")
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=5372-13782
 *
 * Official store-badge links. The Device property picks the badge:
 *   Device=iOS      → assets/app-download/app-store.svg
 *   Device=Android  → assets/app-download/google-play.svg
 * The artwork is Apple's / Google's official mark (exported verbatim) — set the
 * real store URL on the href. Kept static.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=5372-13782",
  {
    props: {
      badge: figma.enum("Device", {
        iOS: "app-store.svg",
        Android: "google-play.svg",
      }),
    },
    example: ({ badge }) =>
      html`<a class="app-download__badge" href="https://…store-listing">
  <img src="…/assets/app-download/${badge}" alt="Download the Zego app" height="48">
</a>`,
  }
);
