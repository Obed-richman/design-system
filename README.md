# Design System

A coded component library that mirrors our Figma design system.
This repository is the source of truth for design tokens and UI components,
and is connected to our Figma file via Code Connect.

**Figma file:** [002-Components](https://www.figma.com/design/4NtsfRmqPTlPHGIYvaPeAN)

---

## What's in here

```text
design-system/
├── tokens/
│   └── tokens.css                  # All design tokens (colours, type, spacing, etc.)
├── icons/
│   └── *.svg                       # Icon set (currentColor, scalable)
├── components/
│   └── <name>/
│       ├── <name>.css              # Component styles
│       ├── <name>.html             # Showcase page
│       ├── <name>-demo.html        # Bare snippet for the dist bundle
│       └── <name>.figma.ts         # Figma Code Connect mapping (colocated)
└── dist/
    └── zego-ds.css / .js           # Built bundle (via build-dist.py)
```

---

## Design Tokens

All tokens live in `tokens/tokens.css`. They are structured in two tiers:

1. **Primitive palette** — raw named colour values (e.g. `--colour-navy-90`)
2. **Semantic tokens** — purpose-based references (e.g. `--background-primary`)

Always use semantic tokens in components. Never hardcode hex values.

### Colour modes
- **Light mode** — default (`:root`)
- **Dark mode** — overrides under `[data-theme="dark"]`

### Example usage

```css
.button {
  background-color: var(--brand-1-medium);       /* Brand aqua */
  color:            var(--text-primary-fixed);
  border-radius:    var(--radius-medium);
  padding:          var(--gap-small) var(--gap-large);
  box-shadow:       var(--shadow-dropdown);
}

.button:focus-visible {
  box-shadow: var(--shadow-focus);
}
```

---

## Brand Palette

| Primitive | Semantic | Description |
| --- | --- | --- |
| `--colour-navy-90` | `--brand-3-high` | Primary brand navy |
| `--colour-aqua-50` | `--brand-1-medium` | Primary brand aqua / CTA colour |
| `--colour-purple-80` | `--brand-2-high` | Brand purple |
| `--colour-purple-50` | `--brand-2-medium` | Brand light purple |
| `--colour-ecru-20` | `--background-primary` | Brand ecru / warm neutral |

---

## Using with Figma Make

When prompting Figma Make (or any AI tool), include this instruction:

> "Use the design tokens from this file:
> `https://raw.githubusercontent.com/Obed-richman/design-system/main/tokens/tokens.css`
> Always reference CSS custom properties rather than hardcoded values."

---

## Figma Code Connect

Component mappings live alongside each component as `<name>.figma.ts`
(e.g. `components/button/button.figma.ts`). These link Figma components to
their code counterparts so Dev Mode and Figma Make show the correct
implementation.

---

## Contributing / updating tokens

1. Make the change in Figma Variables first
2. Update the corresponding value in `tokens/tokens.css`
3. Commit with a message like: `tokens: update aqua-40 to #00ADA6`
