# Handoff — where the work stands

**What this file is for.** A conversation with Claude gets summarised when it grows
long, and a summary is lossier than the real thing. This is the antidote: the live
state of the work, so a compacted thread or a brand-new session can pick up without
re-deriving anything. Updated at the end of each working day.

**It is not a changelog.** What changed and why lives in
[`KNOWN-ISSUES.md`](KNOWN-ISSUES.md) (design-system drift and open questions) and
[`prototype/sales-journey/JOURNEY.md`](prototype/sales-journey/JOURNEY.md) (the
journey's scheme, copy and behaviour). This file only answers **what to do next**.

**Starting a fresh session?** Read this file, then §2 of JOURNEY.md for the page list.
That is enough to be useful immediately.

---

## Last updated: 14 Aug 2026

### Where we got to

The Quote step runs end to end: cover start → policy length → cover level → policy type
→ the fetching-quote wait → review quote → payment. The review screen's four Change
dialogues work, and each writes its answer back into the row that opened it.

Since 12 Aug: Date Picker gained its `Type=Set date` variant, the tile formerly called
Small Comparison Tile is now **Price Card**, the Change dialogues use **Total Cost** for
the price and CTA instead of a hand-rolled block, Close is the supplied 32px icon, and
the Sales Navigation is 84 tall on desktop. Plus a run of journey polish — Back moved to
the foot of the page, the content wrapper and the Uber offer card take 32px corners on
desktop, the comparison table went to 16px, and every Cross Small is now
`icon/glyph/pressed`.

## 1. Next up

- **Sales Navigation's mobile height is fixed (14 Aug), and the 4px was not in the
  nav.** 003's Step Indicator puts the track at `y=28` under a 20px label — an **8px**
  gap where Onboarding Steps had 4 — so the indicator was 28 instead of 32. One token
  (`--gap-xx-small` → `--gap-x-small`) took the nav to 128 on mobile and the desktop
  steps to 60. Padding the nav to hide it would have left the stepper wrong everywhere
  else it is used.
- **Date Picker's Cancel / Confirm pair.** Both types put them side by side, full width
  split. The component has actions and the journey dialogue strips them (Done closes
  it), so the component's own pair has still never been checked against the frame.
- **Two readings I did not act on**, from the Calendar symbol's variable list:
  `border/secondary` `#D4D3D5` is bound where the repo uses `border/primary` for today's
  outline, and `Radius/Radius-24` is bound where the picker's outer radius is 16. A
  variable list cannot say which element takes which, so both want the frame read
  properly rather than inferred.
- **"Traditional" or "Simple"?** The Policy type *dialogue* frame calls Standard
  "Traditional cover you can set and forget."; the policy-type *page* frame says
  "Simple". The build uses "Simple" everywhere, because dialogues lift their cards from
  the page that owns them. One of the two frames wants correcting.

**Verified and settled, so nobody reopens them:** Number Item's Active state is
`surface/focus` + `border/active` — correct as it stands, and it is what the Calendar
type binds too. I briefly made the Calendar's selected day transparent on 12 Aug after
misreading a pale `#CEFDFD` middle as white in a low-resolution render; that is
reverted. Read faint colours from the tokens, never from a screenshot.

## 2. Decisions waiting on someone

| | what's needed |
|---|---|
| **The desktop total in a Change dialogue** | It steps 16/24 → **24/28**. The 24 is my read of "bigger on desktop", not a measurement — I ran out of resolution in the frame. If a smaller step was meant, 18 or 20 is one line in `journey.css`. |
| **Promo error copy disagrees upstream** | The journey uses *"Invalid, please check the code."* (the frame's), the 003 component says *"Invalid code, please try again"*. Deliberate divergence, recorded — but one of the two wants changing at source. |
| **Price Card's tags** | Yellow `brand/4-medium` and `brand/4-low` + `border/warning-low` are Status Labels with overridden colours in 003. Declared on the tile instead, because Status Label's states all mean something about *status*. Should they be real variants? |
| **`ncd.svg` naming** | It is a protection shield now used for two things; the name says "no claims discount", which is why I failed to find it the first time. |

## 3. Worth a sweep

- **The 516 sweep is done (14 Aug), and it was not what I first called it.** I had
  logged it as "one example width propagated across seven components". Reading each
  component's own node showed something more interesting: 516 was wrong everywhere, but
  **the right answer differed every time**, so a blanket replace would have been its own
  bug.

  | component | rule | was | 003 |
  |---|---|---|---|
  | Modal | panel | 516 | content-driven (343 / 588 + padding) |
  | Total Cost | content column | 516 | 588 |
  | tier-section | `__head`, `__title` | 516 | **588** |
  | trustpilot-reviews | `__head` | 516 | **588** |
  | addons-section | `__head` | 516 | **343** |
  | onboarding-header | `__steps` | 516 | **343** |

  My interim survey guessed from the CSS alone that six of these were a text *measure*
  and probably deliberate. That was wrong for four of them — worth remembering that
  reading the shape of a rule is not the same as reading the design.

  **All seven are now done.** The last one, `.tp-reviews__rating`, is **512** — the
  Lockup frame on `6500-186189` is 512 wide with the rating text filling it and the
  Trustpilot mark centred 8 beneath, so it was a width after all, not content.

- **Onboarding Steps' track is inset 2px** each side, done 14 Aug — `width: calc(100% -
  4px)`, matching `x=2, width=69.75` in a 73.75 step on `57552:33036`. It is what keeps
  a hair between one step's track and the next so four segments don't read as one bar.
  The inset is absolute, not proportional: the journey's steps are 91 wide and still take
  2 either side.

- **Product Card's reward stack** uses a fixed overlap step; 003 tightens the step as
  the image slot narrows, so the fan stays inside it. Mine clips at the slot's right
  edge instead. Only shows on the narrowest cards, and a fluid overlap needs a
  container query.

## 4. Known and deliberate — don't "fix" these

- **The 12-months-only review variant** (`7953-363357`) is documented but not built. It
  surfaces when monthly can't be offered — a 12-month-only product, or a premium past
  the threshold — and a discount bringing the premium back under that threshold returns
  the two-option screen. It does **not** apply to this journey, which is private hire
  and sells both. See KNOWN-ISSUES 2.17.
- **"Change" vs "Learn more" is derived, not authored.** One option in a dialogue gives
  Learn more, more than one gives Change; the start date is always Change. That is what
  makes the variant above cheap.
- **The quote-generation error state** (`7753-127572`) is unbuilt on purpose — the
  trigger is with engineering. Copy is recorded in KNOWN-ISSUES 3.21.
- **`assets/loading/standard-cover.png` has the panel colour baked in** and will show a
  beige block in dark mode. It wants a **transparent export**, not a CSS workaround.
- **Code Connect carries a typo on purpose**: 003 spells Price Card's third
  state "Avtive", and the enum key has to match the variant name.

## 5. How to verify things in this repo

- `python3 build-dist.py` after any component change — it bundles `tokens/*` and
  `components/*/*.css|js` and regenerates `dist/components/*.html`.
- Screens render over `file://`. Headless Chrome traps that have cost real time:
  **CSS transitions and animations do not advance** under `--virtual-time-budget` (hold
  an animation with a negative `animation-delay` and `animation-play-state: paused`
  instead); **`timeout` does not exist on macOS**; fixed and sticky elements need an
  iframe to capture; and `sips -c` crops **centred**, so use a canvas slicer for
  top-left crops.
- When checking whether something is *wired up*, grep for the wiring
  (`<script src=…>`), not the filename — a filename matches comments and prose too.
  That cost a turn today.
