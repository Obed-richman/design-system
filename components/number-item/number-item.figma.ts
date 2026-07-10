import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Number Item
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57596-3781
 *
 * A single verification-code cell. Hover / Focused / Active come from real
 * interaction in production; here they map to force-state modifier classes.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57596-3781",
  {
    props: {
      state: figma.enum("State", {
        Default: "",
        Inactive: "number-item--inactive",
        Hover: "number-item--hover",
        Focused: "number-item--focused",
        Active: "number-item--active",
        Error: "number-item--error",
        Disabled: "number-item--disabled",
        "Disabled (Active)": "number-item--disabled-active",
      }),
    },
    example: ({ state }) =>
      html`<span class="number-item ${state}">0</span>`,
  }
);
