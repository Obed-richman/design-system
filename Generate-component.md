# Generate component from Figma

Read the Figma component at this link

## Step 1 — Read these files first, in this order
1. `tokens/tokens.css` — extract all token variable names
2. `components/button/button.css` — use as the reference for file structure and commenting style
3. `components/button/button.html` — use as the reference for snippet-only format
4. `icons/icons.svg` — check which icons are available for use

## Step 2 — Analyse the Figma component and identify
- All variants (e.g. sizes, styles, types)
- All interaction states (default, hover, active, pressed, focused, disabled, loading, error, valid)
- All nested components already built (check `components/` folder — do not rewrite their styles)
- Dark mode differences — extract from Figma dark mode frames
- Typography — map to `tokens/typography.css` utility classes or token variables
- All spacing, colour, radius and border values — map each to the closest token variable

## Step 3 — Generate these files

### `components/[name]/[name].css`
- Component styles only — no demo layout styles
- No hardcoded values — token variables only
- BEM naming: `.component`, `.component__element`, `.component--modifier`
- Section order: Base → Variants → States → Dark mode
- Dark mode using `.dark` parent class
- If component uses another component inside it, do not duplicate that component's styles

### `components/[name]/[name].html`
- Snippet-only — no `<!DOCTYPE>`, no `<html>`, no `<head>`, no `<body>`, no `<style>` blocks
- Dependency comment at the top listing all required CSS files
- One snippet per variant showing all relevant states
- Icons use SVG sprite pattern: `<svg class="icon"><use href="../../icons/icons.svg#name"></use></svg>`
- If JS is needed: one `<script>` block at the bottom with a note to copy it into the screen file
- Comments explaining each variant, state and modifier class

## Step 4 — Update `index.html`
- Add `<link>` for the new component CSS in the `<head>` (after its dependencies)
- Add a new `<section class="section">` at the bottom of the page body
- Show at minimum: default state, one interactive state, disabled state
- If component has dark-on-dark variants, add a row with `style="background: var(--bg-brand-navy); padding: var(--gap-medium); border-radius: var(--radius-small);"`
- Do not change any existing sections

## Rules reminder
- Always read existing files before writing anything new
- No hardcoded hex values anywhere
- No duplicating styles from other component CSS files
- Atoms first — if this component contains another component, check it exists in `components/` first
- Follow the exact same commenting style as `button.css`
- Dark mode = `.dark` parent class overrides only
