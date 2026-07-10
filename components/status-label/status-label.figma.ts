import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Status Label
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58141-15482
 *
 * ("Dissabled" is a typo in the Figma component's State property.)
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58141-15482",
  {
    props: {
      state: figma.enum("State", {
        Information: "status-label--information",
        Success: "status-label--success",
        Warning: "status-label--warning",
        Error: "status-label--error",
        Inactive: "status-label--inactive",
        Dissabled: "status-label--disabled",
      }),
      style: figma.enum("Style", {
        Pill: "",
        Rounded: "status-label--rounded",
      }),
    },
    example: ({ state, style }) =>
      html`<span class="status-label ${state} ${style}">Label</span>`,
  }
);
