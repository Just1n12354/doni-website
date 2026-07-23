/* ============================================================
   DONI Hauswart & Reinigung – main.js
   Navigation, Scroll-Effekte, Reveal-Animationen
   ============================================================ */
(function () {
  'use strict';

  /* ---- Jahr im Footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile-Navigation ---- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function closeNav() {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menü öffnen');
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Menü schliessen' : 'Menü öffnen');
    });

    // Menü nach Klick auf einen Link schliessen
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Menü mit Escape schliessen
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Menü bei Klick ausserhalb schliessen
    document.addEventListener('click', function (e) {
      if (mainNav.classList.contains('open') &&
          !mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });
  }

  /* ---- Header-Schatten & Back-to-top beim Scrollen ---- */
  var header = document.querySelector('.site-header');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (backToTop) backToTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Reveal-Animationen ---- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: alles sofort anzeigen
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Scrollspy: aktiven Menüpunkt hervorheben ---- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.main-nav a[href^="#"]:not(.nav-cta)')
  );
  var linkById = {};
  var spySections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) { linkById[id] = link; spySections.push(section); }
  });

  if ('IntersectionObserver' in window && spySections.length) {
    function setActive(id) {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      if (linkById[id]) linkById[id].classList.add('active');
    }
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    spySections.forEach(function (s) { spyObserver.observe(s); });
  }
})();
