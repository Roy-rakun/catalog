function include(url){document.write('<script type="text/javascript" src="'+url+'"></script>')}

//------ base included scripts -------//
include('js/jquery.easing.js');
include('js/klass.min.js');

include('js/jquery-migrate-1.2.1.js');
include('js/TMForm.js');
include('js/modal.js');

if(!FJSCore.mobile){
    include('js/hoverIntent.js');
    include('js/superfish.js'); 
    include('js/spin.min.js');
    include('js/jquery-ui-1.10.3.custom.min.js');
    include('js/jquery.touchSwipe.min.js');
    include('js/tm3DCircleCarousel.js');
    include('js/tmMultimediaGallery.js');
}

if(FJSCore.mobile){
    include('js/code.photoswipe.jquery-3.0.5.js');
}
//------------------------------------//
var win = $(window),
    doc = $(document),
    currentIndex = 0,
    f_scr = 0,
    msie = (navigator.appVersion.indexOf("MSIE")!==-1),
    lb = 0,
    $fullGallery,
    $splashGallery;

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

function initPlugins(){
    initContactForm();   

    phSwipe = 0;

    phSwipe = $(".splash-list > li .mobile-only")
    phSwipe.length && phSwipe.photoSwipe();

    phSwipe = $(".photoSwipe1 > li a")
    phSwipe.length && phSwipe.photoSwipe();

}


function initCarousel(){
    // init carousel
    $splashGallery = $('.splash');  
    $splashGallery
        .tooltip({
            track: true
        })
        .tm3DCircleCarousel({
            container: '.splashHolder',
            transformClasses: '.scale100, .scale90, .scale80, .scale70, .scale60, .scale50',
            clickableClasses: '.scale100, .scale90',
            itemOffset: 368,
            itemOffsetCenter: 94,
            useCSS3Animation: true,
            autoplay: {
                enable: false,
                timeout: 8000
            },
            onChange: function(element, currInd, length){
                currentIndex = currInd-1;
            },
            onShowActions: function(e){
                $splashGallery.tooltip('enable');
            },
            onHideActions: function(e){
                $splashGallery.tooltip('disable');
            },
            onUserActivate: function(e){
                $splashGallery.tooltip('disable');
            }
        });
}

function toggleFullScreen() {
   if (!document.fullscreenElement &&    // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    $('.full-btn').find('.ic1').css({'display':'none'});
    $('.full-btn').find('.ic2').css({'display':'block'});
    setTimeout(function(){
            f_scr = 1;
    }, 300);

     if (document.documentElement.requestFullscreen) {
       document.documentElement.requestFullscreen();
     } else if (document.documentElement.mozRequestFullScreen) {
       document.documentElement.mozRequestFullScreen();
     } else if (document.documentElement.webkitRequestFullscreen) {
       document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
     }
   } else {
    $('.full-btn').find('.ic1').css({'display':'block'});
    $('.full-btn').find('.ic2').css({'display':'none'});
    f_scr = 0;
      if (document.cancelFullScreen) {
         document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
         document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
   }
}

function hideSiteLoader(){
    var loader = $("#webSiteLoader");
    if (!loader.length) {
        return;
    }
    loader.stop(true, true).fadeOut(300, function(){
        loader.remove();
    });
}

function initFullGallery(){
    $fullGallery = $(".galleryHolder"); 
    $fullGallery.tmMultimediaGallery({
        showOnInit: false,
        container: '.galleryContainer',
        imageHolder: '.imageHolder',
        next: '.nextButton',
        prev: '.prevButton',
        prev: '.prevButton',
        pagination: '.inner',
        spinner: '.imgSpinner',
        animationSpeed: '1.2',
        autoPlayState: false,
        controlDisplay: true,
        paginationDisplay: true,
        autoPlayTime: 12,
        alignIMG: 'center',
        mobile: FJSCore.tablet,
        onShowActions: function(){
            setTimeout(function(){
                $('.controls-holder, .close-icon').addClass('show-item');
            }, 500);
        },
        onHideActions: function(){
            $('.controls-holder, .close-icon').removeClass('show-item');
            $('.galleryContainer').removeClass('showGallery');
        }
    });

    win.trigger('resize');

    $('.full-btn').on('click', function(){
        toggleFullScreen();
    });

    spinnerInit();

    if(msie==true){

        setTimeout(function(){ $('.full-btn').css({'display':'none'}); }, 600)
    }
}

doc.on('changeLocation',function (e){
    $('body').trigger('resizeContent');
})

function onResize(e){

    if(!FJSCore.mobile){

        if(f_scr == 1){
            $('.full-btn').find('.ic1').css({'display':'block'});
            $('.full-btn').find('.ic2').css({'display':'none'});
        }

    }
}

$(function(){
    $("#year").text((new Date).getFullYear());
    $(window).on('resize', onResize);
    
    if(FJSCore.mobile){
        $('body').css({'min-width':'inherit'});   
        
        $(document)
            .on('show','#mobile-content>*', function(e,d){
                $('.splash').removeClass('splash').addClass('splash-list');

                $('.photoswipe-link').on('click', function(){
                    var phSwipe = $(".photoSwipe a");
                    if (phSwipe.length) {
                        var instance = $(".photoSwipe a", this).photoSwipe();
                        instance.show(0);
                    }
                })

                initPlugins();
                setTimeout(function(){
                    win.trigger('resize');
                },100);
            })      
            .on('hide','#mobile-content>*',function(e,d){

            })
    } else {
        $('#mainNav').superfish({
            speed: 'fast'
        });
        $('#mainNav>ul>li>a').each(function(){
            var $this = $(this),
                txt = $this.text();
            $this.html('<div><span>'+ txt +'</span></div><div><span>'+ txt +'</span></div>');
        })  
        if (FJSCore.tablet){
            $('.subNav a').each(function(){
                var $this = $(this);
                $this.append('<span>'+$this.siblings('.labelText').text()+'</span>');
            })
        }
    }
    
    var content = $('#content');
    content
        .on('show','>*',function(e,d){  
            if (d) {
                d.curr
                    .addClass('active')
                    .css({'display': 'block'});

                if (d.curr.attr('id').indexOf('gallery') !== -1) {
                    setTimeout(function(){
                        content.css({'zIndex': 1000, 'height': '100%', 'position': 'absolute', 'top': '0'});

                        var index = (d.curr.attr('id').indexOf('gallery-1') !== -1) ? currentIndex : 0;
                        $fullGallery && $fullGallery.trigger('showGallery', index.toString());

                        $splashGallery && $splashGallery.trigger('hideGallery');

                        win.trigger('resize');
                    },0);
                }
                
                d.curr
                    .stop(true, true)
                    .animate({
                        opacity: '1'
                    },{
                        duration: 1000,
                        ease: 'easeInOutCubic',
                        complete:function(){    
                            win.trigger('resize');       
                        }
                    })     
                }
        })
        .on('hide','>*',function(e,d){   
            content.css({'zIndex': 10, 'height': 'auto', 'position': 'relative', 'top': 'auto'});

            $fullGallery && $fullGallery.trigger('hideGallery');
            $splashGallery && $splashGallery.trigger('showGallery');

            $(this)
                .removeClass('active')
                .stop(true, true)
                .animate({
                    opacity: '0'
                },{
                    duration: 500,
                    ease: 'easeInOutCubic',
                    complete: function(){
                        $(this).css('display','none');
                    }
                })
        });

    var otherPageContainer = $('#other_pages');
    otherPageContainer 
        .on('show','>*',function(e,d){
            $.when(d.elements)
                .then(function(){

                    initPlugins();

                    setTimeout(function(){
                        win.trigger('resize');
                    },100);
                    
                    d.curr
                        .stop(true, true)
                        .css({'display':'block', 'opacity': '0'})
                        .animate({'opacity': '1' }, 300, function(){ 
                            $(this).addClass('activeSubPage'); 
                            $('body').trigger('resizeContent');
                        })
                })         
        })
        .on('hide','>*',function(e,d){ 
            
            $(this)
                .removeClass('activeSubPage')
                .stop(true, true)
                .animate({ 'opacity': '0' }, 500, function(){
                    $(this).css('display','none');
                    $('body').trigger('resizeContent');
                });              
        })  
})
/*---------------------- end ready -------------------------------*/

win
.load(function(){
    setTimeout(hideSiteLoader, 700);

    if(FJSCore.mobile){
        //----- mobile scripts ------//
        $('#mobile-header>*').wrapAll('<div class="container"></div>');
        $('#mobile-footer>*').wrapAll('<div class="container"></div>');
    } else{
        initCarousel();
        initFullGallery();
    }

    FJSCore.modules.responsiveContainer({
        elementsSelector: '#other_pages>div',
        defStates: ', gallery-1.html, gallery-2.html, gallery-3.html, gallery-4.html, gallery-5.html'
    });

    win
        .trigger('afterload')
        .trigger('resize'); 
});
