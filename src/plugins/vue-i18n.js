import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n';

import messages, { defaultLocale, availableLocales } from '../locales';

Vue.use(VueI18n);

export default ({ app, store, req, res, query }) => {
  let locale = defaultLocale;
  if (!process.server) {
    let navLang =
      navigator.language ||
      (navigator.languages && navigator.languages[0]) ||
      defaultLocale;
    // TODO: iterate through navigator.languages to find locale
    navLang = navLang.toLowerCase();
    availableLocales.forEach(key => {
      if (navLang.includes(key)) {
        navLang = key;
      }
    });
    locale =
      query.language ||
      (window.localStorage && window.localStorage.language) ||
      navLang ||
      defaultLocale;
    if (!availableLocales.includes(locale)) locale = defaultLocale;
  } else if (req) {
    locale =
      query.language ||
      (req.cookies && req.cookies.language) ||
      req.acceptsLanguages(availableLocales) ||
      defaultLocale;
    if (!availableLocales.includes(locale)) locale = defaultLocale;
    /* 77760000000 = 30d */
    if (req.cookies && req.cookies.language !== locale) {
      res.cookie('language', locale, { maxAge: 77760000000, secure: true });
    }
  }
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  // eslint-disable-next-line no-param-reassign
  app.i18n = new VueI18n({
    locale,
    fallbackLocale: defaultLocale,
    messages,
  });
  store.dispatch('setLocale', locale);
};
