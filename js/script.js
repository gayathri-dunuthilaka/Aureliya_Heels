/* ==========================================================================
   AURELIA HEELS — SITE SCRIPT
   Vanilla JS only. Organized into small, independent init functions so any
   page can include this one file and only the relevant parts run (each
   function checks for its own elements before doing anything).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initLoader();
  initHeaderScroll();
  initMobileNav();
  initBackToTop();
  initScrollReveal();
  initFaq();
  initTestimonials();
  initGalleryFilter();
  initLightbox();
  initContactForm();
  initFooterYear();
  initSmoothAnchors();
});

/* ------------------------------- Loading screen ------------------------------- */
function initLoader() {
  var loader = document.getElementById("loader");
  if (!loader) return;

  var hide = function () {
    loader.classList.add("is-hidden");
  };

  // Hide as soon as the page is ready, with a small minimum so the
  // animation doesn't just flash on fast connections.
  window.addEventListener("load", function () {
    setTimeout(hide, 350);
  });

  // Safety net in case "load" never fires (e.g. slow embedded resource).
  setTimeout(hide, 2500);
}

/* ------------------------------- Sticky header -------------------------------- */
function initHeaderScroll() {
  var header = document.querySelector(".site-header");
  if (!header) return;

  var onScroll = function () {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* -------------------------------- Mobile nav ----------------------------------- */
function initMobileNav() {
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".nav-list");
  var scrim = document.querySelector(".nav-scrim");
  if (!toggle || !navList) return;

  var close = function () {
    toggle.setAttribute("aria-expanded", "false");
    navList.classList.remove("is-open");
    if (scrim) scrim.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  var open = function () {
    toggle.setAttribute("aria-expanded", "true");
    navList.classList.add("is-open");
    if (scrim) scrim.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  if (scrim) scrim.addEventListener("click", close);

  // Close the menu after choosing a link, and on Escape.
  navList.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", close);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
}

/* -------------------------------- Smooth anchors -------------------------------- */
function initSmoothAnchors() {
  // CSS already handles `scroll-behavior: smooth`; this only adds a focus
  // shift so keyboard/screen-reader users land on the right heading.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href").slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
}

/* -------------------------------- Back to top ------------------------------------ */
function initBackToTop() {
  var btn = document.querySelector(".back-to-top");
  if (!btn) return;

  var toggleVisible = function () {
    if (window.scrollY > 480) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  };

  toggleVisible();
  window.addEventListener("scroll", toggleVisible, { passive: true });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* -------------------------------- Scroll reveal ----------------------------------- */
function initScrollReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach(function (el, i) {
    el.style.setProperty("--i", i % 8);
    observer.observe(el);
  });
}

/* ------------------------------------ FAQ ------------------------------------------ */
function initFaq() {
  var items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      // Close every other item (accordion behaviour).
      items.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

/* -------------------------------- Testimonials -------------------------------------- */
function initTestimonials() {
  var track = document.querySelector(".testimonial-track");
  if (!track) return;

  var slides = Array.prototype.slice.call(track.querySelectorAll(".testimonial"));
  var dotsWrap = document.querySelector(".testimonial-dots");
  var index = 0;
  var timer;

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () {
        goTo(i);
        resetTimer();
      });
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(i) {
    slides[index].classList.remove("is-active");
    if (dotsWrap) dotsWrap.children[index].classList.remove("is-active");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("is-active");
    if (dotsWrap) dotsWrap.children[index].classList.add("is-active");
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(index + 1); }, 6000);
  }

  if (slides.length) {
    slides[0].classList.add("is-active");
    resetTimer();
  }
}

/* --------------------------------- Gallery filter -------------------------------------- */
function initGalleryFilter() {
  var filterBar = document.querySelector(".gallery-filters");
  var items = document.querySelectorAll("[data-category]");
  if (!filterBar || !items.length) return;

  filterBar.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;

    filterBar.querySelectorAll("button").forEach(function (b) {
      b.classList.remove("is-active");
    });
    btn.classList.add("is-active");

    var category = btn.dataset.filter;
    items.forEach(function (item) {
      var show = category === "all" || item.dataset.category === category;
      item.style.display = show ? "" : "none";
    });
  });
}

/* ----------------------------------- Lightbox ------------------------------------------ */
function initLightbox() {
  var figures = document.querySelectorAll(".insta-grid figure");
  var lightbox = document.querySelector(".lightbox");
  if (!figures.length || !lightbox) return;

  var lightboxImg = lightbox.querySelector("img");
  var closeBtn = lightbox.querySelector(".lightbox-close");

  var open = function (src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  };

  var close = function () {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  figures.forEach(function (fig) {
    var img = fig.querySelector("img");
    fig.addEventListener("click", function () {
      open(img.src, img.alt);
    });
    fig.setAttribute("tabindex", "0");
    fig.setAttribute("role", "button");
    fig.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(img.src, img.alt);
      }
    });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
}

/* ------------------------------- Contact form validation ----------------------------------- */
function initContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = form.querySelector(".form-status");

  var validators = {
    name: function (v) {
      return v.trim().length >= 2 ? "" : "Please enter your full name.";
    },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) ? "" : "Please enter a valid email address.";
    },
    phone: function (v) {
      if (!v.trim()) return ""; // optional field
      var re = /^[+()\d\s-]{7,20}$/;
      return re.test(v.trim()) ? "" : "Please enter a valid phone number.";
    },
    subject: function (v) {
      return v.trim().length >= 3 ? "" : "Please let us know how we can help.";
    },
    message: function (v) {
      return v.trim().length >= 10 ? "" : "Your message should be at least 10 characters.";
    }
  };

  function showError(field, message) {
    var wrap = field.closest(".field");
    if (!wrap) return;
    var msg = wrap.querySelector(".error-msg");
    if (message) {
      wrap.classList.add("has-error");
      if (msg) msg.textContent = message;
      field.setAttribute("aria-invalid", "true");
    } else {
      wrap.classList.remove("has-error");
      if (msg) msg.textContent = "";
      field.removeAttribute("aria-invalid");
    }
  }

  function validateField(field) {
    var validator = validators[field.name];
    if (!validator) return true;
    var message = validator(field.value);
    showError(field, message);
    return !message;
  }

  Object.keys(validators).forEach(function (name) {
    var field = form.elements[name];
    if (!field) return;
    field.addEventListener("blur", function () { validateField(field); });
    field.addEventListener("input", function () {
      if (field.closest(".field").classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var allValid = true;
    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      if (!validateField(field)) allValid = false;
    });

    // Honeypot spam trap — real visitors never fill this hidden field.
    var honeypot = form.elements["website"];
    if (honeypot && honeypot.value) return;

    if (!status) return;

    if (!allValid) {
      status.textContent = "Please correct the highlighted fields and try again.";
      status.classList.remove("is-success");
      status.classList.add("is-error");
      var firstError = form.querySelector(".has-error input, .has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    // No backend is wired up in this static build — this is where a real
    // deployment would call fetch() to its form endpoint (Formspree, a
    // serverless function, etc). We simulate success so the UI is complete.
    status.textContent = "Thank you — your message has been received. Our styling team will reply within one business day.";
    status.classList.remove("is-error");
    status.classList.add("is-success");
    form.reset();
    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (field) showError(field, "");
    });
  });
}

/* ------------------------------------ Footer year -------------------------------------------- */
function initFooterYear() {
  var el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

