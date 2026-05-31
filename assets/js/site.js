/* HyenaMind.com — Site JS v1.0 */
(function () {
  'use strict';

  // ---------- Header scroll state ----------
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Mobile menu toggle ----------
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.innerHTML = open ? '✕' : '☰';
    });
    // Close mobile menu when nav link clicked
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.innerHTML = '☰';
        }
      });
    });
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq__item').forEach(item => {
    const btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // ---------- Reveal-on-scroll (only enables animation when IO is available) ----------
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-anim');
    const reveals = document.querySelectorAll('.reveal');
    // Items already in viewport on first paint: mark immediately so they don't flash
    const inViewport = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    reveals.forEach(el => { if (inViewport(el)) el.classList.add('in'); });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // ---------- Demo form handler ----------
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.querySelector('.form__success');
      if (success) {
        success.classList.add('show');
        form.querySelectorAll('input, textarea, select, button[type="submit"]').forEach(el => el.disabled = true);
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // ---------- Multi-step form (book strategy call) ----------
  document.querySelectorAll('.form--multistep').forEach(form => {
    const pages = form.querySelectorAll('.form__page');
    const steps = form.querySelectorAll('.form__step');
    let idx = 0;

    const render = () => {
      pages.forEach((p, i) => p.classList.toggle('active', i === idx));
      steps.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
        s.classList.toggle('done', i < idx);
      });
    };

    form.addEventListener('click', (e) => {
      const next = e.target.closest('[data-next]');
      const prev = e.target.closest('[data-prev]');
      if (next) {
        e.preventDefault();
        const currentInputs = pages[idx].querySelectorAll('input[required], select[required]');
        let ok = true;
        currentInputs.forEach(i => { if (!i.value) { i.style.borderColor = 'var(--error)'; ok = false; } });
        if (!ok) return;
        if (idx < pages.length - 1) { idx++; render(); }
      }
      if (prev) {
        e.preventDefault();
        if (idx > 0) { idx--; render(); }
      }
    });

    render();
  });

  // ---------- Scheduler slot mock ----------
  document.querySelectorAll('.scheduler__slot:not(.taken)').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.scheduler__slot').forEach(s => s.style.borderColor = '');
      slot.style.borderColor = 'var(--voltage)';
      slot.style.background = 'var(--voltage)';
      slot.style.color = 'var(--void)';
      const note = document.querySelector('.scheduler__note');
      if (note) note.textContent = `Selected: ${slot.dataset.day || ''} ${slot.textContent} ET — submit the form below to confirm.`;
    });
  });

  // ---------- Inject current year into footer ----------
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
