// Autoplay carousel on top of CSS scroll-snap. Markup contract (see Project.astro):
//   [data-carousel] > [data-carousel-track] > [data-carousel-slide]*, plus
//   [data-carousel-prev], [data-carousel-next] and [data-carousel-dot]* buttons.
// Autoplay pauses on hover, focus, hidden tab and when off-screen; it is disabled
// with prefers-reduced-motion. Swipe is the native horizontal scroll.

const INTERVAL = 3000;

export function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(setup);
}

function setup(root) {
  const track = root.querySelector('[data-carousel-track]');
  const slides = [...root.querySelectorAll('[data-carousel-slide]')];
  const dots = [...root.querySelectorAll('[data-carousel-dot]')];
  if (!track || slides.length < 2) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer = 0;
  let hovered = false;
  let focused = false;
  let visible = true;

  const behavior = () => (motion.matches ? 'auto' : 'smooth');

  function render() {
    slides.forEach((slide, i) => {
      // off-screen slides must not be reachable with the keyboard
      slide.inert = i !== index;
      slide.setAttribute('aria-hidden', String(i !== index));
    });
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  // While a programmatic scroll runs, scroll events must not rewrite `index`:
  // they used to reset it to the old slide and re-mark the target slide inert,
  // which cancelled the scroll (arrows looked dead).
  let lockUntil = 0;
  let settle = 0;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide) => (slide.inert = false)); // let the target be scrolled into view
    lockUntil = performance.now() + 800;
    track.scrollTo({ left: index * track.clientWidth, behavior: behavior() });
    dots.forEach((dot, d) => (d === index ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current')));
    clearTimeout(settle);
    settle = setTimeout(render, 850);
  }

  // keep `index` in sync when the user swipes / scrolls
  let raf = 0;
  track.addEventListener('scroll', () => {
    if (performance.now() < lockUntil) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== index && i >= 0 && i < slides.length) {
        index = i;
        render();
      }
    });
  }, { passive: true });

  // ---------- autoplay ----------
  const shouldPlay = () => !motion.matches && !hovered && !focused && visible && !document.hidden;

  function sync() {
    clearInterval(timer);
    timer = 0;
    track.setAttribute('aria-live', shouldPlay() ? 'off' : 'polite');
    if (shouldPlay()) timer = setInterval(() => goTo(index + 1), INTERVAL);
  }

  root.addEventListener('pointerenter', () => { hovered = true; sync(); });
  root.addEventListener('pointerleave', () => { hovered = false; sync(); });
  root.addEventListener('focusin', () => { focused = true; sync(); });
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) { focused = false; sync(); }
  });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.3 }).observe(root);
  }

  // ---------- controls ----------
  root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => goTo(index - 1));
  root.querySelector('[data-carousel-next]')?.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
  });
  window.addEventListener('resize', () => track.scrollTo({ left: index * track.clientWidth, behavior: 'auto' }));

  render();
  sync();
}
