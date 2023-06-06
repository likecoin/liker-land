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
    template: '<div style="width:calc(100vw - 2rem);height:calc(100vh - 2rem);display:flex;flex-direction:flex-col;justify-content:center;align-items:center"><story /></div>',
    i18n: new VueI18n({
      locale: 'en',
      messages: { en }
    })
  })
];
