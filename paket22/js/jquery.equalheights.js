/*parsed HTML*/
$(function(){
	$(".maxheight").each(function(){
		$(this).contents().wrapAll("<div class='box_inner'></div>");
	})
	$(".maxheight1").each(function(){
		$(this).contents().wrapAll("<div class='box_inner'></div>");
	})

	$('h2.lines').before("<div class='line-before'></div>");
	$('h2.lines').after("<div class='line-after'></div>");
	$('h2.line').after("<div class='line-after'></div>");
	$(window).load(function(){
	  $('.line-after').each(function() {
	  var thiswidth = ($(this).parent().width() - $(this).prev().width()) / 2 - 34;
	  $(this).css({width:thiswidth})})
	  $('.one-line-heading .line-after').each(function() {
	  var thiswidth = ($(this).parent().width() - $(this).prev().width()) / 1 - 18;
	  $(this).css({width:thiswidth})})

	  $('.line-before').each(function() {
	  var thiswidth = ($(this).parent().width() - $(this).next().width()) / 2 - 34;
	  $(this).css({width:thiswidth})})
	});
	$(window).resize(function(){
	  $('.line-after').each(function() {
	  var thiswidth = ($(this).parent().width() - $(this).prev().width()) / 2 - 34;
	  $(this).css({width:thiswidth})})
	  $('.one-line-heading .line-after').each(function() {
	  var thiswidth = ($(this).parent().width() - $(this).prev().width()) / 1 - 18;
	  $(this).css({width:thiswidth})})

	  $('.line-before').each(function() {
	  var thiswidth = ($(this).parent().width() - $(this).next().width()) / 2 - 34;
	  $(this).css({width:thiswidth})})
	});

})
/*add event*/
$(window).bind("resize", height_handler).bind("load", height_handler)
function height_handler(){
	if($(window).width()>767){
		$(".maxheight").equalHeights();
	}else{
		$(".maxheight").css({'height':'auto'});
	}
	if($(window).width()>767){
		$(".maxheight1").equalHeights();
	}else{
		$(".maxheight1").css({'height':'auto'});
	}
}
/*glob function*/
(function($){
	$.fn.equalHeights=function(minHeight,maxHeight){
		tallest=(minHeight)?minHeight:0;
		this.each(function(){
			if($(">.box_inner", this).outerHeight()>tallest){
				tallest=$(">.box_inner", this).outerHeight()
			}
		});
		if((maxHeight)&&tallest>maxHeight) tallest=maxHeight;
		return this.each(function(){$(this).height(tallest)})
	}
})(jQuery)
