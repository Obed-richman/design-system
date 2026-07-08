import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Text Input
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2066-311180
 *
 * Hover / Focused are handled by CSS; Placeholder / Hint are content states.
 * ("Dissabled" is a typo in the Figma component — mapped to the correct class.)
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2066-311180",
  {
    props: {
      state: figma.enum("State", {
        Default: "",
        Placeholder: "",
        Hover: "",
        Focused: "",
        Error: "input-field--error",
        Valid: "input-field--valid",
        Hint: "",
        Dissabled: "input-field--disabled",
      }),
    },
    example: ({ state }) =>
      html`<div class="input-group">
  <label class="input-label">Label</label>
  <div class="input-field ${state}">
    <input class="input" type="text" placeholder="Placeholder text" />
  </div>
</div>`,
  }
);
