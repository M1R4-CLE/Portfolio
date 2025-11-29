// unified carousel + lightbox script for Projects & Certificates
console.log('portfolio_task4_script.js loaded (patched)');

(function(){
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const KEY = 'site-theme-light';
  if (btn) {
    const saved = localStorage.getItem(KEY);
    if (saved === '1') { root.classList.add('light-theme'); btn.setAttribute('aria-pressed','true'); }
    else { root.classList.remove('light-theme'); btn.setAttribute('aria-pressed','false'); }
    btn.addEventListener('click', ()=> {
      const nowLight = root.classList.toggle('light-theme');
      btn.setAttribute('aria-pressed', String(nowLight));
      localStorage.setItem(KEY, nowLight ? '1' : '0');
    });
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded — init carousels');
  const wraps = Array.from(document.querySelectorAll('.carousel-wrap'));
  console.log('found carousel-wrap count =', wraps.length);
  wraps.forEach((w, i) => {
    try {
      initCarousel(w);
      console.log('initCarousel OK for index', i);
    } catch (err) {
      console.error('initCarousel error for index', i, err);
    }
  });
  
  const lightbox = document.getElementById('cert-lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (lightbox && lbImg) {
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    function openLightbox(src, alt) {
      lbImg.src = src; lbImg.alt = alt || 'Image';
      lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
      document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }
    function closeLightbox() {
      lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); lbImg.src = '';
      document.documentElement.style.overflow = ''; document.body.style.overflow = '';
    }

    
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || t.tagName !== 'IMG') return;
      
      if (t.classList.contains('cert-img') || t.classList.contains('expand-img') ||
          t.closest('.certificate-card') || t.closest('.project-card')) {
        openLightbox(t.src, t.alt || t.getAttribute('alt') || 'Image');
      }
    });

    document.querySelectorAll('.carousel-track img').forEach(img => {
      img.addEventListener('error', () => console.warn('Image failed to load:', img.src));
      img.addEventListener('load', () => console.debug('Image loaded:', img.src, 'naturalSize', img.naturalWidth, img.naturalHeight));
    });

    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });
  } else {
    console.warn('Lightbox elements missing', {lightbox: !!lightbox, lbImg: !!lbImg});
  }
});

function initCarousel(wrap) {
  console.log('initCarousel (scroll) for', wrap);
  const viewport = wrap.querySelector('.carousel-viewport');
  const track = wrap.querySelector('.carousel-track');
  const prevBtn = wrap.querySelector('.prev-btn');
  const nextBtn = wrap.querySelector('.next-btn');
  if (!viewport || !track || !prevBtn || !nextBtn) {
    console.warn('carousel missing elements', { viewport: !!viewport, track: !!track, prevBtn: !!prevBtn, nextBtn: !!nextBtn });
    return;
  }

  const items = Array.from(track.children);
  if (!items.length) return;

  function gap() {
    const g = parseFloat(getComputedStyle(track).gap || getComputedStyle(track).columnGap) || 18;
    return g;
  }

  function cardWidth() {
    return items[0].getBoundingClientRect().width + gap();
  }

  function maxScroll() {
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  }

  nextBtn.addEventListener('click', () => {
    const cw = Math.round(cardWidth());
    const cur = Math.round(viewport.scrollLeft);
    const target = cur + cw;
    if (target >= maxScroll()) {
      // wrap to start
      viewport.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      viewport.scrollBy({ left: cw, behavior: 'smooth' });
    }
  });

  prevBtn.addEventListener('click', () => {
    const cw = Math.round(cardWidth());
    const cur = Math.round(viewport.scrollLeft);
    const target = cur - cw;
    if (target <= 0) {
      // wrap to end
      viewport.scrollTo({ left: maxScroll(), behavior: 'smooth' });
    } else {
      viewport.scrollBy({ left: -cw, behavior: 'smooth' });
    }
  });

  const imgs = track.querySelectorAll('img');
  let loaded = 0;
  if (imgs.length === 0) setTimeout(()=>{}, 0);
  else {
    imgs.forEach(img => {
      if (!img.complete) img.addEventListener('load', ()=>{ /* noop */ });
    });
  }
}

console.log('script loaded?', !!window.initCarousel);
console.log('carousels:', document.querySelectorAll('.carousel-wrap').length);
document.querySelectorAll('.carousel-wrap').forEach((w,i)=>{
  console.log(i,
    'prev:', !!w.querySelector('.prev-btn'),
    'next:', !!w.querySelector('.next-btn'),
    'track children:', w.querySelectorAll('.carousel-track > *').length);
});

[...document.querySelectorAll('.carousel-track img')].map(img=>({
  src: img.src,
  alt: img.alt,
  loaded: img.complete && img.naturalWidth>0,
  width: img.naturalWidth,
  height: img.naturalHeight
})).forEach(x=>console.log(x));

(function(){
  const header = document.querySelector('.site-header');
  function headerOffset() {
    return (header && header.offsetHeight) ? header.offsetHeight : 90;
  }

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const targetId = a.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const el = document.querySelector(targetId);
      if (!el) return; 
      e.preventDefault();
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY - headerOffset() - 12);
      window.scrollTo({ top, behavior: 'smooth' });
      
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
      
      window.setTimeout(()=> el.removeAttribute('tabindex'), 1000);
    }, { passive: true });
  });
})();

var sX, nX, desX = 0, tX = 0; // NO tY

function applyTransformYOnly() {
  // keep container flat — only rotate Y
  var odrag = document.getElementById("drag-container");
  if (odrag) odrag.style.transform = "rotateY(" + tX + "deg)";
}

// Pointer drag: update only horizontal rotation
document.onpointerdown = function(e) {
  clearInterval(window._odrag_timer);
  e = e || window.event;
  sX = e.clientX;

  this.onpointermove = function(ev) {
    ev = ev || window.event;
    nX = ev.clientX;
    desX = nX - sX;
    tX += desX * 0.12; // sensitivity
    applyTransformYOnly();
    sX = nX;
  };

  this.onpointerup = function() {
    window._odrag_timer = setInterval(function() {
      desX *= 0.94;
      tX += desX * 0.12;
      applyTransformYOnly();
      if (Math.abs(desX) < 0.5) {
        clearInterval(window._odrag_timer);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};
