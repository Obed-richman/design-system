import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Toggle (Switch)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=683-38207
 *
 * State drives the native `checked` attribute; Style/Size are class modifiers.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=683-38207",
  {
    props: {
      state: figma.enum("State", { Inactive: "", Active: "checked" }),
      style: figma.enum("Style", { OS: "", Web: "toggle--web" }),
      size: figma.enum("Size", { Large: "", Small: "toggle--16" }),
    },
    example: ({ state, style, size }) =>
      html`<label class="toggle ${style} ${size}">
  <input class="toggle__input" type="checkbox" role="switch" ${state} />
  <span class="toggle__track"><span class="toggle__thumb"></span></span>
  <span class="toggle__label">Label</span>
</label>`,
  }
);
