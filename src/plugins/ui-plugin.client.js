import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueLazyLoad from 'vue-lazyload';

import {
  TweenLite,
  TweenMax,
  TimelineLite,
  TimelineMax,
  CSSPlugin,
  gsap,
} from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

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

  gsap,
  // To make tree-shake happy
  CSSPlugin,
};
