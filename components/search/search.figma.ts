import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Search
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2066-313046
 *
 * Search reuses the Text Input (.input-field + states). It adds a trailing
 * magnifier that swaps to the clear (×) on focus / error. Hover / Focused come
 * from real pseudo-classes in production; the --hover / --focused modifiers
 * force them for static rendering, so the State property maps to those.
 * Requires input.css + input.js alongside search.css.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=2066-313046",
  {
    props: {
      state: figma.enum("State", {
        Default: "",
        Hover: "input-field--hover",
        Focused: "input-field--focused",
        Error: "input-field--error",
      }),
    },
    example: ({ state }) =>
      html`<div class="input-field ${state}">
  <input class="input" type="search" placeholder="Input" />
  <span class="search__glyph"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.0867 1C5.06825 1 1 5.06825 1 10.0867C1 15.1051 5.06825 19.1734 10.0867 19.1734C12.2322 19.1734 14.204 18.4298 15.7585 17.1863L21.4243 22.8521C21.6214 23.0493 21.9411 23.0493 22.1382 22.8521L22.8521 22.1382C23.0493 21.9411 23.0493 21.6214 22.8521 21.4243L17.1863 15.7585C18.4298 14.204 19.1734 12.2322 19.1734 10.0867C19.1734 5.06825 15.1051 1 10.0867 1ZM3.01926 10.0867C3.01926 6.18346 6.18346 3.01926 10.0867 3.01926C13.9899 3.01926 17.1541 6.18346 17.1541 10.0867C17.1541 13.9899 13.9899 17.1541 10.0867 17.1541C6.18346 17.1541 3.01926 13.9899 3.01926 10.0867Z" fill="currentColor"/></svg></span>
  <button class="input__clear search__clear" type="button" aria-label="Clear"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor" fill-opacity="0.3"/><path d="M14.7332 16.3392 8.95996 16.2526 11.8804 13.4092 14.7332 16.3392Z" fill="currentColor"/></svg></button>
</div>`,
  }
);
