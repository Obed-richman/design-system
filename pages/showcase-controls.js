/*
 * ============================================================
 * SHOWCASE CONTROLS — theme + viewport toggles
 * ============================================================
 * Injects a floating toolbar into component showcase pages:
 *   - Theme: Light | Dark  → sets [data-theme] on <html>
 *   - Viewport: Desktop | Mobile → sets [data-viewport] on <html>
 *     (only shown when <html> or <body> has the data-sc-viewport attribute)
 *
 * Include once per page:  <script src="../../pages/showcase-controls.js" defer></script>
 * ============================================================
 */
(function () {
  var SUN = '<span class="sc-seg__icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/></g></svg></span>';
  var MOON = '<span class="sc-seg__icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.5A8 8 0 019.5 4a7 7 0 108.5 10.5 8 8 0 002 0z" fill="currentColor"/></svg></span>';
  var DESKTOP = '<span class="sc-seg__icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="4" width="19" height="12.5" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 20h6M12 16.5V20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>';
  var MOBILE = '<span class="sc-seg__icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" stroke="currentColor" stroke-width="2"/><path d="M11 18.5h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>';

  function seg(group, options) {
    var html = '<div class="sc-seg" role="group" aria-label="' + group + '">';
    options.forEach(function (o, i) {
      html += '<button type="button" class="sc-seg__btn" data-sc-group="' + group + '" data-sc-value="' + o.value + '"'
        + ' aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' + o.icon + o.label + '</button>';
    });
    return html + '</div>';
  }

  function build() {
    var root = document.documentElement;
    var wantsViewport = root.hasAttribute('data-sc-viewport') ||
      (document.body && document.body.hasAttribute('data-sc-viewport'));

    var bar = document.createElement('div');
    bar.className = 'sc-controls';
    var html = seg('theme', [
      { value: 'light', label: 'Light', icon: SUN },
      { value: 'dark', label: 'Dark', icon: MOON }
    ]);
    if (wantsViewport) {
      html += seg('viewport', [
        { value: 'desktop', label: 'Desktop', icon: DESKTOP },
        { value: 'mobile', label: 'Mobile', icon: MOBILE }
      ]);
    }
    bar.innerHTML = html;
    document.body.appendChild(bar);

    // defaults
    root.setAttribute('data-theme', 'light');
    if (wantsViewport) root.setAttribute('data-viewport', 'desktop');

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.sc-seg__btn');
      if (!btn) return;
      var group = btn.getAttribute('data-sc-group');
      var value = btn.getAttribute('data-sc-value');
      root.setAttribute(group === 'theme' ? 'data-theme' : 'data-viewport', value);
      bar.querySelectorAll('[data-sc-group="' + group + '"]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
