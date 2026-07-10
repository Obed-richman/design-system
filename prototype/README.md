# Prototypes

Build full pages/flows by composing design-system components.

## Start a new prototype

1. **Duplicate the `template/` folder** and rename it to your prototype, e.g. `renewal-flow/`.
   Keep it one level under `prototype/` (so `prototype/renewal-flow/index.html`) — the
   relative paths in the template depend on that depth.
2. Open `index.html` and build your screen inside `<main class="proto">`.
3. Paste component markup from any component's showcase page in
   `components/<name>/<name>.html`. Every class is already styled and every
   interactive component is already wired up.

```text
prototype/
├── kit.css              ← tokens + typography + all component CSS (don't edit)
├── template/
│   └── index.html       ← copy this folder to start a prototype
└── renewal-flow/        ← your prototype (a copy)
    └── index.html
```

## What's included

- **`kit.css`** — one stylesheet with the design tokens, typography, fonts and
  every component's CSS. It's the only stylesheet a prototype needs.
- **Fonts** load automatically (Modern Era + UKNumberPlate) via the tokens.
- **Interactive JS** (inputs clearing, dropdowns, date picker, discount code,
  detail card, sales nav, tabs, segments) is linked in the template and
  self-initialises — just use the markup.

## Tips

- **Toolbar:** a floating **Light/Dark + Desktop/Mobile** switcher sits at the
  bottom of the template so you can preview themes and breakpoints. It's dev-only
  — delete the two `showcase-controls` lines in `<head>` before shipping a final build.
- **Dark mode** can also be set statically with `<html data-theme="dark">`.
- **Canvas width:** the `.proto` canvas is 960px (desktop) and narrows to 420px
  when you pick **Mobile**. Adjust the `max-width` rules to taste.
- Browse every component and grab markup from the home page: `index.html`.
