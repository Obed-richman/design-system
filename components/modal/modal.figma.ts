import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Modal
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57921-5638
 *
 * The Breakpoint variant is responsive in code rather than a class: the panel
 * steps its padding, gap and title from Mobile to Desktop at 768px, so both
 * variants map to the same markup.
 *
 * "Column Content" is a slot — whatever the dialogue is about goes between the
 * title and the actions. The actions themselves are Figma's "Buttons & Text
 * Link" slot, which ships hidden; drop .modal__actions if the modal doesn't end
 * in buttons.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57921-5638",
  {
    props: {
      title: figma.string("Title"),
    },
    example: ({ title }) =>
      html`<div class="modal overlay overlay--darker" id="dialog" hidden>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <button class="modal__close" type="button" aria-label="Close" data-modal-close><!-- close svg --></button>
    <h2 class="modal__title" id="dialog-title">${title}</h2>

    <!-- Column Content — whatever the dialogue is about -->

    <div class="modal__actions">
      <button class="btn btn--primary btn--pill btn--block" type="button">Confirm</button>
      <button class="btn btn--secondary btn--pill btn--block" type="button" data-modal-close>Cancel</button>
    </div>
  </div>
</div>`,
  }
);
