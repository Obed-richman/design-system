/*
 * Sales journey — shared chrome
 * ----------------------------------------------------------------
 * Every screen is a standalone page that declares which step it belongs to:
 *
 *   <main class="proto" data-step="vehicle"> … </main>
 *
 * On load this injects the Sales Navigation above it and the Sales Footer
 * below, so the screens themselves only contain their own content. Markup is
 * copied verbatim from the component demos — see components/sales-nav and
 * components/footer-sales.
 *
 * STEPS AND PAGES
 * A step is a segment of the stepper and can hold SEVERAL pages. Its track is
 * a progress bar for those pages: the fill shows how many of the step's pages
 * you have reached, including the one you're on. So Vehicle with two pages
 * fills to 50% on the first and 100% on the second, while earlier steps sit at
 * 100% and later ones at 0%.
 *
 * To add a page, drop its filename into the right step's `pages` array — the
 * stepper fill and the Back/Next wiring both follow from that one list.
 *
 * BRANCHES ARE ONE SLOT, NOT SEVERAL PAGES
 * Pages you see INSTEAD of each other go in a nested array:
 *
 *   pages: ['licence-type.html', ['uk-licence.html', 'eu-licence.html']]
 *
 * Both arms then occupy a single position in the flow. Continue from either one
 * goes to whatever follows the branch, Back from either returns to the question
 * that chose it, and the stepper counts the branch once — because a driver only
 * ever sees one of them, and a bar that counts a page nobody visits is lying.
 *
 * Listing alternatives as consecutive pages is what sent Continue on the UK
 * licence page into the EU one.
 *
 * CARRYING ANSWERS BETWEEN SCREENS
 * Screens are separate documents, so anything typed on one and shown on another
 * goes through sessionStorage — which lasts the tab and no longer, the right
 * lifetime for a prototype. Two attributes, no wiring per page:
 *
 *   <input data-journey-field="reg">            saves on every keystroke
 *   <span data-journey-value="reg">SH48 HSA</span>   is filled in on load
 *
 * Values are kept exactly as typed and formatted on the way out, so add
 * data-journey-format="plate" to group a registration the way a number plate
 * does. The markup keeps a sensible default and is only overwritten when
 * something was actually stored, so a screen opened on its own still reads.
 *
 * REQUIRED FIELDS
 * Continue only moves on when every input and selector on the screen has an
 * answer — one rule for the whole journey, so a screen gets this by existing
 * rather than by wiring anything up. Errors are rendered through each
 * component's own error state, so they look the way that component's Figma
 * variant does:
 *
 *   .choice-selector   one option picked  → .text-icon-item--error on the
 *                                           options, .choice-selector__message
 *   .optional-input    field filled, OR the escape checkbox ticked
 *   .input-group       every .input non-empty (so both halves of a date)
 *                                         → .input-field--error, .input-message
 *   .veh-reg           left to its own gate in vehicle-registration.js, which
 *                      runs in the capture phase and carries its own copy
 *
 * Nothing is flagged before the first Continue — a screen you have only just
 * opened shouldn't be covered in red. Once flagged, a control clears the moment
 * it is answered. A control also holds Continue back while its own component is
 * showing an error (a purchase date in the future, say): populated is not the
 * same as valid, and Continue shouldn't step over a message already on screen.
 *
 * Copy comes from data-required-error on the control when a screen wants
 * something specific; the defaults below are otherwise derived from the label.
 *
 * BRANCHING AND KICKOUTS
 * An answer can send Continue somewhere other than the next page in the flow.
 * Put data-goes-to on the input for that answer, naming the page:
 *
 *   <input class="radio__input" type="radio" name="licence"
 *          data-goes-to="eu-licence.html">
 *
 * That covers both cases with one idea. A **branch** routes to another page of
 * the journey; a **kickout** routes to a screen that marks itself data-exit and
 * so sits outside the flow. Nothing about the attribute changes between them —
 * only where it points.
 *
 * On Continue the gate runs first and then, if a picked answer carries a route,
 * the journey goes there rather than to the flow's next page. Gate first so the
 * rule that a screen must be complete before Continue does anything still holds.
 * Only answers on screen are considered, so a follow-up left checked before it
 * was hidden can't hijack the route.
 *
 * The landing screen marks itself with data-exit, which keeps it out of the
 * flow: no Back control (there is nowhere useful to go back to), no Next wiring,
 * and no stepper — the journey has stopped, so a part-filled bar would be
 * reporting on something that is no longer happening.
 */
(function () {
  var STEPS = [
    { id: 'vehicle', label: 'Vehicle', pages: ['index.html', 'vehicle-found.html', 'vehicle-details.html'] },
    /* The nested array is a BRANCH: alternative arms of the licence-type question.
       You see one arm or the other, never both. An arm can be a SEQUENCE — the EU
       arm runs to two pages, because a UK licence's convictions come back from the
       DVLA lookup and only an EU driver is asked for them. See FLOW below. */
    { id: 'driver',  label: 'Driver',  pages: ['driver-details.html', 'driver-history.html', 'contact-details.html', 'licence-type.html',
                                               ['uk-licence.html', ['eu-licence.html', 'driving-convictions.html']],
                                               'taxi-licence.html'] },
    { id: 'quote',   label: 'Quote',   pages: ['quote.html'] },
    { id: 'payment', label: 'Payment', pages: ['payment.html'] }
  ];

  /* icons/arrow-left.svg, for the shared Back control */
  var ARROW_LEFT = "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M13.1018 20.4098C13.2972 20.6049 13.2972 20.9213 13.1018 21.1164L12.3641 21.8532C12.1687 22.0483 11.8519 22.0483 11.6565 21.8532L2.19214 12.4013C2.1798 12.389 2.16824 12.3762 2.15746 12.3629L2.14656 12.3521C1.95117 12.1569 1.95117 11.8406 2.14656 11.6454L11.6585 2.14614C11.8539 1.951 12.1706 1.951 12.366 2.14614L13.1037 2.88286C13.2991 3.078 13.2991 3.39437 13.1037 3.5895L5.68394 10.9995L21.5002 10.9995C21.7764 10.9995 22.0002 11.2233 22.0002 11.4995V12.4995C22.0002 12.7756 21.7764 12.9995 21.5002 12.9995L5.68167 12.9995L13.1018 20.4098Z\" fill=\"currentColor\"/></svg>";

  /* Journey order as a list of SLOTS, for Back/Next. A slot is normally one page;
     a slot with several pages is a branch, and its pages are alternatives — you
     reach one of them by an answer carrying data-goes-to, and Continue from any
     of them lands on the slot AFTER the branch rather than on its sibling.

     Getting this wrong is what made Continue on the UK licence page walk into the
     EU one: as a flat list they looked like consecutive pages. */
  var FLOW = STEPS.reduce(function (all, s) {
    return all.concat(s.pages.map(function (slot) { return [].concat(slot); }));
  }, []);

  /* The page a slot leads with — the only arm the flow can pick on its own.
     Branches are entered by an answer, so this is a fallback, not the usual path. */
  function lead(slot) {
    var first = slot && slot[0];
    return Array.isArray(first) ? first[0] : first;
  }

  /* Every page a slot can show, arms flattened */
  function pagesIn(slot) {
    return [].concat.apply([], [].concat(slot).map(function (arm) { return [].concat(arm); }));
  }

  /* Which slot holds this page, in a step's own pages or across the whole flow */
  function slotIn(pages, file) {
    for (var i = 0; i < pages.length; i++) {
      if (pagesIn(pages[i]).indexOf(file) !== -1) return i;
    }
    return -1;
  }

  /* The arm this page sits in, if the arm is a sequence of more than one page.
     Returns null for an ordinary page, so callers fall through to slot stepping. */
  function armOf(slot, file) {
    var arms = [].concat(slot);
    for (var i = 0; i < arms.length; i++) {
      var arm = [].concat(arms[i]);
      if (arm.length > 1 && arm.indexOf(file) !== -1) return arm;
    }
    return null;
  }

  /* --- THE TRAIL ------------------------------------------------------------
     Which pages have actually been visited, so Back can retrace rather than
     guess. Needed because of branches: from the page AFTER a branch, the flow
     alone can only offer the arm it lists first, which would send an EU driver
     back into the UK licence page they never saw.

     Pushed on the way forward and popped on the way back, so it stays the length
     of the route rather than growing. sessionStorage, like every other
     cross-screen value here — the tab, and no longer. */
  var TRAIL = 'zego-journey-trail';

  function trail() {
    try { return JSON.parse(sessionStorage.getItem(TRAIL)) || []; } catch (e) { return []; }
  }
  function saveTrail(t) {
    try { sessionStorage.setItem(TRAIL, JSON.stringify(t)); } catch (e) {}
  }
  function here() { return location.pathname.split('/').pop() || 'index.html'; }

  /* One page forward or back. Inside a multi-page arm that means the next page of
     THAT arm; at either end of it — or on an ordinary page — it means the next
     slot. This is what keeps a driver on the arm their answer chose instead of
     stepping sideways into the other one.

     Going back out of a branch, the trail decides which arm — and it is only
     trusted when it names a page that really does sit in the slot behind, so a
     stale or hand-edited trail can't route somewhere absurd. */
  function step(at, forward) {
    var file = here();
    var arm  = armOf(FLOW[at.flow] || [], file);
    if (arm) {
      var i = arm.indexOf(file) + (forward ? 1 : -1);
      if (i >= 0 && i < arm.length) return arm[i];
      /* Off the end of the arm: leave the branch. */
    }

    var to = FLOW[at.flow + (forward ? 1 : -1)];
    if (!forward && to && to.length) {
      var t = trail();
      var was = t[t.length - 1];
      if (was && slotIn(FLOW, was) === at.flow - 1) return was;
    }
    return lead(to);
  }

  var NAV  = "<div class=\"sales-nav sales-nav--sticky\" data-expanded=\"false\">\n  <div class=\"sales-nav__header\">\n    <div class=\"sales-nav__brand\">\n      <span class=\"sales-nav__logo\"><svg viewBox=\"0 0 110 32\" fill=\"none\" role=\"img\" aria-label=\"Zego\"><path d=\"M22.1028 8.61685H2.3732C1.80867 8.61685 1.36296 8.18585 1.36296 7.63993V3.87587C1.36296 3.32995 1.80867 2.89895 2.3732 2.89895H22.1028C22.6673 2.89895 23.113 3.32995 23.113 3.87587V7.63993C23.113 8.18585 22.6375 8.61685 22.1028 8.61685ZM48.9931 28.1267V24.3626C48.9931 23.8167 48.5474 23.3857 47.9828 23.3857H28.7583C28.1938 23.3857 27.7481 23.8167 27.7481 24.3626V28.1267C27.7481 28.6726 28.1938 29.1037 28.7583 29.1037H47.9828C48.5474 29.1037 48.9931 28.6726 48.9931 28.1267ZM9.29637 23.3857L16.3085 15.8862C16.6651 15.5129 16.6651 14.9094 16.279 14.5359L13.5156 11.8637C13.0997 11.4614 12.446 11.4902 12.0597 11.8924L1.60067 23.0983C1.42239 23.2708 1.33325 23.5006 1.33325 23.7593V28.1267C1.33325 28.6726 1.77894 29.1037 2.3435 29.1037H22.073C22.6376 29.1037 23.0832 28.6726 23.0832 28.1267V24.3626C23.0832 23.8167 22.6376 23.3857 22.073 23.3857H9.29637ZM48.9931 7.63993V3.87587C48.9931 3.32995 48.5474 2.89895 47.9828 2.89895H28.7583C28.1938 2.89895 27.7481 3.32995 27.7481 3.87587V17.8688C27.7481 18.415 28.1938 18.8457 28.7583 18.8457H44.12C44.6846 18.8457 45.1303 18.415 45.1303 17.8688V14.1336C45.1303 13.5877 44.6846 13.1567 44.12 13.1567H33.6612V8.61685H47.9828C48.5474 8.61685 48.9931 8.18585 48.9931 7.63993ZM71.3374 22.0352L74.1006 24.7073C74.5165 25.1096 74.487 25.7706 74.0411 26.1439C68.4848 30.7126 60.076 30.3678 54.995 25.0521C50.1222 19.9952 50.1222 12.0361 54.995 6.95034C60.076 1.6347 68.4848 1.26118 74.0411 5.85847C74.487 6.232 74.5165 6.89285 74.1006 7.29513L71.3374 9.96731C70.9808 10.3121 70.3865 10.3408 70.0004 10.0535C66.7912 7.58246 62.0075 7.8698 59.1847 10.973C56.5698 13.8175 56.5698 18.185 59.1847 21.0296C62.0075 24.1326 66.7912 24.4488 70.0004 21.9491C70.4163 21.6616 70.9808 21.6903 71.3374 22.0352ZM107.171 16.0014C107.171 23.357 100.991 29.3334 93.3844 29.3334C85.7779 29.3334 79.5976 23.357 79.5976 16.0014C79.5976 8.64557 85.7779 2.66911 93.3844 2.66911C100.991 2.66911 107.171 8.64557 107.171 16.0014ZM101.258 16.0014C101.258 11.8062 97.7225 8.38698 93.3844 8.38698C89.0464 8.38698 85.5104 11.8062 85.5104 16.0014C85.5104 20.1962 89.0464 23.6155 93.3844 23.6155C97.7523 23.6155 101.258 20.1962 101.258 16.0014ZM76.6559 17.8688V14.1336C76.6559 13.5877 76.2102 13.1567 75.6457 13.1567H64.4439C63.8793 13.1567 63.4336 13.5877 63.4336 14.1336V17.8688C63.4336 18.415 63.8793 18.8457 64.4439 18.8457H75.6457C76.2102 18.8457 76.6559 18.415 76.6559 17.8688Z\" fill=\"currentColor\"/></svg></span>\n      <span class=\"sales-nav__lockup\">\n        <span class=\"trustpilot trustpilot--green trustpilot--16\" role=\"img\" aria-label=\"Rated 4.5 out of 5 on Trustpilot\">\n          <span class=\"trustpilot__star trustpilot__star--full\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n          <span class=\"trustpilot__star trustpilot__star--full\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n          <span class=\"trustpilot__star trustpilot__star--full\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n          <span class=\"trustpilot__star trustpilot__star--full\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n          <span class=\"trustpilot__star trustpilot__star--half\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n        </span>\n        <span class=\"sales-nav__lockup-text\">Trustpilot</span>\n      </span>\n    </div>\n    <button class=\"btn btn--tertiary btn--pill btn--small sales-nav__toggle\" type=\"button\" aria-expanded=\"false\">\n      <span class=\"sales-nav__help-label\">Help</span><span class=\"sales-nav__close-label\">Close</span>\n      <span class=\"btn__icon sales-nav__toggle-icon sales-nav__help-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 1.00213C12.0829 1.00071 12.1663 1 12.25 1V1.00856C19.0739 1.24348 23.1632 6.2782 22.7173 11.4488L22.717 11.4524L22.121 18.0894L22.1109 18.0885L22.0191 19.4055C21.8839 21.3447 20.4441 23.2081 18.3922 22.9828L18.2643 22.9687C18.2412 22.9661 18.2183 22.9634 18.1955 22.9603C18.1354 22.9859 18.0694 23 18 23H11.5C11.2239 23 11 22.7761 11 22.5V21.5C11 21.2239 11.2239 21 11.5 21H15.6833C15.357 20.3104 15.2076 19.516 15.2614 18.7435L15.481 15.5946C15.6162 13.6555 17.0557 11.7921 19.1075 12.0173L19.2359 12.0314C19.7546 12.0884 20.2154 12.2702 20.6111 12.542L20.7247 11.277L20.7248 11.2753C21.0646 7.32398 17.9135 3.11781 12 3.00243C6.08686 3.1178 2.93585 7.32341 3.27512 11.2745L3.27534 11.277L3.39097 12.5405C3.78621 12.2695 4.24632 12.0883 4.76405 12.0314L4.89249 12.0173C6.94429 11.7921 8.38377 13.6555 8.51899 15.5946L8.73855 18.7435C8.87341 20.6777 7.73363 22.7495 5.73571 22.9687L5.60777 22.9828C3.55592 23.2081 2.11615 21.3447 1.98094 19.4055L1.88057 17.966L1.87913 17.9661L1.2832 11.4541L1.28274 11.4488C0.836796 6.2782 4.92615 1.24348 11.75 1.00856V1C11.8337 1 11.9171 1.00071 12 1.00213ZM5.11081 14.0054L4.98246 14.0195C4.42095 14.0811 3.66749 14.8404 3.75653 16.1174L3.97609 19.2663C4.06477 20.5381 4.88124 21.0502 5.3887 20.9948L5.51713 20.9806C6.07852 20.9191 6.83244 20.1597 6.74339 18.8826L6.52383 15.7338C6.43514 14.4618 5.6183 13.9497 5.11081 14.0054ZM19.0175 14.0195L18.8892 14.0054C18.3817 13.9497 17.5649 14.4618 17.4762 15.7338L17.2566 18.8826C17.1676 20.1597 17.9215 20.9191 18.4829 20.9806L18.6113 20.9948C19.1188 21.0502 19.9352 20.5381 20.0239 19.2663L20.2435 16.1174C20.3325 14.8404 19.579 14.0811 19.0175 14.0195Z\" fill=\"currentColor\"/></svg></span>\n      <span class=\"btn__icon sales-nav__toggle-icon sales-nav__close-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M20.1036 3.10356C19.9083 2.90829 19.5917 2.90829 19.3964 3.10355L11.9142 10.5858L4.51777 3.18934C4.3225 2.99408 4.00592 2.99408 3.81066 3.18934L3.10355 3.89645C2.90829 4.09171 2.90829 4.40829 3.10355 4.60355L10.5 12L3.13299 19.367C2.93773 19.5623 2.93773 19.8789 3.13299 20.0741L3.8401 20.7812C4.03536 20.9765 4.35194 20.9765 4.5472 20.7812L11.9142 13.4142L19.367 20.867C19.5623 21.0623 19.8789 21.0623 20.0741 20.867L20.7812 20.1599C20.9765 19.9646 20.9765 19.6481 20.7812 19.4528L13.3284 12L20.8107 4.51777C21.0059 4.32251 21.0059 4.00592 20.8107 3.81066L20.1036 3.10356Z\" fill=\"currentColor\"/></svg></span>\n    </button>\n    <div class=\"sales-nav__panel\">\n      <div class=\"sales-nav__row sales-nav__row--hours\">\n        <div class=\"sales-nav__row-main\">\n          <span class=\"sales-nav__row-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4.76332 6.75375C4.60992 4.37529 6.15666 2.2192 8.45886 1.60233L11.0869 0.898135C12.6873 0.469309 14.3323 1.41906 14.7612 3.01945L15.7238 6.61195C16.0605 7.86875 15.1265 9.10742 13.8256 9.1293L11.8306 9.16286C11.6424 11.1035 12.1746 13.0709 13.3087 14.6669L15.0503 13.7001C16.1879 13.0686 17.6161 13.6743 17.9529 14.9311L18.9023 18.4743C19.3311 20.0747 18.3813 21.7197 16.7809 22.1485L14.1529 22.8527C11.8507 23.4696 9.43312 22.3757 8.37673 20.2392L7.52626 18.5191C6.0048 15.4421 5.10773 12.0942 4.88681 8.66859L4.76332 6.75375ZM8.97649 3.53418C7.59518 3.9043 6.66713 5.19795 6.75917 6.62503L6.88266 8.53988C7.08659 11.7019 7.91466 14.7923 9.31908 17.6327L10.1695 19.3527C10.8034 20.6346 12.2539 21.291 13.6352 20.9208L16.2633 20.2167C16.7968 20.0737 17.1134 19.5254 16.9704 18.9919L16.021 15.4487L13.6014 16.792C13.1392 17.0485 12.5728 16.9335 12.2419 16.5471C10.2503 14.2218 9.39184 11.0782 9.97084 8.06117C10.0681 7.55418 10.5075 7.18484 11.0237 7.17615L13.7919 7.12959L12.8293 3.53709C12.6864 3.00363 12.138 2.68704 11.6046 2.82999L8.97649 3.53418Z\" fill=\"currentColor\"/></svg></span>\n          <div class=\"sales-nav__row-text\">\n            <p class=\"sales-nav__row-title\">Call us</p>\n            <p class=\"sales-nav__row-subtitle\">+44 20 3308 9800</p>\n          </div>\n        </div>\n        <div class=\"sales-nav__hours\">\n          <p class=\"sales-nav__hours-title\">Opening hours</p>\n          <p class=\"sales-nav__hours-times\">Mon\u2013Wed &amp; Fri 9am\u20135pm&nbsp;&nbsp;\u00b7&nbsp;&nbsp;Thu 10am\u20135pm</p>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"sales-nav__steps\"></div>\n</div>";
  var FOOT = "<div class=\"footer-sales\">\n  <div class=\"footer-sales__brand\"><svg viewBox=\"0 0 1440 12\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><rect width=\"1440\" height=\"12\" fill=\"#FCFF5F\"/><rect x=\"993\" width=\"447\" height=\"12\" fill=\"#A458FF\"/><path d=\"M1391.6 -174.452L1178.29 -240.824L1076.94 -223.639L1132.33 102.974L1392.16 58.9151L1433.43 -100.257C1441.32 -132.162 1422.98 -164.687 1391.6 -174.452Z\" fill=\"#08F0F0\"/><path d=\"M1377.8 -122.036L1202.08 -249.653L939.376 -249.653L939.376 69.6525L1322.66 69.6524L1393.19 -40.6756C1410.4 -67.5947 1403.66 -103.262 1377.8 -122.036Z\" fill=\"#FCFF5F\"/></svg></div>\n  <div class=\"footer-sales__container\">\n    <div class=\"trustpilot-lockup\">\n      <span class=\"trustpilot-lockup__label\">Excellent</span>\n      <div class=\"trustpilot trustpilot--green trustpilot--24\" role=\"img\" aria-label=\"Rated 4.5 out of 5 on Trustpilot\">\n        <span class=\"trustpilot__star trustpilot__star--full\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n        <span class=\"trustpilot__star trustpilot__star--full\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n        <span class=\"trustpilot__star trustpilot__star--full\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n        <span class=\"trustpilot__star trustpilot__star--full\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n        <span class=\"trustpilot__star trustpilot__star--half\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z\" fill=\"currentColor\"/></svg></span>\n      </div>\n      <span class=\"trustpilot-lockup__text\">Trustpilot</span>\n    </div>\n\n    <hr class=\"divider\">\n\n    <div class=\"footer-sales__points\">\n      <div class=\"footer-sales__point\"><span class=\"footer-sales__point-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 1.00213C12.0829 1.00071 12.1663 1 12.25 1V1.00856C19.0739 1.24348 23.1632 6.2782 22.7173 11.4488L22.717 11.4524L22.121 18.0894L22.1109 18.0885L22.0191 19.4055C21.8839 21.3447 20.4441 23.2081 18.3922 22.9828L18.2643 22.9687C18.2412 22.9661 18.2183 22.9634 18.1955 22.9603C18.1354 22.9859 18.0694 23 18 23H11.5C11.2239 23 11 22.7761 11 22.5V21.5C11 21.2239 11.2239 21 11.5 21H15.6833C15.357 20.3104 15.2076 19.516 15.2614 18.7435L15.481 15.5946C15.6162 13.6555 17.0557 11.7921 19.1075 12.0173L19.2359 12.0314C19.7546 12.0884 20.2154 12.2702 20.6111 12.542L20.7247 11.277L20.7248 11.2753C21.0646 7.32398 17.9135 3.11781 12 3.00243C6.08686 3.1178 2.93585 7.32341 3.27512 11.2745L3.27534 11.277L3.39097 12.5405C3.78621 12.2695 4.24632 12.0883 4.76405 12.0314L4.89249 12.0173C6.94429 11.7921 8.38377 13.6555 8.51899 15.5946L8.73855 18.7435C8.87341 20.6777 7.73363 22.7495 5.73571 22.9687L5.60777 22.9828C3.55592 23.2081 2.11615 21.3447 1.98094 19.4055L1.88057 17.966L1.87913 17.9661L1.2832 11.4541L1.28274 11.4488C0.836796 6.2782 4.92615 1.24348 11.75 1.00856V1C11.8337 1 11.9171 1.00071 12 1.00213ZM5.11081 14.0054L4.98246 14.0195C4.42095 14.0811 3.66749 14.8404 3.75653 16.1174L3.97609 19.2663C4.06477 20.5381 4.88124 21.0502 5.3887 20.9948L5.51713 20.9806C6.07852 20.9191 6.83244 20.1597 6.74339 18.8826L6.52383 15.7338C6.43514 14.4618 5.6183 13.9497 5.11081 14.0054ZM19.0175 14.0195L18.8892 14.0054C18.3817 13.9497 17.5649 14.4618 17.4762 15.7338L17.2566 18.8826C17.1676 20.1597 17.9215 20.9191 18.4829 20.9806L18.6113 20.9948C19.1188 21.0502 19.9352 20.5381 20.0239 19.2663L20.2435 16.1174C20.3325 14.8404 19.579 14.0811 19.0175 14.0195Z\" fill=\"currentColor\"/></svg></span><span class=\"footer-sales__point-text\">UK based call centres</span></div>\n      <div class=\"footer-sales__point\"><span class=\"footer-sales__point-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M10.6354 12.0147L14.482 8.16781C14.6773 7.97255 14.9939 7.97255 15.1892 8.16781L15.8963 8.87491C16.0915 9.07018 16.0915 9.38676 15.8963 9.58202L11 14.4785C10.8048 14.6738 10.4882 14.6738 10.2929 14.4785L8.1465 12.3321C7.95124 12.1368 7.95124 11.8202 8.14651 11.625L8.84249 10.929C9.03776 10.7337 9.35434 10.7337 9.5496 10.929L10.6354 12.0147Z\" fill=\"currentColor\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M2 2.99897C2 1.89305 2.89678 1 4 1H20C21.1045 1 22 1.89534 22 2.99996V12.7895C22 15.3454 20.7345 17.4269 19.2106 19.0042C17.6877 20.5805 15.8339 21.7325 14.4619 22.458C12.9168 23.275 11.0917 23.2884 9.53602 22.483C8.16157 21.7715 6.30705 20.6355 4.78405 19.0586C3.25768 17.4782 2 15.3843 2 12.7895V2.99897ZM4 3V12.7895C4 14.692 4.91414 16.3144 6.22263 17.6692C7.53447 19.0274 9.17783 20.0455 10.4555 20.7069C11.4256 21.2091 12.5578 21.2024 13.527 20.6899C14.8063 20.0135 16.4552 18.9778 17.7723 17.6146C19.0883 16.2524 20 14.6426 20 12.7895V3H4Z\" fill=\"currentColor\"/></svg></span><span class=\"footer-sales__point-text\">FCA regulated</span></div>\n      <div class=\"footer-sales__point\"><span class=\"footer-sales__point-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M14.3423 9.68242C14.1473 9.87913 13.8296 9.87983 13.6337 9.68396L12.9281 8.9784C12.7329 8.78314 12.7329 8.46655 12.9281 8.27129L14.6984 6.50099L9 6.50099C7.34315 6.50099 6 7.84413 6 9.50099L6 13.5064C6 13.7825 5.77614 14.0064 5.5 14.0064L4.5 14.0064C4.22386 14.0064 4 13.7825 4 13.5064L4 9.50099C4.00001 6.73956 6.23858 4.50099 9 4.50099L14.6615 4.50099L12.9281 2.76761C12.7329 2.57235 12.7329 2.25577 12.9281 2.06051L13.6337 1.35494C13.8296 1.15908 14.1473 1.15977 14.3423 1.35649L18.4692 5.51945L14.3423 9.68242Z\" fill=\"currentColor\"/><path d=\"M19.5 10.0057C19.7761 10.0057 20 10.2295 20 10.5057L20 14.4803C20 17.2417 17.7614 19.4803 15 19.4803L9.37921 19.4803L11.1311 21.2321C11.3263 21.4274 11.3263 21.744 11.1311 21.9392L10.4255 22.6448C10.2296 22.8407 9.91187 22.84 9.71686 22.6433L5.59001 18.4803L9.71686 14.3173C9.91187 14.1206 10.2296 14.1199 10.4255 14.3158L11.1311 15.0213C11.3263 15.2166 11.3263 15.5332 11.1311 15.7285L9.37924 17.4803L15 17.4803C16.6568 17.4803 18 16.1371 18 14.4803L18 10.5057C18 10.2295 18.2239 10.0057 18.5 10.0057L19.5 10.0057Z\" fill=\"currentColor\"/></svg></span><span class=\"footer-sales__point-text\">24/7 claims support</span></div>\n      <div class=\"footer-sales__point\"><span class=\"footer-sales__point-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 17C11.1716 17 10.5 16.3284 10.5 15.5C10.5 14.6716 11.1716 14 12 14C12.8284 14 13.5 14.6716 13.5 15.5C13.5 16.3284 12.8284 17 12 17Z\" fill=\"currentColor\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 3C10.3431 3 9 4.34315 9 6V8H7V6C7 3.23858 9.23858 1 12 1C14.7614 1 17 3.23858 17 6V8H15V6C15 4.34315 13.6569 3 12 3Z\" fill=\"currentColor\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4 10C4 8.89543 4.89543 8 6 8H18C19.1046 8 20 8.89543 20 10V18C20 20.7614 17.7614 23 15 23H9C6.23858 23 4 20.7614 4 18V10ZM18 10H6V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10Z\" fill=\"currentColor\"/></svg></span><span class=\"footer-sales__point-text\">Secure checkout</span></div>\n    </div>\n\n    <hr class=\"divider\">\n\n    <p class=\"footer-sales__legal\">Zego is a trading name of Extracover Limited, which is authorised and regulated by the Financial Conduct Authority. (FRN: 757871). Extracover Limited is registered in England and Wales, No 10128841. Registered address: Second Floor, 30-40 Eastcheap, London EC3M 1HD.</p>\n  </div>\n</div>";

  function stepper(stepIndex, pageIndex) {
    var inner = STEPS.map(function (s, i) {
      var mod = '', style = '';
      if (i < stepIndex) {
        mod = ' onboarding-steps__step--complete';           /* track full */
      } else if (i === stepIndex) {
        mod = ' onboarding-steps__step--current';
        /* Part-fill the track to show progress through this step's pages.
           --onb-fill is the Onboarding Steps component's own knob, so this
           overrides its default half-fill without touching its CSS.
           Only for multi-page steps: a single-page step keeps the component's
           in-progress 50%, because filling it to 100% would make the step you
           are ON look identical to the ones you have finished. */
        if (s.pages.length > 1) {
          var pct = (pageIndex + 1) / s.pages.length * 100;
          style = ' style="--onb-fill: ' + (Math.round(pct * 100) / 100) + '%"';
        }
      }
      return '<div class="onboarding-steps__step' + mod + '"' + style + '>'
           + '<span class="onboarding-steps__label">' + s.label + '</span>'
           + '<span class="onboarding-steps__track"><span class="onboarding-steps__fill"></span></span>'
           + '</div>';
    }).join('');
    return '<div class="onboarding-steps">' + inner + '</div>';
  }

  /* --- answers carried between screens (see the header) --- */

  var STORE = 'zego-sales-journey';

  function answers() {
    try { return JSON.parse(sessionStorage.getItem(STORE)) || {}; }
    catch (e) { return {}; }                  /* storage blocked → defaults */
  }

  function remember(key, value) {
    try {
      var all = answers();
      all[key] = value;
      sessionStorage.setItem(STORE, JSON.stringify(all));
    } catch (e) { /* ignore — the next screen just shows its default */ }
  }

  var FORMAT = {
    /* UK plate: AA00 AAA, so a space after the 4th character. Only for a
       7-character registration — any other length has no grouping we can
       assume, so it's shown as typed. */
    plate: function (value) {
      var chars = (String(value).match(/[a-z0-9]/gi) || []).join('').toUpperCase();
      return chars.length === 7 ? chars.slice(0, 4) + ' ' + chars.slice(4) : chars;
    }
  };


  /* --- required fields (see the header) --- */

  var ERROR = 'journey-error';        /* marks the messages this file owns */
  var errorSeq = 0;

  function kindOf(el) {
    if (el.classList.contains('choice-selector')) return 'selector';
    if (el.classList.contains('optional-input'))  return 'optional';
    return 'field';
  }

  /* Every control on the screen, outermost first so a wrapper claims the fields
     inside it — an Optional Input owns its .input-group and its checkbox.

     Anything not currently rendered is skipped, which is what lets a Conditional
     Selector work: its follow-up is only required while the panel is open. The
     test is getClientRects() rather than the hidden attribute, so a control
     inside any collapsed ancestor is covered however it was closed. */
  function controls(main) {
    var found = [];
    main.querySelectorAll('.choice-selector, .optional-input, .input-group').forEach(function (el) {
      if (!el.getClientRects().length) return;
      if (!claimedBy(found, el)) found.push(el);
    });
    return found;
  }

  /* A revealed follow-up is its own question even when it sits *inside* the
     control that revealed it — which is how the vertical conditional selector is
     built, with the panel in the option list under the option it belongs to. So
     a conditional panel is a boundary: an ancestor on the far side of one has no
     claim on what's inside it. Without this, picking "UK licence" would count as
     answering the Northern Ireland question nested beneath it. */
  function claimedBy(found, el) {
    var panel = el.closest('.conditional-selector__panel');
    return found.some(function (f) {
      if (!f.contains(el)) return false;
      return !(panel && f.contains(panel) && !panel.contains(f));
    });
  }

  /* The inputs that count towards a control being answered: the ones on screen,
     plus any hidden-type input, which is how a multi-stage control (the address
     lookup) carries its one real answer. Without the rendered test, the address's
     off-screen manual fields would keep the control looking unanswered however it
     was filled in. */
  function inputs(el) {
    return Array.prototype.filter.call(el.querySelectorAll('.input'), function (i) {
      return i.type === 'hidden' || i.getClientRects().length;
    });
  }

  /* An error message the component itself put up, as opposed to one of ours */
  function ownError(el) {
    return el.querySelector('.input-message--error:not(.' + ERROR + ')');
  }

  function answered(el) {
    if (kindOf(el) === 'selector') {
      /* ...and for the same reason, a radio inside a nested follow-up doesn't
         answer the question that revealed it */
      var picked = el.querySelectorAll('input[type="radio"]:checked');
      return Array.prototype.some.call(picked, function (radio) {
        var panel = radio.closest('.conditional-selector__panel');
        return !(panel && el.contains(panel) && !panel.contains(el));
      });
    }
    /* the Optional Input's whole point: ticking the box is a valid answer */
    if (kindOf(el) === 'optional' && el.querySelector('.checkbox__input:checked')) return true;

    var all = inputs(el);
    if (!all.length) return true;
    return Array.prototype.every.call(all, function (i) {
      return i.disabled || i.value.trim() !== '';
    });
  }

  function complaint(el) {
    if (el.dataset.requiredError) return el.dataset.requiredError;
    /* Figma's Driver details error state gives the approved wording */
    if (kindOf(el) === 'selector') return 'Select an option.';

    var all  = Array.prototype.slice.call(inputs(el));
    var part = all.some(function (i) { return i.value.trim() !== ''; });

    if (all.length > 1) {            /* segmented — say which bit is missing */
      if (part) return 'Enter both the month and the year.';
      return kindOf(el) === 'optional'
        ? 'Enter a date, or tick the box below.'
        : 'Complete every part of this field.';
    }

    var label = el.querySelector('.input-label');
    var text  = label ? label.textContent.trim() : '';

    /* "<label> is required." only reads properly for a noun. A label that is a
       question — "Who is the legal owner?" — would come out as "Who is the legal
       owner is required.", so those get a generic line instead. Either way
       data-required-error overrides it with something specific. */
    if (!text) return 'This field is required.';
    if (/\?$/.test(text)) return 'Answer this to continue.';
    return text.replace(/\s*:\s*$/, '') + ' is required.';
  }

  /* One message per control, reused so repeated Continues don't stack them up.
     No role="alert" — several appearing at once would talk over each other, so
     the first offender takes focus instead and is read out with its message. */
  function say(host, classes, text, describes) {
    var msg = host.querySelector('.' + ERROR);
    if (!msg) {
      msg = document.createElement('p');
      msg.className = ERROR + ' ' + classes;
      msg.id = 'journey-error-' + (++errorSeq);
      host.appendChild(msg);
    }
    msg.textContent = text;
    Array.prototype.forEach.call(describes, function (i) {
      i.setAttribute('aria-invalid', 'true');
      i.setAttribute('aria-describedby', msg.id);
    });
  }

  function flag(el) {
    el.setAttribute('data-journey-invalid', '');
    var text = complaint(el);

    if (kindOf(el) === 'selector') {
      el.querySelectorAll('.text-icon-item').forEach(function (option) {
        option.classList.add('text-icon-item--error');
      });
      say(el, 'choice-selector__message choice-selector__message--error',
          text, el.querySelectorAll('.radio__input'));
      return;
    }

    var group = el.classList.contains('input-group') ? el : el.querySelector('.input-group');
    var field = el.querySelector('.input-field');
    if (field) field.classList.add('input-field--error');
    say(group || el, 'input-message input-message--error', text, inputs(el));
  }

  /* Only ever undoes what flag() did — hence the marker attribute. And it
     leaves the red border alone while the component has its own error showing,
     so clearing "required" can't strip the styling off "in the future". */
  function unflag(el) {
    if (!el.hasAttribute('data-journey-invalid')) return;
    el.removeAttribute('data-journey-invalid');

    var msg = el.querySelector('.' + ERROR);
    if (msg) msg.remove();

    el.querySelectorAll('.text-icon-item--error').forEach(function (option) {
      option.classList.remove('text-icon-item--error');
    });

    if (ownError(el)) return;

    var field = el.querySelector('.input-field');
    if (field) field.classList.remove('input-field--error');
    el.querySelectorAll('[aria-invalid]').forEach(function (i) {
      i.removeAttribute('aria-invalid');
      i.removeAttribute('aria-describedby');
    });
  }

  /* The page a picked answer routes to, if any (see BRANCHING in the header).
     Only answers that are actually on screen count: a hidden follow-up may still
     be checked from before — pick UK licence, answer the Northern Ireland
     question, then switch to EU, and that stale answer would otherwise win. */
  function goesTo(main) {
    var picked = main.querySelectorAll('[data-goes-to]:checked');
    for (var i = 0; i < picked.length; i++) {
      if (picked[i].closest('[hidden]')) continue;
      var host = picked[i].closest('label') || picked[i];
      if (!host.getClientRects().length) continue;
      return picked[i].getAttribute('data-goes-to');
    }
    return null;
  }

  /* True when the screen may move on */
  function gate(main) {
    var first = null;

    controls(main).forEach(function (el) {
      var blocked;
      if (answered(el)) {
        unflag(el);
        blocked = !!ownError(el);      /* populated, but the component objects */
      } else {
        flag(el);
        blocked = true;
      }
      if (blocked && !first) first = el;
    });

    if (!first) return true;

    var focusable = first.querySelector('.input:not([disabled]), .radio__input');
    if (focusable) focusable.focus({ preventScroll: true });
    first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }



  /* --- DVLA licence number --- */

  /* A GB licence number encodes the holder's details, so the first five
     characters — the surname, padded to five with 9s — are known once the driver
     screen is done, and the same structure lets the number be CHECKED against
     the details, which is what a DVLA lookup does.

     Only titles that identify the holder get the head start: Mr, Mrs, Miss and
     Ms. Mx and Dr say nothing about sex, and sex drives positions 7–8, so those
     start from an empty field rather than being given a prefix we can't carry on
     from with any confidence.

         1–5    surname, padded to five with 9s
         6      the decade digit of the birth year          (1986 -> 8)
         7–8    birth month, +50 for female holders
         9–10   day of the month
         11      the year digit                              (1986 -> 6)
         12–13  first initial of the first two forenames, 9 if there is no second
         14–16  an arbitrary digit and two check digits — not derivable, so never
                filled in

     Only positions 1–5 are compared, for the same reason. */
  function dvlaNumber(a, length) {
    var surname = (a.surname || '').toUpperCase().replace(/[^A-Z]/g, '');
    var out = (surname.slice(0, 5) + '99999').slice(0, 5);
    if (length <= 5) return out.slice(0, length);

    var year = (a['dob-year'] || '').replace(/\D/g, '');
    if (year.length !== 4) return out;
    out += year.charAt(2);                          /* 6: decade digit */
    if (length <= 6) return out.slice(0, length);

    var month = +(a['dob-month'] || 0), day = +(a['dob-day'] || 0);
    if (!month || !day) return out;
    var female = /^(mrs|miss|ms)$/i.test((a.title || '').trim());
    out += String(month + (female ? 50 : 0)).padStart(2, '0');   /* 7-8 */
    out += String(day).padStart(2, '0');                          /* 9-10 */
    out += year.charAt(3);                                        /* 11 */

    var first = (a['first-names'] || '').toUpperCase().split(/\s+/).filter(Boolean);
    out += (first[0] || '9').charAt(0);                            /* 12 */
    out += (first[1] ? first[1].charAt(0) : '9');                  /* 13 */
    return out.slice(0, length);
  }



  /* Titles we are willing to pre-fill from. Positions 1–5 are the surname
     whatever the title, but Mx and Dr leave the rest of the number unknowable,
     so they are left to type the lot. */
  var PREFILL_TITLES = /^(mr|mrs|miss|ms)$/i;

  /* --- DVLA lookup --- */

  /* A part-typed number is a lookup that CANNOT run, as against one that runs
     and disagrees, so it is caught first and reported the same way — at screen
     level. DVLA matches on all 16 characters; five of them are not a licence.

     Empty is left to the gate. That is the journey-wide rule for a field nobody
     has touched, and "Enter your driving licence number." belongs beside the
     field it names. The banner is for a number that exists but can't be used.

     The full length is read from maxlength, the same place the character counter
     takes it from, so the two can't drift apart. Only licence characters count:
     a stray space isn't one, so it doesn't get someone past this. */
  function licenceIncomplete(main) {
    var field = main.querySelector('[data-journey-licence]');
    if (!field) return false;

    var full  = +field.getAttribute('maxlength') || 16;
    var typed = field.value.replace(/[^A-Za-z0-9]/g, '');
    return typed.length > 0 && typed.length < full;
  }

  /* Stands in for the lookup a real journey would make. The number carries the
     surname in its first five characters, so if those disagree with the surname
     on screen the two cannot both be right and no lookup would match. Compared
     against the fields **here**, not what the driver screen stored, because this
     screen lets the details be corrected. */
  function lookupFails(main) {
    var field = main.querySelector('[data-journey-licence]');
    if (!field) return false;

    var typed = field.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (typed.length < 5) return false;          /* empty is the gate's, short is above */

    var surname = main.querySelector('[data-journey-value="surname"]');
    if (!surname || !surname.value.trim()) return false;

    return typed.slice(0, 5) !== dvlaNumber({ surname: surname.value }, 5);
  }

  /* One alert for the whole screen, above everything. Both faults it reports are
     about the DVLA check rather than about a field: a mismatch is a disagreement
     between two things with no single field to hang it on, and an incomplete
     number is the check being impossible to run.

     Pass a message to override the mismatch wording; either can also be set per
     screen with data-lookup-error / data-incomplete-error on the <main>. */
  function showLookupError(main, message) {
    var text = message || main.dataset.lookupError
      || 'We couldn’t match these details with the DVLA. '
       + 'Check your licence number and personal details, then try again.';

    /* Raised through the Global Alert component — the floating stack, the close
       and the states are all its job now. The journey only decides what to say
       and when. */
    if (!window.GlobalAlert) return;

    /* Already saying it — leave it be, so a second Continue doesn't rebuild the
       banner under the reader's eyes. A DIFFERENT fault replaces it rather than
       stacking: the component allows two, but these two faults are alternative
       readings of the same field and showing both would be telling someone their
       half-typed number both is and isn't a match. */
    var showing = window.GlobalAlert.showing();
    for (var i = 0; i < showing.length; i++) {
      var said = showing[i].querySelector('.alert__description');
      if (said && said.textContent === text) return;
    }
    window.GlobalAlert.clear();

    window.GlobalAlert.show({ state: 'error', message: text });
  }

  /* The count comes from maxlength too, so the banner, the counter under the
     field and the rule itself all quote the same number. */
  function showIncompleteError(main) {
    var field = main.querySelector('[data-journey-licence]');
    var full  = (field && +field.getAttribute('maxlength')) || 16;
    showLookupError(main, main.dataset.incompleteError
      || 'Your licence number isn’t complete. Enter all ' + full
       + ' characters from line 5 of your licence, then try again.');
  }

  function clearLookupError() {
    if (window.GlobalAlert) window.GlobalAlert.clear();
  }

  /* --- CONVICTIONS — a list you add to and delete from ---------------------
     The convictions screen repeats one Detail Card. Everything the card contains
     is ordinary journey markup, so the required-field gate, the segmented date and
     the filtering Select all work on a card that did not exist when the page
     loaded — nothing here re-implements any of that.

     Two jobs only: keep the ids and radio names unique so a second card does not
     drive the first, and keep the numbering honest after a delete. */

  var convictions = 0;                 /* ids ever issued — never reused */

  function renumber(list) {
    list.querySelectorAll('[data-conviction]').forEach(function (card, i) {
      var n = i + 1;
      card.querySelector('.detail-card__title').textContent = 'Conviction #' + n;
      var bin = card.querySelector('[data-conviction-delete]');
      if (bin) bin.setAttribute('aria-label', 'Delete conviction #' + n);
    });
  }

  /* The template carries {n} and {i} placeholders. {n} is what the driver reads,
     {i} is what the DOM needs to keep apart — they are different numbers as soon
     as anything is deleted, which is exactly why they are separate. */
  function addConviction(main) {
    var list = main.querySelector('[data-conviction-list]');
    var tpl  = document.getElementById('conviction-template');
    if (!list || !tpl) return null;

    convictions++;
    var html = tpl.innerHTML
      .replace(/\{i\}/g, String(convictions))
      .replace(/\{n\}/g, String(list.querySelectorAll('[data-conviction]').length + 1));

    var holder = document.createElement('div');
    holder.innerHTML = html;
    var card = holder.firstElementChild;
    list.appendChild(card);
    renumber(list);
    return card;
  }

  function convictionsEntered(main) {
    var list = main.querySelector('[data-conviction-list]');
    if (!list) return false;
    return Array.prototype.some.call(list.querySelectorAll('.input'), function (i) {
      return i.value.trim();
    }) || !!list.querySelector('.radio__input:checked');
  }

  function wireConvictions(main) {
    var root = main.querySelector('[data-convictions]');
    if (!root) return;
    var list = main.querySelector('[data-conviction-list]');

    /* The first card is in the markup, so the id counter starts past it */
    convictions = list ? list.querySelectorAll('[data-conviction]').length : 0;

    main.addEventListener('click', function (event) {
      if (event.target.closest('[data-conviction-add]')) {
        var card = addConviction(main);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      var bin = event.target.closest('[data-conviction-delete]');
      if (bin) {
        var card = bin.closest('[data-conviction]');
        /* The last card stays. Deleting it would leave Yes answered with nothing
           to show, which is a state the screen has no design for — answering No
           is how you say you have none. */
        if (list.querySelectorAll('[data-conviction]').length > 1) {
          card.remove();
          renumber(list);
        }
      }
    });

    /* Yes -> No throws away entered convictions, so ask first. Only when there is
       something to lose: confirming an empty list is a dialogue about nothing.
       The panel is hidden by conditional-selector.js on change, so the answer is
       taken back until the driver confirms. */
    var no = Array.prototype.filter.call(
      root.querySelectorAll('.radio__input'), function (r) { return !r.hasAttribute('data-reveals'); })[0];
    var yes = root.querySelector('[data-reveals]');
    if (!no || !yes || !window.Modal) return;

    /* Set while the discard is being carried out, so the guard below doesn't
       intercept the very answer the driver has just confirmed and reopen itself. */
    var discarding = false;

    no.addEventListener('change', function () {
      if (discarding || !no.checked || !convictionsEntered(main)) return;
      yes.checked = true;                                  /* put it back for now */
      yes.dispatchEvent(new Event('change', { bubbles: true }));
      window.Modal.open('discard-convictions', no);
    });

    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-conviction-discard]')) {
        /* Answer No for real. conditional-selector.js clears the panel's fields
           as it hides them, so the cards' contents go with it; the extra cards
           themselves are dropped here so reopening starts from one blank card. */
        discarding = true;
        no.checked = true;
        no.dispatchEvent(new Event('change', { bubbles: true }));
        discarding = false;

        list.querySelectorAll('[data-conviction]').forEach(function (c, i) { if (i) c.remove(); });
        renumber(list);
        window.Modal.close('discard-convictions');
      } else if (event.target.closest('[data-conviction-keep]')) {
        window.Modal.close('discard-convictions');
      }
    });
  }


  /* Where are we? Derived from the filename so a page can't disagree with the
     flow; data-step is the fallback when a screen is opened outside it. */
  function locate(main) {
    var file = location.pathname.split('/').pop() || 'index.html';
    for (var i = 0; i < STEPS.length; i++) {
      var p = slotIn(STEPS[i].pages, file);
      if (p !== -1) return { step: i, page: p, flow: slotIn(FLOW, file) };
    }
    var s = 0;
    STEPS.forEach(function (st, i) { if (st.id === main.dataset.step) s = i; });
    return { step: s, page: 0, flow: slotIn(FLOW, lead([].concat(STEPS[s].pages[0]))) };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var main = document.querySelector('.proto[data-step]');
    if (!main) return;

    var at = locate(main);

    // Nav above the screen, with the stepper reflecting this step AND how far
    // through the step's pages we are
    var nav = document.createElement('div');
    nav.innerHTML = NAV;
    if (main.hasAttribute('data-exit')) {
      /* A dead end shows no progress: the journey has stopped, so a part-filled
         bar would be reporting on something that is no longer happening. Figma's
         kickout frame draws the bar off, which is what dropping the slot does —
         see sales-nav.css. */
      nav.querySelector('.sales-nav__steps').remove();
    } else {
      nav.querySelector('.sales-nav__steps').innerHTML = stepper(at.step, at.page);
    }
    main.parentNode.insertBefore(nav.firstElementChild, main);

    // Footer below the screen
    var foot = document.createElement('div');
    foot.innerHTML = FOOT;
    main.parentNode.insertBefore(foot.firstElementChild, main.nextSibling);

    // A small Back control at the top of every screen. It carries
    // data-journey="back" so the wiring below points it at the previous page —
    // and removes it on the first screen, where there is nowhere to go back to.
    // An exit screen skips it: there is nowhere useful to go back to from a
    // dead end, and the design doesn't show one.
    if (!main.hasAttribute('data-exit')) {
      var back = document.createElement('a');
      back.className = 'btn btn--tertiary btn--pill btn--small proto__back';
      back.setAttribute('data-journey', 'back');
      back.setAttribute('href', '#');
      back.innerHTML = '<span class="btn__icon">' + ARROW_LEFT + '</span>Back';
      main.insertBefore(back, main.firstChild);
    }

    // Remember what gets typed, and fill in what earlier screens captured
    main.querySelectorAll('[data-journey-field]').forEach(function (el) {
      el.addEventListener('input', function () {
        remember(el.dataset.journeyField, el.value);
      });
    });

    wireConvictions(main);

    var stored = answers();

    /* Hold the field to licence characters. A GB number has no spaces or
       punctuation, and without this the counter (which counts what is in the
       field) and the completeness rule (which counts licence characters) can
       disagree — a trailing space reads "16 of 16" next to a banner saying the
       number is incomplete. Strip on the way in so the two can never contradict
       each other. The caret is put back where it was, minus whatever was
       dropped ahead of it, so typing mid-number doesn't throw it to the end. */
    main.querySelectorAll('[data-journey-licence]').forEach(function (el) {
      el.addEventListener('input', function () {
        var clean = el.value.replace(/[^A-Za-z0-9]/g, '');
        if (clean === el.value) return;
        var at   = el.selectionStart;
        var lost = el.value.slice(0, at).length - el.value.slice(0, at).replace(/[^A-Za-z0-9]/g, '').length;
        el.value = clean;
        el.setSelectionRange(at - lost, at - lost);
      });
    });

    /* Trailing tick once the number is complete — the same signal the reg field
       gives on the first screen. Live, per keystroke, and it goes away again if
       characters are removed: it says "this is a whole licence number", not
       "this passed the lookup", which nothing here can know until Continue.
       Runs after the strip above, so it counts cleaned characters. */
    main.querySelectorAll('[data-journey-licence]').forEach(function (el) {
      var field = el.closest('.input-field');
      if (!field || !field.querySelector('.input__status')) return;
      var full = +el.getAttribute('maxlength') || 16;
      var flip = function () {
        var typed = el.value.replace(/[^A-Za-z0-9]/g, '');
        field.classList.toggle('input-field--valid', typed.length === full);
      };
      el.addEventListener('input', flip);
      flip();                                    /* markup may arrive pre-filled */
    });

    /* Give the licence number its known head start (see the DVLA note above) */
    main.querySelectorAll('[data-journey-licence]').forEach(function (el) {
      if (el.value) return;                       /* leave anything already typed */
      if (!PREFILL_TITLES.test((stored.title || '').trim())) return;
      var head = dvlaNumber(stored, 5);
      if (!/^[A-Z9]{5}$/.test(head)) return;      /* no surname, nothing to give */
      el.value = head;
      el.dispatchEvent(new Event('input', { bubbles: true }));   /* counter, gate */
    });

    main.querySelectorAll('[data-journey-value]').forEach(function (el) {
      var value = stored[el.dataset.journeyValue];
      if (!value) return;                     // nothing captured — keep the default
      var format = FORMAT[el.dataset.journeyFormat];
      var text   = format ? format(value) : value;
      /* a field carries the value, anything else reads it */
      if ('value' in el && el.tagName === 'INPUT') el.value = text;
      else el.textContent = text;
    });

    // A flagged control clears itself the moment it's answered, so the red
    // doesn't sit there while someone is plainly fixing it
    function recheck(event) {
      var el = event.target.closest('[data-journey-invalid]');
      if (el && answered(el)) unflag(el);
    }
    main.addEventListener('input', recheck);
    main.addEventListener('change', recheck);

    /* Editing either side of the mismatch retracts the screen-level alert —
       it is a statement about a pair, so any change makes it stale */
    main.addEventListener('input', function () { clearLookupError(); });

    // Point any [data-journey="back"|"next"] control at the adjacent page in
    // the flow — which may be another page of the same step. Going forward runs
    // the gate first; Back never validates, since leaving is always allowed.
    main.querySelectorAll('[data-journey]').forEach(function (el) {
      var forward = el.dataset.journey !== 'back';
      /* One page either way, along the arm you are on. Both arms of a branch share
         a slot, so Continue from the end of one lands past the branch and Back from
         its start returns to the question that chose it — never sideways into the
         other arm. */
      var to      = step(at, forward);
      if (!to) { el.remove(); return; }

      /* Push on the way forward, pop on the way back — see THE TRAIL above */
      function onward(dest) {
        var t = trail();
        t.push(here());
        saveTrail(t);
        location.href = dest;
      }
      function backward() {
        var t = trail();
        var dest = step(at, false);
        t.pop();
        saveTrail(t);
        location.href = dest;
      }

      if (el.tagName === 'A') {
        el.setAttribute('href', to);
        el.addEventListener('click', function (event) {
          event.preventDefault();
          if (!forward) { backward(); return; }
          if (!gate(main)) return;
          if (licenceIncomplete(main)) { showIncompleteError(main); return; }
          if (lookupFails(main)) { showLookupError(main); return; }
          clearLookupError();
          onward(goesTo(main) || to);              /* a disqualifying answer wins */
        });
      } else {
        el.addEventListener('click', function () {
          if (!forward) { backward(); return; }
          if (!gate(main)) return;
          /* Incomplete before mismatch: telling someone their half-typed number
             doesn't match the DVLA is true but useless — finish it first. */
          if (licenceIncomplete(main)) { showIncompleteError(main); return; }
          if (lookupFails(main)) { showLookupError(main); return; }
          clearLookupError();
          onward(goesTo(main) || to);
        });
      }
    });
  });
})();
