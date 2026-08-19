# Loading illustrations

Artwork for `fetching-quote.html`.

## `standard-cover.png`

The everyday-driving cards on the **Standard** variant (`8167-127072` in Sales
Journey — Ideation), exported at 3×; 296×346 at 1×.

🔶 **The panel colour is baked in.** Its background is a flat `#F2EDE9` —
`surface/tertiary-medium` at its **light** value — so it is seamless on the panel in
light mode but will show a beige block in **dark mode**, where the panel steps to
black-70. Keying the flat colour out would wreck the soft shadows cast over it, so
the fix is a **transparent export from Figma**, not CSS.

It is decorative: the headline beside it carries the message, so `alt=""`.

## The Sense variant has no image here

It animates (`8167-127293`), and the three cards have to overlap, which an
opaque-backed export cannot do. So it is built from parts — `.proto__fan` in
`journey.css`, with the gift-card faces from `assets/rewards/`. That also means the
Sense illustration follows the theme correctly, which the baked PNG it replaced
did not.
