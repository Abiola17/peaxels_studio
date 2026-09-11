/* ══════════════════════════════════════════════════════════
   PEAXELS STUDIO — Ayeelagbe Peace
   script.js · v3
══════════════════════════════════════════════════════════ */
'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;
document.body.classList.toggle('is-touch', isTouch);

let openLightbox = null; // set by the lightbox controller (section 12), used by gallery + work-card click handlers

/* ── 1. Custom cursor ─────────────────────────────────── */
(function cursor() {
  if (isTouch || reduceMotion) return;
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  document.body.classList.add('cursor-on');

  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  (function loop() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  addEventListener('mouseout', e => {
    if (!e.relatedTarget) { dot.style.opacity = '0'; ring.style.opacity = '0'; }
  });
  addEventListener('mouseover', () => { dot.style.opacity = '1'; ring.style.opacity = '0.45'; });
})();

/* ── 2. Navigation ───────────────────────────────────── */
(function nav() {
  const bar = document.getElementById('nav');
  if (!bar) return;
  const isProjects = document.body.classList.contains('page-projects');
  let lastY = 0, ticking = false;

  addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = scrollY;
      bar.classList.toggle('solid', isProjects || y > 24);
      bar.classList.toggle('hidden', y > lastY && y > 240);
      lastY = y;
      ticking = false;
    });
    ticking = true;
  });
})();

/* ── 3. Mobile menu ──────────────────────────────────── */
(function mobileMenu() {
  const burger = document.getElementById('navHamburger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  const close = () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── 4. Smooth scroll for in-page anchors ────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });
});

/* ── 5. Reveal on scroll ─────────────────────────────── */
(function reveal() {
  const els = document.querySelectorAll('.reveal, .reveal-line');
  if (!els.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));

  addEventListener('load', () => {
    els.forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) {
        setTimeout(() => el.classList.add('visible'), 60);
      }
    });
  });
})();

/* ── 6. Count-up ─────────────────────────────────────── */
(function countUp() {
  const nums = document.querySelectorAll('.count[data-to]');
  if (!nums.length) return;

  const run = el => {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const dur = 1600, start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  };

  if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => { if (en.isIntersecting) { run(en.target); obs.unobserve(en.target); } });
  }, { threshold: 0.6 });
  nums.forEach(el => io.observe(el));
})();

/* ── 7. Magnetic buttons ─────────────────────────────── */
if (!isTouch && !reduceMotion) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ── 8. Work card tilt ───────────────────────────────── */
if (!isTouch && !reduceMotion) {
  document.querySelectorAll('.wcard').forEach(card => {
    const art = card.querySelector('.wcard-art');
    if (!art) return;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
      art.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.015)`;
    });
    card.addEventListener('mouseleave', () => { art.style.transform = ''; });
  });
}

/* ── 9. Testimonials — static chat wall, no JS needed ── */

/* ── 10. Active nav link on scroll (home only) ───────── */
(function activeNav() {
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = [...document.querySelectorAll('section[id], header[id]')];
  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${en.target.id}"]`);
      if (match) match.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => io.observe(s));
})();

/* ── 11. Project brand tabs ──────────────────────────── */
(function projectTabs() {
  const bar = document.getElementById('tabbar');
  if (!bar) return;
  const inner = bar.querySelector('.tabbar-inner');
  const tabs = [...bar.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.tabpanel')];
  if (!inner || !tabs.length) return;

  const pad2 = n => (n < 10 ? '0' : '') + n;

  let indicator = inner.querySelector('.tab-indicator');
  if (!indicator) {
    indicator = document.createElement('span');
    indicator.className = 'tab-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    inner.prepend(indicator);
  }
  indicator.classList.add('no-anim');

  // stamp panel numerals and stagger indices
  panels.forEach(p => {
    const n = p.querySelectorAll('.gallery figure').length;
    const badge = p.querySelector('.panel-count');
    if (badge) badge.textContent = n ? pad2(n) : '';
    p.querySelectorAll('.gallery').forEach(g => {
      [...g.querySelectorAll('figure')].forEach((f, i) => f.style.setProperty('--i', i));
    });
  });

  const place = tab => {
    if (!tab) return;
    indicator.style.setProperty('--x', tab.offsetLeft + 'px');
    indicator.style.setProperty('--w', tab.offsetWidth + 'px');
  };

  let booted = false;

  const activate = (id, scrollPage) => {
    if (!tabs.some(t => t.dataset.panel === id)) id = tabs[0].dataset.panel;
    let active = tabs[0];
    tabs.forEach(t => {
      const on = t.dataset.panel === id;
      if (on) active = t;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(p => {
      const on = p.id === 'panel-' + id;
      p.classList.toggle('active', on);
      if (on) p.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    });
    place(active);
    if (booted) active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#' + id);
    if (scrollPage) {
      const y = bar.getBoundingClientRect().top + window.scrollY
              - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 100);
      window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(t.dataset.panel, true));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      tabs[j].focus();
      activate(tabs[j].dataset.panel, false);
    });
  });

  addEventListener('hashchange', () => activate(location.hash.replace('#', ''), true));

  let rz;
  addEventListener('resize', () => {
    clearTimeout(rz);
    indicator.classList.add('no-anim');
    place(tabs.find(t => t.classList.contains('active')));
    rz = setTimeout(() => indicator.classList.remove('no-anim'), 120);
  });

  activate(location.hash.replace('#', ''), false);
  requestAnimationFrame(() => {
    place(tabs.find(t => t.classList.contains('active')));
    requestAnimationFrame(() => { indicator.classList.remove('no-anim'); booted = true; });
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      indicator.classList.add('no-anim');
      place(tabs.find(t => t.classList.contains('active')));
      requestAnimationFrame(() => indicator.classList.remove('no-anim'));
    });
  }
  addEventListener('load', () => place(tabs.find(t => t.classList.contains('active'))));
})();

/* ── 12. Lightbox — zoomable design viewer ───────────── */
(function lightbox() {
  const root = document.getElementById('lightbox');
  if (!root) return;
  const frame    = document.getElementById('lbFrame');
  const img      = document.getElementById('lbImg');
  const caption  = document.getElementById('lbCaption');
  const countEl  = document.getElementById('lbCount');
  const zoomEl   = document.getElementById('lbZoomLevel');
  const prevBtn  = document.getElementById('lbPrev');
  const nextBtn  = document.getElementById('lbNext');
  const zoomIn   = document.getElementById('lbZoomIn');
  const zoomOut  = document.getElementById('lbZoomOut');
  const resetBtn = document.getElementById('lbReset');
  const closeBtn = document.getElementById('lbClose');

  const ZMIN = 1, ZMAX = 4, ZSTEP = .5;
  let items = [], index = 0, z = 1, px = 0, py = 0;
  let dragging = false, dragStart = null, panStart = null, pinchStart = null;
  let lastFocus = null;

  function applyTransform() {
    img.style.setProperty('--z', z);
    img.style.setProperty('--px', px + 'px');
    img.style.setProperty('--py', py + 'px');
    zoomEl.textContent = Math.round(z * 100) + '%';
    frame.classList.toggle('zoomed', z > 1);
  }

  function clampPan() {
    const maxX = (img.offsetWidth * (z - 1)) / 2 + 60;
    const maxY = (img.offsetHeight * (z - 1)) / 2 + 60;
    px = Math.max(-maxX, Math.min(maxX, px));
    py = Math.max(-maxY, Math.min(maxY, py));
  }

  function setZoom(next) {
    next = Math.round(Math.max(ZMIN, Math.min(ZMAX, next)) * 100) / 100;
    if (next === z) return;
    z = next;
    if (z === ZMIN) { px = 0; py = 0; }
    clampPan();
    applyTransform();
  }

  function render() {
    const it = items[index];
    if (!it) return;
    img.src = it.src;
    img.alt = it.alt || '';
    caption.textContent = it.caption || '';
    const multi = items.length > 1;
    countEl.textContent = multi ? `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}` : '';
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
    z = 1; px = 0; py = 0;
    applyTransform();
  }

  function open(list, startIndex) {
    if (!list || !list.length) return;
    items = list;
    index = startIndex || 0;
    lastFocus = document.activeElement;
    render();
    root.classList.add('open');
    root.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    root.classList.remove('open');
    root.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function go(delta) {
    if (items.length < 2) return;
    index = (index + delta + items.length) % items.length;
    render();
  }

  root.querySelectorAll('[data-lb-close]').forEach(el => el.addEventListener('click', close));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));
  zoomIn.addEventListener('click', () => setZoom(z + ZSTEP));
  zoomOut.addEventListener('click', () => setZoom(z - ZSTEP));
  resetBtn.addEventListener('click', () => setZoom(1));

  img.addEventListener('dblclick', e => { e.preventDefault(); setZoom(z > 1 ? 1 : 2.5); });
  img.addEventListener('click', e => {
    e.stopPropagation();
    if (z === 1) setZoom(2.5);
  });

  frame.addEventListener('wheel', e => {
    e.preventDefault();
    setZoom(z + (e.deltaY < 0 ? ZSTEP : -ZSTEP));
  }, { passive: false });

  frame.addEventListener('mousedown', e => {
    if (z === 1) return;
    dragging = true;
    frame.classList.add('dragging');
    dragStart = { x: e.clientX, y: e.clientY };
    panStart = { x: px, y: py };
  });
  addEventListener('mousemove', e => {
    if (!dragging) return;
    px = panStart.x + (e.clientX - dragStart.x);
    py = panStart.y + (e.clientY - dragStart.y);
    clampPan();
    applyTransform();
  });
  addEventListener('mouseup', () => { dragging = false; frame.classList.remove('dragging'); });

  function touchDist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }

  frame.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      pinchStart = { dist: touchDist(e.touches), z };
    } else if (e.touches.length === 1 && z > 1) {
      dragging = true;
      dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStart = { x: px, y: py };
    }
  }, { passive: true });
  frame.addEventListener('touchmove', e => {
    if (e.touches.length === 2 && pinchStart) {
      e.preventDefault();
      setZoom(pinchStart.z * (touchDist(e.touches) / pinchStart.dist));
    } else if (dragging && e.touches.length === 1) {
      e.preventDefault();
      px = panStart.x + (e.touches[0].clientX - dragStart.x);
      py = panStart.y + (e.touches[0].clientY - dragStart.y);
      clampPan();
      applyTransform();
    }
  }, { passive: false });
  frame.addEventListener('touchend', () => { dragging = false; pinchStart = null; frame.classList.remove('dragging'); });

  addEventListener('keydown', e => {
    if (!root.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === '+' || e.key === '=') setZoom(z + ZSTEP);
    else if (e.key === '-') setZoom(z - ZSTEP);
    else if (e.key === '0') setZoom(1);
  });

  openLightbox = open;
})();

/* ── 13. Wire galleries + work cards into the lightbox ─ */
(function lightboxSources() {
  if (!document.getElementById('lightbox')) return;

  // Project galleries — each .gallery is its own browsable set
  document.addEventListener('click', e => {
    const a = e.target.closest('.gallery a');
    if (!a) return;
    const gallery = a.closest('.gallery');
    if (!gallery) return;
    e.preventDefault();
    const figs = [...gallery.querySelectorAll('figure')];
    const brandName = a.closest('.tabpanel')?.querySelector('.brand-name')?.textContent.trim() || '';
    const items = figs.map((fig, i) => {
      const link = fig.querySelector('a');
      const im = fig.querySelector('img');
      const cap = fig.querySelector('figcaption');
      return {
        src: link ? link.getAttribute('href') : im.src,
        alt: im ? im.alt : '',
        caption: cap ? cap.textContent.trim() : (brandName ? `${brandName} — ${String(i + 1).padStart(2, '0')}` : '')
      };
    });
    const idx = figs.indexOf(a.closest('figure'));
    if (openLightbox) openLightbox(items, idx);
  });

  // Home page featured work cards
  const cards = [...document.querySelectorAll('.wcard')];
  if (cards.length) {
    const cardItems = cards.map(card => {
      const im = card.querySelector('.wcard-art img');
      const h3 = card.querySelector('.wcard-meta h3')?.textContent.trim() || '';
      const sub = card.querySelector('.wcard-meta span')?.textContent.trim() || '';
      return { src: im ? im.src : '', alt: im ? im.alt : '', caption: [h3, sub].filter(Boolean).join(' · ') };
    });
    cards.forEach((card, i) => {
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View ${cardItems[i].caption || 'design'} full size`);
      card.addEventListener('click', () => { if (openLightbox) openLightbox(cardItems, i); });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (openLightbox) openLightbox(cardItems, i); }
      });
    });
  }
})();

/* ── 14. Year stamp ──────────────────────────────────── */
document.querySelectorAll('#yr').forEach(el => el.textContent = new Date().getFullYear());

console.log('%c Peaxels Studio — Ayeelagbe Peace ', 'background:#EE5522;color:#fff;padding:4px 12px;font-weight:700;font-size:12px;');
