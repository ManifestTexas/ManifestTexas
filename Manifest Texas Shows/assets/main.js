/* ==========================================================================
   Manifest Texas — main.js
   No dependencies. Four jobs: theme toggle, mobile menu, scroll reveals,
   and the "link coming soon" guard for buttons without a URL yet.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Theme toggle (dark is the brand default) --------------------- */
  var SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2.5M12 20v2.5M3.5 12H1M23 12h-2.5M5.1 5.1l1.8 1.8M17.1 17.1l1.8 1.8M18.9 5.1l-1.8 1.8M6.9 17.1l-1.8 1.8"/></svg>';
  var MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.5 13.3A8.5 8.5 0 1 1 10.7 3.5a6.8 6.8 0 0 0 9.8 9.8z"/></svg>';

  var toggle = document.querySelector('[data-theme-toggle]');
  var theme = 'dark'; // brand default; system preference is respected below
  if (window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'dark';

  function applyTheme(next) {
    theme = next;
    root.setAttribute('data-theme', theme);
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? SUN : MOON;
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#050607' : '#f4f5f7');
  }
  applyTheme(theme);
  if (toggle) toggle.addEventListener('click', function () { applyTheme(theme === 'dark' ? 'light' : 'dark'); });

  /* ---- 2. Mobile menu -------------------------------------------------- */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menu.hidden);
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  /* ---- 3. Sticky header shadow + scroll reveals ------------------------ */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.setAttribute('data-stuck', ''); else header.removeAttribute('data-stuck');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var revealTargets = [].slice.call(document.querySelectorAll('.reveal, .clip-in'));
  if (reduce || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---- 4. Links that do not have a URL yet -----------------------------
     Any <a data-link-needed> is inert: it will not navigate, and clicking
     it shows a small "link coming soon" note. To activate a link:
        <a class="btn btn-primary" href="https://real-url">Tickets</a>
     i.e. set the real href and DELETE the data-link-needed attribute.
     ---------------------------------------------------------------------- */
  var toast = document.querySelector('[data-toast]');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.hidden = false;
    toast.textContent = msg;
    requestAnimationFrame(function () { toast.setAttribute('data-visible', ''); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.removeAttribute('data-visible');
      setTimeout(function () { toast.hidden = true; }, 250);
    }, 2600);
  }

  document.querySelectorAll('a[data-link-needed]').forEach(function (a) {
    var label = a.getAttribute('data-show') || a.textContent.trim();
    a.setAttribute('aria-disabled', 'true');
    a.setAttribute('title', 'Link coming soon');
    a.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('Link coming soon — ' + label);
    });
  });

  /* ---- 5. Nav current-section highlight -------------------------------- */
  var sections = [].slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = [].slice.call(document.querySelectorAll('.nav-desktop a'));
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          if (l.getAttribute('href') === '#' + entry.target.id) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- 6. Footer year --------------------------------------------------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
