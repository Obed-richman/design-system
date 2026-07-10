import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Trustpilot Lockup
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-19142
 *
 * Pairs the "Excellent" label / Trustpilot stars / Trustpilot logo with copy.
 * Layout, alignment and size map to modifier classes; the exact content mix
 * (Stars / Logo / Both) is authored inline. Reuses the Trustpilot stars.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-19142",
  {
    props: {
      layout: figma.enum("Lock up", { Inline: "", Stacked: " trustpilot-lockup--stacked" }),
      alignment: figma.enum("Alignment", { Centre: "", Left: " trustpilot-lockup--left", Right: " trustpilot-lockup--right" }),
      size: figma.enum("Size", { Large: "", Small: " trustpilot-lockup--small" }),
    },
    example: ({ layout, alignment, size }) =>
      html`<div class="trustpilot-lockup${layout}${alignment}${size}">
  <span class="trustpilot-lockup__label">Excellent</span>
  <div class="trustpilot trustpilot--green trustpilot--24" role="img" aria-label="Rated 4.5 out of 5 on Trustpilot">
    <span class="trustpilot__star trustpilot__star--full"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
    <span class="trustpilot__star trustpilot__star--full"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
    <span class="trustpilot__star trustpilot__star--full"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
    <span class="trustpilot__star trustpilot__star--full"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
    <span class="trustpilot__star trustpilot__star--half"><svg viewBox="0 0 24 24"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor"/></svg></span>
  </div>
  <span class="trustpilot-lockup__text">Trustpilot</span>
</div>`,
  }
);
