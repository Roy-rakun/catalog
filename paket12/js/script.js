function include(url){document.write('<script type="text/javascript" src="'+url+'"></script>')}

//------ base included scripts -------//
    include('js/jquery.mousewheel.min.js');
    include('js/jquery.easing.1.3.js');
//------------------------------------//
    include('js/jquery.touchSwipe.min.js');
    include('js/fullyGallery.js');
    include('js/superfish.js');

var 
    parsedArray = []
,   alignArray = []
,   isGallery = true
,   hintTimeOut
,   viewState = 0
,   reBuild = false;
;    

if(!FJSCore.mobile){
    //document.write('<link rel="stylesheet" href="css/non-responsive.css">');
    
}else{
    //------ photoswipe scripts -------//
    include('js/klass.min.js');
    include('js/code.photoswipe.jquery-3.0.5.js'); 
}

$(function(){
    FJSCore.defState = 'people';

    $("#footeryear").text((new Date).getFullYear());


    if(FJSCore.mobile){
        $('body').css({'min-width':'inherit', 'min-height':'inherit'});
        
        $('#mobile-navigation > option').eq(0).remove();
        $('#mobile-navigation > option').eq(1).remove();
        $('#mobile-navigation > option').eq(1).remove();
        $('#mobile-navigation > option').eq(1).remove();
        $('#mobile-navigation > option').eq(1).remove();
        $('#mobile-navigation > option').eq(1).remove();
        $('#mobile-navigation > option').eq(0).change();

        $('h1 > a').attr({"href":"./folioPage.html"});

    }
    ////////////////////////////////////////////////////////////
    $('#contentPages') 
        .on('show','>*',function(e,d){
            viewState = 1;
            $.when(d.elements)
                .then(function(){
                    if(!d.curr.hasClass('_active')){
                        d.curr                      
                            .stop()
                            .css({
                                display:'block'
                            ,   opacity:0
                            })
                            .animate({
                                opacity:1    
                            },{
                                duration:200
                                ,complete:function(){
                                    d.curr.addClass('_active');
                                    $(window).trigger('resize');
                                }
                            })
                    } 
                    
                    $('.galleryControls').stop(true).animate({bottom: -50}, 500, "easeOutCubic");
                    $('header').stop(true).animate({top: '0px'}, 500, "easeOutCubic");           
                })          
        })
        .on('hide','>*',function(e,d){             
            $(this)
                .stop()
                .animate({   
                    opacity: 0
                },{
                    duration:300
                    ,complete:function(){
                        $(this).removeClass('_active');
                        $(this).css({display:'none'});
                        //$(window).trigger('resize');
                    }
                })
        })	
    ////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
        FJSCore.modules.responsiveContainer({
            elementsSelector: '#contentPages > div'
        ,   activePageSelector: '._active'
        ,   affectSelectors: 'header, footer'
        });
    ////////////////////////////////////////////////////////////////////
    $('#category_pages')
        .on('show','>*',function(e,d){
            viewState = 0;
            $('.galleryControls').stop(true).animate({bottom: 30}, 500, "easeOutCubic");
            $('header').stop(true).animate({top: '210px'}, 500, "easeOutCubic"); 

            $(window).trigger('resize');

            $.when(d.elements)
                .then(function(){
                    parsedArray = [];
                    alignArray = [];
                    $('>div',d.curr).each(
                        function(){
                            parsedArray.push($(this).attr('data-preview'));
                            alignArray.push($(this).attr('data-align'));
                        }
                    )

                    $('#galleryPrototype4').trigger('reBuild', {'urlArray':parsedArray, 'alignArray':alignArray});
                    hintShowCycle();
                })          
        })
        .on('hide','>*',function(e,d){})
    ////////////////////////////////////////////////////////////////////////
    $(document)
        .on('show','#mobile-content>*',function(e,d){                   
            $(".folioList > li").click(
                function(){
                    var instance = $(".photoSwipe1 a", this).photoSwipe()
                    instance.show(0);
                }
            )
        })              
        .on('hide','#mobile-content>*',function(e,d){})  

        $(window).on('resize', onResize);   
})
/*---------------------- end ready -------------------------------*/

function onResize(e){
        //
        if($(window).width()<1100){ reBuild = true; }else{ reBuild = false; }


        if(!FJSCore.mobile){
            if(reBuild){
                if(viewState == 0){
                    tmpValue = $('#rightSide').height();
                }
                if(viewState == 1){
                    tmpValue = $('#rightSide').height() - $('footer').height();

                }
                
               
                    $('body').trigger('updateDeltaHeight', tmpValue.toString());
                
            }else{
                tmpValue = -1*$('footer').height();
                $('body').trigger('updateDeltaHeight', tmpValue.toString());

            }
        }
    }


function hintShowCycle(){
    _hintHolder = $('#hintHolder');
    clearTimeout(hintTimeOut);
    _hintHolder.css({'display':'block', 'opacity':0}).fadeTo(400, 1); 
    hintTimeOut = setTimeout(
        function(){
            _hintHolder.fadeTo(400, 0, function(){
                $(this).css({'display':'none'});
            }); 
        },
        5000
    )
}


$(window).load(function(){  
    $("#webSiteLoader").fadeOut(500, 0, function(){
        $("#webSiteLoader").remove();
    });   

    $('#mainNav > ul').superfish({
        animation: {height: 'show'}
    ,   animationOut: {height: 'hide'}
    });
    


    if(!FJSCore.mobile){
        parsedArray = [];
        $('#galleryPrototype4 ul li').each(
            function(){
                parsedArray.push($(this).attr('data-preview'));
            }
        )

        $('#galleryPrototype4').fullyGallery({
            destination: $('body #glob-wrap')
        ,   prevButton: $('.galleryControls > .prevBtn')
        ,   nextButton: $('.galleryControls > .nextBtn')
        ,   counter: $('.galleryControls > .counter')
        });


        $('#galleryPrototype4').trigger('reBuild', {'urlArray':parsedArray, 'alignArray':alignArray});

        $('#fullPreviewHolder .closeButton').addClass('fa fa-times');
        $('#fullPreviewHolder .nextButton').addClass('fa fa-chevron-right');
        $('#fullPreviewHolder .prevButton').addClass('fa fa-chevron-left');
        
    }else{
        //----- mobile scripts ------//
        $('#mobile-header>*').wrapAll('<div class="container"></div>');
        $('#mobile-footer>*').wrapAll('<div class="container"></div>');

        
    }
});
