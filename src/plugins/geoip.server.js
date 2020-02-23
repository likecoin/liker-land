/**
 * Parse the accepted language header and check if the first languages are from HK
 * @param {string|undefined} acceptedLanguage Browser accepted language header
 * @returns {string|undefined}
 */
function detectHKBrowserLang(acceptedLanguage) {
  if (acceptedLanguage) {
    const langs = acceptedLanguage.split(',');
    const len = langs.length > 3 ? 3 : langs.length; // only three first browser language are important
    for (let i = 0; i < len; i += 1) {
      const pair = langs[i].split(';');
      if (pair[0].endsWith('-HK')) {
        // This check if the language is for HK region
        return 'HK';
      }
    }
  }
  return undefined;
}

export default ({ app, store, req, res, query }) => {
  // gcloud magic geoip headers
  // https://cloud.google.com/appengine/docs/standard/go/reference/request-response-headers#app_engine-specific_headers
  const ipCountry = req.headers['x-appengine-country'];
  const ipCity = req.headers['x-appengine-city'];
  const cacheServerName = req.headers['x-forwarded-server'] || '';
  const browserLanguage = detectHKBrowserLang(req.headers['accept-language']); // browser language workaround
  // Only the cache server of the HKG region causes problem to detect people from HK
  if (!cacheServerName.includes('HKG')) {
    store.dispatch(
      'setIsHK',
      ipCountry === 'HK' || browserLanguage === 'HK' || ipCity === 'hong kong'
    );
  }
};
