// "Show more projects" toggle. Extra items stay in the DOM with the `hidden` attribute (SEO).
//   <button data-show-more aria-controls="grid-id"> + items marked [data-extra] inside #grid-id
//   with two label spans: [data-label="more"] and [data-label="less"].

export function initShowMore() {
  document.querySelectorAll('[data-show-more]').forEach((button) => {
    const grid = document.getElementById(button.getAttribute('aria-controls'));
    if (!grid) return;
    const extras = [...grid.querySelectorAll('[data-extra]')];
    const more = button.querySelector('[data-label="more"]');
    const less = button.querySelector('[data-label="less"]');

    button.addEventListener('click', () => {
      const expand = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expand));
      more.hidden = expand;
      less.hidden = !expand;

      extras.forEach((item, i) => {
        item.hidden = !expand;
        if (!expand) return;
        // re-run the reveal transition for items that were display:none until now
        const target = item.matches('[data-reveal]') ? item : item.querySelector('[data-reveal]');
        if (!target || target.classList.contains('is-revealed')) return;
        void target.offsetWidth;
        target.style.transitionDelay = `${i * 100}ms`;
        target.classList.add('is-revealed');
        target.addEventListener('transitionend', () => (target.style.transitionDelay = ''), { once: true });
      });
    });
  });
}
