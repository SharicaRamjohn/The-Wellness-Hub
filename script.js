// ============================================================
// SPLASH SCREEN — logo reveal, once per browser session
// ============================================================
const SPLASH_KEY = 'twh-splash-seen';
const splash = document.getElementById('splash');
if (splash) {
  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(SPLASH_KEY) === '1'; } catch (e) {}

  if (alreadySeen) {
    splash.remove();
  } else {
    try { sessionStorage.setItem(SPLASH_KEY, '1'); } catch (e) {}
    document.body.style.overflow = 'hidden';
    const releaseScroll = () => { document.body.style.overflow = ''; };
    // Remove from the DOM once the fade-out animation completes,
    // so it can't block clicks or linger for screen readers.
    splash.addEventListener('animationend', (e) => {
      if (e.target === splash) { splash.remove(); releaseScroll(); }
    });
    // Fallback in case animationend doesn't fire for any reason.
    setTimeout(() => {
      if (splash.isConnected) splash.remove();
      releaseScroll();
    }, 3600);
  }
}

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
    button.textContent = lang === 'pt' ? 'Obrigado!' : 'Thank you!';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = originalLabel;
      button.disabled = false;
      emailInput.value = '';
    }, 2500);
  });
}

// ============================================================
// ACTIVE NAV STATE (desktop nav only — mobile nav closes on click)
// ============================================================
const navSections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-main a');
if (navLinks.length) {
  const setActiveLink = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;
    navSections.forEach(section => { if (section.offsetTop <= scrollPos) currentId = section.id; });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`));
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();
}
