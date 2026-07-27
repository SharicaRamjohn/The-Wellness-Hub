// ============================================================
// LANGUAGE TOGGLE  (PT / EN — preserves the data-* system)
// ============================================================
const LANG_KEY = 'twh-lang';
function getStoredLang(){ try{ return localStorage.getItem(LANG_KEY) || 'pt'; }catch(e){ return 'pt'; } }
function setStoredLang(l){ try{ localStorage.setItem(LANG_KEY, l); }catch(e){} }
function applyLanguage(lang){
  document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
  document.querySelectorAll(`[data-${lang}]`).forEach(el=>{
    const v = el.getAttribute(`data-${lang}`); if(v!==null) el.textContent = v;
  });
  document.querySelectorAll(`[data-${lang}-html]`).forEach(el=>{
    const v = el.getAttribute(`data-${lang}-html`); if(v!==null) el.innerHTML = v;
  });
  document.querySelectorAll(`[data-${lang}-placeholder]`).forEach(el=>{
    const v = el.getAttribute(`data-${lang}-placeholder`); if(v!==null) el.setAttribute('placeholder', v);
  });
  document.querySelectorAll('.lang-toggle button').forEach(b=>{
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });
  setStoredLang(lang);
}
document.querySelectorAll('.lang-toggle button').forEach(b=>{
  b.addEventListener('click', ()=> applyLanguage(b.getAttribute('data-lang')));
});
applyLanguage(getStoredLang());

// ============================================================
// FULLSCREEN MENU (hamburger)
// ============================================================
const menuBtn = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
if(menuBtn && menuOverlay){
  const setMenu = (open) => {
    menuOverlay.classList.toggle('open', open);
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuOverlay.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', ()=> setMenu(!menuOverlay.classList.contains('open')));
  menuOverlay.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> setMenu(false)));
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && menuOverlay.classList.contains('open')) setMenu(false); });
}

// ============================================================
// NEWSLETTER (front-end acknowledgement only)
// ============================================================
const form = document.getElementById('newsletterForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const input = document.getElementById('newsletterEmail');
    const btn = form.querySelector('button');
    const lang = getStoredLang();
    const label = btn.textContent;
    btn.textContent = lang === 'pt' ? 'Obrigado!' : 'Thank you!';
    btn.disabled = true;
    setTimeout(()=>{ btn.textContent = label; btn.disabled = false; input.value=''; }, 2500);
  });
}

// ============================================================
// SCROLL REVEAL (Apple-style rise + fade)
// ============================================================
const reveals = document.querySelectorAll('.reveal, .reveal-media');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reveals.length && !reduced && 'IntersectionObserver' in window){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -10% 0px' });
  reveals.forEach(el=> io.observe(el));
} else {
  reveals.forEach(el=> el.classList.add('in'));
}
