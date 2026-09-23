Zego's interface language for insurance on the road: a warm ecru page, navy for the brand, aqua for the thing to press, and Modern Era set tight and confident. These rules are for anyone, human or agent, building Zego screens: the sales journey, the customer app, and internal tools.

## How the system is built

- **Two tiers of colour.** `colour-*` tokens are the raw palette (Aqua, Navy, Purple, Ecru, Grey, Black, the status hues, each on a 10 → 100 scale; a third number is an alpha percent, e.g. `colour-aqua-50-30`). Components never use them directly. They use the **semantic** tokens (`background-*`, `surface-*`, `border-*`, `text-*`, `icon-glyph-*`, `icon-link-*`, `brand-*`, `overlay-*`, `rating-*`), which change value in dark mode.
- **Never hard-code a hex value.** When a semantic token does not exist for what you need, raise it. Don't reach for a primitive.
- **Dark mode** is explicit: put `data-theme="dark"` on `<html>` or on any wrapper. Tokens ending `-fixed` keep their light value in both modes. Use them for things that must not flip, like a navy header that stays navy or the ecru panel behind a photo.
- **Breakpoint: 768px.** Spacing is mobile-first (`spacer-64`, `spacer-80`, `spacer-96`, `spacer-192` and the `frame-*` widths grow at 768px). Type is desktop-first (Display and Title steps shrink below 768px). Both overrides ship in `components/bundle.css`.
- **Components are HTML + CSS**, not a framework. Each is a BEM block (`.btn`, `.alert`, `.tier-card`) with `--modifier` classes that map 1:1 to Figma variant properties. The interactive ones (tabs, segments, inputs, date picker, dropdowns, carousels) are wired by `components/bundle.js`, which initialises itself through delegated listeners, so markup added later works too.

## Content fundamentals

- **Voice: plain, warm, direct.** Talk to the driver as "you"; Zego is "we" or "us". Examples from the product: "Choose your cover", "Hi John, thanks for choosing us", "All policies include these as standard", "Adding a young driver may increase your excess."
- **Sentence case everywhere**: headings, buttons, labels ("Add breakdown", "Apply code", "More details"). Capitals are only for proper nouns, product names (Zego Sense, Comprehensive) and the vehicle registration (`ZZ24 EGO`).
- **British English**: colour, licence (noun), organise, "cover starts today".
- **Buttons say what happens.** Use a verb and its object ("Renew now", "Add breakdown", "Continue to payment"), never "OK" or "Submit".
- **Confirm destructive actions as a question**: "Discard what you've added?", with the destructive choice named.
- **Errors say what to do**: "Invalid, please check the code." Pair error text with the error border and icon, never colour alone.
- **Social proof uses real figures**, e.g. "Rated 5* by 8,000+ drivers". No invented stats.
- **No emoji** in product UI. Icons come from the Icons set.

## Visual foundations

### Colour

- **Page:** `background-primary` (Ecru 20, warm) is the default ground. Use `background-secondary` (cool grey) for dashboards and internal tools, and `background-tertiary` (white) for dense forms.
- **Surfaces:** cards, modals and inputs sit on `surface-primary` (white; black-70 in dark). Use `surface-secondary` for grey-filled controls, with `-hover` and `-pressed` steps. The ecru tints `surface-primary-low`, `surface-primary-medium` and `surface-primary-high` are for soft panels (e.g. the Optional extras section).
- **Brand:** `brand-3-high` (Navy 90, `#00166C`) is the primary brand colour. It fills headers, footers, the onboarding banner and the rating strip, with `text-on-color` on top. `brand-1-medium` (Aqua 50, `#08F0F0`) is the call-to-action colour. It fills primary buttons, with `text-primary-fixed` (dark ink) on it, never white. `brand-2-*` (Purple) is the accent: links (`text-link`), progress fills and the counter ring. `brand-4-*` (Yellow) is for highlight tags.
- **Selection and focus:** selected controls use `surface-active` (aqua) + `border-active`, and focus uses `surface-focus`. The focus ring is `shadow-focus`: 4px (`border-focused`) of `border-focus`, which is aqua at 30%.
- **Status:** every status has a `surface-*`, `surface-*-low`, `border-*`, `border-*-low`, `text-*` and `icon-glyph-*` token: information (blue), success (green), warning (orange), error (red). Status is never colour alone. It always comes with an icon or a word ("Added", "Expired").
- **Contrast caveat (kept from source):** `text-warning` (2.8:1), `text-success` (2.8:1) and `text-information` (4.0:1) miss 4.5:1 on white in light mode, and `text-error` misses in dark (3.6:1). Use them for short bold labels (24px+ or bold 19px+), always beside an icon, or put the message in `text-primary` on the matching `surface-*-low`.
- **Driver score:** `rating-excellent`, `rating-great`, `rating-good`, `rating-improving` and `rating-risk` are reserved for the telematics rating badge, strip and progress bar.
- **Scrims:** `overlay-dark-*` behind modals and drawers. `overlay-light-*` washes over navy.

### Type

- **One family: Modern Era** (Regular 400, Medium 500, Bold 700, Black 900), with `--font-family-base`. Registration plates alone use **UKNumberPlate** (`--font-family-plate`, style `plate-number`).
- **Scale:** `display-*` (84/84, 48/52 on mobile) for hero statements. `title-1` to `title-4` for page, section and card titles. `title-4-plus-bold` is the mobile partner of `title-3-bold`, so page headings switch between the two at 768px. `subtitle-1` to `subtitle-4` (Bold) for labels and list titles. `body-1` to `body-4` (Regular) for running copy. `metadata` (11/16 Medium) for captions and small print.
- **Tracking:** titles and display are set tight (`letter-spacing-tight`, −0.02em). Body and subtitles use normal tracking. Plates use wide tracking.
- **Weights carry hierarchy.** Titles are Bold or Medium, labels are Bold, and body is Regular. Don't use Black in UI; it is for marketing.

### Space, shape and depth

- **Spacing inside components** uses `gap-*`: `gap-xx-small` 4 → `gap-xxx-large` 48 on a 4/8 rhythm. Card padding is `gap-medium` (16) on mobile and `gap-large` (24) on desktop. Buttons pad `gap-small` × `gap-large`. **Page rhythm** uses `spacer-*`.
- **Layout frames:** `frame-screen` 375 → 1440, `frame-wrapper` 343 → 1200, `frame-container` 343 → 996, `frame-content` 311 → 588 (mobile → desktop). The main content column is 588 wide on desktop.
- **Corners are generous.** Use `radius-small` (8) for inputs, number items and rounded buttons, `radius-medium` (16) for cards, alerts and panels, `radius-large` (24) for modals and large cards, and `radius-x-large` (32) for page wrappers on desktop. Pill buttons, FABs, toggles and status dots take `radius-round`.
- **Borders over shadows.** Cards are usually separated by `border-primary` (1px, `border-s`) or by colour. `border-m` (2px) marks selected tiles. `shadow-dropdown` is the only elevation, reserved for floating menus, tooltips, the date picker and action tiles.
- **Motion is small and purposeful**: spinner, bounce dots, track fills and the carousel. There are no decorative transitions.

### Imagery

- Photography and illustration are sparing. The rewards gift cards (`assets/Rewards`) and the loading illustration are the product's real imagery. Partner logos are stand-ins until official marks are supplied (see the Partners group).

## Iconography

- **One set, 24px grid, filled glyphs** (Icons group, 159 SVGs). Each uses `fill="currentColor"`, so inline the SVG and it takes the surrounding colour: `icon-glyph-primary` by default, `icon-glyph-on-color` on fills, and `icon-glyph-success` or `-error` etc. for status.
- **Sizes:** `icon-size-3xs` 12, `xxs` 16 (inside buttons), `xs` 24 (default), `s` 32, `m` 48 (Icon+ badges), `l` 64, `xl` 72, `xxl` 96.
- **Icon+** (`.icon-plus`) is the tinted rounded square that holds any icon as a product or feature badge. Use it instead of drawing new badge shapes.
- Outline and filled pairs (`warning-outline` / `warning-filled`, `point-outline` / `point-filled`) signal inactive and active, e.g. in the bottom nav.
- As an `<img>`, an icon paints black (currentColor cannot be inherited). Inline the SVG whenever the colour matters.
- **Logos:** `zego-logo` (wordmark) and `zego-logo-mark` are single-ink. Paint them `text-primary` on light and white on navy by inlining. `zego-standard` and `zego-sense` are the two-colour product lockups (Navy 90 + Purple 50). Never redraw or recolour the two-colour marks.

## Components at a glance

- **Actions:** Button, Segment, Toggle, Tab, Tab Bar, Pagination.
- **Forms:** Input, Search, Checkbox, Radio, Radio List, Choice Selector, Conditional Selector, Optional Input, Acknowledge, Text Icon Item, Number Item, Date Picker, Discount Code, Vehicle Registration, Address Lookup, Filter Select, Dropdown Item / List, Payment Details, Payment Set, Plate.
- **Feedback:** Alert, Global Alert, Warning, Spinner, Bounce, Status Label, Status Dot, Tooltip, Notice Toggle, Modal, Side Modal, Overlay.
- **Navigation:** Top Nav, Sales Nav, Mobile Nav, Bottom Nav, Side Nav, Header Controls, Onboarding Steps / Header, Top Progress, Track Item, Stepper, Control Set.
- **Cards, lists, pricing, driver score and trust:** see each component's page. Compose larger pieces from smaller ones (Tier Section uses Segment + Tier Card; Data Table uses Control Set + Table Row + Table Item) rather than re-styling.

## Known gaps carried from the source

- The destructive button's hover and pressed states invert in dark mode, because there is no `surface/error-hover` token in Figma.
- `surface-brand-1-low` and `surface-brand-4-low` light values are unconfirmed in Figma. Five alpha primitives (`colour-aqua-90-10`, `colour-orange-100-10`, `colour-red-100-10`, `colour-purple-70-10`, `colour-purple-90-50`) were derived, not read.
- Dark-mode values are verified by eye only, not machine-read.
- The Plate and Vehicle Registration components hard-code 24px and 32px rather than using `font-size-plate-number`.
