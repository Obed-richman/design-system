import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Onboarding Steps
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-14449
 *
 * Horizontal progress stepper. "Breakpoint" maps to the compact modifier;
 * "Stage" marks which step is current (earlier steps complete, later empty).
 * The example shows Stage = Quote.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-14449",
  {
    props: {
      compact: figma.enum("Breakpoint", { Desktop: "", Mobile: " onboarding-steps--compact" }),
    },
    example: ({ compact }) =>
      html`<div class="onboarding-steps${compact}">
  <div class="onboarding-steps__step onboarding-steps__step--current">
    <span class="onboarding-steps__label">Quote</span>
    <span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>
  </div>
  <div class="onboarding-steps__step">
    <span class="onboarding-steps__label">Details</span>
    <span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>
  </div>
  <div class="onboarding-steps__step">
    <span class="onboarding-steps__label">Review</span>
    <span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>
  </div>
  <div class="onboarding-steps__step">
    <span class="onboarding-steps__label">Payment</span>
    <span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>
  </div>
</div>`,
  }
);

/**
 * Numbered variant (on navy) — Step Indicator / Numbered
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-14026
 *
 * Adds a numbered circle above the label; the number becomes a tick when the
 * step is complete. States: Incomplete (default) | Active (--current) |
 * Completed (--complete). Place on a navy surface.
 */
figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57549-14026",
  {
    props: {
      state: figma.enum("State", {
        Incomplete: "",
        Active: " onboarding-steps__step--current",
        Completed: " onboarding-steps__step--complete",
      }),
    },
    example: ({ state }) =>
      html`<div class="onboarding-steps onboarding-steps--numbered">
  <div class="onboarding-steps__step${state}">
    <span class="onboarding-steps__badge">
      <span class="onboarding-steps__badge-num">1</span>
      <span class="onboarding-steps__badge-tick"><svg viewBox="0 0 24 24" fill="none"><path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="2.5" fill="none" /></svg></span>
    </span>
    <span class="onboarding-steps__label">Details</span>
    <span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>
  </div>
</div>`,
  }
);
