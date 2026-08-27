import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Dropdown Item
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4055-35500
 *
 * A single selectable option in a dropdown menu. Booleans map to optional
 * slots: Icon → leading check-circle, Selector → leading Checkbox,
 * Chevron → trailing chevron. State drives the background force-classes.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=4055-35500",
  {
    props: {
      state: figma.enum("State", {
        Default: "",
        Hover: " dropdown-item--hover",
        Pressed: " dropdown-item--pressed",
      }),
      icon: figma.boolean("Icon", {
        true: html`<span class="dropdown-item__icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z" fill="currentColor"/></svg></span>`,
        false: "",
      }),
      selector: figma.boolean("Selector", {
        true: html`<input class="checkbox__input" type="checkbox" /><span class="checkbox__box"></span>`,
        false: "",
      }),
      chevron: figma.boolean("Chevron", {
        true: html`<svg class="dropdown-item__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" /></svg>`,
        false: "",
      }),
    },
    example: ({ state, icon, chevron, selector }) =>
      html`<button class="dropdown-item${state}" type="button">
  ${icon}
  ${selector}
  <span class="dropdown-item__label">Item</span>
  ${chevron}
</button>`,
  }
);
