
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
require('./bootstrap');


import routes from './routes/routes'
import PageWrapper from './components/layout/PageWrapper'
import NavigationBar from './components/layout/NavigationBar'

Vue.component("page-wrapper",PageWrapper);
Vue.component("navigation-bar",NavigationBar);


const app = new Vue({
    el: '#app',
    router: routes
});
