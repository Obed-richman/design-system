import figma from "@figma/code-connect/html";

<<<<<<< HEAD
/**
 * Code Connect — Text Input
 * Figma: https://www.figma.com/design/4NtsfRmqPTlPHGIYvaPeAN?node-id=2066:311180
 *
 * NOTE: "Dissabled" is a typo in the Figma component — mapped correctly below.
 */

figma.connect(
  "https://www.figma.com/design/4NtsfRmqPTlPHGIYvaPeAN?node-id=2066:311180",
  {
    props: {
      state: figma.enum("State", {
        Default:     "default",
        Placeholder: "placeholder",
        Hover:       "hover",
        Focused:     "focused",
        Error:       "error",
        Valid:       "valid",
        Hint:        "hint",
        Dissabled:   "disabled",  // typo is intentional — matches Figma
      }),
    },

    example: ({ state }) => {
      // Error state
      if (state === "error") return `
<div class="input-group">
  <label class="input-label">Label</label>
  <div class="input-field input-field--error">
    <input class="input" type="text" value="Input value">
    <span class="input-icon">
      <!-- error icon -->
    </span>
  </div>
  <div class="input-message input-message--error">
    <svg class="input-message__icon" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#e21313" stroke-width="1.5"/>
      <path d="M12 8v5M12 15.5v.5" stroke="#e21313" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    Error message here
  </div>
</div>`;

      // Valid state
      if (state === "valid") return `
<div class="input-group">
  <label class="input-label">Label</label>
  <div class="input-field input-field--valid">
    <input class="input" type="text" value="Input value">
    <span class="input-icon">
      <!-- valid icon -->
    </span>
  </div>
  <div class="input-message input-message--valid">Valid message</div>
</div>`;

      // Hint state
      if (state === "hint") return `
<div class="input-group">
  <label class="input-label">Label</label>
  <div class="input-field">
    <input class="input" type="text" value="Input value">
  </div>
  <div class="input-message input-message--hint">Hint message here</div>
</div>`;

      // Disabled state
      if (state === "disabled") return `
<div class="input-group">
  <label class="input-label">Label</label>
  <div class="input-field input-field--disabled">
    <input class="input" type="text" disabled value="Input value">
  </div>
</div>`;

      // Default / Placeholder / Hover / Focused
      return `
<div class="input-group">
  <label class="input-label">Label</label>
  <div class="input-field">
    <input class="input" type="text" placeholder="Placeholder text">
  </div>
</div>`;
    },
  }
);
=======

>>>>>>> 12ad390d6be174d4fbfef609a1872ee780f4e872