# Zego Design System — portable bundle

Everything needed to use the components in another project. Copy this whole
`dist/` folder in, keeping its structure.

```
dist/
├── zego-ds.css     ← all tokens + every component's CSS (one file)
├── zego-ds.js      ← all interactive component behaviour (one file)
├── fonts/          ← Modern Era + UKNumberPlate (referenced by the CSS)
├── assets/         ← partner logos used by the Aggregator Partners component
└── components/     ← ready-to-copy HTML snippet for each component
```

## Use it

```html
<link rel="stylesheet" href="dist/zego-ds.css">
...
<script src="dist/zego-ds.js" defer></script>
```

That's it — no per-component imports, no build step. The CSS pulls the fonts
from `dist/fonts/` and the partner logos from `dist/assets/` using relative
paths, so keep those folders next to `zego-ds.css`.

- **Dark mode:** set `data-theme="dark"` on `<html>`.
- **Markup:** copy the HTML for any component from its showcase page in
  `components/<name>/<name>.html` (or browse them all from `index.html`).
- **JS is self-initialising:** the behaviours (tier cards, segments, carousels,
  dropdowns, add/remove toggles, etc.) attach via delegated document listeners,
  so dynamically-added markup works too — no init calls needed.

## Rebuilding

`zego-ds.css` / `zego-ds.js` are generated from `tokens/` and `components/`.
Regenerate after changing a component by re-running the bundle script (see the
project root). Don't hand-edit the files in `dist/`.
