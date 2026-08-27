import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Header Controls
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59979-9819
 *
 * The top-of-page region: a Title bar (Back, Title, breadcrumb and action
 * Buttons) and the Control Set's Tabs control (each tab separated by a right
 * divider, last tab excepted). Composes Button and Control Set; the breadcrumb
 * is local to this component.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=59979-9819",
  {
    example: () =>
      html`<div class="header-controls">
  <div class="header-controls__title-bar">
    <div class="header-controls__title-left">
      <button class="btn btn--secondary btn--small btn--rounded" type="button"><!-- ← -->Back</button>
      <h1 class="header-controls__title">Title</h1>
      <nav class="header-controls__breadcrumb" aria-label="Breadcrumb">
        <a class="header-controls__crumb" href="#">Home</a>
        <a class="header-controls__crumb" href="#">Step</a>
        <span class="header-controls__crumb" aria-current="page">Step</span>
      </nav>
    </div>
    <div class="header-controls__title-actions">
      <button class="btn btn--secondary btn--small btn--rounded" type="button"><!-- + -->Button</button>
      <button class="btn btn--primary btn--small btn--rounded" type="button"><!-- + -->Button</button>
    </div>
  </div>
  <div class="control-set control-set--tabs">
    <div class="tabs" role="tablist" aria-label="Views"><!-- .tab-item × n --></div>
  </div>
</div>`,
  }
);
