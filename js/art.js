document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     artページ：カーテン一度きり＋2回目以降は固定開始＆Open→ロゴ
     背景画像／先頭スライド画像をプリロードしてから初回カーテン開く
  ========================================================== */

  const KEY = 'curtain_once:' + (location && location.pathname ? location.pathname : 'art');

  const curtain = document.querySelector('.curtain-overlay');
  const menu    = document.querySelector('.art-menu');
  const bg      = document.querySelector('.bg-image');
  const area    = document.querySelector('.art_main-area');
  const openBtn = document.querySelector('.open-btn');

  function replaceOpenWithLogo() {
    if (!openBtn) return;
    if (!document.body.contains(openBtn)) return;
    openBtn.outerHTML =
      '<a class="menu-item logo_backhome_art" href="../index.html">' +
        '<img src="../images/home/centerlogo.png" alt="Back to Home" ' +
        'style="height:32px; width:auto; vertical-align:middle;">' +
      '</a>';
  }

  function applyFixedState() {
    if (menu) menu.classList.add('fixed');
    if (bg)   bg.classList.add('fixed');
    if (area) area.classList.add('show');
    replaceOpenWithLogo();

    // ハッシュ付きで来たら、領域内スクロールを即時反映
    if (area && location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        requestAnimationFrame(() => {
          area.scrollTo({ top: target.offsetTop, behavior: 'instant' });
        });
      }
    }
  }

  function preloadImages(urls) {
    const list = (urls || []).filter(Boolean);
    if (!list.length) return Promise.resolve();
    return Promise.all(list.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = resolve;
      img.src = src;
    })));
  }

  // ページ内の「先頭スライド」の画像URLを1枚拾う（picture>img の currentSrc優先）
  function getFirstSlideSrc() {
    const firstImg = document.querySelector('.art-carousel-track picture img');
    if (!firstImg) return null;
    return firstImg.currentSrc || firstImg.src || null;
  }

  // --- 2回目以降：カーテンは出さず、最初から固定状態で開始 ---
  if (sessionStorage.getItem(KEY)) {
    if (curtain) curtain.style.display = 'none';
    applyFixedState();
  } else {
    // --- 初回のみ：画像を先読みしてからカーテン演出 ---
    const preloadList = [
      '../images/art/art_main.webp',
      getFirstSlideSrc()
    ];

    preloadImages(preloadList).then(() => {
      if (!curtain) return;

      setTimeout(() => {
        curtain.classList.add('open');
      }, 350);

      setTimeout(() => {
        curtain.style.display = 'none';
        sessionStorage.setItem(KEY, '1');
        // 初回は従来通り：中央メニュー → Open で固定化、の体験を維持
      }, 1500);
    });
  }

  /* =========================================================
     Open ボタン：クリックで固定化＆ロゴに置換（初回のみ想定）
  ========================================================== */
  if (openBtn) {
    openBtn.addEventListener('click', function (e) {
      e.preventDefault();

      if (menu) menu.classList.add('fixed');
      if (bg)   bg.classList.add('fixed');
      if (area) area.classList.add('show');

      replaceOpenWithLogo();
    });
  }

  /* =========================================================
     カルーセル（pictureベース）：左右ボタン＋スワイプ
  ========================================================== */
  document.querySelectorAll('.art-carousel').forEach(carousel => {
    const track  = carousel.querySelector('.art-carousel-track');
    const slides = Array.from(track.querySelectorAll('picture'));
    let idx = 0;

    function render() {
      track.style.transform = `translateX(-${idx * 100}%)`;
    }

    function next() {
      idx = (idx + 1) % slides.length;
      render();
    }

    function prev() {
      idx = (idx - 1 + slides.length) % slides.length;
      render();
    }

    const btnNext = carousel.querySelector('.art-carousel-next');
    const btnPrev = carousel.querySelector('.art-carousel-prev');

    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        next();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prev();
      });
    }

    // スワイプ（pointer系で簡易実装）
    let startX = 0;
    let deltaX = 0;
    let dragging = false;

    track.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX;
      deltaX = 0;
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

  /* =========================================================
     ハッシュ直アクセス（初回でもOpen後でもスクロールしたい場合の保険）
  ========================================================== */
  if (!sessionStorage.getItem(KEY) && location.hash) {
    // 初回は中央UI → Open操作後にスクロールされるのが自然なので何もしない
    // もし初回でもOpenなしで自動スクロールしたい場合は、ここで area.scrollTo を追加
  }
});
