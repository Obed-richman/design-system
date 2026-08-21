# Sales journey — scheme and design intent

What this prototype is, how it is put together, and the rules it holds itself to.
Read this before adding a screen or a question: most decisions here are meant to
apply to the whole journey, so a new page should get them by following the
pattern rather than by restating it.

**Scope.** Structure, patterns, behaviour, copy and the intent behind them. Not a
changelog and not a defect list — anything unresolved, unconfirmed or deviating
from Figma lives in [`KNOWN-ISSUES.md`](../../KNOWN-ISSUES.md), and the exact
values of any component live in that component's own CSS header.

**Naming.** Measurements are given by their **Figma variable name** — `Spacer-16`,
`Radius-8`, `Frame/Content` — with the repo token beside it where the two differ.
The Figma name is the shared vocabulary; the CSS custom property is just how this
repo spells it.

**Source of truth.** Design System 003 for components, tokens and type styles;
the Sales Journey — Ideation file for screen composition and copy. Where the two
disagree, 003 wins and the difference gets logged.

---

## 1. Scaffold

**Every screen is a standalone HTML page.** No build step, no router, no
framework — a page is openable on its own and shows something sensible. The cost
is that shared chrome and cross-screen state have to be injected; the benefit is
that any screen can be handed to someone as a single link.

**`journey.js` owns everything shared.** A page declares only its own content:

```html
<main class="proto" data-step="vehicle"> … </main>
```

and on load the script adds the Sales Navigation above it (stepper set from the
flow), the Sales Footer below, and a Back control at the top.

**The navigation is sticky.** Journey screens run long, and Help and the stepper are
the two things worth reaching from anywhere on one, so the bar holds the top of the
viewport (`.sales-nav--sticky`). It grows a bottom hairline **only once the page has
scrolled**: at rest the bar and the page share a background and want no seam, but
once content is passing underneath, the line is what says the page is cut off behind
the bar rather than ending there. It sits above page content and below the Global
Alert, so a message about the screen is never covered by the screen's own chrome. It also wires the
Continue/Back controls, enforces the required-field rule, and carries answers
between screens. A screen that wants none of that still gets it, which is the
point: consistency is structural, not something each page remembers to do.

**Steps and pages are separate ideas.** A *step* is one segment of the stepper. A
step can hold several *pages*, and its track is a progress bar for them:

```js
{ id: 'vehicle', label: 'Vehicle', pages: ['index.html', 'vehicle-found.html', 'vehicle-details.html'] }
```

So the Vehicle step fills to a third, two thirds, then full as you move through
its three pages. Earlier steps sit full; later ones sit empty. A single-page step
keeps the component's in-progress half-fill rather than filling completely,
because a step you are *on* should not look identical to one you have finished.

Adding a page means adding its filename to the right step's `pages` array. The
stepper fill and the Back/Next wiring both follow from that one list, and
position is derived from the filename so a page cannot disagree with the flow.

**Pages you see *instead of* each other share one slot.** A nested array marks a
branch:

```js
pages: ['licence-type.html', ['uk-licence.html', 'eu-licence.html']]
```

Both arms then occupy a single position. Continue from either goes to whatever
follows the branch, Back from either returns to the question that chose it rather
than to the arm next door, and the stepper counts the branch once — a driver only
ever sees one of them, and a bar counting a page nobody visits is lying about how
much is left. Listing alternatives as consecutive pages is what previously sent
Continue on the UK licence page into the EU one.

**An arm can be a sequence.** Nest again when one side of a branch runs to more
than one page:

```js
['uk-licence.html', ['eu-licence.html', 'driving-convictions.html']]
```

Continue then walks the arm you are on and only leaves the branch at its end. This
is how convictions are asked of EU drivers and skipped for UK ones — not by any
check on the screen itself, but because the flow never routes a UK driver through
it. A page that everyone sees goes in the slot **after** the branch, which is where
`taxi-licence.html` sits.

**Back retraces, it doesn't guess.** From the page after a branch the flow alone
could only offer the arm it lists first, which would send an EU driver back into a
UK licence page they never saw. So journey.js keeps a **trail** in sessionStorage —
pushed going forward, popped coming back — and Back prefers it. The trail is only
trusted when it names a page that really does sit in the slot behind, so a stale or
hand-edited one falls back to the flow rather than routing somewhere absurd; a page
opened cold has no trail and gets the flow's answer.

**Exit screens sit outside the flow.** See §5.6.

---

## 2. Pages

| Page | Step | Purpose |
|---|---|---|
| `index.html` | Vehicle | Registration lookup. Split layout: hero image and the form side by side on desktop, form only on mobile. |
| `vehicle-found.html` | Vehicle | Reads the looked-up vehicle back for confirmation. Plate + spec rows + a brand note. |
| `vehicle-details.html` | Vehicle | The questions: modifications, legal owner (with a conditional follow-up), purchase date. |
| `driver-details.html` | Driver | Who the driver is: title, name, date of birth, UK address (postcode search), and whether they've lived in the UK since birth. |
| `driver-history.html` | Driver | The three decline questions: DVLA-reportable medical condition, unspent non-motoring convictions, cancelled or voided insurance. Any Yes ends the journey. |
| `contact-details.html` | Driver | Email and mobile number, plus two marketing opt-ins. |
| `licence-type.html` | Driver | UK or EU licence. Picking UK asks whether it was issued in Northern Ireland; Yes ends the journey. |
| `licence-declined.html` | — | Kickout for a Northern Ireland licence. Same message as the general decline, but offers **Go back**. |
| `eu-licence.html` | Driver | Licence number, country of issue, and when they got it. Reached when EU licence is chosen. |
| `driving-convictions.html` | Driver | Driving convictions or bans in the last 5 years, as a list you add to. **EU drivers only** — see §4.11. |
| `taxi-licence.html` | Driver | When the taxi licence was issued and by which district. Both UK and EU drivers — where the licence branch closes. |
| `claims.html` | Driver | Claims in the last 3 years, as a list you add to. Same repeating-card screen as convictions. |
| `no-claims-discount.html` | Driver | Years of taxi no claims discount. |
| `work-provider.html` | Driver | Offers linking an Uber account for a discount. Last page of the Driver step. |
| `work-provider-linked.html` | — | Confirms the account is linked. An **outcome** of the page above, sharing its slot. |
| `uk-licence.html` | Driver | Licence number, with the personal details from the driver screen shown for checking. Reached when the licence is UK and not Northern Ireland. |
| `cover-start.html` | Quote | When cover should begin: Today, Tomorrow, or a date within 30 days. |
| `policy-length.html` | Quote | 12 months or 30 days, as two Product Cards. |
| `cover-level.html` | Quote | Fully comprehensive or third party only, with a Modal comparing them side by side. |
| `policy-type.html` | Quote | Zego Sense or Zego Standard, as two Product Cards wearing the product lockups. |
| `fetching-quote.html` | — | The **wait** while the quote is generated, in a Sense and a Standard version. Not a slot: it shares the quote's stepper position and replaces itself. |
| `review-quote.html` | Quote | The price and the read-back: two payment tiles, a promo row, a summary of every choice with Change links, and Continue. |
| `payment.html` | Payment | **Placeholder** — one page standing in for the step. Ends the journey. |
| `quote-declined.html` | — | Kickout. Reached when an answer disqualifies the quote. |

**Driver, Quote and Payment will each hold several pages**, the same way Vehicle
holds three. They are defined as we reach them: each new page gets designed, then
added to that step's `pages` array, and the stepper's progress maths follows
automatically. Driver has its first real page; Quote and Payment are still single
placeholders carrying a dashed `.proto__todo` drop zone where real content goes.

The Driver step is **nine slots**, split by what they ask: who the driver **is**,
their **history**, how to **contact** them, what **licence type** they hold, then
the licence itself — a branch, so a UK page *or* an EU page **and its convictions
screen**, never both — and finally the **taxi licence**, where the branch closes
and both kinds of driver meet again, their **claims**, their **no claims
discount**, and the offer to link a **work provider** account. Figma's own split.

---

## 3. Layout scheme

### 3.1 Canvas width

Screens are one of two widths, both taken from the `Frame/*` variables and both
plus a `Spacer-16` gutter either side, so content never touches the edge:

| | mobile | desktop (≥768px) |
|---|---|---|
| default screen | `Frame/Wrapper` (343) → fills the screen | `Frame/Content` (588) |
| wide screen (`.proto--wrapper`) | `Frame/Wrapper` (343) | `Frame/Wrapper` (1200) |

The default is a single centred column of questions — most screens. The wide
variant is for a screen that needs the whole canvas, like the split hero on
`index.html`. Note Figma's mobile `Frame/Content` (311) is the width *inside* a
card's padding, not the page column, which is why mobile uses Wrapper for both.

### 3.2 Vertical rhythm

| | mobile | desktop (≥768px) |
|---|---|---|
| screen padding, top | `Spacer-20` | `Spacer-32` |
| screen padding, bottom | `Spacer-32` | `Spacer-96` |
| screen padding, sides | `Spacer-16` | `Spacer-16` |
| between sections on a screen | `Spacer-24` | `Spacer-24` |
| card padding | `Spacer-16` | `Spacer-32` |
| between questions in a card | `Spacer-20` | `Spacer-24` |
| card radius | `Radius-16` | `Radius-16` |
| alert radius (inline and banner) | `Radius-8` | `Radius-8` |
| above an alert glyph | `Spacer-4` | `Spacer-4` |

These follow the intent 003 records against the Spacer variables themselves:
`Spacer-16` for "components with a close relationship", `Spacer-20`/`24` for "a
loose relationship", `Spacer-32` to "separate sections within the main content
area", and `Spacer-96` at the foot of a desktop screen to hold the content clear
of the footer.

On mobile the screen **hugs its content** and the footer is pushed down, so a
short screen doesn't leave the footer floating mid-viewport. On desktop the
screen **fills the viewport** instead, which puts the footer at the bottom
without the same trick.

### 3.3 Type

| | mobile | desktop |
|---|---|---|
| screen heading | `Mobile/Title 4+ \| Bold` | `Desktop/Title 3 \| Bold` |
| screen sub-heading | `Body 1` (18/28) | `Body 1` (18/28) |
| question | `Subtitle 2` (bold 16/24) | same |
| supporting text under a question | `Body 2` (16/24), `color/text/pressed` | same |
| field label | `Body 3` (14/20) | same |
| second line under an option | `Body 2` (16/24), `color/text/pressed` | same |
| alert copy (inline and banner) | `Body 2` (16/24) | `Body 2` (16/24) |
| alert glyph, leading and close | 16px | 16px |

**Alerts** — the inline aside inside a form card and the screen-level banner — are
sized alike, because whatever an alert is telling you it should read the same way.
Both take the **bordered** variant (the border is what separates the aside from the
white card behind it, and the banner from the page under it) and `Radius-8`, a step
below the card's `Radius-16`. An inline alert is never a card of its own.
On desktop the copy steps up to `Body 2` and the glyph steps *down* to 16px with
`Spacer-4` above it, which sits it on the first line's cap height; at 24px it
would out-weigh the sentence it belongs to. Mobile keeps `Body 3` and the 24px
glyph. This is the journey's treatment, held in `journey.css` — the component's
own defaults (`Radius-16`, `Body 3`, 24px glyph) are unchanged.

The heading **crosses type steps** rather than scaling within one — Title 4+ is
the mobile step 003 pairs with Desktop Title 3. That is why it can't be a
typography utility class: each of those tracks a single step across breakpoints.

**Body copy is 16 unless a frame says otherwise.** Set 21 Aug 2026, and it is the
default to reach for on any new screen: prose the reader is meant to *read* — a
sentence explaining a question, a second line under an option, alert copy, a note
under a CTA — takes `Body 2` (16/24). 14 is not a smaller flavour of body text; it
is what something becomes when it stops being prose.

So these stay at `Body 3` (14/20), each for a reason rather than by omission:

| stays 14 | why |
|---|---|
| field label | a name for a control, not a sentence |
| validation message | short functional text; the component's own size, from 003 |
| character counter | metadata about a field, not addressed to the reader |
| `Change` / `Compare side by side` links | actions, sized to sit inside a row |
| `.proto__todo` drop zones | dev furniture, out before anything is shared |

Anything not in that table and below 16 is a bug, not a choice. Two the rule has
caught and left alone pending a frame: `.proto__cta-note` ("You can always change
this later.") is prose and reads as an exception it may not deserve, and the
validation message is only at 14 because the component is — both worth checking
against their frames rather than my reading.

### 3.4 Responsive mechanics

**Layout switches on the container, sizing on the viewport.** Cards, split rows
and the intro heading use `@container`, so the Desktop/Mobile preview toggle
reframes them properly on a desktop monitor. Anything that must follow the real
viewport — the screen's own padding, button direction — uses a media query
guarded by `html:not([data-viewport="mobile"])` so the toggle can override it.

**Buttons.** A single action is full width. A pair stacks on mobile with the
primary on top and sits side by side on desktop, each taking half the row.

**A dropdown shows five rows and scrolls.** `dropdown-list--scroll` is the design
system's own modifier for a long list — 240px against a 48px row. Longer lists get
it; short ones don't need it. The dialling-code list leads with United Kingdom and
Ireland, then runs A–Z.

**An open dropdown puts the active border on its field**, and keeps it for as long
as the list is showing. Focus alone isn't enough: a Select's value input is readonly
and the phone prefix is a `<button>`, so focus comes and goes and the field can end
up looking at rest with a menu hanging off it. No focus ring with it — the list is
the thing to look at.

**Flags come from `assets/flags/`**, the 003 `Flags` component set exported at
Size=Large and scaled by CSS. Never redrawn, never inlined: one file per country,
referenced. Each carries its own rounded corner and padding, so nothing clips or
rings them — see the note on `.input-select__flag` in `input.css`.

**Colour and type come from tokens, always.** No hex values in journey CSS or
markup. If a value is needed that no token carries, that is a design-system gap
to raise, not something to hard-code here.

---

## 4. Copy

Taken from the Figma frames, which is the approved wording. **Anything marked
🔶 is a placeholder I wrote to stand a screen up and has not been through
review** — replace it with approved copy when there is some.

### 4.1 Let's find your vehicle — `index.html`

- Heading: **Let's find your vehicle**
- Sub-heading: Enter your registration and we'll take care of the details.
- Registration field: no visible label; GB country badge
- Reassurance card: **Why 100,000+ drivers already choose us** — FCA regulated ·
  24/7 support in the Zego app · Award-winning claims team · Discounts at renewal
  and up to £60 in gift cards
- Action: **Find vehicle**

### 4.2 We found your vehicle — `vehicle-found.html`

- Heading: **We found your vehicle**
- Sub-heading: Take a quick look to make sure everything's correct.
- Plate: the registration as entered
- Spec rows: Vehicle type · Make · Model · Engine size · Seats
  (values are sample data from the frame — Car, Toyota, Prius, 1.8L, 5)
- Note: You're joining more than 18,000 Toyota drivers who we already cover
  — copy varies by vehicle group; the frame carries a dev note to that effect
- Actions: **Change vehicle** (secondary) · **Looks good** (primary)

### 4.3 Tell us about your vehicle — `vehicle-details.html`

- Heading: **Tell us about your vehicle**
- Q1: **Has your vehicle been modified?**
  Support: For example, permanent changes to your car's performance or looks,
  made after the factory. — Yes · No
- Q2: **Are you (or will you be) the legal owner of the vehicle?** — Yes · No
  - Follow-up when **No**: **Who is the legal owner?** placeholder "Select" —
    Family member or friend · Leasing company (< 6 months) ·
    Leasing company (≥ 6 months) · Spouse or partner · Your company or employer
- Q3: **When was the vehicle purchased?** placeholder "MM / YYYY", divider "or",
  checkbox **The vehicle has not been purchased yet.**
- Action: **Continue**

### 4.4 Quote declined — `quote-declined.html`

- Heading: **Sorry, we can't offer you a quote this time**
- Body: We've reviewed your details, and we're not able to offer a quote. If
  anything changes in the future, please come back and try again.
- Action: **Return to home page**

### 4.5 Tell us about yourself — `driver-details.html`

- Heading: **Tell us about yourself**
- Sub-heading: We'll only use these details to get your quote and set up your cover.
- Info alert: Enter these details as they appear on your driving licence.
- **Title** — placeholder "Select": Mr · Mrs · Miss · Ms · Mx · Dr
- **First name(s)** — placeholder "Enter first name(s)"
- **Surname** — placeholder "Enter surname"
- **Date of birth** — placeholder "DD / MM / YYYY"
- **UK address** — placeholder "Enter your postcode"; results are two-line rows
  (street, then "Town, POSTCODE") ending in **Enter address manually**.
  A chosen address reads back with an **Edit** action; manual entry is
  **Address line 1** · **Address line 2** · **City** · **Postcode** with
  **Save address**.
- **Have you lived in the UK since birth?** — No · Yes (No first, unlike the
  Vehicle questions)
  - Follow-up when **No**: **When did you move to the UK?**
    Support: A rough guess is fine. — placeholder "MM / YYYY"
- Action: **Continue**

Error copy, from the frame's required-error state — the first approved validation
copy in the journey: **Select your title.** · **Enter your first name(s).** ·
**Enter your surname.** · **Enter your date of birth.** · **Enter your address.**
· **Select an option.** for a selector with nothing picked. That last one is now
the journey-wide default for selectors, replacing wording I had invented.

### 4.6 A few things we have to ask — `driver-history.html`

- Heading: **A few things we have to ask**
- Sub-heading: These check Zego is right for you.
- **Do you have a medical condition or disability you need to tell the DVLA
  about, but haven't yet?** — Yes · No
- **Do you have any unspent non-motoring-related criminal convictions?** — Yes · No
- **Have you had an insurance policy cancelled or voided for non-payment, fraud
  or misrepresentation in the last 5 years?** — Yes · No
- Action: **Continue**

The wording differs slightly from the same three questions as they appear in the
previous page's error frame ("an insurance policy" vs "any insurance policies",
"non-motoring-related criminal" vs "non-motoring"). This page's is the version
built, being the one on its own frames.

### 4.7 How should we contact you? — `contact-details.html`

- Heading: **How should we contact you?**
- Sub-heading: We'll only use these to send your quote and look after your cover.
- **Email** — placeholder "Enter your email address"
- **Mobile number** — a dialling-code prefix (**+44** United Kingdom · **+353**
  Ireland) and the number
- Opt-in, **ticked by default**: Hear from Zego about products, exclusive deals,
  and ways to save on your insurance. See our **privacy policy**. Opt out any
  time.
- Opt-in, **unticked**: Get offer and services from our trusted partners. Opt out
  any time.
- Action: **Continue**

Error copy: **Please provide a valid email address.** for a badly formed address,
shown with the warning glyph like every other error in the journey.

The screen ends in a single primary **Continue**, the same as every other form
screen. The clear (×) inside a field appears only while the field is in error *and* focused — see KNOWN-ISSUES 2.9, where 003 still draws it more widely.

### 4.8 What type of driving licence do you have? — `licence-type.html`

- Heading: **What type of driving licence do you have?** (no sub-heading)
- **UK licence** (flag) · **EU licence** (EU licence icon) — stacked, full width
  - Follow-up when **UK licence**: **Was your licence issued in Northern
    Ireland?** — Yes · No. **Yes** ends the journey.
- Action: **Continue**

The licence kickout reuses the decline message but offers **Go back** rather than
Return to home page — a licence answer is something you might have mis-tapped,
where the general decline is a verdict on the whole quote.

**Parked for the next screen.** This page's frames carried a DVLA note under the
button, since moved on: *We securely check your licence details with the DVLA to
confirm your driving record and calculate an accurate price in line with our
**privacy notice**.* The layout it needs is `.proto__cta` in `journey.css` — a
primary action with centred small print beneath — which is still there waiting
for it.

### 4.9 Tell us about your licence — `eu-licence.html`

- Heading: **Tell us about your licence** (no sub-heading)
- **Driving licence number**
- **Where was your licence issued?** — Select with a flag per country. The frames
  show Ireland · Romania · Portugal · Poland · Spain, then a divider and the full
  A–Z; only the five are built, the rest awaiting a country list.
- **When did you get your licence?** — MM / YYYY, refused if in the future
- Action: **Continue**

### 4.10 What's your licence number? — `uk-licence.html`

Reached when the licence is UK and **not** Northern Ireland.

- Heading: **What's your licence number?**
- Sub-heading: It's the 16 characters on the front of your licence, on line 5.
- Info alert: Please make sure all your personal details match your driving
  licence.
- **Driving licence number** — 16 characters, with a live counter under the field
  on the right reading e.g. *12 of 16*
- The **Driving licence** card graphic (the DS component of that name), with
  line 5 highlighted to show where the number is
- A **Detail card** titled **Personal details**, holding Title · First name(s) ·
  Surname · Date of birth, **pre-filled from the driver-details screen** — the
  frame is named "UK DL - Pre-filled"
- Action: **Continue**, and this is where the parked DVLA note belongs: *We
  securely check your licence details with the DVLA to confirm your driving
  record and calculate an accurate price in line with our privacy notice.*

**The first five characters are pre-filled, for some titles.** A GB licence number
encodes the holder, and positions 1–5 are the surname padded to five with 9s — so
those five can be derived from the surname alone. They are filled in for
**Mr / Mrs / Miss / Ms** and left empty for **Mx / Dr**.

The split is a product decision, not a DVLA rule: positions 1–5 don't depend on
the title at all. But the *rest* of the number depends on sex (positions 7–8 add
50 for female), and Mx and Dr say nothing about it. Handing someone five
characters and then stopping — on titles where we could never offer more — reads
as a half-finished field; starting them empty is honest about it. Whatever is
filled in is editable, and a field the user has already typed into is never
overwritten.

The structure is also used for the check below.

**Personal details are carried over** from the driver screen — title, names and
the three date-of-birth segments. They are shown so the driver can check them
against the licence in their hand, and they stay editable: the licence is the
authority, so if the two disagree it's this screen that should change.

**An incomplete number fails the lookup too.** DVLA matches on all 16 characters,
so a part-typed number is a check that can't be run rather than one that
disagrees. On Continue, anything between 1 and 15 characters stops the screen and
raises the same **screen-level alert**: *Your licence number isn't complete. Enter
all 16 characters from line 5 of your licence, then try again.*

An **empty** field is left to the journey-wide gate instead — it flags inline with
*Enter your driving licence number.*, because that is the rule for every untouched
field on every screen and the message belongs beside the field it names. The
banner is for a number that exists but can't be used.

The count comes from the field's `maxlength`, which is also where the character
counter under the field reads it, so the rule, the banner and the counter can't
quote different numbers. The field is held to licence characters as you type — a
GB number has no spaces or punctuation, and without that a trailing space would
show "16 of 16" beside a banner calling the number incomplete.

**A trailing tick marks a complete number.** The DS Tick appears in the field on
the keystroke that reaches 16 and goes away again if characters are removed — the
same signal the registration field gives on the first screen. It says *this is a
whole licence number*, not *this passed the lookup*, which nothing can know until
Continue. Its slot keeps its width whether or not the tick shows, so the value
doesn't jump sideways on the keystroke that completes it.

**A mismatch fails the lookup.** On Continue, the first five characters of the
number — which are the surname padded with 9s — are compared with the surname
**on this screen**, not what the driver screen stored, because this screen lets
the details be corrected. If they disagree the two can't both be right and no DVLA
lookup would match, so the screen refuses to advance and raises a **screen-level
alert** above the content.

Neither alert is attached to a field. For a mismatch the fault is two answers
disagreeing, with no single one to blame; for an incomplete number the fault is
that the DVLA check can't happen at all. Both are the screen reporting on the
lookup, so both sit at screen level, and only one shows at a time — an incomplete
number is reported as incomplete rather than as a mismatch, since telling someone
their half-typed number doesn't match is true but useless. Any edit retracts the
alert, since it is a statement about the check and a change makes it stale.

**The banner is the Global Alert component.** Nothing about a screen-level message
is specific to this journey, so it lives in the design system
(`components/global-alert/`) and the journey is a consumer: it decides what to say
and when, and the component owns everything else.

- **It floats at the top of the viewport**, over the content, on a
  `--shadow-dropdown` elevation. It has to: the fault is found on Continue, which
  is at the *bottom* of a long screen, so a message in the flow at the top would be
  off-screen at the moment it appears and the button would seem not to work.
- **It can be dismissed** with a close (×), for when it covers the thing it is
  pointing at.
- **Up to two can stack**, cleared one by one. A third drops the oldest.
- **Three states** — Error, Warning and Success — on Alert's existing `--negative` /
  `--warning` / `--positive`. **Success retires itself after 5s; Error and Warning
  persist**, because a confirmation has been read by the time it's understood while
  a fault has to be acted on. This journey raises Error only, so far.

The one thing the journey styles is its **width**, in `journey.css`, so the banner's
edges land on the card's rather than on the canvas gutter — only the journey knows
where its own content column is.

Only the UK branch does either. An EU licence number has no structure we hold.

### 4.11 Have you had any driving convictions or bans in the last 5 years? — `driving-convictions.html`

- Heading: **Have you had any driving convictions or bans in the last 5 years?**
- Answers: **Yes** · **No**
- Yes reveals a list of **Conviction #N** cards, each a Detail Card with a bin to
  delete it, holding:
  - **When did the conviction occur?** — segmented `MM / YYYY`
  - **What is the DVLA offence code?** — *DVLA code is a letter and number like
    SP30 or DR10. It's on your driving record.* A Select you type into to filter,
    placeholder **Start typing**
  - **Did you get disqualified because of this offence?** — Yes · No
  - **How long were you disqualified for?** — *Please enter to the nearest months.
    Use your best estimate if you're not sure.* Placeholder **Enter number of months**
- Action below the list: **+ Add a conviction**
- Action: **Continue**

Errors: *Enter conviction date.* · *Select DVLA offence.* · *Select an option.* ·
*Enter disqualification months.*

**EU drivers only.** A UK licence's convictions come back from the DVLA lookup, so
the screen sits inside the EU arm of the licence branch (§1). Nothing on the page
checks the licence type — the flow simply never routes a UK driver through it,
which means there is no state where the screen is shown and shouldn't be.

**The list never empties.** The bin deletes a card until one is left, then stops:
Yes with nothing to show is a state the design has no picture of, and answering No
is how you say you have none. Numbering closes up after a delete, while the ids
behind it keep counting — the number the driver reads and the one the DOM needs are
different things as soon as anything is removed.

**Switching Yes → No asks first**, through a Modal: *Discard what you've added?* /
*Changing your answer to 'No' will discard the details you've added, you'll need to
re-enter them if you change your mind.* / **Discard** · **Cancel**. Only when there
is something entered — confirming an empty list is a dialogue about nothing. Until
Discard is pressed the answer stays on Yes, so cancelling leaves everything as it
was.

🔶 **Yes comes first here**, as it does everywhere else in the journey (§5.3). The
mobile frames draw the disqualification question as No · Yes and the desktop frame
draws it Yes · No; the journey-wide rule settles it. Worth correcting in Figma.

### 4.12 Tell us about your Taxi licence — `taxi-licence.html`

- Heading: **Tell us about your Taxi licence**
- Sub-heading: **We'll use these details to get you an accurate quote.**
- **When did you get your taxi licence?** — segmented `MM / YYYY`, refused if in the
  future
- **Licence issuing district** — a Select you type into to filter, placeholder
  **Select**. **London** leads, then A–Z, in a scrolling list
- Action: **Continue**

Errors: *Enter the date you got your licence.* · *Select your licence issuing district.*

**Both kinds of driver arrive here**, so it sits in the slot after the licence
branch rather than in either arm: a UK driver reaches it from the licence-number
page and an EU driver from the convictions page.

🔶 **The district list is a sample** — 50 real licensing districts with London
pinned. There are several hundred; a live version wants a real source.

### 4.13 Any claims in the last 3 years? — `claims.html`

- Heading: **Any claims in the last 3 years?**
- Sub-heading: **No judgement. It just helps us calculate the most accurate price
  for your cover.**
- Answers: **Yes** · **No**
- Yes reveals a list of **Claim #N** cards, each a Detail Card with a bin to delete
  it, holding:
  - **When did the incident happen?** — segmented `MM / YYYY`, bounded to the last
    3 years
  - **What type of incident was it?** — Select: Accident · Collision · Theft ·
    Vandalism · Windscreen · Other
  - **Was this an at-fault incident?** — Yes · No
  - **What was the claim value?** — *Use your best estimate if you're not sure.*
    Placeholder **£**
- Action below the list: **+ Add a claim**
- Action: **Continue**

Errors: *Select an option.* · *Enter a date within the last 3 years.* · *Select the
type of incident.* · *Enter the claim value.*

**The same screen as convictions**, so it uses the same behaviour: the list never
empties, numbering closes up after a delete while ids keep counting, and switching
Yes → No asks before discarding. See §4.11 for the reasoning, all of which applies
here.

### 4.14 Just a couple more things — `no-claims-discount.html`

- Heading: **Just a couple more things**
- Sub-heading: **These help us get your price right. Honest answers mean an accurate
  quote.**
- **Your taxi no claims discount (NCD)** — the bold line names the topic, and the
  question is asked underneath it:
  - *How many years of no claims discount have you earned as a taxi driver?*
  - *You'll need proof from your last insurer. We'll remind you to send it after you
    buy.*
- A Select, placeholder **Select**, offering **0**–**10**
- Action: **Continue**

Error: *Select your no claims discount.*

**The label is the topic, not the question.** Two lines of supporting text won't fit
in a label, so the bold line names what is being asked about and the question and the
proof note sit under it as supporting text. Same shape as a question with a
`.choice-selector__paragraph` — the label is what you are looking at, the text below
is what you need to know before answering.

**The heading is plural and the card holds one question.** Built to take more: add
another `.input-group` and the gate, the rhythm and the error handling all follow.

**The scale stops at 10.** Confirmed — a driver with more says 10, so there is no
"or more" option to explain. The frames show 0–4 in a scrolling list and don't draw
the end of it.

### 4.15 Link your Uber account — `work-provider.html`

- A **Product card** carrying the Uber badge:
  - **Get up to 25% off when you link your Uber account.**
  - *Link your account so we can check your driving history and apply any discount
    you're eligible for. You'll sign in on Uber's own site, then come straight back
    here.*
  - ✓ Quick, secure connection · ✓ No documents to upload · ✓ Discount applied
    automatically if you're eligible
- Actions: **Link to Uber** · **Skip for now**

Then `work-provider-linked.html`:

- The same card with a tick on the badge: **You're all linked.** / *Your quote will
  automatically include a discount based on your Uber driver score.*
- Action: **Continue**

**Uber's own screens are not built.** The frames run this into Uber's sign-in and
back; those pages belong to Uber, so **Link to Uber** goes straight to the linked
screen, which is what a driver sees on the way back. The *"We couldn't link your Uber
account"* outcome is drawn in Figma and deliberately left out of the prototype.

**The linked screen is an outcome, not a step.** It carries
`data-flow-as="work-provider.html"`, so it sits in that page's slot: Continue leaves
for the next step, Back returns to the offer, and the stepper counts one position for
the pair rather than counting a page a skipping driver never sees.

**The primary leads on both breakpoints** (`.proto__buttons--primary-first`). Every
other paired action in the journey is Back/Next — a sequence, so the desktop row runs
in journey order with Next on the right. This pair is a choice between two ways
forward, so the one being offered comes first. The frames draw it that way.

### 4.16 Ready to hit the road? — `cover-start.html`

- Heading: **Ready to hit the road?**
- Sub-heading: **Our cover fits your schedule, so tell us when you'd like it to
  begin.**
- **Today** / **Tomorrow**, each showing its date
- **Or**
- **Pick a date** — *Cover start date must be within 30 days.* A field that opens
  the Date Picker, placeholder **Select**
- Action: **Continue**

Error: *Select a cover start date.*

**Three controls, one question.** Today, Tomorrow and the picked date are
alternative answers, so they sit inside `data-answer-group`: answering any one
answers all three, and failing turns all three red under a **single** message. The
message belongs to the choice, so it comes from the group rather than from whichever
control happens to carry it — otherwise it would read *"Pick a date is required."*

**They clear each other.** Confirming a date unchecks the shortcuts; choosing a
shortcut empties the field. Two answers to one question is a state the screen can't
act on, so it is never reachable rather than resolved later.

**The dates are written at runtime.** "Today" is not something markup can state, so
journey.js fills both shortcuts and sets the picker's window: no earlier than today,
no later than 30 days out, **both ends inclusive**. Days outside it render disabled
and the month arrows stop at the edge, so there is no way to walk into an empty
month.

**The field carries a calendar**, `icons/calendar.svg` in Text Input's decorative
`.input__icon` slot — the affordance that says this field opens something rather
than takes typing.

### 4.17 Fixed term or flexible? — `policy-length.html`

- Heading: **Fixed term or flexible?**
- Sub-heading: **Choose your policy length. A full year, or month to month.**
- Two Product Cards, **12 months** selected by default:
  - **12 months** — *Best value if you're driving year-round.* · Pay monthly or
    annually · Cheaper than rolling 30-day cover · One year of cover, sorted
  - **30 days** — *Flexible cover when you need more freedom.* · No long-term
    commitment · Great for changing circumstances · A simple way to try Zego before
    you commit
- Action: **Continue**, with **You can always change this later.** beneath it

**The card is the answer, not the radio.** Each card is a `<label>`, so the whole
thing is the target and the radio in its corner only reports the state. The aqua
border follows the checked radio through `:has()` rather than a class someone has to
move — otherwise the border sits where the markup left it while the answer moves on.

**Side by side on desktop.** Two lengths are a comparison, and comparing means
reading them against each other rather than scrolling from one to the other. Equal
columns at the journey's 480px hinge, so neither looks like the default by being
wider; stacked below it.

**No white card wraps them.** Each Product Card brings its own surface, so the
`.proto__card` every other screen uses would be a box around boxes. They stack at
the same Spacer-20 / 24 rhythm questions inside a card use.

**The CTA note** is `.proto__cta`, built for the DVLA line on the licence screen and
parked when that moved. First real use.

### 4.18 Full protection or the essentials? — `cover-level.html`

- Heading: **Full protection or the essentials?**
- Sub-heading: **Choose your cover level. Protect your vehicle too, or just the
  legal minimum.**
- Two Product Cards, **Fully comprehensive** selected by default:
  - **Fully comprehensive** — *The widest level of protection for you and your
    vehicle.* · Covers damage to your own vehicle · Covers damage or injury caused
    to others · Includes fire and theft cover
  - **Third party only** — *The simplest cover to meet basic legal requirements.* ·
    Covers injury or damage caused to others · ✕ Vehicle repairs are not included
- Link: **Compare side by side**
- Action: **Continue**, with **You can always change this later.** beneath it

**The excluded bullet is new.** Third party is defined as much by what it leaves out
as by what it covers, so the card says so — `.product-card__benefit--excluded`, a
cross in `icon/glyph/primary` rather than the purple tick. Text colour, not red: it
is a fact about the option, not a fault, and a warning colour would read as "you
have chosen wrong".

**Compare opens a Modal**, not another page. The comparison is a reference for the
decision being made on this screen; sending someone away to read it loses the two
cards they are weighing. Nine rows, ticks and crosses in the same pair of tokens the
cards use, and the table scrolls inside the panel when the viewport is short. It is
a `<button>` styled as a link — it opens something, it doesn't navigate.

**Side by side on desktop**, same `.proto__options` grid as policy length, for the
same reason: two levels are a comparison.

### 4.19 Keep it simple, or get rewarded? — `policy-type.html`

- Heading: **Keep it simple, or get rewarded?**
- Sub-heading: **Choose your policy type. Rewards for good driving, or keep it
  simple.**
- Two Product Cards, **Sense** selected by default:
  - **Zego Sense** — *App-based telematics that rewards good driving.* · Up to £60
    in gift cards · Up to 25% off at renewal · Tips to help you drive better ·
    rewards banner reading **Drive well. Get rewards.**
  - **Zego Standard** — *Simple cover you can set and forget.* · No telematics, just
    drive · Manage it all in the Zego app
- Action: **Continue**, with **You can always change this later.** beneath it

**The card wears the product's own mark.** These two options are Zego products
rather than cover choices, so the top-left holds the `Zego Product` lockup —
`brand/zego-sense.svg` and `brand/zego-standard.svg` — instead of a glyph badge.
The lockup names the product, so neither card carries a title: the description
follows the top row directly. Both of those are new to Product Card
(`.product-card__lockup`, and a rule that drops the description's 4px when no title
sits above it) rather than to this page.

**The rewards banner is used for the first time here**, and it is a **Marketing
Banner** — 003 builds it by dropping one into the foot of the card and filling its
image slot with the three gift cards (`assets/rewards/`). It tints to
`surface/focus` when its card is the chosen one, which is what separates a chosen
card from a hovered one.

**Side by side on desktop**, the same `.proto__options` grid as policy length and
cover level. The cards stretch to equal height, so the banner sits at the foot of
the Sense card rather than floating mid-way.

### 4.20 Finding your best savings — `fetching-quote.html`

The wait between choosing a policy type and seeing the price. Two variants, picked
by what was chosen on the screen before:

- Spinner, then **Finding your best savings** on both
- **Sense** — **Good driving could unlock £60 in rewards**, the reward cards, then
  **and 25% off at renewal** and *With our annual Sense telematics policies.*
- **Standard** — **All included** and the everyday-driving illustration. Nothing to
  earn, so nothing to qualify.

**It is not a question, so it has none of a question's furniture** — no Back, no
Continue, no card. It leaves on its own after **eight seconds**, which is not a number
picked for feel: it is two round trips of the Sense fan, so the animation finishes
rather than being cut off mid-move. Standard waits the same, because the
quote being waited for is the same quote.

**And it is not a slot in the flow.** `data-flow-as="review-quote.html"` puts the stepper
where the quote sits, because the quote is what is being fetched. journey.js moves on
with `location.replace`, so the screen never enters browser history and never joins
the journey's own trail — which is what makes **Back from the quote land on the
policy type question** rather than on a screen with nothing to do. Both fall out of
the one decision not to enter history; neither needed special-casing.

**The variant comes from the answer, not the URL.** The policy-type radios carry
`data-journey-field="policy-type"`, and journey.js now records a radio that ships
*checked* on load as well as on change — otherwise a default answer nobody clicked
would never be stored, and this screen would guess.

**The block that doesn't apply is removed, not hidden.** A hidden block is one stray
rule away from showing both messages at once, and this screen exists to say one
thing.

**The Sense cards move.** Three gift cards start almost stacked, hold for a beat,
then fan apart — the animation 003 added to the frame, with its positions, easings and
timings taken from Figma's own keyframes — and then the same motion runs **backwards**
and walks them home. That out-and-back is one loop, and it makes **two** before the
screen leaves, settling on the pile it opened with. They are
built from parts (`.proto__fan`) rather than played as a picture, because the cards
overlap and the exported artwork carries an opaque panel-coloured background. A
by-product: the Sense illustration now follows the theme, where the flat PNG it
replaced could not. Anyone who has asked for less motion sees the piled-up
arrangement the screen opens on.

### 4.21 Charlotte, here's your quote — `review-quote.html`

- Heading: **Charlotte, here's your quote and cover details for** over the plate
- Two **Small Comparison Tiles**, Pay monthly selected:
  - **Pay monthly** — Today £500 · Then 11 monthly repayments £216 · **Total £2,876**,
    tagged *Spread the cost* and *19.9% APR*
  - **Pay upfront** — One payment, today · **Total £2,872**, tagged *Save £200*
- **Have a promo code?** — a collapsed Discount Code
- **Your cover summary** — a Detail Card of four rows, each with a **Change** link:
  Policy type *Sense* · Cover level *Fully comprehensive* · Cover length *12 months* ·
  Cover start date *30 / 07 / 2026*
- An information Alert: **You can add extra protection to tailor your cover on the
  next page.**
- Action: **Continue**

**Two up on desktop, like every other pair on the journey.** The payment tiles share
`.proto__options` with policy length, cover level and policy type, so they sit in equal
columns and each fills its own — the amounts are there to be weighed against each
other. The Change dialogues do the same: their two cards go side by side at 768px.
`.proto__options` normally switches on a **container** query, and a modal is mounted on
`<body>` — outside `.proto`, with no container to query — so the modal rule uses a
viewport query instead. A dialogue is only ever as wide as the screen allows, so there
is no narrow-container case for it to protect against.

**The summary is the journey reading itself back.** Each row is a question already
answered, so it takes `display-row--stacked` — the question in plain weight, the answer
bold underneath — and its Change link reopens that question in a **Modal** rather than
walking back through the flow. Each dialogue holds the question's own cards and a
running total, and Done writes the answer back into the row that opened it — so the
summary can't end up disagreeing with the dialogue that set it.

**An applied promo code can't be folded away.** While a code is on the price the
collapse disappears; it returns after Remove, with the field open for another try.

**The link's word follows the dialogue.** A row says **Change** where its question has
alternatives and **Learn more** where it has only one — a dialogue with nothing to
switch to can only explain the option it shows. journey.js reads that off the number of
options rather than the page declaring it, so the one-option variant needs one fewer
card and no new labels. The start date is always Change; a calendar has no
single-option form.

🔶 **There is a one-option variant of this screen** for products or premiums where
monthly can't be offered — see KNOWN-ISSUES 2.17. It doesn't apply here: this journey
is private hire, which sells both 12-month and 30-day cover.

### 4.22 Placeholders

🔶 **`quote.html`** is out of the flow — `review-quote.html` replaced it. The file is
still on disk; delete it once nothing is bookmarked against it.

🔶 **`payment.html`** — "Payment" / "Your policy starts as soon as this is
confirmed." / "Pay & get covered"

🔶 **Every validation message.** None of the error copy is in the Figma frames —
the Messages rows are hidden on those instances — so all of it is mine. The
strings are listed in `KNOWN-ISSUES.md` (3.7, and the field-specific ones in 1.9
and 3.8). They are the highest-value thing to get reviewed, since they are what a
user reads at the moment something has gone wrong.

---

## 5. Behaviour

### 5.1 Continue is gated

**Every input and selector on a screen must be answered before Continue does
anything.** One rule, applied journey-wide, so a new screen inherits it by
existing rather than by wiring anything up.

- **Nothing is flagged before the first Continue.** A screen you have just opened
  should not be covered in red.
- Once flagged, a control **clears itself the moment it is answered** — the error
  should not sit there while someone is plainly fixing it.
- Each control reports through **its own component's error state**, so an error
  looks the way that component's Figma variant does rather than inventing a
  journey style.
- **The first blocked control takes focus** and scrolls into view. Errors are not
  announced individually — several appearing at once would talk over each other,
  so the focused control is read out with its message instead.
- **A populated-but-invalid field still blocks.** A field can be filled in and
  still wrong; Continue must not step over a message that is already on screen.
- **Back never validates.** Leaving is always allowed.

Copy defaults to something derived from the label, and `data-required-error` on a
control overrides it where a screen needs to be specific.

### 5.2 Field rules

**A date is bounded by the question that asks for it.** A screen asking about the
last 3 years refuses a date outside that window, not merely one in the future —
`data-date-within="3"` on the field, which is both bounds at once. Convictions asks
about 5 years and now says so; before this it only refused the future, so a
conviction from 1998 would have been accepted by a question that didn't ask about it.

**Every error message ends in a full stop.** All 25 across the journey do; the two
on the taxi licence screen were the only exceptions and have been brought into line
(the frames write them without one — worth correcting in Figma). A message is a
sentence, and a set of them stacked down a form reads as a list of fragments
otherwise.

| Field | Rule |
|---|---|
| Registration | Seven letters and digits — the UK plate format. Spaces and punctuation don't count. A tick appears live on the character that completes it; a wrong length surfaces an error on blur or on Continue, never mid-typing. |
| Date of birth | Day, month and year. A day outside 01–31 or a month outside 01–12 cannot be typed; a date after today is refused. There is no real-calendar check, so 31/02 passes. |
| Purchase date | Two-digit month, four-digit year. A month outside 01–12 cannot be typed. A date after the current month is refused once both parts are complete. |
| Email | Required, and format-checked on blur: something before an @, something after, a dot in the tail. Deliberately loose — anything stricter starts rejecting addresses that work. |
| Mobile number | Required. The dialling code is its own value, defaulting to +44. |
| Marketing opt-ins | **Never required.** They carry no `.input`, so the gate leaves them alone — which is the point: a consent that blocks the journey isn't a consent. |
| Optional input | The dismissal checkbox is a valid answer — ticking it satisfies the field. Its value is kept when the box is ticked, so an accidental tick doesn't destroy what was typed. |

The intent behind the timing: **confirm live, complain late.** Positive feedback
lands on the keystroke that earns it; a complaint waits until you have left the
field or asked to move on.

### 5.3 Yes/No questions

**Yes always comes first, No last.** One order across the journey, so the answer
in a given position never changes meaning from one screen to the next — which
matters most on the screens where one of the answers ends the journey.

That is independent of which answer does something: on the driving-history page
Yes is the one that declines, and on the legal-owner and UK-residency questions
it's No that opens a follow-up. The position is fixed; the consequence isn't.

### 5.4 Conditional questions

An answer can reveal a follow-up. The panel is a Conditional Selector: the
question, then a tinted panel (`Spacer-16` padding, `Radius-8`, `Spacer-12` below
the options) holding any input.

- The follow-up is **only required while it is visible**.
- Hiding it **keeps its value** but **clears its error** — flipping to the other
  answer and back should not wipe what was chosen, and a hidden field complaining
  about itself is nonsense.
- The triggering answer is marked in the markup (`data-reveals`) rather than
  matched by value, so the two cannot drift apart when the option copy changes.
- **Two arrangements.** Horizontal: the panel follows the whole question. Vertical
  (`.choice-selector--vertical`): options stack full width and the panel sits
  *inside* the list, directly under the option that revealed it and closer to it
  than the options are to each other. A follow-up in either arrangement is its
  own question — picking the option that reveals it does not answer it.

### 5.5 Address lookup

A UK address is captured in three stages, only one on screen at a time: **search**
(a postcode field), **chosen** (the address read back with an Edit action), and
**manual** (line 1, line 2, city, postcode with Save address). Choosing a result
or saving the manual form lands on *chosen*; Edit reopens *manual* **pre-filled**
from what was chosen, because being sent back to four empty fields after picking
an address is worse than not offering Edit at all.

**Searching is faked.** There is no address service, so a search builds four
plausible addresses from whatever postcode was typed — the flow can be exercised
with any input, which is what a prototype needs. Typing a complete postcode is
enough to offer results; the glyph and Enter also work.

The address answers as **one field**, not four: the chosen value goes into a
hidden input, so the required-field gate sees a single answered control however
the address was arrived at. A typed postcode with nothing chosen does **not**
count as answered.

### 5.6 Kickouts

An answer can send Continue somewhere other than the flow's next page.
`data-goes-to` on that answer names the page. One idea covers two cases: a
**branch** routes to another page of the journey, a **kickout** routes to a
screen that marks itself `data-exit` and so sits outside the flow. Only answers
**on screen** are considered, so a follow-up left checked before it was hidden
can't hijack the route — pick UK licence, answer the Northern Ireland question,
then switch to EU, and you still land on the EU page. Six answers carry one today. Four go to `quote-declined.html`: **Yes** to a modified vehicle, and **Yes** to any of the
three questions on the driving-history page — that page only continues when all
three are answered No. The other two are the licence branch: **No** to Northern
Ireland goes to `uk-licence.html`, **EU licence** goes to `eu-licence.html`. Each answer carries its own
attribute rather than the page holding a rule, so a question can be taken out of
the decline set by deleting one attribute.

The screen it lands on marks itself `data-exit`, which keeps it out of the flow:
no Back control, no Next wiring, and **no stepper** — the journey has stopped, so
a part-filled bar would be reporting on something that is no longer happening.
The Figma kickout frames draw the bar off, which is what dropping the slot does.

Currently the gate runs before the divert, so a screen must be complete before a
disqualifying answer takes effect. That is consistent with §5.1 but is an open
product question — see `KNOWN-ISSUES.md`.

### 5.7 Answers carry between screens

Screens are separate documents, so anything typed on one and shown on another
goes through `sessionStorage` — which lasts the tab and no longer, the right
lifetime for a prototype, and survives a refresh.

```html
<input data-journey-field="reg">                          <!-- saves as you type -->
<span data-journey-value="reg" data-journey-format="plate">SH48 HSA</span>
```

Values are stored **exactly as typed** and formatted on the way out. The markup
keeps a sensible default and is only overwritten when something was actually
captured, so a screen opened on its own still reads properly.

---

## 6. Adding to the journey

- **A page** — create the file with a `<main class="proto" data-step="…">`, link
  `kit.css` + `journey.css` + `journey.js`, and add its filename to the right
  step's `pages` array. If it is an alternative to an existing page rather than a
  page after it, nest the two in an array so they share a slot.
- **A question** — use the Multiple Choice Selector or a Text Input inside an
  `.input-group`. It becomes required automatically; nothing else to wire.
- **A follow-up** — wrap the question in a Conditional Selector and mark the
  triggering answer `data-reveals`.
- **A kickout** — put `data-exit-to="somewhere.html"` on the disqualifying
  answer and `data-exit` on the screen it lands on.
- **A value shown later** — `data-journey-field` where it's typed,
  `data-journey-value` where it's shown.

**Components come from the design system.** The journey composes 003 components
and adds no visual language of its own; `.proto__*` classes are scaffolding —
canvas, spacing, the intro stack — not component styling. Where the journey has
needed something 003 doesn't have yet, it was added to the relevant DS component
rather than to the journey, so the next consumer gets it too: the segmented
MM / YYYY date entry and the Select both live in Text Input, and the Conditional
Selector is its own component. Each of those is flagged in `KNOWN-ISSUES.md`
where it needs authoring in Figma.

---

## 7. Development affordances

Two things on these pages are **not** part of the journey and should come out
before anything is shared outside the team:

- the floating Light/Dark and Desktop/Mobile toggle (`showcase-controls`)
- the dashed `.proto__todo` drop zones on the unbuilt screens

The Mobile toggle reframes the layout but not the type scale, because tokens
resolve on viewport width while layout follows the container. On a real mobile
viewport both are correct.
