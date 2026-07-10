import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Vehicle Registration
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57555-27889
 *
 * UK number-plate input. "State" maps to the field modifier; the country
 * badge (UK flag + GB + chevron) and the UKNumberPlate input are always
 * present. The label/message rows are optional content.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=57555-27889",
  {
    props: {
      state: figma.enum("State", {
        Default: "",
        Placeholder: "",
        Hover: " veh-reg__field--hover",
        Focus: " veh-reg__field--focused",
        Error: " veh-reg__field--error",
        Disabled: " veh-reg__field--disabled",
      }),
    },
    example: ({ state }) =>
      html`<div class="veh-reg">
  <div class="veh-reg__field${state}">
    <span class="veh-reg__country">
      <span class="veh-reg__flag"><!-- UK flag svg --></span>
      <span class="veh-reg__gb">GB</span>
      <span class="veh-reg__chevron"><svg viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="2" fill="none" /></svg></span>
    </span>
    <input class="veh-reg__input" type="text" value="SH48 HSA" aria-label="Registration" />
  </div>
</div>`,
  }
);
