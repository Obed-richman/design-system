import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Tier Card
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58313-27894
 *
 * A selectable coverage/pricing tier: blue header (name + price + select
 * button) over a feature list. "State" maps to the chosen modifier — Active
 * adds .tier-card--active (aqua border + focus-tinted body + "… selected"
 * button). Feature rows use a tick (included) or cross (not included) icon and
 * an optional trailing info icon.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=58313-27894",
  {
    props: {
      active: figma.enum("State", { Default: "", Active: " tier-card--active" }),
      name: figma.string("Tier name"),
    },
    example: ({ active, name }) =>
      html`<div class="tier-card${active}">
  <div class="tier-card__header">
    <p class="tier-card__title">${name}</p>
    <div class="tier-card__inner">
      <p class="tier-card__price">£71.45</p>
      <button class="tier-card__select" type="button" data-label="${name}">${name}</button>
    </div>
  </div>
  <div class="tier-card__features">
    <div class="tier-card__feature">
      <span class="tier-card__feature-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1Z" fill="#00E660"/><path d="M10.49 13.56l4.62-4.62a.4.4 0 0 1 .57 0l.71.71a.4.4 0 0 1 0 .57l-5.67 5.67a.4.4 0 0 1-.57 0l-2.54-2.54a.4.4 0 0 1 0-.57l.7-.7a.4.4 0 0 1 .57 0l1.61 1.48Z" fill="currentColor"/></svg></span>
      <span class="tier-card__feature-text">Included feature</span>
      <span class="tier-card__feature-info"><svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1ZM3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" fill="currentColor"/></svg></span>
    </div>
    <div class="tier-card__feature tier-card__feature--off">
      <span class="tier-card__feature-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#929195"/><path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></span>
      <span class="tier-card__feature-text">Excluded feature</span>
    </div>
  </div>
</div>`,
  }
);
