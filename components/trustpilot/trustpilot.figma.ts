import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Trustpilot
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-16250
 *
 * Five star tiles. "Stars" (1–5 in half steps) fills the tiles and picks the
 * colour class; "Size" maps to the size modifier. Individual tile fill/half
 * markup is content, so a representative 4.5-green example is shown.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-16250",
  {
    props: {
      size: figma.enum("Size", {
        "32": "",
        "24": " trustpilot--24",
        "16": " trustpilot--16",
      }),
    },
    example: ({ size }) =>
      html`<div class="trustpilot trustpilot--green${size}" role="img" aria-label="Rated 4.5 out of 5 on Trustpilot">
  <span class="trustpilot__star trustpilot__star--full"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
  <span class="trustpilot__star trustpilot__star--full"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
  <span class="trustpilot__star trustpilot__star--full"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
  <span class="trustpilot__star trustpilot__star--full"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
  <span class="trustpilot__star trustpilot__star--half"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
</div>`,
  }
);
