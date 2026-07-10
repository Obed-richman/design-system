import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Text Input
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2489-15197
 *
 * Default / Placeholder are content states (no class). Hover / Focused come
 * from real pseudo-classes in production; the --hover / --focused modifiers
 * force them for static rendering, so the State property maps to those.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2489-15197",
  {
    props: {
      state: figma.enum("State", {
        Default: "",
        Placeholder: "",
        Hover: "input-field--hover",
        Focused: "input-field--focused",
        Error: "input-field--error",
        Valid: "input-field--valid",
        Hint: "input-field--hint",
        Disabled: "input-field--disabled",
      }),
    },
    example: ({ state }) =>
      html`<div class="input-group">
  <label class="input-label" for="input">Label</label>
  <div class="input-field ${state}">
    <input class="input" id="input" type="text" placeholder="Input" />
  </div>
</div>`,
  }
);
