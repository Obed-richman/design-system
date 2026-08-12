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

## Last updated: 12 Aug 2026

### Where we got to

The Quote step is complete end to end: cover start → policy length → cover level →
policy type → the fetching-quote wait → review quote → payment. The review screen has
its four Change dialogues working, with the chosen answer writing back into the summary
row that opened it.

Today was mostly library resync rather than new screens: Product Card down to 311,
Modal's desktop top inset to 88, Total Cost's content column to 588, Date Picker's
selection to a ring, and the Discount Code copy aligned to 003.

---

## 1. Next up — Date Picker (`57549-11422`)

Two gaps found while resyncing it, neither started:

- **`Type=Set date` is not modelled.** The repo only builds `Type=Calendar`. Set date
  is structurally different: a header row with a "Text" label and a radio, a bare 1–28
  grid, **no** month navigation and **no** weekday row. A variant to build, not a token
  to nudge.
- **Cancel / Confirm sit side by side**, full width split, in both types. The component
  has actions, but the journey dialogue strips them (Done closes it), so the
  component's own pair has never been checked against the frame.

Done today for reference: selected day is now an aqua **ring** with a white middle (it
had been filled with `surface/focus`), and the day grid sits on its own white ruled
panel.

## 2. Decisions waiting on someone

| | what's needed |
|---|---|
| **The desktop total in a Change dialogue** | It steps 16/24 → **24/28**. The 24 is my read of "bigger on desktop", not a measurement — I ran out of resolution in the frame. If a smaller step was meant, 18 or 20 is one line in `journey.css`. |
| **Promo error copy disagrees upstream** | The journey uses *"Invalid, please check the code."* (the frame's), the 003 component says *"Invalid code, please try again"*. Deliberate divergence, recorded — but one of the two wants changing at source. |
| **Small Comparison Tile's tags** | Yellow `brand/4-medium` and `brand/4-low` + `border/warning-low` are Status Labels with overridden colours in 003. Declared on the tile instead, because Status Label's states all mean something about *status*. Should they be real variants? |
| **`ncd.svg` naming** | It is a protection shield now used for two things; the name says "no claims discount", which is why I failed to find it the first time. |

## 3. Worth a sweep

- **The stale 516 — swept, and it is systematic.** It was a leftover example width in
  **Modal** and **Total Cost**, both now on one content frame (588). Grepping the rest
  of the library on 12 Aug found `max-width: 516px` in **five more components**:

      components/addons-section/addons-section.css:45
      components/onboarding-header/onboarding-header.css:44
      components/tier-section/tier-section.css:54, :60
      components/trustpilot-reviews/trustpilot-reviews.css:54, :152

  plus three inline `max-width: 516px` on component demo pages. **None of these have
  been checked against their own Figma nodes** — do not blanket-replace them with 588.
  The point is that one example width propagated across seven components, so each wants
  its node re-read and the right content frame put in deliberately. This is the
  highest-value item on this list: it is one mistake repeated, not seven separate ones.
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
- **`quote.html` is out of the flow**, replaced by `review-quote.html`. The file is
  still on disk; delete it once nothing points at it.
- **`assets/loading/standard-cover.png` has the panel colour baked in** and will show a
  beige block in dark mode. It wants a **transparent export**, not a CSS workaround.
- **Code Connect carries a typo on purpose**: 003 spells Small Comparison Tile's third
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
