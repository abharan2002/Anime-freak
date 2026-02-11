(() => {
  "use strict";

  const jq = window.jQuery;
  const preloader = document.getElementById("preloader");

  // Fail-safe: if jQuery fails to load, never block the page behind preloader.
  if (typeof jq !== "function") {
    if (preloader) {
      preloader.style.display = "none";
    }
    return;
  }

  jq(() => {
    const hasPlugin = (pluginName) =>
      typeof jq.fn === "object" && typeof jq.fn[pluginName] === "function";

    // Login Popup
    jq(".login-popup").on("click", (e) => {
      e.preventDefault();
      jq(".login-area").show();
    });

    jq(".login-box > a").on("click", (e) => {
      e.preventDefault();
      jq(".login-area").hide();
    });

    // Slider activation
    const heroSlider = jq(".hero-area-slider");
    if (heroSlider.length && hasPlugin("owlCarousel")) {
      heroSlider.owlCarousel({
        loop: true,
        dots: true,
        autoplay: false,
        autoplayTimeout: 4000,
        nav: false,
        items: 1,
        responsive: {
          992: {
            dots: false,
          },
        },
      });

      heroSlider.on("changed.owl.carousel", (property) => {
        const current = property.item.index;
        const prevRating = jq(property.target)
          .find(".owl-item")
          .eq(current)
          .prev()
          .find(".hero-area-slide")
          .html();
        const nextRating = jq(property.target)
          .find(".owl-item")
          .eq(current)
          .next()
          .find(".hero-area-slide")
          .html();
        jq(".thumb-prev .hero-area-slide").html(prevRating);
        jq(".thumb-next .hero-area-slide").html(nextRating);
      });

      jq(".thumb-next").on("click", (e) => {
        e.preventDefault();
        heroSlider.trigger("next.owl.carousel", [300]);
      });

      jq(".thumb-prev").on("click", (e) => {
        e.preventDefault();
        heroSlider.trigger("prev.owl.carousel", [300]);
      });
    }

    const newsSlider = jq(".news-slider");
    if (newsSlider.length && hasPlugin("owlCarousel")) {
      newsSlider.owlCarousel({
        loop: true,
        dots: true,
        autoplay: false,
        autoplayTimeout: 4000,
        nav: false,
        items: 1,
        responsive: {
          992: {
            dots: false,
          },
        },
      });

      newsSlider.on("changed.owl.carousel", (property) => {
        const current = property.item.index;
        const prevRating = jq(property.target)
          .find(".owl-item")
          .eq(current)
          .prev()
          .find(".single-news")
          .html();
        const nextRating = jq(property.target)
          .find(".owl-item")
          .eq(current)
          .next()
          .find(".single-news")
          .html();
        jq(".news-prev .single-news").html(prevRating);
        jq(".news-next .single-news").html(nextRating);
      });

      jq(".news-next").on("click", (e) => {
        e.preventDefault();
        newsSlider.trigger("next.owl.carousel", [300]);
      });

      jq(".news-prev").on("click", (e) => {
        e.preventDefault();
        newsSlider.trigger("prev.owl.carousel", [300]);
      });
    }

    const videoSlider = jq(".video-slider");
    if (videoSlider.length && hasPlugin("owlCarousel")) {
      videoSlider.owlCarousel({
        loop: true,
        dots: true,
        autoplay: false,
        autoplayTimeout: 4000,
        nav: false,
        responsive: {
          0: {
            items: 1,
            margin: 0,
          },
          576: {
            items: 2,
            margin: 30,
          },
          768: {
            items: 3,
            margin: 30,
          },
          992: {
            items: 4,
            margin: 30,
          },
        },
      });
    }

  });

  // Preloader should always hide, even if plugin setup fails.
  window.addEventListener("load", () => {
    if (jq && typeof jq.fn === "object") {
      jq("#preloader").fadeOut(500);
    } else if (preloader) {
      preloader.style.display = "none";
    }
  });
})();
