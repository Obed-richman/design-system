import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Acknowledge Box
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=678-15065
 *
 * A bordered checkbox card. Reuses the Checkbox — link checkbox.css + acknowledge.css.
 * Hover / Focus come from real pseudo-classes in production; the --hover / --focus
 * modifiers force them for static rendering. Active = the checkbox is checked.
 * ("Dissabled" is a typo in the Figma component's State property.)
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=678-15065",
  {
    props: {
      box: figma.enum("State", {
        Default: "",
        Hover: "acknowledge--hover",
        Focus: "acknowledge--focus",
        Active: "",
        Error: "acknowledge--error",
        "Error (Active)": "acknowledge--error",
        Dissabled: "acknowledge--disabled",
        "Dissabled (Active)": "acknowledge--disabled",
      }),
      checkbox: figma.enum("State", {
        Default: "",
        Hover: "",
        Focus: "",
        Active: "checked",
        Error: "",
        "Error (Active)": "checked",
        Dissabled: "",
        "Dissabled (Active)": "checked",
      }),
    },
    example: ({ box, checkbox }) =>
      html`<div class="acknowledge ${box}">
  <label class="checkbox">
    <input class="checkbox__input" type="checkbox" ${checkbox} />
    <span class="checkbox__box">
      <svg class="checkbox__tick" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </span>
    <span class="checkbox__label acknowledge__text">I understand that I must download the Sense app after purchase and enable permissions for the app to work.</span>
  </label>
  <span class="acknowledge__info"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" fill="currentColor"/></svg></span>
</div>`,
  }
);
