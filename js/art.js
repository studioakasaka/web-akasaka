document.addEventListener('DOMContentLoaded', function () {
  const KEY = 'curtain_once:' + (location && location.pathname ? location.pathname : 'art');

  const curtain = document.querySelector('.curtain-overlay');
  const menu = document.querySelector('.art-menu');
  const bg = document.querySelector('.bg-image');
  const area = document.querySelector('.art_main-area');
  const openBtn = document.querySelector('.open-btn');

  function replaceOpenWithLogo() {
    if (!openBtn) return;
    if (!document.body.contains(openBtn)) return;

    openBtn.outerHTML =
      '<a class="menu-item back-home" href="../index.html" aria-label="Back to Home">' +
        '<img src="../images/home/centerlogo.png" alt="" class="back-icon">' +
      '</a>';
  }

  function scrollAreaToHash(instant) {
    if (!area || !location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;

    requestAnimationFrame(function () {
      area.scrollTo({
        top: target.offsetTop,
        behavior: instant ? 'auto' : 'smooth'
      });
    });
  }

  function applyFixedState(instantScroll) {
    if (menu) menu.classList.add('fixed');
    if (bg) bg.classList.add('fixed');
    if (area) area.classList.add('show');
    replaceOpenWithLogo();
    scrollAreaToHash(instantScroll);
  }

  function preloadImages(urls) {
    const list = (urls || []).filter(Boolean);
    if (!list.length) return Promise.resolve();

    return Promise.all(
      list.map(function (src) {
        return new Promise(function (resolve) {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        });
      })
    );
  }

  function getFirstSlideSrc() {
    const firstImg = document.querySelector('.art-carousel-track picture img');
    if (!firstImg) return null;
    return firstImg.currentSrc || firstImg.src || null;
  }

  if (sessionStorage.getItem(KEY)) {
    if (curtain) curtain.style.display = 'none';
    applyFixedState(true);
  } else {
    const preloadList = [
      '../images/art/art_main.webp',
      getFirstSlideSrc()
    ];

    preloadImages(preloadList).then(function () {
      if (!curtain) return;

      setTimeout(function () {
        curtain.classList.add('open');
      }, 350);

      setTimeout(function () {
        curtain.style.display = 'none';
        sessionStorage.setItem(KEY, '1');
      }, 1500);
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', function (e) {
      e.preventDefault();
      applyFixedState(false);
    });
  }

  document.querySelectorAll('.art-carousel').forEach(function (carousel) {
    const track = carousel.querySelector('.art-carousel-track');
    const slides = Array.from(track.querySelectorAll('picture'));
    const btnNext = carousel.querySelector('.art-carousel-next');
    const btnPrev = carousel.querySelector('.art-carousel-prev');

    if (!track || !slides.length) return;

    let idx = 0;

    function render() {
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    }

    function next() {
      idx = (idx + 1) % slides.length;
      render();
    }

    function prev() {
      idx = (idx - 1 + slides.length) % slides.length;
      render();
    }

    if (btnNext) {
      btnNext.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        next();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        prev();
      });
    }

    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let deltaY = 0;
    let dragging = false;

    track.addEventListener('touchstart', function (e) {
      const t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
      deltaX = 0;
      deltaY = 0;
      dragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      const t = e.changedTouches[0];
      deltaX = t.clientX - startX;
      deltaY = t.clientY - startY;
    }, { passive: true });

    track.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        if (deltaX > 0) prev();
        else next();
      }

      deltaX = 0;
      deltaY = 0;
    }, { passive: true });

    render();
  });
});
