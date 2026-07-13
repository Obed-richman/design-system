import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Extra Cover (add-on card)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6486-71681
 *
 * A selectable add-on card: icon badge, title + description ("Read more"),
 * an optional IPID document tile, and a footer with the price and an Add
 * button. "added" reveals the Added badge and flips the button; "ipid" toggles
 * the document tile.
 *
 * Reuses Button (.btn) and DS icons (breakdown, documents, add, tick).
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6486-71681",
  {
    props: {
      added: figma.enum("added", { "true": " extra-cover--added", "false": "" }),
    },
    example: ({ added }) =>
      html`<div class="extra-cover${added}">
  <div class="extra-cover__content">
    <div class="extra-cover__top">
      <span class="extra-cover__badge"><!-- breakdown icon --></span>
      <span class="extra-cover__added">Added</span>
    </div>
    <h3 class="extra-cover__title">Breakdown cover</h3>
    <p class="extra-cover__desc">This includes combined roadside and recovery within the UK. <a class="extra-cover__link" href="#">Read more</a></p>
    <div class="extra-cover__tile">
      <span class="extra-cover__tile-icon"><!-- documents icon --></span>
      <span class="extra-cover__tile-label">Insurance information Document (IPID)</span>
      <button class="btn btn--secondary btn--pill btn--small" type="button">Download</button>
    </div>
  </div>
  <div class="extra-cover__footer">
    <p class="extra-cover__price">£59.99</p>
    <button class="btn btn--primary btn--pill btn--small extra-cover__add" type="button" aria-pressed="false">
      <span class="btn__icon extra-cover__add-plus"><!-- + --></span>
      <span class="btn__icon extra-cover__add-minus"><!-- - --></span>
      <span class="extra-cover__add-label">Add</span>
    </button>
  </div>
</div>`,
  }
);
