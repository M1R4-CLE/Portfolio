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
  wraps.forEach((wrap, index) => {
    try {
      initCarousel(wrap);
      console.log('initCarousel OK for index', index);
    } catch (err) {
      console.error('initCarousel error for index', index, err);
    }
  });

  const setScrollLock = (locked) => {
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    document.body.style.overflow = locked ? 'hidden' : '';
  };

  // Certificate lightbox
  const certLightbox = document.getElementById('cert-lightbox');
  const certImage = document.getElementById('lightbox-img');
  if (certLightbox && certImage) {
    const certClose = certLightbox.querySelector('.lightbox-close');
    const certBackdrop = certLightbox.querySelector('.lightbox-backdrop');
    let certActiveTrigger = null;

    const openCertLightbox = (src, alt, trigger) => {
      certImage.src = src;
      certImage.alt = alt || 'Certificate';
      certLightbox.classList.add('open');
      certLightbox.setAttribute('aria-hidden', 'false');
      certActiveTrigger = trigger || null;
      setScrollLock(true);
      if (certClose) certClose.focus();
    };

    const closeCertLightbox = () => {
      certLightbox.classList.remove('open');
      certLightbox.setAttribute('aria-hidden', 'true');
      certImage.src = '';
      certImage.alt = '';
      setScrollLock(false);
      if (certActiveTrigger) {
        certActiveTrigger.focus();
        certActiveTrigger = null;
      }
    };

    document
      .querySelectorAll('#achievements .certificate-card img')
      .forEach((img) => {
        img.setAttribute('tabindex', '0');
        img.addEventListener('click', () =>
          openCertLightbox(img.src, img.alt, img)
        );
        img.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openCertLightbox(img.src, img.alt, img);
          }
        });
      });

    if (certBackdrop) certBackdrop.addEventListener('click', closeCertLightbox);
    if (certClose) certClose.addEventListener('click', closeCertLightbox);
    certLightbox.addEventListener('click', (e) => {
      if (e.target === certLightbox) closeCertLightbox();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certLightbox.classList.contains('open')) {
        closeCertLightbox();
      }
    });
  } else {
    console.warn('Certificate lightbox elements missing', {
      certLightbox: !!certLightbox,
      certImage: !!certImage,
    });
  }

  // Project lightbox
  const projectLightbox = document.getElementById('project-lightbox');
  const projectImage = document.getElementById('project-lightbox-img');
  const projectTitle = document.getElementById('project-lightbox-title');
  const projectDescription = document.getElementById('project-lightbox-desc');
  const projectTags = document.getElementById('project-lightbox-tags');
  const projectLinkRow = document.getElementById('project-lightbox-link-row');
  const projectLinkAnchor = document.getElementById('project-lightbox-link');

  if (
    projectLightbox &&
    projectImage &&
    projectTitle &&
    projectDescription &&
    projectTags
  ) {
    const projectClose = projectLightbox.querySelector(
      '.project-lightbox__close'
    );
    const projectBackdrop = projectLightbox.querySelector(
      '.project-lightbox__backdrop'
    );
    let projectActiveTrigger = null;

    const closeProjectLightbox = () => {
      projectLightbox.classList.remove('open');
      projectLightbox.setAttribute('aria-hidden', 'true');
      projectImage.src = '';
      projectImage.alt = '';
      projectTitle.textContent = '';
      projectDescription.textContent = '';
      projectTags.innerHTML = '';
      if (projectLinkRow) projectLinkRow.hidden = true;
      if (projectLinkAnchor) {
        projectLinkAnchor.removeAttribute('href');
        projectLinkAnchor.textContent = 'Open project';
      }
      setScrollLock(false);
      if (projectActiveTrigger) {
        projectActiveTrigger.focus();
        projectActiveTrigger = null;
      }
    };

    const openProjectLightbox = (card) => {
      const mediaImg = card.querySelector('.project-media img');
      const titleText =
        card.querySelector('.project-title')?.textContent?.trim() || 'Project';
      const descText =
        card.querySelector('.project-desc')?.textContent?.trim() || '';

      projectImage.src = mediaImg ? mediaImg.src : '';
      projectImage.alt = mediaImg ? mediaImg.alt || titleText : 'Project';
      projectTitle.textContent = titleText;
      projectDescription.textContent = descText;

      projectTags.innerHTML = '';
      card.querySelectorAll('.project-tags li').forEach((tagEl) => {
        const li = document.createElement('li');
        li.textContent = tagEl.textContent.trim();
        projectTags.appendChild(li);
      });

      const linkUrl = card.getAttribute('data-project-link');
      const linkLabel = card.getAttribute('data-project-link-label') || 'Open project';
      if (projectLinkRow && projectLinkAnchor && linkUrl) {
        projectLinkAnchor.href = linkUrl;
        projectLinkAnchor.textContent = linkLabel;
        projectLinkRow.hidden = false;
      } else if (projectLinkRow) {
        projectLinkRow.hidden = true;
      }

      projectActiveTrigger = card;
      projectLightbox.classList.add('open');
      projectLightbox.setAttribute('aria-hidden', 'false');
      setScrollLock(true);
      if (projectClose) projectClose.focus();
    };

    document.querySelectorAll('.project-card').forEach((card) => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', () => openProjectLightbox(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProjectLightbox(card);
        }
      });
    });

    if (projectBackdrop)
      projectBackdrop.addEventListener('click', closeProjectLightbox);
    if (projectClose)
      projectClose.addEventListener('click', closeProjectLightbox);
    projectLightbox.addEventListener('click', (e) => {
      if (e.target === projectLightbox) closeProjectLightbox();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectLightbox.classList.contains('open')) {
        closeProjectLightbox();
      }
    });
  } else {
    console.warn('Project lightbox elements missing', {
      projectLightbox: !!projectLightbox,
      projectImage: !!projectImage,
      projectTitle: !!projectTitle,
      projectDescription: !!projectDescription,
      projectTags: !!projectTags,
    });
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

function setScrollLock(locked) {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  document.body.style.overflow = locked ? 'hidden' : '';
}

// certificate lightbox setup
certImages.forEach(img => {
  img.addEventListener('click', () => openLightbox(img.src, img.alt || 'Certificate'));
  img.setAttribute('tabindex', '0');
  img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img.src, img.alt || 'Certificate'); } });
});

// project lightbox setup
function openProjectLightbox(card) {
  const mediaImg = card.querySelector('.project-media img');
  projectImg.src = mediaImg.src;
  projectTitle.textContent = titleText;
  projectDesc.textContent = descText;
  projectLightbox.classList.add('open');
  projectLightbox.setAttribute('aria-hidden','false');
  setScrollLock(true);
  projectClose.focus();
}
document.querySelectorAll('.project-card').forEach(card => {
  card.setAttribute('tabindex','0');
  card.addEventListener('click', () => openProjectLightbox(card));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProjectLightbox(card); } });
});

// Contact modal handlers — append to portfolio_task4_script.js
(function(){
  function closeContactModal(modal, unlockScroll=true) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    if (unlockScroll) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }
  function openContactModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const focusClose = modal.querySelector('.contact-modal__close');
    if (focusClose) focusClose.focus();
  }

  document.addEventListener('DOMContentLoaded', function(){
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    // open by hero/contact button
    const openBtn = document.getElementById('open-contact');
    if (openBtn) openBtn.addEventListener('click', ()=> openContactModal(modal));

    // intercept nav / any anchor that targets #contact and open modal instead of scrolling
    document.querySelectorAll('a[href="#contact"]').forEach(a=>{
      a.addEventListener('click', function(e){
        e.preventDefault();
        openContactModal(modal);
      });
    });

    // close buttons/backdrop
    modal.querySelectorAll('.contact-modal__close').forEach(btn => {
      btn.addEventListener('click', ()=> closeContactModal(modal));
    });
    const backdrop = modal.querySelector('.contact-modal__backdrop');
    if (backdrop) backdrop.addEventListener('click', ()=> closeContactModal(modal));

    // close on Esc
    window.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeContactModal(modal);
      }
    });

    // simple form submission (demo) — prevent actual navigation
    const form = modal.querySelector('.contact-form');
    if (form) {
      form.addEventListener('submit', function(e){
        e.preventDefault();
        // you can replace with real submit logic (fetch)
        form.querySelectorAll('input,textarea,button').forEach(el=>el.setAttribute('disabled',''));
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Sent ✓';
        setTimeout(()=> {
          closeContactModal(modal);
          form.reset();
          if (submitBtn) submitBtn.textContent = 'Send';
          form.querySelectorAll('input,textarea,button').forEach(el=>el.removeAttribute('disabled'));
        }, 950);
      });
    }
  }, { once:true });
})();
