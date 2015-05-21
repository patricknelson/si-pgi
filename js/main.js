jQuery(function($) {
  // The slider being synced must be initialized first
  var ieOld = $('html').hasClass('ie-old');
  var runningCrossfade = false;

  function preloadGifs(ctx) {
    var imgClass = 'img.gif';

    var images = $(imgClass,ctx);

    images.each(function() {
      var $this = $(this),
          src = $this.attr('src'),
          img = new Image();

      img.src = src;
    });

  }

  function resetToDefault(ctx) {
    var previewClass = '.preview',
        previewContainer = '.preview-content';

    $(previewClass, ctx).show();
    $(previewContainer, ctx).hide();
  }

  function crossfadePreviews(ctx, cb) {
    var cb = cb || function() {};
    var previewClass = '.preview',
        previewContainer = '.preview-content',
        animationLength = 400,
        innerClass= '.inner-slide';

    if (!runningCrossfade) {
      runningCrossfade = true;
    } else return cb();

    // Before we do anything we need to reset to default
    resetToDefault(ctx);
    ctx += ' .flex-active-slide';

    var innerSlide = $(innerClass, ctx);
    var preview = $(previewClass, ctx);
    var previewContainer = $(previewContainer, ctx);

    if (preview.length < 1) {
      return refreshGif(ctx, function() { 
        runningCrossfade = false;
        cb();
      });
    }

    var slideHeight = innerSlide.height();

    innerSlide.css('height', slideHeight + 'px');

    preview.fadeOut(animationLength, function() {
      previewContainer.css('opacity', 0);
      previewContainer.show();

      refreshGif(ctx, function() {
        runningCrossfade = false;
        previewContainer.css('opacity', 1);
        cb();
      });

    });
    
  }

  function refreshGif(ctx, callback) {
    var img = $('img.gif', ctx);

    callback = callback || function() {};

    if (img && img[0]) {
      var src = img.attr('src');

      if (src && src.match(/[.]gif/i)) {

        img.load(callback)
            .error(callback);

        img.attr('src', src);

        if (img[0].complete) img.load();

        return;
      }

    }

    var iframe = $('iframe', ctx);
    if (iframe && iframe[0]) {
      iframe.attr('src', iframe.attr('src'));
      return callback();
    }

    var video = $('video', ctx);
    var vidj = $('.video-js', ctx);
    if (video) {
      if (!ieOld && vidj.hasClass('vjs-has-started')) return callback(video);

      var id = vidj.attr('id');
      if (!id) return callback(false);
      var videoPlayer = videojs(id);

      videoPlayer.play();

      callback(videoPlayer);

    }

  }
  
  function refreshActiveSlide() {

    var img = $('.flex-active-slide img.gif', '#slider');
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

    window.setTimeout(function() {
      $('.flex-active-slide .preview-content', '#slider').css('opacity', 1);
    }, 100);

  }

  /*window.setTimeout(function() {
    $('.fade-me-out').fadeOut(400, function() {
      $('.fade-me-in').animate({opacity: 1}, 400, 'swing', refreshActiveSlide);
    });
  }, 5500);*/

  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    slideshow: false,
    animationLoop: true,
    clones: 4,
    start: function(slider) {
    

    },
    after: function(slider) {
      // We need to make sure there are enough clones on either side here.
    },
    before: function(slider) {
      $('#slider').flexslider(slider.animatingTo);
    }
  });

  var iePlayed = [];

  function probeVideosForIe(cb) {
    if (ieOld) {
      $('.video-js').each(function() {
        var $vidjs = $(this);
        var $id = $vidjs.attr('id');

        videojs($id).play();
        
      });
    }

    cb();
  }

  function playVideoForIE() {
    if (ieOld) {
      var id = $('.flex-active-slide .video-js').attr('id');
      if (!$.inArray(id, iePlayed)) return; // no idea...
      iePlayed.push(id);
      videojs(id).play();
    }
  }

  $('#slider').flexslider({
    animation: "slide",
    controlNav: false,
    slideshow: false,
    sync: "#carousel",
    animationLoop: true,
    clones: 2,

    start: function(slider) {
      var len = slider.slides.length;
      crossfadePreviews('#slider', function() {
        probeVideosForIe(playVideoForIE);
      });

      
//      refreshActiveSlide();

    },

    before: function(slider) {
      $('a.flex-next,a.flex-prev', slider).hide();
    },

    after: function(slider) {
      $('a.flex-next,a.flex-prev', slider).show();
      var current = slider.currentSlide;

      crossfadePreviews('#slider', playVideoForIE);
      $('video').attr('webkit-playsinline', null);

      $('.current', '#slide-counter').html(current + 1);

//      $('#SI--Download-Button').attr('download', src).attr('href', src);

    }

  });


  $('li', '#slider').click(function() {
    var $this = $(this);
    if ($this.hasClass('clone')) {
      var index = parseInt($this.attr('data-index'))
    } else {
      var index = $this.attr('data-loop-index');
      index -= 1;
    }

    // Try to do prev or next first

    var currentSlide = $('.flex-active-slide', '#slider'),
        activeIndex = parseInt(currentSlide.attr('data-loop-index')),
        $slider = $('#slider');

    activeIndex -= 1;

    if (index == activeIndex) return;
    if (index + 1 == activeIndex) $slider.flexslider('prev');
    else if (index - 1 == activeIndex) $slider.flexslider('next');
    else $slider.flexslider(index);

//    $('li[data-loop-index=' + index + '] .videocontent', '#slider').delay(1000).click();

  });

  $('a', '.flex-direction-nav').click(function(e) {
    e.stopPropagation();
  });

  $('a.flex-next', '#slider').click(function(e) {
    return false;
    // We may only want to do this on phablonets
    var currentSlide = $('.flex-active-slide', '#slider'),
        activeIndex = parseInt(currentSlide.attr('data-loop-index')),
        $slider = $('#slider');    

    activeIndex += 1;

    $('li[data-loop-index=' + activeIndex + '] .videocontent', '#slider').click();
  });

  $('a.flex-prev', '#slider').click(function(e) {
    return false;
    // Same as above
    var currentSlide = $('.flex-active-slide', '#slider'),
        activeIndex = parseInt(currentSlide.attr('data-loop-index')),
        $slider = $('#slider');

    activeIndex -= 1;
    $('li[data-loop-index=' + activeIndex + '] .videocontent', '#slider').click();

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

  $('.videocontent').click(function() {
    // We only want to do this if the video has not been played yet
    $vidjs = $(this).children('.video-js');
    if (!ieOld && $vidjs.hasClass('vjs-has-started')) return;
    $id = $vidjs.attr('id');
    videojs($id).play();
  });

//  preloadGifs();

  
//  $('#SI--Share-Button').click(function() {});
});