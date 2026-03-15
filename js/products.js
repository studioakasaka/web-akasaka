document.addEventListener('DOMContentLoaded', function () {
  const menu = document.querySelector('.products-menu');
  const bg = document.querySelector('.bg-image');
  const area = document.querySelector('.products-area');

  initCurtainOnce({
    preloadImages: [
      '../images/products/products_main.webp'
    ],
    firstImageSelectors: [
      '.products-carousel-track picture img'
    ],
    menuSel: '.products-menu',
    bgSel: '.bg-image',
    contentSel: '.products-area',
    applyFixedOnRepeat: true
  });

  function showProductsArea() {
    if (menu) menu.classList.add('fixed');
    if (bg) bg.classList.add('fixed');
    if (area) area.classList.add('show');
  }

  function activateCategory(link, instant) {
    if (!link) return;

    showProductsArea();

    const targetId =
      link.getAttribute('data-target') ||
      (link.getAttribute('href') || '').replace('#', '');

    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (target && area) {
      const y = target.offsetTop - 16;
      area.scrollTo({
        top: y,
        behavior: instant ? 'auto' : 'smooth'
      });
    }

    document.querySelectorAll('.products-menu .menu-item').forEach(function (item) {
      item.classList.remove('active');
    });

    link.classList.add('active');
    history.replaceState(null, '', '#' + targetId);
  }

  document.querySelectorAll('.products-menu .menu-item').forEach(function (link) {
    if (link.classList.contains('back-home')) return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      activateCategory(link, false);
    });
  });

  document.querySelectorAll('.products-carousel').forEach(function (carousel) {
    const track = carousel.querySelector('.products-carousel-track');
    const slides = Array.from(track.querySelectorAll('picture'));
    const btnNext = carousel.querySelector('.products-carousel-next');
    const btnPrev = carousel.querySelector('.products-carousel-prev');

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

  if (location.hash) {
    const currentLink = document.querySelector(
      '.products-menu .menu-item[href="' + location.hash + '"]'
    );

    if (currentLink) {
      activateCategory(currentLink, true);
    } else {
      showProductsArea();
      const target = document.querySelector(location.hash);
      if (target && area) {
        area.scrollTo({
          top: target.offsetTop - 16,
          behavior: 'auto'
        });
      }
    }
  }
});