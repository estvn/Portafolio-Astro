// Theme (light/dark) and language (es/en) toggles.
// The initial state is applied before paint by the inline script in Head.astro;
// this module wires the buttons, persists the choice and notifies other modules via
// `themechange` / `languagechange` CustomEvents dispatched on document.

const root = document.documentElement;
const THEME_COLORS = { dark: '#0b1426', light: '#f8fafc' };

export const getLang = () => (root.lang === 'en' ? 'en' : 'es');
export const getTheme = () => (root.classList.contains('dark') ? 'dark' : 'light');

function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode, blocked): the choice just is not persisted */
  }
}

// Text that cannot use <span data-lang>: <title>, meta description and placeholders.
function syncLangAttributes(lang) {
  const title = document.querySelector('title[data-es]');
  if (title) document.title = title.dataset[lang] || document.title;
  const desc = document.querySelector('meta[name="description"][data-es]');
  if (desc) desc.setAttribute('content', desc.dataset[lang] || desc.content);
  document.querySelectorAll('[data-ph-es]').forEach((el) => {
    el.placeholder = el.dataset[lang === 'en' ? 'phEn' : 'phEs'] || el.placeholder;
  });
}

export function setLang(lang) {
  lang = lang === 'en' ? 'en' : 'es';
  root.lang = lang;
  save('lang', lang);
  syncLangAttributes(lang);
  document.querySelectorAll('[data-lang-toggle]').forEach((btn) => btn.setAttribute('aria-checked', String(lang === 'en')));
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
}

export function setTheme(theme) {
  theme = theme === 'light' ? 'light' : 'dark';
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  save('theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => btn.setAttribute('aria-checked', String(theme === 'dark')));
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function initThemeLang() {
  syncLangAttributes(getLang());
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-checked', String(getTheme() === 'dark'));
    btn.addEventListener('click', () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'));
  });
  document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
    btn.setAttribute('aria-checked', String(getLang() === 'en'));
    btn.addEventListener('click', () => setLang(getLang() === 'en' ? 'es' : 'en'));
  });
}
