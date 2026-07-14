(function($){

		jQuery.preloadImages = function () {
			if (typeof arguments[arguments.length - 1] == 'function') {
				var callback = arguments[arguments.length - 1];
			} else {
				var callback = false;
			}
			if (typeof arguments[0] == 'object') {
				var images = arguments[0];
				var n = images.length;
			} else {
				var images = arguments;
				var n = images.length - 1;
			}
			var not_loaded = n;
			for (var i = 0; i < n; i++) {
				jQuery(new Image()).attr('src', images[i]).load(function() {
					if (--not_loaded < 1 && typeof callback == 'function') {
						callback();
					}
				});
			}
		}

		var menu_flip_speed = 200,
		recent_work_opacity_speed = 400,
		featured_controllers_opacity_speed = 500,
		featured_bar_animation_speed = 500,
		featured_bar_animation_easing = 'easeOutExpo',
		$mobile_nav_button = $('#mobile_nav'),
		$main_menu = $('ul.nav'),
		$featured = $('#fr_showcase_slider'),
		$featured_controllers_container = $('#featured-controllers'),
		$featured_control_item = $featured_controllers_container.find('li'),
		container_width = $('#container').innerWidth(),
		$footer_widget = $('.footer-widget'),
		$cloned_nav,
		slider_settings,
		sd_slider_autospeed,
		slider,
		$recent_work_thumb = $('#recent-work .thumb'),
		$gallery_slider = $('.post_gallery_slider');
		
		
		
		$main_menu.superfish({ 
			delay:       300,                            // one second delay on mouseout 
			animation:   {opacity:'show',height:'show'},  // fade-in and slide-down animation 
			speed:       'fast',                          // faster animation speed 
			autoArrows:  true,                           // disable generation of arrow mark-up 
			dropShadows: false                            // disable drop shadows 
		});
		
		
		$('.js #main-menu').show();
		
	
	//MOBILE MENU
		$main_menu.clone().attr('id','mobile_menu').removeClass().appendTo( $mobile_nav_button );
		$cloned_nav = $mobile_nav_button.find('> ul');
		$cloned_nav.find('span.menu_slide').remove().end().find('span.main_text').removeClass();
		
		$mobile_nav_button.click( function(){
			if ( $(this).hasClass('closed') ){
				$(this).removeClass( 'closed' ).addClass( 'opened' );
				$cloned_nav.slideDown( 500 );
			} else {
				$(this).removeClass( 'opened' ).addClass( 'closed' );
				$cloned_nav.slideUp( 500 );
			}
			return false;
		} );
		
		$mobile_nav_button.find('a').click( function(event){
			event.stopPropagation();
		} );
		
		$('#mobile_menu li').hover(function(){
			$(this).find('.sub-menu').slideDown( 500 ).css({display: 'block', visibility: 'visible'});
		}, function () {
			$(this).find('.sub-menu').slideUp( 500 );
		});
		//MOBILE MENU
		
		if( $('#carousel').length > 0){
			$("#carousel").carouFredSel({
				auto    : false,
				prev    : {
					button  : "#fr_prev",
					key     : "left"
				},
				next    : {
					button  : "#fr_next",
					key     : "right"
				},
			});
		}
		
		if( $('.testimonials > ul').length > 0){
			$(".testimonials > ul").carouFredSel({
				auto : false,
				items : 1,
				prev    : {
					button  : "#tes_prev",
					key     : "left"
				},
				next    : {
					button  : "#tes_next",
					key     : "right"
				}   
			});
		}
		
		// POST FORMAT GALLERY
		if( $gallery_slider.length > 0){
			$gallery_slider.flexslider({
				slideshow: true,           
				slideshowSpeed: 7000,
				controlsContainer: ".slider_controls"
			});
		}
		
		if( $('.fr_portfolio_zoom_icon').length > 0){
			$('.fr_portfolio_zoom_icon').magnificPopup({
			  type: $(this).attr('data')
				// other options
			});
		}

	
	if( $('.fr_skill_bars').length > 0){
		$('.chart').easyPieChart({
			barColor: 'rgba(255,255,255,1)',
			trackColor: 'rgba(0,0,0,0.5)',
			scaleColor: false,
			lineWidth: 7,
			size: 150
		});
	}

     (function($) {
		$.fn.countTo = function(options) {
			// merge the default plugin settings with the custom options
			options = $.extend({}, $.fn.countTo.defaults, options || {});

			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(options.speed / options.refreshInterval),
				increment = (options.to - options.from) / loops;

			return $(this).delay(1000).each(function() {
				var _this = this,
					loopCount = 0,
					value = options.from,
					interval = setInterval(updateTimer, options.refreshInterval);

				function updateTimer() {
					value += increment;
					loopCount++;
					$(_this).html(value.toFixed(options.decimals));

					if (typeof(options.onUpdate) == 'function') {
						options.onUpdate.call(_this, value);
					}

					if (loopCount >= loops) {
						clearInterval(interval);
						value = options.to;

						if (typeof(options.onComplete) == 'function') {
							options.onComplete.call(_this, value);
						}
					}
				}
			});
		};

		$.fn.countTo.defaults = {
			from: 0,  // the number the element should start at
			to: 100,  // the number the element should end at
			speed: 1000,  // how long it should take to count between the target numbers
			refreshInterval: 100,  // how often the element should be updated
			decimals: 0,  // the number of decimal places to show
			onUpdate: null,  // callback method for every time the element is updated,
			onComplete: null,  // callback method for when the element finishes updating
		};
	})(jQuery);
	
		if( $('.home .fucts_counter').length > 0){
			$('.home .fucts_counter').appear(function() {
				$('.fucts_counter').each(function(){
					dataperc = $(this).attr('data-perc'),
					$(this).find('.fucts_count').delay(6000).countTo({
					from: 0,
					to: dataperc,
					speed: 2000,
					refreshInterval: 100
				});
			 });
		});
	}
	
	if( $('.skills_wrap .upload').length > 0){
		$('.skills_wrap .upload').width(0);
		$('.skills_wrap .upload').appear(function() {
			$(this).each(function(){
				$(this).animate({ width: $(this).attr('data-width') +'%'  }, 1000);
			});
		 });
	 }
	
	/*$('.object_fade').css({opacity: 0, });
	$('.home .object_fade').appear(function() {
		$('.object_fade').each(function(){
			$(this).animate({opacity: 1,}, 1000);
		});
	 });*/
	
	$('.home #main_header').css('height', $(window).height() );
		
	// HEADER PARALLAX SCROLL	
	function parallaxScroll(){
		var scrolled = $(window).scrollTop();
		$("#main_header").css({backgroundPosition: "0 "+(95+(scrolled*.4))+"%" });
		$(".fr_slide_image").css({backgroundPosition: "0 "+(95+(scrolled*.4))+"%" });
	}
	$(window).bind('scroll',function(e){
		parallaxScroll();
	});
	
	$(window).scroll(function() {
		var scroll_position = $(document).scrollTop();
		if(scroll_position > 500) {
			$(".home #menu").addClass("small_header");
		} else {
			$(".home #menu").removeClass("small_header");
		}
	});
	
	//Initialization video
	if( $('.player').length > 0){
		$(".player").mb_YTPlayer();
	}
			
	// SHOWCASE SLIDER SETTINGS
	
	if ( $featured.length ){
		slider_settings = {
			slideshow: false, 			// set true for autoplay
			//slideshowSpeed: 7000,		//uncommented for autoplay
			before: function(slider){
				var $this_control = $featured_control_item.eq(slider.animatingTo),
					width_to = '239px';
					
				if ( container_width === 748 ) {width_to = '186px';}
				
				if ( $('#featured_controls').length ){
					$('#featured_controls li').removeClass().eq(slider.animatingTo).addClass('active-slide');
					return;
				}
				
				$featured_control_item.removeClass('active-slide');
				
				if ( ! $this_control.find('.animated_bar').length ){ $this_control.append('<div class="animated_bar"></div>'); }
				$this_control.find('.animated_bar').css({ 'display' : 'block', 'width' : '7px', 'left' : '120px'}).stop(true,true).animate( { width : width_to, 'left' : 0 }, featured_bar_animation_speed, featured_bar_animation_easing, function(){
					$this_control.find('.animated_bar').hide()
					.end().find('.slide_hover').stop(true,true).animate( { 'opacity' : '0' }, featured_controllers_opacity_speed )
					.end().addClass('active-slide');
				} );
			},
			start: function(slider) {
				slider = slider;
			}
		};			
		slider_settings.pauseOnHover = true;
		
		$featured.flexslider( slider_settings );
	}
	
	// SHOWCASE SLIDER SETTINGS
	 
	// MENU SETTINGS
   $(".one_page #main-menu").find("a").add("#fr_converse .fr_simple_btn").click(function(){
		var elem = $(this).attr("href");
		$('html, body').animate({ scrollTop: $(elem).offset().top }, 1000);
   });
   
   if( $('.accordion').length > 0){
		$('.accordion').accordion({
			collapsible: true,
			active: false,
			heightStyle: "content"
		});
	}
	
	function OffScroll () {
		var winScrollTop = $(window).scrollTop();
		$(window).bind('scroll',function () {
		  $(window).scrollTop(winScrollTop);
		});
	}
	
	$('#fr_to_top').click(function(){
       $('html, body').animate({scrollTop:0}, 'slow');
   });
         
})(jQuery);