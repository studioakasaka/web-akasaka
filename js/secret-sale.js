(function () {
  "use strict";

  var config = window.STUDIO_SECRET_SALE || {};
  var gate = document.querySelector("[data-secret-gate]");
  var page = document.querySelector("[data-secret-page]");
  var form = document.querySelector("[data-secret-form]");
  var input = document.querySelector("[data-secret-input]");
  var message = document.querySelector("[data-secret-message]");

  var releaseId = config.releaseId || "private-sale";
  var accessKey = "studio_secret_access:" + releaseId;

  function parseDate(value) {
    var date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
  }

  var startsAt = parseDate(config.startsAt);
  var endsAt = parseDate(config.endsAt);

  function releaseState() {
    var now = new Date();
    if (startsAt && now < startsAt) return "before";
    if (endsAt && now > endsAt) return "after";
    return "open";
  }

  function formatDate(date) {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Berlin",
      timeZoneName: "short"
    }).format(date);
  }

  function updatePageContent() {
    var title = document.querySelector("[data-sale-title]");
    var subtitle = document.querySelector("[data-sale-subtitle]");
    var period = document.querySelector("[data-sale-period]");
    var email = config.contactEmail || "info@akasaka.studio";

    document.title = (config.title || "Private Sale") + " — Studio AKASAKA";
    if (title) title.textContent = config.title || "Private Sale";
    if (subtitle) subtitle.textContent = config.subtitle || "";

    if (period) {
      if (startsAt && endsAt) {
        period.textContent = "Available from " + formatDate(startsAt) + " until " + formatDate(endsAt) + ".";
      } else if (endsAt) {
        period.textContent = "Available until " + formatDate(endsAt) + ".";
      }
    }

    document.querySelectorAll("[data-contact-email]").forEach(function (link) {
      link.textContent = email;
      link.href = "mailto:" + email;
    });

    var instagram = document.querySelector("[data-contact-instagram]");
    if (instagram) {
      instagram.textContent = config.instagramAccount || "@akasaka_jewelry";
      instagram.href = config.instagramUrl || "https://www.instagram.com/akasaka_jewelry/";
    }
  }

  function showPage() {
    gate.classList.add("is-hidden");
    page.classList.remove("is-hidden");
  }

  function showGateMessage(text) {
    if (message) message.textContent = text;
  }

  function validateRelease() {
    var state = releaseState();
    if (state === "before") {
      showGateMessage("This private sale has not opened yet.");
      return false;
    }
    if (state === "after") {
      showGateMessage("This private sale has ended.");
      sessionStorage.removeItem(accessKey);
      return false;
    }
    return true;
  }

  updatePageContent();

  if (sessionStorage.getItem(accessKey) === "1" && validateRelease()) {
    showPage();
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validateRelease()) return;

      var submitted = input.value.trim();
      if (submitted === String(config.keyword || "")) {
        sessionStorage.setItem(accessKey, "1");
        showGateMessage("");
        showPage();
      } else {
        showGateMessage("The keyword is not correct.");
        input.value = "";
        input.focus();
      }
    });
  }

  document.querySelectorAll("[data-purchase-link]").forEach(function (link) {
    var product = link.closest("[data-product]");
    var number = product ? product.getAttribute("data-product") : "";
    var email = config.contactEmail || "info@akasaka.studio";
    var subject = "Purchase enquiry — Product " + number;
    var body = [
      "Hello Studio AKASAKA,",
      "",
      "I am interested in Product " + number + ".",
      "Please let me know whether it is still available.",
      "",
      "Name:",
      "Country / delivery location:",
      "Studio collection or shipping:",
      ""
    ].join("\n");

    link.href = "mailto:" + email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });

  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var track = gallery.querySelector("[data-gallery-track]");
    var slides = track ? Array.from(track.children) : [];
    var prev = gallery.querySelector("[data-gallery-prev]");
    var next = gallery.querySelector("[data-gallery-next]");
    var count = gallery.querySelector("[data-gallery-count]");
    var index = 0;
    var startX = null;

    function render() {
      if (!track || !slides.length) return;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      if (count) count.textContent = (index + 1) + " / " + slides.length;
    }

    function move(delta) {
      index = (index + delta + slides.length) % slides.length;
      render();
    }

    if (prev) prev.addEventListener("click", function () { move(-1); });
    if (next) next.addEventListener("click", function () { move(1); });

    if (track) {
      track.addEventListener("pointerdown", function (event) {
        startX = event.clientX;
      });
      track.addEventListener("pointerup", function (event) {
        if (startX === null) return;
        var distance = event.clientX - startX;
        startX = null;
        if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
      });
      track.addEventListener("pointercancel", function () { startX = null; });
    }

    render();
  });
})();
