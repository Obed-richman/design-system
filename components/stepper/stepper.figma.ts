import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Stepper
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59062-963
 *
 * A vertical step: status icon in a rail beside a card of explanatory content,
 * with two optional outcome rows separated by a Divider.
 *
 * Figma property notes:
 *   - "Type" (Inactive | Active) only outlines the card; Active maps to
 *     .stepper__item--active.
 *   - The nested "Icon / Status" carries its own State (Not started | Active |
 *     Complete) and is NOT bound to Type, so it is mapped separately below via
 *     the status modifier. In the published variants Inactive pairs with the
 *     Complete tick and Active pairs with the Not started ring — that looks
 *     like an authoring slip in Figma rather than intent, so the code keeps the
 *     two independent.
 *   - "Show Row 1" / "Show Row 2" toggle the outcome rows.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59062-963",
  {
    props: {
      type: figma.enum("Type", {
        Inactive: "",
        Active: " stepper__item--active",
      }),
      showRow1: figma.boolean("Show Row 1", {
        true: html`<div class="stepper__row">
          <span class="stepper__row-icon"><!-- icons/tick.svg --></span>
          <div class="stepper__row-body">
            <p class="stepper__row-title">Your driver rating's ready</p>
            <p class="stepper__row-text">We've gathered enough data and seen good driving habits. Time to start earning rewards.</p>
          </div>
        </div>
        <hr class="divider">`,
        false: "",
      }),
      showRow2: figma.boolean("Show Row 2", {
        true: html`<div class="stepper__row">
          <span class="stepper__row-icon"><!-- icons/cross-red.svg --></span>
          <div class="stepper__row-body">
            <p class="stepper__row-title">Your policy could end</p>
            <p class="stepper__row-text">Sometimes a telematics policy isn't the right fit. If we're unable to assess your driving confidently or we continue to see concerning driving patterns, your cover will end with 7 days' notice and no cancellation fees.</p>
            <p class="stepper__row-text">Read more about our <a class="stepper__link" href="#">cancellation policy</a> here.</p>
          </div>
        </div>`,
        false: "",
      }),
    },
    example: ({ type, showRow1, showRow2 }) =>
      html`<div class="stepper">
  <div class="stepper__item${type}">
    <div class="stepper__status">
      <!-- status: --complete (icons/correct.svg) · --active · --not-started -->
      <span class="stepper__status-icon stepper__status-icon--complete"><!-- icons/correct.svg --></span>
    </div>
    <div class="stepper__card">
      <p class="stepper__title">Two potential outcomes:</p>
      <p class="stepper__text">Telematics isn't always the right fit. If we can't confidently assess your driving, or we keep seeing concerning patterns, your cover will end – with 7 days' notice and no cancellation fees.</p>
      ${showRow1}
      ${showRow2}
    </div>
  </div>
</div>`,
  }
);
