var nconfig = {
    hero: null,
    firstLoad: true,
    navbar: {
        title: false,
        links: []
    },
    lightboxOn: false
};

(function() {

    function loadHTML(t) {
        var html = document.getElementsByTagName('html')[0];
        if (t) {
            html.classList.remove('unloaded');
            html.classList.add('loaded');
        }
        else {
            html.classList.add('unloaded');
            html.classList.remove('loaded');
        }
    }

    function lightbox() {
        console.log('Init Lightbox')
        var lightboxContainer = $('<div class="n-lightbox"></div>');
        var initLightbox = function() {
            $('body').prepend(lightboxContainer);
            
            $(lightboxContainer).append('<div class="n-lightbox__blocker"></div>').on("contextmenu",function(){
                    return false;
                }); 
            $(lightboxContainer).append('<span id="n-lightbox__close"><a>Close Lightbox &times;</a></span>')
            
            $(lightboxContainer).on("click", function(){
                $(this).addClass('closing');
                var thisI = this;
                setTimeout(function() {
                    $(thisI).removeClass('open');
                    $(thisI).find('img').remove();
                    $(thisI).removeClass('closing');
                },700);
            })
        }
        if (!nconfig.lightboxOn) {
            nconfig.lightboxOn = true;
            initLightbox();
        }
        $('article .notion-image img').each(function(index) {
            console.log(`Lightbox num: ${index}`)
            $(this).on("click", function() {
                console.log('Clicked!')
                $('.n-lightbox').append('<img src="'+$(this).attr('src') + '">');
                $('.n-lightbox').addClass('open');
            })
        })
    }

    function parseCallout(callout) {
        var map = {
            hasLink: false,
            hasChildren: false,
            firstChild: false,
            type: 'callout', // hero : callout : section : cta-button
            bg: {
                exists: false,
                container: null,
                icon: null,
                img: null,
                embed: null
            }
        }
        //console.log('parse callout activated!')

        //
        // TESTS
        //

        //Check to see if Callout is first child of page
        if ($(callout).is(':first-child') && ($(callout).parent('article').length >= 1)) {
            console.log('FIRST CHILD');
            map.firstChild = true;
        }

        //Check to see if Callout has children blocks
        if ($(callout).find('> p.notion-callout__content > .notion-semantic-string').next().length) {
            map.hasChildren = true;
            console.log('has child!');
        }

        //Check to see if Callout has a link
        if ($(callout).find('> .notion-callout__content > .notion-semantic-string a:first-child').length >= 1) map.hasLink = true;

        //Check to see if Callout has an image icon or embed for BG
        if ($(callout).has('> .notion-callout__icon img').length >= 1) { map.bg.exists = true; map.bg.icon = true; }
        if ($(callout).has('> .notion-callout__content > .notion-embed:nth-child(2)').length >= 1) { console.log('has video'); map.bg.exists = true; map.bg.embed = true; }


        //
        // TYPE
        //

        // Detect Callout section or basic callout
        if(map.hasChildren) {
            map.type = 'section';
        }
        else {
            map.type = 'callout';
        }

        // Detect if Callout is first child + hero
        if(map.firstChild) {
            map.type = 'callout-hero';

            $('body').addClass('n-contains-hero');

            //Check to see if there are 4 more callouts
            //Check to see if next set is column
            if ($(callout).next().hasClass('notion-column-list')) {

                var searchArea = $(callout).next();

                if ($(searchArea).has('.notion-column > .notion-callout').length) {
                    $(searchArea).addClass('n-callout-children');
                }
            }
        }

        // Detect CTA buttons
        // Block is CTA IF: it has no children, and has a link.
        if(!map.hasChildren && map.hasLink) {
            map.type = 'cta-button';

            $(callout).addClass('n-cta-button');
            
            if($(callout).find('> .notion-callout__content > .notion-semantic-string strong').length !== 0) { $(callout).addClass('btn-secondary') }
                else { $(callout).addClass('btn-primary')}
        }



        // Add Class
        console.log('ADDING CLASS');
        $(callout).addClass(`n-${map.type}`);


        //
        // IMPLEMENT
        //
        
        // Add link to Callouts
        if(map.hasLink) {
            //TODO:
            //  - Make it so SMS can be preceeded by anything else
            //  - (DONE) Look into having A tag INSIDE block
            //  - If only a part of the string is a link, the text can be taken out of order as it's just being "appended" and not added back in line
            $(callout).addClass('contains-link');
            var link = $(callout).find('> .notion-callout__content > .notion-semantic-string a:first-child'); //Get link object

            var linkHTML = $(link).html(); //Get contents of the link
            $(link).html(""); // Erase the contents of the link
            $(link).parent().append(linkHTML); // Add content back to callout__content

            var linkHREF = null; //Create a new variable just for the link's HREF attribute
            if ($(link).attr("href") != undefined) linkHREF = $(link).attr("href");

            //Check for SMS
            if (linkHREF.indexOf("tel:sms:") >= 0) {
                var href = linkHREF.split('tel:');
                var newHREF = href[1];
                console.log(`Link contains SMS: ${newHREF}`);
                $(link).attr("href", newHREF);
            }

            $(link).detach();
            $(link).addClass('notion-callout-link-container')
            $(callout).append(link);

            //$(link).append(callout);
        }
        else {
            $(callout).removeClass('border');
        }


        // Implement callout backgrounds
        if(map.bg.exists && map.type !== 'callout' && map.type !== 'cta-button') {
            $(callout).addClass('contains-background');

            map.bg.container = $('<div class="notion-callout__bg">');

            $(callout).append(map.bg.container);
        }
        else {
            map.bg.exists = false;
        }

        // Implement icon background
        if(map.bg.exists && map.bg.icon) {
            $(callout).addClass('contains-image');

            var image = $(callout).find('> .notion-callout__icon img')[0];

            var imageBGContainer = $('<div class="notion-callout__bg__image-icon">');
            $(map.bg.container).append(imageBGContainer);
            $(imageBGContainer).append(image);

            $(callout).find('> .notion-callout__icon').detach();
        }

        // Implement video background
        if(map.bg.exists && map.bg.embed) {
            try {
                $(callout).addClass('contains-embed');
    
                var isVideo = false;
    
                var videoBGContainer = $('<div class="notion-callout__bg__embed">');
                $(map.bg.container).append(videoBGContainer);
    
                var video = $(callout).find('.notion-callout__content > .notion-embed:nth-child(2)')[0];
    
                var videoEmbed = $(video).find('iframe')[0];
                $(videoEmbed).attr('loading','eager');
                var videoSRC = $(videoEmbed).attr('src');
    
                try {
                    if(videoSRC.indexOf('youtube') >= 0) {
                        isVideo = true;
                        var n = videoSRC.split('/embed/');
                        var m = n[1].split('?')
                        var r = m[0];
                        $(videoBGContainer).addClass('contains-video contains-youtube');
                        videoSRC = `https://www.youtube.com/embed/${r}?playlist=${r}&autohide=1&autoplay=1&controls=0&enablejsapi=1&iv_load_policy=3&loop=1&modestbranding=1&playsinline=1&rel=0&showinfo=0&wmode=opaque&widgetid=1&mute=1`;
                    }
                } catch (error) {
                    $(video).detach();
                    return;
                }
                var newEmbed = $(`<iframe src="${videoSRC}" scrolling="no" marginheight="0" marginwidth="0" type="text/html" frameborder="0" sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"></iframe>`);
                console.log('new URL: ' + videoSRC);
                
    
                $(video).detach();
                $(videoBGContainer).append(newEmbed);
    
                function videoSize() {
                    var w = $(callout).width();
                    var h = $(callout).height();
    
                    if (w > (h * 1.78)) {
                        $(newEmbed).height($(newEmbed).width() / 1.78);
                    }
                    else {
                        $(newEmbed).width(1.78 * $(newEmbed).height());
                    }
                    console.log('video resized');
                } 
                if(isVideo) {
                    $( window ).resize(function() {
                        videoSize();
                    });
                    videoSize();
                }
            }
            catch {}
        }
    }
        


    function pageInit() {
        console.log('PageInit');

        $('body').removeClass('n-contains-hero n-full-width n-normal-width n-contains-featuredmedia');

        $('body').has('div > article.notion-root.full-width').addClass('n-full-width');
        $('body').has('div > article.notion-root:not(.full-width)').addClass('n-normal-width');


        //Remove property leftovers from other pages
        if($('.notion-header__content').has('> .notion-page__properties').length) {
            $('.notion-header__content > .notion-page__properties').detach();
            $('.notion-header__content').removeClass('has-props')
        }
        //Move properties to the header
        if($('article').has('> .notion-page__properties').length) {
            var props = $('article > .notion-page__properties');
            $('.notion-header__content').addClass('has-props');
            $('.notion-header__content').append(props);
        }

        if($('body').has('.notion-navbar')) {
            console.log('has Notion navbar');
            document.documentElement.style.setProperty('--navHeight', '45px');
            document.documentElement.style.setProperty('--navScreenMargin', '0px');
        }
        
        // Turn first-child embeds into featured media
        $('article > .notion-embed:first-child').each(function() {
            $(this).addClass('n-featuredmedia');
            $('body').addClass('n-contains-featuredmedia');
        })



        //Turn first callouts into headers
        // $('body').has('article > .notion-collection:first-child').addClass('n-contains-hero');


        // Parse callous
        $('.notion-callout').each(function() {
            console.log('START CALLOUT')
            parseCallout(this);
        });

        // Call Lightbox
        lightbox();
    }

    function startMutation() {
        console.log('Starting Mutation')
        // Select the node that will be observed for mutations
        const targetNode = document.querySelector('#__next > div');

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: false, subtree: false };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            //alert('wow')
            if (!nconfig.firstLoad) {
                console.log('Mutated')
                pageInit();
            }
            /*setTimeout(function(){
                console.log('Timeout!')
            }.bind(this),100);*/
        }.bind(this);

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }

    /*
    firstInit will run the first time the domain is loaded into the DOM.
    This creates a custom nav if it needs, runs the scripts needed to format the page,
    and then starts a mutation observer to observe and dynamic changes made.
    */
    function firstInit() {
        console.log('firstInit');
        //this.loadHTML(false);
        //Add tag to HTML
        var root = document.getElementsByTagName( 'html' ); 
        root[0].setAttribute( 'class', 'modified' );
        //This ensures any styling we do only applies if JavaScript works. If it doesn't, we deault to Super's style.

        document.addEventListener('DOMContentLoaded', (event) => {

            //this.loadHTML(true);
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">')
            //this.createNav();
            pageInit();
            startMutation();

            nconfig.firstLoad = false;
        })
    }

    var equip = {
        navLinks: (l) => {
            l.forEach(element => {
                nconfig.navbar.links.push(element);
            });
        }
    }

    firstInit();
})();
