import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Tab Item
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4221-76076
 *
 * A single tab. Hover / Focused come from real pseudo-classes in production;
 * the --hover / --focused modifiers force them for static rendering.
 * ("Dissabled" is a typo in the Figma component's State property.)
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4221-76076",
  {
    props: {
      breakpoint: figma.enum("Breakpoint", {
        Desktop: "",
        Mobile: "tab-item--mobile",
      }),
      state: figma.enum("State", {
        Inactive: "",
        Active: "tab-item--active",
        Hover: "tab-item--hover",
        Focused: "tab-item--focused",
        Dissabled: "tab-item--disabled",
      }),
    },
    example: ({ breakpoint, state }) =>
      html`<button class="tab-item ${breakpoint} ${state}" role="tab">Item</button>`,
  }
);
