# Reward gift cards

The three gift-card faces that fill the Product Card's rewards banner — the image
slot of the Marketing Banner it composes. Exported from Design-System-003's Product
Card (`node-id=57761-3983`), where they are the Rewards instances inside the
banner's image slot.

Files: `amazon.jpg` · `just-eat.jpg` · `starbucks.jpg` — 450px wide, which is ~5×
the 82px the card stack draws them at, so they stay sharp on a retina screen.

**These are third-party brand assets**, the same footing as `assets/partners/`.
They illustrate what a Zego Sense customer can spend rewards on; if the reward
partners change, replace the files and keep the names — `product-card.html` and the
policy-type screen reference them by filename.

The stack itself is `.product-card__rewards` in `product-card.css`: three rotated
cards, each overlapping the one to its right, with the leftmost painted on top.
