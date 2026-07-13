import figma, { html } from "@figma/code-connect/html";

/**
 * Code Connect — Trustpilot Reviews (Trustpilot Widget)
 * Figma: https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6500-186188
 *
 * A social-proof section: title, a carousel of review cards (Trustpilot stars +
 * headline + body + reviewer), and a Trustpilot rating lockup. "Breakpoint"
 * maps to the responsive layout (desktop arrows / mobile dots); "Title" and
 * "Lockup" toggle those blocks.
 *
 * Reuses Trustpilot (.trustpilot stars), Trustpilot Lockup (.trustpilot-logo),
 * Pagination and Button (.btn--fab arrows). See the showcase for full markup.
 */

figma.connect(
  "https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=6500-186188",
  {
    props: {
      title: figma.boolean("title"),
      lockup: figma.boolean("lockup"),
    },
    example: () =>
      html`<section class="tp-reviews">
  <div class="tp-reviews__head">
    <h2 class="tp-reviews__title">Rated 5* by 8,000+ drivers</h2>
    <p class="tp-reviews__subtitle">Here’s what our customers are saying about us</p>
  </div>

  <div class="tp-reviews__carousel">
    <button class="btn btn--secondary btn--fab tp-reviews__nav" type="button" data-dir="prev" aria-label="Previous"></button>
    <div class="tp-reviews__track">
      <div class="tp-review">
        <div class="trustpilot trustpilot--green trustpilot--24" role="img" aria-label="Rated 5 out of 5 on Trustpilot">
          <span class="trustpilot__star trustpilot__star--full"><svg viewBox="0 0 24 24" fill="none"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor" /></svg></span>
          <!-- × 5 stars -->
        </div>
        <div class="tp-review__review">
          <p class="tp-review__title">Helpful customer service</p>
          <p class="tp-review__body">Review text…</p>
        </div>
        <p class="tp-review__name"><a href="#">yared mamo</a> - 6 days ago</p>
      </div>
      <!-- more .tp-review cards -->
    </div>
    <button class="btn btn--secondary btn--fab tp-reviews__nav" type="button" data-dir="next" aria-label="Next"></button>
  </div>

  <div class="tp-reviews__pagination">
    <div class="pagination" role="tablist" aria-label="Review">
      <span class="pagination__dot pagination__dot--active"></span>
    </div>
  </div>

  <div class="tp-reviews__rating">
    <p class="tp-reviews__rating-text">Rated <strong>4.4</strong> / 5 based on <strong>10,349 reviews</strong>. Showing our 5* reviews.</p>
    <span class="trustpilot-logo"><span class="trustpilot-logo__star"><svg viewBox="0 0 24 24" fill="none"><path d="M12 1.5l2.955 6.363 6.795.79-5.02 4.64 1.35 6.707L12 17.1l-6.08 3.4 1.35-6.707-5.02-4.64 6.795-.79L12 1.5z" fill="currentColor" /></svg></span><span class="trustpilot-logo__wordmark">Trustpilot</span></span>
  </div>
</section>`,
  }
);
