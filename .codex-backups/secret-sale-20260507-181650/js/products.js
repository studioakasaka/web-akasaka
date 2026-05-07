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


  function initProductLightbox() {
    const cards = Array.from(document.querySelectorAll('.product-gallery-card[data-gallery]'));
    if (!cards.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'product-lightbox';
    lightbox.hidden = true;
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Product image viewer');
    lightbox.innerHTML =
      '<button class="product-lightbox-btn product-lightbox-close" type="button" aria-label="Close image viewer">&times;</button>' +
      '<button class="product-lightbox-btn product-lightbox-prev" type="button" aria-label="Previous image">&#8592;</button>' +
      '<figure class="product-lightbox-figure">' +
        '<img class="product-lightbox-image" src="" alt="">' +
        '<figcaption class="product-lightbox-caption"></figcaption>' +
      '</figure>' +
      '<button class="product-lightbox-btn product-lightbox-next" type="button" aria-label="Next image">&#8594;</button>';
    document.body.appendChild(lightbox);

    const image = lightbox.querySelector('.product-lightbox-image');
    const caption = lightbox.querySelector('.product-lightbox-caption');
    const closeBtn = lightbox.querySelector('.product-lightbox-close');
    const prevBtn = lightbox.querySelector('.product-lightbox-prev');
    const nextBtn = lightbox.querySelector('.product-lightbox-next');
    let gallery = [];
    let index = 0;
    let title = '';

    function renderLightbox() {
      if (!gallery.length) return;
      image.src = gallery[index];
      image.alt = title + ' image ' + (index + 1);
      caption.textContent = title + '  ' + (index + 1) + ' / ' + gallery.length;
    }

    function openLightbox(card) {
      gallery = (card.getAttribute('data-gallery') || '')
        .split('|')
        .map(function (src) { return src.trim(); })
        .filter(Boolean);
      if (!gallery.length) return;
      title = card.getAttribute('data-title') || card.querySelector('figcaption')?.textContent || 'Product';
      index = 0;
      renderLightbox();
      lightbox.hidden = false;
      document.body.classList.add('product-lightbox-open');
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove('product-lightbox-open');
      image.removeAttribute('src');
    }

    function showNext() {
      index = (index + 1) % gallery.length;
      renderLightbox();
    }

    function showPrev() {
      index = (index - 1 + gallery.length) % gallery.length;
      renderLightbox();
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        openLightbox(card);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(card);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  initProductLightbox();

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