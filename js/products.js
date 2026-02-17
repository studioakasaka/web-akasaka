document.addEventListener('DOMContentLoaded', function () {
  initCurtainOnce({
    preloadImages: [
      '../images/products/products_main.jpg'
    ],
    firstImageSelectors: [
      '.products-carousel-track picture img'
    ],
    menuSel: '.products-menu',
    bgSel: '.bg-image',
    contentSel: '.products-area',
    applyFixedOnRepeat: true
  });

  /* 既存処理はこの下そのまま */
});

  /* ===== Curtain: one-time + preload ===== */
  initCurtainOnce({
    // 背景帯
    preloadImages: [
      '../images/products/products_main.jpg'
    ],
    // カルーセルの「最初の1枚」を拾う
    firstImageSelectors: [
      '.products-carousel-track picture img'
    ]
  });

  /* ===== 既存処理 ===== */
  const menu = document.querySelector('.products-menu');
  const bg = document.querySelector('.bg-image');
  const area = document.querySelector('.products-area');

  document.querySelectorAll('.products-menu .menu-item').forEach(a => {
    if (a.classList.contains('back-home')) return;

    a.addEventListener('click', (e) => {
      e.preventDefault();

      menu.classList.add('fixed');
      bg.classList.add('fixed');
      area.classList.add('show');

      const targetId =
        a.getAttribute('data-target') ||
        a.getAttribute('href')?.replace('#', '');

      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
          const headerOffset = 16;
          const y = target.offsetTop - headerOffset;
          area.scrollTo({ top: y, behavior: 'smooth' });
        }
      }

      document
        .querySelectorAll('.products-menu .menu-item')
        .forEach(m => m.classList.remove('active'));

      a.classList.add('active');
      history.replaceState(null, '', `#${targetId}`);
    });
  });

  document.querySelectorAll('.products-carousel').forEach(carousel => {
    const track = carousel.querySelector('.products-carousel-track');
    const slides = Array.from(track.querySelectorAll('picture'));
    let idx = 0;

    const render = () => {
      track.style.transform = `translateX(-${idx * 100}%)`;
    };

    const next = () => {
      idx = (idx + 1) % slides.length;
      render();
    };

    const prev = () => {
      idx = (idx - 1 + slides.length) % slides.length;
      render();
    };

    carousel
      .querySelector('.products-carousel-next')
      ?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        next();
      });

    carousel
      .querySelector('.products-carousel-prev')
      ?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prev();
      });

    let startX = 0;
    let deltaX = 0;
    let dragging = false;

    track.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX;
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      deltaX = e.clientX - startX;
    });

    track.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;

      if (deltaX > 40) prev();
      else if (deltaX < -40) next();

      deltaX = 0;
    });

    render();
  });

  if (location.hash) {
    const a = document.querySelector(
      `.products-menu .menu-item[href="${location.hash}"]`
    );

    if (a) {
      a.click();
    } else {
      menu.classList.add('fixed');
      bg.classList.add('fixed');
      area.classList.add('show');

      const target = document.querySelector(location.hash);
      if (target) {
        area.scrollTo({ top: target.offsetTop - 16, behavior: 'instant' });
      }
    }
  }
