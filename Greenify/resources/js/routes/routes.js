import VueRouter from 'vue-router';

let routes = [
    {
        path: '/',
        component: require('../pages/front/HomePage'),
        meta: {
            title: "Overzicht",
            metaTags: [
                {
                    name: "description",
                    content: "De overzicht pagina voor Greenify"
                },
                {
                    property: "og:description",
                    content: "De overzicht pagina voor Greenify"
                }
            ]
        }
    },
    {
        path: '/home',
        component: require('../pages/front/HomePage'),
        meta: {
            title: "Overzicht",
            metaTags: [
                {
                    name: "description",
                    content: "De overzicht pagina voor Greenify"
                },
                {
                    property: "og:description",
                    content: "De overzicht pagina voor Greenify"
                }
            ]
        }
    },
    {
        path: '/registratie',
        component: require('../pages/front/RegisterPage'),
        meta: {
            title: "Registreren",
            metaTags: [
                {
                    name: "description",
                    content: "De registratie pagina voor Greenify"
                },
                {
                    property: "og:description",
                    content: "De registratie pagina voor Greenify"
                }
            ]
        }

    },
    {
        path: '/login',
        component: require('../pages/front/LoginPage'),
        meta: {
            title: "Inloggen",
            metaTags: [
                {
                    name: "description",
                    content: "De login pagina voor Greenify"
                },
                {
                    property: "og:description",
                    content: "De login pagina voor Greenify"
                }
            ]
        }
    },
    {
        path: '/uitleg',
        component: require('../pages/front/AboutPage'),
        meta: {
            title: "Over Greenify",
            metaTags: [
                {
                    name: "description",
                    content: "De over ons pagina voor Greenify"
                },
                {
                    property: "og:description",
                    content: "De over ons pagina voor Greenify"
                }
            ]
        }
    },
    {
        path: '/user/overzicht',
        component: require('../pages/front/DashboardPage'),
        meta: {
            title: "Gebruiker overzicht",
            metaTags: [
                {
                    name: "description",
                    content: "De gebruiker overzicht pagina voor Greenify"
                },
                {
                    property: "og:description",
                    content: "De gebruiker overzicht pagina voor Greenify"
                }
            ]
        }
    },
    {
        path: '/eten',
        component: require('../pages/front/FoodPage'),
        meta: {
            title: "Eten overzicht",
            metaTags: [
                {
                    name: "description",
                    content: "De eten overzicht pagina voor Greenify"
                },
                {
                    property: "og:description",
                    content: "De eten overzicht pagina voor Greenify"
                }
            ]
        }
    },
    {
        path: '/vervoer',
        component: require('../pages/front/TransportPage'),
        meta: {
            title: "Vervoer overzicht",
            metaTags: [
                {
                    name: "description",
                    content: "De vervoer overzicht pagina voor Greenify"
                },
                {
                    property: "og:description",
                    content: "De vervoer overzicht pagina voor Greenify"
                }
            ]
        }
    },
    {
        path: '/winkel',
        component: require('../pages/front/StorePage'),
        meta: {
            title: "Winkels overzicht",
            metaTags: [
                {
                    name: "description",
                    content: "De winkels overzicht pagina voor Greenify"
                },
                {
                    property: "og:description",
                    content: "De winkels overzicht pagina voor Greenify"
                }
            ]
        }
    },
    {
        path: '/:category/:slug',
        component: require('../pages/front/DetailPage'),
    },
];


const router = new VueRouter({
    routes,
    // mode: 'history'
});

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
    // This goes through the matched routes from last to first, finding the closest route with a title.
    // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

    // Find the nearest route element with meta tags.
    const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
    const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

    // If a route with a title was found, set the document (page) title to that value.
    if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

    // Remove any stale meta tags from the document using the key attribute we set below.
    Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

    // Skip rendering meta tags if there are none.
    if(!nearestWithMeta) return next();

    // Turn the meta tag definitions into actual elements in the head.
    nearestWithMeta.meta.metaTags.map(tagDef => {
        const tag = document.createElement('meta');

        Object.keys(tagDef).forEach(key => {
            tag.setAttribute(key, tagDef[key]);
        });

        // We use this to track which meta tags we create, so we don't interfere with other ones.
        tag.setAttribute('data-vue-router-controlled', '');

        return tag;
    })
    // Add the meta tags to the document head.
        .forEach(tag => document.head.appendChild(tag));

    next();
});

export default router;