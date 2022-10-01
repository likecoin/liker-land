import Vue from 'vue';
import VueI18n from 'vue-i18n';

// HACK: Consistent import to match require at client side for Nuxt.js
import '../plugins/ui-plugin.client';
import '../assets/css/index.scss';
import './tailwind.scss';

import en from '../locales/en.json';

Vue.use(VueI18n);

export const parameters = {
  layout: 'centered',
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [
  () => ({
    template: '<story />',
    i18n: new VueI18n({
      locale: 'en',
      messages: { en }
    })
  })
];
