import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Accordion
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58205-10512
 *
 * Built on native <details>/<summary> (no JS). Expand maps to the `open`
 * attribute; Error adds .accordion--error + the inline error message. Hover /
 * Pressed come from real pseudo-classes (force helpers exist for showcases).
 * Reuses Button (Edit details) and Alert — link button.css + alert.css.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58205-10512",
  {
    props: {
      error: figma.enum("Error", { Yes: "accordion--error", No: "" }),
      open: figma.enum("Expand", { Yes: "open", No: "" }),
    },
    example: ({ error, open }) =>
      html`<details class="accordion ${error}" ${open}>
  <summary class="accordion__header">
    <span class="accordion__title">Title</span>
    <svg class="accordion__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
  </summary>
  <div class="accordion__panel">
    <div class="accordion__action"><button class="btn btn--secondary btn--pill" type="button">Edit details</button></div>
    <p class="accordion__info">Information</p>
    <div class="accordion__row">Delivery</div>
    <div class="accordion__row">Delivery</div>
  </div>
</details>`,
  }
);
