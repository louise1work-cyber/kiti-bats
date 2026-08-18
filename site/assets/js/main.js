/* Mobile navigation toggle */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
})();

/* Respect reduced-motion for the looping workshop clip */
(function () {
  var v = document.querySelector('.pano-video');
  if (!v) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce && reduce.matches) {
    v.removeAttribute('autoplay');
    v.loop = false;
    v.controls = true;
    v.pause();
    return;
  }

  /* Only fetch the clip once the band is actually on screen */
  if (!('IntersectionObserver' in window)) { v.preload = 'auto'; v.load(); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        v.preload = 'auto';
        v.load();
        var p = v.play();
        if (p && p.catch) p.catch(function () { v.controls = true; });
        io.disconnect();
      }
    });
  }, { rootMargin: '200px' });
  io.observe(v);
})();
