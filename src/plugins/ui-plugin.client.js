import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueLazyLoad from 'vue-lazyload';

import VueAwesomeSwiper from 'vue-awesome-swiper/dist/ssr';

import { TweenLite } from 'gsap/TweenMax';

const hasIntersectionObserverSupport =
  window &&
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in window.IntersectionObserverEntry.prototype;

Vue.use(VueAwesomeSwiper);
Vue.use(VueLazyLoad, {
  lazyComponent: true,
  observer: hasIntersectionObserverSupport,
});

Vue.prototype.$gsap = {
  TweenLite,
};
