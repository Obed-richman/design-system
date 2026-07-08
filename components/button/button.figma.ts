import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Button
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=85-78500
 *
 * Interaction states (Hover / Active / Pressed / Focused) are handled by CSS
 * pseudo-classes. Disabled uses the `disabled` attribute and Loading the
 * `btn--loading` class in application code, so they aren't mapped here.
 * ("Dissabled" is a typo in the Figma component's State property.)
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
    },
    example: ({ hierarchy, style }) =>
      html`<button class="btn ${hierarchy} ${style}">Button</button>`,
  }
);
