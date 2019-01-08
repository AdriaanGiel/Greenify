
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
require('./bootstrap');


import routes from './routes/routes'
import PageWrapper from './components/layout/PageWrapper'

Vue.component("page-wrapper",PageWrapper);

const app = new Vue({
    el: '#app',
    router: routes
});
