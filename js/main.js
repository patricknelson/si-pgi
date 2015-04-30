jQuery(function($) {
  // The slider being synced must be initialized first
  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    slideshow: false,
    itemWidth: 125,
    itemMargin: 16,
    maxItems: 7,
    minItems: 3,
    asNavFor: '#slider',
    animationLoop: true,
    start: function(slider) {
      var lis = $('li:eq(3)', slider);

      lis.click();
    }
  });
   
  $('#slider').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    startAt: 3,
    sync: "#carousel",
    animationLoop: true,

    start: function(slider) {
      var len = slider.slides.length;
    },

    before: function(slider) {
      $('a.flex-next,a.flex-prev', slider).hide();
    },

    after: function(slider) {
      $('a.flex-next,a.flex-prev', slider).show();
      var current = slider.currentSlide;

      var the_slide = $('li', slider)[current + 1];
      var img = $('img', the_slide);
      var src = img.attr('src');

      if (src && src.match(/[.]gif/i)) {
        
        img.attr('src', src);
      }

      $('.current', '#slide-counter').html(current + 1);

    }

  });

    /*
     * Replace all SVG images with inline SVG
     */
  $('img.svg').each(function(){
      var $img = $(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      $.get(imgURL, function(data) {
          // Get the SVG tag, ignore the rest
          var $svg = $(data).find('svg');

          // Add replaced image's ID to the new SVG
          if(typeof imgID !== 'undefined') {
              $svg = $svg.attr('id', imgID);
          }
          // Add replaced image's classes to the new SVG
          if(typeof imgClass !== 'undefined') {
              $svg = $svg.attr('class', imgClass+' replaced-svg');
          }

          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr('xmlns:a');

          // Replace image with new SVG
          $img.replaceWith($svg);

      }, 'xml');

  });

  $('#SI--Download-Button').click(function() {

  });
  $('#SI--Share-Button').click(function() {

  });
});