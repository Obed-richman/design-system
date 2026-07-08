# Generate component from Figma

Paste the Figma component link, then follow every step below in order. These rules keep each new component consistent with the existing structure of this repo.

## Prerequisite — Read the design from Figma
The design is read through the **Figma Dev Mode MCP** (`figma-dev-mode` server, configured in `.mcp.json`). Before generating:
- Keep the **Figma desktop app open** — the MCP server runs inside it.
- Either **select the component's frame** in Figma, or paste its **node URL** (e.g. `…?node-id=4101-14432`).
- The design is then pulled with `get_metadata` (structure), `get_design_context` (reference code + screenshot), `get_variable_defs` (tokens), and `get_code_connect_map` (existing mappings). Map every Figma variable to the closest token in `tokens/tokens.css` — do not copy raw hex from Figma.

## Step 1 — Read these files first, in this order
1. `tokens/tokens.css` — the single source of truth for every token variable (colour, spacing, radius, border width, shadow, type). Extract the exact variable names you will need.
2. `tokens/typography.css` — the typography utility classes (`.title-4-bold`, `.body-2-medium`, etc.) and the type tokens they map to.
3. `components/button/button.css` — the reference for CSS file structure, BEM naming and commenting style.
4. `components/button/button.html` — the reference for the standalone showcase page format.
5. `components/button/button-demo.html` — the reference for the dense states/variants demo page.
6. `components/button/button.figma.ts` — the reference for the Figma Code Connect mapping.
7. `pages/component-template.html` — the blank starting point for the `[name].html` showcase page.
8. `pages/icons.html` — the icon library; check which icons already exist before adding new SVG paths.

## Step 2 — Analyse the Figma component and identify
- All variants (e.g. hierarchy, style, size, type)
- All interaction states (default, hover, active, pressed, focused, disabled, loading, error, valid) — note which are handled purely by CSS pseudo-classes (`:hover`, `:focus-visible`, `:disabled`) vs. modifier classes
- All nested components already built (check the `components/` folder — do not rewrite their styles)
- Dark mode differences — extract from the Figma dark mode frames
- Typography — map to `tokens/typography.css` utility classes or the `--font-size-*` / `--line-height-*` / `--letter-spacing-*` tokens
- All spacing, colour, radius and border values — map each to the closest token variable in `tokens/tokens.css`

## Step 3 — Generate these files

### `components/[name]/[name].css`

- Component styles only — no demo/page layout styles
- No hardcoded values — semantic token variables only. Names mirror the Figma Mode collection (leading `color/` dropped): `--background-*`, `--surface-*`, `--border-*`, `--text-*`, `--icon-glyph-*`, `--icon-link-*`, `--brand-*`, `--overlay-*`, plus sizes `--gap-*`, `--radius-*`, `--border-s|m|l`, `--shadow-*`, `--font-size-*`, `--line-height-*`. Never reference raw primitives (`--colour-*`, `--number-*`) directly in a component
- Start with `@import '../tokens/tokens.css';`
- Open with the same banner comment block as `button.css` (component name, Figma source + node id, variants, usage snippet)
- BEM naming: `.component`, `.component__element`, `.component--modifier`
- Section order: Base → Elements → Variants/Styles → Hierarchy → States → Dark mode → Animation
- Dark mode via the `[data-theme="dark"]` parent selector (this repo does **not** use a `.dark` class)
- If the component uses another component inside it, do not duplicate that component's styles — rely on its existing class

### `components/[name]/[name].html` — standalone showcase page

- A full HTML page — copy the skeleton from `pages/component-template.html`
- In the `<head>`, link `../../tokens/tokens.css`, `../../tokens/typography.css`, **and the component's own `[name].css`**
- Do **not** re-implement the component styles inline in a `<style>` block — the page's only styles are the demo/layout styles inherited from the template; all component appearance comes from the linked `[name].css`
- Keep the nav/header, `.back-btn` (pointing to `../../index.html`), `.component-header` and `.variants` container from the template
- Set the `<title>`, `.component-header__name` and `.component-header__description` for this component
- Inside `.variants`, place the real component markup using its actual BEM classes from `[name].css` (e.g. `.btn.btn--primary`) — one row per variant, demonstrating the key states
- Icons are inline `<svg>` with path data (see `button.html`) — this repo has no SVG sprite. Reuse a path from `pages/icons.html` where one exists

### `components/[name]/[name]-demo.html` — dense states demo

- A full HTML page that links the real component stylesheet (`[name].css`) plus `../../tokens/tokens.css`
- Group by variant in `<section>`s, one `.row` per state with a `.label`, following `button-demo.html`
- Include a dark-mode `<section>` using a `data-theme="dark"` wrapper on a navy background

### `components/[name]/[name].figma.ts` — Code Connect

- **File must be TypeScript** (`.figma.ts`, not `.js`) — Code Connect's parser only reads TypeScript files; `.js` files are silently skipped (parse returns `[]`).
- `import figma, { html } from "@figma/code-connect/html";` — the `example` **must** return an `html\`...\`` tagged template (a plain `` () => `...` `` string is not recognised by the parser).
- The `figma.connect(url, {...})` URL must point at the **component (or component set) node** in **Design-System-003** — file key `Jvq1VmDPfcCMgbjUTIbjaI` — e.g. `https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=<node>`. Get the node id from `get_metadata` (the component set), or from the component's "Copy link to selection". Do **not** use the old `4NtsfRmqPTlPHGIYvaPeAN` file.
- Map every Figma property with `figma.enum(...)` to the BEM classes from `[name].css`, following `button.figma.ts`. Keep the `example` a single `html\`...\`` return with interpolated props (`${hierarchy}`) — avoid conditional/branching logic, which the parser may not handle
- Note any Figma naming quirks (typos, casing — e.g. Figma's "Dissabled") in a comment, mapping them to the correct class

#### Publishing Code Connect (prerequisites)

Code Connect tooling lives in the repo root: `package.json` (`@figma/code-connect`) and `figma.config.json` (HTML parser, includes `components/**/*.figma.ts`). A new `[name].figma.ts` is picked up automatically by that glob. To make the snippet show in Figma Dev Mode, run in a terminal (not the sandbox — `node`/`npm` aren't on its PATH):

```bash
npm install                      # first time only
export FIGMA_ACCESS_TOKEN=figd_… # token with "Code Connect write" scope
npm run figma:parse              # validate mappings
npm run figma:publish            # push to Figma
```

Requires a Figma Dev/Full seat on an Org/Enterprise plan.

## Step 4 — Register the component in `index.html`
- `index.html` renders its cards from the JS `components` array near the bottom of the file — it is **not** section-based
- Add one object to that array:

  ```js
  {
    name: "[Component Name]",
    description: "[Short description of the component and its states].",
    image: "",
    page: "components/[name]/[name].html"
  }
  ```

- Do not add a `<link>` or a new `<section>`, and do not change existing entries or the surrounding page styles

## Rules reminder
- Always read the existing files (Step 1) before writing anything new
- No hardcoded hex values anywhere — token variables only, matching the names in `tokens/tokens.css`
- No duplicating styles from other component CSS files
- Atoms first — if this component contains another component, confirm it exists in `components/` first and reuse it
- Follow the exact commenting and banner style of `button.css`
- Dark mode = `[data-theme="dark"]` parent overrides only (never a `.dark` class)
- Icons are inline `<svg>`, sourced from `pages/icons.html` — there is no icon sprite
- Every new component ships four files: `[name].css`, `[name].html`, `[name]-demo.html`, `[name].figma.ts`
- Register the component by adding to the `components` array in `index.html`
