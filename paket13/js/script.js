function include(url){document.write('<script type="text/javascript" src="'+url+'"></script>')}

//------ base included scripts -------//
include('js/jquery.easing.js');
include('js/TMForm.js');
include('js/owl.carousel.js');
//------------------------------------//

if(!FJSCore.mobile){
    include('js/hoverIntent.js');
    include('js/superfish.js'); 
    include('js/spin.min.js');
    include('js/jquery.touchSwipe.min.js');
}

var win = $(window),
    doc = $(document),
    $content,
    contentWidth = 0,
    coordX = 0;

function spinnerInit(){    
    var opts = {
        lines: 11,
        length: 10,
        width: 5,
        radius: 14, 
        corners: 1,
        color: '#fff',
        speed: 1.3,
        trail: 5
    },
    spinner = new Spinner(opts).spin($('#webSiteLoader')[0]);
}

function initPluginsPages(){
    initContactForm();  
}

function initPluginsPagesContent(currPage){
    /*carousel*/
    var owl = $(".owl", currPage); 
    owl.owlCarousel({
        items : 1, //10 items above 1000px browser width
        itemsDesktop : [995,1], //5 items between 1000px and 901px
        itemsDesktopSmall : [767, 1], // betweem 900px and 601px
        itemsTablet: [700, 1], //2 items between 600 and 0
        itemsMobile : [479, 1], // itemsMobile disabled - inherit from itemsTablet option
        navigation : false,
        pagination :  true
    });

    $('.btn-photo', currPage)
    .off('click')
    .on('click', function(){
        var $this = $(this);
        if ($this.hasClass('active')) {
            $this.removeClass('active');
            $('.owl-wrapper-outer, .owl-controls').removeClass('active'); 
        } else {
            $('.owl-wrapper-outer')
            .on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e) {
                win.trigger('resize');
            });  

            $this.addClass('active');
            $('.owl-wrapper-outer, .owl-controls').addClass('active');

        }
    });
}

function initPlugins(){
   initSplash();
}

// function moveSplashToCenter () {
//     var currVal = win.width()*.5 * ($content.width() - win.width()) / win.width();
//     $content.stop(true).animate({'left': -currVal}, 0);
// }

function initSplash(){
    var screenItems = 4,
        visibleCoef = 0.9,
        hiddenCoef = 1 / screenItems;

    /*carousel*/
    var owl = $("#owl"); 
        owl.owlCarousel({
        items : 10, //10 items above 1000px browser width
        itemsDesktop : [995,15], //5 items between 1000px and 901px
        itemsDesktopSmall : [767, 10], // betweem 900px and 601px
        itemsTablet: [700, 10], //2 items between 600 and 0
        itemsMobile : [479, 5], // itemsMobile disabled - inherit from itemsTablet option
        navigation : false,
        pagination :  false
    });

    $('.show-panel').on('click', function(){
        var $holder = $('.pagination-holder');
        !$holder.hasClass('show') ? $holder.addClass('show') : $holder.removeClass('show');
    });

    win.on('resize', onResize);

    // resize function
    function onResize(){
        var totalW = 0,
            sElement = '>div',
            minHeight = parseInt($('body').css('minHeight')),
            height = (minHeight > win.height()) ? minHeight : win.height();

        $content && $content.find(sElement).each(function(){
            var $this = $(this);
                coef = $this.hasClass('active') ? visibleCoef : hiddenCoef,
                currentW = Math.round(win.width() * coef);

            totalW += currentW;

            $this.stop(true).animate({
                'width': currentW,
            }, 1000, 'easeOutExpo');

            $this.css({
                'height': height
            });
        });

        contentWidth = totalW;

        var props = {
            'width': totalW,
            'height': height
        } 

        if (parseInt($content.css('left')) < -(contentWidth - win.width())) {
            props.left = -(contentWidth - win.width());
        }

        $content.css(props);

        $('#glob-wrap').css({
            'height': height
        });
        
        updateHeight();
    }

    splashEnable();

    // pagination
    var $a = $('.pagination-holder a');    
    // content switch
    $content
        .on('show','>*',function(e,d){
            $.when(d.elements)
                .then(function(){
                    d.curr
                        .addClass('active')                  
                            .find('a.model-logo').addClass('hide-button');


                    // setTimeout(updateHeight, 100);

                    setTimeout(function(){    
                    win.trigger('resize');
                        // calculate coordinate X
                        coordX = win.width()*hiddenCoef * d.curr.index() - win.width() * (1 - visibleCoef)*.5;                    
                        coordX = (coordX > (contentWidth - win.width())) ? -(contentWidth - win.width()) : -coordX;
                        if (coordX > 0) coordX = 0;

                        initPluginsPagesContent(d.curr);

                        $content
                            .stop(true)
                            .animate({
                                left: coordX
                            },
                            1500,
                            'easeOutExpo');

                        $a.eq(d.curr.index())
                            .parent().addClass('active');
                    },0);
                })          
        })
        .on('hide','>*',function(e,d){ 
            $a.parent()
               .siblings().removeClass('active');

            var $btn = $(this).find('.btn-photo');

            if ($btn.length && $btn.hasClass('active')){
                $btn.trigger('click');
            }

            $(this)
                .removeClass('active')
                .find('a.model-logo').removeClass('hide-button');
        });
}

function splashDisable(){
    splash_enable = false;
    doc
        .trigger('mousemove', '3000')
        .off('mousemove');
}

function splashEnable(){
    splash_enable = true;
    $('.owl-wrapper-outer, .owl-controls, .btn-photo').removeClass('active');
    // mousemove
    var widthCoef = 0.3,
        step = 50,
        currVal = 0;
    if (!FJSCore.tablet) {
        doc
            .on('mousemove', function(e,d){
                var time = (!d) ? 6000 : parseInt(d);
                currVal = e.pageX * ($content.width() - win.width()) / win.width();
                $content.stop(true).animate({'left': -currVal}, time);
            })
    } else {
        currVal = 0;

        function moveHolder(delta){
            if (splash_enable) {
                currVal += delta;
                var w = $content.width();
                currVal = (currVal > w-win.width()) ? (w-win.width()) : currVal;
                currVal = (currVal < 0) ? 0 : currVal;
                $content.stop(true).animate({'left': -currVal}, 1500);
            }
        }

        if ($.fn.swipe) {
            $content
                .swipe({
                    swipeLeft:function(event, direction, distance, duration, fingerCount) {
                        moveHolder(distance);
                    },
                    swipeRight:function(event, direction, distance, duration, fingerCount) {
                        moveHolder(-distance);
                    }
                });
        }
    }
}

function updateHeight(){
    if ($content.find('>div.active').length) {
        var delta = $content.find('>div.active .container').outerHeight(true) - $('header').outerHeight(true);
        $('body').trigger('updateDeltaHeight', delta.toString());
    } else {
        $('body').trigger('updateDeltaHeight', '0');
    }       
}

$(function(){
    $("#year").text((new Date).getFullYear());
    $content = $('#content');

    if(FJSCore.mobile){
        doc
            .on('show','#mobile-content>*', function(e,d){
                initPluginsPagesContent();
                initPluginsPages();
            })      
            .on('hide','#mobile-content>*',function(e,d){

            })
    } else {
        // responsive module init
        FJSCore.modules.responsiveContainer({
            container: '#other_pages',
            elementsSelector: '#other_pages>div',
            defStates: '',
            activePageSelector: '.active'
        });

        $('#mainNav').superfish({
            speed: 'fast'
        });

        spinnerInit();
        initPlugins();

        var otherPageContainer = $('#other_pages');
        otherPageContainer
            .on('show','>*',function(e,d){
                $.when(d.elements)
                    .then(function(){
                        $content.addClass('splash-disable');

                        initPluginsPages();
                        setTimeout(function(){
                            win.trigger('resize');
                        },100);

                        d.curr
                            .stop(true, true)
                            .css({'display':'block', 'opacity': '0'})
                            .animate({'opacity': '1' }, 300, function(){ 
                                $(this).addClass('active'); 
                                $('body').trigger('resizeContent');

                                setTimeout(function(){
                                    win.trigger('resize');
                                },50);

                            })
                    })         
            })
            .on('hide','>*',function(e,d){ 
                $content.removeClass('splash-disable');

                $(this)
                    .removeClass('active')
                    .stop(true, true)
                    .animate({ 'opacity': '0' }, 500, function(){
                        $(this).css('display','none');
                    });              
            }) 
    }

})
/*---------------------- end ready -------------------------------*/

doc.on('changeState',function (e){
    $('body').trigger('resizeContent');
    win.trigger('resize');

    if (FJSCore.state == '') {
        splashEnable();
    } else {
        splashDisable();
    }

    updateHeight();
});

win.on('orientationchange', function(){
    updateHeight();
    setTimeout(function(){
        win.trigger('resize');
    },10);
});

$(window).load(function(){  
    $("#webSiteLoader").fadeOut(500, 0, function(){
        $("#webSiteLoader").remove();   
        //moveSplashToCenter();   
    });    
    
    if(FJSCore.mobile){
        //----- mobile scripts ------//
        $('#mobile-header>*').wrapAll('<div class="container"></div>');
        $('#mobile-footer>*').wrapAll('<div class="container"></div>');
    }

    win
        .trigger('afterload')
        .trigger('resize');

    doc.trigger('changeState', FJSCore.state);
});