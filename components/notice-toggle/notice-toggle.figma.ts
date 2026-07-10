import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Notice Toggle
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=700-89055
 *
 * A state-tinted notice card with a Toggle. "State" maps to the modifier class;
 * "Mode" (Light/Dark) is handled by [data-theme="dark"] on an ancestor, so the
 * surface/border/text tokens flip automatically — no per-mode markup needed.
 * Composes the Toggle component.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=700-89055",
  {
    props: {
      state: figma.enum("State", {
        Default: "",
        Information: " notice-toggle--information",
        Positive: " notice-toggle--positive",
        Warning: " notice-toggle--warning",
        Negative: " notice-toggle--negative",
        Dissabled: " notice-toggle--disabled",
      }),
      on: figma.boolean("On", { true: " checked", false: "" }),
    },
    example: ({ state, on }) =>
      html`<div class="notice-toggle${state}">
  <div class="notice-toggle__content">
    <p class="notice-toggle__title">Activate auto renewal?</p>
    <p class="notice-toggle__text">Activate to automatically renew at the end of your policy to avoid gaps in your cover.</p>
  </div>
  <label class="toggle notice-toggle__switch">
    <input class="toggle__input" type="checkbox" role="switch"${on} />
    <span class="toggle__track"><span class="toggle__thumb"></span></span>
  </label>
</div>`,
  }
);
