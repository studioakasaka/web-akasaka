(function () {
  const config = window.STUDIO_SECRET_SALE || {};
  const releaseId = config.releaseId || "secret";
  const storageKey = "studio_secret_access:" + releaseId;
  const startsAt = new Date(config.startsAt || Date.now());
  const endsAt = new Date(startsAt.getTime() + (Number(config.durationHours || 36) * 60 * 60 * 1000));

  const lock = document.querySelector("[data-secret-lock]");
  const sale = document.querySelector("[data-secret-sale]");
  const lockForm = document.querySelector("[data-secret-form]");
  const lockInput = document.querySelector("[data-secret-input]");
  const lockError = document.querySelector("[data-secret-error]");
  const countdown = document.querySelector("[data-secret-countdown]");
  const windowText = document.querySelector("[data-secret-window]");

  function isUnlocked() {
    return sessionStorage.getItem(storageKey) === "1";
  }

  function unlock() {
    sessionStorage.setItem(storageKey, "1");
    showSale();
  }

  function formatDate(date) {
    return date.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function isBeforeStart(now) {
    return now < startsAt;
  }

  function isExpired(now) {
    return now > endsAt;
  }

  function isOpen(now) {
    return !isBeforeStart(now) && !isExpired(now);
  }

  function updateLockAvailability() {
    const now = new Date();
    if (!lockForm) return;

    if (isBeforeStart(now)) {
      lockForm.classList.add("is-hidden");
      if (lockError) lockError.textContent = "This preview has not opened yet.";
      return;
    }

    if (isExpired(now)) {
      lockForm.classList.add("is-hidden");
      if (lockError) lockError.textContent = "This preview has closed.";
      return;
    }

    lockForm.classList.remove("is-hidden");
    if (lockError) lockError.textContent = "";
  }

  function renderCountdown() {
    if (!countdown) return;
    const now = new Date();
    if (isBeforeStart(now)) {
      countdown.textContent = "not open yet";
      showLock();
      return;
    }
    if (isExpired(now)) {
      countdown.textContent = "closed";
      document.body.classList.add("secret-expired");
      showLock();
      return;
    }
    const diff = endsAt.getTime() - now.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    countdown.textContent = String(hours).padStart(2, "0") + "h " + String(minutes).padStart(2, "0") + "m";
  }

  function showSale() {
    if (lock) lock.classList.add("is-hidden");
    if (sale) sale.classList.remove("is-hidden");
    renderCountdown();
  }

  function showLock() {
    if (lock) lock.classList.remove("is-hidden");
    if (sale) sale.classList.add("is-hidden");
    updateLockAvailability();
  }

  if (windowText) {
    windowText.textContent = "Open from " + formatDate(startsAt) + " to " + formatDate(endsAt) + ".";
  }

  if (lockForm) {
    lockForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const keyword = String(config.keyword || "").trim().toLowerCase();
      const value = String(lockInput?.value || "").trim().toLowerCase();
      const now = new Date();

      if (isBeforeStart(now)) {
        if (lockError) lockError.textContent = "This preview has not opened yet.";
        return;
      }
      if (isExpired(now)) {
        if (lockError) lockError.textContent = "This preview has closed.";
        return;
      }
      if (value && value === keyword) {
        unlock();
      } else if (lockError) {
        lockError.textContent = "Keyword does not match.";
      }
    });
  }

  if (isUnlocked() && isOpen(new Date())) showSale();
  else showLock();

  renderCountdown();
  window.setInterval(renderCountdown, 30000);

  document.querySelectorAll(".secret-item").forEach(function (item) {
    const track = item.querySelector(".secret-track");
    const slides = Array.from(item.querySelectorAll(".secret-slide"));
    const prev = item.querySelector(".secret-prev");
    const next = item.querySelector(".secret-next");
    if (!track || slides.length < 2) return;

    let index = 0;
    function render() {
      track.style.transform = "translateX(-" + (index * 100) + "%)";
    }
    prev?.addEventListener("click", function () {
      index = (index - 1 + slides.length) % slides.length;
      render();
    });
    next?.addEventListener("click", function () {
      index = (index + 1) % slides.length;
      render();
    });

    let swipeStartX = 0;
    let swipeStartY = 0;
    let isSwiping = false;

    track.addEventListener("touchstart", function (event) {
      const touch = event.touches[0];
      swipeStartX = touch.clientX;
      swipeStartY = touch.clientY;
      isSwiping = true;
    }, { passive: true });

    track.addEventListener("touchend", function (event) {
      if (!isSwiping) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - swipeStartX;
      const deltaY = touch.clientY - swipeStartY;
      isSwiping = false;

      if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

      if (deltaX < 0) {
        index = (index + 1) % slides.length;
      } else {
        index = (index - 1 + slides.length) % slides.length;
      }
      render();
    });
  });
})();
