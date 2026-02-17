document.addEventListener('DOMContentLoaded', function () {
  // ===== カーテン + 背景＆メニューの初期化 =====
  initCurtainOnce({
    preloadImages: [
      '../images/archive/archive_main.webp'
    ],
    menuSel: '.archive-menu',   // 上部に固定したいナビ
    bgSel: '.bg-image',         // 背景画像（帯になる）
    contentSel: '.grid-area',   // スクロール領域
    applyFixedOnRepeat: true    // 2回目以降は最初から固定状態
  });

  const menuEl     = document.querySelector('.archive-menu');
  const bgEl       = document.querySelector('.bg-image');
  const gridAreaEl = document.querySelector('.grid-area');

  // メニューのうち、絞り込みに使う項目（data-category を持っているもの）
  const menuItems = document.querySelectorAll('.archive-menu .menu-item[data-category]');
  // グリッド内の要素（img や .frame などを全部対象に）
  const gridItems = document.querySelectorAll('.grid img, .grid .frame');

  // ===== 絞り込み関数 =====
  function filterByCategory(category) {
    gridItems.forEach(el => {
      const catAttr = (el.getAttribute('data-category') || '').trim();

      if (!category || category === 'all') {
        // ALL の場合は全部表示
        el.style.display = '';
      } else {
        // 複数カテゴリ対応（スペース区切り）
        const cats = catAttr.split(/\s+/).filter(Boolean);
        if (cats.includes(category)) {
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      }
    });
  }

  // ===== メニュークリック時の処理 =====
  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const category = this.dataset.category;

      // カーテン開いた後と同じ状態にする
      menuEl.classList.add('fixed');
      bgEl.classList.add('fixed');
      gridAreaEl.classList.add('show');

      // アクティブ表示を切り替え
      menuItems.forEach(mi => mi.classList.remove('active'));
      this.classList.add('active');

      // 絞り込み実行
      filterByCategory(category);
    });
  });

  // ===== ページ初期表示時：デフォルトのカテゴリを選択 =====
  const defaultItem =
    document.querySelector('.archive-menu .menu-item.is-default[data-category]')
    || document.querySelector('.archive-menu .menu-item[data-category]');

 const KEY = 'curtain_once:' + location.pathname;

if (defaultItem && sessionStorage.getItem(KEY)) {
  defaultItem.click();
}

});
