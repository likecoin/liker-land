import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n';

import messages, {
  defaultLocale,
  availableLocales,
  convertLikerCoinLocale,
} from '../locales';

Vue.use(VueI18n);

function getReqAcceptLangauge(req) {
  const accepts = req.acceptsLanguages();
  if (accepts && accepts.find(lang => lang.toLowerCase().includes('zh'))) {
    return 'zh-Hant'; // hack to prefer zh-Hant
  }
  return req.acceptsLanguages(availableLocales);
}

export default ({ app, store, req, query }) => {
  let locale = defaultLocale;
  if (!process.server) {
    const { user: { user: { locale: userLocale } = {} } = {} } = store.state;
    locale =
      query.language || convertLikerCoinLocale(userLocale) || defaultLocale;
    if (!availableLocales.includes(locale)) locale = defaultLocale;
  } else if (req) {
    locale = query.language || getReqAcceptLangauge(req) || defaultLocale;
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
