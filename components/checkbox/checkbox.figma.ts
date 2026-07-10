import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Checkbox
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=96-91967
 *
 * Hover / Focused are handled by CSS (:hover, :focus-visible) so they map to no class.
 * ("Disbaled" is a typo in the Figma State property — mapped to checkbox--disabled.)
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=96-91967",
  {
    props: {
      checked: figma.enum("Checked", { True: "checked", False: "" }),
      state: figma.enum("State", {
        Default: "",
        Hover: "",
        Focused: "",
        Disbaled: "checkbox--disabled",
        Error: "checkbox--error",
      }),
      size: figma.enum("Size", { Large: "", Small: "checkbox--small" }),
    },
    example: ({ checked, state, size }) =>
      html`<label class="checkbox ${state} ${size}">
  <input class="checkbox__input" type="checkbox" ${checked} />
  <span class="checkbox__box">
    <svg class="checkbox__tick" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
  <span class="checkbox__label">Label</span>
</label>`,
  }
);
