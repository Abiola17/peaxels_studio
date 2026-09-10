/* ══════════════════════════════════════════════════════════
   PEAXELS STUDIO — Ayeelagbe Peace
   script.js · v3
══════════════════════════════════════════════════════════ */
'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

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

/* ── 8b. Brand pills — fluid mouse repulsion ─────────── */
(function brandPills() {
  const wall = document.getElementById('brandWall');
  if (!wall || isTouch || reduceMotion) return;
  const pills = [...wall.querySelectorAll('.bw-pill')].map(el => ({
    el,
    x: 0, y: 0, tx: 0, ty: 0,
    ease: 0.10 + Math.random() * 0.06   // per-pill drift, organic
  }));

  const RADIUS = 165;   // px influence
  const MAX = 52;       // px max push
  let px = -9999, py = -9999, active = false, raf = null;

  const onMove = e => {
    px = e.clientX; py = e.clientY;
    active = true;
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const onLeave = () => { active = false; };

  function tick() {
    let alive = false;
    for (const p of pills) {
      if (active) {
        const r = p.el.getBoundingClientRect();
        // resting centre = current centre minus current displacement
        const cx = r.left + r.width / 2 - p.x;
        const cy = r.top + r.height / 2 - p.y;
        const dx = cx - px, dy = cy - py;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS) {
          const f = (1 - dist / RADIUS);
          const push = f * f * MAX;
          const n = dist || 1;
          p.tx = (dx / n) * push;
          p.ty = (dy / n) * push;
        } else { p.tx = 0; p.ty = 0; }
      } else { p.tx = 0; p.ty = 0; }

      p.x += (p.tx - p.x) * p.ease;
      p.y += (p.ty - p.y) * p.ease;

      if (Math.abs(p.x) > 0.15 || Math.abs(p.y) > 0.15 ||
          Math.abs(p.tx) > 0.15 || Math.abs(p.ty) > 0.15) alive = true;

      p.el.style.setProperty('--px', p.x.toFixed(2) + 'px');
      p.el.style.setProperty('--py', p.y.toFixed(2) + 'px');
    }
    if (alive || active) { raf = requestAnimationFrame(tick); }
    else {
      raf = null;
      pills.forEach(p => { p.el.style.setProperty('--px', '0px'); p.el.style.setProperty('--py', '0px'); });
    }
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
})();

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

/* ── 11. Projects filter ─────────────────────────────── */
(function projectFilter() {
  const wrap = document.getElementById('filters');
  const grid = document.getElementById('arcGrid');
  const empty = document.getElementById('arcEmpty');
  if (!wrap || !grid) return;

  const cards = [...grid.querySelectorAll('.acard')];
  const buttons = [...wrap.querySelectorAll('.filter')];

  const apply = cat => {
    let shown = 0;
    cards.forEach((card, i) => {
      const match = cat === 'all' || card.dataset.cat === cat;
      if (match) {
        shown++;
        card.classList.remove('hide');
        card.classList.add('fade');
        setTimeout(() => card.classList.remove('fade'), 20 + i * 35);
      } else {
        card.classList.add('hide');
      }
    });
    if (empty) empty.hidden = shown !== 0;
  };

  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    apply(btn.dataset.filter);
  }));

  // deep-link: projects.html?cat=branding
  const q = new URLSearchParams(location.search).get('cat');
  if (q) {
    const b = buttons.find(x => x.dataset.filter === q);
    if (b) b.click();
  }
})();

/* ── 12. Year stamp ──────────────────────────────────── */
document.querySelectorAll('#yr').forEach(el => el.textContent = new Date().getFullYear());

console.log('%c Peaxels Studio — Ayeelagbe Peace ', 'background:#EE5522;color:#fff;padding:4px 12px;font-weight:700;font-size:12px;');
