$(document).ready(function () {
  // Open Menu
  $(".header .menu").click(function () {
    $(".header").toggleClass("active");
    $(this).toggleClass("active");
    $(".header .navbar__content").toggleClass("active");
    $(".header__content").toggleClass("active");
    $("body").toggleClass("fixed");
  });

  // click hide menu
  $(".navbar__link").click(function () {
    $(".header").removeClass("active");
    $(".header .menu").removeClass("active");
    $(".header .navbar__content").removeClass("active");
    $(".header__content").removeClass("active");
    $("body").removeClass("fixed");
  });

  // $(window).resize(function () {
  //   $(".header").removeClass("active");
  //   $(".header .menu").removeClass("active");
  //   $(".header .navbar__content").removeClass("active");
  //   $(".header__content").removeClass("active");
  // });

  // click delete error
  $(".contact__button").click(function () {
    $(".contact__result").hide();
  });
  $(".contact .close").click(function () {
    $(".alert").hide();
  });

  //Click event to scroll to top
  $(".scrollTop button").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 100);
    return false;
  });

  // scroll to 100 show button to top
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 500) {
      $(".scrollTop").fadeIn();
    } else {
      $(".scrollTop").fadeOut();
    }
  });

  // click outsite hide menu
  $(document).mouseup(function (e) {
    var container = $(".navbar__content.active");
    var button = $(".menu");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if (!button.is(e.target) && button.has(e.target).length === 0) {
        $(".header").removeClass("active");
        $(".header .menu").removeClass("active");
        $(".header .navbar__content").removeClass("active");
        $(".header__content").removeClass("active");
        $("body").removeClass("fixed");
      }
    }
  });
});
