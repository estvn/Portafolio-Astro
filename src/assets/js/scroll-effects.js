// Small scroll-driven effects: progress bar, timeline lines and hero counters.

const motionAllowed = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// Draws each .timeline-line from top to bottom as the section scrolls through the viewport.
export function initTimelines() {
  const lines = document.querySelectorAll('.timeline-line');
  if (!lines.length || !motionAllowed()) return;
  // Measure the unscaled parent: the line itself is scaled by --timeline, so its own
  // rect shrinks/grows with the progress and made the value oscillate (flicker).
  let raf = 0;
  const update = () => {
    raf = 0;
    lines.forEach((line) => {
      const rect = line.parentElement.getBoundingClientRect();
      const progress = (window.innerHeight * 0.7 - rect.top) / rect.height;
      line.style.setProperty('--timeline', Math.min(Math.max(progress, 0), 1).toFixed(3));
    });
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}

// Counts [data-count-to] elements up from 0 the first time they are visible.
export function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length || !motionAllowed() || !('IntersectionObserver' in window)) return;

  const run = (el) => {
    const target = Number(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || '';
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => {
    el.textContent = '0' + (el.dataset.countSuffix || '');
    observer.observe(el);
  });
}
