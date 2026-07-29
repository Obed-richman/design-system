import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Button
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=85-78500
 *
 * In production, Hover / Pressed / Focused come from the real pseudo-classes
 * (:hover, :active, :focus-visible). The matching .btn--hover / .btn--pressed /
 * .btn--focused modifiers force a state for static rendering, so the State
 * property maps to those. "Active" shares the default fill, so it maps to none.
 * ("Dissabled" is a typo in the Figma component's State property.)
 * Dark Mode is a parent [data-theme="dark"] wrapper, so it isn't mapped here.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=85-78500",
  {
    props: {
      hierarchy: figma.enum("Hierarchy", {
        Primary: "btn--primary",
        Secondary: "btn--secondary",
        Tertiary: "btn--tertiary",
      }),
      style: figma.enum("Style", {
        Pill: "btn--pill",
        Rounded: "btn--rounded",
        FAB: "btn--fab",
        Text: "btn--text",
      }),
      state: figma.enum("State", {
        Default: "",
        Hover: "btn--hover",
        Active: "",
        Pressed: "btn--pressed",
        Focused: "btn--focused",
        Dissabled: "btn--disabled",
        Loading: "btn--loading",
        Destructive: "btn--destructive",
      }),
    },
    example: ({ hierarchy, style, state }) =>
      html`<button class="btn ${hierarchy} ${style} ${state}">Button</button>`,
  }
);
