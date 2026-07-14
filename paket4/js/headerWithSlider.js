(function($){
	var $header_featured = $('#header_featured'),
		$flexnav = $('#header_featured .flex-direction-nav');
	
	$('#header_featured .slide').css({ 'width': $(window).width() , 'height': $(window).height() });
	
	$('#header_featured .fr_slide_image').each(function(i){
		$(this).css('backgroundImage', 'url('+$(this).find('img').attr('src')+')');
		$(this).find('img').remove();
	});
	
	$header_featured.flexslider({
		slideshow: false, 			// set true for autoplay
		//slideshowSpeed: 7000,		//uncommented for autoplay
	});
	$("#header_featured").find('#left-arrow').click( function(){
			$('#header_featured .flex-direction-nav').find('a.prev').trigger('click');
			return false;
		});
	
	$("#header_featured").find('#right-arrow').click( function(){
		$('#header_featured .flex-direction-nav').find('a.next').trigger('click');
		return false;
	});
		
})(jQuery);