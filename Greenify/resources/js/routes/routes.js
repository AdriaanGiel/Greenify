import VueRouter from 'vue-router';

let routes = [
    {
        path: '/',
        component: require('../pages/front/home')
    }
];

export default new VueRouter({
    routes
});