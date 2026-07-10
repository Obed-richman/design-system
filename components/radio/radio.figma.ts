import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Radio Button
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=8675-1570
 *
 * Two types: Radio (filled dot) and Check circle (checkmark → .radio--check).
 * Hover / Focused come from real pseudo-classes in production; the --hover /
 * --focused modifiers force them for static rendering.
 * ("Disbaled" is a typo in the Figma component's State property.)
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=8675-1570",
  {
    props: {
      checked: figma.enum("Checked", { True: "checked", False: "" }),
      type: figma.enum("Type", {
        Radio: "",
        "Check circle": "radio--check",
      }),
      state: figma.enum("State", {
        Default: "",
        Hover: "radio--hover",
        Focused: "radio--focused",
        Disbaled: "radio--disabled",
        Error: "radio--error",
      }),
      size: figma.enum("Size", { Large: "", Small: "radio--16" }),
    },
    example: ({ checked, type, state, size }) =>
      html`<label class="radio ${type} ${state} ${size}">
  <input class="radio__input" type="radio" name="group" ${checked} />
  <span class="radio__control">
    <svg class="radio__tick" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
  <span class="radio__label">Label</span>
</label>`,
  }
);
