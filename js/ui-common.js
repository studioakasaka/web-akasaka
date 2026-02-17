/* ui-common.js
   各ページごとに（同一タブ内で）一度だけカーテンを再生。
   2回目以降はカーテン非表示＋ナビを最初から上部固定状態で開始。
   さらに、指定した画像を先読みしてからカーテンを開く。
*/
(function (w) {
  /**
   * @param {Object} opts
   * @param {string}   [opts.selector='.curtain-overlay']  カーテン要素
   * @param {string}   [opts.keyPrefix='curtain_once']     sessionStorageキー接頭辞
   * @param {string}   [opts.pageId=location.pathname]     ページ識別子
   * @param {number}   [opts.openDelayMs=350]              open追加までの遅延
   * @param {number}   [opts.hideDelayMs=1500]             非表示までの遅延
   * @param {string[]} [opts.preloadImages=[]]             先読みURL
   * @param {string[]} [opts.firstImageSelectors=[]]       DOMから最初の<img>を拾うセレクタ
   * @param {string}   [opts.menuSel]                      ナビ要素（.products-menu 等）
   * @param {string}   [opts.bgSel]                        背景帯（.bg-image）
   * @param {string}   [opts.contentSel]                   スクロール領域（.products-area 等）
   * @param {boolean}  [opts.applyFixedOnRepeat=true]      2回目以降、固定状態で開始するか
   */
  w.initCurtainOnce = function initCurtainOnce(opts) {
    var o = Object.assign({
      selector: '.curtain-overlay',
      keyPrefix: 'curtain_once',
      pageId: (location && location.pathname) ? location.pathname : 'default',
      openDelayMs: 350,
      hideDelayMs: 1500,
      preloadImages: [],
      firstImageSelectors: [],
      menuSel: null,
      bgSel: null,
      contentSel: null,
      applyFixedOnRepeat: true
    }, opts || {});

    var KEY = o.keyPrefix + ':' + o.pageId;
    var curtain = document.querySelector(o.selector);

    function applyFixedState() {
      if (o.menuSel)   document.querySelector(o.menuSel)?.classList.add('fixed');
      if (o.bgSel)     document.querySelector(o.bgSel)?.classList.add('fixed');
      if (o.contentSel) {
        var area = document.querySelector(o.contentSel);
        if (area) {
          area.classList.add('show');
          // ハッシュ指定があれば、帯の下に合わせてスクロール
          if (location.hash) {
            var target = document.querySelector(location.hash);
            if (target) {
              // レイアウト確定後にスクロール
              requestAnimationFrame(function () {
                area.scrollTo({ top: target.offsetTop, behavior: 'instant' });
              });
            }
          }
        }
      }
    }

    // 2回目以降：カーテンを即非表示＆固定状態で開始（オプション有効時）
    if (sessionStorage.getItem(KEY)) {
      if (curtain) curtain.style.display = 'none';
      if (o.applyFixedOnRepeat) applyFixedState();
      return;
    }

    // 初回のみ：画像プリロード → カーテン開く → 非表示 → フラグ保存
    if (!curtain) return;

    // DOMから最初の画像を収集（picture>img は currentSrc を優先）
    var dynamicList = [];
    (o.firstImageSelectors || []).forEach(function (sel) {
      var img = document.querySelector(sel);
      if (!img) return;
      var src = img.currentSrc || img.src;
      if (src) dynamicList.push(src);
    });

    var allUrls = []
      .concat(o.preloadImages || [])
      .concat(dynamicList)
      .filter(function (u) { return typeof u === 'string' && u.trim().length > 0; })
      .filter(function (u, i, arr) { return arr.indexOf(u) === i; });

    function preloadImages(urls) {
      if (!urls.length) return Promise.resolve();
      return Promise.all(urls.map(function (src) {
        return new Promise(function (resolve) {
          var im = new Image();
          im.onload = im.onerror = resolve;
          im.src = src;
        });
      }));
    }

    preloadImages(allUrls).then(function () {
      setTimeout(function () {
        curtain.classList.add('open');
      }, o.openDelayMs);

      setTimeout(function () {
        curtain.style.display = 'none';
        sessionStorage.setItem(KEY, '1');
        // 初回直後は、従来どおり中央から操作してもらう想定なので
        // ここでは fixed は付けない（※要望があればここで付与も可能）
      }, o.hideDelayMs);
    });
  };
})(window);
