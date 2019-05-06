import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n';
import cookie from 'tiny-cookie';

import messages, {
  defaultLocale,
  availableLocales,
  convertLikerCoinLocale,
} from '../locales';

Vue.use(VueI18n);

export default ({ app, store, req, res, query }) => {
  let locale = defaultLocale;
  if (!process.server) {
    const { user: { user: { locale: userLocale } = {} } = {} } = store.state;
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
    let cookieLang = '';
    try {
      cookieLang = cookie.get('language');
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
    locale =
      query.language ||
      cookieLang ||
      convertLikerCoinLocale(userLocale) ||
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
