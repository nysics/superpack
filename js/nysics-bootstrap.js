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
        //var navContainer = $('<div class="n-navbar"></div>');

        console.log('Begin Navbar');
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
            console.log('Start name parse')
            console.log(siteNAMEcount);

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
                console.log(i);
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

    firstInit() {
        window.onload = (function() {
            this.createNav();
        }).bind(this)
    }

    equip = {
        navLinks: (l) => {
            console.log('wow')
            console.log(this.config.navbar.links)
            l.forEach(element => {
                this.config.navbar.links.push(element);
            });
        }
    }

    constructor() {
        //first run!
        this.firstInit();

        //var that = this;
        //Add Jquery
        /*window.onload = function() {
            if (window.jQuery) {  
                return;
            } else {
                var script = document.createElement("SCRIPT");
                script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                script.type = 'text/javascript';
                script.onload = function() {
                    var $ = window.jQuery;
                    that.firstInit();
                };
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        }*/
        console.log('running!')

        this.config.firstLoad = false;
    }
}

const ntheme = new nysicsbootstrap();
console.log(ntheme.config.firstLoad)