import VueRouter from 'vue-router';

let routes = [
    {
        path: '/',
        component: require('../pages/front/HomePage')
    },
    {
        path: '/home',
        component: require('../pages/front/HomePage')
    },
    {
        path: '/registratie',
        component: require('../pages/front/RegisterPage')
    },
    {
        path: '/login',
        component: require('../pages/front/LoginPage')
    },
    {
        path: '/uitleg',
        component: require('../pages/front/AboutPage')
    },
    {
        path: '/user/overzicht',
        component: require('../pages/front/DashboardPage')
    },
    {
        path: '/eten',
        component: require('../pages/front/FoodPage')
    },
    {
        path: '/vervoer',
        component: require('../pages/front/TransportPage')
    },
    {
        path: '/winkel',
        component: require('../pages/front/StorePage')
    },
    {
        path: '/:category/:slug',
        component: require('../pages/front/DetailPage')
    },
];

export default new VueRouter({
    routes
});