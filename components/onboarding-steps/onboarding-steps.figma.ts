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
