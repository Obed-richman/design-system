# Known issues / open questions

Things found while syncing this repo against Figma **Design-System-003** that are
deliberately **not** fixed yet, each with what's blocking it. Logged 5 Aug 2026.

Verified state at the time of writing: all 136 light semantic tokens match Figma
(124/124 on the readable set), every dark declaration resolves, and no dark token
is missing a light counterpart.

---

## 1. Needs a decision or a value from Figma

### 1.1 Destructive button hover/pressed invert in dark mode
`components/button/button.css` — `.btn--primary.btn--destructive` takes its rest
colour from `--surface-error`, but hover and pressed reference the raw primitives
`--colour-red-60` / `--colour-red-70`. Measured backgrounds:

| | rest | hover | pressed |
|---|---|---|---|
| light | `#EB0000` | `#EB0000` | `#D00909` |
| dark | `#D00909` | `#EB0000` | `#D00909` |

So in dark, hover is **lighter** than rest and pressed is **identical** to rest
(no press feedback). Light has no hover feedback either — pre-existing, exposed
rather than caused by the dark-mode update.

**Blocked on:** Figma has no `surface/error-hover` / `surface/error-pressed`
variables. Needs either those tokens or a decision to derive them.

### 1.2 `surface/brand-1-low` and `surface/brand-4-low` light values unconfirmed
Both exist as Figma variables (keys `e0c518c7…`, `0f4ed844…`) but are not placed
on the colour documentation frame, so the MCP can't read their values. tokens.css
now declares them as `--colour-aqua-10` / `--colour-yellow-10`, mirroring
`brand/N-low` — which is how the readable `surface/brand-2-low` behaves (both
`#EDE0FE`). Marked `NOT CONFIRMED` in `tokens/tokens.css`.

**Blocked on:** placing the swatches on the docs frame, or a REST-API read.

### 1.3 Five alpha primitives were derived, not read
Your dark-mode edits referenced these, which didn't exist. Added using the file's
existing alpha convention (10% → `1A`, 20% → `33`, 30% → `4D`, 50% → `80`):

`--colour-aqua-90-10` `--colour-orange-100-10` `--colour-red-100-10`
`--colour-purple-70-10` `--colour-purple-90-50`

Arithmetic on your own base colours, but worth confirming against Figma.

### 1.4 Dark mode can't be machine-verified
`get_variable_defs` resolves **light mode only**, even on Dark-mode variants. So
the dark block is only as correct as what's typed into it — the 124/124 audit
covers light exclusively.

**Blocked on:** `sync-tokens.py` needs `FIGMA_ACCESS_TOKEN` (`file_variables:read`)
and an Enterprise plan. Until then dark is verified by eye only.

### 1.5 Stepper: Figma variants look mis-paired
`Type=Inactive` ships the *Complete* tick while `Type=Active` ships the *Not
started* ring — so the "active" step reads as untouched. Implemented as
independent (Type only outlines the card) on the assumption it's an authoring
slip. **Needs confirming.**

### 1.6 Number plate type style unused
`--font-size-plate-number: 18px` exists, but `plate.css` hardcodes 24px and
`vehicle-registration.css` hardcodes 32px, matching Figma's own instances.
Deferred by request — resolve the scale later.

### 1.7 `.alert--brand` uses tokens outside their family
Figma fills this with a **border** token and colours the copy with a **link**
token, because no surface/text token exists at those values. Worth adding a
`surface-brand-2-medium` and a brand text token upstream.

### 1.8 Vehicle Registration has no Valid state in Figma
003 ships Default / Placeholder / Hover / Focus / Error / Disabled — there is no
Valid variant, and the Text Input's Valid state carries no tick either (just the
lighter border). The trailing tick asked for on "Let's find your vehicle" is
therefore a repo addition: `.veh-reg__status` plus `.veh-reg__field--valid`,
using the DS Tick glyph. **Wants authoring in Figma** so the two agree.

**Update:** Text Input has now gained the same trailing tick — `.input__status`,
revealed by `.input-field--valid` — because the licence number on
`uk-licence.html` was asked for the same signal. So the addition now exists twice,
in two components, with no Figma variant behind either. **Both want authoring in
003**; until then, treat the repo as ahead of the library here rather than wrong.
The reg field keeps its own copy under `.veh-reg__status`, which predates this and
is worth collapsing into Text Input if that field is ever refactored onto it.

Its two tones are painted from `--surface-success` / `--text-on-color-fixed`
rather than the icon file's own fills. That was originally a workaround for the
stale green in 2.3, which is now fixed — the two produce the same `#05CC58` in
light. Kept token-driven anyway, because it also follows the mode: the disc steps
to green-80 in dark where the flat asset wouldn't. Switch to the plain icon if a
fixed green is preferred in both modes.

### 1.9 Registration length: the brief said both 6 and 7
The request read "the reg must be 6 charactors… when six characters are reached
show Tick" and then "if the registration is less than or more than 7 chaters
surface an input error". Those two can't both hold. Implemented as **7** — the
UK plate format (2 letters + 2 digits + 3 letters) and the length of the
`SH48 HSA` plate the journey shows on the next page. It's one attribute:
`data-length="7"` on the `.veh-reg` in
`prototype/sales-journey/index.html`. **Confirm 7 is right.**

Only letters and digits count, so a typed space is free. There is no format
check — `1234567` passes, because the rule as given is about length alone.

### 1.10 Flags — now one library, three things to raise
Resolved 8 Aug 2026. The journey's flags come from **`assets/flags/`**, which
already held clean exports of the 003 `Flags` component set
(`node-id=57549-17526`) at **Size=Large** — 17 countries plus the EU licence badge.
The provisional flags drawn in this repo, and the duplicate copies under `icons/`,
are gone; `pages/icons.html` shows the same files rather than its own copies.

Three findings for **003 to decide**:

- **The size ladder isn't consistent across countries.** Every country runs
  Large 28 / Medium 24 / Small 20 — except **UK**, which runs 28 / **20** / 16. So
  "Medium" means two different things depending on the country.

- **UK is CONSTRUCTED differently at Medium.** Large is uniform across the set: a
  24px flag inset 2px with a 4px corner inside a 28px frame. UK Medium is drawn
  full-bleed to its 20px box with a ~2px corner and an extra clip. Large is
  therefore the only size where UK matches its neighbours, which is why everything
  here uses Large and scales in CSS. **Likely an authoring slip — worth confirming
  which construction is intended.**

- **Flags with white at the edge disappear on a white surface.** No flag in the set
  carries an outline, so on a white dropdown row **Poland** shows only its red half
  and **Afghanistan** — white with a small emblem — is very nearly a blank box.
  Ireland has the same problem in its middle band, less obviously. A hairline in the
  component would fix it for every consumer at once. Deliberately **not** patched in
  CSS: a ring on the container traces the 28px frame, not the inset flag, so it would
  sit away from the artwork's own edge. **Wants a design decision, not a workaround.**

Also worth knowing: **Portugal is 118KB and Spain is 537KB**, because the armillary
sphere and the coat of arms are full vector at every size — the Small variants are
no lighter. Fine as referenced files, but neither emblem is legible at 20px, so a
simplified small variant would pay for itself.

### 1.11 Flag corner radius needs no token
The flag corner is drawn **proportionally inside the artwork** (4px on a 28px
frame), so nothing in CSS sets it and `.input-select__flag` / `.input-phone__flag`
deliberately neither clip nor ring the flag — they only size the box. Recorded
because those rules used to clip to `--radius-round`, which cropped the corners off
and turned a tricolour into an unreadable disc.

---

## 2. Design-system hygiene

### 2.1 Figma documentation frames are stale
The `• Styles` page tables lag the actual variables. Confirmed: the Frames table
still showed 1056/876/516 when the variables were 1200/996/588, and neither
Title 4+ nor `surface/brand-1-low`/`brand-4-low` appear at all. **Read variables,
not tables** — and regenerate the tables.

### 2.2 Styles and variables are duplicated across libraries
The same names exist in `002 Components`, `001 Components` and
`2. Emails, SMS & Push | Templates` with different keys and sometimes different
values (three separate `Mobile/Title 1 | Bold`). 003 is the source of truth;
everything should move there and the legacy copies be retired.

### 2.3 Tick green — resolved
`icons/tick.svg` is now `#05CC58` (green-60), matching Figma's `UI / Tick
Success` and `--surface-success`. The same disc was inlined in 11 other files —
the Bullet Points, Stepper, Tier Card and Tier Section demos and showcases, the
component index, the icons page and the tiers prototype — so all 23 fills were
updated together; leaving them would have put two greens side by side in the
library. `--colour-green-50` stays `#00E660`: that primitive *is* green-50, and
the tick was simply pointing at the wrong step.

### 2.4 Radius and border-width naming
Figma is numeric (`Radius-4`, `Border-1`); tokens.css uses t-shirt sizes
(`--radius-x-small`, `--border-s`). Numeric is the stated preference. Renaming
touches most component CSS, so it wants doing in one deliberate pass.

### 2.5 Legacy tokens with no Figma counterpart
Not seen in any Figma sweep: `--border-brand-1` … `--border-brand-4`,
`--icon-glyph-error` / `-success` / `-warning` (the plain forms, superseded by
`-medium`/`-high`), `--background-page`. Confirm whether they're deprecated.

### 2.6 Dark `--text-pressed` was derived, not read
The token had no `[data-theme="dark"]` override, so light `grey-80` (`#68676C`)
carried into dark and measured **2.43:1** on the dark card — under the 4.5:1 AA
floor for body copy. Now `grey-60` (`#D4D3D5`), an existing primitive and already
the dark value of `--text-on-color-pressed`, so the pressed pair matches:

| | light | dark, before | dark, now |
|---|---|---|---|
| supporting text | 5.61:1 | 2.43:1 | **9.12:1** |

Marked `NOT CONFIRMED` in `tokens/tokens.css`, like the derived values in 1.2 and
1.3 — dark modes still can't be read (1.4). One judgement to sanity-check: at
9.12:1 against the white title's 13.61:1 the two sit fairly close, so the
hierarchy is softer in dark than in light. `black-20` (`#ABA9B2`, 5.87:1) would
separate them more and is in the same family as the dark surfaces, if the
supporting text should sit further back.

This affects everything on `--text-pressed`, not just the selectors: the
sales-nav row subtitles, bullet points, the GB badge on the plate, secondary and
tertiary text buttons.

### 2.7 Radio disabled fill — resolved
003 now fills every radio with `surface/primary` except the disabled ones, which
use `background/disabled` — which is what `radio.css` already did. Re-checked the
whole variant sheet after the update: the disabled row is uniformly grey across
both Types and both sizes, and every other state is white. Component and code
agree; nothing left to change.

<!-- for the record, the original finding:
For the same Checked=False, State=Disabled cell, Figma filled `Type=Radio` with
`surface/primary` (white) and `Type=Check circle` with `background/disabled`
(grey). **Resolved in favour of the grey for both**, so `radio.css` uses
`background/disabled` on every disabled cell. Figma has since been repointed. -->

Also in that component: the check-circle's tick is `UI / Tick Small` at a fixed
**12px** in both sizes, where `.radio__tick` is sized at 100% of the control (so
16px large, 12px small). The visible stroke happens to land in about the same
place because the markup inlines a different tick path from the one Figma uses,
so nothing looks wrong today — but the two want reconciling by putting
`icons/tick-small.svg` in the markup at a fixed 12px. Touches every
check-circle instance, so it wants doing in one pass.

### 2.8 Text Input error glyph — resolved
003's Text Input `State=Error` now carries the 16px `Tooltips / Warning`, so the
component matches Multiple Choice Selector, Vehicle Registration and the build.
Re-checked across all eight states after the update: the glyph is on the error
message only — Valid and Hint messages stay bare — and the clear (×) appears on
Focused and Error and nowhere else, which is exactly what `input.css` now does.
Nothing left to change on either side.

### 2.9 Clear (×) is narrower than 003 draws it
The clear button now appears only when a field is **in error and focused** — not
on focus alone. Asked for after it read as noise on Contact details: offering to
wipe a field the moment it's touched is unhelpful, where offering it while
someone fixes something wrong is not.

003's Text Input draws the × on **two** variants this no longer matches:

| variant | 003 | code |
|---|---|---|
| `State=Focused` | shows × | no × |
| `State=Error` (unfocused) | shows × | no × |
| error + focused | not a variant | shows × |

Worth reconciling. If the rule is right, both variants want the × removed and the
combination wants drawing — the component sheet currently has no variant that
shows the state the × actually appears in, which is also why the Text Input
showcase can no longer demonstrate it.


### 2.10 Overlay's z-index has to be out-specified, not out-ordered
`components/overlay/overlay.css` sets `z-index: 200` and `components/modal/modal.css`
sets `300`. Both are (0,1,0), so order decides — and the order depends on how the CSS
arrives. Linking `modal.css` pulls `overlay.css` in first, so Modal wins; the
prototype kit and `dist/` concatenate components **alphabetically**, which puts
overlay after modal and silently dropped every dialogue to 200, level with the Global
Alert instead of above it.

Settled with `.modal.overlay { z-index: 300 }` — (0,2,0), so it holds either way.
Worth knowing generally: **any component that composes another and needs to override
it must do so on specificity**, because this repo has two load orders and only one of
them matches the `@import` graph.

### 2.11 `background/primary` used where `surface/primary` was meant — audited
Audited 8 Aug 2026, after Product Card was found painting itself with
`--background-primary`. **A surface is a thing ON the page; a background is the
page.** Both are `#FFFFFF` in light, so the two are interchangeable there and only
diverge in dark — surface steps to black-70 (`#2E2D35`), background stays black-80
(`#27252D`) — which is where the wrong one makes an element vanish into what it
sits on.

All 16 uses of `--background-primary*` in component CSS were checked against the
component's own Figma bindings (`get_variable_defs` on the node in each file's
header).

**Changed — 003 binds `surface/primary` and no `background/primary` at all:**

| component | element | was |
|---|---|---|
| `product-card` | the card | flattened into the page in dark |
| `price-comparison` | `__discount` | **measured flat** against its own section |
| `number-item` | the tile | — |
| `vehicle-registration` | `__field` | — |

**Left alone — 003 binds `background/primary`, so the token is right:**
`bottom-nav`, `mobile-nav` (both), `extra-cover`, `trustpilot-reviews`,
`status-label--inactive`. These are chrome or full-bleed panels: they *are* the
background of what they cover.

**Unaffected — the component already handles dark explicitly:** `input`
(`.input-field` goes transparent in dark, 15 overrides) and `button`
(`.btn--secondary`, 12 overrides). The light-mode token is cosmetic there.

**Deliberate:** `toggle`'s `__thumb` uses `--background-primary-fixed`, a white that
should not follow the theme.

**Two need a decision — 003 binds BOTH tokens on the component, and a flat list of
variables can't say which element takes which:**

- **`tier-section .tier-section__docs` — measured FLAT.** In dark the docs panel is
  `#27252D` on a `#27252D` section, so it disappears. Whatever Figma intends, the
  current result is wrong. Recommend `surface/primary`; confirm which element the
  `background/primary` binding belongs to.
- **`segment .segment__item[aria-selected="true"]`** — the selected thumb on a grey
  track. Could legitimately be either. Not changed.

One caveat on method: the dark-mode measurements are reliable for the journey pages
and for components measured against their own root, but the component showcases
re-assert a stored theme through `showcase-controls.js`, so a few probes read light
values on a page that had been switched to dark. Where that happened the finding
rests on the Figma binding, not the measurement — the two never disagreed.

### 2.12 Text + Icon Item: two-line options were undersized
`components/text-icon-item/text-icon-item.css`. The cover-start options render a
date under the label, and came out **52px tall where 003 draws 76** with the second
line at the wrong size. Two causes, both in the component:

- **No vertical padding.** The base rule is `padding: 0 16px` with `min-height: 48`,
  which is right for one line and leaves two lines flush against the border. Now
  `padding-block: calc(var(--gap-small) - var(--border-m))` — Spacer-12 measured from
  the outer edge, which is how Figma reads it, less the 2px border that sits inside
  it — applied only to items that **have** a support line. My first attempt put it on
  the base rule and pushed every single-line Yes/No option in the journey from 48 to
  52; measured across four screens before and after.

- **The support line was Body 3, and is now Body 2** (16/24) on `text/pressed`,
  everywhere. A second line under an option is nearly always part of what you are
  choosing between rather than a footnote about it, so it reads level with the label
  and is set apart by weight and colour instead of size. Decided, and applied as the
  default — the `--value` modifier that briefly carried it is gone, so there is no
  smaller variant left to pick wrong.

🔶 **003's own component still says `Subtitle 4`** (bold 12/16) for the support line,
which is neither what this repo had nor what its own cover-start instance uses.
**Wants correcting in Figma** to Body 2.

### 2.14 Eight icons added — and the hand-drawn tick and cross retired
Pulled from 003 on 8 Aug 2026.

| file | Figma | sizes drawn |
|---|---|---|
| `cross-small.svg` | UI / Cross Small `58717-71528` | XS 24, XXS 16 |
| `order-1.svg` | Interface / order 1 `59589-4803` | 96 → 16 |
| `order-2.svg` | Interface / order 2 `59589-4893` | 96 → 16 |
| `order-3.svg` | Interface / order 3 `59589-4978` | 96 → 16 |
| `monthly-payments.svg` | Finance / Monthly payments `59353-17763` | 96 → 16 |
| `third-party-only.svg` | General / Third TPO `58838-1003` | XXL → XXS |
| `public-liability.svg` | General / Public Liability `58838-1024` | XXL → XXS |
| `legal-protection.svg` | General / Legal Protection `58838-1014` | XXL → XXS |

**One file per icon, taken from the 24 variant**, which is the library's convention
— the rest are all 24. The multi-size variants are the same drawing scaled, so
a single scalable file loses nothing; Cross Small's two are within 1% of each other
in inset. Figma exports the art at its own bounding box (22×22 inside a 24 box, or
14.37 for Cross Small), so each path was offset into place rather than wrapped in a
`transform` — every other icon in the library is a bare path in a `0 0 24 24`
viewBox, and a consumer copying one out has to get the same result.

**Near-neighbours were checked before each was added**, since `ncd.svg` had already
been missed once by searching for the wrong word. `cross-small` is not `cross` —
that one is a thin, full-bleed ✕ for dismissal, this is the bold inset mark that
sits in a bullet or a table cell. `order-2` is not `item-number` (a stacked-card
glyph with a 2 in it). `legal-protection` is not `legal` (a briefcase). And
`third-party-only` is not `passenger-3rd-party` — two figures, no shield.

**The journey's tick and cross were hand-drawn** and are now the DS glyphs:
`tick-small` in 4 files (28 instances across cover level, policy length and the two
work-provider screens) and `cross-small` in 5. `product-card.css` had claimed "the
DS tick-small icon" in its header the whole time. That is the **fourth** reinvention
this session — the library is the first place to check, not the last.

🔶 **Five of the eight are in the library but unused.** Monthly payments is the
obvious badge for the "or pay £142.30 /month" line on `quote.html` when that screen
is built; Order 1–3 suit a numbered sequence; Public Liability and Legal Protection
are cover-level concepts and both appear as rows in the cover-level comparison
table, which currently has no icons in its row headers. None were wired in, since
nothing asked for them yet.

### 2.15 Product lockups added — and `brand/` finally has a page
`Zego Product` (`node-id=58660-10741`), pulled 8 Aug 2026: **Type=Sense** (68×44) and
**Type=Standard** (102×44), saved as `brand/zego-sense.svg` and
`brand/zego-standard.svg`.

**These are not icons and don't belong in `icons/`.** They are wordmark lockups at
their own aspect ratios, so they go beside `brand/zego-logo.svg` — which had been
sitting in the repo with nothing pointing at it. `pages/brand.html` now shows all
three, linked from the index the way Flags is; the Figma export carries the whole
page around the mark (a `#767288` backing rect and the parent frames), so each was
cut from its `<g id="Type=…">` subtree rather than saved as exported.

**They carry their own colour and the logo does not.** `zego-logo.svg` is one tone
on `currentColor`, which is why the same file serves navy on a light page and white
on the brand header. The lockups are two-tone — the wordmark in `#00166C`
(`--colour-navy-90`) and the product name in `#A458FF` (`--colour-purple-50`) — so a
container cannot recolour them, and both values are baked into the files as Figma
draws them.

🔶 **There is no reversed lockup in 003.** On a dark surface the navy wordmark all
but disappears while the purple stays legible, so these are light-surface only until
a dark variant is authored — or until it's decided that the logo plus a text label
is what a dark context should use. `pages/brand.html` says so on the page.

### 2.18 Modal width is content-driven
Principle given 11 Aug 2026: **the panel sets its inner padding, not its width.** It
hugs its content, so what is inside decides how wide a dialogue is while the padding
stays constant — 16 on mobile with a 343 ceiling, 32 on desktop.

`.modal__panel` was `width: 100%` capped at 516; it is now `width: fit-content`, capped
at 343 below 768 and bounded only by the scrim's own 16px inset above it. Measured
after: on mobile the card dialogues reach the 343 ceiling and the date one stops at 289
because that is all its content needs; on desktop they come to 754 / 754 / 754 / 321,
and the cover-level comparison table to 485. Padding held at 16 / 32 throughout.

**Resolved 12 Aug 2026.** 003 dropped the 516 — the instance is still in the file,
hidden and literally named "516" — and its symbols now say where the ceiling belongs:
mobile is **375 around a 343 container**, desktop **652 around 588**. So the cap is on
the CONTENT, not the panel, and it is written as arithmetic — the content frame plus its
own two paddings — rather than as a bare 375 / 652:

    max-width: calc(343px + 2 * var(--spacer-16));                    /* mobile  */
    max-width: calc(var(--frame-content) + 2 * var(--spacer-32));     /* desktop */

Measured after: the card dialogues come to **652** on desktop, matching 003's own symbol
width, and the date dialogue stops at **321** because that is all it needs. On mobile
they land at 367 and 289 against a 375 ceiling. Padding held at 16 / 32. The 754 I
reported a day earlier is gone, and it was gone by raising a content ceiling rather than
by putting a width back on the wrapper.

(I had also given the dialogue cards `--fluid`, lifted from the screens where they fill
a page column. Under a content-driven panel that made the dialogues 851–944 wide, since
a fluid card has no intrinsic width to hug. Removed — inside a dialogue a card should
use its own drawn cap.)

### 2.16 The rewards banner is a Marketing Banner now
Resynced 9 Aug 2026 after 003's Product Card was updated (`57761-5782`). The banner
at the foot of the card is no longer a shape of its own: it is a **Marketing Banner
instance** with the reward gift cards dropped into its image slot.

**So the markup is the Marketing Banner's.** `.product-card__banner-inner` and
`.product-card__banner-text` are gone, replaced by `.marketing-banner`, `__content`,
`__text` and `__title`. Product Card keeps only the frame (`.product-card__banner`)
and the reward stack, and overrides three things about the banner it contains —
width, radius and background. Those overrides sit at `.product-card__banner
.marketing-banner` so they win on **specificity**, not on which file loads first.

| | was | 003 now |
|---|---|---|
| inset from the card edge | 16 all round | **12 sides, 16 bottom**, 16 gap above |
| height | 90 | **80** |
| radius | `10px` (a magic number) | **Radius-8** |
| text | Subtitle 3, 14/20, 96px column | **Subtitle 2, 16/24**, 94px column |
| image slot | — | **189**, holding the reward stack |
| card height | 342 | **332** |

All of it measured off a 1:1 render of `57761-5782` and re-measured in the browser
after: 12 / 12 / 16, 80 tall, radius 8, text 16 in and 16 down at 16/24 bold, slot
189. The old `10px` radius was never a token — the sort of thing that only surfaces
when a component is re-read.

**The gift cards are real now** — `assets/rewards/amazon.jpg`, `just-eat.jpg`,
`starbucks.jpg`, pulled from 003 and filed like `assets/partners/`, with a README
saying they are third-party brand assets. They fan out with the **leftmost on top**,
which needs an explicit `z-index`: source order paints the other way round.

🔶 **One thing is a repo decision, not a Figma one.** 003 draws the card at 335,
where the text column (94) and the image (189) add up exactly. In a two-column
desktop grid the card is narrower than that, and a rigid 189 squeezed the copy to
about 40px and four lines, growing the banner. So the **text column is fixed at 94
and the image gives way**, clipping the stack at its right edge — which is where 003
clips it anyway. **Worth confirming** that's the wanted behaviour at narrow widths,
since 003 has no variant that shows one.

**Marketing Banner itself needed no change.** Both layouts were re-measured against
`59030-76347` and match — Horizontal 343×124 with a 129 image, Vertical 343×228 with
a 96-tall image, `brand/1-low` behind both. What changed there is that its image is
now a proper **slot**, which is what lets the card drop the gift cards into it. 003's
own slot placeholder is an empty transparent PNG, so the component page keeps its
gradient rather than shipping a blank.

### 2.17 Review quote: a new component and three things it leaned on
Built 11 Aug 2026 for `review-quote.html`. The screen is almost entirely existing
components — Registration Plate, Detail Card, Display Row, Alert, Button — but three
pieces needed library work first.

**New: Small Comparison Tile** (`57968-9417`). Badge, radio, title, and a tinted panel
of figures with tags under them. Three states, and the same hover/active grammar as
Product Card: aqua border on both, panel to `surface/focus` only when chosen. Capped
at the 351 it is drawn at, with `--fluid` to drop that.

🔶 **It is easy to confuse with Comparison Tile** (`6477-174868`), which is a coloured
frame over a big price. Two components a word apart doing different jobs; both file
headers now say which is which, but the names are worth a look.

🔶 **Its tags are Status Labels with the colours overridden** — yellow `brand/4-medium`
for the selling point, `brand/4-low` inside a `border/warning-low` hairline for the
small print. Neither is a state Status Label has, and every state it does have means
something about *status*, so they are declared on the tile instead
(`__tag` / `__tag--note`). **Worth deciding** whether these want to be real variants.

🔶 **Figma spells the third state "Avtive".** The Code Connect enum key has to match
the variant name, so the typo is carried in `small-comparison-tile.figma.ts` on
purpose. Fix it in 003 and that line changes with it.

**Discount Code gained the collapsed state** 003 now draws: `--collapsible` plus a
`__toggle` row, closed by default, because a field asking for a promo code reads as
something you have missed. An applied code still shows while the row is shut — it is
money off, and hiding it makes it look like it didn't take.

**Two modifiers rather than new components.** `display-row--stacked` (plain question,
bold answer beneath — the vertical twin of the existing `--spec`), and
`detail-card__content--rows`, because Display Row collapses its own dividers with its
neighbour and the card's 20px gap broke that into a double rule between every row.

- 🔶 **The plate is the real yellow one**; the frame shows a muted grey plate. Either
  Registration Plate wants a quiet variant or the frame is using a placeholder fill.
- 🔶 **Cover length uses `waiting`** (an hourglass) where the frame draws a clock.
  Nothing in `icons/` is a plain clock — checked.

**The Change dialogues are built** (`7811-107433` policy type, `-107578` cover level,
`-107722` cover length, `-107866` start date). Each is a Modal holding the question's
own cards — lifted from the screen that owns them at authoring time rather than
retyped, so there is one place each card exists — plus the running total and Done.
Closing writes the chosen answer back into the row that opened it, matched on the
row's `data-journey-value` against the modal's id, so the summary cannot disagree with
the dialogue. `data-required-error` is stripped from the copies: inside a dialogue the
question is already answered and must not gate Continue.

**An applied promo code now removes the collapse.** The row can't be folded away while
money is coming off the price, and the toggle only returns after Remove — which leaves
the field open, ready for another code. Asked for 11 Aug 2026.

**The component was re-read against `7861-485803` on 11 Aug 2026**, and it settles the
collapsible question: the "Have a promo code?" row with its chevron is part of the
component, present on Default and Error — so `--collapsible` is a resync, not a repo
invention. It also confirms the change asked for the same day: **the Applied state has
no toggle row at all**, just the banner and Remove.

Four pieces of copy were wrong in the repo and are now 003's:

| | was | 003 |
|---|---|---|
| the row | Add a discount code | **Have a promo code?** |
| the button | Apply code | **Apply** |
| the error | Invalid code, please check and try again | **Invalid code, please try again** |
| applied | Promo code applied / saving £50 on this policy | **Code ZEGO22 applied!** / You're saving £60.00 |

Fixed in the component page, its demo, Code Connect and the journey screen. The
component set is State × Breakpoint (Default · Applied · Error × Desktop · Mobile) —
no fourth state, so nothing else is missing.

**The journey's three promo frames were checked on 11 Aug 2026** (`8314-257122`
expanded / `-257161` applied / `-257200` error — they sit below the main frames in the
same section, which is why they are easy to miss). The screen places the component
correctly at every state, and the **applied** frame independently confirms the change
asked for that day: the promo card holds only the banner and Remove, with no
"Have a promo code?" row above it.

They also turned up three copy conflicts, none of which the component link could have
shown:

- **The error message: this journey uses the frame's.** Three versions existed — 003's
  component says *Invalid code, please try again*, the error frame says *Invalid, please
  check the code.*, the repo said *Invalid code, please check and try again*. Decided
  11 Aug 2026: the **journey uses the frame's copy** and the component keeps 003's, so
  `review-quote.html` deliberately diverges from `discount-code.html` on this one
  string. 🔶 The component and the frame still disagree; one of them wants changing.

- **"Change" or "Learn more" is now a rule, not a label.** Decided 11 Aug 2026: a row
  says **Change** when its question has alternatives to offer, and **Learn more** when
  it has only one — in which case the dialogue can only explain that option, which is
  what makes it worth opening at all. A date is always Change; there is no
  single-option version of a calendar.

  So journey.js **derives the word from the dialogue** rather than the page authoring
  it: one option in the modal gives Learn more, more than one gives Change. That is
  what makes the 12-months-only variant cheap — it needs no second set of labels, only
  one fewer card. Proved by deleting the 30-day card and watching Cover length flip to
  Learn more while the other three stayed Change.

- **"Cover summary", not "Your cover summary".** Three of the four mobile frames say
  the former and only the desktop one adds "Your"; changed to match the majority. It is
  the only summary card in the journey, so there was one place to change.

- **The Apply button takes the rounded variant**, matching the component; the journey
  screen had it as a pill.

**The "12 months only" variant is understood and deliberately not built.**
`7953-363357` is the review screen with only the monthly option, and it surfaces when
a monthly option cannot be offered at all — either the product sells 12 months only
with no 30-day alternative, or the premium has passed a fixed threshold above which
monthly isn't offered. It is not a dead end: **applying a discount that brings the
premium back under that threshold turns the screen back into the two-option version.**
It does not apply to this journey, which covers a **private hire** product offering
both 12-month and 30-day cover. Recorded so the next product doesn't have to rediscover
the rule.

---

## 3. Prototype (`prototype/sales-journey/`)

### 3.1 Stepper fill reaches 100% on a step's last page
The track shows `(page + 1) / pages`, so the final page of a multi-page step is
indistinguishable from a completed step. Single-page steps are excluded (they
keep the component's in-progress 50%), but a 3+ page step still hits this.

### 3.2 Mobile preview shows desktop type sizes
Layout switches on **container** width so the Mobile toggle reframes correctly,
but tokens resolve on **viewport** width. In the preview on a desktop monitor
you get the desktop step (Title 4+ at 28px rather than 24px). Correct on a real
mobile viewport; a preview-fidelity limit only.

### 3.3 Mobile button order vs tab order
`vehicle-found` stacks the primary on top via `column-reverse`, so the keyboard
reaches "Change vehicle" first. Unavoidable while the two breakpoints want
opposite orders, unless the markup is duplicated.

### 3.4 Padding deviations from the ideation designs
Display rows use the DS 16px vertical padding (design shows 12) and the alert
uses 16px all round (design shows 16/8), making cards slightly taller than the
mockups. Kept the DS values deliberately.

### 3.5 `dist/components/sales-nav.html` carries demo wrappers
`build-dist.py` strips `<style>`/`<script>` but keeps layout wrappers, so the
copy-paste snippet includes inert `.frame`/`.frame--mobile` divs. Affects any
component whose demo needs a sized frame.

### 3.6 Segmented date entry: two shapes, no calendar check
`.input-date` (in `input.css` / `input.js`) takes whatever segments the markup
declares, in DOM order — `MM / YYYY` for a purchase date, `DD / MM / YYYY` for a
date of birth — and each part names its own class, so the ranges come from that.
Adding a part is a markup change. It replaced the earlier `data-mask="mm/yyyy"`,
which typed the separator into the value and so couldn't show it before the third
keystroke.

Still missing: a real calendar check (31/02 is accepted), any other order or
separator, and time. See 3.10.

Its two error strings are **mine, not from Figma or copy review**: "The purchase
date can't be in the future." on the journey page and the component default
"That date is in the future." Both sit in `data-date-error`, so they're one
attribute to change. A month outside 01–12 has no message because it can't be
typed.

### 3.7 Required-field copy is unreviewed, and everything is required
The journey-wide gate in `journey.js` writes these, none of which have been
through copy review:

- `Select an option.` — a choice selector with nothing picked. **Now approved**:
  it comes from the Driver details error frame, and replaced wording I had
  invented
- `Enter a date, or tick the box below.` — an empty Optional Input
- `Enter both the month and the year.` — a part-typed date
- `Complete every part of this field.` — any other multi-part field
- `<label> is required.` — single text fields, built from the label text with a
  trailing `?` or `:` stripped

`data-required-error` on a control overrides any of them per screen.

The rule is that **every** input and selector on a screen must be answered, as
specified. There is deliberately no per-field opt-out — the only escape hatch is
the Optional Input's checkbox. A screen that later needs a genuinely optional
field will want one (`data-required="false"` on the control would be the natural
hook), so this is worth revisiting rather than working around in markup.

### 3.8 Conditional Selector: dark panel deviates, and no Code Connect yet
`surface/tertiary-medium` — the panel fill on the ideation frame, sampled at
`#F2EEEA` — resolves to `black-70` in dark, which is **the same value as
`surface/primary`**, the card the panel sits on. Taken literally the panel
disappears and the follow-up stops reading as grouped, so dark steps to
`surface/tertiary-low` (`black-80`), keeping it recessed the way the light values
are against white. **A deliberate deviation from the bound token** — confirm it,
and consider whether `tertiary-medium` should differ from `primary` in dark at
all, since anything else relying on that contrast has the same problem.

No `.figma.ts` was written. The component is published in 003 (`Conditional
selector / Horizontal`, key `9d4b8b9074b3038e8ae55966ef49cdbb216c0acf`) but its
**node id** is needed for the Code Connect URL, and guessing one is what broke a
publish before. Paste a "Copy link to selection" for it and the mapping is a
five-minute job. A Vertical set exists too — same component, options stacked.

Two smaller deviations from the ideation mock, both DS-wins:
`.dropdown-item__label` is Subtitle 2 **bold** where the mock shows the rows
regular, and the follow-up's copy — "Select who the legal owner is." — is mine.

### 3.9 Kickout: two judgement calls
`quote-declined.html`, reached when the modified-vehicle answer is Yes.

**The gate runs before the divert.** So a modified vehicle still has to have the
rest of the screen filled in before Continue tells them no — which honours the
journey-wide rule from 3.7 but is arguably pointless friction, since the answer
is already disqualifying. Swapping the two lines in the Next handler in
`journey.js` short-circuits instead. **Worth a product decision.**

**"Return to home page" points at `index.html`** — the start of the journey.
There is no marketing home page in the prototype, and restarting is the useful
thing the button can do. Repoint it when there's a real destination.

The illustration is the Figma node exported to
`quote-declined-illustration.svg`. The node export arrived carrying the artboard
background and neighbouring frames, which were stripped; if it's re-exported,
strip them again or the file will paint a grey rectangle behind everything.

### 3.10 Driver details: faked address search, and Row List not ported
`driver-details.html`, the first page of the Driver step.

**The address search is faked.** There is no address service, so a search builds
four addresses from whatever postcode was typed, using
`data-sample-street` / `data-sample-town` for the street and town. Agreed as the
prototype behaviour so the flow works with any input; `results()` in
`address-lookup.js` is the one function to replace when there is a real service.

**003 has a `Row List` component** (key `11cbcd7d8dc64a74d22095d0f33abe1d161f0855`)
which is what the Figma frame uses for the chosen-address summary — the bordered
box with the address, a rule and an Edit action. It isn't in this repo, so the
summary is built inside `address-lookup.css` to match the frame rather than to
that component's API. **Port Row List and re-base the summary on it**, the same
way the follow-up panel sits on Conditional Selector.

**The three decline questions are now built** on `driver-history.html`. Their
wording there differs slightly from the copies on this page's error frame; the
driving-history frames won, being the questions' own frames.

**Dates have no calendar check.** Day is 01–31 whatever the month, so 31/02/1991
is accepted as a date of birth. A real check needs copy for "that date doesn't
exist", which no frame specifies. There is also no minimum age.

### 3.11 Driving history: decided
All three open points are now settled, recorded here so the reasoning isn't lost:

- **Any Yes declines.** The page continues only when all three are answered No.
  Each answer carries its own `data-exit-to`, so the decline set is still per
  question rather than a page-level rule.
- **Yes first, No last — everywhere.** Now a journey-wide rule (JOURNEY.md §5.3),
  so `driver-details.html`'s UK-residency question was flipped to match; the
  `data-reveals` stayed on No, which is still the answer that opens the
  follow-up.
- **Questions sit `Spacer-20` apart on mobile, `Spacer-24` on desktop**, matching
  the driving-history frames. Applied to `.proto__card--form`, so Vehicle details
  picks it up too — the 4px difference between those frame sets is resolved in
  favour of 20/24 rather than a flat 24.

The kickout screen is still shared: "Kickout - Medical condition" is
character-for-character `quote-declined.html`. If a reason ever needs its own
wording, point that answer's `data-exit-to` at a new page.

### 3.12 Contact details: confirmed
All three build decisions were checked and confirmed, recorded so they aren't
re-litigated:

- **A single primary button**, not the `Total cost` instance the two populated
  frames ended in. A total cost has nothing to total three pages before the
  quote; the frames were the anomaly.
- **The invalid-email message carries the warning glyph.** The ideation frame has
  since been updated to show it, so the frame and the build now agree.
- **The clear (×) shows on focus and error**, nowhere else — which is what
  `input.css` had always documented and never implemented. Hidden by default now
  and revealed on those two states. Search and Discount Code define their own
  reveal rules and are unaffected; both checked, along with the Text Input
  showcase.

### 3.13 Driving licence type: resolved
`licence-type.html`.

- **Icons.** The required-error frame had the two the wrong way round; Figma has
  since been corrected, and the build already had UK licence on the UK flag and
  EU licence on `licence-eu`. Both sides agree.
- **The bottom block is a single primary button**, not the `Total cost` instance
  the frames were built from — confirmed. The DVLA note stays beneath it: it is
  page content that the frames still show, and it carries the **privacy notice**
  link, so it isn't part of the action to be collapsed into it.

**The EU badge is `assets/flags/licence-eu.svg`**, the real 003 asset, sitting with
the flag library rather than in `icons/` — see 1.10 for why there is now one flag
home rather than two. The library page carries it after the flags.

**Continue from either licence page now leaves the branch**, rather than walking from
the UK page into the EU one. The two are alternatives, so they share a single slot in
the flow (a nested array in `STEPS`): Continue from either goes to Quote, Back from
either returns to `licence-type.html`, and the Driver stepper counts five slots
instead of six. See the BRANCHES note in `journey.js`.

### 3.14 Licence lookup: faked, and the copy is unreviewed
`uk-licence.html` pre-fills the first five characters — the surname padded to five
with 9s — for **Mr / Mrs / Miss / Ms**, and leaves the field empty for **Mx / Dr**
(`PREFILL_TITLES` in `journey.js`). The same DVLA structure is used to **check** the
number: a disagreement between positions 1–5 and the surname on screen means no
lookup would match. Continue also refuses a **part-typed** number (1–15 characters)
and raises the same screen-level alert, since DVLA matches on all 16.

Four things to note:

- **The title split is a product call, not a DVLA rule.** Positions 1–5 are the
  surname whatever the title is; the *rest* of the number needs sex (positions 7–8
  add 50 for female), which Mx and Dr don't give. So the rule is "only start people
  off when we could in principle finish the job", not a constraint of the spec.
  Don't "fix" it to prefill for everyone on the grounds that the spec allows it.

- **It only checks the surname.** A real lookup would also verify the date-of-birth
  digits (6, 9–11) and the forename initials (12–13), which are equally derivable.
  Worth extending if the failure state needs to be more convincing.
- **Both alert messages are mine**, unreviewed: *We couldn't match these details
  with the DVLA. Check your licence number and personal details, then try again.*
  and *Your licence number isn't complete. Enter all 16 characters from line 5 of
  your licence, then try again.* Override either per screen with `data-lookup-error`
  / `data-incomplete-error` on the `<main>`.

- **The licence field strips non-alphanumerics as you type**, so the completeness
  rule and the character counter can't disagree. It displays uppercase through an
  inline `text-transform` and the checks are case-insensitive, so the stored value
  can still be lowercase — fine for a prototype, but a real form should normalise
  the value rather than only its appearance.

### 3.15 Global Alert — built, and not in Figma

Built 8 Aug 2026 as `components/global-alert/`, replacing the prototype-only banner
that `journey.js` used to assemble itself. The journey is now a consumer: it decides
what to say and when, and the component owns the floating, the stack, the close and
the states. `journey.css` keeps only the WIDTH, because only the journey knows where
its own content column is.

Decisions taken, all confirmed:

- **The stack caps at two.** A third message drops the oldest, since the newest is
  the one that just happened.
- **Success retires itself after 5s; Error and Warning persist.** Warning sits with
  Error rather than with Success because it is also something to act on. Override
  per call with `timeout` (0 = never).
- **Its own component composing Alert**, rather than a modifier on Alert — the
  positioning, the stack and the dismissal are all container concerns.

Two things to know:

- **Nothing about it is in 003.** The states map onto Alert's `--negative` /
  `--warning` / `--positive`, so no new colours were invented, but the floating
  stack, the 8px radius, the elevation and the 16px sizing are all repo-side.
  **Wants authoring in Figma**, and there is no `.figma.ts` for it yet because
  Code Connect needs a node id that doesn't exist.
- **The 16px copy and glyphs are the component's own defaults**, not an override.
  The inline information alert in the sales journey is sized to match but from
  `journey.css`, since that one *is* overriding a real 003 component. If one
  changes, change the other — they should read alike.

Still open:

- **The copy in both journey messages is mine**, unreviewed — see 3.14.
- **Nothing raises Warning or Success yet.** Both states are built and shown on the
  component page, but the journey only raises Error. Worth a look at where a
  confirmation would actually help.

### 3.16 Convictions screen: Modal is new, and two things want confirming
`driving-convictions.html`, built 8 Aug 2026 from the Convictions frames.

- **Modal is now a real component** (`components/modal/`), built against
  003's Modal (`node-id=57921-5638`) and Code Connected. Its scrim is the **Overlay**
  component's Darker variant — also from 003 — so nothing about the shell is
  invented any more. What remains is that it does **not trap focus**: the panel
  takes focus on open and the opener gets it back on close, which covers landing
  and returning, but Tab can still walk out of the dialogue behind the scrim. Worth
  completing before this is used anywhere real.

- **Three of 003's Modal slots aren't built**: the optional **Image** (left column
  on desktop, banner on mobile), the **vertical scroll bar**, and the **scroll
  bottom clip** that pins an action to the foot of a long dialogue. All ship hidden
  in Figma and none is needed by the discard confirmation. Build them when
  something asks for them rather than on spec.

- **Yes/No order contradicts itself in the frames.** The mobile frames draw *Did you
  get disqualified because of this offence?* as **No · Yes**; the desktop frame draws
  it **Yes · No**. Built as Yes-first, which is the journey-wide rule (JOURNEY §5.3)
  and what desktop shows. **Correct the mobile frames.**

- **The disqualification length is always asked**, even before *Did you get
  disqualified?* is answered — and it is required, since the error frame shows
  *Enter disqualification months.* on it. That is what the frames draw, so that is
  what is built, but asking how long a ban was before establishing there was one
  reads oddly. **Worth a look**: it probably wants revealing on Yes.

- **The offence-code list is a sample.** The frames show five codes; the build
  carries 21 real DVLA codes and filters as you type. A live version needs the full
  list, which is long enough to want a real source rather than markup.

- **The repeating-card behaviour is shared with `claims.html`** and its hooks are
  named for what they do — `data-card-list`, `data-card-add`, `data-card-delete`
  and so on — not for convictions. They were `data-conviction-*` first, which was
  fine until a second screen used them: renumbering hard-coded "Conviction", so
  adding a claim silently relabelled every card. The noun now comes from the
  page's own `<template>`.

### 3.17 Work provider: the Uber badge, and the outcome that isn't built
`work-provider.html` / `work-provider-linked.html`, built 8 Aug 2026.

- **`icons/logo-uber.svg` came from the ideation file, not 003.** 003 has no Work
  Providers component — the search finds an Uber glyph only in the legacy *001
  Components* library and a Partners set in the email templates. So the badge was
  extracted from the Sales Journey frame itself: a 48px rounded square on
  `#27252D` (which *is* `color/text/primary`) with the wordmark in white. **Wants a
  home in 003** alongside whatever other work providers are coming — this will not
  be the only one.

- **The "We couldn't link your Uber account" screen is drawn and not built** —
  *Try again* / *Continue without linking*. Left out by request. Worth building when
  the link is real enough to fail.

- **Product Card gained three things** for this screen: `--badge--logo` (a partner's
  own mark, which brings its own surface), `__pip` (the status tick on the badge) and
  `--fluid` (drop the 335px cap when the card is alone on a screen rather than beside
  siblings). Its benefit list also now resets its own UA indent and top-aligns the
  tick, which was floating into the middle of any benefit that wrapped to two lines.
  None of these are in 003's Product Card. **Wants authoring.**

### 3.18 Cover start: what the Date Picker gained, and one thing to confirm
`cover-start.html`, built 8 Aug 2026 — the first page of the Quote step.

- **Date Picker gained bounds and self-rendering.** `data-min` / `data-max` disable
  the days outside a window and stop the month arrows at its edge; a MutationObserver
  re-renders when the data attributes change, so a picker can be *driven* from
  script. Without the second, setting `data-year` at runtime rendered nothing — the
  component had rendered once on load against markup that couldn't know today's
  date. Neither is in 003's Date Picker. **Wants authoring.**

- **Text Input gained `.input__icon`** — a decorative trailing icon, distinct from
  the clear (an action) and the status tick (a verdict). The calendar affordance
  needed one and was borrowing `.input-select__chevron`, which is sized 7×12 for a
  chevron and rendered the calendar as a speck. A field that opens a Date Picker
  takes this slot with `icons/calendar.svg`; it is documented in `input.css` and
  shown on the component page, so a second date field doesn't have to work it out.
  (I drew a calendar path by hand first — `icons/calendar.svg` was already there.
  Third time this session an asset was reinvented rather than looked for; the
  library is the first place to check, not the last.)

- **The picker is attached to the field by the page, not the component.** Opening,
  Confirm, Cancel and writing the value back all live in `journey.js`. If a second
  screen wants a date field, that wiring should move into the component rather than
  be copied.

- **The 30-day window is inclusive of both ends** — today counts and day 30 counts.
  Confirmed.

### 2.13 Product Card resynced with 003 — new Hover state, new banner colours
Re-read 8 Aug 2026 after the component was updated (`node-id=57761-3983`). It now
ships three states — **Default · Hover · Active** — where the repo had two.

| | 003 now | repo had |
|---|---|---|
| Hover | aqua border | *no state* |
| Active | aqua border **and** the banner on `surface/focus` | border only |
| banner, resting | `surface/tertiary-low` `#F8F5F3` | `brand-2-low` `#EDE0FE` (purple) |
| banner text | `text/primary` | `brand-2-high` (deep purple) |
| benefit tick | `icon/glyph/brand-2-medium` `#A458FF` | `brand-2-high` `#5F06C9` |

Re-measured against the component's own frame at the same time, three more were out:
the benefit text was **Subtitle 3 (14/20)** where 003 draws **Body 2 (16/24)**; the
bullet list sat **20px** under the description instead of **8**; and the tick was
centred on a 20px line rather than a 24px one.

The 20 was a compound: `__header` carried a single `gap: 12` **and** the list a
`margin-top: 8`. That gap was inflating every distance in the header — the title sat
16 from the top row only by accident, and the description 16 from the title where
003 says 4. The header now sets no gap and each part states its own distance, which
is how the component is actually drawn: top row · 16 · title · 4 · description · 8 ·
bullets. Verified on the component page and on policy-length.

The banner going from purple to warm grey is the substantive change: the tint is now
what tells Active apart from Hover, since both carry the aqua border. Implemented so
Hover comes from `:hover` and Active from the card containing the checked radio —
neither needs a class moved about.

**`:hover` is scoped to cards that contain a radio.** A Product Card with no radio —
the work provider offer, which is a panel with its own buttons — isn't an option, and
an aqua border on hover would promise a selection that isn't there. Checked on all
three pages that use the component.

### 3.19 Policy length: what Product Card gained
`policy-length.html`, built 8 Aug 2026.

- **The active border now follows the radio** — `.product-card:has(.radio__input:checked)`
  alongside the `--active` modifier. As a class only, the border stayed wherever the
  markup put it while the selection moved; measured before and after across both
  cards. The modifier is kept for static examples.

- **The badge was two tokens out.** 003 binds `icon/glyph/brand-2-low` (#DBBFFD) for
  the fill where the repo had `brand-2-low` (#EDE0FE — a step lighter), and
  `icon/glyph/brand-3-high-fixed` for the glyph. Both corrected. The policy-length
  instance additionally overrides the glyph to `icon/glyph/brand-2-high` (#4B059F),
  added as `--badge--brand` rather than changed globally, since the component's own
  default is navy.

- 🔶 **A third frame shows this screen with only the 12-month card.** Presumably some
  drivers are offered one length. Not built — the condition isn't stated.

### 3.20 Cover level: the badge glyphs are placeholders
`cover-level.html`, built 8 Aug 2026.

- **Fully comprehensive takes `icons/ncd.svg`** — a shield with a tick, and exactly
  the glyph the frame draws. I had reported that no shield existed in the library
  and stood in `icons/policy.svg`; it was there under a name I didn't search for.
  Set on the user's instruction, 8 Aug 2026. The name reads as "no claims discount",
  but the drawing is a protection shield and this is the second thing it's used for
  — 🔶 **worth renaming in Figma** if it is meant to be general.

- **Third party only takes `icons/third-party-only.svg`** — the shield with a person
  the frame draws, added from 003 the same day. Both badges are now the drawn
  glyphs; nothing on this screen is standing in.

- **The excluded bullet was added to Product Card**, not to the journey:
  `.product-card__benefit--excluded` swaps the tick for a cross in
  `icon/glyph/primary`. Not in 003 — the component there has no negative bullet, so
  this needs authoring as a variant on the benefit row.

- **The comparison table is journey scaffolding** (`.compare` in `journey.css`), not
  a component. Nine rows of tick/cross against two columns is specific to this
  screen; if a second table turns up it should be lifted into the DS rather than
  copied. The copy is mine — the frames show the link but not the panel behind it.

### 3.21 Policy type: Product Card's padding was 4px out everywhere
`policy-type.html`, built 8 Aug 2026 from `5174-438013` / `8104-458949`.

- **The card's inset was wrong and is now 16.** `.product-card__header` carried
  `Spacer-20`; 003 binds **`Spacer-16`** and binds no Spacer-20 anywhere on the
  component (`57761-5782`: a 335-wide card with a 303-wide content frame at x=16).
  The journey frame says the same — 343 wide, 311 at x=16. Written as
  `calc(var(--spacer-16) - var(--border-m))` so the border sits inside the inset,
  which is how Figma measures it. **This moves policy length and cover level too**,
  by 4px on each side; both were re-rendered and are correct.

- **The border was `Border-3` and should be `Border-2`.** 003 binds Border-2 on the
  Active state. Measured after: 2px border, 14px padding, content 16 from the outer
  edge on all three screens.

- **The banner was inset 8 and should be 16** — level with the copy above it, which
  is what 003 draws. Nothing used the banner until this page, so nothing else moved.

- **The reward tiles are real now** — see 2.16.

- 🔶 **The error state isn't built.** A third frame, *Policy type - Generating quote
  error*, floats an error Alert above the page: **"Something went wrong" / "We
  couldn't generate your quote just now. Tap Continue to try again."** The Global
  Alert component can show it as-is, but nothing says what makes quote generation
  fail, and firing it at random would make the prototype lie about how often it
  happens. **With engineering** as of 8 Aug 2026 — what actually fails, and how
  often. Once that's known it is a few lines: the copy is above and the Global Alert
  already stacks, persists on Error, and closes.

### 3.22 Fetching quote: the wait, and two things it borrows
`fetching-quote.html`, built 9 Aug 2026 from `8167-126557` (Sense) /
`8167-127063` (Standard) / `8167-127292` (desktop).

**A new kind of screen.** Every page so far asks something; this one waits. So it
carries no Back, no Continue and no card, and it is **not a slot in the flow** —
`data-flow-as="quote.html"` borrows the quote's stepper position, and journey.js
leaves with `location.replace` after 8s — two round trips of the Sense fan, so the
wait is set by the animation rather than by feel (`LOOPS * LOOP_MS`). Never entering history is what makes both
the browser's Back button and the journey's own trail skip it, so Back from the quote
lands on the policy type question. Verified: no Back control on the wait, and
`quote.html` → `policy-type.html`.

**`data-journey-field` now records a checked radio on load**, not only on change.
Sense ships selected on the screen before, and without this the wait would have had
no stored answer to read for a choice the user had visibly made. Applies to every
radio in the journey, not just this pair.

- 🔶 **The panel's 24px radius is the one number on this screen with no token behind
  it.** 003's binding list for the frame stops at Radius-16; the corner measures 24
  off a 1:1 render (fitted across the arc, not eyeballed). Written as
  `--radius-large`. **Worth binding in Figma.**

- 🔶 **The purple offer strip is a Status Label with almost everything overridden** —
  solid `brand/2-medium` instead of the Brand variant's light fill, white text,
  Subtitle 1 instead of Subtitle 4, 32 tall instead of 24, radius 4. That is not a
  variant the component has, so it is built as journey furniture
  (`.proto__loading-offer`) rather than by bending Status Label. **Either it wants a
  real solid-fill variant in 003, or it should stay page furniture** — worth
  deciding, because a second screen wanting the same strip would copy it.

- 🔶 **`standard-cover.png` has the panel colour baked in.** Exported at 3× into
  `assets/loading/`, its background is a flat `#F2EDE9` —
  `surface/tertiary-medium`'s **light** value. On the panel in light mode that is
  seamless; in **dark mode the panel changes and the illustration will show a beige
  block**. Keying the flat colour out would wreck the soft shadows over it, so this
  wants a **transparent export** rather than a workaround. (The Sense illustration
  had the same problem and no longer does — see 3.23.)

**Status Label gained the Brand state** while this was being read — 003 has
`State=Brand` (`59025-73073`) and the repo's six states didn't include it. Added with
its own tokens (`brand/2-medium` text, `border/brand-2-medium`,
`surface/brand-2-low`), shown on the component page in both styles, and mapped in
Code Connect. Unrelated to the offer strip above, which is a different shape.

### 3.23 The Sense reward fan — the first animation in the journey
`8167-127293`, read 9 Aug 2026 with `get_motion_context`. Three gift cards start
almost stacked, hold, then fan apart over Figma's 2s — and then the same motion in
reverse walks them home. **`animation-direction: alternate`** buys the return journey
for nothing: CSS plays the keyframes and their easings backwards on every even run, so
one out-and-back is two runs and two of them is `iteration-count: 4`, 8s in all.

Nothing snaps anywhere, which is the point of going back rather than looping: each run
starts where the last ended, and an even count finishes on the 0% frame — each card's
own base `translate`. That is why no `fill-mode` is needed to stop the cards jumping
as the page leaves, and why a reduced-motion viewer's static state is the same picture
the animation begins and ends on. The 2s and the 8s live in `journey.css` and
`journey.js` respectively and have to move together.

**Taken from Figma, not eyeballed.** Each card's start and end offsets, its move
window (14.59% → 70.114%, and 80.654% for the middle card) and its easing came
straight from the emitted keyframes — including the one card that uses a spring,
which Figma resolves to a 51-stop `linear()` ramp, kept as emitted. Scaled by
296/330.4 so the fan fits the same 296px column the static illustration used.

**Built from parts, not played as a picture.** The cards have to overlap, and the
Figma exports of them carry an opaque panel-coloured background — three of those laid
over each other paint beige boxes across the cards behind. So each card is a real
element: a `surface/primary` tile, a gift-card face from `assets/rewards/`, and its
two lines. Two things fall out of that: the Sense illustration now **follows the
theme** (the flat PNG it replaced could not, see 3.22), and `prefers-reduced-motion`
can hold it on the piled-up arrangement the screen opens on.

`assets/rewards/tesco.jpg` was added for the third face. `sense-rewards.png` is gone
— nothing referenced it once the fan replaced it.

- 🔶 **The card's internals are my reading, not a measurement.** Every number Figma
  reports for these cards is a **rotated bounding box**, so the unrotated size and
  angle had to be recovered from the exported rasters (corner-finding, then solving
  the rect): ~128×131 at −15° / +15.58° / +12.4°, which reproduces the given bboxes
  to within 3% — the gap being the rounded corners. The face inset (6.75) is Figma's;
  the label sizes are the nearest tokens (Subtitle 4 + Metadata) to a measured ~15/13
  at full scale. **Transparent exports of the three cards would make all of that
  unnecessary** — the fan would use the artwork directly and the positions are
  already exact.

- 🔶 **One card's label doesn't match its artwork in Figma.** The middle card carries
  the Just Eat face with the text *Tesco / Online & in store* — the same strings as
  the card behind it. Built here as **Just Eat / Online**, because shipping "Tesco"
  over Just Eat artwork reads as a bug. **Worth correcting in the frame** either way.

- The motion could not be checked against Figma's own render: `export_video` produces
  an MP4, and headless Chrome does not advance a media clock under virtual time, so
  the frames could not be decoded. Verified instead by holding the CSS loop at fixed
  offsets (negative `animation-delay`, paused) and comparing the **start** state to
  the frame screenshot, which does match. The fanned-out state is trusted to the
  numbers.

---

## 4. Scheduled

### 4.1 Code Connect templates migration — before **17 Aug 2026**
All 57 `.figma.ts` files use the old framework-specific format. It still
publishes and warns. Migration guide:
https://developers.figma.com/docs/code-connect/templates-migration-guide/
