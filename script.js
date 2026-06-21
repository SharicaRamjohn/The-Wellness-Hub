// ============================================================
// LANGUAGE TOGGLE
// ============================================================
const LANG_KEY = 'twh-lang';

function getStoredLang() {
  try { return localStorage.getItem(LANG_KEY) || 'pt'; }
  catch (e) { return 'pt'; }
}
function setStoredLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
}
function applyLanguage(lang) {
  document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
  document.querySelectorAll(`[data-${lang}]`).forEach(el => {
    const value = el.getAttribute(`data-${lang}`);
    if (value !== null) el.textContent = value;
  });
  document.querySelectorAll(`[data-${lang}-html]`).forEach(el => {
    const value = el.getAttribute(`data-${lang}-html`);
    if (value !== null) el.innerHTML = value;
  });
  document.querySelectorAll(`[data-${lang}-placeholder]`).forEach(el => {
    const value = el.getAttribute(`data-${lang}-placeholder`);
    if (value !== null) el.setAttribute('placeholder', value);
  });
  document.querySelectorAll('.lang-toggle button, .mobile-lang button').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  setStoredLang(lang);
}
document.querySelectorAll('.lang-toggle button, .mobile-lang button').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
});
applyLanguage(getStoredLang());

// ============================================================
// MOBILE NAV
// ============================================================
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// NEWSLETTER FORM
// ============================================================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const button = newsletterForm.querySelector('button');
    const lang = getStoredLang();
    const originalLabel = button.textContent;
    button.textContent = lang === 'pt' ? 'Obrigado! ✦' : 'Thank you! ✦';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = originalLabel;
      button.disabled = false;
      emailInput.value = '';
    }, 2500);
  });
}

// ============================================================
// ACTIVE NAV STATE
// ============================================================
const navSections = document.querySelectorAll('.path-step[id], header[id]');
const navLinks = document.querySelectorAll('.nav-left a, .nav-right a');
const setActiveLink = () => {
  let currentId = '';
  const scrollPos = window.scrollY + 140;
  navSections.forEach(section => { if (section.offsetTop <= scrollPos) currentId = section.id; });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`));
};
window.addEventListener('scroll', setActiveLink, { passive: true });

// ============================================================
// RAIL DOT TRACKING — lights up the dot for the step in view
// ============================================================
const railDots = document.querySelectorAll('.rail-dot');
const steps = document.querySelectorAll('.path-step');

const updateRail = () => {
  let activeIndex = -1;
  steps.forEach((step, i) => {
    const rect = step.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
      activeIndex = i;
    }
  });
  railDots.forEach(dot => {
    const stepIndex = parseInt(dot.getAttribute('data-step'), 10);
    dot.classList.toggle('active', stepIndex === activeIndex);
  });
};
window.addEventListener('scroll', updateRail, { passive: true });
updateRail();
