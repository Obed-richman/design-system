# Design System

A coded component library that mirrors our Figma design system.
This repository is the source of truth for design tokens and UI components,
and is connected to our Figma file via Code Connect.

**Figma file:** [002-Components](https://www.figma.com/design/4NtsfRmqPTlPHGIYvaPeAN)

---

## What's in here

```
design-system/
├── tokens/
│   └── tokens.css       # All design tokens (colours, type, spacing, etc.)
├── components/
│   └── *.html / *.css   # Individual UI components
└── figma/
    └── *.figma.js       # Figma Code Connect mappings
```

---

## Design Tokens

All tokens live in `tokens/tokens.css`. They are structured in two tiers:

1. **Primitive palette** — raw named colour values (e.g. `--color-navy-70`)
2. **Semantic tokens** — purpose-based references (e.g. `--color-bg-primary`)

Always use semantic tokens in components. Never hardcode hex values.

### Colour modes
- **Light mode** — default (`:root`)
- **Dark mode** — overrides via `@media (prefers-color-scheme: dark)`

### Example usage

```css
.button {
  background-color: var(--color-bg-brand-aqua);
  color:            var(--color-text-on-colour);
  border-radius:    var(--radius-md);
  padding:          var(--space-sm) var(--space-lg);
  box-shadow:       var(--shadow-sm);
}

.button:focus-visible {
  box-shadow: var(--shadow-focus);
}
```

---

## Brand Palette

| Token | Description |
|---|---|
| `--color-navy-70` | Primary brand navy |
| `--color-aqua-40` | Primary brand aqua / CTA colour |
| `--color-purple-60` | Brand purple |
| `--color-purple-50` | Brand light purple |
| `--color-ecru-20` | Brand ecru / warm neutral |

---

## Using with Figma Make

When prompting Figma Make (or any AI tool), include this instruction:

> "Use the design tokens from this file:
> `https://raw.githubusercontent.com/YOUR-USERNAME/design-system/main/tokens/tokens.css`
> Always reference CSS custom properties rather than hardcoded values."

Replace `YOUR-USERNAME` with your GitHub username once the repo is live.

---

## Figma Code Connect

Component mappings are stored in the `/figma` folder. These link Figma
components to their code counterparts so Dev Mode and Figma Make show
the correct implementation.

---

## Contributing / updating tokens

1. Make the change in Figma Variables first
2. Update the corresponding value in `tokens/tokens.css`
3. Commit with a message like: `tokens: update aqua-40 to #00ADA6`
