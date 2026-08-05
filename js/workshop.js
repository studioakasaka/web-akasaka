document.addEventListener('DOMContentLoaded', function () {

  // ----- Workshop carousel -----
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    const track = carousel.querySelector('.workshop-carousel-track');
    const slides = Array.from(track.querySelectorAll('.workshop-slide'));
    const btnPrev = carousel.querySelector('.carousel-prev');
    const btnNext = carousel.querySelector('.carousel-next');
    const statusCurrent = carousel.querySelector('[data-current]');
    const statusTotal = carousel.querySelector('[data-total]');

    if (!track || !slides.length) return;

    var idx = 0;

    function render() {
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      if (statusCurrent) statusCurrent.textContent = idx + 1;
      if (statusTotal) statusTotal.textContent = slides.length;
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

    // Touch swipe
    var startX = 0;
    var startY = 0;
    var deltaX = 0;
    var deltaY = 0;
    var dragging = false;

    track.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
      deltaX = 0;
      deltaY = 0;
      dragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var t = e.changedTouches[0];
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

    // Image error fallback: add missing-image class so CSS shows "IMAGE" placeholder
    slides.forEach(function (slide) {
      var img = slide.querySelector('img');
      if (!img) return;
      if (img.complete && img.naturalWidth === 0) {
        img.classList.add('missing-image');
      }
      img.addEventListener('error', function () {
        img.classList.add('missing-image');
      });
    });

    render();
  });

});