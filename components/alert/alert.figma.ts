import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Alert
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=719-197745
 *
 * The leading icon changes per state (info / check / triangle / bang) — swap
 * the inline <svg> to match. Neutral maps to no state modifier.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=719-197745",
  {
    props: {
      state: figma.enum("State", {
        Neutral: "",
        Information: "alert--information",
        Positive: "alert--positive",
        Warning: "alert--warning",
        Negative: "alert--negative",
      }),
      border: figma.enum("Border", {
        On: "alert--bordered",
        Off: "",
      }),
    },
    example: ({ state, border }) =>
      html`<div class="alert ${state} ${border}">
  <span class="alert__icon"><!-- state icon svg --></span>
  <div class="alert__content">
    <p class="alert__title">Title</p>
    <p class="alert__description">Description</p>
    <a class="alert__link" href="#">Link</a>
  </div>
  <button class="alert__close" type="button" aria-label="Dismiss"><!-- close svg --></button>
</div>`,
  }
);
