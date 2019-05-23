import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueLazyLoad from 'vue-lazyload';

import { TweenLite, TweenMax } from 'gsap/all';
import CSSPlugin from 'gsap/CSSPlugin';

const hasIntersectionObserverSupport =
  window &&
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in window.IntersectionObserverEntry.prototype;

Vue.use(VueLazyLoad, {
  lazyComponent: true,
  observer: hasIntersectionObserverSupport,
});

Vue.prototype.$gsap = {
  TweenLite,
  TweenMax,
  CSSPlugin, // to make tree-shake happy
};
