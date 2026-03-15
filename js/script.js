function getCarouselRadius() {
  if(window.innerWidth < 600) return 250;     // スマホ
  if(window.innerWidth < 900) return 280;     // タブレット
  return 300;                                 // PC
}



// ▼ カルーセル本体と各項目を取得
const carousel = document.getElementById("carousel");
const items = [
  document.getElementById("item1"),
  document.getElementById("item2"),
  document.getElementById("item3"),
  document.getElementById("item4"),
  document.getElementById("item5")
];

// ▼ スクロール量から各アイテムの3D配置とアクティブ判定を決定
function updateItems(scrollY) {
  const angleOffset = scrollY / 5;       // スクロール量による回転角度
  const itemCount = items.length;
  const angleStep = 360 / itemCount;     // アイテム間の等間隔角度

  items.forEach((item, index) => {
    const angle = angleOffset + index * angleStep;
    const rad = angle * Math.PI / 180;

    // 3D円周上のX/Z座標
 const radius = getCarouselRadius(); // 追加

const x = radius * Math.sin(rad);   // ← 300の部分をradiusに
const z = radius * Math.cos(rad);



    // 配置・回転
    item.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg)`;

    // 正面に最も近いものをアクティブ
    const normalizedAngle = (angle % 360 + 360) % 360;
    if (normalizedAngle < angleStep / 2 || normalizedAngle > 360 - angleStep / 2) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// ▼ スクロール時にカルーセルを回転
window.addEventListener("scroll", () => {
  updateItems(window.scrollY);
});

// ▼ 初期表示（リロード直後も反映）
updateItems(window.scrollY);



// ▼ 鍵穴クリックまたはEnterで入力欄を表示
const keyholeBtn = document.getElementById('keyholeBtn');
const keywordInput = document.getElementById('keywordInput');

// 鍵穴クリック or フォーカスで入力欄表示
keyholeBtn.addEventListener('click', function() {
  keywordInput.style.display = 'block';
  keywordInput.focus();
});
keyholeBtn.addEventListener('keydown', function(e) {
  if(e.key === 'Enter' || e.key === ' ') {
    keywordInput.style.display = 'block';
    keywordInput.focus();
  }
});

// キーワード入力後、Enterで判定
keywordInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const val = this.value.trim().toLowerCase();
    if (val === "magic") {
      window.location.href = "pages/secret1.html";
    } else if (val === "stone") {
      window.location.href = "pages/secret2.html";
    } else {
      alert("キーワードが違います");
      this.value = "";
    }
  }
});

// 鍵穴ボックス以外クリックで入力欄を隠す
document.addEventListener('click', function(e){
  if (!e.target.closest('.keyhole-box')) {
    keywordInput.style.display = 'none';
    keywordInput.value = '';
  }
});



document.querySelectorAll('.carousel-item').forEach(item => {
  item.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelector('.carousel-container').classList.add('slide-out-up');
    const link = this.getAttribute('href');
    setTimeout(() => {
      window.location.href = link;
    }, 850); // アニメーションが終わるタイミングで遷移
  });
});


window.addEventListener("resize", () => {
  updateItems(window.scrollY);
});
window.addEventListener("pageshow", function () {
  updateItems(window.scrollY);
});

const preload = new Image();
preload.src = "images/archive/archive_main.webp";