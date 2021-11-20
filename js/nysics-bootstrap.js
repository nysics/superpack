class nysicsbootstrap {

    config = {
        hero: null,
        firstLoad: true,
        navbar: {
            title: false,
            links: []
        }
    }

    createNav() {
        if (document.getElementsByClassName('super-navbar').length >= 1) {
            console.log('Super Navbar is here!')
            return;
        }
        console.log('begin navbar')
        //var navContainer = $('<div class="n-navbar"></div>');

        // Create nav container
        var navContainer = document.createElement('div');
            navContainer.classList.add('n-navbar');
        
        var contentContainer = document.createElement('div');
            contentContainer.classList.add('n-navbar__content');
            navContainer.append(contentContainer);

        // Grab logo
        var siteInfo = document.getElementsByClassName('notion-breadcrumb__item')[0];
            var siteNAME = siteInfo.getElementsByClassName('notion-navbar__title')[0].innerHTML;
            var siteIMG = siteInfo.getElementsByTagName('img')[0];
            siteIMG.removeAttribute('style');
            siteIMG.removeAttribute('width');
            siteIMG.removeAttribute('height');


        //Format Title
        (() => {
            var siteNAMEcount = siteNAME.split(" ");

            var siteNameRevised = "";
            siteNAMEcount.forEach((i, x) => {
                if (x == siteNAMEcount.length/2) {
                    siteNameRevised += '<br/><span>';
                }
                siteNameRevised += i;

                if (x == siteNAMEcount.length) {
                    siteNameRevised += '</span>';
                }
                else {
                    siteNameRevised += ' ';
                }
            });
            /*for (var i = 1; i < siteNAMEcount.length; i++) {
                /*if (i == siteNAMEcountlength/2) {
                    siteNameRevised += '<br/><span>';
                }*/
                

                /*if (i == siteNAMEcountlength/2) {
                    siteNameRevised += '</span>';
                }
            }*/
            siteNAME = siteNameRevised;
        })();

        // Business name into container
        var navSiteNameContainer = document.createElement('span');
            navSiteNameContainer.setAttribute('class', 'n-navbar__sitename');
            navSiteNameContainer.innerHTML = siteNAME;

        // Logo and site name into container
        var navSiteInfo = document.createElement('div');
            navSiteInfo.classList.add('n-navbar__siteinfo');
            navSiteInfo.append(siteIMG); //Add Site Logo
            if(this.config.navbar.title) {
                navSiteInfo.append(navSiteNameContainer); //Add Site Name
            }
        //Add link to items
        var navSiteInfoA = document.createElement('a');
            navSiteInfoA.href = "/";
            navSiteInfoA.setAttribute('class', 'n-navbar__siteinfolink notion-link link');
            navSiteInfoA.append(navSiteInfo);
        


        // Divider
        var navDivider = document.createElement('div');
            navDivider.classList.add('n-navbar__divider');

        
        // Search
        //var navSearch = document.getElementsByClassName('notion-navbar__search')[0];
        //$('.notion-navbar__search').appendTo(navDivider);
        //
        // TODO: GET SEARCH WORKING
        //
            //navDivider.appendChild(navSearch);


        // LOGIC FOR ADDING LINKS

        // Function to create links
        function createLink(name, href) {
            var linkContainer = document.createElement('li');
            
            var hrefC = document.createElement('a');
                hrefC.href = href;
                hrefC.setAttribute('class', 'notion-link link')
                linkContainer.append(hrefC);

            var textContainer = document.createElement('span');
                textContainer.innerHTML = name;
                hrefC.append(textContainer);

            return linkContainer;
        }
        
        // Create link cateogry containers
        var navLinksContainer = document.createElement('ul')
            navLinksContainer.setAttribute('class','n-navbar__navlinks');

        var heroLinksContainer =  document.createElement('ul')
            heroLinksContainer.setAttribute('class','n-navbar__herolinks');

        this.config.navbar.links.forEach((l) => { //For each link, append to container.
            if(l[2]) {
                heroLinksContainer.append(createLink(l[0], l[1]));
            }
            else { navLinksContainer.append(createLink(l[0], l[1])); }
        });

        contentContainer.append(navSiteInfoA);
        contentContainer.append(navDivider);
        contentContainer.append(navLinksContainer);
        contentContainer.append(heroLinksContainer);

        document.getElementsByTagName('body')[0].prepend(navContainer);
    }

    loadHTML(t) {
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

    pageInit() {
        console.log('PageInit');

        $('body').removeClass('n-contains-hero n-full-width n-normal-width');

        $('body').has('div > article.notion-root.full-width').addClass('n-full-width');
        $('body').has('div > article.notion-root:not(.full-width)').addClass('n-normal-width');

        $('body').has('article > .notion-collection').addClass('n-contains-hero');

        //Remove property leftovers from other pages
        if($('.notion-header__content').has('> .notion-page__properties').length) {
            $('.notion-header__content > .notion-page__properties').detach();
        }
        //Move properties to the header
        if($('article').has('> .notion-page__properties').length) {
            var props = $('article > .notion-page__properties');
            $('.notion-header__content').append(props);
        }

        //Turn first callouts into headers
        if ($('article > .notion-callout:first-child').length) {
            var callout = $('article > .notion-callout:first-child');

            $('body').addClass('n-contains-hero');
            
            $(callout).addClass('n-callout-hero');

            //Check to see if there are 4 more callouts
            var searchArea = null;

            //Check to see if next set is column
            if ($(callout).next().hasClass('notion-column-list')) {

                searchArea = $(callout).next();

                if ($(searchArea).has('.notion-column > .notion-callout').length) {
                    $(searchArea).addClass('n-callout-children');
                }
            }
        }


        // Find Buttons
        var ctabuttons = $('.notion-callout:not(.bg-gray-light, .bg-brown-light, .bg-orange-light, .bg-yellow-light, .bg-green-light, .bg-blue-light, .bg-purple-light, .bg-pink-light, .bg-red-light)').each(
            function() {
            $(this).addClass('n-cta-button');

            if($(this).find('a.notion-link').length !== 0) { $(this).addClass('contains-link') }
            if($(this).find('> .notion-callout__content > .notion-semantic-string strong').length !== 0) { $(this).addClass('btn-secondary') }
                else { $(this).addClass('btn-primary')}
        });

        //Add links to Callouts
        $('.notion-callout').has('> .notion-callout__content > .notion-semantic-string a:first-child').each(function(index) {
            $(this).addClass('contains-link');
            var link = $(this).find('> .notion-callout__content > .notion-semantic-string a:first-child'); //Get link object

            var linkHTML = $(link).html();
            $(link).html("");
            $(link).parent().append(linkHTML);

            var linkHREF = "0";
            if ($(link).attr("href") != undefined) linkHREF = $(link).attr("href");
            if (linkHREF.indexOf("tel:sms:") >= 0) {
                var href = linkHREF.split('tel:');
                var newHREF = href[1];
                console.log(`Link contains SMS: ${newHREF}`);
                $(link).attr("href", newHREF);
            }

            $(link).detach();
            $(link).addClass('notion-callout-link-container')
            $(this).parent().append(link);

            $(link).append(this);

        });


        //Add images to Callouts
        var calloutCreateBG = function(self) {

            var container = null;
            if ($(self).find('.notion-callout__bg').length) {
                console.log('found bg!')
                container = $(self).find('.notion-callout__bg');
            }
            else {
                console.log('creating bg');
                container = $('<div class="notion-callout__bg">');
            }

            $(self).append(container);

            return container;
        }
        var calloutFixImage = function(self, type) {
            $(self).addClass('contains-image');

            var imageBGContainer = $('<div class="notion-callout__bg__' + type + '">');
            var imageContainer =  $(calloutCreateBG(self)).append(imageBGContainer);

            var image = null;

            if (type == 'image-body') {
                image = $(self).find('.notion-callout__content > .notion-image:nth-child(2)')[0];
            }
            else {
                image = $(self).find('.notion-callout__icon img')[0];
            }

            $(image).detach();
            $(imageBGContainer).append(image);

        }
        var calloutFixVideo = function(self) {
            $(self).addClass('contains-embed');



            var videoBGContainer = $('<div class="notion-callout__bg__embed">');
            var videoContainer =  $(calloutCreateBG(self)).append(videoBGContainer);

            var video = null;

            video = $(self).find('.notion-callout__content > .notion-embed:nth-child(2)')[0];

            var videoEmbed = $(video).find('iframe')[0];
            var videoSRC = $(videoEmbed).attr('src');
            $(video).detach();

            console.log(`videoSRC: ${videoSRC}`);
            if(videoSRC.indexOf('youtube') >= 0) {
                console.log('is youtube');
                var n = videoSRC.split('/embed/');
                var m = n[1].split('?')
                var r = m[0];
                videoSRC = `https://www.youtube.com/embed/${r}?playlist=${r}&autohide=1&autoplay=1&controls=0&enablejsapi=1&iv_load_policy=3&loop=1&modestbranding=1&playsinline=1&rel=0&showinfo=0&wmode=opaque&widgetid=1&mute=1`;
            }
            var newEmbed = $(`<iframe src="${videoSRC}" scrolling="no" marginheight="0" marginwidth="0" type="text/html" frameborder="0" sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"></iframe>`);
            console.log('new URL: ' + videoSRC);
            

            $(videoBGContainer).append(newEmbed);

        }

        $('.notion-callout').each(function() {
            //$(this).has('.notion-callout__content > .notion-image:nth-child(2)').each(function() { calloutFixImage(this, 'image-body')});
            $(this).has('.notion-callout__icon img').each(function() { calloutFixImage(this, 'image-icon')});
            $(this).has('.notion-callout__content > .notion-embed:nth-child(2)').each(function() { calloutFixVideo(this)});
        });
    }

    startMutation() {
        console.log('Starting Mutation')
        // Select the node that will be observed for mutations
        const targetNode = document.querySelector('#__next > div');

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: false, subtree: false };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            //alert('wow')
            if (!this.config.firstLoad) {
                console.log('Mutated')
                this.pageInit();
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
    firstInit() {
        console.log('firstInit');
        //this.loadHTML(false);
        //Add tag to HTML
        var root = document.getElementsByTagName( 'html' ); 
        root[0].setAttribute( 'class', 'modified' );
        //This ensures any styling we do only applies if JavaScript works. If it doesn't, we deault to Super's style.

        document.addEventListener('DOMContentLoaded', (event) => {

            //this.loadHTML(true);
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">')
            this.createNav();
            this.pageInit();
            this.startMutation();

            this.config.firstLoad = false;
        })
    }

    equip = {
        navLinks: (l) => {
            l.forEach(element => {
                this.config.navbar.links.push(element);
            });
        }
    }

    constructor() {

        //var that = this;
        //Add Jquery
        /*var init = (() => {
            console.log('init');
            this.firstInit();
        }).bind(this);
        window.onload = function() {
            if (window.jQuery) {  
                return;
            } else {
                var script = document.createElement("SCRIPT");
                script.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
                script.type = 'text/javascript';
                script.onload = function() {
                    var $ = window.jQuery;
                    init();
                }
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        }*/
        console.log('running!')
        //console.log('body: ' + body)

        //first run!
        this.firstInit();
        console.log('end first init')

        this.config.firstLoad = false;
    }
}

const ntheme = new nysicsbootstrap();
console.log(ntheme.config.firstLoad)