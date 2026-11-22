(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Count-up numbers in the telemetry strip
  var nums = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var start = null, dur = 1100;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { co.observe(n); });
  }

  // Timeline line draws with scroll; nodes light up as the line passes them
  var tl = document.querySelector('.timeline');
  var fill = document.querySelector('.timeline__fill');
  var items = document.querySelectorAll('.tl');
  function drawLine() {
    if (!tl || !fill) return;
    var r = tl.getBoundingClientRect();
    var mark = window.innerHeight * 0.6;
    var h = Math.max(0, Math.min(r.height, mark - r.top));
    fill.style.height = h + 'px';
    items.forEach(function (li) {
      var y = li.offsetTop + 10;
      li.classList.toggle('is-on', h >= y);
    });
  }
  if (reduce) {
    if (fill) fill.style.height = '100%';
    items.forEach(function (li) { li.classList.add('is-on'); });
  } else {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(function () { drawLine(); ticking = false; }); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', drawLine);
    drawLine();
  }

  // Close the projects menu after choosing a project
  document.querySelectorAll('.nav__menu a').forEach(function (a) {
    a.addEventListener('click', function () { a.blur(); });
  });

  // Lightbox
  var box = document.querySelector('.lightbox');
  if (box && typeof box.showModal === 'function') {
    var img = box.querySelector('img');
    document.querySelectorAll('.shot').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var inner = btn.querySelector('img');
        img.src = btn.dataset.full;
        img.alt = inner ? inner.alt : '';
        box.showModal();
      });
    });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__close')) box.close();
    });
  }
})();
