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

    firstInit() {
        console.log('firstInit')
        document.addEventListener('DOMContentLoaded', (event) => {
            this.createNav();
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

        this.config.firstLoad = false;
    }
}

const ntheme = new nysicsbootstrap();
console.log(ntheme.config.firstLoad)