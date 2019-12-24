import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueLazyLoad from 'vue-lazyload';

import {
  TweenLite,
  TweenMax,
  TimelineLite,
  TimelineMax,
  CSSPlugin,
  AttrPlugin,
} from 'gsap';

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
  TimelineLite,
  TimelineMax,

  // To make tree-shake happy
  CSSPlugin,
  AttrPlugin,
};
