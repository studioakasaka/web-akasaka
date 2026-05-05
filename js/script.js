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

    const container = document.querySelector('.carousel-container');
    const link = this.getAttribute('href');

    if (container) {
      container.classList.add('slide-out-up');
    }

    setTimeout(() => {
      window.location.href = link;
    }, 850);
  });
});


window.addEventListener("resize", () => {
  updateItems(window.scrollY);
});
window.addEventListener("pageshow", function () {
  updateItems(window.scrollY);
});

window.addEventListener("pageshow", function () {
  const container = document.querySelector(".carousel-container");

  if (container) {
    container.classList.remove("slide-out-up");
    container.style.opacity = "";
    container.style.visibility = "";
    container.style.transform = "";
  }

  items.forEach(item => {
    if (!item) return;
    item.style.opacity = "";
    item.style.visibility = "";
  });

  updateItems(window.scrollY);
});



const openDates = [
  "2026-05-30",
  "2026-06-27",
  "2026-07-25",
  "2026-08-29",
  "2026-09-26",
  "2026-10-24",
  "2026-11-28",
  "2026-12-12",


];

const today = new Date();

const nextDate = openDates
  .map(date => new Date(date))
  .find(date => date >= today);

if (nextDate) {
  document.getElementById("next-open").textContent =
    nextDate.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
}
const preload = new Image();
preload.src = "images/archive/archive_main.webp";
