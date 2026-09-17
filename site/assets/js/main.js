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

/* Respect reduced-motion for every looping decorative clip on the page */
(function () {
  var videos = document.querySelectorAll('.pano-video');
  if (!videos.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var isMobile = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;

  videos.forEach(function (v) {
    if (reduce && reduce.matches) {
      v.removeAttribute('autoplay');
      v.loop = false;
      v.controls = true;
      v.pause();
      return;
    }

    /* Don't spend a visitor's mobile data on a decorative clip */
    if (isMobile) {
      v.removeAttribute('autoplay');
      v.controls = true;
      return;
    }

    /* Only fetch the clip once its band is actually on screen */
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
  });
})();

/* Gallery lightbox: opens a tile full size, arrow keys move through the set */
(function () {
  var grid = document.querySelector('.gal-grid');
  var lb = document.getElementById('lightbox');
  if (!grid || !lb) return;

  var stage = lb.querySelector('.lb__stage');
  var cap = lb.querySelector('.lb__cap');
  var count = lb.querySelector('.lb__count');
  var btnPrev = lb.querySelector('.lb__nav--prev');
  var btnNext = lb.querySelector('.lb__nav--next');
  var btnClose = lb.querySelector('.lb__close');
  var opener = null;
  var items = [];
  var at = -1;

  function visible() {
    return Array.prototype.filter.call(grid.querySelectorAll('.gal-item'), function (el) {
      return !el.hidden;
    });
  }

  function show(i) {
    if (i < 0) i = items.length - 1;
    if (i >= items.length) i = 0;
    at = i;
    var el = items[at];
    var btn = el.querySelector('.gal-btn');
    var src = btn.getAttribute('data-full');
    var text = btn.getAttribute('data-caption') || '';
    var poster = btn.getAttribute('data-poster');

    stage.innerHTML = '';
    var node;
    if (btn.getAttribute('data-type') === 'video') {
      node = document.createElement('video');
      node.src = src;
      if (poster) node.poster = poster;
      node.controls = true;
      node.playsInline = true;
      node.setAttribute('aria-label', text);
      var p = node.play();
      if (p && p.catch) p.catch(function () {});
    } else {
      node = document.createElement('img');
      node.src = src;
      node.alt = text;
    }
    stage.appendChild(node);
    cap.textContent = text;
    count.textContent = (at + 1) + ' of ' + items.length;
  }

  function open(el) {
    items = visible();
    var i = items.indexOf(el);
    if (i < 0) return;
    opener = el.querySelector('.gal-btn');
    lb.hidden = false;
    document.body.classList.add('lb-open');
    show(i);
    btnClose.focus();
  }

  function close() {
    lb.hidden = true;
    document.body.classList.remove('lb-open');
    stage.innerHTML = '';
    if (opener) { opener.focus(); opener = null; }
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.gal-btn');
    if (btn) open(btn.closest('.gal-item'));
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(at - 1); });
  btnNext.addEventListener('click', function () { show(at + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === stage) close(); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowLeft') { show(at - 1); }
    else if (e.key === 'ArrowRight') { show(at + 1); }
    else if (e.key === 'Tab') {
      /* keep focus inside the dialog while it is open */
      var f = lb.querySelectorAll('button, video[controls]');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Filters */
  var filters = document.querySelector('.gal-filters');
  if (!filters) return;
  filters.addEventListener('click', function (e) {
    var b = e.target.closest('.gal-filter');
    if (!b) return;
    var want = b.getAttribute('data-filter');
    filters.querySelectorAll('.gal-filter').forEach(function (x) {
      x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
    });
    grid.querySelectorAll('.gal-item').forEach(function (el) {
      el.hidden = !(want === 'all' || el.getAttribute('data-group') === want);
    });
  });
})();
