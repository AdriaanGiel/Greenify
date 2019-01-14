import VueRouter from 'vue-router';

import Home from '../components/views/Home'
import About from '../components/views/About'
import Register from '../components/views/Register'
import Login from '../components/views/Login'
import Dashboard from '../components/views/Dashboard'
import Detail from '../components/views/Detail'
import Category from '../components/views/Category'

let routes = [
    {
        path: '/',
        component: Home,
        meta: {
            title: "Greenify - Home",
            metaTags: [
                { name: "description", content: "De overzicht pagina voor Greenify" },
                { property: "og:description", content: "De overzicht pagina voor Greenify" }
            ]
        }
    },
    {
        path: '/home',
        component: Home,
        name: 'home',
        meta: {
            title: "Greenify - Home",
            metaTags: [
                { name: "description", content: "De overzicht pagina voor Greenify" },
                { property: "og:description", content: "De overzicht pagina voor Greenify" }
            ]
        }
    },
    {
        path: '/over-ons',
        component: About,
        name: 'about'
    },
    {
        path: '/registreren',
        component: Register,
        name: 'register',
        meta: {
            title: "Registreren",
            metaTags: [
                { name: "description", content: "De registrate pagina voor Greenify" }
            ]
        }
    },
    {
        path: '/login',
        component: Login,
        name: 'login',
        meta: {
            title: "Inloggen",
            metaTags: [
                { name: "description", content: "De login pagina voor Greenify" },
                { property: "og:description", content: "De login pagina voor Greenify"}
            ]
        }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        name: 'user_dashboard',
        meta: {
            title: "Gebruiker overzicht",
            metaTags: [
                { name: "description", content: "De gebruiker overzicht pagina voor Greenify" },
                { property: "og:description", content: "De gebruiker overzicht pagina voor Greenify" }
            ]
        }
    },
    {
        path: '/categorie/:slug',
        name: 'category',
        component: Category,
        props: true
    },
    {
        path: '/:category/:slug',
        component: Detail,
        name: 'detail',
    }
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