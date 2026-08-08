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

---

## 4. Scheduled

### 4.1 Code Connect templates migration — before **17 Aug 2026**
All 57 `.figma.ts` files use the old framework-specific format. It still
publishes and warns. Migration guide:
https://developers.figma.com/docs/code-connect/templates-migration-guide/
