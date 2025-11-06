$(() => {
  "use strict";

  // Responsive menu Active
  $(".mainmenu ul#primary-menu").slicknav({
    allowParentLinks: true,
    prependTo: ".responsive-menu",
  });

  // Scroll to Top
  $(window).on("scroll", () => {
    if ($(window).scrollTop() > 600) {
      $(".scrollToTop").fadeIn();
    } else {
      $(".scrollToTop").fadeOut();
    }
  });

  $(".scrollToTop").on("click", (e) => {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 2000);
  });

  // Login Popup
  $(".login-popup").on("click", (e) => {
    e.preventDefault();
    $(".login-area").show();
  });

  $(".login-box > a").on("click", (e) => {
    e.preventDefault();
    $(".login-area").hide();
  });

  // Slider activation
  const heroSlider = $(".hero-area-slider");
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
    const prevRating = $(property.target)
      .find(".owl-item")
      .eq(current)
      .prev()
      .find(".hero-area-slide")
      .html();
    const nextRating = $(property.target)
      .find(".owl-item")
      .eq(current)
      .next()
      .find(".hero-area-slide")
      .html();
    $(".thumb-prev .hero-area-slide").html(prevRating);
    $(".thumb-next .hero-area-slide").html(nextRating);
  });

  $(".thumb-next").on("click", (e) => {
    e.preventDefault();
    heroSlider.trigger("next.owl.carousel", [300]);
  });

  $(".thumb-prev").on("click", (e) => {
    e.preventDefault();
    heroSlider.trigger("prev.owl.carousel", [300]);
  });

  const newsSlider = $(".news-slider");
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
    const prevRating = $(property.target)
      .find(".owl-item")
      .eq(current)
      .prev()
      .find(".single-news")
      .html();
    const nextRating = $(property.target)
      .find(".owl-item")
      .eq(current)
      .next()
      .find(".single-news")
      .html();
    $(".news-prev .single-news").html(prevRating);
    $(".news-next .single-news").html(nextRating);
  });

  $(".news-next").on("click", (e) => {
    e.preventDefault();
    newsSlider.trigger("next.owl.carousel", [300]);
  });

  $(".news-prev").on("click", (e) => {
    e.preventDefault();
    newsSlider.trigger("prev.owl.carousel", [300]);
  });

  const videoSlider = $(".video-slider");
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

  // Isotope
  $(".portfolio-item").isotope();

  $(".portfolio-menu li").on("click", function () {
    $(".portfolio-menu li").removeClass("active");
    $(this).addClass("active");
    const selector = $(this).attr("data-filter");
    $(".portfolio-item").isotope({
      filter: selector,
    });
  });

  // Preloader
  $(window).on("load", () => {
    $("#preloader").fadeOut(500);
  });
});