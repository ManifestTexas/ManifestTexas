/* ==========================================================================
   Manifest Texas: site.js (Nov 2026 rebuild). No dependencies.
   1 menu · 2 sticky header + nav highlight · 3 hero reel
   4 next show wraps itself after its end time · 5 flyer/video viewer · 6 year
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1 — Mobile menu ------------------------------------------------------ */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });
  }

  /* 2 — Sticky header border + current-section highlight ----------------- */
  var header = document.querySelector('[data-header]');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.setAttribute('data-stuck', '');
    else header.removeAttribute('data-stuck');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var navLinks = [].slice.call(document.querySelectorAll('.nav a'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* 3 — Hero reel: muted autoplay loop with a sound toggle ---------------
     With reduced motion on, it waits for a tap instead of autoplaying. */
  var reel = document.querySelector('[data-hero-reel]');
  var soundBtn = document.querySelector('[data-sound-toggle]');
  var playBtn = document.querySelector('[data-reel-play]');
  if (reel) {
    var showPlay = function () { if (playBtn) playBtn.hidden = false; };
    var hidePlay = function () { if (playBtn) playBtn.hidden = true; };

    if (reduceMotion) {
      reel.removeAttribute('autoplay');
      reel.pause();
      showPlay();
    } else {
      var p = reel.play();
      if (p && typeof p.catch === 'function') p.catch(showPlay); // e.g. iOS Low Power Mode
    }
    reel.addEventListener('play', hidePlay);
    if (playBtn) playBtn.addEventListener('click', function () { reel.play(); });

    if (soundBtn) {
      soundBtn.addEventListener('click', function () {
        var turnOn = reel.muted;
        reel.muted = !turnOn;
        if (turnOn) { reel.currentTime = 0; reel.play(); }
        soundBtn.setAttribute('aria-pressed', String(turnOn));
        soundBtn.textContent = turnOn ? 'Sound off' : 'Sound on';
      });
    }

    // Pause the reel while it is off screen, resume when it comes back.
    if ('IntersectionObserver' in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { if (reel.paused) reel.play().catch(showPlay); }
          else if (!reel.paused) reel.pause();
        });
      }, { threshold: 0.2 }).observe(reel);
    }
  }

  /* 4 — Next show wraps itself ------------------------------------------
     After data-ends on #next, RSVP buttons hide and a "that's a wrap" note
     shows, so the site never sends people to a finished event. */
  var next = document.querySelector('[data-ends]');
  if (next) {
    var ends = Date.parse(next.getAttribute('data-ends'));
    if (!isNaN(ends) && Date.now() > ends) {
      document.querySelectorAll('[data-rsvp]').forEach(function (el) { el.hidden = true; });
      var wrapped = document.querySelector('[data-wrapped]');
      if (wrapped) wrapped.hidden = false;
      var kicker = document.querySelector('[data-next-kicker]');
      if (kicker) kicker.textContent = 'Our latest show';
    }
  }

  /* 5 — Viewer: full-size flyers and promo/recap videos ------------------ */
  var viewer = document.querySelector('[data-viewer]');
  var stage = document.querySelector('[data-viewer-stage]');
  var lastFocus = null;

  function pauseAllPageVideos() {
    document.querySelectorAll('main video').forEach(function (v) { if (!v.paused) v.pause(); });
  }
  function openViewer(node, label) {
    if (!viewer || !stage) return;
    lastFocus = document.activeElement;
    stage.innerHTML = '';
    stage.appendChild(node);
    viewer.setAttribute('aria-label', label || 'Viewer');
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  }
  function closeViewer() {
    if (!viewer) return;
    var v = stage.querySelector('video');
    if (v) v.pause();
    if (viewer.open && typeof viewer.close === 'function') viewer.close();
    else viewer.removeAttribute('open');
  }
  if (viewer) {
    viewer.addEventListener('close', function () {
      stage.innerHTML = '';
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    viewer.addEventListener('click', function (e) {
      if (e.target === viewer || e.target === stage) closeViewer();
    });
    var closeBtn = viewer.querySelector('[data-viewer-close]');
    if (closeBtn) closeBtn.addEventListener('click', closeViewer);
  }

  document.querySelectorAll('[data-video]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      pauseAllPageVideos();
      var v = document.createElement('video');
      v.src = btn.getAttribute('data-video');
      v.poster = btn.getAttribute('data-poster') || '';
      v.controls = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      if (btn.getAttribute('data-shape') === 'wide') v.className = 'is-wide';
      openViewer(v, btn.getAttribute('data-title'));
      var p = v.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    });
  });

  document.querySelectorAll('[data-flyer]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = document.createElement('img');
      img.src = btn.getAttribute('data-flyer');
      img.width = Number(btn.getAttribute('data-flyer-w')) || 1100;
      img.height = Number(btn.getAttribute('data-flyer-h')) || 1100;
      var inner = btn.querySelector('img');
      img.alt = inner ? inner.alt : '';
      openViewer(img, btn.getAttribute('aria-label'));
    });
  });

  /* 6 — Footer year ------------------------------------------------------ */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
