/*jslint browser: true*/
/*global $, jQuery, alert, console */
/*jshint loopfunc: true */

$(document).bind("mobileinit", function(){
	$.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
    //$.mobile.hashListeningEnabled = false;
    //$.mobile.linkBindingEnabled = false;
});

$(document).on("iscrollview_init", function() {
    //$.mobile.iscrollview.prototype.options.refreshDelay = 100;
});

$(function () {  // document ready
    
    var flugur = [];
    var listItemNormalClasses = "ui-btn ui-btn-b";
    var listItemHighlightedClasses = "ui-btn ui-btn-b ui-btn-active";
    var activeListItem;
    
    function randomFromInterval(from,to) {
        return Math.floor(Math.random()*(to-from+1)+from);
    }
    
    /*
     * Instance CirclePlayer inside jQuery doc ready
     *
     * CirclePlayer(jPlayerSelector, media, options)
     *   jPlayerSelector: String - The css selector of the jPlayer div.
     *   media: Object - The media object used in jPlayer("setMedia",media).
     *   options: Object - The jPlayer options.
     *
     * Multiple instances must set the cssSelectorAncestor in the jPlayer options. Defaults to "#cp_container_1" in CirclePlayer.
     */

    
    // This code creates a 2nd instance. Delete if not required.

    var fluguspilari = new CirclePlayer("#jquery_jplayer_2",
    {
        mp3:"http://radiusflugur.nemur.net/r/Ungbarnamalvisindi.mp3"
    }, {
        cssSelectorAncestor: "#cp_container_2",
        supplied: "mp3",
        swfPath: "js",
        wmode: "window"
    });
    
    
    
    function loadFluga( fluga ) {
		$("#jquery_jplayer_2").jPlayer("setMedia", {
			mp3: "http://radiusflugur.nemur.net/r/"+fluga+".mp3"
		});
    }
    function playFluga() {
        $("#jquery_jplayer_2").jPlayer("play");
    }
    function scrollToActiveListItem() {
        $('#fluguscroll').iscrollview("scrollToElement", activeListItem.get(0), 2000 );
    }
    function lowlightActiveListItem() {
        if( activeListItem ) {
            activeListItem.find('a:first').removeClass(listItemHighlightedClasses).addClass(listItemNormalClasses);
        }
    }
    function highlightActiveListItem() {
        activeListItem.find('a:first').removeClass(listItemNormalClasses).addClass(listItemHighlightedClasses);
    }
    function updateUrlHash( fluga ) {
        history.pushState(null, null, "#"+fluga);
    }

    $('#flugulisti').on('click', 'li', function () {
        //alert($(this).text());
        
        lowlightActiveListItem();
        activeListItem = $(this);
        
        var fluga = $(this).text();
        loadFluga(fluga);
        playFluga();
        
        updateUrlHash(fluga);
    });
    
    $('#flugulisti').on('click', 'li', function () {
       event.preventDefault(); 
    });        
    
    $.ajax({
        type: "GET",
        url: "/radius.xml",
        cache: false,
        dataType: "xml",
        success: function(xml) {
            var $flugulisti = $("#flugulisti");
            $(xml).find('ListBucketResult > Contents ').each(function(){
                var key = $(this).find("Key").text();
                if( key.indexOf("r/") === 0 && key.substring(2) ) {
                    var fileName = key.substring(2, key.length-4)
                    flugur.push( fileName );
                    
                    var oneLi = $( '<li/>', {'data-icon':'false', 'data-theme':'b', 'id':fileName} );
                    var oneAnchor = $('<a/>', {'href':'#'+fileName,'rel':'external','text':fileName});
                    oneLi.append( oneAnchor );
                    $flugulisti.append( oneLi );
                    
                }
            });
            $flugulisti.listview( "refresh" );

        },
        always: function() {

        }
    });
    
    $(".random-wrapper").click(function(){
        
        var fluga = flugur[randomFromInterval(0,flugur.length-1)];
                
        loadFluga(fluga);

        lowlightActiveListItem();
        activeListItem = $("#flugulisti").find('#'+fluga);
        
        $(this).find("img").rotate({
            duration:2000,
            angle: 0, 
            animateTo:360,
            callback: function(){
                highlightActiveListItem();
            }
        });
        $(".logo-wrapper img").rotate({
            duration:2500,
            angle: 0, 
            animateTo:360
        });
        
        scrollToActiveListItem();
        
        playFluga();
        
        updateUrlHash(fluga);
    });
    
    $(".sharing-wrapper").click(function(){
        $.mobile.changePage( "#sharing", { role: "dialog" } );
    });
    
    
    $.mobile.activePage.find(".iscroll-wrapper").bind("iscroll_onafterrefresh", function () {
        // if the page's hash is set, open image with that hash
        // if there is one. otherwise, just open the first image.
        // note that if there's a hash, it'll begin with #.
        var hash = (window.location.hash || " ").substr(1);
        // check if hash is in scanNames
        if( $.inArray(hash, flugur) < 0 ) {
            //console.log($.inArray(hash, flugur));
            hash = null;
        }
        loadFluga((hash || flugur[0]));
        activeListItem = $("#flugulisti").find('#'+(hash || flugur[0]));
        highlightActiveListItem();
        scrollToActiveListItem();
    });
    

});