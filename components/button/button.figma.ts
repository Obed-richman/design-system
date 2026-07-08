import figma from "@figma/code-connect/html";

/**
 * Code Connect — Button
 * Figma: https://www.figma.com/design/4NtsfRmqPTlPHGIYvaPeAN/002-Components?node-id=85-78500
 *
 * Properties found in Figma:
 *   Hierarchy  → Primary | Secondary | Tertiary
 *   Style      → Pill | Rounded | FAB | Text
 *   State      → Default | Hover | Active | Pressed | Focused | Dissabled | Loading
 *   Dark Mode  → Off | On
 *
 * NOTE: "Dissabled" is a typo in the Figma component — mapped correctly below.
 */

figma.connect(
  "https://www.figma.com/design/4NtsfRmqPTlPHGIYvaPeAN/002-Components?node-id=85-78500",
  {
    props: {
      hierarchy: figma.enum("Hierarchy", {
        Primary:   "btn--primary",
        Secondary: "btn--secondary",
        Tertiary:  "btn--tertiary",
      }),
      style: figma.enum("Style", {
        Pill:    "btn--pill",
        Rounded: "btn--rounded",
        FAB:     "btn--fab",
        Text:    "btn--text",
      }),
      state: figma.enum("State", {
        Default:   "default",
        Hover:     "hover",      // handled by CSS :hover
        Active:    "active",     // handled by CSS :active
        Pressed:   "pressed",    // handled by CSS :active
        Focused:   "focused",    // handled by CSS :focus-visible
        Dissabled: "disabled",   // typo is intentional — matches Figma
        Loading:   "loading",
      }),
      darkMode: figma.enum("Dark Mode", {
        Off: false,
        On:  true,
      }),
    },

    example: ({ hierarchy, style, state, darkMode }) => {
      const isDisabled = state === "disabled";
      const isLoading  = state === "loading";
      const classes    = [
        "btn",
        hierarchy,
        style,
        isLoading ? "btn--loading" : "",
      ].filter(Boolean).join(" ");

      // FAB — icon-only circular button
      if (style === "btn--fab") return `
<button class="${classes}"${isDisabled ? " disabled" : ""}${isLoading ? ' aria-busy="true"' : ""} aria-label="Action">
  <svg class="btn__icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <!-- icon path goes here -->
  </svg>
</button>`;

      // Text button
      if (style === "btn--text") return `
<button class="${classes}"${isDisabled ? " disabled" : ""}>
  Button
</button>`;

      // Loading — spinner is CSS ::after, just add the class + aria
      if (isLoading) return `
<button class="${classes}" disabled aria-busy="true">
  Button
</button>`;

      // Dark mode wrapper needed
      if (darkMode) return `
<div data-theme="dark">
  <button class="${classes}"${isDisabled ? " disabled" : ""}>
    Button
  </button>
</div>`;

      // Default — Pill or Rounded
      return `
<button class="${classes}"${isDisabled ? " disabled" : ""}>
  Button
</button>`;
    },
  }
);
