/*
*tm3DCircleCarousel.js -- carousel with 3D effect
*Version: 1.1;
*Author: Smart;
*/
(function($){
	$.fn.tm3DCircleCarousel = function(o){
		return this.each(function(){
			var $this = $(this),
				data =$this.data('tm3DCircleCarousel'),
				getObject = {
					container: 'body', // container of gallery
					transformClasses: '.scale100, .scale90, .scale80, .scale70, .scale60',
					clickableClasses: '.scale100',
					rightSideClass: '.rightSide', // class for right side items
					leftSideClass: '.leftSide',  // class for left side items
					cssProperty: 'marginLeft', // css property for changing (use marginTop, marginLeft, etc)
					itemOffset: 100, // offset of $items
					itemOffsetCenter: 0, // offset from center item 
					useCSS3Animation: true, // use css3 or jquery animation
					autoplay: {}, // autoplay parameters 
					reflections: {}, // reflections of images
					pagination: {}, // pagination for items
					next: '.nextButton', // next button selector
					prev: '.prevButton', // prev button selector
					onChange: function(element, middleIndex, length){}, // callback for on change images event 
					onInit: function(){}, // callback after initialization
					onUserActivate: function(){}, // callback: user do something (click or keyboard event)
					onShowActions: function(){}, // callback: gallery is activates
					onHideActions: function(){}, // callback: gallery is deactivates 
					constructor: function (params) {
						if ($this.length) {
							getObject.transformClasses = getObject.transformClasses.split(',');
							for (i=0;i<getObject.transformClasses.length;i++){
								getObject.transformClasses[i] = getObject.transformClasses[i].trim().substr(1);
							}
							getObject.clickableClasses = getObject.clickableClasses.split(',');
							for (i=0;i<getObject.clickableClasses.length;i++){
								getObject.clickableClasses[i] = getObject.clickableClasses[i].trim().substr(1);
							}						

							var $doc = $(document),
								$container = $this.parents(getObject.container),
								$items = $this.find('>li'), // items (li)
								$a = $items.find('>a'), // anchors of items
								length = $items.length, // length of $items
								itemsOrder = [], // order of $items
								middleIndex = Math.round(length *.5), // index of middle item, if $items 9, this index -- 5
								reflectionsDefaults = { // reflection defaults parameters
									enable: false,
									reflectionClass: '.reflection',
									startColor: 'rgba(0,0,0,1)',
									endColor: 'rgba(0,0,0,0.8)'
								},
								autoplayDefaults = { // autoplay defaults
									enable: false,
									timeout: 12000,
									id: 0
								},
								paginationDefaults = { // autoplay defaults
									enable: false,
									activeClass: '.active',
									paginationClass: '.pagination',
									$this: null,
									$li: null,
									$a: null
								},
								$prev = $(getObject.prev, $container[0]), // prevoius button
								$next = $(getObject.next, $container[0]), // next button
								galleryActive = false, // active status for gallery
								isFirstActionDone = false; // first user actions flag

					        init();
					    }

						function init(){
							// set length
							length = (length % 2 === 0) ? (length-1) : length;

							// hide last item, if length of $items is even
							($items.length > length) && ($items.eq(length).css('display','none'));

							// fill order items array
							for (var i=0;i<length;i++){
								itemsOrder.push(i);
							}

							// set reflections
							getObject.reflections = $.extend(reflectionsDefaults, o.reflections);
							getObject.reflections.enable&&createReflections();

							// set autoplay
							getObject.autoplay = $.extend(autoplayDefaults, o.autoplay);
							getObject.autoplay.enable&&stopAutoplay();

							// set order for items
							setOrder();

							// pagination 
							paginationInit();

							var autoplayEnable = getObject.autoplay.enable;
							// listeners
							$this
								.on({
									showGallery: function(e){
										if (!galleryActive){	
											getObject.onShowActions();	
											setListeners(galleryActive = true);
										}
									},
									hideGallery: function(e){
										if (galleryActive){	
											getObject.onHideActions();								
											getObject.autoPlayState = false;
											setListeners(galleryActive = false);
										}
									}})
								.trigger('showGallery')
								// .trigger('goto', '0')
								.on('firstAction', firstAction);

							// on keydown event, event always on 
							$doc.on('keydown', keyboardEvents);

							// check autoplay
							if (autoplayEnable) {
								getObject.autoplay.enable = true;
								startAutoplay();
							}
						}

						// on/off all listeners for plugin
						function setListeners(state){
							if (state) {
								$prev.on('click', clickPrev);
								$next.on('click', clickNext);
								$a.on('click', clickItem);
								$this.on({'go': go, 'goto': goTo});
								if ($.fn.swipe) {
									$this.swipe({
										swipeLeft:function(event, direction, distance, duration, fingerCount) {
											galleryActive&&clickNext();
										},
										swipeRight:function(event, direction, distance, duration, fingerCount) {
											galleryActive&&clickPrev();
										}
									});
								}
							} else {
								$prev.off('click', clickPrev);
								$next.off('click', clickNext);
								$a.off('click', clickItem);
								$this.off({'go': go, 'goto': goTo});
							}
						}

						function keyboardEvents(e){
							if (galleryActive) {
								switch (e.keyCode) {
									case 37: clickPrev(); break;	
									case 39: clickNext(); break;	
								}
							}
						}

						// set css rules for $items, one of main functions
						function setOrder() {
							// call method onChange for inner callback out of script
							getObject.onChange($items.eq(itemsOrder[middleIndex]), itemsOrder[middleIndex]===0 ? length : itemsOrder[middleIndex], length);

							getObject.pagination.enable&&paginationSet(itemsOrder[middleIndex]);

							for (var j=0; j<length; j++){
								var	i = itemsOrder[j],
								 	$this = $items.eq(i),
									img = $this.find('img'),
									w = img.width(),
									h = img.height(),
									diffIndex = j - (middleIndex-1),
									diffIndexAbs = Math.abs(j - (middleIndex-1)),
									newIndex = (diffIndex % middleIndex),
									prop = getObject.cssProperty,
									coeff = 0,
									classToAdd = '',
									cssProperties = {
										'width': w,
										'height': h,
										'left' : '50%'
									};

								if (diffIndex > 0) { 
									coeff = 1;
									classToAdd = ' ' + getObject.rightSideClass.substr(1);
								}
								else if (diffIndex < 0) {
									coeff = -1;
									classToAdd = ' ' + getObject.leftSideClass.substr(1);
								}
								cssProperties[prop] = (-w*.5 + newIndex*getObject.itemOffset) + coeff*getObject.itemOffsetCenter;

								if (getObject.useCSS3Animation) {
									cssProperties['zIndex'] = (middleIndex - diffIndexAbs);
									$this
										.attr('class', getObject.transformClasses[diffIndexAbs] + classToAdd)
										.css(cssProperties);
								} else {
									$this
										.attr('class', getObject.transformClasses[diffIndexAbs] + classToAdd)
										.css({'zIndex': (middleIndex - diffIndexAbs)})
										.stop()
										.animate(cssProperties);
								}
							}
						}

						// create reflections with $items
						function createReflections(){
							$items.each(function(i){
								var $this = $(this),
									img = $this.find('img'),
									rClass = getObject.reflections.reflectionClass.substr(1);

								$.when( img.parent().after('<canvas class="'+rClass+'"></canvas>') )
									.then(function(d){ 
										var canvas = d.siblings(getObject.reflections.reflectionClass);
										if (canvas[0].getContext) {
											var refl = {
												context: canvas[0].getContext("2d"),
												width: canvas.width(),
												height: canvas.height()
											}
											canvas.attr({'width': refl.width, 'height': refl.height});

											// draw a piece of image
											refl.context.drawImage(img[0], 0, img.height()-refl.height, refl.width, refl.height, 0, 0, refl.width, refl.height);
											// draw gradient for reflection
											refl.context.globalCompositeOperation = "destination-out";
											var gradient = refl.context.createLinearGradient(0, 0, 0, refl.height);
											gradient.addColorStop(0, getObject.reflections.startColor);
											gradient.addColorStop(1, getObject.reflections.endColor);
											refl.context.fillStyle = gradient;
											refl.context.fillRect(0, 0, refl.width, refl.height);
										}
									})
							})
						}

						// function for move to previous item
						function prev(e){
							itemsOrder.unshift(itemsOrder.pop());
							setOrder();
							return false;
						}

						// function for  move to next item
						function next(e){
							itemsOrder.push(itemsOrder.shift());
							setOrder();
							return false;
						}

						// function for  move to previous item with stop autoplay
						function clickPrev(e){
							$this.trigger('firstAction');
							stopAutoplay();					
							prev(e);
							return false;
						}

						// function for  move to next item with stop autoplay
						function clickNext(e){	
							$this.trigger('firstAction');
							stopAutoplay();					
							next(e);
							return false;
						}

						function firstAction(e){
							if (!isFirstActionDone) {
								isFirstActionDone = true;
								getObject.onUserActivate();
							}
						}

						// function for d(param) step shift
						function go(e, d){
							var diff, wayFunc;
							function getFunc(diff){
								// return function for moving items (previous or next) 
								return (diff > 0) ? clickNext : clickPrev;
							}
							if (!d) {
								var ind = $(e.target).parents('li').index();
								diff = ind - $items.eq(itemsOrder[middleIndex-1]).index();
							} else {
								diff = parseInt(d);
							}
							wayFunc = getFunc(diff);
							diff = Math.abs(diff);
							while (diff > 0){
								wayFunc();
								diff--;
							}
						}

						// move by index
						function goTo(e, d){
							if (d) {
								d = parseInt(d);
								$items.eq(d) && $a.eq(d).trigger('click');
							}
						}

						// item click listener
						function clickItem(e){
							var objClasses = $(this).parent().attr('class').split(' ');
							for (var i=0;i < objClasses.length;i++){								
								if ($.inArray(objClasses[i], getObject.clickableClasses)) {
									go(e);
									return false;
								} else {
									go(e);
								}
							}
						}

						// initialize pagination
						function paginationInit(){
							getObject.pagination = $.extend(paginationDefaults, o.pagination);
							if (getObject.pagination.enable) {
								getObject.pagination.$this = $(getObject.pagination.paginationClass)
								getObject.pagination.$li = getObject.pagination.$this.find('li');
								getObject.pagination.$a = getObject.pagination.$this.find('a');
								getObject.pagination.$a
									.on('click', function(e){
										clickItem(e);
										return false;
									});
							}	
						}

						// set active pagination item
						function paginationSet(ind){
							if (getObject.pagination.enable && getObject.pagination.$a) {
								var $li = getObject.pagination.$li,
									actClass = getObject.pagination.activeClass.substr(1);
								$li
									.siblings().removeClass(actClass).end()
									.eq(ind-1).addClass(actClass);
							}
						}

						// autoplay start function 
						function startAutoplay(){
							getObject.autoplay.id = setTimeout(function(){
								if(getObject.autoplay.enable){
									next();
									startAutoplay();
								}
							}, getObject.autoplay.timeout);
						}

						// autoplay start function 
						function stopAutoplay(){
							clearTimeout(getObject.autoplay.id);
						}
					}
				}
			
			data?object=data:$this.data({tm3DCircleCarousel: getObject});
    		typeof o=='object' && $.extend(getObject, o);
    		getObject.me || getObject.constructor(getObject.me=$this);
		});
	}
})(jQuery);