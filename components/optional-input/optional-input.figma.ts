import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Optional Input
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59168-694126
 *
 * A field with an escape hatch: Text Input, an "or" Divider, and a dismissal
 * Checkbox. Ticking the box disables the field.
 *
 * "Box ticked" maps to the checkbox's `checked` plus the input's `disabled` and
 * .input-field--disabled. optional-input.js keeps the three in step at runtime,
 * so this only sets the initial state.
 *
 * The date is the segmented MM / YYYY field (.input-date, handled by input.js):
 * a real "/" element between two inputs, so the separator is on screen before
 * anything is typed. The question labels the pair as a group rather than either
 * half.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59168-694126",
  {
    props: {
      ticked: figma.enum("Box ticked", {
        No: "",
        Yes: " checked",
      }),
      fieldState: figma.enum("Box ticked", {
        No: "",
        Yes: " input-field--disabled",
      }),
      disabled: figma.enum("Box ticked", {
        No: "",
        Yes: " disabled",
      }),
    },
    example: ({ ticked, fieldState, disabled }) =>
      html`<div class="optional-input">
  <div class="input-group">
    <span class="input-label input-label--title" id="purchased-label">When was the vehicle purchased?</span>
    <div class="input-field input-date${fieldState}" role="group" aria-labelledby="purchased-label"
         data-date-max="today" data-date-error="The purchase date can't be in the future.">
      <input class="input input-date__part input-date__part--month" id="purchased-month" type="text"
             placeholder="MM" aria-label="Purchase month" inputmode="numeric" maxlength="2"${disabled}>
      <span class="input-date__separator" aria-hidden="true">/</span>
      <input class="input input-date__part input-date__part--year" id="purchased-year" type="text"
             placeholder="YYYY" aria-label="Purchase year" inputmode="numeric" maxlength="4"${disabled}>
    </div>
  </div>
  <div class="divider-text"><span class="divider-text__label">or</span></div>
  <label class="checkbox">
    <input class="checkbox__input" type="checkbox"${ticked}>
    <span class="checkbox__box"><!-- tick svg --></span>
    <span class="checkbox__label">The vehicle has not been purchased yet.</span>
  </label>
</div>`,
  }
);
