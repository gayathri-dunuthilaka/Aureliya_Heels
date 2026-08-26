/* ==========================================================================
   AURELIA HEELS — MAIN SITE SCRIPT
   Vanilla JavaScript
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initLoader();
  initHeaderScroll();
  initMobileNav();
  initBackToTop();
  initScrollReveal();
  initFaq();
  initTestimonials();
  initLightbox();
  initContactForm();
  initFooterYear();
  initSmoothAnchors();
});


/* ==========================================================================
   LOADING SCREEN
   ========================================================================== */

function initLoader() {
  var loader = document.getElementById("loader");

  if (!loader) return;

  function hideLoader() {
    loader.classList.add("is-hidden");
  }

  window.addEventListener("load", function () {
    setTimeout(hideLoader, 350);
  });

  // Safety fallback
  setTimeout(hideLoader, 2500);
}


/* ==========================================================================
   STICKY HEADER
   ========================================================================== */

function initHeaderScroll() {
  var header = document.querySelector(".site-header");

  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  handleScroll();

  window.addEventListener("scroll", handleScroll, {
    passive: true
  });
}


/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */

function initMobileNav() {
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".nav-list");
  var scrim = document.querySelector(".nav-scrim");

  if (!toggle || !navList) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    navList.classList.remove("is-open");

    if (scrim) {
      scrim.classList.remove("is-open");
    }

    document.body.style.overflow = "";
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    navList.classList.add("is-open");

    if (scrim) {
      scrim.classList.add("is-open");
    }

    document.body.style.overflow = "hidden";
  }

  toggle.addEventListener("click", function () {
    var isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (scrim) {
    scrim.addEventListener("click", closeMenu);
  }

  // Close menu after clicking a navigation link
  navList.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close menu with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}


/* ==========================================================================
   SMOOTH ANCHOR SCROLLING
   ========================================================================== */

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href").slice(1);

      if (!id) return;

      var target = document.getElementById(id);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      target.setAttribute("tabindex", "-1");

      target.focus({
        preventScroll: true
      });
    });

  });
}


/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */

function initBackToTop() {
  var button = document.querySelector(".back-to-top");

  if (!button) return;

  function toggleButton() {

    if (window.scrollY > 480) {
      button.classList.add("is-visible");
    } else {
      button.classList.remove("is-visible");
    }

  }

  toggleButton();

  window.addEventListener("scroll", toggleButton, {
    passive: true
  });

  button.addEventListener("click", function () {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });
}


/* ==========================================================================
   SCROLL REVEAL ANIMATION
   ========================================================================== */

function initScrollReveal() {
  var items = document.querySelectorAll(".reveal");

  if (!items.length) return;

  // Browser doesn't support IntersectionObserver
  if (!("IntersectionObserver" in window)) {

    items.forEach(function (item) {
      item.classList.add("is-visible");
    });

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
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  items.forEach(function (item, index) {

    item.style.setProperty(
      "--i",
      index % 8
    );

    observer.observe(item);

  });
}


/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */

function initFaq() {
  var items = document.querySelectorAll(".faq-item");

  if (!items.length) return;

  items.forEach(function (item) {

    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;

    question.addEventListener("click", function () {

      var isOpen =
        item.classList.contains("is-open");

      // Close all other FAQ items
      items.forEach(function (other) {

        other.classList.remove("is-open");

        var otherQuestion =
          other.querySelector(".faq-question");

        var otherAnswer =
          other.querySelector(".faq-answer");

        if (otherQuestion) {
          otherQuestion.setAttribute(
            "aria-expanded",
            "false"
          );
        }

        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }

      });

      // Open selected item
      if (!isOpen) {

        item.classList.add("is-open");

        question.setAttribute(
          "aria-expanded",
          "true"
        );

        answer.style.maxHeight =
          answer.scrollHeight + "px";

      }

    });

  });
}


/* ==========================================================================
   TESTIMONIAL SLIDER
   ========================================================================== */

function initTestimonials() {

  var track =
    document.querySelector(".testimonial-track");

  if (!track) return;

  var slides =
    Array.prototype.slice.call(
      track.querySelectorAll(".testimonial")
    );

  var dotsWrap =
    document.querySelector(".testimonial-dots");

  var index = 0;
  var timer;

  if (!slides.length) return;


  /* Create dots */

  if (dotsWrap) {

    dotsWrap.innerHTML = "";

    slides.forEach(function (_, i) {

      var dot =
        document.createElement("button");

      dot.type = "button";

      dot.setAttribute(
        "aria-label",
        "Show testimonial " + (i + 1)
      );

      if (i === 0) {
        dot.classList.add("is-active");
      }

      dot.addEventListener("click", function () {

        goTo(i);
        resetTimer();

      });

      dotsWrap.appendChild(dot);

    });

  }


  /* Change slide */

  function goTo(newIndex) {

    slides[index].classList.remove(
      "is-active"
    );

    if (dotsWrap && dotsWrap.children[index]) {
      dotsWrap.children[index].classList.remove(
        "is-active"
      );
    }

    index =
      (newIndex + slides.length) %
      slides.length;

    slides[index].classList.add(
      "is-active"
    );

    if (dotsWrap && dotsWrap.children[index]) {
      dotsWrap.children[index].classList.add(
        "is-active"
      );
    }

  }


  /* Automatic slider */

  function resetTimer() {

    clearInterval(timer);

    timer = setInterval(function () {

      goTo(index + 1);

    }, 6000);

  }


  slides[0].classList.add("is-active");

  resetTimer();
}


/* ==========================================================================
   GALLERY FILTER
   ========================================================================== */

// function initGalleryFilter() {

//   var filterBar =
//     document.querySelector(".gallery-filters");

//   var items =
//     document.querySelectorAll("[data-category]");

//   if (!filterBar || !items.length) return;

//   filterBar.addEventListener("click", function (event) {

//     var button =
//       event.target.closest("button");

//     if (!button) return;

//     filterBar
//       .querySelectorAll("button")
//       .forEach(function (btn) {

//         btn.classList.remove("is-active");

//       });

//     button.classList.add("is-active");

//     var category =
//       button.dataset.filter;

//     items.forEach(function (item) {

//       var show =
//         category === "all" ||
//         item.dataset.category === category;

//       item.style.display =
//         show ? "" : "none";

//     });

//   });
// }


/* ==========================================================================
   IMAGE LIGHTBOX
   ========================================================================== */

function initLightbox() {

  var figures =
    document.querySelectorAll(".insta-grid figure");

  var lightbox =
    document.querySelector(".lightbox");

  if (!figures.length || !lightbox) return;

  var lightboxImg =
    lightbox.querySelector("img");

  var closeButton =
    lightbox.querySelector(".lightbox-close");

  if (!lightboxImg || !closeButton) return;


  function openLightbox(src, alt) {

    lightboxImg.src = src;
    lightboxImg.alt = alt || "";

    lightbox.classList.add("is-open");

    closeButton.focus();

    document.body.style.overflow = "hidden";
  }


  function closeLightbox() {

    lightbox.classList.remove("is-open");

    document.body.style.overflow = "";

  }


  figures.forEach(function (figure) {

    var image =
      figure.querySelector("img");

    if (!image) return;


    figure.addEventListener("click", function () {

      openLightbox(
        image.src,
        image.alt
      );

    });


    figure.setAttribute(
      "tabindex",
      "0"
    );

    figure.setAttribute(
      "role",
      "button"
    );


    figure.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openLightbox(
            image.src,
            image.alt
          );

        }

      }
    );

  });


  closeButton.addEventListener(
    "click",
    closeLightbox
  );


  lightbox.addEventListener(
    "click",
    function (event) {

      if (event.target === lightbox) {
        closeLightbox();
      }

    }
  );


  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {
        closeLightbox();
      }

    }
  );

}


/* ==========================================================================
   CONTACT FORM
   ==========================================================================

   IMPORTANT:
   The Aurelia Heels ORDER FORM uses:

       id="aurelia-order-form"

   and has its own Formspree submission code inside contact.html.

   Therefore this function ONLY handles the older/general contact form
   with id="contact-form".

   This prevents the Formspree order form from being submitted twice.
   ========================================================================== */

function initContactForm() {

  var form =
    document.getElementById("contact-form");

  if (!form) return;

  var status =
    form.querySelector(".form-status");


  var validators = {

    name: function (value) {

      return value.trim().length >= 2
        ? ""
        : "Please enter your full name.";

    },


    email: function (value) {

      var emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailPattern.test(
        value.trim()
      )
        ? ""
        : "Please enter a valid email address.";

    },


    phone: function (value) {

      if (!value.trim()) {
        return "";
      }

      var phonePattern =
        /^[+()\d\s-]{7,20}$/;

      return phonePattern.test(
        value.trim()
      )
        ? ""
        : "Please enter a valid phone number.";

    },


    subject: function (value) {

      return value.trim().length >= 3
        ? ""
        : "Please enter a subject.";

    },


    message: function (value) {

      return value.trim().length >= 10
        ? ""
        : "Your message should be at least 10 characters.";

    }

  };


  function showError(field, message) {

    var wrapper =
      field.closest(".field");

    if (!wrapper) return;

    var errorMessage =
      wrapper.querySelector(".error-msg");


    if (message) {

      wrapper.classList.add(
        "has-error"
      );

      if (errorMessage) {
        errorMessage.textContent =
          message;
      }

      field.setAttribute(
        "aria-invalid",
        "true"
      );

    } else {

      wrapper.classList.remove(
        "has-error"
      );

      if (errorMessage) {
        errorMessage.textContent = "";
      }

      field.removeAttribute(
        "aria-invalid"
      );

    }

  }


  function validateField(field) {

    var validator =
      validators[field.name];

    if (!validator) return true;

    var message =
      validator(field.value);

    showError(
      field,
      message
    );

    return !message;

  }


  /* Live validation */

  Object.keys(validators).forEach(
    function (name) {

      var field =
        form.elements[name];

      if (!field) return;


      field.addEventListener(
        "blur",
        function () {

          validateField(field);

        }
      );


      field.addEventListener(
        "input",
        function () {

          var wrapper =
            field.closest(".field");

          if (
            wrapper &&
            wrapper.classList.contains(
              "has-error"
            )
          ) {

            validateField(field);

          }

        }
      );

    }
  );


  /* Submit */

  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      var allValid = true;


      Object.keys(validators).forEach(
        function (name) {

          var field =
            form.elements[name];

          if (!field) return;

          if (!validateField(field)) {
            allValid = false;
          }

        }
      );


      /* Honeypot spam protection */

      var honeypot =
        form.elements["website"];

      if (
        honeypot &&
        honeypot.value
      ) {
        return;
      }


      if (!allValid) {

        if (status) {

          status.textContent =
            "Please correct the highlighted fields and try again.";

          status.classList.remove(
            "is-success"
          );

          status.classList.add(
            "is-error"
          );

        }

        var firstError =
          form.querySelector(
            ".has-error input, .has-error textarea"
          );

        if (firstError) {
          firstError.focus();
        }

        return;

      }


      /*
        This is the normal contact form.

        If you want this older contact form to use Formspree too,
        its HTML form action should point to your Formspree endpoint.

        Example:

        action="https://formspree.io/f/xqpzdpwk"
      */

      var submitButton =
        form.querySelector(
          'button[type="submit"]'
        );

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent =
          "Sending...";
      }


      var formData =
        new FormData(form);


      fetch(form.action, {

        method: "POST",

        body: formData,

        headers: {
          Accept: "application/json"
        }

      })

        .then(function (response) {

          if (!response.ok) {

            return response
              .json()
              .then(function (data) {

                var message =
                  (
                    data &&
                    data.errors &&
                    data.errors[0] &&
                    data.errors[0].message
                  ) ||
                  "Something went wrong while sending your message.";

                throw new Error(message);

              });

          }

          if (status) {

            status.textContent =
              "Thank you! Your message has been sent. We will get back to you soon.";

            status.classList.remove(
              "is-error"
            );

            status.classList.add(
              "is-success"
            );

          }

          form.reset();


          Object.keys(validators).forEach(
            function (name) {

              var field =
                form.elements[name];

              if (field) {
                showError(
                  field,
                  ""
                );
              }

            }
          );

        })

        .catch(function (error) {

          if (status) {

            status.textContent =
              error.message ||
              "Something went wrong. Please try again.";

            status.classList.remove(
              "is-success"
            );

            status.classList.add(
              "is-error"
            );

          }

        })

        .finally(function () {

          if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
              "Send Message";

          }

        });

    }
  );

}


/* ==========================================================================
   FOOTER YEAR
   ========================================================================== */

function initFooterYear() {

  var year =
    document.getElementById("year");

  if (!year) return;

  year.textContent =
    new Date().getFullYear();

}


/* ==========================================================================
   END OF AURELIA HEELS SCRIPT
   ========================================================================== */