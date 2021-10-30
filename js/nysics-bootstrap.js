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

    pageInit() {
        console.log('PageInit');

        $('body').removeClass('n-contains-hero n-full-width n-normal-width');

        $('body').has('div > article.notion-root.full-width').addClass('n-full-width');
        $('body').has('div > article.notion-root:not(.full-width)').addClass('n-normal-width');

        $('body').has('article > .notion-collection').addClass('n-contains-hero');

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
        });

        //Add links to Callouts
        $('.notion-callout').has('> .notion-callout__content > .notion-semantic-string a').each(function(index) {
            $(this).addClass('contains-link');
            var link = $(this).find('> .notion-callout__content > .notion-semantic-string a'); //Get link object
            var linkHTML = $(link).html();
            $(link).html("");
            $(link).parent().append(linkHTML);
            $(link).detach();
            $(link).addClass('notion-callout-link-container')
            $(this).parent().append(link);

            $(link).append(this);

        });


        //Add images to Callouts
        var calloutCreateBG = function(self) {
            //TODO: add logic to determine if this is already here
            var container = $('<div class="notion-callout__bg">');

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

            $(video).detach();
            $(videoBGContainer).append(video);

        }

        $('.notion-callout').each(function() {
            $(this).has('.notion-callout__content > .notion-image:nth-child(2)').each(function() { calloutFixImage(this, 'image-body')});
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

    firstInit() {
        console.log('firstInit')
        //Add tag to HTML
        var root = document.getElementsByTagName( 'html' ); 
        root[0].setAttribute( 'class', 'modified' );
        //This ensures any styling we do only applies if JavaScript works. If it doesn't, we deault to Super's style.

        document.addEventListener('DOMContentLoaded', (event) => {
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
        //first run!
        this.firstInit();
        console.log('end first init')

        this.config.firstLoad = false;
    }
}

const ntheme = new nysicsbootstrap();
console.log(ntheme.config.firstLoad)