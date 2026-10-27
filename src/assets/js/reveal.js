// Scroll reveal: elements with [data-reveal] animate in once when entering the viewport.
// CSS only hides them when <html class="js"> is present and motion is allowed.

export function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.transitionDelay = `${el.dataset.revealDelay || 0}ms`;
        el.classList.add('is-revealed');
        // drop the stagger delay afterwards so it does not affect hover transitions
        el.addEventListener('transitionend', () => (el.style.transitionDelay = ''), { once: true });
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}
