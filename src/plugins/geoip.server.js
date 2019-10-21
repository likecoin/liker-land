export default ({ app, store, req, res, query }) => {
  // gcloud magic geoip headers
  // https://cloud.google.com/appengine/docs/standard/go/reference/request-response-headers#app_engine-specific_headers
  const ipCountry = req.headers['x-appengine-country'];
  const ipCity = req.headers['x-appengine-city'];
  const cacheServerName = req.headers['x-forwarded-server'] || '';
  if ((ipCountry && ipCountry !== 'ZZ') || ipCity || cacheServerName) {
    const isHK =
      ipCountry === 'HK' ||
      ipCity === 'hong kong' ||
      cacheServerName.includes('HKG');
    store.dispatch('setIsHK', isHK);
  }
};
