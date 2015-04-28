jQuery(function($) {
  // The slider being synced must be initialized first
  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 125,
    itemMargin: 16,
    maxItems: 7,
    minItems: 3,
    asNavFor: '#slider'
  });
   
  $('#slider').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    sync: "#carousel",

    start: function(slider) {
      var len = slider.slides.length;
    },

    after: function(slider) {
      var current = slider.currentSlide;

      $('.current', '#slide-counter').html(current + 1);

    }

  });
});