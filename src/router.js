import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/redirect',
      name: 'redirect',
      // route level code-splitting
      // this generates a separate chunk (redirect.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "redirect" */ './views/Redirect.vue'),
    },
  ],
});
