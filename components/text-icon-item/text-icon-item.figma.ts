import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Text + Icon Item
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57596-3798
 *
 * A selectable option row. Reuses the Radio for the trailing control — link
 * radio.css + text-icon-item.css. Hover / Focused / Active come from real
 * interaction in production; here they map to force-state modifiers.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57596-3798",
  {
    props: {
      size: figma.enum("Size", {
        Large: "",
        Medium: "text-icon-item--32",
        Small: "text-icon-item--24",
      }),
      state: figma.enum("State", {
        Default: "",
        Inactive: "text-icon-item--inactive",
        Hover: "text-icon-item--hover",
        Focused: "text-icon-item--focused",
        Active: "text-icon-item--active",
        Error: "text-icon-item--error",
        Disabled: "text-icon-item--disabled",
        "Disabled (Active)": "text-icon-item--disabled-active",
      }),
      checked: figma.enum("State", {
        Active: "checked",
        "Disabled (Active)": "checked",
        Default: "",
        Inactive: "",
        Hover: "",
        Focused: "",
        Error: "",
        Disabled: "",
      }),
    },
    example: ({ size, state, checked }) =>
      html`<label class="text-icon-item ${size} ${state}">
  <span class="text-icon-item__icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5Z" fill="currentColor"/></svg></span>
  <span class="text-icon-item__text"><span class="text-icon-item__label">Text</span></span>
  <input class="radio__input" type="radio" name="option" ${checked} />
  <span class="radio__control"></span>
</label>`,
  }
);
