jQuery(function($) {
  // The slider being synced must be initialized first
  
  function refreshActiveSlide() {
    var img = $('.flex-active-slide img', '#slider');
    if (img) {
      var src = img.attr('src');

      if (src && src.match(/[.]gif/i)) {
        
        img.attr('src', src);
      }

    }

    var iframe = $('iframe', '.flex-active-slide');
    if (iframe) {
      iframe.attr('src', iframe.attr('src'));
    }

  }

  window.setTimeout(function() {
    $('.fade-me-out').fadeOut(400, function() {
      $('.fade-me-in').animate({opacity: 1}, 400, 'swing', refreshActiveSlide);
    });
  }, 5500);

  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    slideshow: false,
    animationLoop: true,
    clones: 4,
    start: function(slider) {
      var lis = $('li:eq(3)', slider);
      slider.cloneCount = 10;

      lis.click();
    },
    after: function(slider) {
      // We need to make sure there are enough clones on either side here.
    },
    start: function(slider) {
      // Again, make sure there are the right number of clones
    },
    before: function(slider) {
      $('#slider').flexslider(slider.animatingTo);
    }
  });


  $('#slider').flexslider({
    animation: "slide",
    controlNav: false,
    slideshow: false,
    sync: "#carousel",
    animationLoop: true,
    clones: 2,

    start: function(slider) {
      var len = slider.slides.length;
    },

    before: function(slider) {
      $('a.flex-next,a.flex-prev', slider).hide();
    },

    after: function(slider) {
      $('a.flex-next,a.flex-prev', slider).show();
      var current = slider.currentSlide

      refreshActiveSlide();

      $('.current', '#slide-counter').html(current + 1);

//      $('#SI--Download-Button').attr('download', src).attr('href', src);

    }

  });


  $('li', '#slider').click(function() {
    var $this = $(this);

    if ($this.hasClass('clone')) {
      $('#slider').flexslider(parseInt($this.attr('data-index')));
    } else {
      var index = $('li', '#slider').not('.clone').index($this);
      $('#slider').flexslider(index);

    }

  });

  $('a', '.flex-direction-nav').click(function(e) {
    e.stopPropagation();
  });

  $('li', '#carousel').click(function(e) {
    var $this = $(this);

    if ($this.hasClass('clone')) {
      $('#carousel').flexslider(parseInt($this.attr('data-index')));
    } else {
      var index = $('li', '#carousel').not('.clone').index($this);
      $('#carousel').flexslider(index);
    }
    
  })
  

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

  
//  $('#SI--Share-Button').click(function() {});
});